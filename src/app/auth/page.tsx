import type { Metadata } from 'next';
import Link from 'next/link';
import AuthForm from '@/components/Auth/AuthForm';
import AuthInfographics from '@/components/Auth/AuthInfographics';
import styles from '@/styles/auth.module.css';

export const metadata: Metadata = {
  title: 'Student & Counsellor Login / Sign Up',
  description:
    'Sign in or register for Abroad Simplified to access personalized university matching, SOP guidance, and psychometric assessments.',
  alternates: {
    canonical: '/auth',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AuthPage() {
  return (
    <>
      <header className={styles.authTopbar}>
        <Link href="/" className={styles.authTopbarBrand}>
          <div className={styles.authTopbarLogoIcon}>
            <img 
              src="/logo-square-cropped.avif" 
              alt="Abroad Simplified" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} 
            />
          </div>
          <div className={styles.authTopbarText}>
            <span className={styles.authTopbarTitle}>Abroad Simplified</span>
            <span className={styles.authTopbarSubtitle}>LOGIN / REGISTER</span>
          </div>
        </Link>
      </header>

      <main className={styles.authMain}>
        <div className={styles.authLayoutGrid}>
          {/* Left Side: Auth Card (Sign In / Register / Forgot Password) */}
          <section className={styles.authSection}>
            <AuthForm />
          </section>

          {/* Right Side: Abroad Simplified Infographics & Value Proposition */}
          <section>
            <AuthInfographics />
          </section>
        </div>
      </main>
    </>
  );
}
