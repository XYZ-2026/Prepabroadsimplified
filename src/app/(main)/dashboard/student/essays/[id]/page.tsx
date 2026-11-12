import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';
import { getEssay, type EssayRecord } from '@/lib/essay-service';
import EssayEditor from '@/components/Dashboard/Student/EssayEditor';
import dash from '@/styles/student-dashboard.module.css';
import styles from '@/styles/student-workspace.module.css';

export const metadata: Metadata = { title: 'Edit Essay' };
export const dynamic = 'force-dynamic';

export default async function EssayPage({ params }: { params: Promise<{ id: string }> }) {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  const { id } = await params;
  let essay: EssayRecord | null = null;
  try {
    essay = await getEssay(claims.uid, id);
  } catch (err) {
    console.error('Error loading essay:', err);
    return (
      <div className={dash.dashboardContent}>
        <div className={styles.wrap}>
          <Link href="/dashboard/student/essays" className={styles.back}>← All essays</Link>
          <div className={`${styles.notice} ${styles.noticeError}`}>This essay is temporarily unavailable. Please try again in a moment.</div>
        </div>
      </div>
    );
  }
  if (!essay) notFound();

  return (
    <div className={dash.dashboardContent}>
      <div className={styles.wrap}>
        <Link href="/dashboard/student/essays" className={styles.back}>← All essays</Link>
        <EssayEditor essay={essay} />
      </div>
    </div>
  );
}
