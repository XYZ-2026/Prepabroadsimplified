import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const path = request.nextUrl.pathname;

  // Protected routes
  const isDashboardRoute = path.startsWith('/dashboard');
  const isAdminRoute = path.startsWith('/dashboard/admin');

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
};
