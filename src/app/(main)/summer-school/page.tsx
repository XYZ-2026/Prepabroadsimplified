import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import WhatsAppFloatingButton from '@/components/landing/WhatsAppFloatingButton';
import { Container } from '@/components/landing/redesign/primitives';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import MotionProvider from '@/components/PsychometricAssessment/motion/MotionProvider';
import StickyMobileCTA from '@/components/PsychometricAssessment/StickyMobileCTA';
import FAQList from '@/components/PsychometricAssessment/FAQList';
import SummerSchoolHero from '@/components/SummerSchool/SummerSchoolHero';
import { AdmittedStudents, FactsBento, UniversityWall } from '@/components/SummerSchool/ProofSections';
import Reviews from '@/components/SummerSchool/Reviews';
import { Advantage, CtaBand, Mentors, ProgramsBento, StandOutFormula } from '@/components/SummerSchool/ProgramSections';
import StepsTabs from '@/components/SummerSchool/StepsTabs';
import OutcomeCarousel from '@/components/SummerSchool/OutcomeCarousel';
import EnquiryForm from '@/components/SummerSchool/EnquiryForm';
import { CARD_TITLE, Heading, SECTION } from '@/components/SummerSchool/ui';
import { FAQ, HERO } from '@/content/summerSchoolContent';
import '@/components/PsychometricAssessment/psychometric.css';
import '@/components/SummerSchool/summer-school.css';

const TITLE = 'Summer School & Certifications for Grades 8–12 | CLARVO';
const DESCRIPTION =
  'Summer programmes for high school students in business, technology, research and leadership. Work with a mentor and finish with a project for university applications.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/summer-school' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://clarvo.in/summer-school',
    siteName: 'CLARVO',
    type: 'website',
    images: [{ url: '/images/summer-school/business.webp', width: 1400, height: 933 }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
};

// Without JS, Motion's initial (hidden) styles would stick; force final states instead.
const NOSCRIPT_CSS = '[data-reveal]{opacity:1!important;transform:none!important}[data-reveal-path]{stroke-dasharray:none!important}';

export default function SummerSchoolPage() {
  return (
    <SmoothScrollProvider>
      <MotionProvider>
        <div className="ss-page bg-paper text-ink font-dmsans min-h-screen selection:bg-clarvo-blue selection:text-white" style={{ overflowX: 'clip' }}>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <noscript>
            <style>{NOSCRIPT_CSS}</style>
          </noscript>
          <LandingNavbar />
          <main className="psy-main">
            <SummerSchoolHero />
            <FactsBento />
            <UniversityWall />
            {/* Streamed in afterwards, so a slow Wix reply never holds up the page. */}
            <Suspense fallback={null}>
              <AdmittedStudents />
            </Suspense>
            <ProgramsBento />
            <StandOutFormula />
            <StepsTabs />
            <Reviews />
            <Mentors />
            <Advantage />
            <CtaBand />

            <section aria-label="Frequently asked questions" className="bg-white">
              <Container size="narrow" className={`${SECTION} [&_h3]:font-dmsans`}>
                <Heading center>Frequently asked questions</Heading>
                <FAQList items={FAQ} />
              </Container>
            </section>

            <section id="start" aria-label="Schedule a consultation call" className="bg-[var(--ss-navy)] scroll-mt-16">
              <Container className={`${SECTION} grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`}>
                <div className="order-2 lg:order-1">
                  <Heading dark>What will your child make this summer?</Heading>
                  <OutcomeCarousel />
                </div>
                <div className="order-1 lg:order-2 relative rounded-panel bg-white p-5 sm:p-8">
                  <h3 className={`${CARD_TITLE} text-ink mb-5`}>Schedule a consultation call</h3>
                  <EnquiryForm />
                </div>
              </Container>
            </section>
          </main>
          <LandingFooter />
          <StickyMobileCTA href="#start" label={HERO.cta} secondary={{ label: 'Programmes', href: '#programmes' }} />
          <WhatsAppFloatingButton raisedOnMobile />
        </div>
      </MotionProvider>
    </SmoothScrollProvider>
  );
}
