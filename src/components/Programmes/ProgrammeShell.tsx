import React from 'react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import WhatsAppFloatingButton from '@/components/landing/WhatsAppFloatingButton';
import { Container } from '@/components/landing/redesign/primitives';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import MotionProvider from '@/components/PsychometricAssessment/motion/MotionProvider';
import EnquiryForm from '@/components/SummerSchool/EnquiryForm';
import { CARD_TITLE, Heading, SECTION } from '@/components/SummerSchool/ui';
import { PROGRAMMES } from '@/content/programmeList';
import '@/components/PsychometricAssessment/psychometric.css';
import '@/components/SummerSchool/summer-school.css';
import './programmes.css';

// Without JS, Motion's initial (hidden) styles would stick; force final states instead.
const NOSCRIPT_CSS = '[data-reveal]{opacity:1!important;transform:none!important}';

const OPTIONS = PROGRAMMES.map(({ slug, name }) => ({ slug, name }));

/** Page frame shared by the programme, overview and batch pages. */
export function ProgrammeShell({ children, jsonLd }: { children: React.ReactNode; jsonLd?: object }) {
  return (
    <SmoothScrollProvider>
      <MotionProvider>
        <div className="ss-page bg-paper text-ink font-dmsans min-h-screen selection:bg-clarvo-blue selection:text-white" style={{ overflowX: 'clip' }}>
          {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
          <noscript>
            <style>{NOSCRIPT_CSS}</style>
          </noscript>
          <LandingNavbar />
          <main className="psy-main">{children}</main>
          <LandingFooter />
          <WhatsAppFloatingButton raisedOnMobile />
        </div>
      </MotionProvider>
    </SmoothScrollProvider>
  );
}

interface EnquirySectionProps {
  /** "h1" when the form is the whole page. */
  as?: 'h1' | 'h2';
  title: string;
  sub: string;
  selected?: string;
  /** Upcoming months to choose from: turns the form into a batch request. */
  months?: string[];
}

export function EnquirySection({ as: level = 'h2', title, sub, selected, months }: EnquirySectionProps) {
  const FormTitle = level === 'h1' ? 'h2' : 'h3';
  return (
    <section id="start" aria-label={title} className="bg-[var(--ss-navy)] scroll-mt-16">
      <Container className={`${SECTION} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start`}>
        <Heading as={level} dark sub={sub}>{title}</Heading>
        <div className="relative rounded-panel bg-white p-5 sm:p-8">
          <FormTitle className={`${CARD_TITLE} text-ink mb-5`}>{months ? 'Request a batch' : 'Send an enquiry'}</FormTitle>
          <EnquiryForm programmes={OPTIONS} selected={selected} months={months} />
        </div>
      </Container>
    </section>
  );
}
