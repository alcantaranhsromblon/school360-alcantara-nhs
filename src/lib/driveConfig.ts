/**
 * ─────────────────────────────────────────────────────────────
 *  GOOGLE DRIVE SETTINGS  —  paste your two values here
 * ─────────────────────────────────────────────────────────────
 *  Neither value is a secret (an OAuth *Client ID* and a folder ID are
 *  safe to keep in the code). You can instead set them in Netlify as
 *  VITE_GOOGLE_CLIENT_ID and VITE_DRIVE_FOLDER_ID; those take priority.
 */

/** OAuth Client ID (Google Cloud → APIs & Services → Credentials → Web application).
 *  Looks like: 1234567890-abcdef....apps.googleusercontent.com */
export const DRIVE_CLIENT_ID: string =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
  '1047800559575-im9a1o6ntlg0bj77ujd4p4b1domdne92.apps.googleusercontent.com';

/** The Shared Drive folder where uploads go. Paste the folder ID or the full folder link.
 *  Looks like: 1GY_7iuX8a7N03F9F63V2uhy-Jv2QqfjG */
export const DRIVE_FOLDER: string =
  (import.meta.env.VITE_DRIVE_FOLDER_ID as string | undefined) ||
  '1GY_7iuX8a7N03F9F63V2uhy-Jv2QqfjG';

export function driveFolderId(): string {
  const raw = DRIVE_FOLDER.trim();
  const m = raw.match(/\/folders\/([\w-]+)/) || raw.match(/[?&]id=([\w-]+)/);
  return m ? m[1] : raw;
}

export const isBrowserDriveConfigured =
  DRIVE_CLIENT_ID.endsWith('.apps.googleusercontent.com') && /^[\w-]{10,}$/.test(driveFolderId());
