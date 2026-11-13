'use client';

import React from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { PSYCHOMETRIC_CONTENT, bookCallHref } from '@/content/psychometricContent';
import { BookCallNote } from './BookCallButton';
import MagneticLink from './MagneticLink';
import Reveal from './motion/Reveal';
import { EASE_OUT, VIEWPORT } from './motion/tokens';

const cta = PSYCHOMETRIC_CONTENT.cta;

/**
 * Final CTA (spec 5.10). Blue panel with the family cutout flush to its bottom.
 * The photo rises 24px on entry; the primary button is magnetic on fine pointers.
 */
export default function FinalCTA() {
  return (
    <section id="start" aria-label="Start Your Assessment Today" className="w-full bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="relative overflow-hidden rounded-[28px] bg-clarvo-blue text-white xl:min-h-[480px] xl:grid xl:grid-cols-12">
          <div className="relative z-10 xl:col-span-5 p-7 sm:p-10 xl:p-14 xl:self-center">
            <Reveal as="h2" className="font-dmsans font-bold tracking-tight text-[clamp(2.25rem,3.4vw,3.25rem)] leading-[1.08] m-0 text-white">
              {cta.headline}
            </Reveal>
            <Reveal as="p" index={1} className="text-[17px] sm:text-[19px] text-white/85 mt-3 mb-8">
              {cta.subcopy}
            </Reveal>
            <Reveal index={2} className="flex flex-col items-start gap-3">
              <MagneticLink href={bookCallHref('final-cta')} label={PSYCHOMETRIC_CONTENT.bookCall.label} />
              <BookCallNote tone="light" />
            </Reveal>
          </div>

          <div className="relative xl:col-span-7 h-[240px] sm:h-[340px] xl:h-auto">
            <div
              className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[80%] h-[70%] rounded-full bg-sky/25 blur-3xl"
              aria-hidden="true"
            />
            <m.div
              data-reveal=""
              className="absolute inset-x-0 bottom-0 top-0 xl:right-[3%]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <Image src={cta.photo.src} alt={cta.photo.alt} fill sizes="(min-width: 1280px) 55vw, 100vw" className="object-contain object-bottom" />
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}
