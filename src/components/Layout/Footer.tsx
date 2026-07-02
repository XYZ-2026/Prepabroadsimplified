import Link from 'next/link';
import styles from '@/styles/components.module.css';

export default function Footer() {
  return (
    <footer className={`footer ${styles.footer}`}>
      <div className={styles.footerGrid}>
        <div>
          <div className={styles.footerBrandLogoText}>
            <span className="brand-red">Abroad</span> Simplified
          </div>
          <p className={styles.footerBrandDesc}>
            Think Beyond Your Boundaries. Your complete guide to studying abroad.
          </p>
          <div className={styles.footerSocials}>
            <a href="#" className={styles.footerSocialLink} aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            <a href="#" className={styles.footerSocialLink} aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
            </a>
            <a href="#" className={styles.footerSocialLink} aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <a href="#" className={styles.footerSocialLink} aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </a>
          </div>
        </div>
        <div className={styles.footerCol}>
          <h4>Tools</h4>
          <Link href="/university-finder">University Finder</Link>
          <Link href="#">Scholarship Finder</Link>
          <Link href="#">SOP Builder</Link>
          <Link href="#">Visa Guidance</Link>
          <Link href="#">Application Calendar</Link>
        </div>
        <div className={styles.footerCol}>
          <h4>Countries</h4>
          <Link href="#">USA Guide</Link>
          <Link href="#">UK Guide</Link>
          <Link href="#">Germany Guide</Link>
          <Link href="#">Canada Guide</Link>
          <Link href="#">Australia Guide</Link>
        </div>
        <div className={styles.footerCol}>
          <h4>Company</h4>
          <Link href="#">About Us</Link>
          <Link href="#">Blog</Link>
          <Link href="#">Contact</Link>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© 2026 Abroad Simplified. All rights reserved.</p>
        <p>Mumbai, Maharashtra, India | support@abroadsimplified.com</p>
      </div>
    </footer>
  );
}
