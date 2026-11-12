import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';
import { getSop } from '@/lib/wix-library';
import dash from '@/styles/student-dashboard.module.css';
import styles from '@/styles/student-library.module.css';
import { SopEssayView } from '@/components/Dashboard/Library/SopEssayView';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const sop = await getSop(id).catch(() => null);
  return { title: sop ? sop.title : 'SOP' };
}

export default async function SopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  const { id } = await params;
  const sop = await getSop(id).catch(() => null);
  if (!sop) notFound();

  return (
    <div className={dash.dashboardContent}>
      <Link href="/dashboard/student/sops" className={styles.back}>
        ← Back to SOP Library
      </Link>
      <SopEssayView sop={sop} />
    </div>
  );
}
