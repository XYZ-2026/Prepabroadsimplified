'use client';

import React, { createContext, useContext, useMemo } from 'react';

export type SessionRole = 'admin' | 'counsellor' | 'student';

export interface SessionUser {
  role: SessionRole;
  name: string;
  email: string;
}

const SessionContext = createContext<SessionUser | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  const role = user?.role;
  const name = user?.name;
  const email = user?.email;
  const value = useMemo(
    () => (role ? { role, name: name || '', email: email || '' } : null),
    [role, name, email]
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Returns the signed-in user (resolved on the server) or null for guests. */
export function useSessionUser(): SessionUser | null {
  return useContext(SessionContext);
}

export function dashboardHomeFor(role: SessionRole): string {
  if (role === 'admin') return '/dashboard/admin/users';
  if (role === 'counsellor') return '/dashboard/counsellor';
  return '/dashboard/student/profile';
}
