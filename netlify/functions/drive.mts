/**
 * Netlify Function: /.netlify/functions/drive
 *
 * Lets a signed-in School360 ADMIN upload files straight into the school's
 * Google Shared Drive folder. The browser never sees Google credentials.
 *
 *   POST { action: "start",    fileName, mimeType, size }  -> { uploadUrl }
 *        (browser then PUTs the file bytes directly to uploadUrl — no size limit from Netlify)
 *   POST { action: "finalize", fileId }                    -> { fileId, name, mimeType, size, viewUrl, ... }
 *
 * Required environment variables (Netlify → Site configuration → Environment variables):
 *   GOOGLE_CLIENT_EMAIL   service-account email (client_email in the JSON key)
 *   GOOGLE_PRIVATE_KEY    service-account private key (private_key in the JSON key)
 *   DRIVE_FOLDER          link or ID of the Shared Drive folder to upload into
 *   VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY   (already set for the frontend)
 * Optional:
 *   DRIVE_MAKE_PUBLIC     "false" to NOT set "anyone with the link can view" (default: true)
 *   DRIVE_MAX_MB          max upload size in MB (default 50)
 */
import { JWT } from 'google-auth-library';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const ALLOWED_MIME = [
  /^image\/(png|jpe?g|webp|gif)$/,
  /^application\/pdf$/,
  /^application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet|presentationml\.presentation)$/,
  /^application\/(msword|vnd\.ms-excel|vnd\.ms-powerpoint)$/,
];

function folderId(): string {
  const raw = (process.env.DRIVE_FOLDER || '').trim();
  const m = raw.match(/\/folders\/([\w-]+)/) || raw.match(/[?&]id=([\w-]+)/);
  return m ? m[1] : raw;
}

/** Verifies the Supabase session token and that the caller is an active admin. */
async function requireAdmin(req: Request): Promise<{ ok: true; email: string } | { ok: false; res: Response }> {
  const url = process.env.VITE_SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anon) return { ok: false, res: json({ error: 'Server is missing Supabase settings.' }, 500) };

  const auth = req.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return { ok: false, res: json({ error: 'Not signed in.' }, 401) };

  const headers = { apikey: anon, Authorization: `Bearer ${token}` };
  const userRes = await fetch(`${url}/auth/v1/user`, { headers });
  if (!userRes.ok) return { ok: false, res: json({ error: 'Session expired. Please sign in again.' }, 401) };
  const user = await userRes.json();

  // RLS lets a user read only their own profile row, so this cannot be spoofed.
  const profRes = await fetch(
    `${url}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role,is_active`,
    { headers }
  );
  const rows = profRes.ok ? await profRes.json() : [];
  if (!rows[0] || rows[0].role !== 'admin' || !rows[0].is_active) {
    return { ok: false, res: json({ error: 'Only administrators can upload files.' }, 403) };
  }
  return { ok: true, email: user.email };
}

async function googleToken(): Promise<string> {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!email || !key) throw new Error('Google service account is not configured on the server.');
  const client = new JWT({ email, key, scopes: ['https://www.googleapis.com/auth/drive'] });
  const { token } = await client.getAccessToken();
  if (!token) throw new Error('Could not obtain a Google access token.');
  return token;
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const admin = await requireAdmin(req);
  if ('res' in admin) return admin.res;

  const folder = folderId();
  if (!folder) return json({ error: 'DRIVE_FOLDER is not configured on the server.' }, 500);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'Invalid request.' }, 400); }

  try {
    // ---------------------------------------------------------- start
    if (body.action === 'start') {
      const fileName = String(body.fileName || '').replace(/[\\/:*?"<>|]/g, '_').slice(0, 180);
      const mimeType = String(body.mimeType || '');
      const size = Number(body.size) || 0;
      const maxMb = Number(process.env.DRIVE_MAX_MB) || 50;

      if (!fileName) return json({ error: 'Missing file name.' }, 400);
      if (!ALLOWED_MIME.some(re => re.test(mimeType))) {
        return json({ error: 'File type not allowed. Use images, PDF, Word, Excel or PowerPoint.' }, 400);
      }
      if (size <= 0 || size > maxMb * 1024 * 1024) {
        return json({ error: `File must be between 1 byte and ${maxMb} MB.` }, 400);
      }

      const token = await googleToken();
      const origin = req.headers.get('origin') || new URL(req.url).origin;
      const init = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,mimeType,size',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Upload-Content-Type': mimeType,
            'X-Upload-Content-Length': String(size),
            Origin: origin, // allows the browser to PUT to the session URL (CORS)
          },
          body: JSON.stringify({ name: fileName, parents: [folder] }),
        }
      );
      const uploadUrl = init.headers.get('location');
      if (!init.ok || !uploadUrl) {
        const detail = await init.text();
        console.error('Drive start failed', init.status, detail);
        return json({ error: 'Google Drive refused the upload. Check that the service account is a member of the Shared Drive folder.' }, 502);
      }
      return json({ uploadUrl });
    }

    // ------------------------------------------------------- finalize
    if (body.action === 'finalize') {
      const fileId = String(body.fileId || '');
      if (!/^[\w-]{10,}$/.test(fileId)) return json({ error: 'Invalid file id.' }, 400);

      const token = await googleToken();
      const meta = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true&fields=id,name,mimeType,size,parents`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!meta.ok) return json({ error: 'Uploaded file was not found in Drive.' }, 404);
      const file = await meta.json();
      if (!Array.isArray(file.parents) || !file.parents.includes(folder)) {
        return json({ error: 'File is not inside the configured school folder.' }, 403);
      }

      let publicOk = true;
      if (process.env.DRIVE_MAKE_PUBLIC !== 'false') {
        const perm = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'reader', type: 'anyone' }),
          }
        );
        if (!perm.ok) {
          publicOk = false;
          console.error('Drive permission failed', perm.status, await perm.text());
        }
      }

      console.log(`Drive upload by ${admin.email}: ${file.name} (${fileId})`);
      return json({
        fileId,
        name: file.name,
        mimeType: file.mimeType,
        size: Number(file.size) || 0,
        viewUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
        publicLinkFailed: !publicOk,
      });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch (e: any) {
    console.error('Drive function error', e);
    return json({ error: e?.message || 'Upload failed.' }, 500);
  }
};
