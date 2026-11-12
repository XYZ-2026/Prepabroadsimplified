import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { autoAllotAllUnassignedStudents } from '@/lib/sjf-allotment';
import { getStudentPsychometricAccess, normalizeGrade } from '@/lib/psychometric-access-policy';
import { computeProfileCompletion, computeNextStep } from '@/lib/student-profile-meta';
import styles from '@/styles/student-dashboard.module.css';
import StudentProfileHub, { StudentProfileHubData } from '@/components/Profile/StudentProfileHub';

export default async function StudentProfilePage() {
  const claims = await verifySessionCookie();

  if (!claims) {
    redirect('/auth');
  }

  if (claims.role === 'admin') {
    redirect('/dashboard/admin/users');
  }

  let userData: StudentProfileHubData = {
    name: claims.name || '',
    email: claims.email || '',
    mobile: '',
    grade: '',
    academicGrade: '',
    board: '',
    stream: '',
    schoolName: '',
    currentSchool: '',
    studentType: '',
    state: '',
    city: '',
    createdAtStr: '',
    graduationYear: '',
    targetCountries: '',
    degreeLevel: '',
    fieldOfInterest: '',
    counsellorName: 'Not Assigned',
    counsellorEmail: '',
    counsellorMobile: '',
    counsellorDesignation: '',
    goals: [],
    declaredInterests: [],
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentRelation: '',
  };

  let savedCareersCount = 0;
  let latestReportUrl: string | undefined;

  try {
    const userDoc = await adminDb.collection('users').doc(claims.uid).get();

    // If student has no assigned counsellor yet, run auto-allotment asynchronously (non-blocking)
    if (userDoc.exists && !userDoc.data()?.assignedCounsellor) {
      autoAllotAllUnassignedStudents(adminDb).catch((err) => console.error('Background auto-allotment error:', err));
    }

    if (userDoc.exists) {
      const data = userDoc.data();
      if (data) {
        let createdAtStr = '';
        if (data.createdAt) {
          const date = typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : new Date(data.createdAt);
          if (!isNaN(date.getTime())) {
            createdAtStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          }
        }

        let counsellorName = 'Not Assigned';
        let counsellorEmail = '';
        let counsellorMobile = '';
        let counsellorDesignation = '';

        if (data.assignedCounsellor) {
          try {
            const counsellorDoc = await adminDb.collection('users').doc(data.assignedCounsellor).get();
            if (counsellorDoc.exists) {
              const cData = counsellorDoc.data();
              counsellorName = cData?.name || 'Assigned Counsellor';
              counsellorEmail = cData?.email || '';
              counsellorMobile = cData?.mobile || '';
              counsellorDesignation = cData?.designation || 'Education Counsellor';
            }
          } catch (cErr) {
            console.warn('Could not fetch counsellor details:', cErr);
          }
        }

        savedCareersCount = Array.isArray(data.savedCareers) ? data.savedCareers.length : 0;

        userData = {
          name: data.name || userData.name,
          email: data.email || userData.email,
          mobile: data.mobile || '',
          grade: data.grade || data.academicGrade || '',
          academicGrade: data.academicGrade || data.grade || '',
          board: data.board || '',
          stream: data.stream || '',
          currentSchool: data.currentSchool || data.schoolName || '',
          schoolName: data.schoolName || data.currentSchool || '',
          studentType: data.studentType || '',
          state: data.state || '',
          city: data.city || '',
          goals: data.goals || data.onboarding?.goals || [],
          declaredInterests: data.declaredInterests || data.onboarding?.declaredInterests || [],
          toolAccess: data.toolAccess || {},
          createdAtStr,
          graduationYear: data.graduationYear || '',
          targetCountries: data.targetCountries || '',
          degreeLevel: data.degreeLevel ? data.degreeLevel.charAt(0).toUpperCase() + data.degreeLevel.slice(1) : '',
          fieldOfInterest: data.fieldOfInterest || '',
          counsellorName,
          counsellorEmail,
          counsellorMobile,
          counsellorDesignation,
          parentName: data.parentName || '',
          parentPhone: data.parentPhone || '',
          parentEmail: data.parentEmail || '',
          parentRelation: data.parentRelation || '',
        };
      }
    }

    // Latest psychometric report (sorted in memory — avoids needing a composite index)
    try {
      const snap = await adminDb.collection('psychometric_results').where('userId', '==', claims.uid).get();
      if (!snap.empty) {
        const latest = snap.docs
          .map((d) => ({ id: d.id, createdAt: new Date((d.data().createdAt as string) || 0).getTime() }))
          .sort((a, b) => b.createdAt - a.createdAt)[0];
        latestReportUrl = `/psychometric-test?resultId=${latest.id}`;
      }
    } catch (rErr) {
      console.warn('Could not look up psychometric reports:', rErr);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }

  const rawGrade = userData.grade || userData.academicGrade;
  const access = getStudentPsychometricAccess(rawGrade, userData.toolAccess, claims.role);
  const completion = computeProfileCompletion(userData);
  const nextStep = computeNextStep({
    hasGrade: !!normalizeGrade(rawGrade),
    psychStatus: access.status,
    eligibleTestName: access.eligibleTestName,
    eligibleHref: access.eligibleHref,
    latestReportUrl,
    savedCareersCount,
  });

  return (
    <div className={styles.dashboardContent}>
      <StudentProfileHub
        student={userData}
        completion={completion}
        nextStep={nextStep}
        savedCareersCount={savedCareersCount}
      />
    </div>
  );
}
