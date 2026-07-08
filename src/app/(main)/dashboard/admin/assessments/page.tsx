import { adminDb } from '@/lib/firebase-admin';
import AssessmentsTableClient, { AssessmentData } from '@/components/Admin/AssessmentsTableClient';
import styles from '@/styles/admin-users.module.css';

export default async function AdminAssessmentsPage() {
  let initialAssessments: AssessmentData[] = [];
  
  try {
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      // 1. Fetch assessments
      const [iqSnapshot, psychoSnapshot] = await Promise.all([
        adminDb.collection('iq_results').orderBy('createdAt', 'desc').limit(100).get(),
        adminDb.collection('psychometric_results').orderBy('createdAt', 'desc').limit(100).get()
      ]);
      
      // Combine them and sort by date descending
      const combinedDocs = [...iqSnapshot.docs, ...psychoSnapshot.docs].sort((a, b) => {
        const da = a.data().createdAt ? new Date(a.data().createdAt).getTime() : 0;
        const db = b.data().createdAt ? new Date(b.data().createdAt).getTime() : 0;
        return db - da;
      }).slice(0, 200);

      // 2. Fetch users to map user details
      const usersSnapshot = await adminDb.collection('users').get();
      const userMap = new Map();
      usersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        userMap.set(doc.id, {
          name: data.name || 'Unknown User',
          email: data.email || 'No Email'
        });
      });

      initialAssessments = combinedDocs.map(doc => {
        const data = doc.data();
        const type = data.type === 'psychometric' ? 'psychometric' : 'iq';
        
        let createdAtStr = 'Unknown';
        if (data.createdAt) {
          const date = new Date(data.createdAt);
          createdAtStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
        
        const userInfo = userMap.get(data.userId) || { name: 'Anonymous', email: 'No Email' };

        if (type === 'psychometric') {
          const riasec = data.scores?.topRiasec || [];
          return {
            id: doc.id,
            userId: data.userId || 'unknown',
            userName: userInfo.name,
            userEmail: userInfo.email,
            iqScore: data.scores?.aptitude?.overall || 0,
            percentile: 0,
            tier: data.testName || 'Psychometric Test',
            strength: riasec.length > 0 ? riasec.join('-') : 'N/A',
            createdAtStr,
            type,
          };
        }

        return {
          id: doc.id,
          userId: data.userId || 'unknown',
          userName: userInfo.name,
          userEmail: userInfo.email,
          iqScore: data.iqScore || 0,
          percentile: data.percentile || 0,
          tier: data.tier || 'Unknown',
          strength: data.strength || 'Unknown',
          createdAtStr,
          type,
        };
      });
    }
  } catch (error) {
    console.error('Error fetching assessments from Firestore:', error);
  }

  // Generate top level stats
  const totalAssessments = initialAssessments.length;
  const iqAssessments = initialAssessments.filter(a => a.type === 'iq');
  const exceptionalCount = iqAssessments.filter(a => a.tier === 'Exceptional' || a.iqScore >= 130).length;
  const avgScore = iqAssessments.length > 0 ? Math.round(iqAssessments.reduce((acc, curr) => acc + curr.iqScore, 0) / iqAssessments.length) : 0;

  return (
    <div className={styles.adminContent}>
      {/* Top Stats Cards */}
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{totalAssessments}</h3>
            <p>Total Assessments</p>
            <div className={styles.statTrend} style={{ color: '#4CAF50' }}>Recorded</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{avgScore}</h3>
            <p>Average IQ Score</p>
            <div className={styles.statTrend}>Across all students</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{exceptionalCount}</h3>
            <p>Exceptional Scores</p>
            <div className={styles.statTrend} style={{ color: '#FF9800' }}>IQ 130+</div>
          </div>
        </div>
      </div>

      <AssessmentsTableClient initialAssessments={initialAssessments} />
    </div>
  );
}
