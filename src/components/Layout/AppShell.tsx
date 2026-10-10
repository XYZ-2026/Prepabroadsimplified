'use client';

import React, { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Topbar from '@/components/Layout/Topbar';
import Sidebar from '@/components/Layout/Sidebar';
import ReportHeader from '@/components/Layout/ReportHeader';
import ResearchPopup from '@/components/ResearchPopup';

interface AppShellProps {
  children: React.ReactNode;
  userRole: 'admin' | 'counsellor' | 'student' | null;
  userName?: string;
  userEmail?: string;
}

export default function AppShell({ children, userRole, userName, userEmail }: AppShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Detect if current route is an assessment result view
  const isReportView = 
    pathname.startsWith('/iq-test/result') || 
    pathname.startsWith('/psychometric-test/result') ||
    pathname.startsWith('/psychometric-test/sample-report') ||
    pathname.startsWith('/sample-report') ||
    (pathname === '/psychometric-test' && searchParams.has('resultId'));

  if (isReportView || pathname === '/') {
    // Report views and dedicated Home landing page render their own layout
    return <>{children}</>;
  }

  return (
    <>
      <Topbar />
      <Suspense fallback={<div id="sidebar" className="sidebar" style={{ transform: 'translateX(-280px)' }}></div>}>
        <Sidebar 
          userRole={userRole} 
          userName={userName}
          userEmail={userEmail}
        />
      </Suspense>
      <main className="main-content">
        {children}
      </main>
      <ResearchPopup />
    </>
  );
}
