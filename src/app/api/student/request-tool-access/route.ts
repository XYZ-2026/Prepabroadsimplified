import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth } from '@/lib/auth';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const claims = await requireAuth();
    if (!claims.uid) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { toolId, toolName } = await request.json();

    if (!toolId || !toolName) {
      return NextResponse.json({ success: false, message: 'Missing tool details' }, { status: 400 });
    }

    // Add the toolId to the accessRequests array
    await adminDb.collection('users').doc(claims.uid).set({
      accessRequests: FieldValue.arrayUnion(toolId),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Request sent successfully' });
  } catch (error: any) {
    console.error('Error requesting tool access:', error);
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
