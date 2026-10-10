import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AuthForm from '@/components/Auth/AuthForm';
import AuthInfographics from '@/components/Auth/AuthInfographics';
import styles from '@/styles/auth.module.css';

export const metadata: Metadata = {
  title: 'Sign Up — Create Student Account | CLARVO',
  description:
    'Join CLARVO to access personalized student guidance, psychometric assessments, university matching, and profile building.',
  alternates: {
    canonical: '/signup',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignUpPage() {
  return (
    <>
      <header className={styles.authTopbar} style={{ justifyContent: 'space-between' }}>
        <Link href="/" className={styles.authTopbarBrand}>
          <div className={styles.authTopbarText}>
            <span className={styles.authTopbarTitle} style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#080F1C' }}>
              CLARVO
            </span>
          </div>
        </Link>

        <Link
          href="/"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#2563EB',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: '#F8FAFC',
            border: '1px solid #E4E7EC',
            transition: 'all 0.15s ease',
          }}
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </header>

      <main className={styles.authMain}>
        <div className={styles.authLayoutGrid}>
          {/* Left Side: Auth Card (Sign Up view directly exposed) */}
          <section className={styles.authSection}>
            <Suspense fallback={
              <div style={{ padding: '40px', textAlign: 'center', color: '#667085' }}>
                Loading CLARVO Registration Portal...
              </div>
            }>
              <AuthForm defaultTab="register" />
            </Suspense>
          </section>

          {/* Right Side: CLARVO Infographics & Value Proposition */}
          <section>
            <AuthInfographics />
          </section>
        </div>
      </main>
    </>
  );
}
