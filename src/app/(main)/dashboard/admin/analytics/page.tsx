import { adminDb } from '@/lib/firebase-admin';
import AnalyticsClient from '@/components/Admin/AnalyticsClient';
import styles from '@/styles/admin-users.module.css';

export default async function AdminAnalyticsPage() {
  let tierData: { name: string; count: number }[] = [];
  let strengthData: { name: string; value: number }[] = [];
  let timelineData: { date: string; avgScore: number; count: number }[] = [];
  let learningStyleData: { name: string; value: number }[] = [];
  let personalityData: { trait: string; average: number }[] = [];
  let gradeData: { name: string; value: number }[] = [];
  let careerData: { name: string; count: number }[] = [];
  let riasecData: { code: string; average: number }[] = [];
  let iqHistogramData: { range: string; count: number }[] = [];
  let personaData: { name: string; value: number }[] = [];
  let aptitudeDomainData: { domain: string; iq: number; psychometric: number }[] = [];
  
  let totalAssessments = 0;
  let avgScore = 0;
  let exceptionalCount = 0;
  let psychoCount = 0;
  let iqTestCount = 0;
  let avgAptitude = 0;

  try {
    if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
      const [iqSnapshot, psychoSnapshot] = await Promise.all([
        adminDb.collection('iq_results').get(),
        adminDb.collection('psychometric_results').get()
      ]);
      
      const combinedDocs = [
        ...iqSnapshot.docs.map(doc => ({ ...doc.data(), _type: 'iq' } as any)),
        ...psychoSnapshot.docs.map(doc => ({ ...doc.data(), _type: 'psychometric' } as any))
      ];
      
      totalAssessments = combinedDocs.length;
      iqTestCount = iqSnapshot.docs.length;
      psychoCount = psychoSnapshot.docs.length;

      const tierCounts: Record<string, number> = {};
      const strengthCounts: Record<string, number> = {
        'Analytical Thinking': 0,
        'Verbal Reasoning': 0,
        'Numerical Intelligence': 0,
        'Creative Thinking': 0,
        'Problem Solving': 0,
        'Social Intelligence': 0,
      };
      const dateStats: Record<string, { totalScore: number; count: number }> = {};
      
      // New analytics accumulators
      const learnCounts: Record<string, number> = { Visual: 0, Auditory: 0, 'Read/Write': 0, Kinesthetic: 0 };
      const personalityAccum: Record<string, number[]> = {
        Openness: [], Conscientiousness: [], Extraversion: [], Agreeableness: [], 'Emotional Stability': []
      };
      const gradeCounts: Record<string, number> = {};
      const careerCounts: Record<string, number> = {};
      const riasecAccum: Record<string, number[]> = { R: [], I: [], A: [], S: [], E: [], C: [] };
      const iqBuckets: Record<string, number> = {
        '< 80': 0, '80–89': 0, '90–99': 0, '100–109': 0,
        '110–119': 0, '120–129': 0, '130–139': 0, '140+': 0
      };
      const personaCounts: Record<string, number> = {};
      const aptIq: Record<string, number[]> = { Verbal: [], Numerical: [], Reasoning: [], Spatial: [] };
      const aptPsycho: Record<string, number[]> = { Verbal: [], Numerical: [], Reasoning: [], Spatial: [] };
      
      let scoreSum = 0;
      let iqCount = 0;
      let aptitudeSum = 0;
      let aptitudeCount = 0;

      // Map IQ strength names to standardized cognitive domains
      const iqStrengthMap: Record<string, string> = {
        'logical reasoning': 'Analytical Thinking',
        'logical_reasoning': 'Analytical Thinking',
        'analytical thinking': 'Analytical Thinking',
        'analytical_thinking': 'Analytical Thinking',
        'pattern recognition': 'Problem Solving',
        'pattern_recognition': 'Problem Solving',
        'problem solving': 'Problem Solving',
        'problem_solving': 'Problem Solving',
        'numerical intelligence': 'Numerical Intelligence',
        'numerical_intelligence': 'Numerical Intelligence',
        'verbal reasoning': 'Verbal Reasoning',
        'verbal_reasoning': 'Verbal Reasoning',
      };

      // Derive dominant cognitive domain from psychometric aptitude sub-scores
      function getPsychoDomain(data: any): string {
        const apt = data.scores?.aptitude;
        if (!apt) return 'Analytical Thinking';
        const domainScores: { domain: string; score: number }[] = [
          { domain: 'Verbal Reasoning', score: apt.verbal || 0 },
          { domain: 'Numerical Intelligence', score: apt.numerical || 0 },
          { domain: 'Analytical Thinking', score: apt.reasoning || 0 },
          { domain: 'Creative Thinking', score: apt.spatial || 0 },
        ];
        const riasec = data.scores?.topRiasec || [];
        const topCode = riasec[0] || '';
        if (topCode === 'S' || topCode === 'E') return 'Social Intelligence';
        if (topCode === 'R' || topCode === 'I') return 'Problem Solving';
        domainScores.sort((a, b) => b.score - a.score);
        return domainScores[0].domain;
      }

      // Map VARK key to label
      const varkLabelMap: Record<string, string> = {
        V: 'Visual', A: 'Auditory', R: 'Read/Write', K: 'Kinesthetic',
        visual: 'Visual', auditory: 'Auditory', 'read/write': 'Read/Write',
        'reading/writing': 'Read/Write', reading: 'Read/Write', kinesthetic: 'Kinesthetic',
      };

      combinedDocs.forEach(data => {
        let score = 0;
        let tier = 'Unknown';
        let domain = 'Analytical Thinking';

        if (data._type === 'psychometric') {
          score = data.scores?.aptitude?.overall || 0;
          tier = data.testName || 'Psychometric Test';
          domain = getPsychoDomain(data);

          // ── Learning style ──
          const topVark = data.scores?.topVark || '';
          const label = varkLabelMap[topVark] || varkLabelMap[topVark.toLowerCase()] || '';
          if (label && learnCounts[label] !== undefined) {
            learnCounts[label]++;
          }

          // ── Big Five personality ──
          const pers = data.scores?.personality;
          if (pers) {
            if (typeof pers.openness === 'number') personalityAccum.Openness.push(pers.openness);
            if (typeof pers.conscientiousness === 'number') personalityAccum.Conscientiousness.push(pers.conscientiousness);
            if (typeof pers.extraversion === 'number') personalityAccum.Extraversion.push(pers.extraversion);
            if (typeof pers.agreeableness === 'number') personalityAccum.Agreeableness.push(pers.agreeableness);
            if (typeof pers.emotionalStability === 'number') personalityAccum['Emotional Stability'].push(pers.emotionalStability);
          }

          // ── Grade distribution ──
          const grade = data.student?.grade || data.assessmentType || 'Unknown';
          const gradeLabel = grade === 'junior' ? 'Junior (7-9)' : grade === '10' ? 'Grade 10' : grade === '12' ? 'Grade 12' : grade === 'senior' ? 'Senior' : `Grade ${grade}`;
          gradeCounts[gradeLabel] = (gradeCounts[gradeLabel] || 0) + 1;

          // ── Career clusters ──
          const fitment = data.scores?.careerFitment;
          if (Array.isArray(fitment)) {
            // Take top 2 career clusters per student
            fitment.slice(0, 2).forEach((c: any) => {
              if (c.name) {
                careerCounts[c.name] = (careerCounts[c.name] || 0) + 1;
              }
            });
          }

          // ── RIASEC profile ──
          const riasec = data.scores?.riasec;
          if (riasec) {
            ['R', 'I', 'A', 'S', 'E', 'C'].forEach(code => {
              if (typeof riasec[code] === 'number') {
                riasecAccum[code].push(riasec[code]);
              }
            });
          }

          // ── Aptitude sub-scores (psychometric) ──
          const apt = data.scores?.aptitude;
          if (apt) {
            if (typeof apt.verbal === 'number') aptPsycho.Verbal.push(apt.verbal);
            if (typeof apt.numerical === 'number') aptPsycho.Numerical.push(apt.numerical);
            if (typeof apt.reasoning === 'number') aptPsycho.Reasoning.push(apt.reasoning);
            if (typeof apt.spatial === 'number') aptPsycho.Spatial.push(apt.spatial);
            if (typeof apt.overall === 'number') { aptitudeSum += apt.overall; aptitudeCount++; }
          }

        } else {
          // IQ test
          score = data.iqScore || 0;
          tier = data.tier || 'Unknown';
          const rawStrength = (data.strength || '').toLowerCase().trim();
          domain = iqStrengthMap[rawStrength] || 'Analytical Thinking';
          
          scoreSum += score;
          iqCount++;
          if (score >= 130 || tier === 'Exceptional') {
            exceptionalCount++;
          }

          // ── IQ histogram ──
          if (score < 80) iqBuckets['< 80']++;
          else if (score < 90) iqBuckets['80–89']++;
          else if (score < 100) iqBuckets['90–99']++;
          else if (score < 110) iqBuckets['100–109']++;
          else if (score < 120) iqBuckets['110–119']++;
          else if (score < 130) iqBuckets['120–129']++;
          else if (score < 140) iqBuckets['130–139']++;
          else iqBuckets['140+']++;

          // ── Cognitive persona ──
          const persona = data.cognitivePersona || '';
          if (persona) {
            personaCounts[persona] = (personaCounts[persona] || 0) + 1;
          }

          // ── Aptitude sub-scores (IQ domains) ──
          const domains = data.domains;
          if (Array.isArray(domains)) {
            domains.forEach((d: any) => {
              const cat = (d.category || '').toLowerCase();
              if (cat.includes('verbal')) aptIq.Verbal.push(d.percentage || 0);
              else if (cat.includes('numer')) aptIq.Numerical.push(d.percentage || 0);
              else if (cat.includes('logical') || cat.includes('reason') || cat.includes('analyt')) aptIq.Reasoning.push(d.percentage || 0);
              else if (cat.includes('pattern') || cat.includes('spatial') || cat.includes('problem')) aptIq.Spatial.push(d.percentage || 0);
            });
          }
        }

        // Tier data
        tierCounts[tier] = (tierCounts[tier] || 0) + 1;
        
        // Strength data — always one of the 6 standardized domains
        strengthCounts[domain] = (strengthCounts[domain] || 0) + 1;

        // Timeline data
        if (data.createdAt) {
          const dateStr = new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!dateStats[dateStr]) {
            dateStats[dateStr] = { totalScore: 0, count: 0 };
          }
          if (data._type === 'iq') {
            dateStats[dateStr].totalScore += score;
            dateStats[dateStr].count += 1;
          }
        }
      });

      if (iqCount > 0) {
        avgScore = Math.round(scoreSum / iqCount);
      }
      if (aptitudeCount > 0) {
        avgAptitude = Math.round(aptitudeSum / aptitudeCount);
      }

      tierData = Object.keys(tierCounts).map(k => ({ name: k, count: tierCounts[k] })).sort((a, b) => b.count - a.count);
      strengthData = Object.keys(strengthCounts)
        .filter(k => strengthCounts[k] > 0)
        .map(k => ({ name: k, value: strengthCounts[k] }))
        .sort((a, b) => b.value - a.value);
      
      timelineData = Object.keys(dateStats).map(k => ({
        date: k,
        avgScore: dateStats[k].count > 0 ? Math.round(dateStats[k].totalScore / dateStats[k].count) : 0,
        count: dateStats[k].count
      }));

      // ── Build new analytics arrays ──

      // Learning styles
      learningStyleData = Object.keys(learnCounts)
        .filter(k => learnCounts[k] > 0)
        .map(k => ({ name: k, value: learnCounts[k] }))
        .sort((a, b) => b.value - a.value);

      // Personality averages
      const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
      personalityData = Object.keys(personalityAccum).map(k => ({
        trait: k, average: avg(personalityAccum[k])
      }));

      // Grade distribution
      gradeData = Object.keys(gradeCounts)
        .map(k => ({ name: k, value: gradeCounts[k] }))
        .sort((a, b) => b.value - a.value);

      // Career clusters (top 8)
      careerData = Object.keys(careerCounts)
        .map(k => ({ name: k, count: careerCounts[k] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // RIASEC profile
      riasecData = ['R', 'I', 'A', 'S', 'E', 'C'].map(code => ({
        code,
        average: avg(riasecAccum[code])
      }));

      // IQ histogram
      iqHistogramData = Object.keys(iqBuckets).map(k => ({ range: k, count: iqBuckets[k] }));

      // Cognitive personas
      personaData = Object.keys(personaCounts)
        .filter(k => personaCounts[k] > 0)
        .map(k => ({ name: k, value: personaCounts[k] }))
        .sort((a, b) => b.value - a.value);

      // Aptitude domain comparison
      aptitudeDomainData = ['Verbal', 'Numerical', 'Reasoning', 'Spatial'].map(d => ({
        domain: d,
        iq: avg(aptIq[d]),
        psychometric: avg(aptPsycho[d])
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
            <p>Total Assessments</p>
            <div className={styles.statTrend} style={{ color: '#4CAF50' }}>{iqTestCount} IQ · {psychoCount} Psychometric</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconAlerts}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{avgScore}</h3>
            <p>Average IQ Score</p>
            <div className={styles.statTrend}>Avg Aptitude: {avgAptitude}%</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.statIconStates}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div className={styles.statContent}>
            <h3>{exceptionalCount}</h3>
            <p>Exceptional Performers</p>
            <div className={styles.statTrend} style={{ color: '#FF9800' }}>IQ 130+</div>
          </div>
        </div>
      </div>

      {totalAssessments > 0 ? (
        <AnalyticsClient 
          tierData={tierData} 
          strengthData={strengthData} 
          timelineData={timelineData}
          learningStyleData={learningStyleData}
          personalityData={personalityData}
          gradeData={gradeData}
          careerData={careerData}
          riasecData={riasecData}
          iqHistogramData={iqHistogramData}
          personaData={personaData}
          aptitudeDomainData={aptitudeDomainData}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', color: 'var(--text-muted)' }}>
          <p>No assessment data available to generate analytics yet.</p>
        </div>
      )}
    </div>
  );
}
