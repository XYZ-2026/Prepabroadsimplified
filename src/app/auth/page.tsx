import Link from 'next/link';
import AuthForm from '@/components/Auth/AuthForm';
import styles from '@/styles/auth.module.css';

export default function AuthPage() {
  return (
    <>
      <header className={styles.authTopbar}>
        <Link href="/" className={styles.authTopbarBrand}>
          <div className={styles.authTopbarLogoIcon}>A</div>
          <div className={styles.authTopbarText}>
            <span className={styles.authTopbarTitle}>Abroad Simplified</span>
            <span className={styles.authTopbarSubtitle}>LOGIN / REGISTER</span>
          </div>
        </Link>
      </header>

      <main className={styles.authMain}>
        <section className={styles.authSection}>
          <AuthForm />
        </section>
      </main>
    </>
  );
}
