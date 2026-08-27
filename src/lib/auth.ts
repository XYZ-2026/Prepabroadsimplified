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
/**
 * Resolve user role from claims and Firestore data.
 * Priority: admin > counsellor > student
 */
function resolveRole(claims: any, firestoreRole?: string): 'admin' | 'counsellor' | 'student' {
  if (claims.email === 'admin@as.com' || claims.admin === true || claims.role === 'admin') {
    return 'admin';
  }
  if (
    claims.email?.startsWith('counsellor') ||
    claims.email?.includes('counsellor') ||
    claims.role === 'counsellor' ||
    firestoreRole === 'counsellor'
  ) {
    return 'counsellor';
  }
  return 'student';
}

export async function getUserProfile() {
  const claims = await verifySessionCookie();
  if (!claims) return null;

  // Hardcoded Admin Account
  if (claims.email === 'admin@as.com') {
    return {
      role: 'admin' as const,
      name: 'Admin',
      email: 'admin@as.com',
    };
  }

  // Hardcoded Counsellor Demo Account
  if (claims.email === 'counsellor@as.com') {
    return {
      role: 'counsellor' as const,
      name: 'Counsellor',
      email: 'counsellor@as.com',
    };
  }

  try {
    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      return {
        role: resolveRole(claims, data?.role),
        name: data?.name || claims.name || '',
        email: data?.email || claims.email || '',
        mobile: data?.mobile || '',
        state: data?.state || '',
        city: data?.city || '',
        toolAccess: data?.toolAccess || {
          iqTest: true,
          psychometricTest: true,
          universityPredictor: true,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }

  return {
    role: resolveRole(claims),
    name: claims.name || '',
    email: claims.email || '',
    mobile: '',
    state: '',
    city: '',
    toolAccess: {
      iqTest: true,
      psychometricTest: true,
      universityPredictor: true,
    },
  };
}

/**
 * Get the role of the current user from session cookie
 */
export async function getUserRole(): Promise<'admin' | 'counsellor' | 'student' | null> {
  const claims = await verifySessionCookie();
  if (!claims) return null;

  // Check Firestore for explicit role
  try {
    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    const firestoreRole = userDoc.exists ? userDoc.data()?.role : undefined;
    return resolveRole(claims, firestoreRole);
  } catch {
    return resolveRole(claims);
  }
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
  if (claims.email !== 'admin@as.com' && claims.admin !== true && claims.role !== 'admin') {
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

/**
 * Require counsellor role — throws if not counsellor or admin
 */
export async function requireCounsellor() {
  const claims = await requireAuth();
  const role = await getUserRole();
  if (role !== 'counsellor' && role !== 'admin') {
    throw new Error('Forbidden: Counsellor access required');
  }
  return claims;
}
