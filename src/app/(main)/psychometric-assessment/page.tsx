import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import HeroSection from '@/components/PsychometricAssessment/HeroSection';
import WhatItIsSection from '@/components/PsychometricAssessment/WhatItIsSection';
import AssessmentPhaseStickyStepper from '@/components/PsychometricAssessment/AssessmentPhaseStickyStepper';
import QuestionDemoSection from '@/components/PsychometricAssessment/QuestionDemoSection';
import ReportExplorerSection from '@/components/PsychometricAssessment/ReportExplorerSection';
import AssessmentJourneySection from '@/components/PsychometricAssessment/AssessmentJourneySection';
import SampleReportGallery from '@/components/PsychometricAssessment/SampleReportGallery';
import ParentReassurance from '@/components/PsychometricAssessment/ParentReassurance';
import PsychometricFAQ from '@/components/PsychometricAssessment/PsychometricFAQ';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CLARVO Psychometric Assessment — Grades 7–12 Diagnostic & Stream Selection',
  description:
    'A 30-module psychometric evaluation across personality architecture, cognitive processing, learning modalities, and stream alignment. Clear direction for families, students, and counsellors before high-stakes academic decisions.',
  keywords: [
    'psychometric assessment',
    'stream selection class 10',
    'PCM vs PCB vs Commerce',
    'Holland RIASEC assessment',
    'learning modalities VARK',
    'high school career guidance',
    'CLARVO psychometric test',
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
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the difference between a psychometric assessment and an academic or IQ test?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An academic test measures knowledge recall and an IQ test measures speeded logic under pressure. A psychometric assessment evaluates natural behavioral drivers, learning modalities (VARK), cognitive processing patterns, and vocational affinities (RIASEC) without pass/fail grading.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the assessment help students in Grade 10 choose between PCM, PCB, Commerce, and Humanities?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It evaluates quantitative reasoning, spatial agility, verbal synthesis, and Holland vocational interest codes against requirements of all streams to provide fitment indications.',
          },
        },
      ],
    },
  ],
};

export default function PsychometricAssessmentPage() {
  return (
    <SmoothScrollProvider>
      <div className="bg-paper text-ink overflow-x-clip font-dmsans min-h-screen flex flex-col selection:bg-clarvo-blue selection:text-white">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Primary Navigation */}
        <LandingNavbar />

        <main className="flex-1 w-full">
          {/* ── SECTION 1: HERO (DESIGN_PSYCHOMETRIC.md Section 4) ── */}
          <HeroSection />

          {/* ── SECTION 2: WHAT IS A PSYCHOMETRIC ASSESSMENT? (DESIGN_PSYCHOMETRIC.md Section 5) ── */}
          <WhatItIsSection />

          {/* ── SECTION 3: THE FOUR ASSESSMENT PHASES (DESIGN_PSYCHOMETRIC.md Section 6) ── */}
          <section
            aria-label="The Four Assessment Phases"
            className="w-full py-16 sm:py-24 bg-midnight text-white overflow-visible"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="max-w-3xl space-y-4 text-left">
                <span className="text-[13px] font-bold text-sky bg-clarvo-blue px-3 py-1 rounded-full font-dmsans">
                  Diagnostic engine
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold font-dmsans text-white tracking-tight leading-tight">
                  {PSYCHOMETRIC_CONTENT.phases.sectionHeadline}
                </h2>
                <p className="text-[17px] sm:text-[18px] text-[#94A3B8] font-dmsans leading-relaxed">
                  {PSYCHOMETRIC_CONTENT.phases.sectionSubcopy}
                </p>
                <div className="pt-1">
                  <span className="text-[12px] font-semibold text-white/60 bg-white/10 px-3 py-1 rounded-md">
                    {PSYCHOMETRIC_CONTENT.phases.grade10Notice}
                  </span>
                </div>
              </div>

              {/* Four Phases Sticky Stepper (Desktop) / Stacked Cards (Mobile/Tablet/Touch) */}
              <AssessmentPhaseStickyStepper />
            </div>
          </section>

          {/* ── SECTION 4: WHAT A QUESTION LOOKS LIKE (DESIGN_PSYCHOMETRIC.md Section 7) ── */}
          <QuestionDemoSection />

          {/* ── SECTION 5: WHAT THE FAMILY RECEIVES (DESIGN_PSYCHOMETRIC.md Section 8) ── */}
          <ReportExplorerSection />

          {/* ── SECTION 6: THE ASSESSMENT JOURNEY (DESIGN_PSYCHOMETRIC.md Section 9) ── */}
          <AssessmentJourneySection />

          {/* ── SECTION 6: SAMPLE REPORT GALLERY (3 GRADE CARDS, STATIC ASSETS) ── */}
          <SampleReportGallery />

          {/* ── SECTION 7: PARENT & COUNSELLOR REASSURANCE ── */}
          <ParentReassurance />

          {/* ── SECTION 8: FAQ ACCORDION ── */}
          <PsychometricFAQ />

          {/* ── SECTION 9: FINAL CONVERSION CTA BANNER ── */}
          <section
            aria-label="Start Your Assessment Today"
            className="w-full py-16 sm:py-24 bg-midnight text-white relative overflow-hidden"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-clarvo-blue/20 rounded-full blur-[120px] pointer-events-none"
              aria-hidden="true"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
              <span className="text-[13px] font-bold text-white bg-clarvo-blue px-3.5 py-1.5 rounded-full font-dmsans">
                Empower their academic future
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-dmsans text-white tracking-tight leading-tight">
                Start with understanding. Move forward with clarity.
              </h2>

              <p className="text-[17px] sm:text-[18px] text-[#94A3B8] font-dmsans leading-relaxed max-w-2xl mx-auto">
                Join over 15,000 students and families who replaced academic anxiety with structured self-knowledge.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link
                  href="/psychometric-test"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-clarvo-blue hover:bg-[#0F47B8] shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Start assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/book-a-demo"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-[#1E293B] hover:bg-[#334155] border border-[#334155] transition-colors"
                >
                  <span>Book a consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Global Footer */}
        <LandingFooter />
      </div>
    </SmoothScrollProvider>
  );
}
