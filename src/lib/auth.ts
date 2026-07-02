// ═══════════════════════════════════════════════════════════
// Auth Utilities — server-side auth helpers
// ═══════════════════════════════════════════════════════════
import { adminAuth, adminDb } from './firebase-admin';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = '__session';
export const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days

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
 * Get the full user profile including name and email from Firestore
 */
export async function getUserProfile() {
  const claims = await verifySessionCookie();
  if (!claims) return null;

  // Hardcoded Admin Account
  if (claims.email === 'admin@admin.com') {
    return {
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
    };
  }

  try {
    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      return {
        role: claims.admin === true || claims.role === 'admin' ? 'admin' : 'student',
        name: data?.name || claims.name || '',
        email: data?.email || claims.email || '',
      };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }

  return {
    role: claims.admin === true || claims.role === 'admin' ? 'admin' : 'student',
    name: claims.name || '',
    email: claims.email || '',
  };
}

/**
 * Get the role of the current user from session cookie
 */
export async function getUserRole(): Promise<'admin' | 'student' | null> {
  const claims = await verifySessionCookie();
  if (!claims) return null;
  
  // Hardcoded Admin Account or custom claims
  if (claims.email === 'admin@admin.com' || claims.admin === true || claims.role === 'admin') {
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


