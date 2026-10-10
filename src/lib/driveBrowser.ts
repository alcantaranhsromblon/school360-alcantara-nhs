/**
 * Browser-side Google Drive upload using Google Identity Services (OAuth).
 * The admin signs in with their school Google account (that account must have
 * edit access to the folder) and the file is uploaded directly from the browser.
 */
import { DRIVE_CLIENT_ID, driveFolderId } from './driveConfig';

export interface BrowserUploadResult {
  fileId: string; name: string; mimeType: string; size: number;
  viewUrl: string; publicLinkFailed: boolean;
}

const SCOPE = 'https://www.googleapis.com/auth/drive';
let gisPromise: Promise<void> | null = null;
let cached: { token: string; expires: number } | null = null;

function loadGis(): Promise<void> {
  if ((window as any).google?.accounts?.oauth2) return Promise.resolve();
  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { gisPromise = null; reject(new Error('Could not load Google sign-in. Check your internet connection.')); };
      document.head.appendChild(s);
    });
  }
  return gisPromise;
}

/** Load Google's sign-in script ahead of time so the sign-in popup can open straight from a button click. */
export function preloadGis(): void { loadGis().catch(() => {}); }

/** True when a still-valid Google token is cached (no sign-in popup needed). */
export function hasDriveToken(): boolean {
  return !!cached && Date.now() < cached.expires - 30_000;
}

/** Opens the Google sign-in popup. Call this directly inside a click handler (before any await). */
export function signInToDrive(): Promise<void> {
  return getAccessToken().then(() => undefined);
}

async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expires - 30_000) return cached.token;
  // Only await when the script is not ready yet; awaiting would otherwise make the browser block the popup.
  if (!(window as any).google?.accounts?.oauth2) await loadGis();
  return new Promise((resolve, reject) => {
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: DRIVE_CLIENT_ID,
      scope: SCOPE,
      callback: (resp: any) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error_description || 'Google sign-in was cancelled or denied.'));
          return;
        }
        cached = { token: resp.access_token, expires: Date.now() + Number(resp.expires_in || 3600) * 1000 };
        resolve(resp.access_token);
      },
      error_callback: (err: any) => reject(new Error(err?.message || 'Google sign-in was cancelled.')),
    });
    client.requestAccessToken({ prompt: cached ? '' : 'select_account' });
  });
}

export async function uploadViaBrowser(
  file: File,
  onProgress?: (percent: number) => void
): Promise<BrowserUploadResult> {
  const token = await getAccessToken();
  const folder = driveFolderId();

  // 1. start a resumable upload session
  const init = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,mimeType,size',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': file.type || 'application/octet-stream',
        'X-Upload-Content-Length': String(file.size),
      },
      body: JSON.stringify({ name: file.name, parents: [folder] }),
    }
  );
  if (!init.ok) {
    cached = null;
    if (init.status === 404) throw new Error('Folder not found, or your Google account has no edit access to it.');
    if (init.status === 403) throw new Error('Google Drive denied access. Make sure the Drive API is enabled and your account can edit the folder.');
    throw new Error(`Google Drive refused the upload (${init.status}).`);
  }
  const sessionUrl = init.headers.get('Location');
  if (!sessionUrl) throw new Error('Google Drive did not return an upload address.');

  // 2. upload the bytes (with progress)
  const uploaded: { id: string; name: string; mimeType: string; size?: string } = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', sessionUrl);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.upload.onprogress = e => { if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100)); };
    xhr.onerror = () => reject(new Error('Network error while uploading to Google Drive.'));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); } catch { reject(new Error('Unexpected response from Google Drive.')); }
      } else reject(new Error(`Google Drive upload failed (${xhr.status}).`));
    };
    xhr.send(file);
  });

  // 3. "anyone with the link can view" so photos show on the public site
  let publicOk = true;
  const perm = await fetch(
    `https://www.googleapis.com/drive/v3/files/${uploaded.id}/permissions?supportsAllDrives=true`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    }
  );
  if (!perm.ok) publicOk = false;

  return {
    fileId: uploaded.id,
    name: uploaded.name,
    mimeType: uploaded.mimeType,
    size: Number(uploaded.size) || file.size,
    viewUrl: `https://drive.google.com/file/d/${uploaded.id}/view?usp=sharing`,
    publicLinkFailed: !publicOk,
  };
}
