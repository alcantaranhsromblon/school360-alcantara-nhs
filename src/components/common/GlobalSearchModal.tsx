import React, { useState, useMemo } from 'react';
import { Search, X, FileText, Calendar, Award, Building, BookOpen, Bell, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, subParam?: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  category: string;
  module: string;
  viewTarget: string;
  subParam?: string;
  isProtected?: boolean;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { currentRole } = useAuth();
  const [query, setQuery] = useState('');

  const isTeacherOrAdmin = currentRole === 'teacher' || currentRole === 'admin';
  const isAdmin = currentRole === 'admin';

  const results = useMemo<SearchResult[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const matches: SearchResult[] = [];

    // 1. News
    const news = store.getNews(isAdmin);
    for (const item of news) {
      if (item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q)) {
        matches.push({
          id: item.id,
          title: item.title,
          snippet: item.summary,
          category: item.category,
          module: 'News & Updates',
          viewTarget: 'news-detail',
          subParam: item.id
        });
      }
    }

    // 2. Awards
    const awards = store.getAwards(isAdmin);
    for (const item of awards) {
      if (item.title.toLowerCase().includes(q) || item.recipient.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
        matches.push({
          id: item.id,
          title: item.title,
          snippet: `${item.recipient} · ${item.level} Level`,
          category: item.category,
          module: 'Awards & Recognition',
          viewTarget: 'awards',
          subParam: item.id
        });
      }
    }

    // 3. Campuses
    const campuses = store.getCampuses();
    for (const c of campuses) {
      if (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.facilities.some(f => f.toLowerCase().includes(q))) {
        matches.push({
          id: c.id,
          title: c.name,
          snippet: c.description,
          category: c.category,
          module: 'Campuses',
          viewTarget: 'campuses',
          subParam: c.id
        });
      }
    }

    // 4. Events
    const events = store.getEvents(isAdmin);
    for (const ev of events) {
      if (ev.title.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q) || ev.venue.toLowerCase().includes(q)) {
        matches.push({
          id: ev.id,
          title: ev.title,
          snippet: `${ev.date} · ${ev.venue}`,
          category: ev.category,
          module: 'Events & Activities',
          viewTarget: 'events',
          subParam: ev.id
        });
      }
    }

    // 5. School Organizations
    const orgs = store.getOrganizations();
    for (const o of orgs) {
      if (o.name.toLowerCase().includes(q) || (o.acronym || '').toLowerCase().includes(q) || o.description.toLowerCase().includes(q)) {
        matches.push({
          id: o.id,
          title: o.acronym ? `${o.name} (${o.acronym})` : o.name,
          snippet: o.description,
          category: 'Student Organization',
          module: 'School Organizations',
          viewTarget: 'organization',
          subParam: o.code
        });
      }
    }

    // 6. Organizational Chart Nodes
    const orgChart = store.getOrgChart();
    for (const person of orgChart) {
      if (person.fullName.toLowerCase().includes(q) || person.position.toLowerCase().includes(q) || person.department.toLowerCase().includes(q)) {
        matches.push({
          id: person.id,
          title: `${person.fullName} — ${person.position}`,
          snippet: `${person.department}`,
          category: person.category,
          module: 'Organizational Chart',
          viewTarget: 'org-chart'
        });
      }
    }

    // --- PROTECTED MODULES (Only if Teacher or Admin) ---
    if (isTeacherOrAdmin) {
      // Issuances
      const issuances = store.getIssuances();
      for (const iss of issuances) {
        if (iss.title.toLowerCase().includes(q) || iss.issuanceNumber.toLowerCase().includes(q) || iss.description.toLowerCase().includes(q)) {
          matches.push({
            id: iss.id,
            title: `${iss.issuanceNumber}: ${iss.title}`,
            snippet: iss.description,
            category: iss.category,
            module: 'Protected Issuances',
            viewTarget: 'issuances',
            subParam: iss.id,
            isProtected: true
          });
        }
      }

      // School Updates
      const updates = store.getSchoolUpdates();
      for (const upd of updates) {
        if (upd.title.toLowerCase().includes(q) || upd.content.toLowerCase().includes(q)) {
          matches.push({
            id: upd.id,
            title: upd.title,
            snippet: upd.content,
            category: upd.priority,
            module: 'Protected Updates',
            viewTarget: 'updates',
            subParam: upd.id,
            isProtected: true
          });
        }
      }

      // Monitoring Records
      const monitoring = store.getMonitoringRecords();
      for (const m of monitoring) {
        if (m.title.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || (m.remarks && m.remarks.toLowerCase().includes(q))) {
          matches.push({
            id: m.id,
            title: `${m.code}: ${m.title}`,
            snippet: `Status: ${m.status} · Deadline: ${m.deadline}`,
            category: m.category,
            module: 'Protected Monitoring',
            viewTarget: 'monitoring',
            subParam: m.id,
            isProtected: true
          });
        }
      }
    }

    return matches;
  }, [query, isTeacherOrAdmin, isAdmin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, events, issuances, staff, campuses, organizations..."
            autoFocus
            className="w-full text-base placeholder:text-slate-400 focus:outline-hidden text-slate-900"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scope indicator */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {isTeacherOrAdmin ? (
              <>
                <Shield className="w-3.5 h-3.5 text-blue-700" />
                <span>Searching public & authorized protected school databases</span>
              </>
            ) : (
              <span>Searching public school pages & news (Sign in for internal issuances)</span>
            )}
          </div>
          <span className="font-mono text-slate-400">{results.length} result(s)</span>
        </div>

        {/* Results listing */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {query && results.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try another keyword or check spelling</p>
            </div>
          ) : !query ? (
            <div className="p-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-600 block mb-2">Suggested queries:</span>
              <div className="flex flex-wrap gap-1.5">
                {['STE Science Fair', 'SSLG', 'Poblacion Campus', 'Teachers Day', 'Dr. Festin', isTeacherOrAdmin ? 'Mid-Year INSET' : 'DepEd Mandate'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            results.map((res) => (
              <button
                key={res.id}
                onClick={() => {
                  onNavigate(res.viewTarget, res.subParam);
                  onClose();
                }}
                className="w-full text-left p-3 hover:bg-blue-50/60 rounded-lg transition-colors flex items-start justify-between group"
              >
                <div className="pr-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
                      {res.module}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500">{res.category}</span>
                    {res.isProtected && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                        Protected
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {res.snippet}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 mt-2 transition-transform group-hover:translate-x-1" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
