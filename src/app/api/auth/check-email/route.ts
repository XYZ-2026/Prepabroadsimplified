import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body?.email;

    const cleanEmail = email?.trim()?.toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ exists: false, error: 'Invalid email' }, { status: 400 });
    }

    const snap = await adminDb
      .collection('users')
      .where('email', '==', cleanEmail)
      .limit(1)
      .get();

    if (!snap.empty) {
      return NextResponse.json({
        exists: true,
        message: 'This email address is already registered. Please sign in instead.',
      });
    }

    return NextResponse.json({ exists: false });
  } catch (err: any) {
    console.error('[Check Email] Error checking email existence:', err);
    // On server error, don't block user
    return NextResponse.json({ exists: false });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    const cleanEmail = email?.trim()?.toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ exists: false, error: 'Invalid email' }, { status: 400 });
    }

    const snap = await adminDb
      .collection('users')
      .where('email', '==', cleanEmail)
      .limit(1)
      .get();

    if (!snap.empty) {
      return NextResponse.json({
        exists: true,
        message: 'This email address is already registered. Please sign in instead.',
      });
    }

    return NextResponse.json({ exists: false });
  } catch (err: any) {
    console.error('[Check Email] Error checking email existence:', err);
    return NextResponse.json({ exists: false });
  }
}
