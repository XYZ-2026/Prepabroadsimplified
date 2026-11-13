'use client';

import React from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { RESEARCH_CONTENT, bookCallHref } from '@/content/researchContent';
import MagneticLink from '@/components/PsychometricAssessment/MagneticLink';
import Reveal from '@/components/PsychometricAssessment/motion/Reveal';
import { EASE_OUT, VIEWPORT } from '@/components/PsychometricAssessment/motion/tokens';

const cta = RESEARCH_CONTENT.cta;

/** Closing CTA: blue panel with the students cutout standing on its bottom edge. */
export default function ResearchCTA() {
  return (
    <section id="start" aria-label={cta.headline} className="w-full bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="relative overflow-hidden rounded-[28px] bg-clarvo-blue text-white lg:min-h-[440px] lg:grid lg:grid-cols-12">
          <div className="relative z-10 lg:col-span-5 p-7 sm:p-10 lg:p-14 lg:self-center">
            <Reveal as="h2" className="font-dmsans font-bold tracking-tight text-[clamp(2rem,3.4vw,3.1rem)] leading-[1.08] m-0 text-white">
              {cta.headline}
            </Reveal>
            <Reveal as="p" index={1} className="text-[17px] sm:text-[18px] text-white/85 leading-relaxed mt-3 mb-8">
              {cta.subcopy}
            </Reveal>
            <Reveal index={2} className="flex flex-col items-start gap-3">
              <MagneticLink href={bookCallHref('final-cta')} label={RESEARCH_CONTENT.bookCall.label} />
              <p className="text-[14px] text-white/75 m-0">{cta.note}</p>
            </Reveal>
          </div>

          <div className="relative lg:col-span-7 h-[260px] sm:h-[360px] lg:h-auto">
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[80%] h-[70%] rounded-full bg-sky/25 blur-3xl" aria-hidden="true" />
            <m.div
              data-reveal=""
              className="absolute inset-0 lg:top-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <Image src={cta.photo.src} alt={cta.photo.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain object-bottom" />
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}
