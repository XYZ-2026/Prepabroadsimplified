import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/lib/auth';

export default async function DashboardIndexPage() {
  const claims = await verifySessionCookie();

  if (!claims) {
    redirect('/auth');
  }

  if (claims.email === 'admin@as.com' || claims.admin === true || claims.role === 'admin') {
    redirect('/dashboard/admin/users');
  } else if (claims.email === 'counsellor@as.com' || claims.role === 'counsellor' || claims.email?.includes('counsellor')) {
    redirect('/dashboard/counsellor');
  } else {
    redirect('/dashboard/student/profile');
  }
}
