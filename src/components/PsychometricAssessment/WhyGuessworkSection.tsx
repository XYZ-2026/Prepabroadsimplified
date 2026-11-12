'use client';

import React from 'react';
import Image from 'next/image';
import { m, type Variants } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  Brain,
  FileText,
  Layers,
  MapPin,
  MessagesSquare,
  Route,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import BookCallButton, { BookCallNote } from './BookCallButton';
import Reveal from './motion/Reveal';
import { EASE_OUT, springUi, VIEWPORT } from './motion/tokens';

const content = PSYCHOMETRIC_CONTENT.whyGuesswork;

const ICONS: Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  Trophy,
  Users,
  MessagesSquare,
  FileText,
  Brain,
  Target,
  Layers,
  Route,
};

/**
 * Section 2 (boss reference): problem → solution → proof.
 *   Before card : a worried family surrounded by the noise parents rely on today.
 *   After card  : a counsellor, a relaxed family and a personalised roadmap.
 * Signature motion (plays once, per card, when it enters view):
 *   Before → bubbles pop in one by one, the "?" wobbles once.
 *   After  → the roadmap card drops in, its path draws, milestones fill, the flag pops.
 * Everything visible is live HTML/SVG over the cutout scenes, so it stays sharp, translatable
 * and animatable. Mobile first: cards stack with a down arrow; from 1024 they sit side by side.
 */
