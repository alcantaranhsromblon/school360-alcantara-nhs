import React, { useState } from 'react';
import {
  Users,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Briefcase,
  Filter,
  ShieldAlert,
  Edit,
  X
} from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { store } from '../../services/store';
import { OrgChartNode } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface OrgChartViewProps {
  onNavigate: (view: string, subParam?: string) => void;
}

export const OrgChartView: React.FC<OrgChartViewProps> = ({ onNavigate }) => {
  const { isAdmin } = useAuth();
  const staffList = store.getOrgChart();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedPerson, setSelectedPerson] = useState<OrgChartNode | null>(null);

  // Group by leadership hierarchy
  const principal = staffList.find(s => s.position.includes('Principal IV') || s.order === 1);
  const assistantPrincipals = staffList.filter(s => s.category === 'Executive Leadership' && s.id !== principal?.id);
  const departmentHeads = staffList.filter(s => s.category === 'Department Head');
  const teachingStaff = staffList.filter(s => s.category === 'Teaching Personnel');
  const nonTeachingStaff = staffList.filter(s => s.category === 'Non-Teaching Personnel');
  const jobOrderStaff = staffList.filter(s => s.category === 'Job Order Support');

  const departments = Array.from(new Set(staffList.map(s => s.department)));

  const filteredStaff = selectedDept === 'All'
    ? staffList
    : staffList.filter(s => s.department === selectedDept);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'School Organizational Chart', active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-8 sm:p-10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Users className="w-3.5 h-3.5" />
            <span>Staffing Structure & Governance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            School Organizational Hierarchy
          </h1>
          <p className="text-sm text-blue-100 font-light leading-relaxed">
            Official organizational chart of Alcantara National High School representing our leadership, instructional supervisors, teaching faculty, and administrative support personnel.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => onNavigate('admin', 'org-chart')}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Manage Hierarchy in Admin</span>
          </button>
        )}
      </div>

      {/* View Mode & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filter by Department / Unit:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
          >
            <option value="All">All Departments & Offices ({staffList.length})</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{filteredStaff.length}</span> positions
        </div>
      </div>

      {selectedDept === 'All' ? (
        /* HIERARCHICAL TREE VIEW */
        <div className="space-y-12">
          {/* TIER 1: School Head / Principal */}
          {principal && (
            <div className="flex flex-col items-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Executive Head of Institution
              </div>
              <div
                onClick={() => setSelectedPerson(principal)}
                className="w-full max-w-sm bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded-2xl p-6 shadow-xl border-2 border-amber-400/90 text-center cursor-pointer hover:scale-102 transition-transform relative group"
              >
                <div className="w-20 h-20 rounded-full border-2 border-amber-300 overflow-hidden mx-auto mb-3 bg-slate-800 shadow-md">
                  <img src={principal.imageUrl} alt={principal.fullName} className="w-full h-full object-cover" />
                </div>
                <div className="text-base font-extrabold text-amber-300">{principal.fullName}</div>
                <div className="text-xs font-semibold text-white mt-0.5">{principal.position}</div>
                <div className="text-[11px] text-blue-200 mt-1">{principal.department}</div>
                <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-blue-300">
                  Click to view full personnel record
                </div>
              </div>

              {/* Connecting line */}
              <div className="w-0.5 h-10 bg-slate-300 my-1" />
            </div>
          )}

          {/* TIER 2: Assistant Principals */}
          {assistantPrincipals.length > 0 && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Academic & Campus Leadership
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {assistantPrincipals.map(ap => (
                  <div
                    key={ap.id}
                    onClick={() => setSelectedPerson(ap)}
                    className="bg-white rounded-xl border-2 border-blue-200 p-5 shadow-xs hover:shadow-md hover:border-blue-700 transition-all cursor-pointer flex items-center gap-4 group"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-blue-200 shrink-0 bg-slate-100">
                      <img src={ap.imageUrl} alt={ap.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {ap.fullName}
                      </h4>
                      <p className="text-xs text-blue-800 font-semibold">{ap.position}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ap.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIER 3: Department Heads & Coordinators */}
          {departmentHeads.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Department Heads & Instructional Coordinators
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {departmentHeads.map(head => (
                  <div
                    key={head.id}
                    onClick={() => setSelectedPerson(head)}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-700 transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <img src={head.imageUrl} alt={head.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors truncate">
                        {head.fullName}
                      </h4>
                      <p className="text-[11px] text-blue-800 font-medium truncate">{head.position}</p>
                      <p className="text-[10px] text-slate-500 truncate">{head.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIER 4: Master Teachers & Faculty Members */}
          {teachingStaff.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Teaching Faculty & Master Teachers
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {teachingStaff.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedPerson(t)}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-700 transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <img src={t.imageUrl} alt={t.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors truncate">
                        {t.fullName}
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-medium truncate">{t.position}</p>
                      <p className="text-[10px] text-slate-500 truncate">{t.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TIER 5: Non-Teaching & Job Order Support */}
          {(nonTeachingStaff.length > 0 || jobOrderStaff.length > 0) && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Administrative, Finance & Support Services
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...nonTeachingStaff, ...jobOrderStaff].map(staff => (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedPerson(staff)}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-700 transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <img src={staff.imageUrl} alt={staff.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors truncate">
                        {staff.fullName}
                      </h4>
                      <p className="text-[11px] text-slate-700 font-medium truncate">{staff.position}</p>
                      <p className="text-[10px] text-slate-500 truncate">{staff.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* FILTERED LIST VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map(person => (
            <div
              key={person.id}
              onClick={() => setSelectedPerson(person)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-700 transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                <img src={person.imageUrl} alt={person.fullName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                  {person.fullName}
                </h4>
                <p className="text-xs text-blue-800 font-medium">{person.position}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{person.department}</p>
                <div className="mt-2 text-[10px] text-slate-400 uppercase font-semibold">
                  {person.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STAFF PROFILE MODAL */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-blue-950 to-blue-900 p-6 text-white text-center relative">
              <button
                onClick={() => setSelectedPerson(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-20 h-20 rounded-full border-2 border-amber-300 overflow-hidden mx-auto mb-3 shadow-md bg-slate-800">
                <img src={selectedPerson.imageUrl} alt={selectedPerson.fullName} className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-bold text-white">{selectedPerson.fullName}</h3>
              <p className="text-xs text-amber-300 font-semibold">{selectedPerson.position}</p>
              <p className="text-[11px] text-blue-200 mt-0.5">{selectedPerson.department}</p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Staff Category:</span>
                <span className="text-slate-800 font-medium">{selectedPerson.category}</span>
              </div>

              {selectedPerson.email && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-blue-900" />
                  <a href={`mailto:${selectedPerson.email}`} className="text-blue-700 hover:underline">
                    {selectedPerson.email}
                  </a>
                </div>
              )}

              {selectedPerson.phone && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-blue-900" />
                  <span>{selectedPerson.phone}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPerson(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
