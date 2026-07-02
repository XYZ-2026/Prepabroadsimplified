import { verifySessionCookie } from '@/lib/auth';
import AccessRestricted from '@/components/Auth/AccessRestricted';

export default async function IQTestPage() {
  const claims = await verifySessionCookie();

  if (!claims) {
    return (
      <main className="main-content" style={{ minHeight: '100vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
        <AccessRestricted message="Please sign in to your account to take the IQ Test." />
      </main>
    );
  }

  return (
    <main className="main-content" style={{ minHeight: '80vh', padding: 'calc(var(--topbar-height) + 40px) 20px', background: 'var(--page-bg, #f7f8fb)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>IQ Test</h1>
        <p style={{ color: 'var(--text-body)', fontSize: '18px' }}>
          Welcome to the IQ Test section. This feature is coming soon!
        </p>
      </div>
    </main>
  );
}
