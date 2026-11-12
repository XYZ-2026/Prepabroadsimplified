'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m, useInView, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT, type PhaseContent } from '@/content/psychometricContent';
import { useLenis } from '@/components/providers/SmoothScrollProvider';
import PhaseRadar from './PhaseRadar';
import Reveal from './motion/Reveal';
import { flipTransition, springUi } from './motion/tokens';

const content = PSYCHOMETRIC_CONTENT.phases;
const phases = content.items;
const axisLabels = phases.map((p) => p.axisLabel);

const DECK_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';

/** Deck mode only on wide, fine-pointer screens without reduced motion. */
function useDeckMode() {
  const reduced = useReducedMotion();
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(DECK_QUERY);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return matches && !reduced;
}

/**
 * Four phases (spec 5.3). Server render and touch/narrow/reduced-motion get a
 * native swipe row; wide fine-pointer screens get a sticky card deck.
 * The radar gains one filled axis per phase in both modes.
 */
export default function PhasesSection() {
  const deck = useDeckMode();

  return (
    <section aria-label="The Four Assessment Phases" className="w-full bg-midnight text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 lg:pt-24 pb-14 sm:pb-20 lg:pb-12">
        <Reveal className="mb-8 sm:mb-10">
          <h2 className="font-dmsans font-bold text-white tracking-tight text-[clamp(1.875rem,6vw,3rem)] leading-[1.1] m-0">
            {content.sectionHeadline}
          </h2>
          <p className="text-[13px] text-white/60 mt-3 mb-0">{content.grade10Notice}</p>
        </Reveal>

        {deck ? <PhaseDeck /> : <PhaseSwipeRow />}
      </div>
    </section>
  );
}

/* ─────────────────────────────── Shared card ─────────────────────────────── */

