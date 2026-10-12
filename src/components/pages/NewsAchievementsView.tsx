import React, { useState } from 'react';
import {
  Clock,
  Award,
  Calendar,
  FolderGit2,
  Image as ImageIcon,
  Search,
  Filter,
  ArrowRight,
  Eye,
  CheckCircle,
  Tag,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Breadcrumb } from '../common/Breadcrumb';
import { store } from '../../services/store';
import { NewsItem, AwardItem, ProgramProject, SchoolEvent, GalleryAlbum, GalleryPhoto } from '../../types';

interface NewsAchievementsViewProps {
  initialTab?: 'news' | 'awards' | 'programs' | 'events' | 'gallery';
  initialItemId?: string;
  onNavigate: (view: string, subParam?: string) => void;
}

export const NewsAchievementsView: React.FC<NewsAchievementsViewProps> = ({
  initialTab = 'news',
  initialItemId,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'awards' | 'programs' | 'events' | 'gallery'>(initialTab);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Modals
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(() => {
    if (initialTab === 'news' && initialItemId) {
      return store.getNews().find(n => n.id === initialItemId) || null;
    }
    return null;
  });

  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(() => {
    if (initialTab === 'gallery' && initialItemId) {
      return store.getAlbums().find(a => a.id === initialItemId) || null;
    }
    return null;
  });

  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  const newsItems = store.getNews();
  const awardsItems = store.getAwards();
  const programsItems = store.getPrograms();
  const eventsItems = store.getEvents();
  const albumsItems = store.getAlbums();

  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case 'news': return 'Latest News & Updates';
      case 'awards': return 'Awards & Recognition';
      case 'programs': return 'Programs & Projects';
      case 'events': return 'Events & Activities';
      case 'gallery': return 'Photo Gallery';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <Breadcrumb
        items={[
          { label: 'News & Achievements' },
          { label: getBreadcrumbLabel(), active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-8 sm:p-10 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official Dispatches & Accolades</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            News & Achievements
          </h1>
          <p className="text-sm text-blue-100 font-light leading-relaxed">
            Discover student breakthroughs, athletic championships, community projects, and calendar events at Alcantara National High School.
          </p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => { setActiveTab('news'); setCategoryFilter('All'); }}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'news' ? 'bg-blue-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Latest News & Updates</span>
        </button>

        <button
          onClick={() => { setActiveTab('awards'); setCategoryFilter('All'); }}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'awards' ? 'bg-blue-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Awards & Recognition</span>
        </button>

        <button
          onClick={() => { setActiveTab('programs'); setCategoryFilter('All'); }}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'programs' ? 'bg-blue-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Programs & Projects</span>
        </button>

        <button
          onClick={() => { setActiveTab('events'); setCategoryFilter('All'); }}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'events' ? 'bg-blue-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Events & Activities</span>
        </button>

        <button
          onClick={() => { setActiveTab('gallery'); setCategoryFilter('All'); }}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'gallery' ? 'bg-blue-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Photo Gallery</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={`Filter ${activeTab}...`}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
          Showing items in real time
        </div>
      </div>

      {/* 1. LATEST NEWS & UPDATES TAB */}
      {activeTab === 'news' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems
            .filter(item => {
              const matchesSearch = item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                item.content.toLowerCase().includes(searchFilter.toLowerCase());
              return matchesSearch;
            })
            .map(item => (
              <article
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="h-48 overflow-hidden relative">
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
                    {item.organization && (
                      <>
                        <span>·</span>
                        <span className="font-semibold text-blue-900">{item.organization}</span>
                      </>
                    )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-blue-800 font-semibold group-hover:underline">
                      Read Complete Story
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-800 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
        </div>
      )}

      {/* 2. AWARDS & RECOGNITION TAB */}
      {activeTab === 'awards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awardsItems
            .filter(a => a.title.toLowerCase().includes(searchFilter.toLowerCase()) || a.recipient.toLowerCase().includes(searchFilter.toLowerCase()))
            .map(award => (
              <div
                key={award.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={award.imageUrl}
                    alt={award.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-sm">
                    {award.level} Level
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
                      {award.category} Recognition
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {award.title}
                    </h3>
                    <div className="text-xs font-semibold text-slate-700 mt-2">
                      Recipient: <span className="text-blue-900">{award.recipient}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {award.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    Date Awarded: {award.dateAwarded}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 3. PROGRAMS & PROJECTS TAB */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programsItems
            .filter(p => p.title.toLowerCase().includes(searchFilter.toLowerCase()) || p.objectives.toLowerCase().includes(searchFilter.toLowerCase()))
            .map(prog => (
              <div
                key={prog.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={prog.imageUrl}
                      alt={prog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      {prog.status}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="text-[11px] font-semibold text-slate-400">
                      Lead: {prog.leadOffice}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <span className="font-bold text-slate-800 block mb-1">Key Outcomes & Impact:</span>
                      <span className="text-slate-600">{prog.outcomes}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-400">
                  Implemented: {prog.startDate}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 4. EVENTS & ACTIVITIES TAB */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsItems
            .filter(e => e.title.toLowerCase().includes(searchFilter.toLowerCase()) || e.venue.toLowerCase().includes(searchFilter.toLowerCase()))
            .map(ev => (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-blue-950/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      {ev.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-blue-900">{ev.date} · {ev.time}</span>
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">{ev.status}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ev.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 font-medium">
                  Venue: {ev.venue}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 5. PHOTO GALLERY TAB */}
      {activeTab === 'gallery' && (
        <div className="space-y-8">
          {selectedAlbum ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setSelectedAlbum(null)}
                    className="text-xs font-bold text-blue-900 hover:underline mb-1"
                  >
                    ← Back to All Albums
                  </button>
                  <h2 className="text-2xl font-black text-slate-900">{selectedAlbum.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedAlbum.description}</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedAlbum.photos.length} Photographs
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedAlbum.photos.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxPhoto(photo)}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="h-52 overflow-hidden">
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-slate-700 font-medium line-clamp-2">
                        {photo.caption}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Taken: {photo.takenDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {albumsItems.map(album => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                      {album.photos.length} Photos
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {album.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-900 font-bold">
                      <span>Open Album</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FULL STORY MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="relative h-60 shrink-0 overflow-hidden">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-full object-cover object-top"
              />
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full"
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
                {selectedNews.organization && (
                <>
                  <span>·</span>
                  <span className="font-semibold text-blue-900">{selectedNews.organization}</span>
                </>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {selectedNews.title}
              </h3>
              <p className="text-xs font-medium text-blue-900 italic bg-blue-50/70 p-3.5 rounded-lg border-l-4 border-blue-800">
                {selectedNews.summary}
              </p>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedNews.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={lightboxPhoto.imageUrl}
              alt={lightboxPhoto.caption}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-3 text-center text-white text-sm max-w-xl">
              <p className="font-medium">{lightboxPhoto.caption}</p>
              <p className="text-xs text-slate-400 mt-1">Taken: {lightboxPhoto.takenDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
