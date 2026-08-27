// ═══════════════════════════════════════════════════════════
// API: Run SJF Allotment / Manual Assignment
// ═══════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { calculateJobLength, runSJFAllotment, StudentJob } from '@/lib/sjf-allotment';

/**
 * POST /api/counsellor/allot
 * Body: { mode: 'auto' } — run full SJF auto-allotment
 *   or  { mode: 'manual', studentId: string, counsellorId: string }
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(); // Only admin can trigger allotment
    const body = await request.json();

    if (body.mode === 'manual') {
      // Manual single assignment
      const { studentId, counsellorId } = body;
      if (!studentId || !counsellorId) {
        return NextResponse.json({ error: 'studentId and counsellorId required' }, { status: 400 });
      }
      await adminDb.collection('users').doc(studentId).update({
        assignedCounsellor: counsellorId,
      });
      return NextResponse.json({ success: true, message: 'Student assigned manually.' });
    }

    // Auto SJF allotment
    // 1. Fetch all counsellors
    const counsellorSnap = await adminDb.collection('users').where('role', '==', 'counsellor').get();
    const counsellors = counsellorSnap.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || 'Counsellor',
      email: doc.data().email || '',
    }));

    if (counsellors.length === 0) {
      return NextResponse.json({ error: 'No counsellors registered in the system.' }, { status: 400 });
    }

    // 2. Fetch unassigned students (no assignedCounsellor field or empty)
    const studentsSnap = await adminDb.collection('users').where('role', '==', 'student').get();
    const allStudents = studentsSnap.docs;

    // 3. Check which students have test attempts
    const [iqSnap, psychoSnap] = await Promise.all([
      adminDb.collection('iq_results').get(),
      adminDb.collection('psychometric_results').get(),
    ]);

    const iqUserIds = new Set(iqSnap.docs.map(d => d.data().userId));
    const psychoUserIds = new Set(psychoSnap.docs.map(d => d.data().userId));

    // 4. Build unassigned student jobs
    const unassignedStudents: StudentJob[] = [];
    for (const doc of allStudents) {
      const data = doc.data();
      if (data.assignedCounsellor) continue; // already assigned

      const job: StudentJob = {
        userId: doc.id,
        name: data.name || 'Student',
        email: data.email || '',
        studentType: data.studentType || 'ug',
        hasIQTest: iqUserIds.has(doc.id),
        hasPsychometricTest: psychoUserIds.has(doc.id),
        jobLength: 0,
      };
      job.jobLength = calculateJobLength(job);
      unassignedStudents.push(job);
    }

    if (unassignedStudents.length === 0) {
      return NextResponse.json({ success: true, message: 'All students are already assigned.', allotments: [] });
    }

    // 5. Compute existing workloads for counsellors who already have students
    const existingWorkloads = new Map<string, number>();
    for (const doc of allStudents) {
      const data = doc.data();
      if (data.assignedCounsellor) {
        const existing = existingWorkloads.get(data.assignedCounsellor) || 0;
        const jl = calculateJobLength({
          studentType: data.studentType || 'ug',
          hasIQTest: iqUserIds.has(doc.id),
          hasPsychometricTest: psychoUserIds.has(doc.id),
        });
        existingWorkloads.set(data.assignedCounsellor, existing + jl);
      }
    }

    // 6. Run SJF
    const result = runSJFAllotment(counsellors, unassignedStudents, existingWorkloads);

    // 7. Write allotments to Firestore
    const batch = adminDb.batch();
    for (const a of result.allotments) {
      const userRef = adminDb.collection('users').doc(a.studentId);
      batch.update(userRef, { assignedCounsellor: a.counsellorId });
    }
    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `${result.allotments.length} students allotted via SJF.`,
      allotments: result.allotments,
      workloads: result.workloads.map(w => ({
        counsellorId: w.counsellorId,
        counsellorName: w.counsellorName,
        studentCount: w.assignedStudents.length,
        totalWorkload: w.totalWorkload,
      })),
    });
  } catch (error: any) {
    console.error('Allotment error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
