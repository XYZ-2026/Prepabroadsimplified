import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Authenticate and authorize admin
    await requireAdmin();

    // 2. Parse request body
    const body = await request.json();
    const { userId, userIds, toolAccess } = body;

    if ((!userId && !userIds) || !toolAccess) {
      return NextResponse.json({ success: false, message: 'Missing userId(s) or toolAccess' }, { status: 400 });
    }

    // Determine which tools are granted to remove them from requests
    const grantedTools = Object.entries(toolAccess)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    const updateData: any = {
      toolAccess,
      updatedAt: new Date().toISOString()
    };

    if (grantedTools.length > 0) {
      updateData.accessRequests = FieldValue.arrayRemove(...grantedTools);
    }

    // Support batch update if userIds array is provided
    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      const batch = adminDb.batch();
      for (const uid of userIds) {
        batch.set(adminDb.collection('users').doc(uid), updateData, { merge: true });
      }
      await batch.commit();
      return NextResponse.json({ success: true, count: userIds.length, message: `Updated access for ${userIds.length} users` });
    }

    // 3. Update single Firestore document
    await adminDb.collection('users').doc(userId).set(updateData, { merge: true });

    return NextResponse.json({ success: true, message: 'Tool access updated successfully' });
  } catch (error: any) {
    console.error('Error updating tool access:', error);
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Failed to update tool access' }, { status: 500 });
  }
}
