# School360 — Alcantara National High School (ID 301747)

School website + staff portal.
**Frontend:** React + Vite + Tailwind (hosted on Netlify) ·
**Backend:** Supabase (Auth + Postgres with Row Level Security) ·
**Files:** uploaded from the Admin Console straight into the school's Google Shared Drive (a Netlify function does the upload; links are stored in the database).

## 1. Supabase setup (one time)

1. Create a project at https://supabase.com.
2. **SQL Editor → New query**: paste and run `supabase/01_schema.sql`.
3. Edit `supabase/02_first_admin.sql` (your admin email + name) and run it.
4. **Authentication → Providers → Email**: keep *Enable Email provider* ON and keep
   **Confirm email ON** (this proves people own the email they register with).
5. **Authentication → URL Configuration**: set *Site URL* to your Netlify URL
   (e.g. `https://school360-alcantara.netlify.app`) and add the same URL under *Redirect URLs*
   (add `http://localhost:3000` too if you test locally).
6. **Project Settings → API**: copy the *Project URL* and the *anon public* key.

## 2. Load the sample content (optional, one time, from your computer)

```bash
cp .env.example .env      # fill in the 3 values (service_role key from Project Settings → API)
npm install
npm run seed
```
`.env` is git-ignored. **Never** put the service_role key on GitHub or Netlify.

## 3. Google Drive uploads (one time) — Option A, recommended

Admins click **Upload to Drive** in the Admin Console; the file goes into your Drive folder.
The admin signs in with their Google account the first time (that account must have **edit access to the folder**).

1. https://console.cloud.google.com → create/pick a project → **APIs & Services → Library → Google Drive API → Enable**.
2. **APIs & Services → OAuth consent screen**: choose **Internal** if your school uses Google Workspace
   (otherwise *External* and add the admins' Google emails under *Test users*).
3. **Credentials → Create credentials → OAuth client ID → Web application**. Under *Authorized JavaScript origins* add
   your Netlify URL (e.g. `https://school360-alcantara.netlify.app`) and `http://localhost:3000`. Copy the **Client ID**.
4. In Google Drive create the upload folder (inside the school Shared Drive if you have one) and copy its ID or link.
5. Open **`src/lib/driveConfig.ts`** and paste the two values (Client ID and folder ID/link), commit, push.
   (Or set `VITE_GOOGLE_CLIENT_ID` and `VITE_DRIVE_FOLDER_ID` in Netlify instead.) Neither value is a secret.

### Option B — service account (no Google sign-in popup)
If `driveConfig.ts` is left unfilled, the app uses the Netlify function instead (`netlify/functions/drive.mts`):
create a service account, add its email as **Content manager** on the Shared Drive, then set `GOOGLE_CLIENT_EMAIL`,
`GOOGLE_PRIVATE_KEY` and `DRIVE_FOLDER` in Netlify and redeploy.

**Public viewing:** each uploaded file is set to "anyone with the link can view" so photos show on the website.
If your Workspace blocks public link sharing on that folder, uploads still work but visitors won't see the images
until link sharing is allowed for it.

## 4. Deploy

1. Push this folder to a GitHub repository.
2. Netlify → *Add new site → Import from Git* → pick the repo (build settings are read from `netlify.toml`).
3. *Site configuration → Environment variables*, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Then open the site → **Sign In → Verify Authorized Email**, use the admin email from step 1.3 and create your password.

## 5. Daily use

- **Add teachers:** Admin Console → User Directory → add their email + role. They then register themselves
  from *Verify Authorized Email*. Emails not on this list cannot create an account.
- **Images & documents:** in the Admin Console click **Upload to Drive** in the form (news cover image, org-chart photo,
  other images, issuance documents). The file goes into the school Shared Drive folder and the link is filled in
  automatically. You can still paste an existing Google Drive link instead. Only administrators can upload.
  Staff-only memos: the link is only shown to signed-in staff, but anyone who has the raw link can open it
  (use `DRIVE_MAKE_PUBLIC=false` and share with your Workspace domain for stricter control).
- **Revoking access:** set a user's status to *revoked* in User Directory — their account is deactivated immediately.

## Local development

```bash
cp .env.example .env
npm install
npm run dev            # Option A uploads work locally (http://localhost:3000 must be an authorized origin)
npx netlify dev        # needed only to test Option B (service account function)
```

## Security model (what actually protects data)

Row Level Security in `supabase/01_schema.sql` enforces: public sees published content only; teachers additionally read
issuances/updates/monitoring and update monitoring submissions; admins manage everything; the audit log is append-only.
The checks in the React code are only for friendly error messages.
"# school360-alcantara-nhs" 
