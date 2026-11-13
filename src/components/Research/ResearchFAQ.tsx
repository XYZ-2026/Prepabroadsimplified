import React from 'react';
import { RESEARCH_CONTENT } from '@/content/researchContent';
import FAQList from '@/components/PsychometricAssessment/FAQList';
import SectionHeading from './SectionHeading';

const content = RESEARCH_CONTENT.faq;

/** FAQ. Same items are emitted as FAQPage JSON-LD in the page. */
export default function ResearchFAQ() {
  return (
    <section id="faq" aria-label="Frequently asked questions about Clarvo research mentorship" className="w-full bg-white border-b border-line">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} className="mb-8 sm:mb-10" />
        <FAQList items={content.items} />
      </div>
    </section>
  );
}
