import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { autoAllotAllUnassignedStudents } from '@/lib/sjf-allotment';
import CounsellorStudentsClient from '@/components/Counsellor/CounsellorStudentsClient';
import styles from '@/styles/admin-users.module.css';

export default async function CounsellorStudentsPage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  const counsellorId = claims.uid;

  // Ensure counsellor document exists in Firestore with role 'counsellor'
  // Fetch current counsellor info for student profiles
  let counsellorInfo = {
    name: claims.name || 'Assigned Counsellor',
    email: claims.email || '',
    mobile: '',
    designation: 'Education Counsellor',
  };

  try {
    const userRef = adminDb.collection('users').doc(counsellorId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({
        name: claims.name || claims.email?.split('@')[0] || 'Counsellor',
        email: claims.email || '',
        role: 'counsellor',
        createdAt: new Date(),
      }, { merge: true });
    } else {
      const data = userDoc.data();
      if (data?.role !== 'counsellor') {
        await userRef.update({ role: 'counsellor' });
      }
      counsellorInfo = {
        name: data?.name || counsellorInfo.name,
        email: data?.email || counsellorInfo.email,
        mobile: data?.mobile || '',
        designation: data?.designation || 'Education Counsellor',
      };
    }
  } catch (err) {
    console.error('Error ensuring counsellor doc:', err);
  }

  // Auto-run SJF allotment for any unassigned students seamlessly in background
  autoAllotAllUnassignedStudents(adminDb).catch(() => 0);

  // Fetch assigned students
  let students: any[] = [];
  let iqResults: any[] = [];
  let psychoResults: any[] = [];

  try {
    const studentsSnap = await adminDb
      .collection('users')
      .where('assignedCounsellor', '==', counsellorId)
      .get();

    students = studentsSnap.docs.map(doc => {
      const data = doc.data();
      let createdAtStr = 'Unknown';
      if (data.createdAt) {
        const date = data.createdAt.toDate();
        createdAtStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }
      return {
        id: doc.id,
        name: data.name || 'Unknown',
        email: data.email || '',
        mobile: data.mobile || '',
        studentType: data.studentType || '',
        state: data.state || '',
        city: data.city || '',
        createdAtStr,
        currentSchool: data.currentSchool || '',
        graduationYear: data.graduationYear || '',
        targetCountries: data.targetCountries || '',
        degreeLevel: data.degreeLevel || '',
        fieldOfInterest: data.fieldOfInterest || '',
        counsellorName: counsellorInfo.name,
        counsellorEmail: counsellorInfo.email,
        counsellorMobile: counsellorInfo.mobile,
        counsellorDesignation: counsellorInfo.designation,
      };
    });

    const studentIds = students.map((s: any) => s.id);

    if (studentIds.length > 0) {
      const chunks = [];
      for (let i = 0; i < studentIds.length; i += 30) {
        chunks.push(studentIds.slice(i, i + 30));
      }

      for (const chunk of chunks) {
        const [iqSnap, psychoSnap, workflowSnap] = await Promise.all([
          adminDb.collection('iq_results').where('userId', 'in', chunk).get(),
          adminDb.collection('psychometric_results').where('userId', 'in', chunk).get(),
          adminDb.collection('assessment_workflow').where('studentId', 'in', chunk).get(),
        ]);

        const workflows = new Map();
        workflowSnap.docs.forEach(doc => {
          workflows.set(doc.data().resultId, doc.data().state);
        });

        iqResults.push(
          ...iqSnap.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              userId: data.userId,
              iqScore: data.iqScore || 0,
              percentile: data.percentile || 0,
              tier: data.tier || 'Unknown',
              strength: data.strength || 'Unknown',
              cognitivePersona: data.cognitivePersona || '',
              domains: data.domains || [],
              createdAt: data.createdAt || '',
              type: 'iq',
            };
          })
        );

        psychoResults.push(
          ...psychoSnap.docs.map(d => {
            const data = d.data();
            return {
              id: d.id,
              userId: data.userId,
              testName: data.testName || 'Psychometric Test',
              scores: data.scores || {},
              createdAt: data.createdAt || '',
              workflowState: workflows.get(d.id) || 'parent_pending',
              type: 'psychometric',
            };
          })
        );
      }
    }
  } catch (error) {
    console.error('Error fetching counsellor students:', error);
  }

  return (
    <div className={styles.adminContent}>
      <CounsellorStudentsClient
        students={students}
        iqResults={iqResults}
        psychoResults={psychoResults}
      />
    </div>
  );
}
