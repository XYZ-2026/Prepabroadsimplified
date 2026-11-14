import React from 'react';
import type { Metadata } from 'next';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import MotionProvider from '@/components/PsychometricAssessment/motion/MotionProvider';
import StickyMobileCTA from '@/components/PsychometricAssessment/StickyMobileCTA';
import ResearchHero from '@/components/Research/ResearchHero';
import FactStrip from '@/components/Research/FactStrip';
import StoriesSection from '@/components/Research/StoriesSection';
import UniversitiesSection from '@/components/Research/UniversitiesSection';
import ProgramsSection from '@/components/Research/ProgramsSection';
import CompareSection from '@/components/Research/CompareSection';
import StepsSection from '@/components/Research/StepsSection';
import ResearchFAQ from '@/components/Research/ResearchFAQ';
import ResearchCTA from '@/components/Research/ResearchCTA';
import { RESEARCH_CONTENT, bookCallHref } from '@/content/researchContent';
import '@/components/PsychometricAssessment/psychometric.css';

const TITLE = 'Research Programs for High School Students | CLARVO';
const DESCRIPTION =
  'Research programs for high school students in Classes 9–12: write a research paper with a mentor in 8 or 16 weeks (a strong summer option) and submit it to journals.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'research programs for high school students',
    'summer research programs for high school students',
    'high school research program India',
    'research paper for college applications',
    'publish research paper high school',
    'profile building research',
  ],
  alternates: { canonical: '/research' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://clarvo.in/research',
    siteName: 'CLARVO',
    type: 'website',
    images: [{ url: '/images/research/hero-mentor.webp', width: 1536, height: 1024 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': 'https://clarvo.in/research#service',
      name: 'CLARVO Research Mentorship',
      serviceType: 'High school research mentorship',
      description: DESCRIPTION,
      provider: { '@type': 'Organization', name: 'CLARVO', url: 'https://clarvo.in' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Research tracks',
        itemListElement: RESEARCH_CONTENT.programs.items.map((p) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: p.name, description: p.summary },
        })),
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://clarvo.in/research#faq',
      mainEntity: RESEARCH_CONTENT.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};

// Without JS, Motion's initial (hidden) styles would stick; force final states instead.
const NOSCRIPT_CSS = '[data-reveal]{opacity:1!important;transform:none!important}';

export default function ResearchPage() {
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
            <ResearchHero />
            <FactStrip />
            <StoriesSection />
            <UniversitiesSection />
            <ProgramsSection />
            <CompareSection />
            <StepsSection />
            <ResearchFAQ />
            <ResearchCTA />
          </main>

          <LandingFooter />
          <StickyMobileCTA
            href={bookCallHref('sticky-bar')}
            label={RESEARCH_CONTENT.bookCall.label}
            secondary={RESEARCH_CONTENT.stickyBar.secondary}
          />
        </div>
      </MotionProvider>
    </SmoothScrollProvider>
  );
}
