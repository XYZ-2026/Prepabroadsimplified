import { adminDb } from '@/lib/firebase-admin';
import ToolAccessTableClient, { UserAccessData } from '@/components/Admin/ToolAccessTableClient';
import styles from '@/styles/admin-users.module.css';

export default async function AdminToolAccessPage() {
  let initialUsers: UserAccessData[] = [];
  
  try {
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      const usersSnapshot = await adminDb.collection('users').orderBy('createdAt', 'desc').limit(100).get();
      initialUsers = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        
        return {
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || 'Unknown',
          toolAccess: data.toolAccess || {
            iqTest: true,
            psychometricTest: true,
            universityPredictor: true,
          },
          accessRequests: data.accessRequests || []
        };
      });
    }
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
  }

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
            <p>Users Managed</p>
            <div className={styles.statTrend} style={{ color: '#4CAF50' }}>Live Count</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <div className={styles.statContent}>
            <h3>Access Control</h3>
            <p>Admin Override</p>
            <div className={styles.statTrend}>Instantly syncs to users</div>
          </div>
        </div>
      </div>

      <ToolAccessTableClient initialUsers={initialUsers} />
    </div>
  );
}
