import React from 'react';
import { Shield, Sparkles, Heart, Globe, Users, BookOpen, CheckCircle, Flag } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';

interface DepEdViewProps {
  activeSubSection?: 'mission' | 'vision' | 'values' | 'mandate';
  onNavigate: (view: string, subParam?: string) => void;
}

export const DepEdView: React.FC<DepEdViewProps> = ({ activeSubSection = 'values', onNavigate }) => {
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

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            DepEd Vision
          </h1>

          <div className="p-8 bg-blue-950 text-white rounded-xl shadow-inner border border-blue-900">
            <p className="text-base sm:text-xl font-medium leading-relaxed italic text-blue-100">
              "We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.<br /><br />
              As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders."
            </p>
          </div>

          <div className="pt-4 text-xs text-slate-600 leading-relaxed space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Vision Realization in Alcantara NHS:</h3>
            <p>
              At Alcantara National High School, this vision translates into everyday instructional rigor, student empowerment through the SSLG, environmental stewardship through YES-O, and cultivating empathetic, skilled graduates prepared for tertiary education or technical careers.
            </p>
          </div>
        </div>
      )}

      {/* MISSION VIEW */}
      {activeSubSection === 'mission' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold">
            <Flag className="w-3.5 h-3.5 text-blue-900" />
            <span>The Department of Education Mission</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            DepEd Mission
          </h1>

          <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-xl shadow-inner border border-slate-800">
            <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-200 mb-6">
              To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="font-bold text-amber-300 block mb-1">Students</span>
                learn in a child-friendly, gender-sensitive, safe, and motivating environment.
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="font-bold text-amber-300 block mb-1">Teachers</span>
                facilitate learning and constantly nurture every learner.
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="font-bold text-amber-300 block mb-1">Administrators & Staff</span>
                as stewards of the institution, ensure an enabling and supportive environment for effective learning to happen.
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="font-bold text-amber-300 block mb-1">Family, Community & Stakeholders</span>
                are actively engaged and share responsibility for developing life-long learners.
              </div>
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

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            DepEd Core Values
          </h1>
          <p className="text-sm text-slate-600">
            The Department of Education upholds four foundational core values that are deeply embedded into the character-building curriculum of Alcantara National High School.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-200">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-amber-300 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-lg font-black text-blue-950">Maka-Diyos</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Expresses one's spiritual beliefs while respecting the spiritual beliefs of others. Demonstrates adherence to universal moral truths, ethical conduct, and mutual respect among faith traditions.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-lg font-black text-emerald-950">Makatao</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Is sensitive to individual, social, and cultural differences. Demonstrates solidarity, empathy, respect for human rights, gender fairness, and peaceful conflict resolution in school and community.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-lime-50 to-green-50/50 rounded-xl border border-lime-200">
              <div className="w-10 h-10 rounded-lg bg-lime-800 text-white flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-lg font-black text-lime-950">Makakalikasan</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Cares for the environment and utilizes resources wisely, judiciously, and economically. Spearheaded in our campus through YES-O, coastal cleanups, and organic waste management.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl border border-amber-200">
              <div className="w-10 h-10 rounded-lg bg-amber-800 text-white flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h3 className="text-lg font-black text-amber-950">Makabansa</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Demonstrates pride in being a Filipino; exercises the rights and responsibilities of a Filipino citizen. Honors Philippine cultural heritage, languages, and democratic institutions.
              </p>
            </div>
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

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            DepEd Mandate
          </h1>

          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed space-y-4">
            <p>
              The Department of Education was established by virtue of the <strong>Education Act of 1982 (Batas Pambansa Blg. 232)</strong> and further strengthened by <strong>Republic Act No. 9155 (Governance of Basic Education Act of 2001)</strong>.
            </p>
            <p>
              The Department of Education is the primary government agency mandated to formulate, implement, and coordinate policies, plans, programs, and projects in the areas of formal and non-formal basic education. It supervises all elementary and secondary education institutions, including alternative learning systems, both public and private; and provides for the establishment and maintenance of a complete, adequate, and integrated system of basic education relevant to the goals of national development.
            </p>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            Governing Legal Framework: Republic Act 9155 · Batas Pambansa Blg. 232 · 1987 Constitution of the Republic of the Philippines (Article XIV)
          </div>
        </div>
      )}
    </div>
  );
};
