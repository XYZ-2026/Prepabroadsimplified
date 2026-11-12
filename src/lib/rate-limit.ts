// Simple in-memory sliding-window rate limiter (per server instance).
// Good enough to blunt brute-force and form spam on a single Node server.

const buckets = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);

  if (hits.length >= max) {
    buckets.set(key, hits);
    return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup so the map cannot grow without bound
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
    }
  }
  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(req: { headers: Headers }): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/** CSRF defence for cookie-authenticated mutating routes: Origin (when sent) must match Host. */
export function isSameOrigin(req: { headers: Headers }): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser clients / same-origin GET-like fetches
  try {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
