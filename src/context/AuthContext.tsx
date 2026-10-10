import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../types';
import { store } from '../services/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type Result = { success: boolean; error?: string; message?: string };

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  /** false until the first session check + data load has finished */
  ready: boolean;
  /** increments every time store data is reloaded (use as a React key) */
  dataVersion: number;
  recoveryMode: boolean;
  login: (email: string, password: string) => Promise<Result>;
  logout: () => Promise<void>;
  registerAccount: (fullName: string, email: string, password: string) => Promise<Result>;
  requestPasswordReset: (email: string) => Promise<Result>;
  updatePassword: (newPassword: string) => Promise<Result>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfile = (r: any): UserProfile => ({
  id: r.id,
  email: r.email,
  fullName: r.full_name,
  role: r.role,
  department: r.department ?? undefined,
  position: r.position ?? undefined,
  employeeId: r.employee_id ?? undefined,
  avatarUrl: r.avatar_url ?? undefined,
  isActive: r.is_active,
  createdAt: r.created_at,
  lastLogin: r.last_login ?? undefined,
});

async function loadProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error || !data || !data.is_active) return null;
  return mapProfile(data);
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const [recoveryMode, setRecoveryMode] = useState(false);

  /** Resolve the profile for a session, reload store data for that role, update UI. */
  const syncSession = useCallback(async (session: Session | null): Promise<UserProfile | null> => {
    const user = session?.user ? await loadProfile(session.user.id) : null;
    store.setCurrentUser(user);
    await store.hydrate();
    setCurrentUser(user);
    setDataVersion(v => v + 1);
    return user;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }
    let cancelled = false;

    supabase.auth.getSession()
      .then(({ data }) => syncSession(data.session))
      .catch(e => console.error('[School360] session init failed:', e))
      .finally(() => { if (!cancelled) setReady(true); });

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      // Never await Supabase calls directly inside this callback (can deadlock) — defer.
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
      if (event === 'SIGNED_OUT') setTimeout(() => { void syncSession(null); }, 0);
    });

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, [syncSession]);

  const currentRole: UserRole = currentUser ? currentUser.role : 'public';

  const login = async (email: string, password: string): Promise<Result> => {
    const trimmed = email.toLowerCase().trim();
    if (!password) return { success: false, error: 'Please enter your password.' };

    const { data, error } = await supabase.auth.signInWithPassword({ email: trimmed, password });
    if (error) {
      const msg = error.message || '';
      if (/invalid login/i.test(msg)) {
        return { success: false, error: 'Incorrect email or password. If this is your first time, use the "Verify Authorized Email" tab to create your password.' };
      }
      if (/not confirmed/i.test(msg)) {
        return { success: false, error: 'Please confirm your email first — check your inbox for the confirmation link.' };
      }
      return { success: false, error: msg };
    }

    const user = await syncSession(data.session);
    if (!user) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'This account is not active on the approved faculty/administrator roster. Please contact the School ICT Coordinator.',
      };
    }
    void supabase.rpc('touch_login');
    store.recordSessionEvent('LOGIN', user);
    return { success: true };
  };

  const registerAccount = async (fullName: string, email: string, password: string): Promise<Result> => {
    const trimmed = email.toLowerCase().trim();
    if (!password || password.length < 8) {
      return { success: false, error: 'Please choose a password with at least 8 characters.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: trimmed,
      password,
      options: { data: { full_name: fullName.trim() }, emailRedirectTo: window.location.origin },
    });

    if (error) {
      if (/database error|EMAIL_NOT_APPROVED/i.test(error.message)) {
        return {
          success: false,
          error: `Registration Blocked: "${email}" is not on the authorized roster of Alcantara National High School (ID 301747). Ask the School ICT Coordinator to add your email first.`,
        };
      }
      return { success: false, error: error.message };
    }

    if (data.session) {
      const user = await syncSession(data.session);
      if (user) {
        void supabase.rpc('touch_login');
        store.recordSessionEvent('LOGIN', user);
        return { success: true, message: 'Eligibility confirmed! Account created and activated.' };
      }
    }
    return {
      success: true,
      message: 'Account created. Please check your email inbox and click the confirmation link, then sign in.',
    };
  };

  const logout = async () => {
    const user = store.getCurrentUser();
    if (user) store.recordSessionEvent('LOGOUT', user);
    await supabase.auth.signOut();
    await syncSession(null);
  };

  const requestPasswordReset = async (email: string): Promise<Result> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
      redirectTo: window.location.origin,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, message: 'If that email is registered, a password reset link has been sent.' };
  };

  const updatePassword = async (newPassword: string): Promise<Result> => {
    if (newPassword.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    setRecoveryMode(false);
    const { data } = await supabase.auth.getSession();
    await syncSession(data.session);
    return { success: true, message: 'Password updated.' };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: !!currentUser,
        isAdmin: currentRole === 'admin',
        isTeacher: currentRole === 'teacher',
        ready,
        dataVersion,
        recoveryMode,
        login,
        logout,
        registerAccount,
        requestPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
