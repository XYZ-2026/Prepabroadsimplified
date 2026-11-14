import React from 'react';
import type { Metadata } from 'next';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import MotionProvider from '@/components/PsychometricAssessment/motion/MotionProvider';
import HeroSection from '@/components/PsychometricAssessment/HeroSection';
import WhyGuessworkSection from '@/components/PsychometricAssessment/WhyGuessworkSection';
import PhasesSection from '@/components/PsychometricAssessment/PhasesSection';
import QuestionDemoSection from '@/components/PsychometricAssessment/QuestionDemoSection';
import ReportExplorerSection from '@/components/PsychometricAssessment/ReportExplorerSection';
import AssessmentJourneySection from '@/components/PsychometricAssessment/AssessmentJourneySection';
import SampleReportGallery from '@/components/PsychometricAssessment/SampleReportGallery';
import ParentReassurance from '@/components/PsychometricAssessment/ParentReassurance';
import PsychometricFAQ from '@/components/PsychometricAssessment/PsychometricFAQ';
import FinalCTA from '@/components/PsychometricAssessment/FinalCTA';
import StickyMobileCTA from '@/components/PsychometricAssessment/StickyMobileCTA';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import '@/components/PsychometricAssessment/psychometric.css';

export const metadata: Metadata = {
  title: 'Psychometric Test for Students — Career & Stream Assessment',
  description:
    'Psychometric test for Class 7–12 students: aptitude, interests, personality and learning style mapped to stream selection after Class 10, careers and university choices.',
  keywords: [
    'psychometric test for students',
    'psychometric assessment',
    'career assessment test',
    'aptitude test for class 10',
    'stream selection after 10th',
    'career counselling test',
    'profile assessment for study abroad',
    'RIASEC test',
  ],
  alternates: {
    canonical: '/psychometric-assessment',
  },
  openGraph: {
    title: 'CLARVO Psychometric Assessment — Grades 7–12 Diagnostic & Stream Selection',
    description:
      'A 30-module evaluation across cognitive agility, personality architecture, learning modalities, and stream alignment. Clear direction for families, students, and counsellors.',
    url: 'https://clarvo.in/psychometric-assessment',
    siteName: 'CLARVO',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalApplication',
      '@id': 'https://clarvo.in/psychometric-assessment#service',
      name: 'CLARVO Psychometric Assessment',
      applicationCategory: 'EducationalAssessment',
      operatingSystem: 'All',
      description:
        'A comprehensive 30-module evaluation across cognitive processing, personality architecture, learning modalities, and stream alignment for students in Grades 7–12.',
      provider: {
        '@type': 'Organization',
        name: 'CLARVO',
        url: 'https://clarvo.in',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://clarvo.in/psychometric-assessment#faq',
      mainEntity: PSYCHOMETRIC_CONTENT.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

// Without JS, Motion's initial (hidden) styles would stick; force final states instead.
const NOSCRIPT_CSS =
  '[data-reveal]{opacity:1!important;transform:none!important}[data-reveal-path]{stroke-dasharray:none!important}';

/**
 * /psychometric-assessment — spec: src/app/(main)/Design_psychometric_v2.md
 * Server component; only animated sections are client components.
 */
export default function PsychometricAssessmentPage() {
  return (
    <SmoothScrollProvider>
      <MotionProvider>
        <div
          className="bg-paper text-ink font-dmsans min-h-screen flex flex-col selection:bg-clarvo-blue selection:text-white"
          style={{ overflowX: 'clip' }}
        >
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <noscript>
            <style>{NOSCRIPT_CSS}</style>
          </noscript>

          <LandingNavbar />

          <main className="psy-main flex-1 w-full">
            <HeroSection />
            <WhyGuessworkSection />
            <PhasesSection />
            <QuestionDemoSection />
            <ReportExplorerSection />
            <AssessmentJourneySection />
            <SampleReportGallery />
            <ParentReassurance />
            <PsychometricFAQ />
            <FinalCTA />
          </main>

          <LandingFooter />
          <StickyMobileCTA />
        </div>
      </MotionProvider>
    </SmoothScrollProvider>
  );
}
