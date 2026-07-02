import Script from 'next/script';
import { verifySessionCookie } from '@/lib/auth';
import AccessRestricted from '@/components/Auth/AccessRestricted';

export default async function IQTestLayout({ children }: { children: React.ReactNode }) {
  const claims = await verifySessionCookie();

  if (!claims) {
    return (
      <main style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <AccessRestricted />
      </main>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
