import React, { Suspense } from 'react';
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
      <Suspense fallback={<div className="main-content">{children}</div>}>
        <AppShell
          userRole={userRole}
          userName={userName}
          userEmail={userEmail}
        >
          {children}
        </AppShell>
      </Suspense>
    </SessionProvider>
  );
}
