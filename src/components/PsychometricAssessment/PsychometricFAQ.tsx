'use client';

import React from 'react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import Reveal from './motion/Reveal';
import FAQList from './FAQList';

const content = PSYCHOMETRIC_CONTENT.faq;

/** FAQ (spec 5.9). Copy shared with the FAQPage JSON-LD. */
export default function PsychometricFAQ() {
  return (
    <section id="faq" aria-label="Frequently Asked Questions about CLARVO Psychometric Assessment" className="w-full bg-white border-b border-line">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <Reveal as="h2" className="font-dmsans font-bold text-ink tracking-tight text-[clamp(1.875rem,6vw,3rem)] leading-[1.1] m-0 mb-8 sm:mb-10">
          {content.sectionHeadline}
        </Reveal>
        <FAQList items={content.items} />
      </div>
    </section>
  );
}
