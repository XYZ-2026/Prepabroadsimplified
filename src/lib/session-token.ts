// ═══════════════════════════════════════════════════════════
// Signed session tokens (HS256) — server-side only.
// The __session cookie holds one of these. Unsigned or tampered
// tokens are never accepted.
// ═══════════════════════════════════════════════════════════
import crypto from 'node:crypto';

export type SessionRole = 'admin' | 'counsellor' | 'student';

export interface SessionClaims {
  uid: string;
  email: string;
  name: string;
  role: SessionRole;
  admin: boolean;
  iss: string;
  iat: number;
  exp: number;
}

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 5; // 5 days
const ISSUER = 'clarvo';

let devFallbackSecret: string | null = null;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || '';
  if (secret.length >= 32) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters.');
  }
  // Development only. The proxy and the route handlers are bundled separately, so a random
  // per-module secret would make the proxy reject cookies minted by /api/auth/login (login loop).
  // Derive a stable secret from local, non-public config instead so every bundle agrees.
  if (!devFallbackSecret) {
    devFallbackSecret = crypto
      .createHash('sha256')
      .update(`clarvo-dev-session::${process.cwd()}::${process.env.FIREBASE_ADMIN_PRIVATE_KEY || ''}`)
      .digest('hex');
    console.warn('[Session] SESSION_SECRET missing or too short — using a derived development secret. Set SESSION_SECRET in .env.local.');
  }
  return devFallbackSecret;
}

const b64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64url');

function sign(data: string): string {
  return crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
}

export function signSessionToken(input: {
  uid: string;
  email?: string;
  name?: string;
  role: SessionRole;
}): string {
  const now = Math.floor(Date.now() / 1000);
  const claims: SessionClaims = {
    uid: input.uid,
    email: (input.email || '').toLowerCase(),
    name: input.name || '',
    role: input.role,
    admin: input.role === 'admin',
    iss: ISSUER,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(claims));
  return `${header}.${body}.${sign(`${header}.${body}`)}`;
}

/** Returns verified claims, or null if the token is malformed, tampered with, or expired. */
export function verifySessionToken(token?: string | null): SessionClaims | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;

    const headerJson = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'));
    if (headerJson.alg !== 'HS256') return null;

    const expected = Buffer.from(sign(`${header}.${body}`));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;

    const claims = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionClaims;
    if (claims.iss !== ISSUER || !claims.uid) return null;
    if (typeof claims.exp !== 'number' || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    if (claims.role !== 'admin' && claims.role !== 'counsellor' && claims.role !== 'student') return null;
    return claims;
  } catch {
    return null;
  }
}

/** Constant-time string comparison for credentials. */
export function safeEqual(a: string, b: string): boolean {
  const ah = crypto.createHash('sha256').update(a).digest();
  const bh = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ah, bh);
}
