import Link from 'next/link';
import Footer from '@/components/Layout/Footer';
import NotificationPanel from '@/components/Notifications/NotificationPanel';
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

            {/* Card 2: Destination Guides */}
            <Link className={styles.toolCard} href="#">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <div>
                <div className={styles.cardTag}>Country Guides</div>
                <h3 className={styles.cardTitle}>→ Destination Guides</h3>
                <p className={styles.cardDesc}>
                  In-depth guides for USA, UK, Germany, Canada, Australia, and more.
                  Know before you go.
                </p>
                <span className={styles.cardCta}>Read Country Guides →</span>
              </div>
            </Link>

            {/* Card 3: SOP & Application Builder */}
            <Link className={styles.toolCard} href="#">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              </div>
              <div>
                <div className={styles.cardTag}>Application Suite</div>
                <h3 className={styles.cardTitle}>→ SOP &amp; Application Builder</h3>
                <p className={styles.cardDesc}>
                  AI-powered SOP generator, LOR tracker, and step-by-step
                  application checklist.
                </p>
                <span className={styles.cardCta}>Start Your Application →</span>
              </div>
            </Link>

            {/* Card 4: Scholarship Finder */}
            <Link className={styles.toolCard} href="#">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="15" y2="14" /></svg>
              </div>
              <div>
                <div className={styles.cardTag}>Funding</div>
                <h3 className={styles.cardTitle}>→ Scholarship Finder</h3>
                <p className={styles.cardDesc}>
                  Discover scholarships worth millions. Filter by country,
                  degree, and eligibility.
                </p>
                <span className={styles.cardCta}>Find Scholarships →</span>
              </div>
            </Link>

            {/* Card 5: Test Prep Hub */}
            <Link className={styles.toolCard} href="#">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31" /><path d="M14 9.3V1.99" /><path d="M8.5 2h7" /><path d="M14 9.3a6.5 6.5 0 1 1-4 0" /><path d="M5.52 16h12.96" /></svg>
              </div>
              <div>
                <div className={styles.cardTag}>Test Prep</div>
                <h3 className={styles.cardTitle}>→ IELTS / TOEFL / GRE Hub</h3>
                <p className={styles.cardDesc}>
                  Practice tests, score predictors, and prep resources for all
                  major standardized tests.
                </p>
                <span className={styles.cardCta}>Start Preparing →</span>
              </div>
            </Link>

            {/* Card 6: Application Calendar */}
            <Link className={styles.toolCard} href="#">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              </div>
              <div>
                <div className={styles.cardTag}>Deadlines</div>
                <h3 className={styles.cardTitle}>→ Application Calendar</h3>
                <p className={styles.cardDesc}>
                  Stay on track with all important university deadlines,
                  intake dates, and exam schedules.
                </p>
                <span className={styles.cardCta}>View Calendar →</span>
              </div>
            </Link>

            {/* Card 7: Visa Guidance Hub */}
            <Link className={styles.toolCard} href="#">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /></svg>
              </div>
              <div>
                <div className={styles.cardTag}>Visa Support</div>
                <h3 className={styles.cardTitle}>→ Visa Guidance Hub</h3>
                <p className={styles.cardDesc}>
                  Step-by-step visa guides, document checklists, and appointment
                  trackers by country.
                </p>
                <span className={styles.cardCta}>Get Visa Help →</span>
              </div>
            </Link>

            {/* Card 8: Chat With Alumni */}
            <Link className={styles.toolCard} href="#">
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </div>
              <div>
                <div className={styles.cardTag}>Community</div>
                <h3 className={styles.cardTitle}>→ Chat With Alumni</h3>
                <p className={styles.cardDesc}>
                  Connect with real students studying at your target universities.
                  Get honest advice.
                </p>
                <span className={styles.cardCta}>Connect Now →</span>
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
      </>

      <Footer />
    </>
  );
}
