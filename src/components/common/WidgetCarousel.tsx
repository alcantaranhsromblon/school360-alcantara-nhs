import React, { useCallback, useRef, useState } from 'react';
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
} from 'lucide-react';
import { store } from '../../services/store';
import { WeatherWidget } from './WeatherWidget';

interface WidgetCarouselProps {
  onNavigate: (view: string, subParam?: string) => void;
  onOpenLogin: () => void;
}

const PANEL = 'rounded-2xl overflow-hidden border border-blue-900/20 shadow-xs bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white';

/* ---------- Slide 2: Upcoming events ---------- */

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

/* ---------- Slide 3: Quick links ---------- */

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
  const slides = [
    { id: 'weather', label: 'Weather and hazard watch', node: <WeatherWidget /> },
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
