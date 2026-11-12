import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CAREER_ROADMAP_ENABLED } from '@/config/feature-flags';
import { verifySessionToken } from '@/lib/session-token';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const path = request.nextUrl.pathname;
  // Signature + expiry verified (proxy runs on the Node.js runtime in Next 16)
  const sessionPayload = verifySessionToken(session);

  // Block user-facing career roadmap when feature flag is disabled
  if (!CAREER_ROADMAP_ENABLED && path.startsWith('/career-roadmap')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect sample-report to public /sample-report route so it completely bypasses the psychometric test layout
  if (path === '/psychometric-test/sample-report') {
    const url = new URL('/sample-report', request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url);
  }

  // Protected routes
  const isDashboardRoute = path.startsWith('/dashboard');

  // Visiting dashboard without a valid, unexpired, correctly signed session -> /auth, and purge stale cookie
  if (isDashboardRoute && !sessionPayload) {
    const redirectRes = NextResponse.redirect(new URL('/auth', request.url));
    if (session) {
      redirectRes.cookies.delete('__session');
    }
    return redirectRes;
  }

  // Redirect valid authenticated users away from /auth page
  if (path === '/auth') {
    if (sessionPayload) {
      if (sessionPayload.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admin/users', request.url));
      }
      if (sessionPayload.role === 'counsellor') {
        return NextResponse.redirect(new URL('/dashboard/counsellor', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard/student/profile', request.url));
    } else if (session) {
      // Clear stale/invalid cookie when visiting /auth so user can enter credentials cleanly
      const nextRes = NextResponse.next();
      nextRes.cookies.delete('__session');
      return nextRes;
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', path);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/auth', '/psychometric-test/:path*', '/career-roadmap', '/career-roadmap/:path*'],
};
