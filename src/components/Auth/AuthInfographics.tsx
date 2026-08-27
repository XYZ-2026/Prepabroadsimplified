'use client';

import styles from '@/styles/auth.module.css';

export default function AuthInfographics() {
  const stats = [
    { value: '10,000+', label: 'Students Guided', icon: '🎓', color: '#690b1b' },
    { value: '500+', label: 'Universities Listed', icon: '🏛️', color: '#1E1E2F' },
    { value: '40+', label: 'Countries Covered', icon: '🌍', color: '#0088CB' },
  ];

  const features = [
    {
      title: 'Smart Predictor',
      description: 'AI profile matching across 500+ universities.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      badge: 'AI Powered',
    },
    {
      title: 'Psychometric & IQ',
      description: 'Cognitive tests matching personality to career tracks.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
      badge: 'Assessment',
    },
    {
      title: '1-on-1 Counsellor',
      description: 'Dedicated advisor support for SOP & visa filing.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      badge: 'Personalized',
    },
  ];

  const destinations = [
    { country: 'USA', flag: '🇺🇸' },
    { country: 'UK', flag: '🇬🇧' },
    { country: 'Canada', flag: '🇨🇦' },
    { country: 'Australia', flag: '🇦🇺' },
    { country: 'Germany', flag: '🇩🇪' },
    { country: 'Ireland', flag: '🇮🇪' },
  ];

  return (
    <div className={styles.bentoContainer}>
      <div className={styles.bentoGrid}>
        
        {/* Top Left: Hero Card (Span 7) */}
        <div className={`${styles.bentoCard} ${styles.bentoHeroCard}`}>
          <span className={styles.infoBadge}>
            <span className={styles.infoBadgeDot}></span>
            YOUR ULTIMATE STUDY ABROAD HUB
          </span>
          <h2 className={styles.infoTitle}>
            Empowering Your Journey to <span className={styles.infoTitleHighlight}>Top Global Universities</span>
          </h2>
          <p className={styles.infoSubtitle}>
            AI-driven university matching, psychometric evaluations, SOP builder, and expert 1-on-1 counselling.
          </p>
        </div>

        {/* Top Right: Square 1:1 Bento Image Frame (Span 5) */}
        <div className={`${styles.bentoCard} ${styles.bentoSquareImageCard}`}>
          <img 
            src="/hero_vector_2d.svg" 
            alt="Abroad Simplified 2D Vector Infographic" 
            className={styles.bentoSquareImg}
          />
        </div>

        {/* Stats Bento Row (3 Cards, Span 4 each) */}
        {stats.map((stat, idx) => (
          <div key={idx} className={`${styles.bentoCard} ${styles.bentoStatCard}`}>
            <div className={styles.infoStatTopRow}>
              <span className={styles.infoStatIcon}>{stat.icon}</span>
              <span className={styles.infoStatValue} style={{ color: stat.color }}>
                {stat.value}
              </span>
            </div>
            <div className={styles.infoStatLabel}>{stat.label}</div>
          </div>
        ))}

        {/* Feature Bento Row (3 Cards, Span 4 each) */}
        {features.map((feat, idx) => (
          <div key={idx} className={`${styles.bentoCard} ${styles.bentoFeatureCard}`}>
            <div className={styles.infoFeatureIconBox}>{feat.icon}</div>
            <div className={styles.infoFeatureContent}>
              <div className={styles.infoFeatureHeader}>
                <h4 className={styles.infoFeatureTitle}>{feat.title}</h4>
                <span className={styles.infoFeatureBadge}>{feat.badge}</span>
              </div>
              <p className={styles.infoFeatureDesc}>{feat.description}</p>
            </div>
          </div>
        ))}

        {/* Destinations Bento Strip (Span 12) */}
        <div className={`${styles.bentoCard} ${styles.bentoDestinationsCard}`}>
          <span className={styles.infoDestinationsTitle}>TOP DESTINATIONS:</span>
          <div className={styles.infoDestinationsGrid}>
            {destinations.map((d, i) => (
              <div key={i} className={styles.infoDestinationChip}>
                <span className={styles.infoFlag}>{d.flag}</span>
                <span>{d.country}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
