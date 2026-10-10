import {
  SchoolProfileData, Campus, NewsItem, AwardItem, ProgramProject, SchoolEvent,
  GalleryAlbum, OrgChartNode, SchoolOrganization, SchoolIssuance, SchoolUpdate,
  MonitoringRecord, ApprovedUser, UserProfile, AuditLog, UserRole
} from '../types';
import { initialSchoolProfile } from '../data/mockInitialData';
import { supabase } from '../lib/supabase';
import { normalizeDriveLinks, toDownloadUrl } from '../lib/drive';

/**
 * SchoolStore — in-memory cache backed by Supabase.
 *
 *  • hydrate() loads everything the current user is allowed to see (RLS decides).
 *  • Reads are synchronous from the cache, so UI components stay simple.
 *  • Writes update the cache immediately and write through to Supabase.
 *    If Supabase rejects a write (e.g. not an admin), the cache is reloaded
 *    and an error is broadcast to the UI (see onSyncError).
 *
 * The assert*() checks below are only for friendly UX. Real enforcement is
 * Row Level Security in supabase/01_schema.sql.
 */

type DocTable =
  | 'school_profile' | 'campuses' | 'news' | 'awards' | 'programs' | 'events'
  | 'albums' | 'org_chart' | 'organizations' | 'issuances' | 'updates' | 'monitoring';

const PUBLIC_TABLES: DocTable[] = [
  'school_profile', 'campuses', 'news', 'awards', 'programs', 'events',
  'albums', 'org_chart', 'organizations'
];
const STAFF_TABLES: DocTable[] = ['issuances', 'updates', 'monitoring'];

const publishedFlag = (d: any): boolean => d?.isPublished ?? d?.isActive ?? true;

const fmtTs = (iso: string) => new Date(iso).toISOString().replace('T', ' ').substring(0, 19);

class SchoolStore {
  private schoolProfile: SchoolProfileData = { ...initialSchoolProfile };
  private campuses: Campus[] = [];
  private news: NewsItem[] = [];
  private awards: AwardItem[] = [];
  private programs: ProgramProject[] = [];
  private events: SchoolEvent[] = [];
  private albums: GalleryAlbum[] = [];
  private orgChart: OrgChartNode[] = [];
  private organizations: SchoolOrganization[] = [];
  private issuances: SchoolIssuance[] = [];
  private updates: SchoolUpdate[] = [];
  private monitoring: MonitoringRecord[] = [];
  private approvedUsers: ApprovedUser[] = [];
  private profiles: UserProfile[] = [];
  private auditLogs: AuditLog[] = [];
  private currentUser: UserProfile | null = null;

  private errorListeners = new Set<(message: string) => void>();
  public lastLoadError: string | null = null;

  // ------------------------------------------------------------------
  // Error broadcasting
  // ------------------------------------------------------------------
  public onSyncError(fn: (message: string) => void): () => void {
    this.errorListeners.add(fn);
    return () => this.errorListeners.delete(fn);
  }

  private syncFailed(action: string, err: { message?: string } | string) {
    const reason = typeof err === 'string' ? err : err?.message || 'unknown error';
    console.error(`[School360] ${action} failed:`, reason);
    this.errorListeners.forEach(fn =>
      fn(`Could not save changes (${action}): ${reason}. The page data has been reloaded.`)
    );
    void this.hydrate();
  }

  // ------------------------------------------------------------------
  // Session
  // ------------------------------------------------------------------
  public getCurrentUser(): UserProfile | null { return this.currentUser; }
  public getCurrentRole(): UserRole { return this.currentUser ? this.currentUser.role : 'public'; }
  public setCurrentUser(user: UserProfile | null) { this.currentUser = user; }

  private assertAdmin(what: string) {
    const role = this.getCurrentRole();
    if (role !== 'admin') {
      throw new Error(`Unauthorized: Administrator permissions required to ${what}.`);
    }
  }

  private assertTeacherOrAdmin(what: string) {
    const role = this.getCurrentRole();
    if (role !== 'teacher' && role !== 'admin') {
      throw new Error(`Access Denied: Protected teacher or administrator access required to ${what}.`);
    }
  }

