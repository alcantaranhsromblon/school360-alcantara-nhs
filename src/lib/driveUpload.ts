import { supabase } from './supabase';
import { isBrowserDriveConfigured } from './driveConfig';
import { uploadViaBrowser } from './driveBrowser';

export interface DriveUploadResult {
  fileId: string;
  name: string;
  mimeType: string;
  size: number;
  /** Share link (stored in the database) */
  viewUrl: string;
  publicLinkFailed: boolean;
}

const FN = '/.netlify/functions/drive';

async function callFn(body: object, token: string) {
  const res = await fetch(FN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Upload service error (${res.status})`);
  return data;
}

/**
 * Uploads a file to the school's Google Drive folder.
 *  • If a Google OAuth Client ID + folder are set in src/lib/driveConfig.ts → browser upload (admin signs in with Google).
 *  • Otherwise → Netlify function with a service account (see README, option B).
 */
export async function uploadToDrive(
  file: File,
  onProgress?: (percent: number) => void
): Promise<DriveUploadResult> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error('Please sign in again.');
  if (isBrowserDriveConfigured) {
    const okType = /^image\/(png|jpe?g|webp|gif)$|^application\/(pdf|msword|vnd\.ms-excel|vnd\.ms-powerpoint|vnd\.openxmlformats-officedocument\..+)$/.test(file.type);
    if (!okType) throw new Error('File type not allowed. Use images, PDF, Word, Excel or PowerPoint.');
    if (file.size > 50 * 1024 * 1024) throw new Error('File must be 50 MB or smaller.');
    return uploadViaBrowser(file, onProgress);
  }
  return uploadViaFunction(file, onProgress);
}

async function uploadViaFunction(
  file: File,
  onProgress?: (percent: number) => void
): Promise<DriveUploadResult> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Please sign in again.');

  // 1. ask the server for a one-time Google upload session
  const { uploadUrl } = await callFn(
    { action: 'start', fileName: file.name, mimeType: file.type, size: file.size },
    token
  );

  // 2. send the bytes straight to Google (supports large files + progress)
  const uploaded: { id: string } = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new Error('Network error while uploading to Google Drive.'));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch { reject(new Error('Unexpected response from Google Drive.')); }
      } else {
        reject(new Error(`Google Drive upload failed (${xhr.status}).`));
      }
    };
    xhr.send(file);
  });

  // 3. let the server verify the file and set "anyone with the link can view"
  return callFn({ action: 'finalize', fileId: uploaded.id }, token);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
