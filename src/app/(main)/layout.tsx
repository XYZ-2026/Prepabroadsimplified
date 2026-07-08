import React, { Suspense } from 'react';
import { getUserProfile } from '@/lib/auth';
import Topbar from '@/components/Layout/Topbar';
import Sidebar from '@/components/Layout/Sidebar';
import ResearchPopup from '@/components/ResearchPopup';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();

  return (
    <>
      <Topbar />
      <Suspense fallback={<div id="sidebar" className="sidebar" style={{transform: 'translateX(-280px)'}}></div>}>
        <Sidebar 
          userRole={(profile?.role as 'admin' | 'student') || null} 
          userName={profile?.name || undefined}
          userEmail={profile?.email || undefined}
        />
      </Suspense>
      <main className="main-content">
        {children}
      </main>
      <ResearchPopup />
    </>
  );
}
