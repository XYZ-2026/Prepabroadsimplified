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
      currentSchool: 'Not Provided',
      graduationYear: 'Not Provided',
      targetCountries: 'Not Provided',
      degreeLevel: 'Not Provided',
      fieldOfInterest: 'Not Provided',
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
            currentSchool: data.currentSchool || userData.currentSchool,
            graduationYear: data.graduationYear || userData.graduationYear,
            targetCountries: data.targetCountries || userData.targetCountries,
            degreeLevel: data.degreeLevel ? (data.degreeLevel.charAt(0).toUpperCase() + data.degreeLevel.slice(1)) : userData.degreeLevel,
            fieldOfInterest: data.fieldOfInterest || userData.fieldOfInterest,
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

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginTop: '32px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Academic Background</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Current School / College</span>
              <span className={styles.infoValue}>{userData.currentSchool}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Expected Graduation Year</span>
              <span className={styles.infoValue}>{userData.graduationYear}</span>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginTop: '32px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>Study Abroad Preferences</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Target Countries</span>
              <span className={styles.infoValue}>{userData.targetCountries}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Degree Level Sought</span>
              <span className={styles.infoValue}>{userData.degreeLevel}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Field of Interest / Major</span>
              <span className={styles.infoValue}>{userData.fieldOfInterest}</span>
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
