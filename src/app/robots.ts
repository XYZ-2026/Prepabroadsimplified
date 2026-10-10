import type { MetadataRoute } from 'next';

function getValidSiteUrl(urlInput?: string): string {
  const fallback = 'https://clarvo.in';
  if (!urlInput) return fallback;
  let raw = urlInput.trim();
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = `https://${raw}`;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return fallback;
    }
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getValidSiteUrl(process.env.NEXT_PUBLIC_APP_URL);

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
