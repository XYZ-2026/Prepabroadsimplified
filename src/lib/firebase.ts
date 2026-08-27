// ═══════════════════════════════════════════════════════════
// Firebase Client SDK — for auth state listener in browser
// ═══════════════════════════════════════════════════════════
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:1234567890',
};

// Initialize Firebase (prevent duplicate initialization in dev hot-reload & SSG build)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('[Firebase Client] Build-time fallback initialization:', error);
  if (!getApps().length) {
    app = initializeApp({ projectId: 'demo-project' });
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
