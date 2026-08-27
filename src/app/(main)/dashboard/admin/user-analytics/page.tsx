import { adminDb } from '@/lib/firebase-admin';
import UserAnalyticsClient from '@/components/Admin/UserAnalyticsClient';
import styles from '@/styles/admin-users.module.css';

export default async function AdminUserAnalyticsPage() {
  let studentTypeData: { name: string; value: number }[] = [];
  let targetCountriesData: { name: string; count: number }[] = [];
  let fieldOfInterestData: { name: string; count: number }[] = [];
  let degreeLevelData: { name: string; value: number }[] = [];
  let stateData: { name: string; count: number }[] = [];
  let signupTimeline: { date: string; signups: number }[] = [];
  
  let totalUsers = 0;
  let activeAssessments = 0;
  let conversionRate = '0%';

  try {
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      // Fetch Users
      const usersSnapshot = await adminDb.collection('users').get();
      totalUsers = usersSnapshot.docs.length;

      // Fetch Assessments just to get a total count for conversion rate
      const [iqSnapshot, psychoSnapshot] = await Promise.all([
        adminDb.collection('iq_results').get(),
        adminDb.collection('psychometric_results').get()
      ]);
      activeAssessments = iqSnapshot.docs.length + psychoSnapshot.docs.length;
      
      // Calculate generic conversion rate (assuming 1 test = 1 user roughly)
      if (totalUsers > 0) {
        conversionRate = Math.min(100, Math.round((activeAssessments / totalUsers) * 100)) + '%';
      }

      const studentTypeCounts: Record<string, number> = {};
      const targetCountriesCounts: Record<string, number> = {};
      const fieldOfInterestCounts: Record<string, number> = {};
      const degreeLevelCounts: Record<string, number> = {};
      const stateCounts: Record<string, number> = {};
      const dateStats: Record<string, number> = {};

      usersSnapshot.docs.forEach(doc => {
        const data = doc.data();

        // Demographics
        const type = data.studentType || 'Not Specified';
        studentTypeCounts[type] = (studentTypeCounts[type] || 0) + 1;

        const state = data.state || 'Not Specified';
        if (state !== 'Not Specified') {
          stateCounts[state] = (stateCounts[state] || 0) + 1;
        }

        // Academic Intentions
        const country = data.targetCountries || 'Not Specified';
        if (country !== 'Not Specified') {
          targetCountriesCounts[country] = (targetCountriesCounts[country] || 0) + 1;
        }

        const degree = data.degreeLevel || 'Not Specified';
        if (degree !== 'Not Specified') {
          degreeLevelCounts[degree] = (degreeLevelCounts[degree] || 0) + 1;
        }

        const field = data.fieldOfInterest || 'Not Specified';
        if (field !== 'Not Specified') {
          fieldOfInterestCounts[field] = (fieldOfInterestCounts[field] || 0) + 1;
        }

        // Timeline (using createdAt if available)
        // Note: Make sure users are created with createdAt field. 
        // If they aren't yet, this timeline might be sparse until they are.
        if (data.createdAt) {
          const date = new Date(data.createdAt);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dateStats[dateStr] = (dateStats[dateStr] || 0) + 1;
        }
      });

      // Transform object maps to arrays for Recharts
      studentTypeData = Object.keys(studentTypeCounts)
        .filter(k => k !== 'Not Specified' && studentTypeCounts[k] > 0)
        .map(k => ({ name: k, value: studentTypeCounts[k] }))
        .sort((a, b) => b.value - a.value);

      stateData = Object.keys(stateCounts)
        .map(k => ({ name: k, count: stateCounts[k] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 states

      targetCountriesData = Object.keys(targetCountriesCounts)
        .map(k => ({ name: k, count: targetCountriesCounts[k] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // Top 8 countries

      degreeLevelData = Object.keys(degreeLevelCounts)
        .map(k => ({ name: k, value: degreeLevelCounts[k] }))
        .sort((a, b) => b.value - a.value);

      fieldOfInterestData = Object.keys(fieldOfInterestCounts)
        .map(k => ({ name: k, count: fieldOfInterestCounts[k] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 fields

      signupTimeline = Object.keys(dateStats).map(k => ({
        date: k,
        signups: dateStats[k]
      }));
    }
  } catch (error) {
    console.error('Error fetching user analytics from Firestore:', error);
  }

  return (
    <div className={styles.adminContent}>
      {/* Top Stats Cards */}
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{totalUsers}</h3>
            <p>Total Registered Users</p>
            <div className={styles.statTrend} style={{ color: '#4CAF50' }}>Platform signups</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{activeAssessments}</h3>
            <p>Total Assessments Taken</p>
            <div className={styles.statTrend}>IQ &amp; Psychometric</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{conversionRate}</h3>
            <p>Engagement Rate</p>
            <div className={styles.statTrend} style={{ color: '#FF9800' }}>Tests / Users</div>
          </div>
        </div>
      </div>

      {totalUsers > 0 ? (
        <UserAnalyticsClient 
          totalUsers={totalUsers}
          activeAssessments={activeAssessments}
          conversionRate={conversionRate}
          studentTypeData={studentTypeData}
          targetCountriesData={targetCountriesData}
          fieldOfInterestData={fieldOfInterestData}
          degreeLevelData={degreeLevelData}
          stateData={stateData}
          signupTimeline={signupTimeline}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', color: 'var(--text-muted)' }}>
          <p>No user data available to generate analytics yet.</p>
        </div>
      )}
    </div>
  );
}
