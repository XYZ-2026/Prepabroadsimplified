import { getUserProfile } from '@/lib/auth';
import Topbar from '@/components/Layout/Topbar';
import Sidebar from '@/components/Layout/Sidebar';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();

  return (
    <>
      <Topbar />
      <div className="sidebar-overlay" />
      <Sidebar 
        userRole={profile?.role || null} 
        userName={profile?.name || undefined}
        userEmail={profile?.email || undefined}
      />
      {children}
    </>
  );
}
