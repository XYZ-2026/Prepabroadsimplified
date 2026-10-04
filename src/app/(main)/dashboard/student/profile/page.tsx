import { redirect } from 'next/navigation';
import Link from 'next/link';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { autoAllotAllUnassignedStudents } from '@/lib/sjf-allotment';
import styles from '@/styles/student-dashboard.module.css';
import StudentProfileView, { StudentProfileData } from '@/components/Profile/StudentProfileView';

export default async function StudentProfilePage() {
  const claims = await verifySessionCookie();
  
  if (!claims) {
    redirect('/auth');
  }

  let userData: StudentProfileData = {
    name: claims.name || 'Unknown',
    email: claims.email || 'Unknown',
    mobile: 'Not Provided',
    grade: '',
    academicGrade: '',
    board: '',
    stream: '',
    schoolName: '',
    studentType: 'Not Provided',
    state: 'Not Provided',
    city: 'Not Provided',
    createdAtStr: 'Unknown',
    currentSchool: 'Not Provided',
    graduationYear: 'Not Provided',
    targetCountries: 'Not Provided',
    degreeLevel: 'Not Provided',
    fieldOfInterest: 'Not Provided',
    counsellorName: 'Not Assigned',
    counsellorEmail: '',
    counsellorMobile: '',
    counsellorDesignation: '',
    goals: [],
    declaredInterests: [],
  };

  try {
    let userDoc = await adminDb.collection('users').doc(claims.uid).get();

    // If student has no assigned counsellor yet, run auto-allotment asynchronously (non-blocking)
    if (userDoc.exists && !userDoc.data()?.assignedCounsellor) {
      autoAllotAllUnassignedStudents(adminDb).catch(err => console.error('Background auto-allotment error:', err));
    }

    if (userDoc.exists) {
      let data = userDoc.data();
      if (data) {
        let createdAtStr = 'Unknown';
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          createdAtStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
        
        userData = {
          name: data.name || userData.name,
          email: data.email || userData.email,
          mobile: data.mobile || userData.mobile,
          grade: data.grade || data.academicGrade || '',
          academicGrade: data.academicGrade || data.grade || '',
          board: data.board || '',
          stream: data.stream || '',
          currentSchool: data.currentSchool || data.schoolName || userData.currentSchool,
          schoolName: data.schoolName || data.currentSchool || '',
          studentType: data.studentType ? (data.studentType.toUpperCase()) : userData.studentType,
          state: data.state || userData.state,
          city: data.city || userData.city,
          goals: data.goals || data.onboarding?.goals || [],
          declaredInterests: data.declaredInterests || data.onboarding?.declaredInterests || [],
          toolAccess: data.toolAccess || {},
          createdAtStr,
          graduationYear: data.graduationYear || userData.graduationYear,
          targetCountries: data.targetCountries || userData.targetCountries,
          degreeLevel: data.degreeLevel ? (data.degreeLevel.charAt(0).toUpperCase() + data.degreeLevel.slice(1)) : userData.degreeLevel,
          fieldOfInterest: data.fieldOfInterest || userData.fieldOfInterest,
          counsellorName,
          counsellorEmail,
          counsellorMobile,
          counsellorDesignation,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }

  return (
    <div className={styles.dashboardContent}>
      <StudentProfileView student={userData} showEditButton={true} />
    </div>
  );
}
