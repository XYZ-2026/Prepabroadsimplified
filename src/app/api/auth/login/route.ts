import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    const sessionCookie = await createSessionCookie(idToken);

    // Create the response
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Set the cookie
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: 60 * 60 * 24 * 5, // 5 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
