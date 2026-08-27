import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import styles from '@/styles/admin-users.module.css';
import CounsellorProfileView from '@/components/Profile/CounsellorProfileView';

export default async function CounsellorProfilePage() {
  const claims = await verifySessionCookie();
  
  if (!claims) {
    redirect('/auth');
  }

  let userData = {
    name: claims.name || 'Unknown',
    email: claims.email || 'Unknown',
    mobile: 'Not Provided',
    state: 'Not Provided',
    city: 'Not Provided',
    createdAtStr: 'Unknown',
    designation: 'Not Provided',
    specialization: 'Not Provided',
    experienceYears: 'Not Provided',
    bio: 'Not Provided',
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
          state: data.state || userData.state,
          city: data.city || userData.city,
          createdAtStr,
          designation: data.designation || userData.designation,
          specialization: data.specialization || userData.specialization,
          experienceYears: data.experienceYears || userData.experienceYears,
          bio: data.bio || userData.bio,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching counsellor profile:', error);
  }

  return (
    <div className={styles.adminContent}>
      <CounsellorProfileView counsellor={userData} showEditButton={true} />
    </div>
  );
}
