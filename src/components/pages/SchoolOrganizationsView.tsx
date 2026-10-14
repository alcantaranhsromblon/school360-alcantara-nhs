import React, { useEffect, useState } from 'react';
import {
  Users,
  Award,
  Calendar,
  Bell,
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { store } from '../../services/store';
import { SchoolOrganization } from '../../types';

interface SchoolOrganizationsViewProps {
  initialOrgCode?: string;
  onNavigate: (view: string, subParam?: string) => void;
}

export const SchoolOrganizationsView: React.FC<SchoolOrganizationsViewProps> = ({
  initialOrgCode = 'SSLG',
  onNavigate
}) => {
  const orgs = store.getOrganizations().filter(o => o.isPublished !== false || store.getCurrentRole() === 'admin');
  const resolve = (key?: string) => {
    if (!key) return undefined;
    const k = key.toLowerCase();
    return (
      orgs.find(o => o.id === key) ||
      orgs.find(o => (o.code || '').toLowerCase() === k) ||
      orgs.find(o => (o.acronym || '').toLowerCase() === k)
    );
  };
  const [selectedId, setSelectedId] = useState<string>(() => resolve(initialOrgCode)?.id || orgs[0]?.id || '');

  // Re-sync when a different organization is chosen from the menu/footer/search
  useEffect(() => {
    const found = resolve(initialOrgCode);
    if (found) setSelectedId(found.id);
  }, [initialOrgCode]);

  const activeOrg = orgs.find(o => o.id === selectedId) || orgs[0];
  const objectives = activeOrg?.objectives || [];
  const activities = activeOrg?.recentActivities || [];
  const announcements = activeOrg?.announcements || [];
  const officers = activeOrg?.officers || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'School Organizations' },
          { label: activeOrg ? activeOrg.name : 'Organizations', active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-8 sm:p-10 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Users className="w-3.5 h-3.5" />
            <span>Co-Curricular & Student Leadership</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            School Organizations
          </h1>
          <p className="text-sm text-blue-100 font-light leading-relaxed">
            Fostering civic engagement, environmental stewardship, campus journalism, and cultural pride among the learners of Alcantara National High School.
          </p>
        </div>
      </div>

      {/* Organization Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {orgs.map(org => (
          <button
            key={org.id}
            onClick={() => setSelectedId(org.id)}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeOrg?.id === org.id
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{org.acronym || org.name}</span>
            {org.acronym && <span className="text-[10px] text-slate-400 hidden sm:inline">· {org.name}</span>}
          </button>
        ))}
      </div>

      {/* Organization Detail Layout */}
      {activeOrg && (
        <div className="space-y-8">
          {/* Org Hero Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-blue-900 shadow-md shrink-0 bg-blue-50">
                <img
                  src={activeOrg.logoUrl}
                  alt={activeOrg.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {activeOrg.acronym && (
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-900 text-white text-xs font-bold font-mono">
                      {activeOrg.acronym}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-medium">Official Recognized Student Organization</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {activeOrg.name}
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                  <div>
                    Faculty Adviser: <strong className="text-slate-900">{activeOrg.adviser}</strong>
                  </div>
                  <span>·</span>
                  <div>
                    Head / President: <strong className="text-slate-900">{activeOrg.presidentOrHead}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-700 leading-relaxed">
              {activeOrg.description}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Cols: Objectives & Activities */}
            <div className="lg:col-span-8 space-y-8">
              {/* Objectives */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-900" />
                  <span>Constitutional Objectives & Mandate</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {objectives.map((obj, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities & Accomplishments */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-900" />
                  <span>Recent Activities & Accomplishments</span>
                </h3>
                <div className="space-y-3">
                  {activities.map((act, i) => (
                    <div key={i} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-blue-900">{act.title}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{act.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {act.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organization Announcements */}
              {announcements.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    <span>Bulletins & Member Notices</span>
                  </h3>
                  <div className="space-y-3">
                    {announcements.map((ann, i) => (
                      <div key={i} className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                          <span>{ann.title}</span>
                          <span className="text-amber-800 font-mono text-[11px]">{ann.date}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed pt-1">
                          {ann.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Executive Officers Roster */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-900" />
                  <span>Executive Officers Roster</span>
                </h3>
                <div className="space-y-3 divide-y divide-slate-100 text-xs">
                  {officers.map((off, idx) => (
                    <div key={idx} className="pt-2.5 first:pt-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {off.position}
                      </span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        {off.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {off.gradeLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
