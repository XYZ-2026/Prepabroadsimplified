// ═══════════════════════════════════════════════════════════
// Firebase Admin SDK — server-side only (API routes, middleware)
// Never import this file in client components!
// ═══════════════════════════════════════════════════════════
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import dns from 'node:dns';

// Fix gRPC IPv6 connection timeout (ETIMEDOUT 2404:6800:...) on Node.js 17+
if (dns && typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

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

    // Safe diagnostics (never log actual secrets)
    console.log('[Firebase Admin] Project ID configured:', !!process.env.FIREBASE_ADMIN_PROJECT_ID);
    console.log('[Firebase Admin] Client email configured:', !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
    console.log('[Firebase Admin] Private key configured:', !!privateKey);
    console.log('[Firebase Admin] Private key starts with BEGIN:', privateKey.startsWith('-----BEGIN'));
    console.log('[Firebase Admin] Private key ends with END:', privateKey.trimEnd().endsWith('-----END PRIVATE KEY-----'));
    console.log('[Firebase Admin] Private key length:', privateKey.length);

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    });
    console.log('[Firebase Admin] ✅ Initialized successfully');
  } else {
    adminApp = getApps()[0];
  }
} catch (error: any) {
  console.error('[Firebase Admin] ❌ Initialization FAILED:', error?.message || error);
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
