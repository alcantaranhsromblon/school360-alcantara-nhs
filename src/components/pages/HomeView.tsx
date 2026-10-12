import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Calendar,
  Users,
  Building,
  ArrowRight,
  BookOpen,
  Sparkles,
  ChevronRight,
  CheckCircle,
  FileText,
  MapPin,
  ExternalLink,
  Shield,
  Clock,
  Eye
} from 'lucide-react';
import { store } from '../../services/store';
import { toImageUrl } from '../../lib/drive';
import { NewsItem, SchoolEvent, AwardItem, Campus, SchoolOrganization } from '../../types';

interface HomeViewProps {
  onNavigate: (view: string, subParam?: string) => void;
  onOpenLogin: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenLogin }) => {
  const profile = store.getSchoolProfile();
  const campuses = store.getCampuses();
  const newsList = store.getNews().slice(0, 3);
  const eventsList = store.getEvents().slice(0, 3);
  const awardsList = store.getAwards().slice(0, 4);
  const orgsList = store.getOrganizations();
  const albumsList = store.getAlbums().slice(0, 2);

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <img
            src={profile.heroImageUrl ? toImageUrl(profile.heroImageUrl, 2000) : '/hero.jpg'}
            alt="Alcantara National High School building"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/75 to-blue-900/25 z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>DepEd Region IV-B MIMAROPA · Division of Romblon</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              ALCANTARA <br />
              <span className="text-amber-400">NATIONAL HIGH SCHOOL</span>
            </h1>

            <p className="text-base sm:text-xl text-blue-100 font-light leading-relaxed">
              {profile.tagline}. An institution shaping empowered, productive, and values-driven Romblomanon learners since {profile.establishedYear}.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('about-profile')}
                className="px-5 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-400/20 flex items-center gap-2"
              >
                <span>Discover School Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('news')}
                className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider transition-all border border-white/20 backdrop-blur-xs flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Latest School News</span>
              </button>

              <button
                onClick={() => onNavigate('org-chart')}
                className="px-5 py-3 rounded-lg bg-blue-800/60 hover:bg-blue-800 text-blue-100 font-semibold text-xs tracking-wider transition-all border border-blue-700/60 flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-amber-400" />
                <span>Organizational Structure</span>
              </button>
            </div>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                  {profile.totalStudents.toLocaleString()}+
                </div>
                <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Enrolled Learners</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {profile.totalTeachers}
                </div>
                <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Dedicated Faculty</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {campuses.length}
                </div>
                <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Campuses & Facilities</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {profile.totalClassrooms}
                </div>
                <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Instructional Rooms</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                  {profile.schoolId}
                </div>
                <div className="text-[11px] text-slate-300 uppercase tracking-wider mt-0.5">Official School ID</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME MESSAGE FROM PRINCIPAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4 bg-gradient-to-br from-blue-950 to-blue-900 p-8 text-white flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 rounded-full border-2 border-amber-400 overflow-hidden shadow-lg mb-4 bg-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt={profile.principalName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                  Office of the School Head
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {profile.principalName}
                </h3>
                <p className="text-xs text-blue-200">{profile.principalTitle}</p>
                <div className="text-[11px] text-slate-300 mt-1">
                  Alcantara National High School
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-blue-200">
                <p className="italic">"Under the banner of DepEd MATATAG, no learner in Alcantara shall be left behind."</p>
              </div>
            </div>

            <div className="lg:col-span-8 p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Message from the Secondary School Principal</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 leading-snug mb-4">
                Empowering the Youth of Alcantara for a Transformed Future
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {profile.principalMessage}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('about-profile')}
                  className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1.5 group"
                >
                  <span>Read School Profile & Demographics</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-slate-300">·</span>
                <button
                  onClick={() => onNavigate('deped-values')}
                  className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1.5 group"
                >
                  <span>DepEd Core Values & Mandate</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CAMPUSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Learning Facilities & Centers
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Our Campuses & Learning Environments
            </h2>
          </div>
          <button
            onClick={() => onNavigate('campuses')}
            className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Campus Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campuses.map(campus => (
            <div
              key={campus.id}
              onClick={() => onNavigate('campuses', campus.id)}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={campus.imageUrl}
                  alt={campus.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-blue-950/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {campus.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {campus.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{campus.address}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {campus.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-500">
                    {campus.gradeLevels.join(', ')}
                  </span>
                  <span className="font-bold text-blue-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST NEWS & ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Happenings & Bulletins
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Latest News & Announcements
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse All News Articles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsList.map(item => (
            <article
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                  {item.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <Clock className="w-3 h-3" />
                    <span>{item.publishedDate}</span>{item.writer && (
                    <>
                      <span>·</span>
                      <span>Writer: {item.writer}</span>
                    </>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-blue-700 font-semibold group-hover:underline">
                    Read Full Story
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-700 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* AWARDS & RECOGNITION TICKER / CARDS */}
      <section className="bg-gradient-to-br from-blue-950 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-blue-900/60 pb-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Student & Institutional Honors</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Recent Awards & Accolades
              </h2>
            </div>
            <button
              onClick={() => onNavigate('awards')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Honors Archive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {awardsList.map(award => (
              <div
                key={award.id}
                onClick={() => onNavigate('awards', award.id)}
                className="bg-white/5 border border-white/10 hover:border-amber-400/50 rounded-xl p-4 transition-all cursor-pointer group"
              >
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {award.level} Level · {award.category}
                </div>
                <h4 className="text-sm font-bold text-white mt-1 line-clamp-2 group-hover:text-amber-300 transition-colors">
                  {award.title}
                </h4>
                <div className="text-xs text-slate-300 mt-2 line-clamp-1">
                  Recipient: <span className="font-medium text-white">{award.recipient}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Awarded: {award.dateAwarded}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS & SCHOOL ORGANIZATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Events Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Calendar of Activities
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Upcoming School Events
              </h3>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {eventsList.map(ev => (
              <div
                key={ev.id}
                onClick={() => onNavigate('events', ev.id)}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all cursor-pointer flex items-start gap-4 group"
              >
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center shrink-0 w-16">
                  <Calendar className="w-4 h-4 text-blue-900 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-blue-900 uppercase">
                    {new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {new Date(ev.date).getDate()}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    <span>{ev.category}</span>
                    <span>·</span>
                    <span className="text-amber-700">{ev.status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors mt-0.5">
                    {ev.title}
                  </h4>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>{ev.time}</span>
                    <span>·</span>
                    <span>{ev.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Co-Curricular Organizations Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Student Leadership & Life
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                School Organizations
              </h3>
            </div>
            <span className="text-xs text-slate-500">Official Student Bodies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {orgsList.map(org => (
              <div
                key={org.id}
                onClick={() => onNavigate('organization', org.code)}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-700 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-sm">
                      {org.acronym}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1 group-hover:text-blue-900">
                    {org.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {org.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 truncate">
                  Adviser: <span className="font-semibold">{org.adviser}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Campus Life in Focus
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Approved Photo Gallery
            </h3>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Explore All Albums</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {albumsList.map(album => (
            <div
              key={album.id}
              onClick={() => onNavigate('gallery', album.id)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="h-56 overflow-hidden relative">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {album.photos.length} Approved Photographs
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      {album.title}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FACULTY PORTAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-blue-800/40">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>School360 Management & Faculty Hub</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Are you an authorized Alcantara NHS educator or staff?
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Sign in with your approved DepEd credentials to access protected School Issuances, internal faculty notices, and compliance monitoring forms.
            </p>
          </div>
          <button
            onClick={onOpenLogin}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all shrink-0"
          >
            Sign In to Faculty Portal
          </button>
        </div>
      </section>

      {/* FULL ARTICLE MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="relative aspect-video shrink-0 overflow-hidden">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-full object-cover object-top"
              />
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white p-1.5 rounded-full"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                {selectedNews.category}
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{selectedNews.publishedDate}</span>
                {selectedNews.writer && (
                <>
                  <span>·</span>
                  <span>Writer: {selectedNews.writer}</span>
                </>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {selectedNews.title}
              </h3>
              <p className="text-xs font-medium text-blue-900 italic bg-blue-50/70 p-3 rounded-lg border-l-4 border-blue-800">
                {selectedNews.summary}
              </p>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedNews.content}
              </div>

              {selectedNews.tags && selectedNews.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {selectedNews.tags.map(tag => (
                    <span key={tag} className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
