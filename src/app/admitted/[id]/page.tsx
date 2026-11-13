import type { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PortfolioExperience from '@/components/portfolio/PortfolioExperience';
import AuthGate from '@/components/Auth/AuthGate';
import { verifySessionCookie } from '@/lib/auth';
import { getAdmitted } from '@/lib/wix-library';
import { admittedToPortfolio } from '@/lib/admitted-portfolio';

// Portfolio generated automatically for every admitted-student profile, rendered with the
// same cinematic experience as student portfolios. Anyone can view it; any action that leaves
// the page (project links, resume/CV, contact, the full profile) asks signed-out visitors to
// sign in through a popup and then returns them here.
export const dynamic = 'force-dynamic';

const loadStudent = cache(async (id: string) => getAdmitted(decodeURIComponent(id)).catch(() => null));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const st = await loadStudent(id);
  return {
    title: st ? `${st.name} — Admitted to ${st.college}` : 'Admitted Student Portfolio',
    robots: { index: false, follow: false },
  };
}

export default async function AdmittedPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const signedIn = Boolean(await verifySessionCookie());

  const { id } = await params;
  const student = await loadStudent(id);
  if (!student) notFound();

  return (
    <AuthGate
      signedIn={signedIn}
      mode="actions"
      title="Sign in to continue"
      subtitle={`Create a free CLARVO account or sign in to open ${student.name.split(' ')[0]}'s links, resume and full profile.`}
    >
      <PortfolioExperience profile={admittedToPortfolio(student)} />
      <Link
        href={`/admitted-students/${encodeURIComponent(student.id)}`}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 60,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          borderRadius: 999,
          background: 'rgba(15, 17, 26, 0.82)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        }}
      >
        ← Full admission profile
      </Link>
    </AuthGate>
  );
}
