import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';
import { getAdmitted } from '@/lib/wix-library';
import lib from '@/styles/student-library.module.css';
import { AdmittedProfile } from '@/components/Dashboard/Library/AdmittedViews';
import LockedProfile from '@/components/Auth/LockedProfile';
import PortfolioCTA from '@/components/Auth/PortfolioCTA';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const st = await getAdmitted(decodeURIComponent(id)).catch(() => null);
  return {
    title: st ? `${st.name} — Admitted to ${st.college}` : 'Admitted Student',
    // Individual student records stay out of search engines.
    robots: { index: false, follow: false },
  };
}

/**
 * Full admitted-student profile on the website. Signed-out visitors (e.g. someone opening a
 * shared link) see a locked preview with the sign-in popup already open; after signing in
 * they land back here, never on the dashboard.
 */
export default async function PublicAdmittedProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const signedIn = Boolean(await verifySessionCookie());
  const student = await getAdmitted(decodeURIComponent(id)).catch(() => null);
  if (!student) notFound();

  const self = `/admitted-students/${encodeURIComponent(student.username)}`;
  // Old links used the record id; send them to the username URL.
  if (decodeURIComponent(id) !== student.username) permanentRedirect(self);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/admitted-students" className={lib.back}>
        ← Back to Admitted Students
      </Link>
      {signedIn ? (
        <>
          <AdmittedProfile student={student} />
          <PortfolioCTA signedIn variant="band" />
        </>
      ) : (
        <LockedProfile
          redirectTo={self}
          name={student.name}
          college={student.college}
          major={student.major}
          portfolioHref={`/admitted/${encodeURIComponent(student.username)}`}
        />
      )}
    </div>
  );
}
