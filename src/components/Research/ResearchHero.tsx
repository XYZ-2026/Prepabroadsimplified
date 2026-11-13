'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, CalendarDays, Video } from 'lucide-react';
import { RESEARCH_CONTENT, bookCallHref } from '@/content/researchContent';
import { usePointerFine } from '@/hooks/usePointerFine';
import { springUi } from '@/components/PsychometricAssessment/motion/tokens';

const hero = RESEARCH_CONTENT.hero;
const { label: bookLabel, note: bookNote } = RESEARCH_CONTENT.bookCall;

/**
 * Hero. Headline lines rise in CSS (psychometric.css `psy-line`) so they start before hydration.
 * The progress card is the signature moment: its track fills from week 1 to 16 and each stage
 * lights up as the fill passes it.
 */
export default function ResearchHero() {
  const ref = useRef<HTMLElement>(null);
  const isFine = usePointerFine();
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, isFine && !reduced ? -28 : 0]);

  return (
    <section ref={ref} aria-label="Clarvo research mentorship" className="relative w-full bg-[#0B1D45] text-white" style={{ overflowX: 'clip' }}>
      {/* soft glow behind the photo */}
      <div aria-hidden="true" className="absolute right-[-10%] top-[-20%] w-[60vw] h-[60vw] max-w-[820px] max-h-[820px] rounded-full bg-clarvo-blue/40 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-24 sm:pb-28 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="psy-fade inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-solid border-white/15 text-[13px] font-bold text-[#C9D8FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7FA6FF]" aria-hidden="true" />
              {hero.chip}
            </span>

            <h1 className="font-dmsans font-bold tracking-tight leading-[1.06] text-[clamp(2.2rem,8vw,3.9rem)] lg:text-[clamp(2.6rem,4vw,3.9rem)] m-0 text-white">
              <span className="psy-line">
                <span className="[text-wrap:balance]">{hero.headlineLines[0]}</span>
              </span>
              <span className="psy-line">
                <span className="text-[#8FB1FF]">{hero.headlineLines[1]}</span>
              </span>
            </h1>

            <p className="psy-fade text-[17px] sm:text-[19px] text-white/75 leading-relaxed max-w-[46ch] m-0" style={{ animationDelay: '0.2s' }}>
              {hero.subcopy}
            </p>

            <div className="psy-fade space-y-3" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <m.span whileTap={{ scale: 0.97 }} transition={springUi} className="inline-flex">
                  <Link
                    href={bookCallHref('hero')}
                    data-hero-cta=""
                    className="w-full inline-flex items-center justify-center gap-2.5 h-[52px] px-7 rounded-full whitespace-nowrap text-[16px] font-bold text-white bg-clarvo-blue hover:bg-[#2B6BF0] shadow-[0_12px_30px_-10px_rgba(18,88,222,0.8)] transition-colors no-underline"
                  >
                    <CalendarDays className="w-[18px] h-[18px]" aria-hidden="true" />
                    {bookLabel}
                  </Link>
                </m.span>
                <a
                  href={hero.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-full text-[16px] font-bold text-white bg-white/5 hover:bg-white/10 border border-solid border-white/25 transition-colors no-underline"
                >
                  {hero.secondaryCta.label}
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              <p className="flex items-center gap-1.5 text-[14px] text-white/65 m-0">
                <Video className="w-4 h-4 text-[#8FB1FF]" aria-hidden="true" />
                {bookNote}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <m.div style={{ y: photoY }} className="psy-photo-in relative">
              <div className="relative aspect-[3/2] rounded-[24px] overflow-hidden ring-1 ring-white/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
                <Image src={hero.photo.src} alt={hero.photo.alt} fill priority sizes="(min-width: 1024px) 600px, 100vw" className="object-cover object-[70%_center]" />
              </div>
              <div className="absolute left-3 right-3 sm:right-auto sm:-left-6-bottom-16 sm:-bottom-12 z-10">
                <ProgressCard />
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressCard() {
  const card = hero.progressCard;
  const n = card.stages.length;
  const FILL = 2.2; // seconds for the whole track
  const START = 0.7;

  return (
    <m.div
      data-reveal=""
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springUi, delay: 0.5 }}
      className="sm:w-[400px] rounded-[16px] bg-white text-ink shadow-[0_24px_50px_-20px_rgba(8,15,28,0.45)] p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between mb-3.5">
        <span className="text-[13px] font-bold text-ink">{card.label}</span>
        <span className="text-[12px] font-semibold text-muted">16 weeks</span>
      </div>

      <div className="relative h-1.5 rounded-full bg-sky overflow-hidden mb-3">
        <m.div
          data-reveal=""
          className="absolute inset-0 rounded-full bg-clarvo-blue origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: FILL, delay: START, ease: [0.45, 0, 0.25, 1] }}
        />
      </div>

      <ol className="grid grid-cols-4 gap-2 list-none p-0 m-0">
        {card.stages.map((s, i) => (
          <m.li
            key={s.name}
            data-reveal=""
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: START + (FILL * (i + 1)) / n - 0.3 }}
          >
            <div className="text-[11px] font-bold text-clarvo-blue">{s.week}</div>
            <div className="text-[12px] sm:text-[12.5px] font-semibold text-ink leading-tight mt-0.5">{s.name}</div>
          </m.li>
        ))}
      </ol>
    </m.div>
  );
}
