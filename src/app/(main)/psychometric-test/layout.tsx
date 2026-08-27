import type { Metadata } from 'next';
import { verifySessionCookie, getUserProfile } from '@/lib/auth';
import AccessRestricted from '@/components/Auth/AccessRestricted';
import ToolLocked from '@/components/Auth/ToolLocked';

export const metadata: Metadata = {
  title: 'Psychometric Assessment & Career Personality Evaluation',
  description:
    'Comprehensive psychometric profiling for study abroad students. Evaluate learning style, global adaptability, analytical mindset, and career alignment.',
  keywords: [
    'psychometric test',
    'career assessment',
    'study abroad psychometric test',
    'personality evaluation for students',
    'career compatibility index',
  ],
  alternates: {
    canonical: '/psychometric-test',
  },
  openGraph: {
    title: 'Psychometric Assessment & Career Personality Evaluation | Abroad Simplified',
    description:
      'Discover your ideal career path, learning style, and global adaptability profile.',
    url: 'https://www.abroadsimplified.com/psychometric-test',
  },
};

export default async function PsychometricTestLayout({ children }: { children: React.ReactNode }) {
  const claims = await verifySessionCookie();

  if (!claims) {
    return (
      <main style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <AccessRestricted />
      </main>
    );
  }

  const profile = await getUserProfile();
  if (profile?.toolAccess && profile.toolAccess.psychometricTest === false) {
    return (
      <main style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <ToolLocked toolName="Psychometric Test" toolId="psychometricTest" />
      </main>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
