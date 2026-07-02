import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';
import Topbar from '@/components/Layout/Topbar';
import Sidebar from '@/components/Layout/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const claims = await verifySessionCookie();

  if (!claims) {
    redirect('/auth');
  }

  // Very basic role resolution: 
  // If their email is admin@admin.com or they have the admin custom claim, treat as admin.
  // In a real app, the custom claim logic in /lib/auth.ts would be strictly used.
  let role: 'admin' | 'student' = 'student';
  if (claims.email === 'admin@admin.com' || claims.admin === true || claims.role === 'admin') {
    role = 'admin';
  }

  // Get user details
  const email = claims.email || '';
  const name = (claims.name as string) || (email.split('@')[0]);

  return (
    <>
      <Topbar />
      <div className="sidebar-overlay" />
      <Sidebar userRole={role} userName={name} userEmail={email} />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}
