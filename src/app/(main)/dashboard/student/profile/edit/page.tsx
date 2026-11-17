import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import UpdateProfileForm from '@/components/Dashboard/Student/UpdateProfileForm';
import styles from '@/styles/student-dashboard.module.css';

export const metadata: Metadata = { title: 'Update Profile' };

export default async function EditProfilePage() {
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
    parentName: '',
    parentRelation: '',
    parentPhone: '',
    parentEmail: '',
    ugCourse: '',
    ugCompletionYear: '',
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
          parentName: data.parentName || '',
          parentRelation: data.parentRelation || '',
          parentPhone: data.parentPhone || '',
          parentEmail: data.parentEmail || '',
          ugCourse: data.ugCourse || '',
          ugCompletionYear: data.ugCompletionYear ? String(data.ugCompletionYear) : '',
        };
      }
    }
  } catch (error) {
    console.error('Error fetching user profile for update:', error);
  }

  const isStudent = claims.role === 'student';

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <Link href="/dashboard/student/profile" style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>
          ← Back to My Profile
        </Link>
        <h1 className={styles.pageTitle} style={{ marginTop: 10 }}>Update Profile</h1>
        <p className={styles.pageSubtitle}>Keep your personal information up to date.</p>
      </div>

      <UpdateProfileForm initialData={initialData} />

      {isStudent && (
        <div className={styles.card}>
          <div className={styles.cardBody} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h2 className={styles.cardTitle} style={{ margin: 0 }}>Your Portfolio</h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>
                Your photo, story, activities, projects and achievements are now all in one place.
              </p>
            </div>
            <Link href="/dashboard/student/portfolio" style={{ fontSize: 14, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>
              Open My Portfolio →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
