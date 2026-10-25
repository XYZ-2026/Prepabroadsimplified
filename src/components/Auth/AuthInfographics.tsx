'use client';

import styles from '@/styles/auth.module.css';

export default function AuthInfographics() {
  const stats = [
    { value: '25,000+', label: 'Students Guided', icon: '🎓', color: '#2563EB' },
    { value: '147+', label: 'Career Roadmaps', icon: '🗺️', color: '#080F1C' },
    { value: '800+', label: 'Indian & Global Unis', icon: '🏛️', color: '#2563EB' },
  ];

  const features = [
    {
      title: 'Stream & Career Path',
      description: 'Class 10 stream guidance (PCM/PCB/Commerce/Arts) & 147+ career roadmaps.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      ),
      badge: 'Class 8–12 & College',
    },
    {
      title: 'Psychometric & IQ',
      description: 'Scientific cognitive & personality testing to reveal natural aptitudes.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
      badge: 'Scientific',
    },
    {
      title: '1-on-1 Mentorship',
      description: 'Expert advice for JEE, NEET, CUET, board strategy & college shortlists.',
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

  const pathways = [
    { name: 'IITs & NITs (JEE)', icon: '⚙️' },
    { name: 'Central Unis (CUET)', icon: '🏛️' },
    { name: 'Medical (NEET)', icon: '🩺' },
    { name: 'Commerce & CA', icon: '📊' },
    { name: 'Law & Design', icon: '⚖️' },
    { name: 'Global Top 100', icon: '🌍' },
  ];

  return (
    <div className={styles.bentoContainer}>
      <div className={styles.bentoGrid}>
        
        {/* Top Left: Hero Card (Span 7) */}
        <div className={`${styles.bentoCard} ${styles.bentoHeroCard}`}>
          <span className={styles.infoBadge}>
            <span className={styles.infoBadgeDot}></span>
            INDIA&apos;S TRUSTED STUDENT GUIDANCE HUB
          </span>
          <h2 className={styles.infoTitle}>
            Empowering Indian Students Towards <span className={styles.infoTitleHighlight}>Dream Careers &amp; Top Colleges</span>
          </h2>
          <p className={styles.infoSubtitle}>
            Scientific stream selection for Class 10–12, 147+ career roadmaps, cognitive psychometrics, and premier Indian &amp; global college admissions.
          </p>
        </div>

        {/* Top Right: Square 1:1 Bento Image Frame (Span 5) */}
        <div className={`${styles.bentoCard} ${styles.bentoSquareImageCard}`}>
          <img 
            src="/clarvo_india_vector.svg" 
            alt="CLARVO Indian Student Career &amp; Education Guidance" 
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

        {/* Pathways Bento Strip (Span 12) */}
        <div className={`${styles.bentoCard} ${styles.bentoDestinationsCard}`}>
          <span className={styles.infoDestinationsTitle}>TOP PATHWAYS &amp; TARGETS:</span>
          <div className={styles.infoDestinationsGrid}>
            {pathways.map((p, i) => (
              <div key={i} className={styles.infoDestinationChip}>
                <span className={styles.infoFlag}>{p.icon}</span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
