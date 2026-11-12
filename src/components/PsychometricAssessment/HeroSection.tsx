'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { m, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { FileText } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import { usePointerFine } from '@/hooks/usePointerFine';
import BookCallButton, { BookCallNote } from './BookCallButton';
import CountUp from './motion/CountUp';
import { springData, springUi } from './motion/tokens';

const hero = PSYCHOMETRIC_CONTENT.hero;
const facts = PSYCHOMETRIC_CONTENT.facts;

/**
 * Hero (spec 5.1). Headline, sub, CTAs and photo animate in CSS (psychometric.css)
 * so they start before hydration. The profile card is the signature moment:
 * it springs in and its bars fill while the numbers count up.
 *
 * Face-safe rule (faceZones-psychometric.json): faces occupy x 21–76%, y 9–53%.
 * Below 1024 the card starts at y 72% and hangs below the photo; from 1024
 * it sits above the heads (its bottom edge at y 8%).
 */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isFine = usePointerFine();
  const reduced = useReducedMotion();
  const parallax = isFine && !reduced;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, parallax ? -24 : 0]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, parallax ? -12 : 0]);

  const factPills = [
    `${facts.modulesCount} modules`,
    `${facts.phasesCount} phases`,
    `${facts.grade10FullReportPages}-page report`,
    facts.testDuration,
    facts.numberOfQuestions ? `${facts.numberOfQuestions} questions` : null,
  ].filter(Boolean) as string[];

  return (
    <section
      ref={sectionRef}
      aria-label="CLARVO Psychometric Assessment Overview"
      className="relative w-full bg-paper border-b border-line"
      style={{ overflowX: 'clip' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-8 lg:items-end lg:min-h-[min(760px,calc(100svh-118px))]">
          {/* ── Copy ── */}
          <div className="lg:col-span-6 xl:col-span-6 lg:self-center lg:pb-16 space-y-5 sm:space-y-6">
            <span className="psy-fade inline-flex items-center px-3.5 py-1.5 rounded-full bg-sky text-[13px] font-bold text-clarvo-blue">
              {hero.chip}
            </span>

            <h1 className="font-dmsans font-bold text-ink tracking-tight leading-[1.08] text-[clamp(2.125rem,8.6vw,3.75rem)] lg:text-[clamp(2.5rem,3.5vw,3.5rem)] m-0">
              <span className="psy-line">
                <span>{hero.headlineLines[0]}</span>
              </span>
              <span className="psy-line">
                <span className="text-clarvo-blue">{hero.headlineLines[1]}</span>
              </span>
            </h1>

            <p
              className="psy-fade text-[17px] sm:text-[19px] text-muted leading-relaxed max-w-[34ch] m-0"
              style={{ animationDelay: '0.2s' }}
            >
              {hero.subcopy}
            </p>

            {/* Desktop CTAs (mobile CTAs sit under the photo) */}
            <div className="hidden lg:block psy-fade" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-wrap items-center gap-3">
                <HeroCtas />
              </div>
              <BookCallNote className="mt-3" />
            </div>

            <ul className="hidden lg:flex flex-wrap gap-2 list-none p-0 m-0 psy-fade" style={{ animationDelay: '0.4s' }}>
              {factPills.map((f) => (
                <FactPill key={f} label={f} />
              ))}
            </ul>
          </div>

          {/* ── Photo + profile card ── */}
          <div className="lg:col-span-6 relative lg:-mr-8 xl:-mr-16 mb-[92px] lg:mb-0">
            <m.div style={{ y: photoY }} className="psy-photo-in relative">
              <div
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 6%, #000 94%, transparent 100%)',
                }}
              >
                <Image
                  src={hero.photo.src}
                  alt={hero.photo.alt}
                  width={1536}
                  height={1024}
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="block w-full h-auto select-none"
                />
              </div>

              <m.div
                style={{ y: cardY }}
                className="absolute left-0 sm:left-[2%] top-[72%] lg:top-auto lg:bottom-[92%] lg:left-[4%] z-10"
              >
                <ProfileCard />
              </m.div>
            </m.div>
          </div>

          {/* Mobile CTAs + facts */}
          <div className="lg:hidden space-y-5 pb-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <HeroCtas />
            </div>
            <BookCallNote className="!mt-3" />
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {factPills.map((f) => (
                <FactPill key={f} label={f} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCtas() {
  return (
    <>
      <BookCallButton placement="hero" heroMarker className="w-full sm:w-auto" />
      <m.div whileTap={{ scale: 0.97 }} transition={springUi} className="w-full sm:w-auto">
        <a
          href={hero.ctas.secondary.href}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-full text-[16px] font-bold text-ink bg-white hover:bg-sky border border-line transition-colors no-underline"
        >
          <FileText className="w-4 h-4 text-clarvo-blue" aria-hidden="true" />
          {hero.ctas.secondary.label}
        </a>
      </m.div>
    </>
  );
}

function FactPill({ label }: { label: string }) {
  return (
    <li className="px-3.5 py-1.5 rounded-full bg-white border border-line text-[14px] font-semibold text-ink">
      {label}
    </li>
  );
}

function ProfileCard() {
  const card = hero.profileCard;
  return (
    <m.div
      data-reveal=""
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springUi, delay: 0.55 }}
      className="w-[224px] sm:w-[252px] rounded-[14px] bg-white/95 backdrop-blur border border-line shadow-clarvo-elevated p-3.5 sm:p-4"
    >
      <div className="text-[13px] font-semibold text-muted mb-2.5">{card.label}</div>
      <ul className="space-y-2.5 list-none p-0 m-0">
        {card.traits.map((t, i) => (
          <li key={t.name}>
            <div className="flex items-baseline justify-between text-[13px] mb-1">
              <span className="font-semibold text-ink">{t.name}</span>
              <span className="font-bold text-clarvo-blue">
                <CountUp value={t.score} delay={0.75 + i * 0.1} duration={0.9} />
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-sky overflow-hidden">
              <m.div
                data-reveal=""
                className="h-full rounded-full bg-clarvo-blue origin-left"
                style={{ width: `${t.score}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ ...springData, delay: 0.75 + i * 0.1 }}
              />
            </div>
          </li>
        ))}
      </ul>
    </m.div>
  );
}
