import React, { useEffect, useState } from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  CloudSnow,
  Droplets,
  Wind,
  Thermometer,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';

// Alcantara, Romblon (approximate coordinates)
const LAT = 12.4;
const LON = 122.03;
const REFRESH_MS = 15 * 60 * 1000;

const LIGTAS_URL = 'https://ligtas.cair.ph/maps/';
const PANAHON_URL = 'https://www.panahon.gov.ph/';
const PAGASA_URL = 'https://www.pagasa.dost.gov.ph/weather';

const API_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
  `&hourly=precipitation,wind_gusts_10m,apparent_temperature` +
  `&forecast_hours=24` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
  `&timezone=Asia%2FManila&forecast_days=5`;

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
  };
  hourly: {
    precipitation: number[];
    wind_gusts_10m: number[];
    apparent_temperature: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

/* ---------- Hazard levels (indicative, based on PAGASA-style thresholds) ---------- */

type Level = 0 | 1 | 2 | 3;

const LEVELS: { label: string; pill: string; bar: string }[] = [
  { label: 'Low', pill: 'bg-emerald-400/20 text-emerald-200 border-emerald-300/40', bar: 'bg-emerald-400' },
  { label: 'Moderate', pill: 'bg-yellow-300/20 text-yellow-200 border-yellow-300/40', bar: 'bg-yellow-300' },
  { label: 'High', pill: 'bg-orange-400/25 text-orange-200 border-orange-300/50', bar: 'bg-orange-400' },
  { label: 'Severe', pill: 'bg-red-500/30 text-red-100 border-red-300/60', bar: 'bg-red-500' },
];

// Rainfall in mm per hour: yellow 7.5, orange 15, red 30 (PAGASA rainfall warning bands)
const rainLevel = (mmPerHour: number): Level =>
  mmPerHour >= 30 ? 3 : mmPerHour >= 15 ? 2 : mmPerHour >= 7.5 ? 1 : 0;

// Wind gusts in km/h: 39, 62 and 89 mark the start of Wind Signals 1, 2 and 3
const windLevel = (kmh: number): Level => (kmh >= 89 ? 3 : kmh >= 62 ? 2 : kmh >= 39 ? 1 : 0);

// "Feels like" temperature in C: 33, 42 and 52 mark PAGASA heat index categories
const heatLevel = (c: number): Level => (c >= 52 ? 3 : c >= 42 ? 2 : c >= 33 ? 1 : 0);

const ACTIONS: Record<Level, string> = {
  0: 'No significant weather hazard is expected in the next 24 hours. Continue regular activities and keep checking updates.',
  1: 'Stay alert. Secure loose outdoor items and keep monitoring PAGASA advisories.',
  2: 'Be prepared. Review evacuation plans, secure equipment, and wait for official advisories on classes.',
  3: 'Take precautions now. Follow instructions from your school head, DepEd, and the local DRRM office.',
};

const maxOf = (values: number[]): number => {
  const clean = values.filter((v) => typeof v === 'number' && !Number.isNaN(v));
  return clean.length ? Math.max(...clean) : 0;
};

/* ---------- Weather helpers ---------- */

const describe = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mostly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 57) return 'Light drizzle';
  if (code >= 61 && code <= 65) return code === 65 ? 'Heavy rain' : 'Rain showers';
  if (code === 66 || code === 67) return 'Freezing rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code === 85 || code === 86) return 'Snow showers';
  if (code === 95) return 'Thunderstorm';
  if (code === 96 || code === 99) return 'Thunderstorm with hail';
  return 'Unknown';
};

const WeatherIcon: React.FC<{ code: number; isDay?: boolean; className?: string }> = ({
  code,
  isDay = true,
  className = 'w-8 h-8',
}) => {
  if (code === 0 || code === 1) {
    return isDay ? <Sun className={`${className} text-amber-400`} /> : <Moon className={`${className} text-blue-200`} />;
  }
  if (code === 2) {
    return isDay ? <CloudSun className={`${className} text-amber-300`} /> : <CloudMoon className={`${className} text-blue-200`} />;
  }
  if (code === 3) return <Cloud className={`${className} text-slate-300`} />;
  if (code === 45 || code === 48) return <CloudFog className={`${className} text-slate-300`} />;
  if (code >= 51 && code <= 57) return <CloudDrizzle className={`${className} text-sky-300`} />;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain className={`${className} text-sky-300`} />;
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <CloudSnow className={`${className} text-blue-100`} />;
  if (code >= 95) return <CloudLightning className={`${className} text-amber-300`} />;
  return <Cloud className={`${className} text-slate-300`} />;
};

const dayLabel = (iso: string, index: number): string => {
  if (index === 0) return 'Today';
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString('en-PH', { weekday: 'short' });
};

/* ---------- Component ---------- */

