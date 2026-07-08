// ═══════════════════════════════════════════════════════════
// Firebase Admin SDK — server-side only (API routes, middleware)
// Never import this file in client components!
// ═══════════════════════════════════════════════════════════
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

try {
  if (!getApps().length) {
    let rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || '';
    if (rawKey.startsWith('"') && rawKey.endsWith('"')) {
      rawKey = rawKey.slice(1, -1);
    }
    const privateKey = rawKey.replace(/\\n/g, '\n');

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    });
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.warn('Firebase Admin initialization warning (ignoring for build):', error);
  // Create a dummy app to prevent the build from crashing entirely
  if (!getApps().length) {
    adminApp = initializeApp({ projectId: 'dummy-project' });
  } else {
    adminApp = getApps()[0];
  }
}

adminAuth = getAuth(adminApp);
adminDb = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
