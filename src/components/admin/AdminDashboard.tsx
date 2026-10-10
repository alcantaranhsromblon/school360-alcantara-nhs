import React, { useState } from 'react';
import { DriveUploadField } from '../common/DriveUploadField';
import { formatBytes } from '../../lib/driveUpload';
import {
  LayoutDashboard,
  Building,
  BookOpen,
  Award,
  FolderGit2,
  Calendar,
  Image as ImageIcon,
  Users,
  FileText,
  Bell,
  CheckSquare,
  Shield,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  ArrowLeft,
  Save,
  
  CheckCircle2,
  AlertTriangle,
  Eye,
  Archive,
  Download
} from 'lucide-react';
import { store } from '../../services/store';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  NewsItem,
  AwardItem,
  ProgramProject,
  SchoolEvent,
  GalleryAlbum,
  OrgChartNode,
  SchoolOrganization,
  SchoolIssuance,
  SchoolUpdate,
  MonitoringRecord,
  ApprovedUser,
  Campus,
  SchoolProfileData
} from '../../types';

interface AdminDashboardProps {
  initialModule?: string;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialModule = 'overview',
  onNavigateHome
}) => {
  const { isAdmin, currentUser } = useAuth();
  const [activeModule, setActiveModule] = useState<string>(initialModule);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // State caches
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfileData>(() => store.getSchoolProfile());
  const [campuses, setCampuses] = useState<Campus[]>(() => store.getCampuses());
  const [news, setNews] = useState<NewsItem[]>(() => store.getNews(true));
  const [awards, setAwards] = useState<AwardItem[]>(() => store.getAwards(true));
  const [programs, setPrograms] = useState<ProgramProject[]>(() => store.getPrograms(true));
  const [events, setEvents] = useState<SchoolEvent[]>(() => store.getEvents(true));
  const [albums, setAlbums] = useState<GalleryAlbum[]>(() => store.getAlbums(true));
  const [orgChart, setOrgChart] = useState<OrgChartNode[]>(() => store.getOrgChart());
  const [organizations, setOrganizations] = useState<SchoolOrganization[]>(() => store.getOrganizations());
  const [issuances, setIssuances] = useState<SchoolIssuance[]>(() => store.getIssuances());
  const [updates, setUpdates] = useState<SchoolUpdate[]>(() => store.getSchoolUpdates());
  const [monitoring, setMonitoring] = useState<MonitoringRecord[]>(() => store.getMonitoringRecords());
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>(() => store.getApprovedUsers());
  const [auditLogs, setAuditLogs] = useState(() => store.getAuditLogs());

  // Edit/Add modal or active item
  const [editingItem, setEditingItem] = useState<{ module: string; data: any; isNew: boolean } | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const refreshAll = () => {
    setCampuses(store.getCampuses());
    setNews(store.getNews(true));
    setAwards(store.getAwards(true));
    setPrograms(store.getPrograms(true));
    setEvents(store.getEvents(true));
    setAlbums(store.getAlbums(true));
    setOrgChart(store.getOrgChart());
    setOrganizations(store.getOrganizations());
    setIssuances(store.getIssuances());
    setUpdates(store.getSchoolUpdates());
    setMonitoring(store.getMonitoringRecords());
    setApprovedUsers(store.getApprovedUsers());
    setAuditLogs(store.getAuditLogs());
  };

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-900 space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="text-xl font-bold">Unauthorized Administrative Access</h2>
          <p className="text-sm text-red-700">
            You must be logged in as an authorized School Administrator to access the School360 administrative workspace.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2 bg-red-800 text-white text-xs font-bold rounded-lg"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // --- CRUD HELPERS ---

  // Delete generic
  const triggerDelete = (title: string, deleteCallback: () => void) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Deletion',
      message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteCallback();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        refreshAll();
        showNotification(`Deleted "${title}" successfully.`);
      }
    });
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSchoolProfile(schoolProfile);
    refreshAll();
    showNotification('School profile details updated successfully.');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Sub-bar */}
      <div className="bg-slate-900 text-white px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
            360
          </div>
          <div>
            <div className="text-xs font-extrabold tracking-wide uppercase text-amber-400">
              School360 Management Console
            </div>
            <div className="text-[11px] text-slate-300">
              Alcantara National High School · ID: 301747
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public View</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="sticky top-0 z-50 bg-emerald-600 text-white text-xs font-semibold px-6 py-2.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Admin Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Menu */}
        <aside className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-1 h-fit">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            System Modules
          </div>

          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'profile', label: 'School Profile', icon: Building },
            { id: 'campuses', label: 'Campuses', icon: Building },
            { id: 'news', label: 'News & Updates', icon: BookOpen },
            { id: 'awards', label: 'Awards & Honors', icon: Award },
            { id: 'programs', label: 'Programs & Projects', icon: FolderGit2 },
            { id: 'events', label: 'Events & Calendar', icon: Calendar },
            { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
            { id: 'org-chart', label: 'Organizational Chart', icon: Users },
            { id: 'organizations', label: 'School Organizations', icon: Users },
            { id: 'issuances', label: 'School Issuances', icon: FileText, protected: true },
            { id: 'updates', label: 'Internal Updates', icon: Bell, protected: true },
            { id: 'monitoring', label: 'School Monitoring', icon: CheckSquare, protected: true },
            { id: 'users', label: 'User Directory & Roles', icon: Shield },
            { id: 'audit', label: 'Audit Trail & Logs', icon: Activity }
          ].map(mod => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => { setActiveModule(mod.id); setEditingItem(null); }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{mod.label}</span>
                </div>
                {mod.protected && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${isActive ? 'bg-blue-800 text-amber-300' : 'bg-slate-100 text-slate-500'}`}>
                    FACULTY
                  </span>
                )}
              </button>
            );
          })}

        </aside>

        {/* Right Workspace Panel */}
        <main className="lg:col-span-9 space-y-6">
          {/* 1. OVERVIEW */}
          {activeModule === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <h2 className="text-xl font-black text-slate-900">
                  Welcome back, {currentUser?.fullName || 'Administrator'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  School360 centralized administrative control center for Alcantara National High School.
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold">Published News</div>
                  <div className="text-2xl font-black text-blue-900 font-mono mt-1">{news.length}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold">School Issuances</div>
                  <div className="text-2xl font-black text-blue-900 font-mono mt-1">{issuances.length}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold">Monitoring Items</div>
                  <div className="text-2xl font-black text-blue-900 font-mono mt-1">{monitoring.length}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold">Authorized Accounts</div>
                  <div className="text-2xl font-black text-amber-600 font-mono mt-1">{approvedUsers.length}</div>
                </div>
              </div>

              {/* Recent Audit Activities preview */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-900" />
                    <span>Recent Administrative Audit Logs</span>
                  </h3>
                  <button
                    onClick={() => setActiveModule('audit')}
                    className="text-xs text-blue-900 font-bold hover:underline"
                  >
                    View All Logs ({auditLogs.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-lg text-xs flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-900">{log.action}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-semibold text-slate-700">{log.module}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 font-mono text-[10px]">{log.itemTitle}</span>
                        </div>
                        <div className="text-slate-600">{log.details}</div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono shrink-0">
                        {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. SCHOOL PROFILE */}
          {activeModule === 'profile' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Manage School Profile Information</h2>
                <p className="text-xs text-slate-500">Update official school names, principal message, contact numbers, and demographics.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official School Name</label>
                    <input
                      type="text"
                      value={schoolProfile.schoolName}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, schoolName: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">DepEd School ID</label>
                    <input
                      type="text"
                      value={schoolProfile.schoolId}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, schoolId: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      value={schoolProfile.district}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, district: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Division</label>
                    <input
                      type="text"
                      value={schoolProfile.division}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, division: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">School Head / Principal Name</label>
                    <input
                      type="text"
                      value={schoolProfile.principalName}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, principalName: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Principal Designation</label>
                    <input
                      type="text"
                      value={schoolProfile.principalTitle}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, principalTitle: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Welcome Message from the Principal</label>
                  <textarea
                    rows={4}
                    value={schoolProfile.principalMessage}
                    onChange={(e) => setSchoolProfile({ ...schoolProfile, principalMessage: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Enrolled Learners</label>
                    <input
                      type="number"
                      value={schoolProfile.totalStudents}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, totalStudents: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Faculty Count</label>
                    <input
                      type="number"
                      value={schoolProfile.totalTeachers}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, totalTeachers: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Total Classrooms</label>
                    <input
                      type="number"
                      value={schoolProfile.totalClassrooms}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, totalClassrooms: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save School Profile</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. NEWS & UPDATES CRUD */}
          {activeModule === 'news' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Manage News & Updates</h2>
                  <p className="text-xs text-slate-500">Add, edit, publish, or delete school articles.</p>
                </div>
                <button
                  onClick={() => setEditingItem({
                    module: 'news',
                    isNew: true,
                    data: {
                      id: 'news-' + Date.now(),
                      title: '',
                      slug: '',
                      category: 'Academic',
                      summary: '',
                      content: '',
                      author: currentUser?.fullName || 'School Admin',
                      publishedDate: new Date().toISOString().split('T')[0],
                      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
                      isPublished: true,
                      featured: false,
                      tags: ['AlcantaraNHS']
                    }
                  })}
                  className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add News Article</span>
                </button>
              </div>

              <div className="space-y-3">
                {news.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-bold text-blue-900">{item.category}</span>
                        <span>·</span>
                        <span className="text-slate-400">{item.publishedDate}</span>
                        <span>·</span>
                        <span className={item.isPublished ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                          {item.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{item.summary}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingItem({ module: 'news', isNew: false, data: { ...item } })}
                        className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-200 rounded-md"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => triggerDelete(item.title, () => store.deleteNews(item.id))}
                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SCHOOL ISSUANCES CRUD */}
          {activeModule === 'issuances' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Manage School Issuances & Directives</h2>
                  <p className="text-xs text-slate-500">Protected memoranda, division advisories, and document uploads.</p>
                </div>
                <button
                  onClick={() => setEditingItem({
                    module: 'issuances',
                    isNew: true,
                    data: {
                      id: 'memo-' + Date.now(),
                      issuanceNumber: `School Memo No. ${Math.floor(Math.random() * 50) + 1}, s. 2026`,
                      title: '',
                      dateIssued: new Date().toISOString().split('T')[0],
                      category: 'School Memorandum',
                      description: '',
                      signatory: 'Dr. Rodolfo M. Festin, Secondary School Principal IV',
                      fileName: 'Document_Download.pdf',
                      fileSize: '1.2 MB',
                      fileType: 'PDF',
                      downloadUrl: '',
                      isArchived: false
                    }
                  })}
                  className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Memorandum</span>
                </button>
              </div>

              <div className="space-y-3">
                {issuances.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-mono font-bold text-blue-900">{item.issuanceNumber}</span>
                        <span>·</span>
                        <span className="text-slate-500">{item.category}</span>
                        <span>·</span>
                        <span className="text-slate-400">{item.dateIssued}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <div className="text-xs text-slate-400 font-mono">
                        {item.fileName} ({item.fileSize}) · Signatory: {item.signatory}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingItem({ module: 'issuances', isNew: false, data: { ...item } })}
                        className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-200 rounded-md"
                        title="Edit Memorandum"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => triggerDelete(item.issuanceNumber, () => store.deleteIssuance(item.id))}
                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                        title="Delete Memorandum"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. USER DIRECTORY & ROLES */}
          {activeModule === 'users' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Approved Faculty Directory & Role Authorization</h2>
                  <p className="text-xs text-slate-500">
                    Only email addresses listed here can obtain Teacher or Administrator privileges upon authentication.
                  </p>
                </div>
                <button
                  onClick={() => setEditingItem({
                    module: 'users',
                    isNew: true,
                    data: {
                      id: 'appr-' + Date.now(),
                      email: '',
                      fullName: '',
                      intendedRole: 'teacher',
                      department: 'Junior High School Faculty',
                      status: 'approved',
                      addedBy: currentUser?.fullName || 'Administrator',
                      addedAt: new Date().toISOString().split('T')[0]
                    }
                  })}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Authorize New Email</span>
                </button>
              </div>

              <div className="space-y-3">
                {approvedUsers.map(u => (
                  <div key={u.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-900">{u.fullName}</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] uppercase font-bold ${
                          u.intendedRole === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {u.intendedRole}
                        </span>
                      </div>
                      <div className="text-xs text-blue-900 font-mono">{u.email}</div>
                      <div className="text-[11px] text-slate-400">
                        {u.department} · Added by {u.addedBy} on {u.addedAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => triggerDelete(u.email, () => store.deleteApprovedUser(u.id))}
                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                        title="Revoke Authorization"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. AUDIT TRAIL */}
          {activeModule === 'audit' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Security Audit Logs & Compliance Trail</h2>
                <p className="text-xs text-slate-500">
                  Read-only chronological audit log of all administrative creations, edits, deletions, and protected downloads.
                </p>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <div key={log.id} className="pt-3 pb-2 text-xs flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded ${
                          log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-900' :
                          log.action === 'DELETE' ? 'bg-red-100 text-red-900' :
                          log.action === 'UPDATE' ? 'bg-blue-100 text-blue-900' :
                          'bg-amber-100 text-amber-900'
                        }`}>
                          {log.action}
                        </span>
                        <span className="font-bold text-slate-800">{log.module}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-medium">{log.itemTitle}</span>
                      </div>
                      <div className="text-slate-600">{log.details}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        User: {log.actorEmail} ({log.actorRole})
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono shrink-0">
                      {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER MODULE PLACEHOLDERS / FORMS */}
          {['campuses', 'awards', 'programs', 'events', 'gallery', 'org-chart', 'organizations', 'updates', 'monitoring'].includes(activeModule) && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 capitalize">
                    Manage {activeModule.replace('-', ' ')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add, edit, rearrange, or delete items in this module.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (activeModule === 'campuses') {
                      setEditingItem({
                        module: 'campuses',
                        isNew: true,
                        data: {
                          id: 'campus-' + Date.now(),
                          name: 'New Campus Branch',
                          category: 'Annex / Extension',
                          address: 'Alcantara, Romblon',
                          description: 'Description of the campus...',
                          imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
                          gradeLevels: ['Grade 7', 'Grade 8'],
                          programsOffered: ['General Basic Education'],
                          facilities: ['Classrooms', 'Activity Area'],
                          headPersonnel: 'Teacher-in-Charge',
                          contactNumber: '+63 917 000 0000',
                          isActive: true
                        }
                      });
                    } else if (activeModule === 'awards') {
                      setEditingItem({
                        module: 'awards',
                        isNew: true,
                        data: {
                          id: 'award-' + Date.now(),
                          title: '',
                          recipient: '',
                          level: 'Division',
                          dateAwarded: new Date().toISOString().split('T')[0],
                          category: 'Academic',
                          description: '',
                          imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
                          isPublished: true
                        }
                      });
                    } else if (activeModule === 'programs') {
                      setEditingItem({
                        module: 'programs',
                        isNew: true,
                        data: {
                          id: 'prog-' + Date.now(),
                          title: '',
                          status: 'Ongoing',
                          leadOffice: 'Office of the Principal',
                          objectives: '',
                          description: '',
                          outcomes: '',
                          startDate: new Date().toISOString().split('T')[0],
                          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
                          isPublished: true
                        }
                      });
                    } else if (activeModule === 'events') {
                      setEditingItem({
                        module: 'events',
                        isNew: true,
                        data: {
                          id: 'event-' + Date.now(),
                          title: '',
                          date: new Date().toISOString().split('T')[0],
                          time: '08:00 AM - 12:00 PM',
                          venue: 'Alcantara NHS Gymnasium',
                          status: 'Upcoming',
                          category: 'Academic',
                          description: '',
                          imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
                          isPublished: true
                        }
                      });
                    } else if (activeModule === 'org-chart') {
                      setEditingItem({
                        module: 'org-chart',
                        isNew: true,
                        data: {
                          id: 'org-' + Date.now(),
                          fullName: '',
                          position: '',
                          category: 'Teaching Personnel',
                          department: 'Faculty Department',
                          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                          order: orgChart.length + 1
                        }
                      });
                    } else if (activeModule === 'organizations') {
                      setEditingItem({
                        module: 'organizations',
                        isNew: true,
                        data: {
                          id: 'orgz-' + Date.now(),
                          code: 'NEW_ORG',
                          name: '',
                          acronym: '',
                          description: '',
                          objectives: [],
                          adviser: '',
                          presidentOrHead: '',
                          logoUrl: '',
                          officers: [],
                          recentActivities: [],
                          announcements: [],
                          isPublished: true
                        }
                      });
                    } else if (activeModule === 'updates') {
                      setEditingItem({
                        module: 'updates',
                        isNew: true,
                        data: {
                          id: 'upd-' + Date.now(),
                          title: '',
                          date: new Date().toISOString().split('T')[0],
                          priority: 'Normal',
                          targetAudience: 'All Faculty',
                          content: '',
                          postedBy: currentUser?.fullName || 'Office of the Principal',
                          isArchived: false
                        }
                      });
                    } else if (activeModule === 'monitoring') {
                      setEditingItem({
                        module: 'monitoring',
                        isNew: true,
                        data: {
                          id: 'mon-' + Date.now(),
                          title: '',
                          code: 'MON-2026-NEW',
                          category: 'IPCRF/OPCRF',
                          deadline: new Date().toISOString().split('T')[0],
                          status: 'Pending',
                          academicYear: '2026-2027',
                          remarks: ''
                        }
                      });
                    }
                  }}
                  className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Record</span>
                </button>
              </div>

              {/* Listing preview for this module */}
              <div className="space-y-3">
                {activeModule === 'campuses' && campuses.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{c.name} ({c.category})</h4>
                      <p className="text-xs text-slate-500">{c.address} · Head: {c.headPersonnel}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ module: 'campuses', isNew: false, data: { ...c } })} className="p-1.5 hover:bg-slate-200 rounded">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button onClick={() => triggerDelete(c.name, () => store.deleteCampus(c.id))} className="p-1.5 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {activeModule === 'awards' && awards.map(a => (
                  <div key={a.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                      <p className="text-xs text-slate-500">{a.recipient} · {a.level} Level</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ module: 'awards', isNew: false, data: { ...a } })} className="p-1.5 hover:bg-slate-200 rounded">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button onClick={() => triggerDelete(a.title, () => store.deleteAward(a.id))} className="p-1.5 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {activeModule === 'programs' && programs.map(p => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{p.title} ({p.status})</h4>
                      <p className="text-xs text-slate-500">Lead: {p.leadOffice}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ module: 'programs', isNew: false, data: { ...p } })} className="p-1.5 hover:bg-slate-200 rounded">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button onClick={() => triggerDelete(p.title, () => store.deleteProgram(p.id))} className="p-1.5 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {activeModule === 'events' && events.map(ev => (
                  <div key={ev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{ev.title} ({ev.date})</h4>
                      <p className="text-xs text-slate-500">{ev.venue} · {ev.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ module: 'events', isNew: false, data: { ...ev } })} className="p-1.5 hover:bg-slate-200 rounded">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button onClick={() => triggerDelete(ev.title, () => store.deleteEvent(ev.id))} className="p-1.5 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {activeModule === 'org-chart' && orgChart.map(person => (
                  <div key={person.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                        <img src={person.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{person.fullName}</h4>
                        <p className="text-xs text-slate-500">{person.position} · {person.department}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ module: 'org-chart', isNew: false, data: { ...person } })} className="p-1.5 hover:bg-slate-200 rounded">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button onClick={() => triggerDelete(person.fullName, () => store.deleteOrgChartNode(person.id))} className="p-1.5 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {activeModule === 'organizations' && organizations.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    No school organizations yet. Click <b>Add New Record</b> to create the first one (e.g. SSLG, YES-O, The Beacon).
                  </div>
                )}

                {activeModule === 'organizations' && organizations.map(o => (
                  <div key={o.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0">
                        {o.logoUrl ? <img src={o.logoUrl} alt="" className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-slate-400" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {o.name} {o.acronym ? `(${o.acronym})` : ''} {!o.isPublished && <span className="ml-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Hidden</span>}
                        </h4>
                        <p className="text-xs text-slate-500">Adviser: {o.adviser || '—'} · Head: {o.presidentOrHead || '—'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ module: 'organizations', isNew: false, data: JSON.parse(JSON.stringify(o)) })} className="p-1.5 hover:bg-slate-200 rounded">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button onClick={() => triggerDelete(o.name, () => store.deleteOrganization(o.id))} className="p-1.5 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {activeModule === 'updates' && updates.map(u => (
                  <div key={u.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{u.title} ({u.priority})</h4>
                      <p className="text-xs text-slate-500">{u.date} · For: {u.targetAudience}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ module: 'updates', isNew: false, data: { ...u } })} className="p-1.5 hover:bg-slate-200 rounded">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button onClick={() => triggerDelete(u.title, () => store.deleteSchoolUpdate(u.id))} className="p-1.5 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {activeModule === 'monitoring' && monitoring.map(m => (
                  <div key={m.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{m.code}: {m.title}</h4>
                      <p className="text-xs text-slate-500">Status: {m.status} · Deadline: {m.deadline}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem({ module: 'monitoring', isNew: false, data: { ...m } })} className="p-1.5 hover:bg-slate-200 rounded">
                        <Edit2 className="w-4 h-4 text-slate-600" />
                      </button>
                      <button onClick={() => triggerDelete(m.title, () => store.deleteMonitoringRecord(m.id))} className="p-1.5 hover:bg-red-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EDIT / CREATE GENERIC MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                {editingItem.isNew ? 'Create New' : 'Edit Record'} · {editingItem.module}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Form fields based on editingItem.module */}
              {editingItem.module === 'news' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Article Title</label>
                    <input
                      type="text"
                      value={editingItem.data.title}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={editingItem.data.category}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, category: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option>Academic</option>
                      <option>DepEd Advisory</option>
                      <option>Sports</option>
                      <option>Community</option>
                      <option>Extracurricular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Summary / Lead</label>
                    <textarea
                      rows={2}
                      value={editingItem.data.summary}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, summary: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Article Content</label>
                    <textarea
                      rows={5}
                      value={editingItem.data.content}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, content: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <DriveUploadField
                    label="Cover image"
                    showPreview
                    value={editingItem.data.imageUrl}
                    onChange={(url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: url } })}
                  />
                </>
              )}

              {editingItem.module === 'issuances' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Issuance Number</label>
                    <input
                      type="text"
                      value={editingItem.data.issuanceNumber}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, issuanceNumber: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Memorandum Title</label>
                    <input
                      type="text"
                      value={editingItem.data.title}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={editingItem.data.category}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, category: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option>School Memorandum</option>
                      <option>Division Advisory</option>
                      <option>DepEd Order</option>
                      <option>Internal Directive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description & Guidelines</label>
                    <textarea
                      rows={3}
                      value={editingItem.data.description}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Attached PDF File Name</label>
                    <input
                      type="text"
                      value={editingItem.data.fileName}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, fileName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <DriveUploadField
                    label="Document file (stored in school Google Drive)"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    hint="Upload the PDF/Word/Excel file, or paste an existing Google Drive link."
                    value={editingItem.data.downloadUrl || ''}
                    onChange={(url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, downloadUrl: url } })}
                    onUploaded={(info) => {
                      const ext = info.name.split('.').pop()?.toLowerCase() || '';
                      const fileType = ext.startsWith('xls') ? 'XLSX' : ext.startsWith('doc') ? 'DOCX' : 'PDF';
                      setEditingItem(prev => prev && ({
                        ...prev,
                        data: { ...prev.data, downloadUrl: info.viewUrl, fileName: info.name, fileSize: formatBytes(info.size), fileType },
                      }));
                    }}
                  />
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Authorized Signatory</label>
                    <input
                      type="text"
                      value={editingItem.data.signatory}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, signatory: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {editingItem.module === 'users' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editingItem.data.fullName}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, fullName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">DepEd Email Address</label>
                    <input
                      type="email"
                      value={editingItem.data.email}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Authorized Role</label>
                    <select
                      value={editingItem.data.intendedRole}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, intendedRole: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="teacher">Teacher (Faculty Access to Issuances & Monitoring)</option>
                      <option value="admin">Administrator (Full Dashboard & CMS Control)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={editingItem.data.department}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, department: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {editingItem.module === 'org-chart' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Personnel Full Name</label>
                    <input
                      type="text"
                      value={editingItem.data.fullName}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, fullName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <DriveUploadField
                    label="Photo"
                    showPreview
                    value={editingItem.data.imageUrl}
                    onChange={(url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: url } })}
                  />
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Position</label>
                    <input
                      type="text"
                      value={editingItem.data.position}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, position: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hierarchy Category</label>
                    <select
                      value={editingItem.data.category}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, category: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option>Executive Leadership</option>
                      <option>Department Head</option>
                      <option>Teaching Personnel</option>
                      <option>Non-Teaching Personnel</option>
                      <option>Job Order Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department / Office</label>
                    <input
                      type="text"
                      value={editingItem.data.department}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, department: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {editingItem.module === 'organizations' && (() => {
                const d = editingItem.data;
                const set = (patch: any) => setEditingItem({ ...editingItem, data: { ...d, ...patch } });
                const inp = 'w-full px-3 py-2 border border-slate-300 rounded-lg';
                const lbl = 'block font-bold text-slate-700 mb-1';
                const rowBtn = 'text-[11px] font-semibold text-red-600 hover:text-red-700';
                const addBtn = 'text-[11px] font-bold text-blue-900 hover:text-blue-700';
                const officers: any[] = d.officers || [];
                const acts: any[] = d.recentActivities || [];
                const anns: any[] = d.announcements || [];
                const upd = (key: string, list: any[], i: number, patch: any) =>
                  set({ [key]: list.map((x, idx) => (idx === i ? { ...x, ...patch } : x)) });
                const del = (key: string, list: any[], i: number) =>
                  set({ [key]: list.filter((_, idx) => idx !== i) });
                return (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={lbl}>Organization Name</label>
                        <input type="text" value={d.name || ''} onChange={(e) => set({ name: e.target.value })} className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>Acronym</label>
                        <input type="text" value={d.acronym || ''} onChange={(e) => set({ acronym: e.target.value })} className={inp} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Code (short unique ID, e.g. SSLG)</label>
                      <input type="text" value={d.code || ''} onChange={(e) => set({ code: e.target.value })} className={inp + ' font-mono'} />
                    </div>
                    <div>
                      <label className={lbl}>Description</label>
                      <textarea rows={3} value={d.description || ''} onChange={(e) => set({ description: e.target.value })} className={inp} />
                    </div>
                    <div>
                      <label className={lbl}>Objectives (one per line)</label>
                      <textarea rows={4} value={(d.objectives || []).join('\n')} onChange={(e) => set({ objectives: e.target.value.split('\n') })} className={inp} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={lbl}>Adviser</label>
                        <input type="text" value={d.adviser || ''} onChange={(e) => set({ adviser: e.target.value })} className={inp} />
                      </div>
                      <div>
                        <label className={lbl}>President / Head</label>
                        <input type="text" value={d.presidentOrHead || ''} onChange={(e) => set({ presidentOrHead: e.target.value })} className={inp} />
                      </div>
                    </div>
                    <DriveUploadField
                      label="Logo"
                      showPreview
                      value={d.logoUrl || ''}
                      onChange={(url) => set({ logoUrl: url })}
                    />

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700">Officers</label>
                        <button type="button" className={addBtn} onClick={() => set({ officers: [...officers, { position: '', name: '', gradeLevel: '' }] })}>+ Add officer</button>
                      </div>
                      {officers.map((o, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 items-center">
                          <input placeholder="Position" value={o.position} onChange={(e) => upd('officers', officers, i, { position: e.target.value })} className={inp + ' col-span-4'} />
                          <input placeholder="Name" value={o.name} onChange={(e) => upd('officers', officers, i, { name: e.target.value })} className={inp + ' col-span-4'} />
                          <input placeholder="Grade" value={o.gradeLevel} onChange={(e) => upd('officers', officers, i, { gradeLevel: e.target.value })} className={inp + ' col-span-3'} />
                          <button type="button" className={rowBtn + ' col-span-1'} onClick={() => del('officers', officers, i)}>✕</button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700">Recent Activities</label>
                        <button type="button" className={addBtn} onClick={() => set({ recentActivities: [...acts, { title: '', date: new Date().toISOString().split('T')[0], description: '' }] })}>+ Add activity</button>
                      </div>
                      {acts.map((a, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                          <div className="grid grid-cols-12 gap-2">
                            <input placeholder="Title" value={a.title} onChange={(e) => upd('recentActivities', acts, i, { title: e.target.value })} className={inp + ' col-span-7'} />
                            <input type="date" value={a.date} onChange={(e) => upd('recentActivities', acts, i, { date: e.target.value })} className={inp + ' col-span-5'} />
                          </div>
                          <textarea rows={2} placeholder="Description" value={a.description} onChange={(e) => upd('recentActivities', acts, i, { description: e.target.value })} className={inp} />
                          <button type="button" className={rowBtn} onClick={() => del('recentActivities', acts, i)}>Remove</button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700">Announcements</label>
                        <button type="button" className={addBtn} onClick={() => set({ announcements: [...anns, { title: '', date: new Date().toISOString().split('T')[0], content: '' }] })}>+ Add announcement</button>
                      </div>
                      {anns.map((a, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                          <div className="grid grid-cols-12 gap-2">
                            <input placeholder="Title" value={a.title} onChange={(e) => upd('announcements', anns, i, { title: e.target.value })} className={inp + ' col-span-7'} />
                            <input type="date" value={a.date} onChange={(e) => upd('announcements', anns, i, { date: e.target.value })} className={inp + ' col-span-5'} />
                          </div>
                          <textarea rows={2} placeholder="Content" value={a.content} onChange={(e) => upd('announcements', anns, i, { content: e.target.value })} className={inp} />
                          <button type="button" className={rowBtn} onClick={() => del('announcements', anns, i)}>Remove</button>
                        </div>
                      ))}
                    </div>

                    <label className="flex items-center gap-2 pt-2 border-t border-slate-100 text-slate-700 font-semibold">
                      <input type="checkbox" checked={d.isPublished !== false} onChange={(e) => set({ isPublished: e.target.checked })} />
                      Published (visible on the public website)
                    </label>
                  </>
                );
              })()}

              {/* General fallback save for other entities */}
              {!['news', 'issuances', 'users', 'org-chart', 'organizations'].includes(editingItem.module) && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title / Name</label>
                  <input
                    type="text"
                    value={editingItem.data.title || editingItem.data.name || ''}
                    onChange={(e) => {
                      const key = editingItem.data.title !== undefined ? 'title' : 'name';
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, [key]: e.target.value }
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              {!['news', 'issuances', 'users', 'org-chart', 'organizations'].includes(editingItem.module) && editingItem.data.imageUrl !== undefined && (
                <DriveUploadField
                  label="Image"
                  showPreview
                  value={editingItem.data.imageUrl}
                  onChange={(url) => setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: url } })}
                />
              )}
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    if (editingItem.module === 'news') {
                      store.saveNews(editingItem.data);
                    } else if (editingItem.module === 'issuances') {
                      store.saveIssuance(editingItem.data);
                    } else if (editingItem.module === 'users') {
                      store.saveApprovedUser(editingItem.data);
                    } else if (editingItem.module === 'campuses') {
                      store.saveCampus(editingItem.data);
                    } else if (editingItem.module === 'awards') {
                      store.saveAward(editingItem.data);
                    } else if (editingItem.module === 'programs') {
                      store.saveProgram(editingItem.data);
                    } else if (editingItem.module === 'events') {
                      store.saveEvent(editingItem.data);
                    } else if (editingItem.module === 'org-chart') {
                      store.saveOrgChartNode(editingItem.data);
                    } else if (editingItem.module === 'organizations') {
                      const o = editingItem.data;
                      if (!o.name?.trim()) throw new Error('Organization name is required.');
                      store.saveOrganization({
                        ...o,
                        code: (o.code || o.acronym || o.name).trim(),
                        objectives: (o.objectives || []).map((x: string) => x.trim()).filter(Boolean),
                      });
                    } else if (editingItem.module === 'updates') {
                      store.saveSchoolUpdate(editingItem.data);
                    } else if (editingItem.module === 'monitoring') {
                      store.saveMonitoringRecord(editingItem.data);
                    }
                    refreshAll();
                    setEditingItem(null);
                    showNotification(`Saved ${editingItem.module} record successfully.`);
                  } catch (err: any) {
                    alert(err.message || 'Error saving');
                  }
                }}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
