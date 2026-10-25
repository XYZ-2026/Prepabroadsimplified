import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import AuthForm from '@/components/Auth/AuthForm';
import AuthInfographics from '@/components/Auth/AuthInfographics';
import styles from '@/styles/auth.module.css';

export const metadata: Metadata = {
  title: 'Sign Up — Create Student Account | CLARVO',
  description:
    'Join CLARVO for Indian student career guidance, Class 10 stream selection, 147+ career roadmaps, cognitive psychometrics, and college admissions.',
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
        <Link href="/" className={styles.authTopbarBrand} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <Image src="/logo-transparent.png" alt="CLARVO" width={48} height={48} className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] object-contain shrink-0" priority />
          <div className={styles.authTopbarText}>
            <span className={styles.authTopbarTitle} style={{ fontWeight: 900, fontSize: '1.45rem', letterSpacing: '-0.02em', color: '#080F1C' }}>
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
