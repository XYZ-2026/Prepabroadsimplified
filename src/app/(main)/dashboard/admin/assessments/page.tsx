import { adminDb } from '@/lib/firebase-admin';
import Link from 'next/link';
import AssessmentsTableClient, { AssessmentData } from '@/components/Admin/AssessmentsTableClient';
import styles from '@/styles/admin-users.module.css';

export default async function AdminAssessmentsPage() {
  let initialAssessments: AssessmentData[] = [];
  
  try {
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      // 1. Fetch assessments and users concurrently
      const [iqSnapshot, psychoSnapshot, usersSnapshot] = await Promise.all([
        adminDb.collection('iq_results').orderBy('createdAt', 'desc').limit(100).get(),
        adminDb.collection('psychometric_results').orderBy('createdAt', 'desc').limit(100).get(),
        adminDb.collection('users').limit(200).get(),
      ]);
      
      // Combine them and sort by date descending
      const combinedDocs = [...iqSnapshot.docs, ...psychoSnapshot.docs].sort((a, b) => {
        const da = a.data().createdAt ? new Date(a.data().createdAt).getTime() : 0;
        const db = b.data().createdAt ? new Date(b.data().createdAt).getTime() : 0;
        return db - da;
      }).slice(0, 200);

      // 2. Map user details
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

      {/* Admin Test Sandbox & Multiple Attempts Launcher */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '16px',
        padding: '22px 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🧪</span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Admin Assessment Sandbox & Evaluation Console
              </h2>
              <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#dcfce7', color: '#166534', textTransform: 'uppercase' }}>
                Universal Unlimited Access
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              As an administrator, you have full access to take any assessment variant, simulate student profiles, and inspect the resulting reports multiple times.
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <Link
            href="/psychometric-test?type=junior&retake=true&source=admin"
            target="_blank"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid #2563EB',
              background: '#eff6ff',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class 7–9 Foundation</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>Take Junior Assessment →</span>
            <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>Aptitude, exploratory interests & habits</span>
          </Link>
          <Link
            href="/psychometric-test?type=grade10&retake=true&source=admin"
            target="_blank"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid #057a55',
              background: '#f0fdf4',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#057a55', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class 10 Stream Selection</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#14532d', marginTop: '2px' }}>Take Stream Assessment →</span>
            <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>PCM / PCB / Commerce / Humanities stream fits</span>
          </Link>
          <Link
            href="/psychometric-test?type=senior&retake=true&source=admin"
            target="_blank"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid #690b1b',
              background: '#fff1f2',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#690b1b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class 11–12 Senior Career</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#881337', marginTop: '2px' }}>Take Senior Assessment →</span>
            <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>56-page dossier, colleges, exams & roadmaps</span>
          </Link>
          <Link
            href="/iq-test?source=admin"
            target="_blank"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid #7c3aed',
              background: '#f5f3ff',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cognitive Testing</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#5b21b6', marginTop: '2px' }}>Take IQ Test →</span>
            <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>Timed standard cognitive reasoning test</span>
          </Link>
        </div>
      </div>

      <AssessmentsTableClient initialAssessments={initialAssessments} />
    </div>
  );
}
