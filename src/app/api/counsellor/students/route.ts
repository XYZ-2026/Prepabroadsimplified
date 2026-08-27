// ═══════════════════════════════════════════════════════════
// API: Get Allotted Students for the logged-in Counsellor
// ═══════════════════════════════════════════════════════════
import { NextResponse } from 'next/server';
import { requireCounsellor, verifySessionCookie } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';

/**
 * GET /api/counsellor/students
 * Returns students assigned to the currently logged-in counsellor.
 */
export async function GET() {
  try {
    await requireCounsellor();
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const counsellorId = claims.uid;

    // Fetch students assigned to this counsellor
    const studentsSnap = await adminDb
      .collection('users')
      .where('assignedCounsellor', '==', counsellorId)
      .get();

    const students = studentsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unknown',
        email: data.email || '',
        mobile: data.mobile || '',
        studentType: data.studentType || '',
        state: data.state || '',
        city: data.city || '',
        createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toISOString() : null,
      };
    });

    // Fetch test results for these students
    const studentIds = students.map(s => s.id);

    let iqResults: any[] = [];
    let psychoResults: any[] = [];

    if (studentIds.length > 0) {
      // Firestore 'in' queries limited to 30, so chunk if needed
      const chunks = [];
      for (let i = 0; i < studentIds.length; i += 30) {
        chunks.push(studentIds.slice(i, i + 30));
      }

      for (const chunk of chunks) {
        const [iqSnap, psychoSnap] = await Promise.all([
          adminDb.collection('iq_results').where('userId', 'in', chunk).get(),
          adminDb.collection('psychometric_results').where('userId', 'in', chunk).get(),
        ]);

        iqResults.push(
          ...iqSnap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            type: 'iq',
          }))
        );
        psychoResults.push(
          ...psychoSnap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            type: 'psychometric',
          }))
        );
      }
    }

    return NextResponse.json({
      students,
      iqResults,
      psychoResults,
    });
  } catch (error: any) {
    console.error('Fetch counsellor students error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
