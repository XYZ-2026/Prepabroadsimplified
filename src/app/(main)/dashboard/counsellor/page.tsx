import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { calculateJobLength, autoAllotAllUnassignedStudents } from '@/lib/sjf-allotment';
import styles from '@/styles/admin-users.module.css';
import Link from 'next/link';

export default async function CounsellorHomePage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  const counsellorId = claims.uid;

  // Ensure counsellor document exists in Firestore with role 'counsellor'
  try {
    const userRef = adminDb.collection('users').doc(counsellorId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({
        name: claims.name || claims.email?.split('@')[0] || 'Counsellor',
        email: claims.email || '',
        role: 'counsellor',
        createdAt: new Date(),
      }, { merge: true });
    } else if (userDoc.data()?.role !== 'counsellor') {
      await userRef.update({ role: 'counsellor' });
    }
  } catch (err) {
    console.error('Error ensuring counsellor doc:', err);
  }

  // Auto-run SJF allotment for any unassigned students seamlessly in background
  autoAllotAllUnassignedStudents(adminDb).catch(() => 0);

  // Fetch allotted students
  let allottedCount = 0;
  let avgIQ = 0;
  let avgAptitude = 0;
  let pendingReviews = 0;
  let totalWorkload = 0;

  try {
    const studentsSnap = await adminDb
      .collection('users')
      .where('assignedCounsellor', '==', counsellorId)
      .get();

    allottedCount = studentsSnap.docs.length;
    const studentIds = studentsSnap.docs.map(d => d.id);

    if (studentIds.length > 0) {
      // Compute workload
      const chunks = [];
      for (let i = 0; i < studentIds.length; i += 30) {
        chunks.push(studentIds.slice(i, i + 30));
      }

      let iqScores: number[] = [];
      let aptScores: number[] = [];
      const iqStudentSet = new Set<string>();
      const psychoStudentSet = new Set<string>();

      for (const chunk of chunks) {
        const [iqSnap, psychoSnap] = await Promise.all([
          adminDb.collection('iq_results').where('userId', 'in', chunk).get(),
          adminDb.collection('psychometric_results').where('userId', 'in', chunk).get(),
        ]);

        iqSnap.docs.forEach(d => {
          const data = d.data();
          if (data.iqScore) iqScores.push(data.iqScore);
          iqStudentSet.add(data.userId);
        });
        psychoSnap.docs.forEach(d => {
          const data = d.data();
          if (data.scores?.aptitude?.overall) aptScores.push(data.scores.aptitude.overall);
          psychoStudentSet.add(data.userId);
        });
      }

      avgIQ = iqScores.length > 0 ? Math.round(iqScores.reduce((a, b) => a + b, 0) / iqScores.length) : 0;
      avgAptitude = aptScores.length > 0 ? Math.round(aptScores.reduce((a, b) => a + b, 0) / aptScores.length) : 0;

      // Calculate total workload
      for (const doc of studentsSnap.docs) {
        const data = doc.data();
        totalWorkload += calculateJobLength({
          studentType: data.studentType || 'ug',
          hasIQTest: iqStudentSet.has(doc.id),
          hasPsychometricTest: psychoStudentSet.has(doc.id),
        });
      }

      // Students without any test attempts = "pending review"
      pendingReviews = studentIds.filter(id => !iqStudentSet.has(id) && !psychoStudentSet.has(id)).length;
    }
  } catch (error) {
    console.error('Error fetching counsellor home data:', error);
  }

  return (
    <div className={styles.adminContent}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #690b1b 0%, #8D1212 100%)',
        borderRadius: '16px',
        padding: '32px 36px',
        color: '#fff',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          right: '80px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          Counsellor Dashboard
        </h1>
        <p style={{ fontSize: '15px', opacity: 0.9, margin: 0, maxWidth: '600px', color: '#ffffff' }}>
          Manage your allotted students, review their test history, and track cohort analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{allottedCount}</h3>
            <p>Allotted Students</p>
            <div className={styles.statTrend} style={{ color: 'var(--color-red-deep, #690b1b)' }}>Your cohort</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{avgIQ || '—'}</h3>
            <p>Cohort Avg IQ</p>
            <div className={styles.statTrend}>Aptitude: {avgAptitude || '—'}%</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{totalWorkload} min</h3>
            <p>Est. Workload</p>
            <div className={styles.statTrend} style={{ color: '#FF9800' }}>{pendingReviews} pending review</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: '20px',
        marginTop: '8px',
      }}>
        <Link href="/dashboard/counsellor/students" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '24px',
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #e8e8e8',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(105, 11, 27, 0.08)',
            color: 'var(--color-red-deep, #690b1b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>View Allotted Students</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Profiles, test history &amp; reports</p>
          </div>
        </Link>

        <Link href="/dashboard/counsellor/analytics" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '24px',
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #e8e8e8',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(37, 99, 235, 0.08)',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Assessment Analytics</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Cohort IQ, RIASEC &amp; VARK charts</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
