// "Continue with Google" for both tabs of the sign-up popup. A Google account without a finished
// profile must complete the short form (including parent consent), whichever tab it started from.

/** What we already know about a Google user who still has to finish the short form. */
export interface GooglePrefill {
  email: string;
  name: string;
  mobile: string;
  parentName: string;
  school: string;
  city: string;
}

export interface GoogleIdentity {
  idToken: string;
  email: string;
  name: string;
  mobile: string;
}

const text = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Creates the session, then says whether the profile is finished (null) or what to prefill. */
export async function completeGoogleLogin(identity: GoogleIdentity): Promise<GooglePrefill | null> {
  const login = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken: identity.idToken }),
  });
  const loginData = await login.json().catch(() => ({}));
  if (!login.ok) throw new Error(loginData.error || 'Google sign-in did not work. Please try again.');
  if (loginData.role !== 'student') return null; // counsellors and admins have nothing to fill in here

  const res = await fetch('/api/user/update-profile');
  // Never guess "new user" when the profile can't be read: that could overwrite a finished profile.
  if (!res.ok) throw new Error('We could not load your profile. Please try again.');
  const profile: Record<string, unknown> = (await res.json().catch(() => ({}))).user ?? {};
  if (profile.grade || profile.academicGrade) return null;

  return {
    email: (identity.email || text(profile.email)).toLowerCase(),
    name: text(profile.name) || identity.name,
    mobile: text(profile.mobile) || identity.mobile,
    parentName: text(profile.parentName),
    school: text(profile.schoolName) || text(profile.currentSchool),
    city: text(profile.city),
  };
}

/** Message for a failed Google attempt, or null when the person simply closed the Google window. */
export function googleErrorMessage(err: unknown): string | null {
  const code = (err as { code?: string })?.code;
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
  if (code === 'auth/popup-blocked') return 'Your browser blocked the Google window. Allow pop-ups for clarvo.in, or use your email below.';
  if (code === 'auth/configuration-not-found') return 'Google is not available right now. Please use your email below.';
  if (!code && err instanceof Error && err.message) return err.message;
  return 'Google sign-in did not work. Please try again or use your email below.';
}
