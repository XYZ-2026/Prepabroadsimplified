// ═══════════════════════════════════════════════════════════
// Shortest Job First (SJF) Allotment Algorithm
// ═══════════════════════════════════════════════════════════

export interface StudentJob {
  userId: string;
  name: string;
  email: string;
  studentType: string;
  hasIQTest: boolean;
  hasPsychometricTest: boolean;
  jobLength: number; // Estimated counseling minutes
}

export interface CounsellorWorkload {
  counsellorId: string;
  counsellorName: string;
  counsellorEmail: string;
  assignedStudents: StudentJob[];
  totalWorkload: number; // Sum of job lengths
}

export interface AllotmentResult {
  allotments: { studentId: string; counsellorId: string }[];
  workloads: CounsellorWorkload[];
}

/**
 * Calculate the estimated job length (in minutes) for a student.
 * 
 * Formula:
 *   J_i = Base(10) + AcademicTier(10-15) + IQAttempt(15) + PsychometricAttempt(20)
 * 
 * Students with shorter job lengths will be allotted first (SJF).
 */
export function calculateJobLength(student: {
  studentType: string;
  hasIQTest: boolean;
  hasPsychometricTest: boolean;
}): number {
  let jobLength = 10; // Base weight (standard profile review)

  // Academic tier weight
  const type = (student.studentType || '').toLowerCase();
  if (type === 'pg' || type === 'phd') {
    jobLength += 15;
  } else {
    jobLength += 10; // UG or unknown
  }

  // IQ test attempt weight
  if (student.hasIQTest) {
    jobLength += 15;
  }

  // Psychometric test attempt weight
  if (student.hasPsychometricTest) {
    jobLength += 20;
  }

  return jobLength;
}

/**
 * Run the Shortest Job First allotment algorithm.
 * 
 * 1. Sort unassigned students by ascending job length (shortest first).
 * 2. Iteratively assign each student to the counsellor with the lowest
 *    current accumulated workload.
 * 
 * This minimizes average waiting time and balances workload across counsellors.
 */
export function runSJFAllotment(
  counsellors: { id: string; name: string; email: string }[],
  unassignedStudents: StudentJob[],
  existingWorkloads?: Map<string, number>
): AllotmentResult {
  if (counsellors.length === 0) {
    return { allotments: [], workloads: [] };
  }

  // Initialize workload tracker per counsellor
  const workloadMap = new Map<string, CounsellorWorkload>();
  for (const c of counsellors) {
    workloadMap.set(c.id, {
      counsellorId: c.id,
      counsellorName: c.name,
      counsellorEmail: c.email,
      assignedStudents: [],
      totalWorkload: existingWorkloads?.get(c.id) || 0,
    });
  }

  // Sort students by job length (ascending — shortest job first)
  const sortedStudents = [...unassignedStudents].sort(
    (a, b) => a.jobLength - b.jobLength
  );

  const allotments: { studentId: string; counsellorId: string }[] = [];

  for (const student of sortedStudents) {
    // Find the counsellor with the minimum current workload
    let minCounsellor: CounsellorWorkload | null = null;
    let minWorkload = Infinity;

    for (const [, workload] of workloadMap) {
      if (workload.totalWorkload < minWorkload) {
        minWorkload = workload.totalWorkload;
        minCounsellor = workload;
      }
    }

    if (minCounsellor) {
      minCounsellor.assignedStudents.push(student);
      minCounsellor.totalWorkload += student.jobLength;
      allotments.push({
        studentId: student.userId,
        counsellorId: minCounsellor.counsellorId,
      });
    }
  }

  return {
    allotments,
    workloads: Array.from(workloadMap.values()),
  };
}

/**
 * Automatically fetch unassigned students and run SJF allotment in background.
 * Call this seamlessly whenever needed without manual UI intervention.
 */
export async function autoAllotAllUnassignedStudents(adminDb: any): Promise<number> {
  try {
    const usersSnap = await adminDb.collection('users').get();
    if (usersSnap.empty) return 0;

    const counsellors: { id: string; name: string; email: string }[] = [];
    const studentDocs: any[] = [];

    usersSnap.docs.forEach((doc: any) => {
      const data = doc.data();
      const email = (data.email || '').toLowerCase();
      const role = data.role;

      if (email === 'admin@as.com' || role === 'admin') {
        // Skip admin
        return;
      }

      if (role === 'counsellor' || email.includes('counsellor')) {
        counsellors.push({
          id: doc.id,
          name: data.name || 'Counsellor',
          email: data.email || '',
        });
      } else {
        studentDocs.push(doc);
      }
    });

    if (counsellors.length === 0 || studentDocs.length === 0) return 0;

    const [iqSnap, psychoSnap] = await Promise.all([
      adminDb.collection('iq_results').get(),
      adminDb.collection('psychometric_results').get(),
    ]);

    const iqUserIds = new Set(iqSnap.docs.map((d: any) => d.data().userId));
    const psychoUserIds = new Set(psychoSnap.docs.map((d: any) => d.data().userId));

    // Check if any counsellor has 0 assigned students -> trigger full rebalance if so
    const counsellorCountMap = new Map<string, number>();
    counsellors.forEach(c => counsellorCountMap.set(c.id, 0));

    for (const doc of studentDocs) {
      const assigned = doc.data().assignedCounsellor;
      if (assigned && counsellorCountMap.has(assigned)) {
        counsellorCountMap.set(assigned, counsellorCountMap.get(assigned)! + 1);
      }
    }

    // If any counsellor has 0 students and we have at least 2 counsellors, rebalance ALL students
    const needsRebalance = counsellors.length > 1 && Array.from(counsellorCountMap.values()).some(count => count === 0);

    const studentsToProcess: StudentJob[] = [];
    const existingWorkloads = new Map<string, number>();

    for (const doc of studentDocs) {
      const data = doc.data();
      const jobLength = calculateJobLength({
        studentType: data.studentType || 'ug',
        hasIQTest: iqUserIds.has(doc.id),
        hasPsychometricTest: psychoUserIds.has(doc.id),
      });

      if (!needsRebalance && data.assignedCounsellor && counsellorCountMap.has(data.assignedCounsellor)) {
        const existing = existingWorkloads.get(data.assignedCounsellor) || 0;
        existingWorkloads.set(data.assignedCounsellor, existing + jobLength);
      } else {
        studentsToProcess.push({
          userId: doc.id,
          name: data.name || 'Student',
          email: data.email || '',
          studentType: data.studentType || 'ug',
          hasIQTest: iqUserIds.has(doc.id),
          hasPsychometricTest: psychoUserIds.has(doc.id),
          jobLength,
        });
      }
    }

    if (studentsToProcess.length === 0) return 0;

    const result = runSJFAllotment(counsellors, studentsToProcess, needsRebalance ? undefined : existingWorkloads);

    if (result.allotments.length > 0) {
      const batch = adminDb.batch();
      for (const a of result.allotments) {
        const userRef = adminDb.collection('users').doc(a.studentId);
        batch.update(userRef, { assignedCounsellor: a.counsellorId });
      }
      await batch.commit();
    }

    return result.allotments.length;
  } catch (err: any) {
    console.warn('Auto SJF allotment warning (continuing):', err?.message || String(err));
    return 0;
  }
}

