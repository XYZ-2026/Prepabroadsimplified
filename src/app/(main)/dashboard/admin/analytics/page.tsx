import { adminDb } from '@/lib/firebase-admin';
import AnalyticsClient from '@/components/Admin/AnalyticsClient';
import styles from '@/styles/admin-users.module.css';

export default async function AdminAnalyticsPage() {
  let tierData: { name: string; count: number }[] = [];
  let strengthData: { name: string; value: number }[] = [];
  let timelineData: { date: string; avgScore: number; count: number }[] = [];
  
  let totalAssessments = 0;
  let avgScore = 0;
  let exceptionalCount = 0;

  try {
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      const resultsSnapshot = await adminDb.collection('iq_results').get();
      totalAssessments = resultsSnapshot.size;

      const tierCounts: Record<string, number> = {};
      const strengthCounts: Record<string, number> = {};
      const dateStats: Record<string, { totalScore: number; count: number }> = {};
      
      let scoreSum = 0;

      resultsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const score = data.iqScore || 0;
        const tier = data.tier || 'Unknown';
        const strength = data.strength || 'Unknown';
        
        scoreSum += score;
        if (score >= 130 || tier === 'Exceptional') {
          exceptionalCount++;
        }

        // Tier data
        tierCounts[tier] = (tierCounts[tier] || 0) + 1;
        
        // Strength data
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;

        // Timeline data
        if (data.createdAt) {
          const dateStr = new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!dateStats[dateStr]) {
            dateStats[dateStr] = { totalScore: 0, count: 0 };
          }
          dateStats[dateStr].totalScore += score;
          dateStats[dateStr].count += 1;
        }
      });

      if (totalAssessments > 0) {
        avgScore = Math.round(scoreSum / totalAssessments);
      }

      tierData = Object.keys(tierCounts).map(k => ({ name: k, count: tierCounts[k] })).sort((a, b) => b.count - a.count);
      strengthData = Object.keys(strengthCounts).map(k => ({ name: k, value: strengthCounts[k] })).sort((a, b) => b.value - a.value);
      
      // Sort timeline data chronologically by parsing back to date or just relying on insertion (simplified for demo)
      // We'll just grab the keys as is for the chart
      timelineData = Object.keys(dateStats).map(k => ({
        date: k,
        avgScore: Math.round(dateStats[k].totalScore / dateStats[k].count),
        count: dateStats[k].count
      }));
    }
  } catch (error) {
    console.error('Error fetching analytics from Firestore:', error);
  }

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
            <p>Total Assessments Taken</p>
            <div className={styles.statTrend} style={{ color: '#4CAF50' }}>Overall volume</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{avgScore}</h3>
            <p>Average Global Score</p>
            <div className={styles.statTrend}>Platform-wide mean</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{exceptionalCount}</h3>
            <p>Exceptional Performers</p>
            <div className={styles.statTrend} style={{ color: '#FF9800' }}>Scores 130+</div>
          </div>
        </div>
      </div>

      {totalAssessments > 0 ? (
        <AnalyticsClient 
          tierData={tierData} 
          strengthData={strengthData} 
          timelineData={timelineData} 
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', color: 'var(--text-muted)' }}>
          <p>No assessment data available to generate analytics yet.</p>
        </div>
      )}
    </div>
  );
}
