'use client';

import React from 'react';
import { m } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import Reveal from './motion/Reveal';
import { EASE_OUT, VIEWPORT } from './motion/tokens';

const content = PSYCHOMETRIC_CONTENT.whatItIs;
const ROW_STAGGER = 0.12;

/**
 * Is / is not (spec 5.2). Signature motion: a line draws through each wrong
 * idea, it fades to muted, then the right idea slides in.
 */
export default function WhatItIsSection() {
  return (
    <section aria-label="What a psychometric assessment is" className="w-full bg-white border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <Reveal as="h2" className="font-dmsans font-bold text-ink tracking-tight text-[clamp(1.875rem,6vw,3rem)] leading-[1.1] m-0 mb-8 sm:mb-12">
          {content.headline}
        </Reveal>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 list-none p-0 m-0">
          {content.rows.map((row, i) => {
            const base = i * ROW_STAGGER;
            return (
              <m.li
                key={row.not}
                initial="hidden"
                whileInView="shown"
                viewport={VIEWPORT}
                className="rounded-[14px] bg-paper border border-line p-5 sm:p-6"
              >
                <m.span
                  className="relative inline-block text-[17px] sm:text-[18px] font-semibold"
                  variants={{ hidden: { opacity: 1, color: '#12131C' }, shown: { opacity: 0.55, color: '#5B6275' } }}
                  transition={{ duration: 0.3, delay: base + 0.4 }}
                >
                  {row.not}
                  <svg
                    className="absolute left-0 top-1/2 w-full h-[6px] -translate-y-1/2 overflow-visible pointer-events-none"
                    viewBox="0 0 100 6"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <m.path
                      data-reveal-path=""
                      d="M0 3 C 30 1.5, 70 4.5, 100 3"
                      fill="none"
                      stroke="#1258DE"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
                      transition={{ duration: 0.4, delay: base, ease: EASE_OUT }}
                    />
                  </svg>
                </m.span>
                <span className="sr-only"> is not what it is. Instead: </span>

                <m.div
                  data-reveal=""
                  className="flex items-center gap-2 mt-3"
                  variants={{ hidden: { opacity: 0, x: 12 }, shown: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.45, delay: base + 0.5, ease: EASE_OUT }}
                >
                  <ArrowRight className="w-5 h-5 text-clarvo-blue shrink-0" aria-hidden="true" />
                  <span className="text-[20px] sm:text-[22px] font-bold text-ink leading-tight">{row.is}</span>
                </m.div>
              </m.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
