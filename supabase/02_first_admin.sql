-- =====================================================================
-- 02_first_admin.sql — run SECOND, after editing the values below.
--
-- This puts the first administrator on the approved roster.
-- Then open the deployed site → Sign In → "Verify Authorized Email" tab
-- and create your password with this SAME email address.
-- After that, you can add teachers from Admin Console → User Directory.
-- =====================================================================
insert into public.approved_users (email, full_name, intended_role, department, status, added_by)
values (
  'REPLACE_WITH_ADMIN_EMAIL@example.com',   -- <-- your real school/admin email
  'REPLACE WITH FULL NAME',                 -- <-- e.g. 'Juan D. Dela Cruz'
  'admin',
  'Office of the Principal',
  'approved',
  'Initial setup'
)
on conflict ((lower(email))) do nothing;
