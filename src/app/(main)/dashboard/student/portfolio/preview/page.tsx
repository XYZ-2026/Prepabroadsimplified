import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';
import PortfolioExperience from '@/components/portfolio/PortfolioExperience';
import { getPortfolioByUid } from '@/lib/portfolio-service';
import { recordToProfile } from '@/components/portfolio/portfolioTypes';

export const metadata: Metadata = { title: 'Portfolio Preview', robots: { index: false, follow: false } };

const EDITOR_URL = '/dashboard/student/portfolio';

// Private preview of the student's own portfolio. Works whether or not it is published,
// so students can see exactly how it looks before making it public.
export default async function PortfolioPreviewPage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');
  if (claims.role !== 'student') redirect('/dashboard');

  let record = null;
  try {
    record = await getPortfolioByUid(claims.uid);
  } catch (err) {
    console.error('Error loading portfolio preview:', err);
  }
  if (!record) redirect(EDITOR_URL);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 16,
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 10px 8px 16px',
          borderRadius: 999,
          background: 'rgba(15, 23, 42, 0.92)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <span>{record.published ? 'Preview · your portfolio is public' : 'Preview · only you can see this'}</span>
        <Link
          href={EDITOR_URL}
          style={{ padding: '6px 12px', borderRadius: 999, background: '#fff', color: '#0f172a', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          ← Back to editor
        </Link>
      </div>
      <PortfolioExperience profile={recordToProfile(record)} />
    </>
  );
}
