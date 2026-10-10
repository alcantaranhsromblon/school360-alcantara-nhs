import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Shield } from 'lucide-react';
import { store } from '../../services/store';

interface FooterProps {
  onNavigate: (view: string, subParam?: string) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLogin }) => {
  const profile = store.getSchoolProfile();

  return (
    <footer className="bg-slate-900 text-slate-300 text-sm border-t-4 border-amber-500">
      {/* Upper Footer: School Identity & Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Alcantara National High School seal" className="w-12 h-12 object-contain shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">DepEd Romblon</div>
                <div className="text-sm font-extrabold text-white leading-tight">Alcantara National High School</div>
                <div className="text-[11px] text-slate-400 font-mono">School ID: 301747</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {profile.tagline}. An institution committed to the holistic growth of learners under the DepEd MATATAG agenda.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{profile.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:text-amber-300">{profile.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{profile.contactNumber}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              School Information
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('about-profile')} className="hover:text-amber-400 transition-colors">
                  School Profile & Demographics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about-history')} className="hover:text-amber-400 transition-colors">
                  School History & Founding
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('deped-values')} className="hover:text-amber-400 transition-colors">
                  DepEd Core Values & Mission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('org-chart')} className="hover:text-amber-400 transition-colors">
                  Faculty & Staff Hierarchy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('campuses')} className="hover:text-amber-400 transition-colors">
                  Campuses & Learning Facilities
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Organizations & Co-Curricular */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Learner Organizations
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('organization', 'SSLG')} className="hover:text-amber-400 transition-colors">
                  Supreme Secondary Learner Government (SSLG)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('organization', 'YES-O')} className="hover:text-amber-400 transition-colors">
                  Youth for Environment in Schools (YES-O)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('organization', 'THE_BEACON')} className="hover:text-amber-400 transition-colors">
                  The Beacon (English Publication)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('organization', 'AVANT_GARDE')} className="hover:text-amber-400 transition-colors">
                  Avant Garde / Ang Gabay (Filipino Publication)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('awards')} className="hover:text-amber-400 transition-colors">
                  Honors & Student Recognitions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official DepEd Transparency & Portal Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Transparency & Faculty
            </h4>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Shield className="w-4 h-4" />
                <span>Faculty & Admin Portal</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Authorized DepEd personnel can log in to view School Issuances, internal updates, and submit monitoring forms.
              </p>
              <button
                onClick={onOpenLogin}
                className="w-full mt-1 py-1.5 px-3 bg-blue-800 hover:bg-blue-700 text-white rounded text-xs font-semibold text-center transition-colors"
              >
                Access Portal
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <div>Region IV-B MIMAROPA · SDO Romblon</div>
              <div className="flex items-center gap-1 hover:text-slate-400">
                <a href="https://www.deped.gov.ph" target="_blank" rel="noreferrer" className="flex items-center gap-1">
                  <span>DepEd Central Office Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Republic of the Philippines Standard Bottom Bar */}
      <div className="bg-slate-950 py-4 px-4 sm:px-8 border-t border-slate-800 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Alcantara National High School · School ID 301747 · All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>DepEd MATATAG</span>
            <span>·</span>
            <span>Bagong Pilipinas</span>
            <span>·</span>
            <span className="font-mono text-slate-500">v2.4.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