export default function WhyGuessworkSection() {
  return (
    <section
      aria-label="Why a career decision needs more than guesswork"
      className="relative w-full bg-white border-b border-line"
      style={{ overflowX: 'clip' }}
    >
      {/* Soft brand wash behind the heading, like the reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{ background: 'radial-gradient(60% 100% at 50% 0%, #E6EDFF 0%, rgba(230,237,255,0) 100%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        {/* Heading */}
        <header className="text-center max-w-3xl mx-auto">
          <Reveal
            as="h2"
            className="font-dmsans font-bold text-ink tracking-tight text-[clamp(1.875rem,6.4vw,3.25rem)] leading-[1.12] m-0"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            <span>{content.headline[0]}</span>{' '}
            <span className="lg:block">
              {content.headline[1]} <Highlight>{content.headline[2]}</Highlight>
            </span>
          </Reveal>
          <Reveal as="p" index={1} className="text-[17px] sm:text-[19px] text-muted leading-relaxed mt-4 mb-0 max-w-[36ch] sm:max-w-none mx-auto">
            {content.subcopy}
          </Reveal>
        </header>

        {/* Before → After */}
        <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 lg:grid-cols-[1fr_0px_1fr] lg:gap-x-10 items-stretch">
          <div className="w-full max-w-[560px] mx-auto lg:max-w-none">
            <BeforeCard />
          </div>

          <Connector />

          <div className="w-full max-w-[560px] mx-auto lg:max-w-none">
            <AfterCard />
          </div>
        </div>

        {/* CTA: the page's one primary action */}
        <Reveal className="mt-10 lg:mt-12 flex flex-col items-center gap-3 max-w-[560px] sm:max-w-none mx-auto">
          <BookCallButton placement="why-guesswork" className="w-full sm:w-auto" />
          <BookCallNote />
        </Reveal>

        {/* Benefits */}
        <ul className="mt-12 lg:mt-16 pt-8 border-t border-line grid grid-cols-2 lg:grid-cols-4 gap-y-8 list-none p-0 m-0">
          {content.benefits.map((b, i) => {
            const Icon = ICONS[b.icon] ?? Target;
            return (
              <Reveal
                as="li"
                key={b.title}
                index={i}
                className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 text-center lg:text-left px-3 lg:px-6 lg:border-l border-line first:lg:border-l-0"
              >
                <span className="w-12 h-12 shrink-0 rounded-full bg-sky flex items-center justify-center text-clarvo-blue">
                  <Icon className="w-6 h-6" aria-hidden={true} />
                </span>
                <span className="text-[16px] lg:text-[17px] font-semibold text-ink leading-snug">{b.title}</span>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────────── Heading underline ───────────────────────────── */

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block text-clarvo-blue">
      {children}
      <svg
        className="absolute left-0 right-0 -bottom-1 sm:-bottom-1.5 w-full h-[9px] sm:h-[11px] overflow-visible"
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <m.path
          data-reveal-path=""
          d="M2 6 C 40 1, 80 9, 120 4 S 180 3, 198 5"
          fill="none"
          stroke="#1258DE"
          strokeWidth={3.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT }}
        />
      </svg>
    </span>
  );
}

/* ───────────────────────────────── Connector ───────────────────────────────── */

function Connector() {
  return (
    <div className="relative z-10 flex items-center justify-center h-14 lg:h-auto" aria-hidden="true">
      <m.span
        data-reveal=""
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ ...springUi, delay: 0.1 }}
        className="flex items-center justify-center w-11 h-11 lg:w-14 lg:h-14 shrink-0 rounded-full bg-clarvo-blue text-white shadow-clarvo-elevated"
      >
        <ArrowDown className="w-5 h-5 lg:hidden" />
        <ArrowRight className="w-6 h-6 hidden lg:block" />
      </m.span>
    </div>
  );
}

/* ─────────────────────────────── Shared variants ─────────────────────────────── */

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

function Pill({ tone, children }: { tone: 'muted' | 'brand'; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] font-bold ${
        tone === 'brand' ? 'bg-clarvo-blue text-white' : 'bg-white text-muted border border-line'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${tone === 'brand' ? 'bg-white' : 'bg-muted'}`} aria-hidden="true" />
      {children}
    </span>
  );
}

/* ─────────────────────────────── Before: the noise ─────────────────────────────── */

// Bubbles sit staggered above the family, left to right. Classes are written in full for Tailwind.
const BUBBLE_POS = [
  'left-0 top-[20px] sm:top-[26px]',
  'left-[24.5%] top-0 sm:top-[4px]',
  'left-[49%] top-[24px] sm:top-[32px]',
  'left-[73.5%] top-[8px] sm:top-[10px]',
];
// Tail dots lead from each bubble toward the "?" in the middle.
const TAIL_DIR = [1, 1, -1, -1];

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 8 },
  shown: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...(springUi as object), delay: 0.25 + i * 0.12 },
  }),
};

function BeforeCard() {
  return (
    <m.div
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      className="relative overflow-hidden h-full rounded-[28px] bg-paper border border-line"
    >
      <div className="absolute left-0 top-0 z-20 px-5 pt-5 sm:px-6 sm:pt-6">
        <Pill tone="muted">{content.beforeLabel}</Pill>
      </div>

      {/* Bubbles + "?" float above the family; they don't affect the card height. */}
      <div className="absolute inset-x-3 sm:inset-x-4 top-[76px] sm:top-[107px] h-[196px] sm:h-[240px] z-10">
        <ul className="list-none p-0 m-0" aria-label="What families often rely on today">
          {content.bubbles.map((b, i) => {
            const Icon = ICONS[b.icon] ?? Target;
            const dir = TAIL_DIR[i];
            return (
              <m.li
                key={b.id}
                data-reveal=""
                custom={i}
                variants={pop}
                className={`absolute ${BUBBLE_POS[i]} w-[26.5%] max-w-[108px] aspect-square`}
              >
                <span className="relative flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-full bg-white border border-line px-1 text-center shadow-[0_10px_24px_-12px_rgba(18,88,222,0.35)]">
                  <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-clarvo-blue" aria-hidden={true} />
                  <span className="text-[13px] leading-[1.15] font-semibold text-ink">{b.label}</span>
                </span>
                {/* thought tail */}
                <span
                  aria-hidden="true"
                  className="absolute w-2.5 h-2.5 rounded-full bg-white border border-line"
                  style={{ left: dir === 1 ? '72%' : '14%', bottom: -10 }}
                />
                <span
                  aria-hidden="true"
                  className="absolute w-1.5 h-1.5 rounded-full bg-white border border-line"
                  style={{ left: dir === 1 ? '86%' : '2%', bottom: -20 }}
                />
              </m.li>
            );
          })}
        </ul>

        <QuestionMark />
      </div>

      {/* The image defines the card height and sits flush on the bottom edge. */}
      <m.div variants={rise} className="relative z-0 pt-[232px] sm:pt-[285px] leading-none">
        <Image
          src={content.before.src}
          alt={content.before.alt}
          width={1200}
          height={550}
          sizes="(min-width: 1024px) 552px, (min-width: 640px) 560px, 92vw"
          className="block w-full h-auto select-none"
        />
      </m.div>
    </m.div>
  );
}

function QuestionMark() {
  return (
    <m.div
      aria-hidden="true"
      data-reveal=""
      className="absolute left-[47%] -translate-x-1/2 bottom-[8px] sm:bottom-[22px] z-10"
      style={{ originX: 0.5, originY: 1 }}
      variants={{
        hidden: { opacity: 0, scale: 0.5, rotate: 0 },
        shown: {
          opacity: 1,
          scale: 1,
          rotate: [0, -12, 9, -4, 0],
          transition: { duration: 0.8, delay: 0.9, ease: EASE_OUT },
        },
      }}
    >
      <svg viewBox="0 0 56 64" className="w-10 h-[46px] sm:w-12 sm:h-14 overflow-visible">
        <text x="28" y="54" textAnchor="middle" fontSize="60" fontWeight="800" fill="#171822" fontFamily="inherit">
          ?
        </text>
        <path d="M46 14 L52 9 M49 26 L56 25 M10 14 L4 9" stroke="#1258DE" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    </m.div>
  );
}

/* ─────────────────────────── After: the roadmap and plan ─────────────────────────── */

// Milestones on a 300x80 canvas, one per column of the 4-column label row.
const PATH_D = 'M37.5 62 C 70 62 80 46 112.5 46 C 145 46 155 34 187.5 34 C 220 34 230 16 262.5 16';
const DOTS: Array<[number, number]> = [
  [37.5, 62],
  [112.5, 46],
  [187.5, 34],
];

const drop: Variants = {
  hidden: { opacity: 0, y: -14, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { ...(springUi as object), delay: 0.25 } },
};

function AfterCard() {
  const { roadmap, after, afterLabel } = content;
  return (
    <m.div
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      className="relative overflow-hidden h-full rounded-[28px] bg-sky/60 border border-[#C8D8FF]"
    >
      <div className="absolute left-0 top-0 z-20 px-5 pt-5 sm:px-6 sm:pt-6">
        <Pill tone="brand">{afterLabel}</Pill>
      </div>

      {/* Roadmap floats above the family; the image below defines the card height. */}
      <div className="absolute inset-x-3 sm:inset-x-6 top-[66px] sm:top-[74px] z-10">
        <m.div
          data-reveal=""
          variants={drop}
          className="rounded-[14px] bg-white border border-line shadow-clarvo-elevated p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 text-[14px] font-bold text-ink">
            <MapPin className="w-4 h-4 text-clarvo-blue shrink-0" aria-hidden={true} />
            {roadmap.title}
          </div>

          <div className="relative mt-2 aspect-[300/80]">
            <svg viewBox="0 0 300 80" className="absolute inset-0 w-full h-full overflow-visible" role="img" aria-label="A path through four milestones ending at a flag">
              {/* mountain + flag */}
              <path d="M244 44 L262.5 18 L281 44 Z" fill="#E6EDFF" stroke="#1258DE" strokeWidth={1.5} strokeLinejoin="round" />
              {/* dashed track */}
              <path d={PATH_D} fill="none" stroke="#C8D8FF" strokeWidth={3} strokeDasharray="6 6" strokeLinecap="round" />
              {/* drawn progress */}
              <m.path
                data-reveal-path=""
                d={PATH_D}
                fill="none"
                stroke="#1258DE"
                strokeWidth={3}
                strokeLinecap="round"
                variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1, transition: { duration: 1.1, delay: 0.7, ease: EASE_OUT } } }}
              />
              {DOTS.map(([cx, cy], i) => (
                <m.circle
                  key={i}
                  data-reveal-path=""
                  cx={cx}
                  cy={cy}
                  r={6}
                  stroke="#1258DE"
                  strokeWidth={2.5}
                  variants={{
                    hidden: { fill: '#FFFFFF' },
                    shown: { fill: '#1258DE', transition: { duration: 0.2, delay: 0.7 + i * 0.36 } },
                  }}
                />
              ))}
              <m.g
                data-reveal=""
                style={{ originX: 0.5, originY: 1 }}
                variants={{
                  hidden: { opacity: 0, scale: 0.2 },
                  shown: { opacity: 1, scale: 1, transition: { ...(springUi as object), delay: 1.8 } },
                }}
              >
                <path d="M262.5 18 L262.5 3" stroke="#171822" strokeWidth={2} strokeLinecap="round" />
                <path d="M262.5 3 L275 7.5 L262.5 12 Z" fill="#1258DE" />
              </m.g>
            </svg>
          </div>

          <ul className="grid grid-cols-4 list-none p-0 m-0 text-center">
            {roadmap.steps.map((s) => (
              <li key={s} className="text-[13px] font-semibold text-muted">
                {s}
              </li>
            ))}
          </ul>
        </m.div>
      </div>

      <m.div variants={rise} className="relative z-0 pt-[232px] sm:pt-[285px] leading-none">
        <Image
          src={after.src}
          alt={after.alt}
          width={1200}
          height={550}
          sizes="(min-width: 1024px) 552px, (min-width: 640px) 560px, 92vw"
          className="block w-full h-auto select-none"
        />
      </m.div>
    </m.div>
  );
}
