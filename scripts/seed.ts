/**
 * One-time seed: loads the sample Alcantara NHS content into Supabase.
 *
 *   1. Copy .env.example to .env and fill in all three values
 *      (SUPABASE_SERVICE_ROLE_KEY is in Supabase → Project Settings → API).
 *   2. npm install
 *   3. npm run seed
 *
 * The service-role key bypasses Row Level Security — keep it LOCAL.
 * Never commit .env and never add this key to Netlify.
 */
import { createClient } from '@supabase/supabase-js';
import {
  initialSchoolProfile, initialCampuses, initialNews, initialAwards, initialPrograms,
  initialEvents, initialAlbums, initialOrgChart, initialOrganizations,
  initialIssuances, initialUpdates, initialMonitoringRecords,
} from '../src/data/mockInitialData';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}
const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const flag = (d: any): boolean => d?.isPublished ?? d?.isActive ?? true;

async function load(table: string, items: any[], idOf: (d: any) => string = d => d.id) {
  const rows = items.map(d => ({ id: idOf(d), data: d, is_published: flag(d) }));
  const { error } = await supabase.from(table).upsert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✔ ${table}: ${rows.length} rows`);
}

async function main() {
  await load('school_profile', [initialSchoolProfile], () => 'main');
  await load('campuses', initialCampuses);
  await load('news', initialNews);
  await load('awards', initialAwards);
  await load('programs', initialPrograms);
  await load('events', initialEvents);
  await load('albums', initialAlbums);
  await load('org_chart', initialOrgChart);
  await load('organizations', initialOrganizations);
  // Placeholder download links are cleared: attach real Google Drive links in the Admin Console.
  await load('issuances', initialIssuances.map(i => ({ ...i, downloadUrl: '' })));
  await load('updates', initialUpdates);
  await load('monitoring', initialMonitoringRecords);
  console.log('\nSeed complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
