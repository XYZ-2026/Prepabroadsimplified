'use client';

import React from 'react';
import Link from 'next/link';
import { m } from 'motion/react';
import { Check, Target } from 'lucide-react';
import { RESEARCH_CONTENT, bookCallHref, type Program } from '@/content/researchContent';
import { STAGGER, VIEWPORT, enterHidden, enterShown, enterTransition, springUi } from '@/components/PsychometricAssessment/motion/tokens';
import SectionHeading from './SectionHeading';

const content = RESEARCH_CONTENT.programs;

/** The three tracks. The featured card sits on a blue header and is lifted on desktop. */
export default function ProgramsSection() {
  return (
    <section id="programs" aria-label="Research programs" className="w-full bg-white border-b border-line scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} subcopy={content.subcopy} />

        <ul className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-start list-none p-0 m-0">
          {content.items.map((p, i) => (
            <m.li
              key={p.id}
              data-reveal=""
              initial={enterHidden}
              whileInView={enterShown}
              viewport={VIEWPORT}
              transition={{ ...enterTransition, delay: i * STAGGER * 2 }}
              className={p.featured ? 'lg:-mt-4' : ''}
            >
              <ProgramCard p={p} />
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProgramCard({ p }: { p: Program }) {
  const f = !!p.featured;
  return (
    <m.article
      whileHover={{ y: -6 }}
      transition={springUi}
      className={`relative h-full flex flex-col rounded-[22px] overflow-hidden bg-white border ${
        f ? 'border-clarvo-blue border-2 shadow-clarvo-elevated' : 'border-line'
      }`}
    >
      <header className={`px-6 pt-6 pb-5 ${f ? 'bg-clarvo-blue text-white' : 'bg-paper text-ink'}`}>
        {f && (
          <span className="inline-flex mb-3 px-2.5 py-1 rounded-full bg-white text-clarvo-blue text-[11px] font-bold uppercase tracking-[0.1em]">
            {content.featuredLabel}
          </span>
        )}
        <h3 className="font-dmsans text-[24px] font-bold tracking-tight m-0">{p.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[40px] font-bold leading-none tracking-tight">{p.weeks}</span>
          <span className={`text-[15px] font-semibold ${f ? 'text-white/80' : 'text-muted'}`}>weeks · {p.format}</span>
        </div>
        <p className={`text-[15px] leading-relaxed mt-3 mb-0 ${f ? 'text-white/85' : 'text-muted'}`}>{p.summary}</p>
      </header>

      <div className="flex-1 flex flex-col px-6 pt-5 pb-6">
        <div className="rounded-[14px] bg-sky/60 px-4 py-3 flex gap-3">
          <Target className="w-5 h-5 text-clarvo-blue shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-clarvo-blue">{content.goalLabel}</div>
            <div className="text-[15px] font-bold text-ink leading-snug mt-0.5">{p.goal}</div>
          </div>
        </div>

        <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted mt-6 mb-3">{content.includesLabel}</div>
        <ul className="space-y-2.5 list-none p-0 m-0 flex-1">
          {p.includes.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] text-ink/85 leading-snug">
              <span className="w-5 h-5 shrink-0 rounded-full bg-sky flex items-center justify-center mt-px">
                <Check className="w-3 h-3 text-clarvo-blue" strokeWidth={3} aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <Link
          href={bookCallHref(`program-${p.id}`)}
          className={`mt-7 w-full inline-flex items-center justify-center h-[50px] rounded-full text-[15px] font-bold transition-colors no-underline ${
            f ? 'bg-clarvo-blue text-white hover:bg-[#0F47B8]' : 'bg-white text-ink border border-line hover:border-clarvo-blue hover:text-clarvo-blue'
          }`}
        >
          {content.cta}
        </Link>
      </div>
    </m.article>
  );
}
