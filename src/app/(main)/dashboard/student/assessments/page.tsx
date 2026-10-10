import { redirect } from 'next/navigation';
import Link from 'next/link';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { getStudentPsychometricAccess, formatGradeLabel } from '@/lib/psychometric-access-policy';
import styles from '@/styles/student-dashboard.module.css';
import componentsStyles from '@/styles/components.module.css';

export default async function AssessmentsPage() {
  const claims = await verifySessionCookie();
  
  if (!claims) {
    redirect('/auth');
  }

  let assessments: Array<any> = [];
  let savedRoadmaps: Array<any> = [];
  let userGrade: string | null = null;
  let userToolAccess: any = null;
  let userRole = 'student';
  let completedPsychMap: Record<string, { id: string; reportUrl: string; createdAt: string; testName: string }> = {};

  try {
    const userDoc = await adminDb.collection('users').doc(claims.uid).get();
    if (userDoc.exists) {
      const uData = userDoc.data();
      userGrade = uData?.grade || uData?.academicGrade || null;
      userToolAccess = uData?.toolAccess || null;
      userRole = uData?.role || 'student';
    }

    const assessmentsSnapshot = await adminDb
      .collection('iq_results')
      .where('userId', '==', claims.uid)
      .get();
      
    const psychometricSnapshot = await adminDb
      .collection('psychometric_results')
      .where('userId', '==', claims.uid)
      .get();

    psychometricSnapshot.docs.forEach(doc => {
      const d = doc.data();
      const t = (d.assessmentType || d.testType || '').toLowerCase();
      const v = (d.assessmentVariant || '').toUpperCase();
      let key = 'senior';
      if (t === 'junior' || v === 'JUNIOR_7_9' || t.includes('junior') || t.includes('7') || t.includes('8') || t.includes('9')) {
        key = 'junior';
      } else if (t === 'grade10' || v === 'CLASS_10' || t.includes('10')) {
        key = 'grade10';
      }
      if (!completedPsychMap[key]) {
        completedPsychMap[key] = {
          id: doc.id,
          reportUrl: `/psychometric-test?resultId=${doc.id}`,
          createdAt: d.createdAt,
          testName: d.testName || 'Psychometric Assessment',
        };
      }
    });
      
    const workflowsSnapshot = await adminDb
      .collection('assessment_workflow')
      .where('studentId', '==', claims.uid)
      .get();
      
    const workflows = new Map();
    workflowsSnapshot.docs.forEach(doc => {
      workflows.set(doc.data().resultId, doc.data().state);
    });

    const roadmapsSnapshot = await adminDb
      .collection('career_roadmaps')
      .where('userId', '==', claims.uid)
      .get();

    savedRoadmaps = roadmapsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
      
    assessments = [
      ...assessmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })),
      ...psychometricSnapshot.docs.map(doc => ({
        id: doc.id,
        workflowState: workflows.get(doc.id) || 'parent_pending',
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

  const access = getStudentPsychometricAccess(userGrade, userToolAccess, userRole);

  return (
    <div className={styles.dashboardContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Assessments</h1>
        <p className={styles.pageSubtitle}>
          Academic-stage assessment access and past test analytics.
        </p>
      </div>

      {/* Profile Incomplete Warning Banner if grade is missing */}
      {access.status === 'PROFILE_INCOMPLETE' && (
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span> Academic Profile Incomplete
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: '#b45309' }}>
              Please select your current academic grade (Grade 7 to 12) in your profile to unlock your psychometric assessment.
            </p>
          </div>
          <Link
            href="/dashboard/student/update-profile"
            className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
            style={{ fontSize: '13px', padding: '8px 18px', background: '#92400e', color: '#fff' }}
          >
            Select Grade Now →
          </Link>
        </div>
      )}

      {/* ── Section 1: Psychometric Assessment Ecosystem (Grade-Based Access) ── */}
      <div className={styles.card} style={{ marginBottom: '32px' }}>
        <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 className={styles.cardTitle}>CLARVO Psychometric Tests</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>
              Assessment eligibility is authoritatively governed by your academic stage: <strong>{access.gradeLabel}</strong>
            </p>
          </div>
          {access.grade && (
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB' }}>
              {formatGradeLabel(access.grade)}
            </span>
          )}
        </div>
        <div className={styles.cardBody}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {access.allAssessments.map(item => {
              const completedInfo = completedPsychMap[item.toolKey];
              const isCompleted = !!completedInfo;

              return (
                <div 
                  key={item.variant}
                  style={{
                    background: item.isEligible ? '#ffffff' : '#f8fafc',
                    borderRadius: '16px',
                    padding: '24px',
                    border: item.isEligible ? (isCompleted ? '2px solid #057a55' : '2px solid #690b1b') : '1px solid #e2e8f0',
                    boxShadow: item.isEligible ? (isCompleted ? '0 8px 24px rgba(5, 122, 85, 0.08)' : '0 8px 24px rgba(105, 11, 27, 0.08)') : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    opacity: item.isEligible ? 1 : 0.82,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '8px',
                        background: isCompleted ? '#dcfce7' : (item.isEligible ? '#dcfce7' : '#f1f5f9'),
                        color: isCompleted ? '#166534' : (item.isEligible ? '#166534' : '#64748b'),
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}>
                        {isCompleted ? '✓ COMPLETED' : (item.statusBadge === 'AVAILABLE' ? '✓ AVAILABLE' : '🔒 LOCKED')}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                        {item.targetDescription}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: item.isEligible ? '#0f172a' : '#475569', margin: '0 0 6px 0' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                      {isCompleted 
                        ? 'Assessment completed! Your comprehensive diagnostic career dossier and family alignment report are ready to view.'
                        : (item.isEligible 
                          ? 'Designed specifically for your academic stage. Comprehensive evaluation of aptitude, RIASEC interest, and career alignment.'
                          : item.lockedReason)}
                    </p>
                  </div>

                  <div>
                    {isCompleted ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Link
                          href={completedInfo.reportUrl}
                          className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
                          style={{ width: '100%', justifyContent: 'center', textAlign: 'center', display: 'flex', padding: '10px', background: '#057A55', color: '#ffffff' }}
                        >
                          View Diagnostic Report →
                        </Link>
                        <Link
                          href={`${item.href}&retake=true`}
                          style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#64748b',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          Retake assessment
                        </Link>
                      </div>
                    ) : item.isEligible ? (
                      <Link
                        href={item.href}
                        className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
                        style={{ width: '100%', justifyContent: 'center', textAlign: 'center', display: 'flex', padding: '10px' }}
                      >
                        Explore Assessment →
                      </Link>
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          padding: '10px',
                          textAlign: 'center',
                          borderRadius: '8px',
                          background: '#f1f5f9',
                          color: '#94a3b8',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'not-allowed',
                          userSelect: 'none',
                        }}
                      >
                        🔒 Not Available for {access.gradeLabel}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section 2: Completed Assessments History ── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Completed Tests History</h2>
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
              {access.status === 'ELIGIBLE' && (
                <Link href={access.eligibleHref} className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}>
                  Take Your {access.eligibleAssessment?.shortName} →
                </Link>
              )}
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

                // Attempt Grade (HISTORICALLY IMMUTABLE)
                const attemptGrade = assessment.academicGradeAtAttempt 
                  ? `Grade ${assessment.academicGradeAtAttempt}`
                  : (assessment.student?.grade || 'Class 10');

                // Format strength nicely
                let formattedStrength = 'N/A';
                if (assessment.type === 'psychometric') {
                  const riasec = assessment.scores?.topRiasec || [];
                  formattedStrength = riasec.length > 0 ? riasec.join('-') : 'N/A';
                } else {
                  const rawStrength = (assessment.strongestDomain as string) || (assessment.strength as string) || 'N/A';
                  formattedStrength = rawStrength.includes('_') 
                    ? rawStrength.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                    : rawStrength;
                }

                // Determine Score and Percentile
                const scoreValue = assessment.type === 'psychometric'
                  ? `${assessment.scores?.aptitude?.overall || 0}%`
                  : (assessment.estimatedIQ ?? assessment.iqScore ?? 'N/A');
                  
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
                          {assessment.type === 'psychometric' && (
                            <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}>
                              Attempt: {attemptGrade}
                            </span>
                          )}
                        </div>
                        <h3 className={styles.cardTitlePremium}>
                          {assessment.testName || 'IQ Assessment'}
                        </h3>
                        <p className={styles.cardDate}>
                          Taken on {dateString}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div className={styles.badgePremium}>
                          {assessment.tier || 'Completed'}
                        </div>
                        {assessment.type === 'psychometric' && assessment.workflowState && assessment.workflowState !== 'report_unlocked' && (
                          <div style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: '#fef3c7', color: '#92400e' }}>
                            Parent Input Pending
                          </div>
                        )}
                        {assessment.type === 'psychometric' && assessment.workflowState === 'report_unlocked' && (
                          <div style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: '#dcfce7', color: '#166534' }}>
                            Report Unlocked
                          </div>
                        )}
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
                    
                    <div className={styles.cardAction} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Link 
                        href={resultLink}
                        className={`${componentsStyles.btn} ${componentsStyles.btnOutline}`}
                        style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                      >
                        {assessment.type === 'psychometric' && assessment.workflowState && assessment.workflowState !== 'report_unlocked' ? 'View Locked Report Status 🔒' : 'View Full Analytics ↗'}
                      </Link>
                      {assessment.type === 'psychometric' && assessment.workflowState && assessment.workflowState !== 'report_unlocked' && (
                        <Link
                          href={`/parent-assessment?resultId=${assessment.id as string}`}
                          className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
                          style={{ width: '100%', textAlign: 'center', justifyContent: 'center', background: '#690B1B', color: '#ffffff' }}
                        >
                          Complete Parent Test →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: Career Roadmap Studio — DISABLED ──
          This section is temporarily hidden while the Career Roadmap feature is
          disabled (feature flag: CAREER_ROADMAP_ENABLED = false).
          Saved roadmap data is preserved in Firestore.
          Restore this section when the feature is re-enabled.
      */}
    </div>
  );
}
