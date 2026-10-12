import React, { useState } from 'react';
import { MapPin, Phone, UserCheck, Layers, BookOpen, CheckCircle, Building2, ChevronRight } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { store } from '../../services/store';
import { Campus } from '../../types';

interface CampusesViewProps {
  initialCampusId?: string;
  onNavigate: (view: string, subParam?: string) => void;
}

export const CampusesView: React.FC<CampusesViewProps> = ({ initialCampusId, onNavigate }) => {
  const campuses = store.getCampuses();
  const [selectedCampusId, setSelectedCampusId] = useState<string>(() => {
    if (initialCampusId && campuses.some(c => c.id === initialCampusId)) {
      return initialCampusId;
    }
    return campuses[0]?.id || '';
  });

  const activeCampus = campuses.find(c => c.id === selectedCampusId) || campuses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Campuses' },
          { label: activeCampus ? activeCampus.name : 'All Campuses', active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-8 sm:p-10 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Alcantara NHS Campus Network</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Campuses & Learning Centers
          </h1>
          <p className="text-sm text-blue-100 font-light leading-relaxed">
            Delivering accessible, safe, and modern secondary education across our network of campuses in the Municipality of Alcantara, Romblon.
          </p>
        </div>
      </div>

      {/* Campus Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {campuses.map(campus => (
          <button
            key={campus.id}
            onClick={() => setSelectedCampusId(campus.id)}
            className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              selectedCampusId === campus.id
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{campus.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-sm ${
              selectedCampusId === campus.id ? 'bg-blue-800 text-amber-300' : 'bg-slate-100 text-slate-500'
            }`}>
              {campus.category}
            </span>
          </button>
        ))}
      </div>

      {/* Active Campus Detailed Card */}
      {activeCampus && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Campus Photo Banner */}
            <div className="h-64 sm:h-80 relative overflow-hidden">
              <img
                src={activeCampus.imageUrl}
                alt={activeCampus.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {activeCampus.category}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {activeCampus.name}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-200 mt-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{activeCampus.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Details Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Campus Overview
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeCampus.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                {/* Programs & Grade Levels */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Programs & Curriculum Offered</span>
                  </h4>
                  <div className="text-xs text-slate-600 space-y-1.5">
                    <div className="font-semibold text-slate-800">
                      Grade Levels: {activeCampus.gradeLevels.join(', ')}
                    </div>
                    <ul className="space-y-1 pl-4 list-disc text-slate-600">
                      {activeCampus.programsOffered.map((prog, i) => (
                        <li key={i}>{prog}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Facilities & Infrastructure */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>Facilities & Learning Resources</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeCampus.facilities.map((fac, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-md flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-slate-700">{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personnel & Contact */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Campus Caretaker
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {activeCampus.headPersonnel}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Phone className="w-4 h-4 text-blue-900" />
                  <span>{activeCampus.contactNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
