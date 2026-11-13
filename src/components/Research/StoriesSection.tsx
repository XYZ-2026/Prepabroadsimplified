'use client';

import React, { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { ChevronDown, Quote } from 'lucide-react';
import { RESEARCH_CONTENT } from '@/content/researchContent';
import { ALL_TESTIMONIALS, type TestimonialItem } from '@/data/testimonials-data';
import { EASE_OUT, STAGGER, VIEWPORT, enterHidden, enterShown, enterTransition } from '@/components/PsychometricAssessment/motion/tokens';
import SectionHeading from './SectionHeading';

const content = RESEARCH_CONTENT.stories;
const STORIES = ALL_TESTIMONIALS.filter((t) => t.category === 'research-admissions').slice(0, content.expandedCount);

/** Student stories. Three cards, then "show more" opens the next six in place. */
export default function StoriesSection() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? STORIES : STORIES.slice(0, content.initialCount);

  return (
    <section id="stories" aria-label={content.eyebrow} className="w-full bg-paper border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} subcopy={content.subcopy} />

        <ul className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
          <AnimatePresence initial={false}>
            {shown.map((t, i) => (
              <m.li
                key={t.id}
                data-reveal=""
                layout
                initial={enterHidden}
                whileInView={enterShown}
                viewport={VIEWPORT}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ ...enterTransition, delay: (i % 3) * STAGGER }}
              >
                <StoryCard t={t} />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>

        {STORIES.length > content.initialCount && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white border border-line text-[15px] font-bold text-ink hover:border-clarvo-blue hover:text-clarvo-blue transition-colors cursor-pointer"
            >
              {expanded ? content.showLessLabel : content.showMoreLabel}
              <m.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25, ease: EASE_OUT }} className="inline-flex">
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </m.span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StoryCard({ t }: { t: TestimonialItem }) {
  return (
    <article className="group h-full flex flex-col rounded-[18px] bg-white border border-line overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-clarvo-elevated">
      {/* The work, first: what the student produced */}
      <div className="bg-[#0B1D45] text-white px-5 pt-5 pb-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8FB1FF] mb-1.5">Research outcome</div>
        <p className="text-[16px] font-bold leading-snug m-0">{t.outcomeMetric}</p>
        <p className="text-[13px] text-white/65 mt-1.5 mb-0">{t.focusArea}</p>
      </div>

      <div className="flex-1 flex flex-col px-5 py-5">
        <Quote className="w-5 h-5 text-clarvo-blue/40 mb-2" aria-hidden="true" />
        <blockquote className="m-0 text-[15px] leading-relaxed text-ink/85 flex-1">{t.quote}</blockquote>

        <footer className="mt-5 pt-4 border-0 border-t border-solid border-line flex items-center gap-3">
          <span className="w-10 h-10 shrink-0 rounded-full bg-sky text-clarvo-blue text-[14px] font-bold flex items-center justify-center" aria-hidden="true">
            {t.initials}
          </span>
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-ink truncate">
              {t.name} <span className="font-medium text-muted">· {t.role}</span>
            </div>
            <div className="text-[12.5px] text-muted truncate">
              {t.grade}, {t.school}, {t.city}
            </div>
          </div>
        </footer>
        <div className="mt-3">
          <span className="inline-flex px-2.5 py-1 rounded-full bg-sky text-[12px] font-bold text-clarvo-blue">{t.outcomeBadge}</span>
        </div>
      </div>
    </article>
  );
}
