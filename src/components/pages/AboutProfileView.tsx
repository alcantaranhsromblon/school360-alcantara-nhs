import React from 'react';
import { Building, Users, BookOpen, Award, MapPin, Mail, Phone, Calendar, Globe, GraduationCap } from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { mapEmbedUrl, mapOpenUrl, facebookUrl } from '../../lib/maps';
import { store } from '../../services/store';

interface AboutProfileViewProps {
  onNavigate: (view: string, subParam?: string) => void;
}

export const AboutProfileView: React.FC<AboutProfileViewProps> = ({ onNavigate }) => {
  const profile = store.getSchoolProfile();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'About Us' },
          { label: 'School Profile', active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <span>Official Institutional Profile</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Alcantara National High School
          </h1>
          <p className="text-sm sm:text-base text-blue-100 font-light leading-relaxed">
            District of Alcantara · Division of Romblon · Region IV-B (MIMAROPA) · School ID: 301747
          </p>
        </div>
      </div>

      {/* Key Demographic Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="text-xs uppercase font-bold text-slate-400">Total Enrolled Learners</div>
          <div className="text-3xl font-extrabold text-blue-900 font-mono mt-1">
            {profile.totalStudents.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Junior & Senior High School</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="text-xs uppercase font-bold text-slate-400">Faculty & Personnel</div>
          <div className="text-3xl font-extrabold text-blue-900 font-mono mt-1">
            {profile.totalTeachers}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Master Teachers & Licensed Educators</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="text-xs uppercase font-bold text-slate-400">Campus Classrooms</div>
          <div className="text-3xl font-extrabold text-blue-900 font-mono mt-1">
            {profile.totalClassrooms}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Instructional & Specialized Labs</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="text-xs uppercase font-bold text-slate-400">Year Established</div>
          <div className="text-3xl font-extrabold text-amber-600 font-mono mt-1">
            {profile.establishedYear}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Over 5 Decades of Excellence</div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Institutional Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-900" />
              <span>Institutional Overview</span>
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                <strong>Alcantara National High School (School ID: 301747)</strong> is a premier public secondary educational institution under the Department of Education, Schools Division of Romblon. Situated in the coastal and agricultural municipality of Alcantara, the school is dedicated to delivering accessible, equitable, and quality basic education.
              </p>
              <p>
                The school operates across its <strong>Main Campus in Barangay Poblacion</strong>, the <strong>San Agustin Annex Campus</strong>, and the specialized <strong>Senior High School Complex</strong>. Offering the Standard Basic Education Curriculum, the Special Program in Science, Technology & Engineering (STE), and comprehensive Senior High School Academic and TVL Tracks, Alcantara NHS serves as the vanguard of youth development in southern Tablas Island.
              </p>
            </div>
          </div>

          {/* Curricular Offerings */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-900" />
              <span>Curricular Programs Offered</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-blue-950 mb-2">Junior High School (Grades 7 - 10)</h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Regular Basic Education Curriculum (BEC)</li>
                  <li>Special Science Program (STE)</li>
                  <li>Special Program in the Arts (SPA)</li>
                  <li>Pre-Vocational Technical Livelihood Education (TLE)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-sm font-bold text-blue-950 mb-2">Senior High School (Grades 11 - 12)</h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>STEM (Science, Tech, Engineering & Mathematics)</li>
                  <li>HUMSS (Humanities and Social Sciences)</li>
                  <li>ABM (Accountancy, Business & Management)</li>
                  <li>TVL: Information & Communications Technology (ICT)</li>
                  <li>TVL: Agri-Fishery Arts (Crop Production & Processing)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Official School Metadata
            </h3>
            <div className="text-xs space-y-3">
              <div>
                <span className="text-slate-400 block font-medium">School Identification (ID):</span>
                <span className="text-slate-800 font-bold font-mono text-sm">{profile.schoolId}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">DepEd District:</span>
                <span className="text-slate-800 font-semibold">{profile.district}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Schools Division:</span>
                <span className="text-slate-800 font-semibold">{profile.division}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Administrative Region:</span>
                <span className="text-slate-800 font-semibold">{profile.region}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">School Head:</span>
                <span className="text-slate-800 font-semibold">{profile.principalName}</span>
                <span className="text-[11px] text-slate-500 block">{profile.principalTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Land Area:</span>
                <span className="text-slate-800 font-semibold">{profile.landArea}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Contact & Location
            </h3>
            <div className="text-xs space-y-2.5 text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                <span>{profile.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-900 shrink-0" />
                <a href={`mailto:${profile.email}`} className="text-blue-700 hover:underline">
                  {profile.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-900 shrink-0" />
                <span>{profile.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-900 shrink-0" />
                {profile.facebookPage ? (
                  <a href={facebookUrl(profile.facebookPage)} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline break-all">
                    {profile.facebookPage}
                  </a>
                ) : <span>—</span>}
              </div>
            </div>
            {profile.address && (
              <div className="space-y-2 pt-1">
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <iframe
                    title="School location map"
                    src={mapEmbedUrl(profile.address, profile.mapUrl)}
                    className="w-full h-56 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a href={mapOpenUrl(profile.address)} target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-700 hover:underline">
                  Open in Google Maps →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
