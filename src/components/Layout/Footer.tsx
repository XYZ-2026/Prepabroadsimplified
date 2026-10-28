'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from '@/styles/components.module.css';

import { COMPANY_CONFIG } from '@/config/company';

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/iq-test') || pathname?.startsWith('/university-finder') || pathname?.startsWith('/career-roadmap')) {
    return null;
  }

  return (
    <footer className={`footer ${styles.footer}`}>
      <div className={styles.footerGrid}>
        <div>
          <div className={styles.footerBrandLogoText} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/logo-transparent.png" alt="CLARVO" width={42} height={42} className="w-[38px] h-[38px] object-contain shrink-0" />
            <span style={{ fontWeight: 900, fontSize: '22px', color: 'var(--clarvo-deep-black, #080F1C)' }}>CLARVO</span>
          </div>
          <p className={styles.footerBrandDesc}>
            <strong>{COMPANY_CONFIG.tagline}</strong> A premium student development platform for Grades 7–12, offering psychometric assessments, personalised career guidance, SAT preparation, one-to-one tutoring, and research/profile building.
          </p>
          <div className="mt-3 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">{COMPANY_CONFIG.legalName}</p>
            <p className="text-[11px] text-slate-400">CIN: {COMPANY_CONFIG.cin}</p>
          </div>
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
            <a href={COMPANY_CONFIG.telLink} className={styles.footerSocialLink} aria-label="Contact Phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </a>
          </div>
        </div>
        <div className={styles.footerCol}>
          <h4>Platform & Tools</h4>
          <Link href="/book-a-demo">Book a Demo</Link>
          <Link href="/sample-reports">Sample Reports</Link>
          <Link href="/psychometric-test">Psychometric Assessment</Link>
          <Link href="/iq-test">Cognitive IQ Assessment</Link>
          <Link href="/university-finder">University Predictor</Link>
        </div>
        <div className={styles.footerCol}>
          <h4>Global Destinations</h4>
          <Link href="/university-finder?country=USA">USA Guide</Link>
          <Link href="/university-finder?country=UK">UK Guide</Link>
          <Link href="/university-finder?country=Germany">Germany Guide</Link>
          <Link href="/university-finder?country=Canada">Canada Guide</Link>
          <Link href="/university-finder?country=Australia">Australia Guide</Link>
        </div>
        <div className={styles.footerCol}>
          <h4>Company & Locations</h4>
          <Link href="/about-us">About Us</Link>
          <Link href="/book-a-demo">Schedule Consultation</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <div className="mt-3 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Head Office:</p>
            <p className="text-[10.5px] leading-tight text-slate-500">Chand Society, Juhu, Mumbai 400049</p>
            <p className="font-semibold text-slate-700 mt-2">Kolkata Branch:</p>
            <p className="text-[10.5px] leading-tight text-slate-500">Pottery Road, Kolkata 700015</p>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>{COMPANY_CONFIG.copyright} · CIN: {COMPANY_CONFIG.cin}</p>
        <p>
          <a href={COMPANY_CONFIG.mailtoLink} className="hover:underline">{COMPANY_CONFIG.email}</a>
          {' | '}
          <a href={COMPANY_CONFIG.telLink} className="hover:underline">{COMPANY_CONFIG.phoneFormatted}</a>
        </p>
      </div>
    </footer>
  );
}
