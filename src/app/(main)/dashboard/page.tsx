import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';

export default async function DashboardIndexPage() {
  const claims = await verifySessionCookie();

  if (!claims) {
    redirect('/auth');
  }

  if (claims.role === 'admin') {
    redirect('/dashboard/admin/users');
  } else if (claims.role === 'counsellor') {
    redirect('/dashboard/counsellor');
  } else {
    redirect('/dashboard/student/profile');
  }
}
