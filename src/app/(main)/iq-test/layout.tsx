import type { Metadata } from 'next';
import Script from 'next/script';
import { verifySessionCookie, getUserProfile } from '@/lib/auth';
import AccessRestricted from '@/components/Auth/AccessRestricted';
import ToolLocked from '@/components/Auth/ToolLocked';

export const metadata: Metadata = {
  title: 'Online IQ / Cognitive Assessment | Abroad Simplified',
  description:
    'Take a visual-first 45-question cognitive assessment measuring reasoning, pattern recognition, numerical, spatial and abstract thinking.',
  keywords: [
    'online IQ test',
    'cognitive assessment',
    '45-question IQ assessment',
    'visual matrix reasoning',
    'pattern recognition test',
    'Abroad Simplified',
  ],
  alternates: {
    canonical: '/iq-test',
  },
  openGraph: {
    title: 'Online IQ / Cognitive Assessment | Abroad Simplified',
    description:
      'Take a visual-first 45-question cognitive assessment measuring reasoning, pattern recognition, numerical, spatial and abstract thinking.',
    url: 'https://www.abroadsimplified.com/iq-test',
  },
};

export default async function IQTestLayout({ children }: { children: React.ReactNode }) {
  const claims = await verifySessionCookie();

  if (!claims) {
    return (
      <main style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <AccessRestricted />
      </main>
    );
  }

  const profile = await getUserProfile();
  if (profile?.toolAccess && profile.toolAccess.iqTest === false) {
    return (
      <main style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <ToolLocked toolName="IQ Test" toolId="iqTest" />
      </main>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
