// Firebase client SDK with Firestore. For sign-in only, import '@/lib/firebase-auth' (much smaller).
import { getFirestore } from 'firebase/firestore';
import { app, auth } from './firebase-auth';

const db = getFirestore(app);

export { app, auth, db };
