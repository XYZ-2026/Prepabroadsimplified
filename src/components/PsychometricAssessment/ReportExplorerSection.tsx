'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import { usePointerFine } from '@/hooks/usePointerFine';
import Reveal from './motion/Reveal';
import { EASE_OUT, flipTransition } from './motion/tokens';

const content = PSYCHOMETRIC_CONTENT.whatFamilyReceives;
const items = content.items;

/**
 * What you receive (spec 5.5). Signature motion: the report's cover hinges
 * open once it is in view, revealing real pages from the Grade 10 sample.
 * Choosing a report part cross-fades the page. Pointer tilt on fine pointers only.
 */
export default function ReportExplorerSection() {
  const [active, setActive] = useState(0);

  return (
    <section aria-label="What the Family Receives — Report Explorer" className="w-full bg-white border-b border-line" style={{ overflowX: 'clip' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <Reveal as="h2" className="font-dmsans font-bold text-ink tracking-tight text-[clamp(1.875rem,6vw,3rem)] leading-[1.1] m-0 mb-10 lg:mb-14">
          {content.sectionHeadline}
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <ReportBook active={active} />
          </div>

          {/* Desktop list */}
          <ul className="hidden lg:block lg:col-span-6 list-none p-0 m-0 space-y-1.5" aria-label="Report sections">
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`w-full text-left rounded-[14px] border px-5 py-4 cursor-pointer transition-colors duration-200 ${
                      isActive ? 'bg-sky border-clarvo-blue/40' : 'bg-transparent border-transparent hover:bg-paper'
                    }`}
                  >
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="text-[19px] font-bold text-ink">{item.title}</span>
                      <span className="text-[13px] font-semibold text-muted shrink-0">
                        {content.pageLabel} {item.page}
                      </span>
                    </span>
                    <span className="block text-[16px] text-muted mt-0.5">{item.line}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile / tablet swipe row */}
          <ul className="flex lg:hidden psy-swipe list-none m-0 py-1" aria-label="Report sections">
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.id} className="w-[72%] sm:w-[40%] max-w-[300px]">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`w-full h-full text-left rounded-[14px] border p-4 cursor-pointer transition-colors ${
                      isActive ? 'bg-sky border-clarvo-blue/40' : 'bg-paper border-line'
                    }`}
                  >
                    <span className="block text-[13px] font-semibold text-muted mb-1">
                      {content.pageLabel} {item.page}
                    </span>
                    <span className="block text-[17px] font-bold text-ink">{item.title}</span>
                    <span className="block text-[15px] text-muted mt-1 leading-snug">{item.line}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="text-[13px] text-muted mt-6 lg:mt-10 mb-0 text-center lg:text-left">{content.sampleLabel}</p>
      </div>
    </section>
  );
}

function ReportBook({ active }: { active: number }) {
  const bookRef = useRef<HTMLDivElement>(null);
  const open = useInView(bookRef, { once: true, amount: 0.5 });
  const isFine = usePointerFine();
  const reduced = useReducedMotion();
  const tiltOn = isFine && !reduced;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltOn) return;
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(((r.height / 2 - (e.clientY - r.top)) / (r.height / 2)) * 6);
    ry.set((((e.clientX - r.left) - r.width / 2) / (r.width / 2)) * 6);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const item = items[active];

  return (
    // The cover opens almost flat to the left, so reserve one page-width of room there: an open two-page spread.
    <div
      ref={bookRef}
      className="relative pl-[min(44vw,240px)] lg:pl-[min(22vw,290px)]"
      style={{ perspective: 2600 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <m.div className="psy-3d relative w-[min(44vw,240px)] lg:w-[min(22vw,290px)] aspect-[784/1158]" style={{ rotateX, rotateY }}>
        {/* Page edges for thickness */}
        <div className="absolute inset-0 translate-x-[6px] translate-y-[6px] rounded-[10px] bg-line" aria-hidden="true" />
        <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-[10px] bg-paper border border-line" aria-hidden="true" />

        {/* Current page */}
        <div className="absolute inset-0 rounded-[10px] overflow-hidden bg-white border border-line shadow-clarvo-elevated">
          <AnimatePresence initial={false}>
            <m.div
              key={item.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
            >
              <Image
                src={item.image}
                alt={`Sample report page ${item.page}: ${item.title}`}
                fill
                sizes="(min-width: 1024px) 290px, 44vw"
                className="object-cover object-top"
              />
            </m.div>
          </AnimatePresence>
          <span className="absolute right-2.5 bottom-2.5 px-2.5 py-1 rounded-full bg-midnight/85 text-[13px] font-semibold text-white">
            {content.pageLabel} {item.page}
          </span>
        </div>

        {/* Cover: hinges open on its left edge */}
        <m.div
          className="psy-3d absolute inset-0 origin-left z-10"
          initial={false}
          animate={{ rotateY: open ? -162 : 0 }}
          transition={{ ...flipTransition, duration: 1, delay: 0.15 }}
          aria-hidden={open}
        >
          <div className="psy-backface absolute inset-0 rounded-[10px] overflow-hidden shadow-xl">
            <Image src={content.coverImage} alt={content.coverAlt} fill sizes="(min-width: 1024px) 290px, 44vw" className="object-cover" />
          </div>
          {/* Inside of the cover */}
          <div
            className="psy-backface absolute inset-0 rounded-[10px] border border-line"
            style={{ transform: 'rotateY(180deg)', background: 'linear-gradient(160deg, #FFFFFF 0%, #E6EDFF 100%)' }}
          />
        </m.div>
      </m.div>
    </div>
  );
}
