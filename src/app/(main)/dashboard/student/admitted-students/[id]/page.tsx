import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';
import { getAdmitted } from '@/lib/wix-library';
import dash from '@/styles/student-dashboard.module.css';
import lib from '@/styles/student-library.module.css';
import { AdmittedProfile } from '@/components/Dashboard/Library/AdmittedViews';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const s = await getAdmitted(decodeURIComponent(id)).catch(() => null);
  return { title: s ? `${s.name} — ${s.college}` : 'Admitted Student' };
}

export default async function AdmittedStudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  const { id } = await params;
  const student = await getAdmitted(decodeURIComponent(id)).catch(() => null);
  if (!student) notFound();
  if (decodeURIComponent(id) !== student.username) {
    permanentRedirect(`/dashboard/student/admitted-students/${encodeURIComponent(student.username)}`);
  }

  return (
    <div className={dash.dashboardContent}>
      <Link href="/dashboard/student/admitted-students" className={lib.back}>
        ← Back to Admitted Students
      </Link>
      <AdmittedProfile student={student} />
    </div>
  );
}
