import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import UpdateProfileForm from '@/components/Dashboard/Student/UpdateProfileForm';
import styles from '@/styles/student-dashboard.module.css';

export default async function UpdateProfilePage() {
  const claims = await verifySessionCookie();
  
  if (!claims) {
    redirect('/auth');
  }

  let initialData = {
    name: claims.name || '',
    email: claims.email || '',
    mobile: '',
    studentType: '',
    grade: '',
    academicGrade: '',
    board: '',
    stream: '',
    state: '',
    city: '',
    currentSchool: '',
    schoolName: '',
    graduationYear: '',
    targetCountries: '',
    degreeLevel: '',
    fieldOfInterest: '',
  };

  try {
    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      if (data) {
        initialData = {
          name: data.name || initialData.name,
          email: data.email || initialData.email,
          mobile: data.mobile || '',
          studentType: data.studentType || '',
          grade: data.grade || data.academicGrade || '',
          academicGrade: data.academicGrade || data.grade || '',
          board: data.board || '',
          stream: data.stream || '',
          state: data.state || '',
          city: data.city || '',
          currentSchool: data.currentSchool || data.schoolName || '',
          schoolName: data.schoolName || data.currentSchool || '',
          graduationYear: data.graduationYear || '',
          targetCountries: data.targetCountries || '',
          degreeLevel: data.degreeLevel || '',
          fieldOfInterest: data.fieldOfInterest || '',
        };
      }
    }
  } catch (error) {
    console.error('Error fetching user profile for update:', error);
  }

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Update Profile</h1>
        <p className={styles.pageSubtitle}>Keep your personal information up to date.</p>
      </div>

      <UpdateProfileForm initialData={initialData} />
    </div>
  );
}
