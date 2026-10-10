/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { isSupabaseConfigured } from './lib/supabase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LoginModal } from './components/common/LoginModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Pages
import { HomeView } from './components/pages/HomeView';
import { AboutProfileView } from './components/pages/AboutProfileView';
import { AboutHistoryView } from './components/pages/AboutHistoryView';
import { DepEdView } from './components/pages/DepEdView';
import { CampusesView } from './components/pages/CampusesView';
import { NewsAchievementsView } from './components/pages/NewsAchievementsView';
import { OrgChartView } from './components/pages/OrgChartView';
import { SchoolOrganizationsView } from './components/pages/SchoolOrganizationsView';
import { SchoolIssuancesView } from './components/pages/SchoolIssuancesView';
import { SchoolUpdatesView } from './components/pages/SchoolUpdatesView';
import { SchoolMonitoringView } from './components/pages/SchoolMonitoringView';
import { AdminDashboard } from './components/admin/AdminDashboard';

function MainApp() {
  const { isAdmin, ready, dataVersion, recoveryMode, updatePassword } = useAuth();
  const [syncError, setSyncError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  useEffect(() => store.onSyncError(msg => { setSyncError(msg); }), []);

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [subParam, setSubParam] = useState<string | undefined>(undefined);

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, subParam]);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setSubParam(param);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-lg bg-white border border-red-200 rounded-2xl p-8 text-sm text-slate-700 space-y-3 shadow-sm">
          <h1 className="text-lg font-bold text-red-700">School360 is not configured</h1>
          <p>
            The environment variables <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> are missing. Add them in
            Netlify → Site configuration → Environment variables (or in a local <code>.env</code> file),
            then redeploy.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Loading School360…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {syncError && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] max-w-xl w-[92%] bg-red-600 text-white text-xs rounded-lg shadow-lg px-4 py-3 flex items-start gap-3">
          <span className="flex-1">{syncError}</span>
          <button onClick={() => setSyncError(null)} className="font-bold">✕</button>
        </div>
      )}

      {recoveryMode && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl space-y-3 text-sm">
            <h2 className="font-bold text-slate-900">Set a new password</h2>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            {pwMessage && <p className="text-xs text-red-600">{pwMessage}</p>}
            <button
              onClick={async () => {
                const res = await updatePassword(newPassword);
                if (!res.success) setPwMessage(res.error || 'Could not update password');
                else setNewPassword('');
              }}
              className="w-full py-2 bg-blue-900 text-white font-semibold rounded-lg"
            >
              Save new password
            </button>
          </div>
        </div>
      )}

      {/* If in admin view and user is admin, show the dedicated admin interface */}
      <React.Fragment key={dataVersion}>
      {currentView.startsWith('admin') && isAdmin ? (
        <AdminDashboard
          initialModule={subParam || 'overview'}
          onNavigateHome={() => handleNavigate('home')}
        />
      ) : (
        <>
          {/* Unified Global Header */}
          <Header
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenLogin={() => setLoginModalOpen(true)}
            onOpenSearch={() => setSearchModalOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {currentView === 'home' && (
              <HomeView
                onNavigate={handleNavigate}
                onOpenLogin={() => setLoginModalOpen(true)}
              />
            )}

            {currentView === 'about-profile' && (
              <AboutProfileView onNavigate={handleNavigate} />
            )}

            {currentView === 'about-history' && (
              <AboutHistoryView onNavigate={handleNavigate} />
            )}

            {currentView === 'deped-mission' && (
              <DepEdView activeSubSection="mission" onNavigate={handleNavigate} />
            )}

            {currentView === 'deped-vision' && (
              <DepEdView activeSubSection="vision" onNavigate={handleNavigate} />
            )}

            {currentView === 'deped-values' && (
              <DepEdView activeSubSection="values" onNavigate={handleNavigate} />
            )}

            {currentView === 'deped-mandate' && (
              <DepEdView activeSubSection="mandate" onNavigate={handleNavigate} />
            )}

            {currentView.startsWith('campuses') && (
              <CampusesView
                initialCampusId={subParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'news' && (
              <NewsAchievementsView
                initialTab="news"
                initialItemId={subParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'awards' && (
              <NewsAchievementsView
                initialTab="awards"
                initialItemId={subParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'programs' && (
              <NewsAchievementsView
                initialTab="programs"
                initialItemId={subParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'events' && (
              <NewsAchievementsView
                initialTab="events"
                initialItemId={subParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'gallery' && (
              <NewsAchievementsView
                initialTab="gallery"
                initialItemId={subParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'org-chart' && (
              <OrgChartView onNavigate={handleNavigate} />
            )}

            {currentView.startsWith('organization') && (
              <SchoolOrganizationsView
                initialOrgCode={subParam || 'SSLG'}
                onNavigate={handleNavigate}
              />
            )}

            {/* PROTECTED ROUTES */}
            {currentView === 'issuances' && (
              <SchoolIssuancesView
                onNavigate={handleNavigate}
                onOpenLogin={() => setLoginModalOpen(true)}
              />
            )}

            {currentView === 'updates' && (
              <SchoolUpdatesView
                onNavigate={handleNavigate}
                onOpenLogin={() => setLoginModalOpen(true)}
              />
            )}

            {currentView === 'monitoring' && (
              <SchoolMonitoringView
                onNavigate={handleNavigate}
                onOpenLogin={() => setLoginModalOpen(true)}
              />
            )}
          </main>

          {/* Unified Global Footer */}
          <Footer
            onNavigate={handleNavigate}
            onOpenLogin={() => setLoginModalOpen(true)}
          />
        </>
      )}
      </React.Fragment>

      {/* Global Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => {
          // If logged in as admin, user can choose where to go or stay on current page
        }}
      />

      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
