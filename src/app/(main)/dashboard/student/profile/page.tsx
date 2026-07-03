import { redirect } from 'next/navigation';
import Link from 'next/link';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import styles from '@/styles/student-dashboard.module.css';
import componentsStyles from '@/styles/components.module.css';

export default async function StudentProfilePage() {
  const claims = await verifySessionCookie();
  
  if (!claims) {
    redirect('/auth');
  }

  let userData = {
    name: claims.name || 'Unknown',
    email: claims.email || 'Unknown',
    mobile: 'Not Provided',
    studentType: 'Not Provided',
    state: 'Not Provided',
    city: 'Not Provided',
    createdAtStr: 'Unknown',
  };

  try {
    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      if (data) {
        let createdAtStr = 'Unknown';
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          createdAtStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        
        userData = {
          name: data.name || userData.name,
          email: data.email || userData.email,
          mobile: data.mobile || userData.mobile,
          studentType: data.studentType ? (data.studentType.toUpperCase()) : userData.studentType,
          state: data.state || userData.state,
          city: data.city || userData.city,
          createdAtStr,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.pageSubtitle}>View your account details and registration information.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Personal Information</h2>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Full Name</span>
              <span className={styles.infoValue}>{userData.name}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email Address</span>
              <span className={styles.infoValue}>{userData.email}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Mobile Number</span>
              <span className={styles.infoValue}>{userData.mobile}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Student Level</span>
              <span className={styles.infoValue}>{userData.studentType}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>State</span>
              <span className={styles.infoValue} style={{ textTransform: 'capitalize' }}>{userData.state}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>City</span>
              <span className={styles.infoValue}>{userData.city}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Member Since</span>
              <span className={styles.infoValue}>{userData.createdAtStr}</span>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <Link href="/dashboard/student/update-profile" className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
