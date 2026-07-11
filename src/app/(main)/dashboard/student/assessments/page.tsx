import { redirect } from 'next/navigation';
import Link from 'next/link';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import styles from '@/styles/student-dashboard.module.css';
import componentsStyles from '@/styles/components.module.css';

export default async function AssessmentsPage() {
  const claims = await verifySessionCookie();
  
  if (!claims) {
    redirect('/auth');
  }

  let assessments: Array<any> = [];

  try {
    const assessmentsSnapshot = await adminDb
      .collection('iq_results')
      .where('userId', '==', claims.uid)
      .get();
      
    const psychometricSnapshot = await adminDb
      .collection('psychometric_results')
      .where('userId', '==', claims.uid)
      .get();
      
    assessments = [
      ...assessmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })),
      ...psychometricSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    ];
    
    // Sort in memory to avoid requiring a composite index in Firestore
    assessments.sort((a, b) => {
      const dateA = new Date((a.createdAt as string) || 0).getTime();
      const dateB = new Date((b.createdAt as string) || 0).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
  }

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Assessments</h1>
        <p className={styles.pageSubtitle}>View your past test results and analytical breakdowns.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Completed Tests</h2>
        </div>
        <div className={styles.cardBody}>
          {assessments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '80px', height: '80px', borderRadius: '50%', background: '#f3f4f6', marginBottom: '24px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <p style={{ marginBottom: '24px', fontSize: '16px', fontWeight: '500' }}>You haven't taken any assessments yet.</p>
              <Link href="/iq-test" className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}>
                Take an IQ Test
              </Link>
            </div>
          ) : (
            <div className={styles.assessmentGrid}>
              {assessments.map(assessment => {
                const date = new Date((assessment.createdAt as string) || 0);
                const dateString = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });

                // Format strength nicely
                let formattedStrength = 'N/A';
                if (assessment.type === 'psychometric') {
                  const riasec = assessment.scores?.topRiasec || [];
                  formattedStrength = riasec.length > 0 ? riasec.join('-') : 'N/A';
                } else {
                  const rawStrength = (assessment.strength as string) || 'N/A';
                  formattedStrength = rawStrength.includes('_') 
                    ? rawStrength.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                    : rawStrength;
                }

                // Determine Score and Percentile
                const scoreValue = assessment.type === 'psychometric'
                  ? `${assessment.scores?.aptitude?.overall || 0}%`
                  : assessment.iqScore || 'N/A';
                  
                const scoreLabel = assessment.type === 'psychometric' ? 'Aptitude Score' : 'IQ Score';
                
                const percentileValue = assessment.type === 'psychometric' 
                  ? (assessment.scores?.careerFitment?.[0]?.name?.split(' ')?.[0] || 'N/A') // Best fit career
                  : (assessment.percentile ? `${assessment.percentile}th` : 'N/A');
                  
                const percentileLabel = assessment.type === 'psychometric' ? 'Best Fit' : 'Percentile';
                const strengthLabel = assessment.type === 'psychometric' ? 'Top Interest (RIASEC)' : 'Top Strength';

                const resultLink = assessment.type === 'psychometric'
                  ? `/psychometric-test/result/${assessment.id as string}?source=my-assessments`
                  : `/iq-test/result/${assessment.id as string}?source=my-assessments`;

                return (
                  <div key={assessment.id as string} className={styles.premiumCard}>
                    <div className={styles.cardHeaderTop}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '10px', background: assessment.type === 'psychometric' ? 'var(--color-gold-light, #f4b400)' : 'var(--color-red-tint, #ffe5e5)', color: assessment.type === 'psychometric' ? '#000' : 'var(--color-red-deep, #690b1b)' }}>
                            {assessment.type === 'psychometric' ? 'Psychometric' : 'IQ Test'}
                          </span>
                        </div>
                        <h3 className={styles.cardTitlePremium}>
                          {assessment.testName || 'IQ Assessment'}
                        </h3>
                        <p className={styles.cardDate}>
                          Taken on {dateString}
                        </p>
                      </div>
                      <div className={styles.badgePremium}>
                        {assessment.tier || 'Completed'}
                      </div>
                    </div>
                    
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricRow}>
                        <div className={styles.metricLabel}>
                          <span className={styles.metricIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                          </span>
                          {scoreLabel}
                        </div>
                        <span className={styles.metricValue}>{scoreValue}</span>
                      </div>
                      
                      <div className={styles.metricRow}>
                        <div className={styles.metricLabel}>
                          <span className={styles.metricIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          </span>
                          {percentileLabel}
                        </div>
                        <span className={styles.metricValue}>{percentileValue}</span>
                      </div>

                      <div className={styles.metricRow}>
                        <div className={styles.metricLabel}>
                          <span className={styles.metricIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                          </span>
                          {strengthLabel}
                        </div>
                        <span className={styles.metricValue}>{formattedStrength}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cardAction}>
                      <Link 
                        href={resultLink}
                        className={`${componentsStyles.btn} ${componentsStyles.btnOutline}`}
                        style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                      >
                        View Full Analytics
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
