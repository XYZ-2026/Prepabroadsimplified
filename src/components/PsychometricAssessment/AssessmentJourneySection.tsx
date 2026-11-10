'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { m, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ClipboardList, Laptop, LineChart, FileText, Video } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import Reveal from './motion/Reveal';
import { springUi } from './motion/tokens';

const content = PSYCHOMETRIC_CONTENT.journey;
const steps = content.steps;
const ICONS = [ClipboardList, Laptop, LineChart, FileText, Video];

/**
 * Journey (spec 5.6). Signature motion: a progress line draws along the
 * timeline as it scrolls through view; each dot fills when the line reaches it.
 * Vertical below 1024, horizontal from 1024.
 */
export default function AssessmentJourneySection() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 60%'] });
  // Starts at 0 on server and client alike; reduced motion is applied after hydration.
  const progress = useMotionValue(0);
  // Drive the line through a CSS variable: Motion renders transform motion values as
  // `none` on the client under reducedMotion="user", which breaks hydration.
  const lineStyle = { '--psy-line': progress } as unknown as React.CSSProperties;
  const [reached, setReached] = useState(0);

  useEffect(() => {
    if (reduced) {
      progress.set(1);
      setReached(steps.length);
    }
  }, [reduced, progress]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return;
    progress.set(v);
    // Step i is reached once the line passes its position (0, 0.25, 0.5, ...).
    setReached(Math.min(steps.length, Math.floor(v * (steps.length - 1) + 1.0001)));
  });

  return (
    <section aria-label="The assessment journey" className="w-full bg-paper border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <Reveal as="h2" className="font-dmsans font-bold text-ink tracking-tight text-[clamp(1.875rem,6vw,3rem)] leading-[1.1] m-0 mb-10 lg:mb-14 max-w-[18ch]">
          {content.sectionHeadline}
        </Reveal>

        <ol ref={listRef} className="relative list-none p-0 m-0 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Track + drawn line: vertical (mobile) */}
          <span className="lg:hidden absolute left-[21px] top-6 bottom-6 w-[2px] bg-line rounded-full" aria-hidden="true" />
          <m.span
            className="lg:hidden absolute left-[21px] top-6 bottom-6 w-[2px] bg-clarvo-blue rounded-full origin-top [transform:scaleY(var(--psy-line))]"
            style={lineStyle}
            aria-hidden="true"
          />
          {/* Track + drawn line: horizontal (desktop) */}
          <span className="hidden lg:block absolute top-[21px] left-[22px] right-[calc(20%-22px)] h-[2px] bg-line rounded-full" aria-hidden="true" />
          <m.span
            className="hidden lg:block absolute top-[21px] left-[22px] right-[calc(20%-22px)] h-[2px] bg-clarvo-blue rounded-full origin-left [transform:scaleX(var(--psy-line))]"
            style={lineStyle}
            aria-hidden="true"
          />

          {steps.map((step, i) => {
            const Icon = ICONS[i];
            const isReached = i < reached;
            return (
              <li key={step.step} className="relative flex lg:flex-col gap-4 lg:gap-5">
                <m.span
                  className={`relative z-10 w-11 h-11 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                    isReached ? 'bg-clarvo-blue border-clarvo-blue text-white' : 'bg-white border-line text-muted'
                  }`}
                  animate={{ scale: isReached ? 1 : 0.92 }}
                  transition={springUi}
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5" />
                </m.span>

                <div className="flex-1 min-w-0 pt-1 lg:pt-0">
                  <span className="sr-only">Step {step.step}: </span>
                  <h3 className="text-[19px] font-bold text-ink m-0">{step.title}</h3>
                  <p className="text-[16px] text-muted leading-snug mt-1 mb-0">{step.line}</p>

                  {step.photo && (
                    <div className="relative mt-4 overflow-hidden rounded-[20px] aspect-[16/10] bg-sky hidden sm:block">
                      <Image src={step.photo} alt={step.photoAlt} fill sizes="(min-width: 1024px) 18vw, 50vw" className="object-cover" />
                    </div>
                  )}
                </div>

                {step.photo && (
                  <div className="sm:hidden relative w-14 h-14 shrink-0 overflow-hidden rounded-full bg-sky self-center">
                    <Image src={step.photo} alt={step.photoAlt} fill sizes="56px" className="object-cover" />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
