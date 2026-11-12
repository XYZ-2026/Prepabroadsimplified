import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import {
  getAllCareerProfiles,
  getAllClusters,
  extractMatchScoresFromReport,
} from '@/lib/career-library/career-service';
import RemoveSavedCareerButton from '@/components/Dashboard/Student/RemoveSavedCareerButton';
import dash from '@/styles/student-dashboard.module.css';
import styles from '@/styles/student-workspace.module.css';

export const metadata: Metadata = { title: 'Saved Careers' };
export const dynamic = 'force-dynamic';

export default async function SavedCareersPage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  const profiles = getAllCareerProfiles();
  const clusters = getAllClusters();

  let saved: { id: string; savedAt: string }[] = [];
  let failed = false;
  const matches: Record<string, number> = {};

  try {
    const snap = await adminDb.collection('users').doc(claims.uid).get();
    const raw = snap.data()?.savedCareers;
    if (Array.isArray(raw)) {
      saved = raw
        .filter((x) => x && typeof x.id === 'string')
        .map((x) => ({ id: x.id as string, savedAt: typeof x.savedAt === 'string' ? x.savedAt : '' }));
    }

    // Personal match % from the latest psychometric report (if the student has one)
    try {
      const results = await adminDb.collection('psychometric_results').where('userId', '==', claims.uid).get();
      if (!results.empty) {
        const latest: any = results.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
        const scores = extractMatchScoresFromReport(latest, profiles);
        for (const [id, m] of Object.entries(scores)) {
          if (typeof (m as any).matchScore === 'number') matches[id] = (m as any).matchScore;
        }
      }
    } catch (mErr) {
      console.warn('Saved careers: match scores unavailable:', mErr);
    }
  } catch (err) {
    failed = true;
    console.error('Error loading saved careers:', err);
  }

  const items = saved
    .map((s) => ({ ...s, profile: profiles.find((p) => p.id === s.id) }))
    .filter((x) => x.profile)
    .sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));

  return (
    <div className={dash.dashboardContent}>
      <div className={styles.wrap}>
        <div className={dash.pageHeader}>
          <h1 className={dash.pageTitle}>Saved Careers</h1>
          <p className={dash.pageSubtitle}>The careers you bookmarked in the Career Library, all in one place.</p>
        </div>

        {failed ? (
          <div className={`${styles.notice} ${styles.noticeError}`}>Your saved careers are temporarily unavailable. Please try again in a moment.</div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <h2 className={styles.emptyTitle}>No saved careers yet</h2>
            <p style={{ margin: 0 }}>Tap the bookmark on any career in the library to keep it here for later.</p>
            <Link href="/career-library" className={`${styles.btn} ${styles.btnPrimary}`}>Explore the Career Library</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map(({ id, profile }) => (
              <div key={id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={`${styles.badge} ${styles.badgeBlue}`}>{clusters[profile!.cluster]?.name || 'Career'}</span>
                  {typeof matches[id] === 'number' && <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ {matches[id]}% match</span>}
                </div>
                <h2 className={styles.cardTitle}>{profile!.name}</h2>
                <p className={styles.excerpt}>{profile!.desc}</p>
                <div className={styles.actions} style={{ marginTop: 6 }}>
                  <Link href={`/career-library?career=${encodeURIComponent(id)}`} className={`${styles.btn} ${styles.btnPrimary}`}>
                    View roadmap
                  </Link>
                  <RemoveSavedCareerButton careerId={id} careerName={profile!.name} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
