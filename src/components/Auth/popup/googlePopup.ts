'use client';

// Opens the Google window. Kept apart from googleAuth.ts so that logic can be tested without Firebase.
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as clientAuth } from '@/lib/firebase-auth';
import { completeGoogleLogin, type GooglePrefill } from './googleAuth';

export async function continueWithGoogle(): Promise<GooglePrefill | null> {
  const { user } = await signInWithPopup(clientAuth, new GoogleAuthProvider());
  return completeGoogleLogin({
    idToken: await user.getIdToken(),
    email: user.email || '',
    name: user.displayName || '',
    mobile: user.phoneNumber || '',
  });
}
