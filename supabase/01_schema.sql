-- =====================================================================
-- School360 · Alcantara National High School (ID 301747)
-- 01_schema.sql  — run FIRST in Supabase → SQL Editor → New query
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. USERS: approved roster + profiles
-- ---------------------------------------------------------------------
create table if not exists public.approved_users (
  id            text primary key default ('appr-' || replace(gen_random_uuid()::text, '-', '')),
  email         text not null,
  full_name     text not null,
  intended_role text not null check (intended_role in ('teacher', 'admin')),
  department    text not null default '',
  status        text not null default 'approved' check (status in ('approved', 'pending', 'revoked')),
  added_by      text not null default '',
  added_at      date not null default current_date
);
create unique index if not exists approved_users_email_key on public.approved_users (lower(email));

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  full_name   text not null,
  role        text not null check (role in ('teacher', 'admin')),
  department  text,
  position    text,
  employee_id text,
  avatar_url  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  last_login  timestamptz
);

-- Role of the currently signed-in user (NULL if signed out or deactivated).
-- SECURITY DEFINER so it can be used inside RLS policies without recursion.
create or replace function public.app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and is_active
$$;

-- Block sign-ups from emails that are not on the approved roster, and
-- create the matching profile (role comes from the roster, never the client).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  appr public.approved_users%rowtype;
begin
  select * into appr
  from public.approved_users
  where lower(email) = lower(new.email) and status = 'approved';

  if not found then
    raise exception 'EMAIL_NOT_APPROVED';
  end if;

  insert into public.profiles (id, email, full_name, role, department, position)
  values (
    new.id,
    lower(new.email),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), appr.full_name),
    appr.intended_role,
    appr.department,
    case when appr.intended_role = 'admin' then 'Administrator' else 'Faculty Member' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profile role / active flag in sync when the roster changes.
create or replace function public.sync_profile_from_roster()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    update public.profiles set is_active = false where lower(email) = lower(old.email);
    return old;
  end if;
  update public.profiles
     set role       = new.intended_role,
         department = new.department,
         is_active  = (new.status = 'approved')
   where lower(email) = lower(new.email);
  return new;
end;
$$;

drop trigger if exists on_roster_changed on public.approved_users;
create trigger on_roster_changed
  after update or delete on public.approved_users
  for each row execute function public.sync_profile_from_roster();

-- Records last login (called by the app after sign-in).
create or replace function public.touch_login()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles set last_login = now() where id = auth.uid();
$$;
revoke all on function public.touch_login() from public, anon;
grant execute on function public.touch_login() to authenticated;

-- RLS: users
alter table public.approved_users enable row level security;
alter table public.profiles       enable row level security;

drop policy if exists "roster admin all" on public.approved_users;
create policy "roster admin all" on public.approved_users
  for all to authenticated
  using (public.app_role() = 'admin')
  with check (public.app_role() = 'admin');

drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.app_role() = 'admin');

drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles
  for update to authenticated
  using (public.app_role() = 'admin')
  with check (public.app_role() = 'admin');
-- (no insert/delete policies: profiles are created only by the trigger above)

-- ---------------------------------------------------------------------
-- 2. CONTENT TABLES
--    Each row = id + the full record as JSON (matches the app's TypeScript
--    types) + is_published so Row Level Security can hide drafts.
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2a. PUBLIC tables: anyone reads published rows; only admins write.
do $$
declare
  t text;
begin
  foreach t in array array[
    'school_profile', 'campuses', 'news', 'awards', 'programs',
    'events', 'albums', 'org_chart', 'organizations'
  ] loop
    execute format($f$
      create table if not exists public.%I (
        id           text primary key,
        data         jsonb not null,
        is_published boolean not null default true,
        updated_at   timestamptz not null default now()
      )$f$, t);
    execute format('alter table public.%I enable row level security', t);

    execute format('drop trigger if exists touch_%1$s on public.%1$I', t);
    execute format('create trigger touch_%1$s before update on public.%1$I
                    for each row execute function public.touch_updated_at()', t);

    execute format('drop policy if exists "read published" on public.%I', t);
    execute format($f$create policy "read published" on public.%I
      for select to anon, authenticated
      using (is_published or public.app_role() = 'admin')$f$, t);

    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format($f$create policy "admin insert" on public.%I
      for insert to authenticated with check (public.app_role() = 'admin')$f$, t);

    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format($f$create policy "admin update" on public.%I
      for update to authenticated
      using (public.app_role() = 'admin') with check (public.app_role() = 'admin')$f$, t);

    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format($f$create policy "admin delete" on public.%I
      for delete to authenticated using (public.app_role() = 'admin')$f$, t);
  end loop;
end $$;

-- 2b. STAFF-ONLY tables: only signed-in teachers/admins can read.
do $$
declare
  t text;
begin
  foreach t in array array['issuances', 'updates', 'monitoring'] loop
    execute format($f$
      create table if not exists public.%I (
        id           text primary key,
        data         jsonb not null,
        is_published boolean not null default true,
        updated_at   timestamptz not null default now()
      )$f$, t);
    execute format('alter table public.%I enable row level security', t);

    execute format('drop trigger if exists touch_%1$s on public.%1$I', t);
    execute format('create trigger touch_%1$s before update on public.%1$I
                    for each row execute function public.touch_updated_at()', t);

    execute format('drop policy if exists "staff read" on public.%I', t);
    execute format($f$create policy "staff read" on public.%I
      for select to authenticated
      using (public.app_role() in ('teacher', 'admin'))$f$, t);

    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format($f$create policy "admin insert" on public.%I
      for insert to authenticated with check (public.app_role() = 'admin')$f$, t);

    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format($f$create policy "admin delete" on public.%I
      for delete to authenticated using (public.app_role() = 'admin')$f$, t);

    -- Updates: admins everywhere; teachers only on monitoring (they submit reports).
    execute format('drop policy if exists "update" on public.%I', t);
    if t = 'monitoring' then
      execute format($f$create policy "update" on public.%I
        for update to authenticated
        using (public.app_role() in ('teacher', 'admin'))
        with check (public.app_role() in ('teacher', 'admin'))$f$, t);
    else
      execute format($f$create policy "update" on public.%I
        for update to authenticated
        using (public.app_role() = 'admin') with check (public.app_role() = 'admin')$f$, t);
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 3. AUDIT LOG (append-only: no update/delete policies exist)
-- ---------------------------------------------------------------------
create table if not exists public.audit_logs (
  id          text primary key,
  created_at  timestamptz not null default now(),
  actor_email text not null,
  actor_role  text not null,
  action      text not null,
  module      text not null,
  item_title  text not null default '',
  details     text not null default ''
);
create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
alter table public.audit_logs enable row level security;

drop policy if exists "audit admin read" on public.audit_logs;
create policy "audit admin read" on public.audit_logs
  for select to authenticated using (public.app_role() = 'admin');

drop policy if exists "audit staff insert" on public.audit_logs;
create policy "audit staff insert" on public.audit_logs
  for insert to authenticated
  with check (
    public.app_role() in ('teacher', 'admin')
    and actor_email = lower(auth.jwt() ->> 'email')
  );
