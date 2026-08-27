import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CounsellorAnalyticsClient from '@/components/Counsellor/CounsellorAnalyticsClient';
import styles from '@/styles/admin-users.module.css';

export default async function CounsellorAnalyticsPage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  const counsellorId = claims.uid;

  // Verify role
  let userRole = 'student';
  try {
    const userDoc = await adminDb.collection('users').doc(counsellorId).get();
    userRole = userDoc.data()?.role || 'student';
  } catch {}
  if (claims.email !== 'counsellor@as.com' && userRole !== 'counsellor') {
    redirect('/');
  }

  // Analytics accumulators
  let totalAssessments = 0;
  let avgIQ = 0;
  let avgAptitude = 0;
  let iqTestCount = 0;
  let psychoCount = 0;

  let iqHistogramData: { range: string; count: number }[] = [];
  let strengthData: { name: string; value: number }[] = [];
  let learningStyleData: { name: string; value: number }[] = [];
  let riasecData: { code: string; average: number }[] = [];
  let personalityData: { trait: string; average: number }[] = [];

  try {
    // Fetch students assigned to this counsellor
    const studentsSnap = await adminDb
      .collection('users')
      .where('assignedCounsellor', '==', counsellorId)
      .get();

    const studentIds = studentsSnap.docs.map(d => d.id);

    if (studentIds.length > 0) {
      const chunks: string[][] = [];
      for (let i = 0; i < studentIds.length; i += 30) {
        chunks.push(studentIds.slice(i, i + 30));
      }

      let allIQ: any[] = [];
      let allPsycho: any[] = [];

      for (const chunk of chunks) {
        const [iqSnap, psychoSnap] = await Promise.all([
          adminDb.collection('iq_results').where('userId', 'in', chunk).get(),
          adminDb.collection('psychometric_results').where('userId', 'in', chunk).get(),
        ]);
        allIQ.push(...iqSnap.docs.map(d => d.data()));
        allPsycho.push(...psychoSnap.docs.map(d => d.data()));
      }

      iqTestCount = allIQ.length;
      psychoCount = allPsycho.length;
      totalAssessments = iqTestCount + psychoCount;

      // IQ stats
      const iqScores = allIQ.map(d => d.iqScore || 0).filter(s => s > 0);
      avgIQ = iqScores.length > 0 ? Math.round(iqScores.reduce((a: number, b: number) => a + b, 0) / iqScores.length) : 0;

      // IQ Histogram
      const iqBuckets: Record<string, number> = {
        '< 80': 0, '80–89': 0, '90–99': 0, '100–109': 0,
        '110–119': 0, '120–129': 0, '130–139': 0, '140+': 0,
      };
      iqScores.forEach(score => {
        if (score < 80) iqBuckets['< 80']++;
        else if (score < 90) iqBuckets['80–89']++;
        else if (score < 100) iqBuckets['90–99']++;
        else if (score < 110) iqBuckets['100–109']++;
        else if (score < 120) iqBuckets['110–119']++;
        else if (score < 130) iqBuckets['120–129']++;
        else if (score < 140) iqBuckets['130–139']++;
        else iqBuckets['140+']++;
      });
      iqHistogramData = Object.entries(iqBuckets).map(([range, count]) => ({ range, count }));

      // Strengths
      const strengthCounts: Record<string, number> = {};
      allIQ.forEach(d => {
        const s = d.strength || 'Unknown';
        strengthCounts[s] = (strengthCounts[s] || 0) + 1;
      });
      strengthData = Object.entries(strengthCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      // Psychometric stats
      const aptScores = allPsycho.map(d => d.scores?.aptitude?.overall || 0).filter((s: number) => s > 0);
      avgAptitude = aptScores.length > 0 ? Math.round(aptScores.reduce((a: number, b: number) => a + b, 0) / aptScores.length) : 0;

      // Learning style (VARK)
      const varkMap: Record<string, string> = {
        V: 'Visual', A: 'Auditory', R: 'Read/Write', K: 'Kinesthetic',
        visual: 'Visual', auditory: 'Auditory', 'read/write': 'Read/Write', kinesthetic: 'Kinesthetic',
      };
      const learnCounts: Record<string, number> = { Visual: 0, Auditory: 0, 'Read/Write': 0, Kinesthetic: 0 };
      allPsycho.forEach(d => {
        const v = d.scores?.topVark || '';
        const label = varkMap[v] || varkMap[v.toLowerCase()] || '';
        if (label && learnCounts[label] !== undefined) learnCounts[label]++;
      });
      learningStyleData = Object.entries(learnCounts)
        .filter(([, v]) => v > 0)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      // RIASEC
      const riasecAccum: Record<string, number[]> = { R: [], I: [], A: [], S: [], E: [], C: [] };
      allPsycho.forEach(d => {
        const r = d.scores?.riasec;
        if (r) {
          ['R', 'I', 'A', 'S', 'E', 'C'].forEach(code => {
            if (typeof r[code] === 'number') riasecAccum[code].push(r[code]);
          });
        }
      });
      const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
      riasecData = ['R', 'I', 'A', 'S', 'E', 'C'].map(code => ({
        code,
        average: avg(riasecAccum[code]),
      }));

      // Personality
      const persAccum: Record<string, number[]> = {
        Openness: [], Conscientiousness: [], Extraversion: [], Agreeableness: [], 'Emotional Stability': [],
      };
      allPsycho.forEach(d => {
        const p = d.scores?.personality;
        if (p) {
          if (typeof p.openness === 'number') persAccum.Openness.push(p.openness);
          if (typeof p.conscientiousness === 'number') persAccum.Conscientiousness.push(p.conscientiousness);
          if (typeof p.extraversion === 'number') persAccum.Extraversion.push(p.extraversion);
          if (typeof p.agreeableness === 'number') persAccum.Agreeableness.push(p.agreeableness);
          if (typeof p.emotionalStability === 'number') persAccum['Emotional Stability'].push(p.emotionalStability);
        }
      });
      personalityData = Object.entries(persAccum).map(([trait, vals]) => ({
        trait,
        average: avg(vals),
      }));
    }
  } catch (error) {
    console.error('Error fetching counsellor analytics:', error);
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Cohort Assessment Analytics
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0, color: '#ffffff' }}>
          Analytics strictly for your allotted students only.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.adminStatsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconUsers}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{totalAssessments}</h3>
            <p>Total Assessments</p>
            <div className={styles.statTrend} style={{ color: '#4CAF50' }}>{iqTestCount} IQ · {psychoCount} Psychometric</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{avgIQ || '—'}</h3>
            <p>Cohort Avg IQ</p>
            <div className={styles.statTrend}>Avg Aptitude: {avgAptitude || '—'}%</div>
          </div>
        </div>
      </div>

      {totalAssessments > 0 ? (
        <CounsellorAnalyticsClient
          iqHistogramData={iqHistogramData}
          strengthData={strengthData}
          learningStyleData={learningStyleData}
          riasecData={riasecData}
          personalityData={personalityData}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', color: 'var(--text-muted)' }}>
          <p>No assessment data from your allotted students yet.</p>
        </div>
      )}
    </div>
  );
}
