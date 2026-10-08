import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CAREER_ROADMAP_ENABLED } from '@/config/feature-flags';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const path = request.nextUrl.pathname;

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
  const isAdminRoute = path.startsWith('/dashboard/admin');
  const isCounsellorRoute = path.startsWith('/dashboard/counsellor');

  // Logic: In a full app with real JWT decoding in middleware (Edge runtime compatible), 
  // we would decode the session here to check roles. 
  // Since we use Firebase Admin which isn't edge compatible, we just check if a session exists here,
  // and handle the specific role (Admin vs Student) authorization inside the server components or page routes.
  
  if (isDashboardRoute && !session) {
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Redirect authenticated users away from auth page
  if (path === '/auth' && session) {
    // Without decoding the JWT in edge, we'll default route to student dashboard.
    // The student dashboard layout/page should handle checking if they're actually an admin 
    // and redirecting to /dashboard/admin if so.
    return NextResponse.redirect(new URL('/dashboard/student', request.url));
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

