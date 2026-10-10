/** Google Maps helpers: the map follows the school address unless a custom embed link is saved. */
export function mapEmbedUrl(address: string, custom?: string): string {
  const c = (custom || '').trim();
  if (c) {
    // accept a pasted <iframe ...src="..."> snippet or a plain embed link
    const m = c.match(/src="([^"]+)"/);
    return m ? m[1] : c;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export function mapOpenUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function facebookUrl(page: string): string {
  const v = (page || '').trim();
  if (!v) return '';
  return /^https?:\/\//i.test(v) ? v : `https://${v.replace(/^\/+/, '')}`;
}
