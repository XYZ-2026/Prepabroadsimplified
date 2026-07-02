// ═══════════════════════════════════════════════════════════
// Auth Utilities — server-side auth helpers
// ═══════════════════════════════════════════════════════════
import { adminAuth } from './firebase-admin';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days

/**
 * Create a session cookie from a Firebase ID token
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  return adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRY,
  });
}

/**
 * Verify the session cookie and return the decoded claims
 */
export async function verifySessionCookie() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch {
    return null;
  }
}

/**
 * Get the role of the current user from session cookie
 */
export async function getUserRole(): Promise<'admin' | 'student' | null> {
  const claims = await verifySessionCookie();
  if (!claims) return null;
  
  // Check custom claims for admin role
  if (claims.admin === true || claims.role === 'admin') {
    return 'admin';
  }
  
  return 'student';
}

/**
 * Require authentication — throws if not authenticated
 */
export async function requireAuth() {
  const claims = await verifySessionCookie();
  if (!claims) {
    throw new Error('Unauthorized');
  }
  return claims;
}

/**
 * Require admin role — throws if not admin
 */
export async function requireAdmin() {
  const claims = await requireAuth();
  if (claims.admin !== true && claims.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return claims;
}

/**
 * Set admin custom claim on a user (run once to promote a user to admin)
 */
export async function setAdminClaim(uid: string) {
  await adminAuth.setCustomUserClaims(uid, { admin: true, role: 'admin' });
}

export { SESSION_COOKIE_NAME };
