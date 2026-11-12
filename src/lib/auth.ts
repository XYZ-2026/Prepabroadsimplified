// ═══════════════════════════════════════════════════════════
// Auth Utilities — server-side auth helpers
// Sessions are HS256-signed tokens (see session-token.ts). Roles come
// from the signed claims only — never from the email address.
// ═══════════════════════════════════════════════════════════
import { adminAuth, adminDb } from './firebase-admin';
import { cookies } from 'next/headers';
import {
  signSessionToken,
  verifySessionToken,
  SESSION_TTL_SECONDS,
  type SessionRole,
} from './session-token';

export const SESSION_COOKIE_NAME = '__session';
export const SESSION_EXPIRY = SESSION_TTL_SECONDS * 1000;

/** Create the session cookie value for a user. Role must be resolved server-side by the caller. */
export function createSessionCookie(user: {
  uid: string;
  email?: string;
  name?: string;
  role: SessionRole;
}): string {
  return signSessionToken(user);
}

/** Verify a Firebase ID token and return its decoded claims (throws if invalid). */
export async function verifyFirebaseIdToken(idToken: string) {
  return adminAuth.verifyIdToken(idToken);
}

export type VerifiedClaims = {
  uid: string;
  email: string;
  name: string;
  role: SessionRole;
  admin: boolean;
  [key: string]: any;
};

/**
 * Verify the session cookie and return the claims, or null.
 * Return shape is stable: { uid, email, name, role, admin }.
 */
export async function verifySessionCookie(): Promise<VerifiedClaims | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const claims = verifySessionToken(token);
  if (!claims) return null;
  return { ...claims };
}

/**
 * Get the full user profile including name and email from Firestore
 */
export async function getUserProfile() {
  const claims = await verifySessionCookie();
  if (!claims) return null;

  try {
    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      const rawGrade = data?.grade || data?.academicGrade || '';
      return {
        uid: claims.uid,
        role: claims.role,
        name: data?.name || claims.name || '',
        email: data?.email || claims.email || '',
        mobile: data?.mobile || '',
        grade: rawGrade,
        academicGrade: rawGrade,
        currentSchool: data?.currentSchool || data?.schoolName || '',
        schoolName: data?.schoolName || data?.currentSchool || '',
        board: data?.board || '',
        stream: data?.stream || '',
        studentType: data?.studentType || '',
        state: data?.state || '',
        city: data?.city || '',
        goals: data?.goals || data?.onboarding?.goals || [],
        declaredInterests: data?.declaredInterests || data?.onboarding?.declaredInterests || [],
        onboarding: data?.onboarding || null,
        toolAccess: data?.toolAccess || {},
      };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }

  return {
    uid: claims.uid,
    role: claims.role,
    name: claims.name || '',
    email: claims.email || '',
    mobile: '',
    grade: '',
    academicGrade: '',
    currentSchool: '',
    schoolName: '',
    board: '',
    stream: '',
    studentType: '',
    state: '',
    city: '',
    goals: [],
    declaredInterests: [],
    onboarding: null,
    toolAccess: {},
  };
}

/**
 * Get the role of the current user from the signed session
 */
export async function getUserRole(): Promise<SessionRole | null> {
  const claims = await verifySessionCookie();
  return claims ? claims.role : null;
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
  if (claims.role !== 'admin') {
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
  if (claims.role !== 'counsellor' && claims.role !== 'admin') {
    throw new Error('Forbidden: Counsellor access required');
  }
  return claims;
}