  // ------------------------------------------------------------------
  // Loading from Supabase
  // ------------------------------------------------------------------
  private async fetchDocs<T>(table: DocTable): Promise<T[] | null> {
    const { data, error } = await supabase.from(table).select('id, data');
    if (error) {
      console.error(`[School360] load ${table}:`, error.message);
      this.lastLoadError = error.message;
      return null;
    }
    return (data || []).map(r => normalizeDriveLinks(r.data) as T);
  }

  public async hydrate(): Promise<void> {
    this.lastLoadError = null;
    const role = this.getCurrentRole();

    const [profileDocs, campuses, news, awards, programs, events, albums, orgChart, orgs] =
      await Promise.all(PUBLIC_TABLES.map(t => this.fetchDocs<any>(t)));

    if (profileDocs && profileDocs.length > 0) this.schoolProfile = profileDocs[0];
    if (campuses) this.campuses = campuses;
    if (news) this.news = news;
    if (awards) this.awards = awards;
    if (programs) this.programs = programs;
    if (events) this.events = events;
    if (albums) this.albums = albums;
    if (orgChart) this.orgChart = orgChart;
    if (orgs) this.organizations = orgs;

    if (role === 'teacher' || role === 'admin') {
      const [iss, upd, mon] = await Promise.all(STAFF_TABLES.map(t => this.fetchDocs<any>(t)));
      if (iss) this.issuances = iss;
      if (upd) this.updates = upd;
      if (mon) this.monitoring = mon;
    } else {
      this.issuances = []; this.updates = []; this.monitoring = [];
    }

    if (role === 'admin') {
      const [ap, pr, au] = await Promise.all([
        supabase.from('approved_users').select('*').order('added_at', { ascending: false }),
        supabase.from('profiles').select('*'),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200),
      ]);
      if (ap.data) {
        this.approvedUsers = ap.data.map((r: any): ApprovedUser => ({
          id: r.id, email: r.email, fullName: r.full_name, intendedRole: r.intended_role,
          department: r.department, status: r.status, addedBy: r.added_by, addedAt: r.added_at,
        }));
      }
      if (pr.data) {
        this.profiles = pr.data.map((r: any): UserProfile => ({
          id: r.id, email: r.email, fullName: r.full_name, role: r.role,
          department: r.department ?? undefined, position: r.position ?? undefined,
          employeeId: r.employee_id ?? undefined, avatarUrl: r.avatar_url ?? undefined,
          isActive: r.is_active, createdAt: r.created_at, lastLogin: r.last_login ?? undefined,
        }));
      }
      if (au.data) {
        this.auditLogs = au.data.map((r: any): AuditLog => ({
          id: r.id, timestamp: fmtTs(r.created_at), actorEmail: r.actor_email,
          actorRole: r.actor_role, action: r.action, module: r.module,
          itemTitle: r.item_title, details: r.details,
        }));
      }
    } else {
      this.approvedUsers = []; this.profiles = []; this.auditLogs = [];
    }
  }

  // ------------------------------------------------------------------
  // Write-through helpers
  // ------------------------------------------------------------------
  private pushDoc(table: DocTable, item: any, docId?: string) {
    supabase
      .from(table)
      .upsert({ id: docId ?? item.id, data: item, is_published: publishedFlag(item) })
      .then(({ error }) => { if (error) this.syncFailed(`saving to ${table}`, error); });
  }

  private removeDoc(table: DocTable, id: string) {
    supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select('id')
      .then(({ data, error }) => {
        if (error) this.syncFailed(`deleting from ${table}`, error);
        else if (!data || data.length === 0) this.syncFailed(`deleting from ${table}`, 'permission denied');
      });
  }

  /** Replace-or-add in a list; returns true when it was an update. */
  private upsertLocal<T extends { id: string }>(list: T[], item: T, prepend: boolean): boolean {
    const idx = list.findIndex(x => x.id === item.id);
    if (idx >= 0) { list[idx] = item; return true; }
    if (prepend) list.unshift(item); else list.push(item);
    return false;
  }

  private logAudit(action: AuditLog['action'], module: string, itemTitle: string, details: string) {
    const user = this.currentUser;
    if (!user) return;
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
      timestamp: fmtTs(new Date().toISOString()),
      actorEmail: user.email.toLowerCase(),
      actorRole: user.role,
      action, module, itemTitle, details,
    };
    if (user.role === 'admin') {
      this.auditLogs.unshift(log);
      if (this.auditLogs.length > 200) this.auditLogs = this.auditLogs.slice(0, 200);
    }
    supabase.from('audit_logs').insert({
      id: log.id, actor_email: log.actorEmail, actor_role: log.actorRole,
      action, module, item_title: itemTitle, details,
    }).then(({ error }) => { if (error) console.error('[School360] audit log failed:', error.message); });
  }

  /** Called by AuthContext after sign-in / sign-out. */
  public recordSessionEvent(action: 'LOGIN' | 'LOGOUT', user: UserProfile) {
    const prev = this.currentUser;
    this.currentUser = user;
    this.logAudit(action, 'Authentication', user.email, action === 'LOGIN' ? 'Signed in to School360' : 'Signed out');
    this.currentUser = prev;
  }

  // ------------------------------------------------------------------
  // School Profile
  // ------------------------------------------------------------------
  public getSchoolProfile(): SchoolProfileData { return { ...this.schoolProfile }; }

  public updateSchoolProfile(updated: SchoolProfileData): void {
    this.assertAdmin('update school profile');
    this.schoolProfile = normalizeDriveLinks({ ...updated });
    this.pushDoc('school_profile', this.schoolProfile, 'main');
    this.logAudit('UPDATE', 'School Profile', updated.schoolName, 'Updated school metadata, leadership details, and contact info');
  }

  // ------------------------------------------------------------------
  // Campuses
  // ------------------------------------------------------------------
  public getCampuses(): Campus[] { return [...this.campuses]; }

  public saveCampus(raw: Campus): void {
    this.assertAdmin('manage campus');
    const campus = normalizeDriveLinks(raw);
    const isUpdate = this.upsertLocal(this.campuses, campus, false);
    this.pushDoc('campuses', campus);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'Campuses', campus.name, isUpdate ? 'Updated campus details' : 'Added new school campus');
  }

  public deleteCampus(id: string): void {
    this.assertAdmin('delete campus');
    const existing = this.campuses.find(c => c.id === id);
    if (!existing) return;
    this.campuses = this.campuses.filter(c => c.id !== id);
    this.removeDoc('campuses', id);
    this.logAudit('DELETE', 'Campuses', existing.name, 'Deleted campus');
  }

  // ------------------------------------------------------------------
  // News
  // ------------------------------------------------------------------
  public getNews(includeUnpublished = false): NewsItem[] {
    const list = includeUnpublished && this.getCurrentRole() === 'admin'
      ? [...this.news] : this.news.filter(n => n.isPublished);
    return list.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  }

  public saveNews(raw: NewsItem): void {
    this.assertAdmin('manage news');
    const item = normalizeDriveLinks(raw);
    const isUpdate = this.upsertLocal(this.news, item, true);
    this.pushDoc('news', item);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'News & Updates', item.title, isUpdate ? 'Updated news article' : 'Published new article');
  }

  public deleteNews(id: string): void {
    this.assertAdmin('delete news');
    const existing = this.news.find(n => n.id === id);
    if (!existing) return;
    this.news = this.news.filter(n => n.id !== id);
    this.removeDoc('news', id);
    this.logAudit('DELETE', 'News & Updates', existing.title, 'Deleted news article');
  }

  // ------------------------------------------------------------------
  // Awards
  // ------------------------------------------------------------------
  public getAwards(includeUnpublished = false): AwardItem[] {
    const list = includeUnpublished && this.getCurrentRole() === 'admin'
      ? [...this.awards] : this.awards.filter(a => a.isPublished);
    return list.sort((a, b) => new Date(b.dateAwarded).getTime() - new Date(a.dateAwarded).getTime());
  }

  public saveAward(raw: AwardItem): void {
    this.assertAdmin('manage awards');
    const award = normalizeDriveLinks(raw);
    const isUpdate = this.upsertLocal(this.awards, award, true);
    this.pushDoc('awards', award);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'Awards & Recognition', award.title, isUpdate ? 'Updated award' : 'Added award recognition');
  }

  public deleteAward(id: string): void {
    this.assertAdmin('delete award');
    const existing = this.awards.find(a => a.id === id);
    if (!existing) return;
    this.awards = this.awards.filter(a => a.id !== id);
    this.removeDoc('awards', id);
    this.logAudit('DELETE', 'Awards & Recognition', existing.title, 'Removed award recognition');
  }

  // ------------------------------------------------------------------
  // Programs & Projects
  // ------------------------------------------------------------------
  public getPrograms(includeUnpublished = false): ProgramProject[] {
    return includeUnpublished && this.getCurrentRole() === 'admin'
      ? [...this.programs] : this.programs.filter(p => p.isPublished);
  }

  public saveProgram(raw: ProgramProject): void {
    this.assertAdmin('manage programs');
    const prog = normalizeDriveLinks(raw);
    const isUpdate = this.upsertLocal(this.programs, prog, true);
    this.pushDoc('programs', prog);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'Programs & Projects', prog.title, isUpdate ? 'Updated program' : 'Created program');
  }

  public deleteProgram(id: string): void {
    this.assertAdmin('delete program');
    const existing = this.programs.find(p => p.id === id);
    if (!existing) return;
    this.programs = this.programs.filter(p => p.id !== id);
    this.removeDoc('programs', id);
    this.logAudit('DELETE', 'Programs & Projects', existing.title, 'Deleted program');
  }

  // ------------------------------------------------------------------
  // Events
  // ------------------------------------------------------------------
  public getEvents(includeUnpublished = false): SchoolEvent[] {
    const list = includeUnpublished && this.getCurrentRole() === 'admin'
      ? [...this.events] : this.events.filter(e => e.isPublished);
    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  public saveEvent(raw: SchoolEvent): void {
    this.assertAdmin('manage events');
    const ev = normalizeDriveLinks(raw);
    const isUpdate = this.upsertLocal(this.events, ev, false);
    this.pushDoc('events', ev);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'Events & Activities', ev.title, isUpdate ? 'Updated event details' : 'Scheduled new event');
  }

  public deleteEvent(id: string): void {
    this.assertAdmin('delete event');
    const existing = this.events.find(e => e.id === id);
    if (!existing) return;
    this.events = this.events.filter(e => e.id !== id);
    this.removeDoc('events', id);
    this.logAudit('DELETE', 'Events & Activities', existing.title, 'Deleted event');
  }

  // ------------------------------------------------------------------
  // Gallery
  // ------------------------------------------------------------------
  public getAlbums(includeUnpublished = false): GalleryAlbum[] {
    return includeUnpublished && this.getCurrentRole() === 'admin'
      ? [...this.albums] : this.albums.filter(a => a.isPublished);
  }

  public saveAlbum(raw: GalleryAlbum): void {
    this.assertAdmin('manage gallery');
    const album = normalizeDriveLinks(raw);
    const isUpdate = this.upsertLocal(this.albums, album, true);
    this.pushDoc('albums', album);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'Photo Gallery', album.title, isUpdate ? 'Updated gallery album' : 'Created new photo album');
  }

  public deleteAlbum(id: string): void {
    this.assertAdmin('delete gallery album');
    const existing = this.albums.find(a => a.id === id);
    if (!existing) return;
    this.albums = this.albums.filter(a => a.id !== id);
    this.removeDoc('albums', id);
    this.logAudit('DELETE', 'Photo Gallery', existing.title, 'Deleted gallery album');
  }

  // ------------------------------------------------------------------
  // Organizational Chart
  // ------------------------------------------------------------------
  public getOrgChart(): OrgChartNode[] { return [...this.orgChart].sort((a, b) => a.order - b.order); }

  public saveOrgChartNode(raw: OrgChartNode): void {
    this.assertAdmin('manage organizational chart');
    const node = normalizeDriveLinks(raw);
    const isUpdate = this.upsertLocal(this.orgChart, node, false);
    this.pushDoc('org_chart', node);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'Organizational Chart', node.fullName, isUpdate ? `Updated ${node.position}` : `Added ${node.position}`);
  }

  public deleteOrgChartNode(id: string): void {
    this.assertAdmin('delete organizational node');
    const existing = this.orgChart.find(n => n.id === id);
    if (!existing) return;
    this.orgChart = this.orgChart.filter(n => n.id !== id);
    this.removeDoc('org_chart', id);
    this.logAudit('DELETE', 'Organizational Chart', existing.fullName, 'Removed staff position');
  }

  // ------------------------------------------------------------------
  // School Organizations
  // ------------------------------------------------------------------
  public getOrganizations(): SchoolOrganization[] { return [...this.organizations]; }

  public getOrganizationByCode(code: string): SchoolOrganization | undefined {
    const c = code.toLowerCase();
    return this.organizations.find(o => o.code.toLowerCase() === c || o.acronym.toLowerCase() === c);
  }

  public saveOrganization(raw: SchoolOrganization): void {
    this.assertAdmin('manage school organizations');
    const org = normalizeDriveLinks(raw);
    const isUpdate = this.upsertLocal(this.organizations, org, false);
    this.pushDoc('organizations', org);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'School Organizations', org.name, isUpdate ? 'Updated organization details' : 'Added student organization');
  }

  public deleteOrganization(id: string): void {
    this.assertAdmin('delete organization');
    const existing = this.organizations.find(o => o.id === id);
    if (!existing) return;
    this.organizations = this.organizations.filter(o => o.id !== id);
    this.removeDoc('organizations', id);
    this.logAudit('DELETE', 'School Organizations', existing.name, 'Deleted organization');
  }

  // ------------------------------------------------------------------
  // PROTECTED: School Issuances (documents live in Google Drive)
  // ------------------------------------------------------------------
  public getIssuances(): SchoolIssuance[] {
    this.assertTeacherOrAdmin('view School Issuances');
    return [...this.issuances].sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime());
  }

  public saveIssuance(item: SchoolIssuance): void {
    this.assertAdmin('manage school issuances');
    const isUpdate = this.upsertLocal(this.issuances, item, true);
    this.pushDoc('issuances', item);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'School Issuances', item.issuanceNumber, isUpdate ? 'Updated official memorandum' : 'Issued new official memorandum');
  }

  public deleteIssuance(id: string): void {
    this.assertAdmin('delete school issuance');
    const existing = this.issuances.find(i => i.id === id);
    if (!existing) return;
    this.issuances = this.issuances.filter(i => i.id !== id);
    this.removeDoc('issuances', id);
    this.logAudit('DELETE', 'School Issuances', existing.issuanceNumber, 'Deleted school issuance');
  }

  /** Logs the download and returns the Google Drive download URL. */
  public downloadProtectedIssuance(id: string): { fileName: string; url: string } {
    this.assertTeacherOrAdmin('download protected issuance document');
    const item = this.issuances.find(i => i.id === id);
    if (!item) throw new Error('Document record not found');
    if (!item.downloadUrl || !/^https?:\/\//i.test(item.downloadUrl)) {
      throw new Error('No Google Drive link has been attached to this document yet. Please contact the administrator.');
    }
    this.logAudit('DOWNLOAD_PROTECTED', 'School Issuances', item.fileName, `Downloaded issuance document [${item.issuanceNumber}]`);
    return { fileName: item.fileName, url: toDownloadUrl(item.downloadUrl) };
  }

  // ------------------------------------------------------------------
  // PROTECTED: School Updates
  // ------------------------------------------------------------------
  public getSchoolUpdates(): SchoolUpdate[] {
    this.assertTeacherOrAdmin('view School Updates');
    return [...this.updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public saveSchoolUpdate(update: SchoolUpdate): void {
    this.assertAdmin('manage school updates');
    const isUpdate = this.upsertLocal(this.updates, update, true);
    this.pushDoc('updates', update);
    this.logAudit(isUpdate ? 'UPDATE' : 'CREATE', 'School Updates', update.title, isUpdate ? 'Updated internal faculty update' : 'Posted new internal update');
  }

  public deleteSchoolUpdate(id: string): void {
    this.assertAdmin('delete school update');
    const existing = this.updates.find(u => u.id === id);
    if (!existing) return;
    this.updates = this.updates.filter(u => u.id !== id);
    this.removeDoc('updates', id);
    this.logAudit('DELETE', 'School Updates', existing.title, 'Deleted internal update');
  }

  // ------------------------------------------------------------------
  // PROTECTED: School Monitoring
  // ------------------------------------------------------------------
  public getMonitoringRecords(): MonitoringRecord[] {
    this.assertTeacherOrAdmin('view School Monitoring records');
    return [...this.monitoring].sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
  }

  public saveMonitoringRecord(record: MonitoringRecord): void {
    const role = this.getCurrentRole();
    if (role !== 'teacher' && role !== 'admin') throw new Error('Unauthorized to manage monitoring records');
    const exists = this.monitoring.some(m => m.id === record.id);
    if (!exists && role !== 'admin') throw new Error('Only administrators can create new monitoring requirements.');
    this.upsertLocal(this.monitoring, record, true);
    this.pushDoc('monitoring', record);
    this.logAudit(exists ? 'UPDATE' : 'CREATE', 'School Monitoring', record.title,
      exists ? `Updated status to ${record.status}` : 'Created new monitoring report item');
  }

  public deleteMonitoringRecord(id: string): void {
    this.assertAdmin('delete monitoring record');
    const existing = this.monitoring.find(m => m.id === id);
    if (!existing) return;
    this.monitoring = this.monitoring.filter(m => m.id !== id);
    this.removeDoc('monitoring', id);
    this.logAudit('DELETE', 'School Monitoring', existing.title, 'Deleted monitoring record');
  }

  // ------------------------------------------------------------------
  // User directory (approved roster) — admin only
  // ------------------------------------------------------------------
  public getApprovedUsers(): ApprovedUser[] {
    this.assertAdmin('view approved user roster');
    return [...this.approvedUsers];
  }

  public saveApprovedUser(user: ApprovedUser): void {
    this.assertAdmin('manage approved user roster');
    const email = user.email.trim().toLowerCase();
    const clean: ApprovedUser = { ...user, email };
    const idx = this.approvedUsers.findIndex(u => u.id === clean.id || u.email.toLowerCase() === email);
    if (idx >= 0) this.approvedUsers[idx] = clean; else this.approvedUsers.unshift(clean);

    supabase.from('approved_users').upsert({
      id: clean.id, email: clean.email, full_name: clean.fullName,
      intended_role: clean.intendedRole, department: clean.department,
      status: clean.status, added_by: clean.addedBy || this.currentUser?.email || '',
      added_at: clean.addedAt || new Date().toISOString().substring(0, 10),
    }).then(({ error }) => { if (error) this.syncFailed('saving approved user', error); });

    this.logAudit(idx >= 0 ? 'ROLE_CHANGE' : 'CREATE', 'User Directory', clean.email,
      idx >= 0 ? `Updated status/role to ${clean.intendedRole}` : `Approved email for ${clean.intendedRole} role`);
  }

  public deleteApprovedUser(id: string): void {
    this.assertAdmin('revoke approved user');
    const existing = this.approvedUsers.find(u => u.id === id);
    if (!existing) return;
    this.approvedUsers = this.approvedUsers.filter(u => u.id !== id);
    supabase.from('approved_users').delete().eq('id', id).select('id')
      .then(({ data, error }) => {
        if (error) this.syncFailed('removing approved user', error);
        else if (!data || data.length === 0) this.syncFailed('removing approved user', 'permission denied');
      });
    this.logAudit('DELETE', 'User Directory', existing.email, 'Removed approved user authorization');
  }

  public getUserProfiles(): UserProfile[] {
    this.assertAdmin('view registered user profiles');
    return [...this.profiles];
  }

  // ------------------------------------------------------------------
  // Audit trail
  // ------------------------------------------------------------------
  public getAuditLogs(): AuditLog[] {
    this.assertAdmin('view system audit logs');
    return [...this.auditLogs];
  }
}

export const store = new SchoolStore();
