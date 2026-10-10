import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { verifySessionCookie, getUserProfile } from '@/lib/auth';
import AccessRestricted from '@/components/Auth/AccessRestricted';
import ToolLocked from '@/components/Auth/ToolLocked';
import { isToolAccessGranted } from '@/config/tool-access.config';

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
    title: 'Psychometric Assessment & Career Personality Evaluation | CLARVO',
    description:
      'Discover your ideal career path, learning style, and academic-stream alignment.',
    url: 'https://www.clarvo.com/psychometric-test',
  },
};

export default async function PsychometricTestLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || headersList.get('x-matched-path') || headersList.get('next-url') || '';
  if (pathname.includes('/sample-report')) {
    return <>{children}</>;
  }

  const claims = await verifySessionCookie();

  if (!claims) {
    return (
      <main style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <AccessRestricted />
      </main>
    );
  }

  const profile = await getUserProfile();
  if (!isToolAccessGranted('psychometricTest', profile?.toolAccess, profile?.grade, profile?.role)) {
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