function PhaseCopy({ phase, compact = false }: { phase: PhaseContent; compact?: boolean }) {
  return (
    <div className={compact ? 'space-y-3.5' : 'space-y-5'}>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-clarvo-blue text-[13px] font-bold text-white">
          Phase {phase.number}
        </span>
        <span className="px-3 py-1 rounded-full bg-white/10 text-[13px] font-semibold text-white/80">
          {phase.modules}
        </span>
      </div>

      <h3 className={`font-dmsans font-bold text-white tracking-tight m-0 leading-tight ${compact ? 'text-[22px]' : 'text-[clamp(1.75rem,2.6vw,2.25rem)]'}`}>
        {phase.name}
      </h3>

      <p className={`m-0 text-white/85 leading-relaxed ${compact ? 'text-[16px]' : 'text-[18px]'}`}>
        <span className="sr-only">{content.lookingAtLabel}: </span>
        {phase.lookingAt}
      </p>

      <ul className="flex flex-wrap gap-2 list-none p-0 m-0" aria-label="Areas measured">
        {phase.chips.map((chip) => (
          <li key={chip} className="px-3 py-1 rounded-full border border-white/20 text-[13px] font-semibold text-sky">
            {chip}
          </li>
        ))}
      </ul>

      <div className="rounded-[14px] bg-white/[0.06] border border-white/10 p-3.5 sm:p-4">
        <div className="text-[13px] font-semibold text-sky/70 mb-1">{content.inReportLabel}</div>
        <p className="m-0 text-[15px] sm:text-[16px] text-white leading-snug">{phase.inReport}</p>
      </div>

      <details className="group text-[15px] text-white/80">
        <summary className="list-none cursor-pointer inline-flex items-center gap-1.5 font-semibold text-sky hover:text-white min-h-[44px] [&::-webkit-details-marker]:hidden">
          {content.disclosureLabel}
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <ul className="mt-1 mb-0 pl-5 space-y-1.5 marker:text-clarvo-blue">
          {phase.howMeasured.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function PhasePhoto({ phase, sizes, className = '' }: { phase: PhaseContent; sizes: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[20px] bg-[#22232F] ${className}`}>
      <Image src={phase.photo} alt={phase.photoAlt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/* ─────────────────────── Mobile / tablet / touch: swipe row ─────────────────────── */

function PhaseSwipeRow() {
  const rowRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollXProgress } = useScroll({ container: rowRef });

  useMotionValueEvent(scrollXProgress, 'change', (p) => {
    const idx = Math.max(0, Math.min(phases.length - 1, Math.round(p * (phases.length - 1))));
    setActive(idx);
  });

  const goTo = (i: number) => {
    const row = rowRef.current;
    const card = row?.children[i] as HTMLElement | undefined;
    if (!row || !card) return;
    row.scrollTo({ left: card.offsetLeft - row.offsetLeft - 16, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <PhaseRadar activeIndex={active} labels={axisLabels} size={88} showLabels={false} />
        <div aria-live="polite">
          <div className="text-[13px] text-white/60">Phase {active + 1} of 4</div>
          <div className="text-[17px] font-bold text-white">{phases[active].name}</div>
        </div>
      </div>

      <ul ref={rowRef} className="psy-swipe flex list-none m-0 py-1" aria-label="Assessment phases">
        {phases.map((phase) => (
          <li
            key={phase.id}
            id={`stacked-phase-${phase.number}`}
            className="w-[86%] sm:w-[62%] md:w-[48%] max-w-[440px] rounded-[20px] bg-white/[0.05] border border-white/10 p-3 pb-5"
          >
            <PhasePhoto phase={phase} sizes="(min-width: 768px) 48vw, 86vw" className="aspect-[16/10] mb-5" />
            <div className="px-2">
              <PhaseCopy phase={phase} compact />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-1 mt-5" role="tablist" aria-label="Choose a phase">
        {phases.map((phase, i) => (
          <button
            key={phase.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Phase ${phase.number}: ${phase.name}`}
            onClick={() => goTo(i)}
            className="w-11 h-11 flex items-center justify-center bg-transparent border-0 cursor-pointer"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-clarvo-blue' : 'w-2 bg-white/30'}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────── Desktop: sticky deck ──────────────────────────── */

function Marker({ index, onActive, markerRef }: { index: number; onActive: (i: number) => void; markerRef: (el: HTMLDivElement | null) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: '-50% 0px -50% 0px' });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  return (
    <div
      ref={(el) => {
        ref.current = el;
        markerRef(el);
      }}
      id={`phase-step-${index + 1}`}
      aria-hidden="true"
      style={{ height: '80svh' }}
    />
  );
}

const deckVariants = {
  enter: (dir: number) =>
    dir >= 0 ? { opacity: 0, y: 24, scale: 0.94, rotateX: 0 } : { opacity: 0, y: -40, scale: 1, rotateX: -12 },
  center: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
  exit: (dir: number) =>
    dir >= 0 ? { opacity: 0, y: -40, scale: 1, rotateX: -12 } : { opacity: 0, y: 24, scale: 0.94, rotateX: 0 },
};

function PhaseDeck() {
  const [[active, dir], setState] = useState<[number, number]>([0, 0]);
  const markers = useRef<(HTMLDivElement | null)[]>([]);
  const { lenis } = useLenis();

  const onActive = useCallback((i: number) => {
    setState(([prev]) => (prev === i ? [prev, 0] : [i, i > prev ? 1 : -1]));
  }, []);

  const goTo = (i: number) => {
    const el = markers.current[i];
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const phase = phases[active];
  const behind = phases.length - 1 - active;

  return (
    <div className="relative">
      <div className="sticky z-10" style={{ top: 'calc(70px + 24px)' }}>
        <div
          className="grid grid-cols-12 gap-8 xl:gap-12 items-stretch"
          style={{ height: 'min(620px, calc(100svh - 70px - 48px))' }}
        >
          {/* Rail */}
          <div className="col-span-4 flex flex-col justify-between py-2">
            <ol className="relative list-none p-0 m-0 space-y-1" aria-label="Assessment phases">
              <span className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-white/15 rounded-full" aria-hidden="true" />
              <m.span
                className="absolute left-[13px] top-4 w-[2px] bg-clarvo-blue rounded-full origin-top"
                style={{ height: 'calc(100% - 32px)' }}
                initial={false}
                animate={{ scaleY: active / (phases.length - 1) }}
                transition={springUi}
                aria-hidden="true"
              />
              {phases.map((p, i) => {
                const isActive = i === active;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={isActive ? 'step' : undefined}
                      className="relative w-full flex items-start gap-4 text-left bg-transparent border-0 p-0 py-2.5 cursor-pointer group"
                    >
                      <span
                        className={`relative z-10 mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center text-[13px] font-bold transition-colors duration-300 ${
                          i <= active ? 'bg-clarvo-blue border-clarvo-blue text-white' : 'bg-midnight border-white/30 text-white/60'
                        }`}
                      >
                        {p.number}
                      </span>
                      <span>
                        <span className="block text-[13px] text-white/55">{p.modules}</span>
                        <span
                          className={`block text-[17px] font-bold transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-white/55 group-hover:text-white/80'
                          }`}
                        >
                          {p.name}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <PhaseRadar activeIndex={active} labels={axisLabels} size={220} />
          </div>

          {/* Deck */}
          <div className="col-span-8 relative" style={{ perspective: 1200 }}>
            {/* Cards waiting behind the active one */}
            {[2, 1].map((depth) =>
              behind >= depth ? (
                <div
                  key={depth}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[28px] border border-white/10 bg-[#1D1E2A]"
                  style={{ transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.04})`, opacity: 1 - depth * 0.3 }}
                />
              ) : null,
            )}

            <AnimatePresence initial={false} custom={dir}>
              <m.article
                key={phase.id}
                custom={dir}
                variants={deckVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={flipTransition}
                className="psy-3d absolute inset-0 rounded-[28px] bg-[#1F2030] border border-white/10 shadow-2xl p-6 xl:p-8 grid grid-cols-12 gap-6 xl:gap-8 origin-bottom"
              >
                <m.div
                  className="col-span-5 h-full"
                  initial={{ scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <PhasePhoto phase={phase} sizes="30vw" className="h-full" />
                </m.div>
                <div className="col-span-7 self-center overflow-y-auto max-h-full pr-1">
                  <PhaseCopy phase={phase} />
                </div>
              </m.article>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Scroll markers: the sticky stage overlaps them; each sets the active phase at the viewport centre. */}
      <div className="relative" style={{ marginTop: 'calc(-1 * min(620px, calc(100svh - 70px - 48px)))' }}>
        {phases.map((p, i) => (
          <Marker
            key={p.id}
            index={i}
            onActive={onActive}
            markerRef={(el) => {
              markers.current[i] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}