export const WeatherWidget: React.FC = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error('Weather request failed');
        const json = (await res.json()) as WeatherData;
        if (cancelled) return;
        setData(json);
        setUpdatedAt(new Date());
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      }
    };

    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  // Hazard summary for the next 24 hours
  const rainMax = data ? maxOf(data.hourly.precipitation) : 0;
  const gustMax = data ? maxOf(data.hourly.wind_gusts_10m) : 0;
  const heatMax = data ? maxOf(data.hourly.apparent_temperature) : 0;

  const hazards: { key: string; label: string; detail: string; level: Level; icon: React.ReactNode }[] = [
    {
      key: 'rain',
      label: 'Heavy rainfall',
      detail: `Up to ${rainMax.toFixed(1)} mm/hr`,
      level: rainLevel(rainMax),
      icon: <CloudRain className="w-5 h-5 text-sky-300" />,
    },
    {
      key: 'wind',
      label: 'Strong winds',
      detail: `Gusts up to ${Math.round(gustMax)} km/h`,
      level: windLevel(gustMax),
      icon: <Wind className="w-5 h-5 text-slate-200" />,
    },
    {
      key: 'heat',
      label: 'Heat (feels like)',
      detail: `Up to ${Math.round(heatMax)}°C`,
      level: heatLevel(heatMax),
      icon: <Thermometer className="w-5 h-5 text-amber-300" />,
    },
  ];

  const overall = hazards.reduce<Level>((m, h) => (h.level > m ? h.level : m), 0);

  return (
    <div className="rounded-2xl overflow-hidden border border-blue-900/20 shadow-xs bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
      {/* Header band */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 sm:px-7 py-4 border-b border-white/10 bg-black/20">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <MapPin className="w-3.5 h-3.5" />
            <span>Weather and hazard watch · Alcantara, Romblon</span>
          </div>
          <div className="text-sm text-blue-100 mt-0.5">Next 24 hours · Alcantara National High School</div>
        </div>
        {data && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${LEVELS[overall].pill}`}>
            {overall === 0 ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            <span>Overall risk: {LEVELS[overall].label}</span>
          </div>
        )}
      </div>

      {!data && !error && <div className="px-7 py-8 text-sm text-blue-200 animate-pulse">Loading weather and hazard data…</div>}
      {error && !data && (
        <div className="px-7 py-8 text-sm text-blue-200">
          Weather data is unavailable right now. Please check the official sources below.
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Current conditions */}
          <div className="lg:col-span-4 p-6 sm:p-7">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-3">Right now</div>
            <div className="flex items-center gap-4">
              <WeatherIcon code={data.current.weather_code} isDay={data.current.is_day === 1} className="w-14 h-14" />
              <div>
                <div className="text-5xl font-black font-mono leading-none">
                  {Math.round(data.current.temperature_2m)}°<span className="text-2xl font-bold text-blue-200">C</span>
                </div>
                <div className="text-sm text-blue-100 mt-1">{describe(data.current.weather_code)}</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-blue-100">
                <Thermometer className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Feels {Math.round(data.current.apparent_temperature)}°</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-100">
                <Droplets className="w-4 h-4 text-sky-300 shrink-0" />
                <span>{data.current.relative_humidity_2m}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-100">
                <Wind className="w-4 h-4 text-slate-300 shrink-0" />
                <span>{Math.round(data.current.wind_speed_10m)} km/h</span>
              </div>
            </div>
          </div>

          {/* Hazard summary */}
          <div className="lg:col-span-8 p-6 sm:p-7 bg-black/20 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-3">Hazard summary</div>
            <div className="space-y-2">
              {hazards.map((h) => (
                <div
                  key={h.key}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {h.icon}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">{h.label}</div>
                      <div className="text-xs text-blue-200">{h.detail}</div>
                    </div>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-md border text-[11px] font-bold ${LEVELS[h.level].pill}`}>
                    {LEVELS[h.level].label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1">Recommended action</div>
              <div className="text-sm text-blue-50 leading-relaxed">{ACTIONS[overall]}</div>
            </div>
          </div>

          {/* 5-day forecast */}
          <div className="lg:col-span-12 px-6 sm:px-7 py-5 border-t border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-200 mb-3">5-day outlook</div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {data.daily.time.map((day, i) => (
                <div key={day} className="rounded-xl bg-white/5 border border-white/10 py-3 px-1">
                  <div className="text-[11px] font-semibold text-blue-100">{dayLabel(day, i)}</div>
                  <div className="flex justify-center my-2">
                    <WeatherIcon code={data.daily.weather_code[i]} className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold font-mono">
                    {Math.round(data.daily.temperature_2m_max[i])}°
                    <span className="text-blue-300 font-normal"> / {Math.round(data.daily.temperature_2m_min[i])}°</span>
                  </div>
                  <div className="text-[10px] text-sky-300 mt-1 flex items-center justify-center gap-0.5">
                    <Droplets className="w-3 h-3" />
                    {data.daily.precipitation_probability_max[i] ?? 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official sources and disclaimer */}
      <div className="px-6 sm:px-7 py-4 border-t border-white/10 bg-black/25">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={LIGTAS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
          >
            <span>Open DepEd LIGTAS+ map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={PANAHON_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors"
          >
            <span>PAGASA PANaHON</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href={PAGASA_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-colors"
          >
            <span>PAGASA forecast</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-blue-300">
          Indicative summary based on Open-Meteo forecast data, using PAGASA-style rainfall, wind, and heat bands. It is not an
          official advisory. Warnings, class suspensions, and resumptions are announced by PAGASA, DepEd, and local officials.
          {updatedAt &&
            ` Updated ${updatedAt.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' })}.`}
        </p>
      </div>
    </div>
  );
};
