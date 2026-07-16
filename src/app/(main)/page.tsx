import Link from 'next/link';
import NotificationPanel from '@/components/Notifications/NotificationPanel';
import PremiumToolsCards from '@/components/PremiumToolsCards';
import styles from '@/styles/components.module.css';
import sections from '@/styles/sections.module.css';

export default async function HomePage() {
  return (
    <>
      <>
        {/* ── HERO SECTION ── */}
        <section className={sections.hero}>
          <div className={sections.heroInner}>
            <span className={styles.badgePill}>BEST STUDY ABROAD PLATFORM</span>
            <h1 className={sections.heroTitle}>
              Your Ultimate <span className="accent">Study Abroad</span> Hub
            </h1>
            <p className={sections.subtitle}>
              Explore top universities across USA, UK, Germany, Canada &amp; Australia.
              Get personalized guidance, scholarship matching, SOP support, and
              AI-powered tools — all in one place.
            </p>
            <div className={sections.heroCtaRow}>
              <Link href="#tools" className={`${styles.btn} ${styles.btnPrimary}`}>
                Explore All Tools →
              </Link>
              <Link href="#tools" className={`${styles.btn} ${styles.btnOutline}`}>
                Study Abroad Tools
              </Link>
            </div>
            <div className={sections.heroStats}>
              <div className={sections.stat}>
                <strong className={sections.statValue}>10,000+</strong>
                <span className={sections.statLabel}>Students Guided</span>
              </div>
              <div className={sections.stat}>
                <strong className={sections.statValue}>500+</strong>
                <span className={sections.statLabel}>Universities Listed</span>
              </div>
              <div className={sections.stat}>
                <strong className={sections.statValue}>40+</strong>
                <span className={sections.statLabel}>Countries Covered</span>
              </div>
              <div className={sections.stat}>
                <strong className={sections.statValue}>95%</strong>
                <span className={sections.statLabel}>Visa Success Rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── TOOL CARDS SECTION ── */}
        <section id="tools" className={sections.tools}>
          <span className={`${styles.sectionBadge} ${sections.toolsSectionBadge}`}>
            EXPLORE OUR TOOLS
          </span>
          <h2 className={sections.toolsTitle}>Everything You Need, Under One Roof</h2>
          <p className={sections.sectionSubtitle}>
            Premium tools to simplify your study abroad journey
          </p>

          <div className={sections.toolsGrid}>
            {/* Card 1: University Finder */}
            <Link className={styles.toolCard} href="/university-finder">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
              </div>
              <div>
                <div className={styles.cardTag}>University Search</div>
                <h3 className={styles.cardTitle}>→ University Finder</h3>
                <p className={styles.cardDesc}>
                  Search and compare 500+ universities across 40 countries.
                  Filter by course, fees, and scholarships.
                </p>
                <span className={styles.cardCta}>Explore Universities →</span>
              </div>
            </Link>

            {/* Card 2: IQ Test */}
            <Link className={styles.toolCard} href="/iq-test">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
              </div>
              <div>
                <div className={styles.cardTag}>Assessment</div>
                <h3 className={styles.cardTitle}>→ IQ Test</h3>
                <p className={styles.cardDesc}>
                  Test your cognitive abilities and see how you stack up with our comprehensive IQ assessment.
                </p>
                <span className={styles.cardCta}>Take the Test →</span>
              </div>
            </Link>

            {/* Card 3: Psychometric Tests */}
            <Link className={styles.toolCard} href="/psychometric-test">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              </div>
              <div>
                <div className={styles.cardTag}>Career Guidance</div>
                <h3 className={styles.cardTitle}>→ Psychometric Tests</h3>
                <p className={styles.cardDesc}>
                  Discover your ideal career path and personality traits with our advanced psychometric evaluations.
                </p>
                <span className={styles.cardCta}>Start Assessment →</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ── NOTIFICATIONS / UPDATES SECTION ── */}
        <section className={sections.notifications}>
          <div className={sections.notificationsContainer}>
            <div className={sections.sectionHeader}>
              <h2 className={sections.sectionHeaderTitle}>Latest Updates &amp; Deadlines</h2>
              <span className={styles.liveBadge}>● LIVE</span>
            </div>
            <NotificationPanel />
          </div>
        </section>

        {/* ── PREMIUM TOOLS CTA SECTION ── */}
        <section className="my-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 mt-4 md:mt-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              Accelerate Your <span className="text-[#65151E]">Study Abroad</span> Journey
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Explore our premium platforms designed to help ambitious students build their legacy and reach top global universities.
            </p>
          </div>
          <PremiumToolsCards />
        </section>
      </>
    </>
  );
}
