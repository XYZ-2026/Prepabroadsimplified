import Link from 'next/link';

export default function AccessRestricted({ title = "Access Restricted", message = "Please sign in to your account to access our premium study abroad tools." }: { title?: string, message?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-red-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-heading)', marginBottom: '16px', letterSpacing: '-0.5px' }}>
        {title}
      </h2>
      <p style={{ color: 'var(--text-body)', fontSize: '16px', maxWidth: '420px', lineHeight: '1.6', marginBottom: '32px' }}>
        {message}
      </p>
      <Link href="/auth" style={{ 
        display: 'inline-flex', 
        alignItems: 'center',
        background: 'var(--color-red-deep)', 
        color: 'white', 
        padding: '12px 28px', 
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '15px',
        boxShadow: '0 8px 16px rgba(219, 40, 40, 0.2)',
        transition: 'all 0.2s ease',
        textDecoration: 'none'
      }}>
        Sign In Now 
        <svg style={{ marginLeft: '8px' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </Link>
    </div>
  );
}
