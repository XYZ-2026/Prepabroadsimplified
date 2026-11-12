/** Sign the user out of Firebase (if signed in client-side) and clear the server session cookie. */
export async function clientLogout(redirectTo: string = '/') {
  try {
    const { auth } = await import('@/lib/firebase');
    const { signOut } = await import('firebase/auth');
    await signOut(auth).catch(() => {});
  } catch {
    // Firebase client not configured — the server cookie is what matters
  }
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // ignore network errors; we still leave the page
  }
  window.location.href = redirectTo;
}
