import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie, getUserRole } from '@/lib/auth';
import UpdateProfileForm from '@/components/Dashboard/Student/UpdateProfileForm';
import PortfolioEditor from '@/components/Dashboard/Student/PortfolioEditor';
import { getPortfolioByUid } from '@/lib/portfolio-service';
import type { PortfolioRecord } from '@/components/portfolio/portfolioTypes';
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

  // Student portfolio (Wix CMS "StudentPortfolios", one row per student)
  const role = await getUserRole();
  const isStudent = role === 'student';
  let portfolio: PortfolioRecord | null = null;
  let portfolioLoadFailed = false;
  if (isStudent) {
    try {
      portfolio = await getPortfolioByUid(claims.uid);
    } catch (error) {
      portfolioLoadFailed = true;
      console.error('Error fetching student portfolio:', error);
    }
  }

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Update Profile</h1>
        <p className={styles.pageSubtitle}>Keep your personal information up to date.</p>
      </div>

      <UpdateProfileForm initialData={initialData} />

      {isStudent && (
        <PortfolioEditor
          initialRecord={portfolio}
          loadFailed={portfolioLoadFailed}
          defaults={{
            fullName: initialData.name,
            grade: /^\d+$/.test(String(initialData.grade).trim())
              ? `Grade ${String(initialData.grade).trim()}`
              : initialData.grade,
            stream: initialData.stream || initialData.board,
            school: initialData.currentSchool,
            city: initialData.city,
            email: initialData.email,
          }}
        />
      )}
    </div>
  );
}
