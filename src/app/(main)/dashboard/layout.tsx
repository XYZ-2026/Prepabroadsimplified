import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const claims = await verifySessionCookie();

  if (!claims) {
    redirect('/auth');
  }

  // Role resolution: admin > counsellor > student
  let role: 'admin' | 'counsellor' | 'student' = 'student';
  if (claims.email === 'admin@as.com' || claims.admin === true || claims.role === 'admin') {
    role = 'admin';
  } else if (claims.email === 'counsellor@as.com' || claims.role === 'counsellor') {
    role = 'counsellor';
  }

  // Get user details
  const email = claims.email || '';
  const name = (claims.name as string) || (email.split('@')[0]);

  return (
    <>
      {children}
    </>
  );
}
