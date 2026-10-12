import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Authenticate and authorize admin
    await requireAdmin();

    // 2. Parse request body
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

    if (userId === 'admin_master_001') {
      return NextResponse.json({ success: false, message: 'Cannot delete master admin account' }, { status: 400 });
    }

    // 3. Delete from Firestore
    await adminDb.collection('users').doc(userId).delete();

    // 4. Also attempt to delete from Firebase Auth if provisioned
    try {
      await adminAuth.deleteUser(userId);
    } catch {
      // Ignored if user only existed in Firestore
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
  }
}
