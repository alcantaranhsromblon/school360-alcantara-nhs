import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Lock,
  Upload,
  AlertCircle,
  CheckCircle2,
  Calendar,
  UserCheck,
  Paperclip
} from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';
import { MonitoringRecord } from '../../types';

interface SchoolMonitoringViewProps {
  onNavigate: (view: string, subParam?: string) => void;
  onOpenLogin: () => void;
}

export const SchoolMonitoringView: React.FC<SchoolMonitoringViewProps> = ({ onNavigate, onOpenLogin }) => {
  const { isAuthenticated, currentUser, isAdmin, isTeacher } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Submit Modal
  const [submittingRecord, setSubmittingRecord] = useState<MonitoringRecord | null>(null);
  const [submissionRemarks, setSubmissionRemarks] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<string>('');
  const [notice, setNotice] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Protected School Monitoring Portal
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            School Monitoring forms, IPCRF/COT ratings, SBM compliance submissions, and accomplishment reports are strictly restricted to authenticated personnel.
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

  const monitoringRecords = store.getMonitoringRecords();
  const categories = Array.from(new Set(monitoringRecords.map(m => m.category)));

  const filtered = monitoringRecords.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      (m.remarks && m.remarks.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleOpenSubmit = (record: MonitoringRecord) => {
    setSubmittingRecord(record);
    setSubmissionRemarks(record.remarks || '');
    setAttachmentFile(record.attachmentName || '');
  };

  const handleSubmitCompliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingRecord) return;

    try {
      const updated: MonitoringRecord = {
        ...submittingRecord,
        status: isAdmin ? (submittingRecord.status === 'Submitted' ? 'Reviewed' : 'Completed') : 'Submitted',
        submittedBy: submittingRecord.submittedBy || currentUser?.fullName || 'Authorized Teacher',
        submissionDate: new Date().toISOString().split('T')[0],
        remarks: submissionRemarks || 'Submitted compliance report for review.',
        attachmentName: attachmentFile || submittingRecord.attachmentName || 'Compliance_Attachment.pdf'
      };

      store.saveMonitoringRecord(updated);
      setNotice(`Updated record "${updated.code}" successfully.`);
      setSubmittingRecord(null);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error updating record');
    }
  };

  const getStatusBadge = (status: MonitoringRecord['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">Pending Submission</span>;
      case 'Submitted':
        return <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">Submitted for Review</span>;
      case 'Reviewed':
        return <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">Reviewed / Validated</span>;
      case 'Completed':
        return <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">Completed & Compliant</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Faculty & Admin' },
          { label: 'School Monitoring', active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-8 sm:p-10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>DepEd Quality Assurance & Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            School Monitoring & Accomplishment Reports
          </h1>
          <p className="text-sm text-blue-100 font-light leading-relaxed">
            Institutional tracking for SBM validation, COT ratings, IPCRF portfolios, WinS 3-star evaluations, and DepEd Form 137 / SF10 records.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => onNavigate('admin', 'monitoring')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all self-start md:self-auto shrink-0"
          >
            Create Monitoring Form in Admin
          </button>
        )}
      </div>

      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code or title..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Submitted">Submitted</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <span>Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Monitoring Records List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No monitoring items match</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters</p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-blue-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-sm">
                    {item.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{item.category}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">SY {item.academicYear}</span>
                  {getStatusBadge(item.status)}
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {item.title}
                </h3>

                <div className="text-xs text-slate-600 leading-relaxed">
                  {item.remarks || 'No remarks added yet.'}
                </div>

                <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Compliance Deadline: <strong className="text-slate-700">{item.deadline}</strong></span>
                  </div>
                  {item.submittedBy && (
                    <div className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span>Submitted by: <strong className="text-slate-700">{item.submittedBy}</strong></span>
                    </div>
                  )}
                  {item.reviewedBy && (
                    <div className="flex items-center gap-1">
                      <span>Reviewed by: <strong className="text-slate-700">{item.reviewedBy}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action: Submit Report / Update Status */}
              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenSubmit(item)}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {isAdmin ? 'Review / Update Status' : item.status === 'Pending' ? 'Submit Compliance' : 'Update Submission'}
                  </span>
                </button>

                {item.attachmentName && (
                  <span className="text-[11px] text-blue-800 font-medium flex items-center gap-1">
                    <Paperclip className="w-3 h-3" />
                    <span className="truncate max-w-[180px]">{item.attachmentName}</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* SUBMISSION / REVIEW MODAL */}
      {submittingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-blue-950 to-blue-900 p-6 text-white">
              <div className="text-[11px] uppercase font-bold text-amber-300">
                {submittingRecord.code} · SY {submittingRecord.academicYear}
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {isAdmin ? 'Review Compliance Record' : 'Submit Accomplishment / Monitoring Report'}
              </h3>
              <p className="text-xs text-blue-200 mt-1">{submittingRecord.title}</p>
            </div>

            <form onSubmit={handleSubmitCompliance} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Submission Remarks / Accomplishment Summary
                </label>
                <textarea
                  rows={3}
                  value={submissionRemarks}
                  onChange={(e) => setSubmissionRemarks(e.target.value)}
                  placeholder="Detail completed MOVs, target indicators reached, or verification notes..."
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attached Portfolio File Name (MOV / Report)
                </label>
                <input
                  type="text"
                  value={attachmentFile}
                  onChange={(e) => setAttachmentFile(e.target.value)}
                  placeholder="e.g. COT_Cycle1_Final_Observations.xlsx"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Files are validated and secured under DepEd document retention guidelines.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmittingRecord(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold"
                >
                  {isAdmin ? 'Confirm & Save Review' : 'Submit Compliance Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
