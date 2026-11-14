/**
 * Canonical public origin for SEO-facing URLs (canonicals, sitemap, OG, JSON-LD).
 * Never returns localhost/127.0.0.1 — a misconfigured NEXT_PUBLIC_APP_URL in
 * production must not leak into crawlable metadata.
 */
const FALLBACK = 'https://clarvo.in';

export function getValidSiteUrl(urlInput: string | undefined = process.env.NEXT_PUBLIC_APP_URL): string {
  if (!urlInput) return FALLBACK;
  let raw = urlInput.trim();
  if (!raw) return FALLBACK;
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  try {
    const parsed = new URL(raw);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return FALLBACK;
    // Always canonicalise to the apex host.
    return parsed.origin.replace('://www.', '://');
  } catch {
    return FALLBACK;
  }
}

export const SITE_URL = getValidSiteUrl();
