import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div style={{ padding: 'calc(var(--topbar-height) + 40px) 40px 40px 40px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Admin Overview</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
        Welcome to the administrator dashboard.
      </p>
      
      <div style={{ background: 'var(--bg-surface)', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Admin Shortcuts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <Link href="/dashboard/admin/users" style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'border-color 0.2s ease' }} className="hover:border-[var(--color-red-deep)]">
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-heading)' }}>Manage Users &rarr;</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>View, search, and export registered students.</div>
          </Link>
          <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-heading)' }}>Universities</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Manage university listings and requirements.</div>
          </div>
          <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-heading)' }}>Applications</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Review student applications and status.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
