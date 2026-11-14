import React from 'react';
import { getUserProfile } from '@/lib/auth';
import AppShell from '@/components/Layout/AppShell';
import { SessionProvider } from '@/components/providers/SessionProvider';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();

  const userRole = (profile?.role as 'admin' | 'counsellor' | 'student') || null;
  const userName = profile?.name || undefined;
  const userEmail = profile?.email || undefined;

  const sessionUser = userRole
    ? { role: userRole, name: userName || '', email: userEmail || '' }
    : null;

  return (
    <SessionProvider user={sessionUser}>
      {/*
        No Suspense wrapper here: a fallback that renders {children} made every page
        appear twice in the HTML (duplicate H1s / JSON-LD, double payload). This layout
        reads cookies via getUserProfile(), so the route is dynamically rendered and
        AppShell's useSearchParams() resolves on the server without a boundary.
      */}
      <AppShell
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
      >
        {children}
      </AppShell>
    </SessionProvider>
  );
}
