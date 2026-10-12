import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CAREER_ROADMAP_ENABLED } from '@/config/feature-flags';

/**
 * Edge-compatible JWT parser that safely inspects payload expiration and identity claims
 */
function parseValidJwtPayload(token?: string): { email?: string; admin?: boolean; role?: string; exp?: number } | null {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = typeof atob === 'function' 
      ? atob(base64) 
      : Buffer.from(base64, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonStr);

    // Validate token expiry (exp is Unix timestamp in seconds)
    if (payload.exp && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp <= now) {
        return null; // Token expired
      }
    }
    const claims = payload.claims || {};
    return {
      email: payload.email || claims.email,
      admin: payload.admin || claims.admin,
      role: payload.role || claims.role,
      exp: payload.exp,
      ...claims,
      ...payload,
    };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const path = request.nextUrl.pathname;
  const sessionPayload = parseValidJwtPayload(session);

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

  // If visiting dashboard without a valid, unexpired session -> redirect to /auth and purge stale cookie
  if (isDashboardRoute && (!session || !sessionPayload)) {
    const redirectRes = NextResponse.redirect(new URL('/auth', request.url));
    if (session && !sessionPayload) {
      redirectRes.cookies.delete('__session');
    }
    return redirectRes;
  }

  // Redirect valid authenticated users away from /auth page
  if (path === '/auth') {
    if (session && sessionPayload) {
      if (sessionPayload.email === 'admin@as.com' || sessionPayload.admin === true || sessionPayload.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admin/users', request.url));
      }
      if (sessionPayload.email === 'counsellor@as.com' || sessionPayload.role === 'counsellor' || sessionPayload.email?.includes('counsellor')) {
        return NextResponse.redirect(new URL('/dashboard/counsellor', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard/student/profile', request.url));
    } else if (session && !sessionPayload) {
      // Clear expired cookie when visiting /auth so user can enter credentials cleanly
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
