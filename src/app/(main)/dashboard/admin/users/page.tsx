import { adminDb } from '@/lib/firebase-admin';
import UsersTableClient, { UserData } from '@/components/Admin/UsersTableClient';
import styles from '@/styles/admin-users.module.css';

export default async function AdminUsersPage() {
  let initialUsers: UserData[] = [];
  
  try {
    // Note: This requires the Firebase Admin SDK credentials to be set up correctly in .env.local
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      const usersSnapshot = await adminDb.collection('users').orderBy('createdAt', 'desc').limit(50).get();
      initialUsers = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        let createdAtStr = 'Unknown';
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          createdAtStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
        
        return {
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || 'Unknown',
          mobile: data.mobile || 'Unknown',
          studentType: data.studentType || 'Unknown',
          state: data.state || 'Unknown',
          city: data.city || 'Unknown',
          createdAtStr,
        };
      });
    }
  } catch (error) {
    console.error('Error fetching users from Firestore:', error);
    // Continue with empty array if there's an error (e.g., credentials missing during migration)
  }



  const activeStatesCount = new Set(initialUsers.map(u => u.state.toLowerCase()).filter(s => s && s !== 'unknown')).size;

  return (
    <div className={styles.adminContent}>
      {/* Top Stats Cards */}
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{initialUsers.length}</h3>
            <p>Total Registered Users</p>
            <div className={styles.statTrend} style={{ color: '#4CAF50' }}>Live Count</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{activeStatesCount}</h3>
            <p>Active States</p>
            <div className={styles.statTrend}>Users from across India</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
          </div>
          <div className={styles.statContent}>
            <h3>0</h3>
            <p>New Applications</p>
            <div className={styles.statTrend} style={{ color: '#FF9800' }}>Requires review</div>
          </div>
        </div>
      </div>

      <UsersTableClient initialUsers={initialUsers} />
    </div>
  );
}
