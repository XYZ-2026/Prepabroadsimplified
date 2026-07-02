export default function StudentDashboard() {
  return (
    <div style={{ padding: 'calc(var(--topbar-height) + 40px) 40px 40px 40px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Welcome, Student!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
        This is your student dashboard. From here, you can track your applications,
        view saved universities, and access counselling tools.
      </p>
      
      {/* Placeholder content for student dashboard */}
      <div style={{ background: 'var(--bg-surface)', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Quick Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Saved Universities</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-heading)', marginTop: '8px' }}>12</div>
          </div>
          <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Applications</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-heading)', marginTop: '8px' }}>3</div>
          </div>
          <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Documents</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-heading)', marginTop: '8px' }}>2</div>
          </div>
        </div>
      </div>
    </div>
  );
}
