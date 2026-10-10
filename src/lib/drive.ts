/**
 * Google Drive helpers.
 *
 * Files (images, memos, PDFs) are stored in the school's Google Drive.
 * Admins paste the normal Drive "share" link; this module extracts the file ID
 * and builds the URLs the website needs.
 *
 * Sharing requirement (in Google Drive): set the file/folder to
 * "Anyone with the link → Viewer" so images load on the public site.
 * For staff-only documents you may instead restrict to your school's
 * Google Workspace domain (viewers must then be signed in to Google).
 */

const ID_PATTERNS: RegExp[] = [
  /drive\.google\.com\/file\/d\/([\w-]{10,})/,
  /drive\.google\.com\/(?:open|uc|thumbnail)\?(?:[^#]*&)?id=([\w-]{10,})/,
  /docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/([\w-]{10,})/,
  /lh3\.googleusercontent\.com\/d\/([\w-]{10,})/,
];

/** Returns the Drive file ID if the URL is a Google Drive link, otherwise null. */
export function extractDriveId(url: string | undefined | null): string | null {
  if (!url) return null;
  for (const re of ID_PATTERNS) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export const isDriveUrl = (url?: string | null) => extractDriveId(url) !== null;

/** Embeddable image URL for <img src>. Non-Drive URLs are returned unchanged. */
export function toImageUrl(url: string | undefined | null, width = 1600): string {
  if (!url) return '';
  const id = extractDriveId(url);
  return id ? `https://lh3.googleusercontent.com/d/${id}=w${width}` : url;
}

/** In-browser preview page (PDF/Docs viewer). */
export function toPreviewUrl(url: string): string {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/file/d/${id}/view` : url;
}

/** Direct download URL. */
export function toDownloadUrl(url: string): string {
  const id = extractDriveId(url);
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

/** Keys whose values are image links and should be normalised on save/load. */
const IMAGE_KEYS = new Set(['imageUrl', 'logoUrl', 'coverImage', 'avatarUrl']);

/** Deep-normalises Drive links inside a record (images → embeddable URLs). */
export function normalizeDriveLinks<T>(value: T): T {
  if (Array.isArray(value)) return value.map(normalizeDriveLinks) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (IMAGE_KEYS.has(k) && typeof v === 'string') out[k] = toImageUrl(v);
      else out[k] = normalizeDriveLinks(v);
    }
    return out as T;
  }
  return value;
}
