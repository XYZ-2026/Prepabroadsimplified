import { adminDb } from '@/lib/firebase-admin';
import ToolAccessTableClient, { UserAccessData } from '@/components/Admin/ToolAccessTableClient';
import styles from '@/styles/admin-users.module.css';

export default async function AdminToolAccessPage() {
  let initialUsers: UserAccessData[] = [];
  
  try {
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      const usersSnapshot = await adminDb.collection('users').orderBy('createdAt', 'desc').limit(200).get();
      initialUsers = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        
        let createdAtStr = '';
        if (data.createdAt) {
          if (typeof data.createdAt.toDate === 'function') {
            createdAtStr = data.createdAt.toDate().toLocaleDateString('en-GB');
          } else if (typeof data.createdAt === 'string') {
            createdAtStr = new Date(data.createdAt).toLocaleDateString('en-GB');
          }
        }

        return {
          id: doc.id,
          name: data.name || 'Unnamed Student',
          email: data.email || 'No Email',
          role: data.role || 'student',
          grade: data.grade || data.academicGrade || data.studentType || 'Not Specified',
          createdAt: createdAtStr,
          toolAccess: {
            iqTest: data.toolAccess?.iqTest !== false,
            psychometricTest: data.toolAccess?.psychometricTest === true, // Default false until admin grants
            universityPredictor: data.toolAccess?.universityPredictor !== false,
          },
          accessRequests: data.accessRequests || []
        };
      });
    }
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
  }

  const pendingCount = initialUsers.filter(u => u.toolAccess?.psychometricTest !== true).length;
  const activeCount = initialUsers.filter(u => u.toolAccess?.psychometricTest === true).length;

  return (
    <div className={styles.adminContent}>
      {/* Top Stats Cards specific to Tool Access */}
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{initialUsers.length}</h3>
            <p>Total Registered Students</p>
            <div className={styles.statTrend} style={{ color: '#2563EB' }}>All Accounts</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#b45309' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div className={styles.statContent}>
            <h3 style={{ color: '#b45309' }}>{pendingCount}</h3>
            <p>Pending Test Access</p>
            <div className={styles.statTrend} style={{ color: '#d97706' }}>Awaiting Activation</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`} style={{ background: '#dcfce7', color: '#16a34a' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div className={styles.statContent}>
            <h3 style={{ color: '#16a34a' }}>{activeCount}</h3>
            <p>Test Access Granted</p>
            <div className={styles.statTrend} style={{ color: '#16a34a' }}>Tests Active</div>
          </div>
        </div>
      </div>

      <ToolAccessTableClient initialUsers={initialUsers} />
    </div>
  );
}
