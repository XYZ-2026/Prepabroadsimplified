import Script from 'next/script';
import { verifySessionCookie, getUserProfile } from '@/lib/auth';
import AccessRestricted from '@/components/Auth/AccessRestricted';
import ToolLocked from '@/components/Auth/ToolLocked';

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
