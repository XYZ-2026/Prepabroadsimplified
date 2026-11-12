import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';
import { listEssays, MAX_ESSAYS_PER_STUDENT, type EssaySummary } from '@/lib/essay-service';
import NewEssayButton from '@/components/Dashboard/Student/NewEssayButton';
import dash from '@/styles/student-dashboard.module.css';
import styles from '@/styles/student-workspace.module.css';

export const metadata: Metadata = { title: 'SOP & Essays' };
export const dynamic = 'force-dynamic';

const fmt = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default async function EssaysPage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  let essays: EssaySummary[] = [];
  let failed = false;
  try {
    essays = await listEssays(claims.uid);
  } catch (err) {
    failed = true;
    console.error('Error loading essays:', err);
  }

  return (
    <div className={dash.dashboardContent}>
      <div className={styles.wrap}>
        <div className={dash.pageHeader}>
          <h1 className={dash.pageTitle}>SOP &amp; Essays</h1>
          <p className={dash.pageSubtitle}>
            Write and save your statements of purpose and application essays. Only you can see them.
          </p>
        </div>

        <div className={styles.toolbar}>
          <NewEssayButton disabled={failed || essays.length >= MAX_ESSAYS_PER_STUDENT} />
          <Link href="/dashboard/student/sops" className={`${styles.btn} ${styles.btnOutline}`}>
            Read admitted essays for inspiration →
          </Link>
        </div>

        {failed ? (
          <div className={`${styles.notice} ${styles.noticeError}`}>Your essays are temporarily unavailable. Please try again in a moment.</div>
        ) : essays.length === 0 ? (
          <div className={styles.empty}>
            <h2 className={styles.emptyTitle}>No essays yet</h2>
            <p style={{ margin: 0 }}>Start with a first draft — you can polish it later. Your work saves automatically.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {essays.map((e) => (
              <Link key={e.id} href={`/dashboard/student/essays/${e.id}`} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={`${styles.badge} ${styles.badgeBlue}`}>{e.type}</span>
                  <span className={`${styles.badge} ${e.status === 'final' ? styles.badgeGreen : ''}`}>{e.status === 'final' ? 'Final' : 'Draft'}</span>
                </div>
                <h2 className={styles.cardTitle}>{e.title}</h2>
                <div className={styles.cardMeta}>
                  {[e.targetUniversity, `${e.wordCount.toLocaleString('en-IN')} words`, e.updatedAt && `Edited ${fmt(e.updatedAt)}`]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
                {e.excerpt && <p className={styles.excerpt}>{e.excerpt}{e.excerpt.length >= 160 ? '…' : ''}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
