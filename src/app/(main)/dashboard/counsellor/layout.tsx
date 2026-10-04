import { redirect } from 'next/navigation';
import { requireCounsellor } from '@/lib/auth';

export default async function CounsellorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireCounsellor();
  } catch (error) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
