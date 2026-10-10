import React from 'react';
import { History, Award, BookOpen, Flag, CheckCircle } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';

interface AboutHistoryViewProps {
  onNavigate: (view: string, subParam?: string) => void;
}

export const AboutHistoryView: React.FC<AboutHistoryViewProps> = ({ onNavigate }) => {
  const milestones = [
    {
      year: '1968',
      title: 'Founding of Alcantara Municipal High School',
      description: 'Established through the collaborative efforts of local municipal leaders, civic stakeholders, and community elders to offer secondary education to children in Alcantara who previously had to travel to Odiongan or Romblon town.'
    },
    {
      year: '1984',
      title: 'Conversion to National High School',
      description: 'By virtue of national legislation and DepEd integration, the school was converted into a full National High School (ANHS), securing regular national budgetary appropriations and instructional facility allocations.'
    },
    {
      year: '1998',
      title: 'Establishment of San Agustin Annex Campus',
      description: 'To address access challenges for learners from remote coastal and agricultural sitios, the San Agustin Extension Campus was established, bringing basic education closer to remote learners.'
    },
    {
      year: '2016',
      title: 'Senior High School Implementation & Expansion',
      description: 'Pioneered the full roll-out of Republic Act 10533 (Enhanced Basic Education Act), erecting the Senior High School complex with Academic tracks (STEM, ABM, HUMSS) and TVL specialization suites.'
    },
    {
      year: '2023',
      title: 'Attainment of SBM Level III (Advanced Maturing Practitioner)',
      description: 'DepEd Regional Office IV-B MIMAROPA conferred the Level III School-Based Management distinction to Alcantara NHS for exemplary leadership, accountability, and community engagement.'
    },
    {
      year: 'Present',
      title: 'Digital Transformation & Sustainable Green Campus',
      description: 'Continuing the DepEd MATATAG agenda through Project TULAY, science and robotics programs, digital learning caches, and the School360 unified web and management portal.'
    }
  ];

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
            From humble municipal beginnings in 1968 to an award-winning center of academic and technical excellence in the Division of Romblon.
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
            Over fifty years of dedication to shaping the youth of Alcantara and neighboring municipalities.
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
