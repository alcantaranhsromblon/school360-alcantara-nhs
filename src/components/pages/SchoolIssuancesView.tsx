import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  Filter,
  Lock,
  ShieldCheck,
  Calendar,
  User,
  AlertCircle,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { SchoolIssuance } from '../../types';

interface SchoolIssuancesViewProps {
  onNavigate: (view: string, subParam?: string) => void;
  onOpenLogin: () => void;
}

export const SchoolIssuancesView: React.FC<SchoolIssuancesViewProps> = ({ onNavigate, onOpenLogin }) => {
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Authorization Guard
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Protected School Issuances Portal
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            School memoranda, division directives, and policy issuances of Alcantara National High School are restricted to verified faculty and administrative accounts.
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

  const issuances = store.getIssuances();
  const categories = Array.from(new Set(issuances.map(i => i.category)));

  const filteredIssuances = issuances.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.issuanceNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDownload = (id: string, title: string) => {
    try {
      const fileData = store.downloadProtectedIssuance(id);
      // Opens the document stored in the school's Google Drive
      window.open(fileData.url, '_blank', 'noopener,noreferrer');
      setDownloadNotice(`Opening "${fileData.fileName}" from the school Google Drive...`);
      setTimeout(() => setDownloadNotice(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Download error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Faculty & Admin' },
          { label: 'School Issuances', active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Faculty Document Repository</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            School Issuances & Memoranda
          </h1>
          <p className="text-sm text-blue-100 font-light leading-relaxed">
            Official executive orders, division advisories, curriculum directives, and school memoranda for Alcantara National High School.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => onNavigate('admin', 'issuances')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all self-start md:self-auto shrink-0"
          >
            Manage Issuances in Admin
          </button>
        )}
      </div>

      {downloadNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memorandum #, title, keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="All">All Categories ({issuances.length})</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Issuances Data Table / Cards */}
      <div className="space-y-4">
        {filteredIssuances.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No issuances found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or category filter</p>
          </div>
        ) : (
          filteredIssuances.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-blue-900 font-mono bg-blue-50 px-2 py-0.5 rounded-sm">
                    {item.issuanceNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {item.category}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.dateIssued}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Signatory: <strong>{item.signatory}</strong></span>
                </div>
              </div>

              {/* Action: Secure Download */}
              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDownload(item.id, item.title)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </button>
                <div className="text-[11px] text-slate-400 font-mono">
                  {item.fileType} · {item.fileSize}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
