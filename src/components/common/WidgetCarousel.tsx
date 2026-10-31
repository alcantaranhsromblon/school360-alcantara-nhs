import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Lock,
  Landmark,
  CloudRain,
  ShieldAlert,
  Activity,
  Smartphone,
  ArrowRight,
  Newspaper,
  Facebook,
} from 'lucide-react';
import { store } from '../../services/store';
import { facebookUrl } from '../../lib/maps';
import { WeatherWidget } from './WeatherWidget';

interface WidgetCarouselProps {
  onNavigate: (view: string, subParam?: string) => void;
  onOpenLogin: () => void;
}

const PANEL = 'rounded-2xl overflow-hidden border border-blue-900/20 shadow-xs bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white';

/* ---------- Slide 2: Latest news and announcements ---------- */

const NewsWidget: React.FC<{ onNavigate: WidgetCarouselProps['onNavigate'] }> = ({ onNavigate }) => {
  const items = store.getNews().slice(0, 4);
  const [lead, ...rest] = items;

  return (
    <div className={PANEL}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 sm:px-7 py-4 border-b border-white/10 bg-black/20">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <Newspaper className="w-3.5 h-3.5" />
            <span>News and announcements</span>
          </div>
          <div className="text-sm text-blue-100 mt-0.5">Latest from Alcantara National High School</div>
        </div>
        <button
          onClick={() => onNavigate('news')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
        >
          <span>View all news</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {!lead ? (
        <div className="p-6 sm:p-7 text-sm text-blue-200 py-10 text-center">No news has been posted yet. Please check back soon.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Lead story */}
          <button
            onClick={() => onNavigate('news', lead.id)}
            className="lg:col-span-6 text-left p-6 sm:p-7 hover:bg-white/5 transition-colors"
          >
            <div className="aspect-video rounded-xl overflow-hidden relative bg-blue-950 border border-white/10">
              {lead.imageUrl && (
                <>
                  <img src={lead.imageUrl} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-50" />
                  <img src={lead.imageUrl} alt={lead.title} className="relative w-full h-full object-contain" />
                </>
              )}
              <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                {lead.category}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-blue-200">
              <Clock className="w-3 h-3" />
              <span>{lead.publishedDate}</span>
            </div>
            <div className="text-base font-bold text-white mt-1 leading-snug">{lead.title}</div>
            {lead.summary && <p className="text-xs text-blue-200 mt-1.5 leading-relaxed line-clamp-2">{lead.summary}</p>}
          </button>

          {/* More stories */}
          <div className="lg:col-span-6 p-6 sm:p-7 bg-black/20 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-3">More stories</div>
            {rest.length === 0 ? (
              <div className="text-sm text-blue-200">No other stories yet.</div>
            ) : (
              <div className="space-y-2">
                {rest.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onNavigate('news', n.id)}
                    className="w-full text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 transition-colors"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                      <span className={n.category === 'DepEd Advisory' ? 'text-amber-300' : ''}>{n.category}</span> · {n.publishedDate}
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5 leading-snug">{n.title}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- Facebook page feed ---------- */

const FacebookWidget: React.FC<{ pageUrl: string }> = ({ pageUrl }) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [boxWidth, setBoxWidth] = useState(340);

  // The Facebook plugin accepts a width between 180 and 500 px
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = () => setBoxWidth(Math.max(280, Math.min(500, Math.floor(el.clientWidth))));
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const height = 560;
  const src =
    'https://www.facebook.com/plugins/page.php' +
    `?href=${encodeURIComponent(pageUrl)}` +
    '&tabs=timeline' +
    `&width=${boxWidth}&height=${height}` +
    '&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false';

  return (
    <div className={PANEL}>
      <div className="px-6 sm:px-7 py-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
          <Facebook className="w-3.5 h-3.5" />
          <span>Facebook page</span>
        </div>
        <div className="text-sm text-blue-100 mt-0.5">Follow our official page for the latest posts</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-center">
          <div className="text-lg font-bold text-white leading-snug">Stay connected with Alcantara National High School</div>
          <p className="text-sm text-blue-200 mt-2 leading-relaxed">
            Announcements, class advisories, photos, and school activities are posted on our official Facebook page.
          </p>
          <a
            href={pageUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 self-start px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
          >
            <span>Visit our Facebook page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <p className="text-[11px] text-blue-300 mt-4 leading-relaxed">
            If the feed does not appear, your browser, ad blocker, or privacy settings may be blocking Facebook. Use the button above instead.
          </p>
        </div>

        <div ref={boxRef} className="lg:col-span-7 p-4 sm:p-6 bg-black/20 border-t lg:border-t-0 lg:border-l border-white/10 flex justify-center">
          <iframe
            key={boxWidth}
            title="Alcantara National High School on Facebook"
            src={src}
            width={boxWidth}
            height={height}
            style={{ border: 'none', overflow: 'hidden', maxWidth: '100%', background: '#ffffff', borderRadius: 12 }}
            scrolling="no"
            frameBorder={0}
            loading="lazy"
            allow="encrypted-media"
          />
        </div>
      </div>
    </div>
  );
};

/* ---------- Slide 3: Upcoming events ---------- */

const EventsWidget: React.FC<{ onNavigate: WidgetCarouselProps['onNavigate'] }> = ({ onNavigate }) => {
  const all = store.getEvents();
  const upcoming = all.filter((e) => e.status !== 'Completed');
  const events = (upcoming.length > 0 ? upcoming : all).slice(0, 3);

  return (
    <div className={PANEL}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 sm:px-7 py-4 border-b border-white/10 bg-black/20">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <Calendar className="w-3.5 h-3.5" />
            <span>School calendar</span>
          </div>
          <div className="text-sm text-blue-100 mt-0.5">Upcoming events at Alcantara National High School</div>
        </div>
        <button
          onClick={() => onNavigate('events')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
        >
          <span>View all events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-6 sm:p-7">
        {events.length === 0 ? (
          <div className="text-sm text-blue-200 py-6 text-center">No events have been posted yet. Please check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {events.map((ev) => {
              const d = new Date(ev.date);
              const valid = !Number.isNaN(d.getTime());
              return (
                <button
                  key={ev.id}
                  onClick={() => onNavigate('events', ev.id)}
                  className="text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-14 rounded-lg bg-white/10 border border-white/15 py-2 text-center">
                      <div className="text-[10px] font-bold uppercase text-amber-300">
                        {valid ? d.toLocaleDateString('en-US', { month: 'short' }) : '—'}
                      </div>
                      <div className="text-xl font-black font-mono leading-tight">{valid ? d.getDate() : ''}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                        {ev.category} · <span className="text-amber-300">{ev.status}</span>
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5 leading-snug">{ev.title}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-blue-200">
                    {ev.time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{ev.time}</span>
                      </div>
                    )}
                    {ev.venue && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{ev.venue}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- Slide 4: Quick links ---------- */

const LinksWidget: React.FC<{ onOpenLogin: () => void }> = ({ onOpenLogin }) => {
  const links = [
    { label: 'DepEd', note: 'Department of Education', href: 'https://www.deped.gov.ph/', icon: <Landmark className="w-5 h-5 text-amber-300" /> },
    { label: 'PAGASA', note: 'Weather and warnings', href: 'https://www.pagasa.dost.gov.ph/weather', icon: <CloudRain className="w-5 h-5 text-sky-300" /> },
    { label: 'PANaHON', note: 'PAGASA observing network', href: 'https://www.panahon.gov.ph/', icon: <Smartphone className="w-5 h-5 text-sky-300" /> },
    { label: 'DepEd LIGTAS+', note: 'School hazard maps', href: 'https://ligtas.cair.ph/maps/', icon: <ShieldAlert className="w-5 h-5 text-amber-300" /> },
    { label: 'PHIVOLCS', note: 'Earthquake information', href: 'https://earthquake.phivolcs.dost.gov.ph/', icon: <Activity className="w-5 h-5 text-orange-300" /> },
  ];

  return (
    <div className={PANEL}>
      <div className="px-6 sm:px-7 py-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Quick links</span>
        </div>
        <div className="text-sm text-blue-100 mt-0.5">Official sources for learners, parents, and teachers</div>
      </div>

      <div className="p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {l.icon}
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">{l.label}</div>
                <div className="text-xs text-blue-200">{l.note}</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-300 shrink-0" />
          </a>
        ))}

        <button
          onClick={onOpenLogin}
          className="flex items-center justify-between gap-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-3 text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5" />
            <div>
              <div className="text-sm font-bold">Faculty and admin portal</div>
              <div className="text-xs text-slate-800">Sign in to School360</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
};

/* ---------- Carousel ---------- */

export const WidgetCarousel: React.FC<WidgetCarouselProps> = ({ onNavigate, onOpenLogin }) => {
  const fbPage = facebookUrl(store.getSchoolProfile().facebookPage);

  const slides = [
    { id: 'weather', label: 'Weather and hazard watch', node: <WeatherWidget /> },
    { id: 'news', label: 'News and announcements', node: <NewsWidget onNavigate={onNavigate} /> },
    ...(fbPage ? [{ id: 'facebook', label: 'Facebook page', node: <FacebookWidget pageUrl={fbPage} /> }] : []),
    { id: 'events', label: 'Upcoming events', node: <EventsWidget onNavigate={onNavigate} /> },
    { id: 'links', label: 'Quick links', node: <LinksWidget onOpenLogin={onOpenLogin} /> },
  ];

  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);
  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
  };

  const arrowClass =
    'w-10 h-10 rounded-full bg-blue-950 hover:bg-blue-800 text-white border border-white/20 shadow-md flex items-center justify-center transition-colors';

  return (
    <div
      className="relative sm:px-14"
      role="region"
      aria-roledescription="carousel"
      aria-label="School widgets"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Side arrows (tablet and desktop) */}
      <button
        onClick={prev}
        aria-label="Previous widget"
        className={`${arrowClass} hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next widget"
        className={`${arrowClass} hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* All slides share one grid cell so the box keeps the height of the tallest one */}
      <div className="grid">
        {slides.map((s, i) => (
          <div
            key={s.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${s.label}`}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 transition-opacity duration-300 ${
              i === index ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'
            }`}
          >
            {s.node}
          </div>
        ))}
      </div>

      {/* Controls: arrows (phones), dots, and current widget name */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <button onClick={prev} aria-label="Previous widget" className={`${arrowClass} sm:hidden !w-9 !h-9`}>
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(i)}
                aria-label={`Show ${s.label}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-blue-900' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
              />
            ))}
          </div>
          <div className="text-[11px] font-semibold text-slate-500">
            {slides[index].label} · {index + 1}/{count}
          </div>
        </div>

        <button onClick={next} aria-label="Next widget" className={`${arrowClass} sm:hidden !w-9 !h-9`}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
