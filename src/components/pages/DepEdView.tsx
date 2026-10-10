import React from 'react';
import { Shield, Sparkles, Heart, Globe, Users, BookOpen, CheckCircle, Flag } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { store } from '../../services/store';
import { defaultDeped, paragraphs } from '../../data/pageDefaults';

/** Renders **bold** markers inside admin-edited text. */
const Rich: React.FC<{ text: string }> = ({ text }) => (
  <>{text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <React.Fragment key={i}>{part}</React.Fragment>
  )}</>
);

const valueStyles = [
  { card: 'bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-200', badge: 'bg-blue-900 text-amber-300', title: 'text-blue-950' },
  { card: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200', badge: 'bg-emerald-800 text-white', title: 'text-emerald-950' },
  { card: 'bg-gradient-to-br from-lime-50 to-green-50/50 border-lime-200', badge: 'bg-lime-800 text-white', title: 'text-lime-950' },
  { card: 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200', badge: 'bg-amber-800 text-white', title: 'text-amber-950' },
];

interface DepEdViewProps {
  activeSubSection?: 'mission' | 'vision' | 'values' | 'mandate';
  onNavigate: (view: string, subParam?: string) => void;
}

export const DepEdView: React.FC<DepEdViewProps> = ({ activeSubSection = 'values', onNavigate }) => {
  const d = store.getSchoolProfile().deped ?? defaultDeped;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'About Us' },
          { label: 'DepEd' },
          {
            label:
              activeSubSection === 'mission'
                ? 'DepEd Mission'
                : activeSubSection === 'vision'
                ? 'DepEd Vision'
                : activeSubSection === 'mandate'
                ? 'DepEd Mandate'
                : 'DepEd Core Values',
            active: true
          }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Nav Tabs for DepEd pages */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => onNavigate('deped-vision')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeSubSection === 'vision'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          DepEd Vision
        </button>
        <button
          onClick={() => onNavigate('deped-mission')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeSubSection === 'mission'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          DepEd Mission
        </button>
        <button
          onClick={() => onNavigate('deped-values')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeSubSection === 'values'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          DepEd Core Values
        </button>
        <button
          onClick={() => onNavigate('deped-mandate')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeSubSection === 'mandate'
              ? 'bg-blue-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          DepEd Mandate
        </button>
      </div>

      {/* VISION VIEW */}
      {activeSubSection === 'vision' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>The Department of Education Vision</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">DepEd Vision</h1>

          <div className="p-8 bg-blue-950 text-white rounded-xl shadow-inner border border-blue-900 space-y-4">
            {paragraphs(d.vision).map((para, i) => (
              <p key={i} className="text-base sm:text-xl font-medium leading-relaxed italic text-blue-100"><Rich text={para} /></p>
            ))}
          </div>

          {d.visionNote && (
            <div className="pt-4 text-xs text-slate-600 leading-relaxed space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Vision Realization in Alcantara NHS:</h3>
              <p>{d.visionNote}</p>
            </div>
          )}
        </div>
      )}

      {/* MISSION VIEW */}
      {activeSubSection === 'mission' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
            <Flag className="w-3.5 h-3.5 text-blue-900" />
            <span>The Department of Education Mission</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">DepEd Mission</h1>

          <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-xl shadow-inner border border-slate-800">
            <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-200 mb-6">{d.missionIntro}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
              {(d.missionPoints || []).map((m, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <span className="font-bold text-amber-300 block mb-1">{m.title}</span>
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CORE VALUES VIEW */}
      {activeSubSection === 'values' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
            <Heart className="w-3.5 h-3.5 text-amber-600" />
            <span>Foundational Pillars</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">DepEd Core Values</h1>
          <p className="text-sm text-slate-600">{d.valuesIntro}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {(d.coreValues || []).map((v, i) => {
              const st = valueStyles[i % valueStyles.length];
              return (
                <div key={i} className={`p-6 rounded-xl border ${st.card}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm mb-3 ${st.badge}`}>{i + 1}</div>
                  <h3 className={`text-lg font-black ${st.title}`}>{v.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MANDATE VIEW */}
      {activeSubSection === 'mandate' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-blue-900" />
            <span>Constitutional & Legal Authority</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">DepEd Mandate</h1>

          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed space-y-4">
            {paragraphs(d.mandate).map((para, i) => <p key={i}><Rich text={para} /></p>)}
          </div>

          {d.legalFramework && <div className="pt-2 text-xs text-slate-500">{d.legalFramework}</div>}
        </div>
      )}
    </div>
  );
};
