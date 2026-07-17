'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Target,
  BookOpen,
  Briefcase,
  Trophy,
  Map,
  Globe,
  FileText,
  ChevronLeft,
  ArrowRight,
  Crown,
  Shield,
  BarChart3,
  Lock,
} from 'lucide-react';
import './sample-report.css';

const REPORT_SECTIONS = [
  {
    icon: Brain,
    color: '#690B1B',
    title: 'Aptitude Score Breakdown',
    desc: 'Verbal, Numerical, Reasoning & Spatial scores with percentile rankings and cognitive strength analysis.',
    tag: 'Cognitive',
  },
  {
    icon: Sparkles,
    color: '#7E3AF2',
    title: 'Personality Profile (Big Five)',
    desc: 'Scores across Openness, Conscientiousness, Extraversion, Agreeableness & Emotional Stability with career implications.',
    tag: 'Personality',
  },
  {
    icon: Target,
    color: '#057A55',
    title: 'RIASEC Interest Mapping',
    desc: 'Your Holland Code revealing your top career interest types with a visual radar chart.',
    tag: 'Interests',
  },
  {
    icon: BookOpen,
    color: '#C9A55D',
    title: 'Learning Style (VARK)',
    desc: 'Your dominant learning modality — Visual, Auditory, Reading/Writing, or Kinesthetic — with personalised study tips.',
    tag: 'Learning',
  },
  {
    icon: Briefcase,
    color: '#0694A2',
    title: 'Career Values Assessment',
    desc: 'Your top work values (Creativity, Impact, Security, etc.) and how they align with career paths.',
    tag: 'Values',
  },
  {
    icon: Trophy,
    color: '#D97706',
    title: 'Top 5 Career Recommendations',
    desc: 'AI-matched careers ranked by fitment score, with descriptions, required skills, and education pathways.',
    tag: 'AI-Powered',
  },
  {
    icon: Map,
    color: '#690B1B',
    title: 'Personalised Career Roadmap',
    desc: 'Step-by-step academic and career action plan from current grade to career entry.',
    tag: 'Roadmap',
  },
  {
    icon: Globe,
    color: '#4F46E5',
    title: 'Study Abroad Guidance',
    desc: 'Top countries, scholarships, and degree programs tailored to your recommended careers.',
    tag: 'Global',
  },
  {
    icon: FileText,
    color: '#690B1B',
    title: 'Downloadable PDF Dossier',
    desc: 'A comprehensive, beautifully formatted PDF report you can share with parents and counsellors.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

function SampleReportContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'senior';

  const gradeLabel =
    type === 'junior'
      ? '7th – 9th Grade'
      : type === 'grade10'
      ? '10th Grade'
      : '11th – 12th Grade';

  const backHref = `/psychometric-test?type=${type}`;

  return (
    <div className="sr-page">
      {/* Background decoration */}
      <div className="sr-bg-grad-1" />
      <div className="sr-bg-grad-2" />
      <div className="sr-bg-dots" />

      {/* Back link */}
      <Link href={backHref} className="sr-back-link">
        <ChevronLeft className="sr-back-icon" />
        Back to Assessment
      </Link>

      {/* Hero */}
      <motion.div
        className="sr-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="sr-hero-title">
          What's Included in Your <span className="sr-hero-accent">Report</span>
        </h1>

        <p className="sr-hero-subtitle">
          After completing the {gradeLabel} Psychometric Assessment, your personalised career
          report will include the following comprehensive sections:
        </p>

        <div className="sr-hero-stats">
          <div className="sr-hero-stat">
            <BarChart3 className="sr-hero-stat-icon" />
            <div>
              <div className="sr-hero-stat-val">9</div>
              <div className="sr-hero-stat-label">Report Sections</div>
            </div>
          </div>
          <div className="sr-stat-divider" />
          <div className="sr-hero-stat">
            <Shield className="sr-hero-stat-icon" />
            <div>
              <div className="sr-hero-stat-val">5</div>
              <div className="sr-hero-stat-label">Dimensions Analysed</div>
            </div>
          </div>
          <div className="sr-stat-divider" />
          <div className="sr-hero-stat">
            <Lock className="sr-hero-stat-icon" />
            <div>
              <div className="sr-hero-stat-val">AI</div>
              <div className="sr-hero-stat-label">Powered Analysis</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        className="sr-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {REPORT_SECTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div className="sr-card" key={idx} variants={cardVariants}>
              <div className="sr-card-header">
                <div className="sr-card-icon-wrap" style={{ '--accent': item.color } as React.CSSProperties}>
                  <Icon className="sr-card-icon" />
                </div>
                <span className="sr-card-tag" style={{ '--accent': item.color } as React.CSSProperties}>
                  {item.tag}
                </span>
              </div>
              <h3 className="sr-card-title">{item.title}</h3>
              <p className="sr-card-desc">{item.desc}</p>
              <div className="sr-card-num">{String(idx + 1).padStart(2, '0')}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA Footer */}
      <motion.div
        className="sr-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="sr-cta-inner">
          <div className="sr-cta-text">
            <h2 className="sr-cta-title">Ready to discover your career path?</h2>
            <p className="sr-cta-sub">
              Take the {gradeLabel} Psychometric Assessment and unlock your personalised report.
            </p>
          </div>
          <Link href={backHref} className="sr-cta-btn">
            Start Your Assessment
            <ArrowRight className="sr-cta-btn-icon" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SampleReportPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F4F2' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #E5E7EB', borderTopColor: '#690B1B', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      }
    >
      <SampleReportContent />
    </Suspense>
  );
}
