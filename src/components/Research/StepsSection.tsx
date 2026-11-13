'use client';

import React, { useRef } from 'react';
import { m, useScroll, useSpring } from 'motion/react';
import { RESEARCH_CONTENT } from '@/content/researchContent';
import { STAGGER, VIEWPORT, enterHidden, enterShown, enterTransition } from '@/components/PsychometricAssessment/motion/tokens';
import SectionHeading from './SectionHeading';

const content = RESEARCH_CONTENT.steps;

/**
 * How it works. A progress line runs through the four steps and draws as the section
 * scrolls through the viewport (horizontal on desktop, vertical on mobile).
 */
export default function StepsSection() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section id="how-it-works" aria-label={content.headline} className="w-full bg-[#0B1D45] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} tone="dark" />

        <ol ref={ref} className="relative mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8 list-none p-0 m-0">
          {/* track + fill, desktop */}
          <div aria-hidden="true" className="hidden lg:block absolute left-0 right-0 top-[22px] h-[2px] bg-white/15">
            <m.div data-reveal-path="" style={{ scaleX: progress }} className="h-full bg-[#8FB1FF] origin-left" />
          </div>
          {/* track + fill, mobile */}
          <div aria-hidden="true" className="lg:hidden absolute left-[22px] top-0 bottom-0 w-[2px] bg-white/15">
            <m.div data-reveal-path="" style={{ scaleY: progress }} className="w-full h-full bg-[#8FB1FF] origin-top" />
          </div>

          {content.items.map((s, i) => (
            <m.li
              key={s.title}
              data-reveal=""
              initial={enterHidden}
              whileInView={enterShown}
              viewport={VIEWPORT}
              transition={{ ...enterTransition, delay: i * STAGGER * 2 }}
              className="relative pl-16 lg:pl-0"
            >
              <span className="absolute left-0 top-0 lg:static flex w-[46px] h-[46px] rounded-full bg-[#0B1D45] border-2 border-solid border-[#8FB1FF] items-center justify-center text-[15px] font-bold text-white">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-dmsans text-[20px] font-bold text-white m-0 lg:mt-6">{s.title}</h3>
              <p className="text-[15.5px] leading-relaxed text-white/70 mt-2 mb-0 max-w-[36ch]">{s.body}</p>
            </m.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
