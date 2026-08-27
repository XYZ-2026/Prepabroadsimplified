// ═══════════════════════════════════════════════════════════
// API: Save Counsellor Notes for a Student
// ═══════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';
import { requireCounsellor, verifySessionCookie } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';

/**
 * POST /api/counsellor/notes
 * Body: { studentId: string, note: string }
 */
export async function POST(request: NextRequest) {
  try {
    await requireCounsellor();
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentId, note } = await request.json();
    if (!studentId || typeof note !== 'string') {
      return NextResponse.json({ error: 'studentId and note are required' }, { status: 400 });
    }

    const counsellorId = claims.uid;

    // Verify this student is assigned to this counsellor
    const studentDoc = await adminDb.collection('users').doc(studentId).get();
    if (!studentDoc.exists || studentDoc.data()?.assignedCounsellor !== counsellorId) {
      return NextResponse.json({ error: 'Student not assigned to you' }, { status: 403 });
    }

    // Save the note
    await adminDb.collection('counsellor_notes').add({
      counsellorId,
      studentId,
      note,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save note error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/counsellor/notes?studentId=xxx
 * Returns all notes for a specific student by the logged-in counsellor.
 */
export async function GET(request: NextRequest) {
  try {
    await requireCounsellor();
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = request.nextUrl.searchParams.get('studentId');
    if (!studentId) {
      return NextResponse.json({ error: 'studentId required' }, { status: 400 });
    }

    const counsellorId = claims.uid;

    const notesSnap = await adminDb
      .collection('counsellor_notes')
      .where('counsellorId', '==', counsellorId)
      .where('studentId', '==', studentId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const notes = notesSnap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    return NextResponse.json({ notes });
  } catch (error: any) {
    console.error('Fetch notes error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
