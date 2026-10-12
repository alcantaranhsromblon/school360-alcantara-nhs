import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  AlertTriangle,
  Lock,
  Search,
  Filter,
  FileText,
  User,
  Paperclip,
  CheckCircle,
  Download
} from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';

interface SchoolUpdatesViewProps {
  onNavigate: (view: string, subParam?: string) => void;
  onOpenLogin: () => void;
}

export const SchoolUpdatesView: React.FC<SchoolUpdatesViewProps> = ({ onNavigate, onOpenLogin }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('All');

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Protected School Updates Portal
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Faculty advisory notices, emergency meeting calls, and internal announcements are restricted to authorized personnel of Alcantara National High School.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all"
            >
              Sign In with Authorized Account
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const updates = store.getSchoolUpdates();
  const audiences = Array.from(new Set(updates.map(u => u.targetAudience)));

  const filteredUpdates = updates.filter(u => {
    const matchesSearch = u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.content.toLowerCase().includes(search.toLowerCase());
    const matchesAudience = audienceFilter === 'All' || u.targetAudience === audienceFilter;
    return matchesSearch && matchesAudience;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Faculty & Admin' },
          { label: 'School Updates', active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-8 sm:p-10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Bell className="w-3.5 h-3.5" />
            <span>Internal Faculty Notices & Advisories</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            School Updates & Faculty Advisories
          </h1>
          <p className="text-sm text-blue-100 font-light leading-relaxed">
            Internal faculty communications, emergency drills, meeting calls, and administrative announcements.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => onNavigate('admin', 'updates')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all self-start md:self-auto shrink-0"
          >
            Post Update in Admin
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school updates..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Target Audience:</span>
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="All">All Audiences ({updates.length})</option>
            {audiences.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No updates found</h3>
            <p className="text-xs text-slate-400 mt-1">Check back later for newly posted faculty advisories</p>
          </div>
        ) : (
          filteredUpdates.map(upd => (
            <div
              key={upd.id}
              className={`bg-white rounded-xl border p-6 shadow-xs transition-all space-y-3 ${
                upd.priority === 'Urgent'
                  ? 'border-red-300 bg-red-50/20'
                  : upd.priority === 'High'
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm ${
                      upd.priority === 'Urgent'
                        ? 'bg-red-600 text-white'
                        : upd.priority === 'High'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {upd.priority} Priority
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                    {upd.targetAudience}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{upd.date}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {upd.title}
              </h3>

              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {upd.content}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Posted by: <strong>{upd.postedBy}</strong></span>
                </div>

                {upd.attachmentName && (
                  <button
                    type="button"
                    onClick={() => alert(`Attachment "${upd.attachmentName}" ready for secure access.`)}
                    className="inline-flex items-center gap-1.5 text-blue-800 hover:text-blue-900 font-semibold bg-blue-50 px-2.5 py-1 rounded-md text-xs self-start sm:self-auto"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-blue-700" />
                    <span>{upd.attachmentName} ({upd.attachmentSize})</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
