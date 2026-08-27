import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie, getUserRole } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { calculateJobLength } from '@/lib/sjf-allotment';
import AllotmentManagerClient from '@/components/Counsellor/AllotmentManagerClient';
import styles from '@/styles/admin-users.module.css';

export default async function CounsellorAllotmentPage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  const role = await getUserRole();
  if (role !== 'counsellor' && role !== 'admin') redirect('/');

  // Fetch all counsellors
  let counsellors: { id: string; name: string; email: string; studentCount: number; totalWorkload: number }[] = [];
  let unassignedCount = 0;
  let totalStudents = 0;

  try {
    const counsellorSnap = await adminDb.collection('users').where('role', '==', 'counsellor').get();
    const studentsSnap = await adminDb.collection('users').where('role', '==', 'student').get();

    totalStudents = studentsSnap.docs.length;

    // Check test attempts for workload calculation
    const [iqSnap, psychoSnap] = await Promise.all([
      adminDb.collection('iq_results').get(),
      adminDb.collection('psychometric_results').get(),
    ]);
    const iqUserIds = new Set(iqSnap.docs.map(d => d.data().userId));
    const psychoUserIds = new Set(psychoSnap.docs.map(d => d.data().userId));

    // Calculate per-counsellor workload
    const counsellorMap = new Map<string, { name: string; email: string; studentCount: number; totalWorkload: number }>();
    for (const doc of counsellorSnap.docs) {
      const data = doc.data();
      counsellorMap.set(doc.id, {
        name: data.name || 'Counsellor',
        email: data.email || '',
        studentCount: 0,
        totalWorkload: 0,
      });
    }

    for (const doc of studentsSnap.docs) {
      const data = doc.data();
      if (data.assignedCounsellor && counsellorMap.has(data.assignedCounsellor)) {
        const c = counsellorMap.get(data.assignedCounsellor)!;
        c.studentCount++;
        c.totalWorkload += calculateJobLength({
          studentType: data.studentType || 'ug',
          hasIQTest: iqUserIds.has(doc.id),
          hasPsychometricTest: psychoUserIds.has(doc.id),
        });
      } else if (!data.assignedCounsellor) {
        unassignedCount++;
      }
    }

    counsellors = Array.from(counsellorMap.entries()).map(([id, c]) => ({
      id,
      ...c,
    }));
  } catch (error) {
    console.error('Error fetching allotment data:', error);
  }

  return (
    <div className={styles.adminContent}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #690b1b 0%, #8D1212 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        color: '#fff',
        marginBottom: '24px',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          SJF Allotment Manager
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0, color: '#ffffff' }}>
          Run the Shortest Job First algorithm to auto-assign students to counsellors with balanced workload.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{totalStudents}</h3>
            <p>Total Students</p>
            <div className={styles.statTrend} style={{ color: '#4CAF50' }}>{unassignedCount} unassigned</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{counsellors.length}</h3>
            <p>Active Counsellors</p>
            <div className={styles.statTrend}>Available for allotment</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{unassignedCount}</h3>
            <p>Pending Allotment</p>
            <div className={styles.statTrend} style={{ color: '#FF9800' }}>Awaiting SJF run</div>
          </div>
        </div>
      </div>

      <AllotmentManagerClient
        counsellors={counsellors}
        unassignedCount={unassignedCount}
        isAdmin={role === 'admin'}
      />
    </div>
  );
}
