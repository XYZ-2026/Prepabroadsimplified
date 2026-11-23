// Firebase app + sign-in only. Kept apart from firebase.ts so pages that just need sign-in
// don't download Firestore (about 160 KB compressed).
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase (prevent duplicate initialization in dev hot-reload & SSG build)
let app: FirebaseApp;
let auth: Auth;

try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.warn('[Firebase Client] Build-time fallback initialization:', error);
  app = getApps().length ? getApps()[0] : initializeApp({ projectId: 'demo-project' });
  auth = getAuth(app);
}

export { app, auth };
