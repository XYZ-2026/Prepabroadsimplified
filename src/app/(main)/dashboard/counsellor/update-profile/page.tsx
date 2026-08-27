import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import UpdateCounsellorProfileForm from '@/components/Dashboard/Counsellor/UpdateCounsellorProfileForm';
import styles from '@/styles/student-dashboard.module.css';

export default async function UpdateCounsellorProfilePage() {
  const claims = await verifySessionCookie();
  
  if (!claims) {
    redirect('/auth');
  }

  let initialData = {
    name: claims.name || '',
    email: claims.email || '',
    mobile: '',
    state: '',
    city: '',
    designation: '',
    specialization: '',
    experienceYears: '',
    bio: '',
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
          state: data.state || '',
          city: data.city || '',
          designation: data.designation || '',
          specialization: data.specialization || '',
          experienceYears: data.experienceYears || '',
          bio: data.bio || '',
        };
      }
    }
  } catch (error) {
    console.error('Error fetching counsellor profile for update:', error);
  }

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Update Profile</h1>
        <p className={styles.pageSubtitle}>Keep your professional counsellor information up to date.</p>
      </div>

      <UpdateCounsellorProfileForm initialData={initialData} />
    </div>
  );
}
