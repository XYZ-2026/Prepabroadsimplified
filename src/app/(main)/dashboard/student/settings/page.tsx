import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { resolvePreferences } from '@/lib/user-preferences';
import { COMPANY_CONFIG } from '@/config/company';
import SettingsClient from '@/components/Dashboard/Student/SettingsClient';
import dash from '@/styles/student-dashboard.module.css';
import styles from '@/styles/student-workspace.module.css';

export const metadata: Metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const claims = await verifySessionCookie();
  if (!claims) redirect('/auth');

  let name = claims.name || '';
  let email = claims.email || '';
  let hasPassword = false;
  let preferences = resolvePreferences(undefined);
  let deletionRequestedAt: string | undefined;

  try {
    const snap = await adminDb.collection('users').doc(claims.uid).get();
    const d = snap.data();
    if (d) {
      name = d.name || name;
      email = d.email || email;
      hasPassword = !!d.passwordHash;
      preferences = resolvePreferences(d.preferences);
      deletionRequestedAt = typeof d.deletionRequestedAt === 'string' ? d.deletionRequestedAt : undefined;
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }

  return (
    <div className={dash.dashboardContent}>
      <div className={styles.wrap}>
        <div className={dash.pageHeader}>
          <h1 className={dash.pageTitle}>Settings</h1>
          <p className={dash.pageSubtitle}>Manage your account, notifications, privacy and data.</p>
        </div>
        <SettingsClient
          name={name}
          email={email}
          signInMethod={hasPassword ? 'password' : 'google'}
          initialPreferences={preferences}
          deletionRequestedAt={deletionRequestedAt}
          supportEmail={COMPANY_CONFIG.email}
        />
      </div>
    </div>
  );
}
