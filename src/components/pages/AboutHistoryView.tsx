import React from 'react';
import { History, Award, BookOpen, Flag, CheckCircle } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { store } from '../../services/store';
import { defaultHistory } from '../../data/pageDefaults';

interface AboutHistoryViewProps {
  onNavigate: (view: string, subParam?: string) => void;
}

export const AboutHistoryView: React.FC<AboutHistoryViewProps> = ({ onNavigate }) => {
  const history = store.getSchoolProfile().history ?? defaultHistory;
  const milestones = history.milestones ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'About Us' },
          { label: 'School History', active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <History className="w-3.5 h-3.5" />
            <span>Institutional Milestones</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            History of Alcantara National High School
          </h1>
          <p className="text-sm sm:text-base text-blue-100 font-light leading-relaxed">
            {history.banner}
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900">
            Chronology of Growth & Service
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {history.intro}
          </p>
        </div>

        <div className="relative border-l-2 border-blue-900/20 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8">
          {milestones.map((m, index) => (
            <div key={index} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-blue-900 border-4 border-white shadow-sm group-hover:scale-125 transition-transform" />

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 hover:border-blue-700 hover:shadow-xs transition-all">
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-900 text-amber-300 text-xs font-black font-mono">
                  {m.year}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
