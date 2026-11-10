'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, m, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { BookOpen, Download } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import { usePointerFine } from '@/hooks/usePointerFine';
import Reveal from './motion/Reveal';
import { EASE_FLIP, EASE_OUT, springUi } from './motion/tokens';

const content = PSYCHOMETRIC_CONTENT.sampleReports;
const reports = content.items;

/**
 * Sample reports (spec 5.7). Signature motion: the cover flips on grade change;
 * text cross-fades. Pointer tilt on fine pointers only.
 */
export default function SampleReportGallery() {
  const [index, setIndex] = useState(1); // Grade 10 first: the flagship report
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const report = reports[index];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + reports.length) % reports.length;
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="sample-reports" aria-label="Psychometric Assessment Sample Reports" className="w-full bg-white border-b border-line scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <Reveal as="h2" className="font-dmsans font-bold text-ink tracking-tight text-[clamp(1.875rem,6vw,3rem)] leading-[1.1] m-0 mb-7 sm:mb-10">
          {content.sectionHeadline}
        </Reveal>

        <div role="tablist" aria-label="Choose a grade" className="grid grid-cols-3 p-1 rounded-full bg-paper border border-line mb-8 lg:mb-12 max-w-lg">
          {reports.map((r, i) => {
            const isActive = i === index;
            return (
              <button
                key={r.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`grade-tab-${r.id}`}
                aria-selected={isActive}
                aria-controls="grade-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setIndex(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={`relative h-11 rounded-full border-0 bg-transparent cursor-pointer text-[14px] sm:text-[15px] font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {isActive && <m.span layoutId="grade-pill" className="absolute inset-0 rounded-full bg-clarvo-blue" transition={springUi} />}
                <span className="relative">{r.gradeBadge}</span>
              </button>
            );
          })}
        </div>

        <div
          id="grade-panel"
          role="tabpanel"
          aria-labelledby={`grade-tab-${report.id}`}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center"
        >
          <div className="md:col-span-5 flex justify-center">
            <Cover src={report.coverImage} alt={`Cover of the ${report.gradeBadge} sample report`} id={report.id} />
          </div>

          <div className="md:col-span-7">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                <div className="text-[14px] font-semibold text-muted mb-1">
                  {report.gradeBadge} · {report.pages}
                </div>
                <h3 className="text-[clamp(1.5rem,3.4vw,2.25rem)] font-bold text-ink tracking-tight leading-tight m-0 mb-5">
                  {report.gradeTitle}
                </h3>
                <ul className="flex flex-wrap gap-2 list-none p-0 m-0 mb-7">
                  {report.highlights.map((h) => (
                    <li key={h} className="px-3.5 py-1.5 rounded-full bg-sky text-[14px] font-semibold text-clarvo-blue">
                      {h}
                    </li>
                  ))}
                </ul>

                {report.isAvailable ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={report.browserUrl}
                      className="inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-full text-[16px] font-bold text-white bg-clarvo-blue hover:bg-[#0F47B8] transition-colors no-underline"
                    >
                      <BookOpen className="w-4 h-4" aria-hidden="true" />
                      {content.viewLabel}
                    </Link>
                    <a
                      href={report.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-full text-[16px] font-bold text-ink bg-white hover:bg-sky border border-line transition-colors no-underline"
                    >
                      <Download className="w-4 h-4 text-clarvo-blue" aria-hidden="true" />
                      {content.downloadLabel}
                    </a>
                  </div>
                ) : (
                  <button type="button" disabled className="h-[52px] px-7 rounded-full text-[16px] font-bold text-muted bg-paper border border-line cursor-not-allowed">
                    {content.comingSoonLabel}
                  </button>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="text-[13px] text-muted mt-8 mb-0">{content.footerNote}</p>
      </div>
    </section>
  );
}

function Cover({ src, alt, id }: { src: string; alt: string; id: string }) {
  const isFine = usePointerFine();
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isFine || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    rx.set(((r.height / 2 - (e.clientY - r.top)) / (r.height / 2)) * 6);
    ry.set((((e.clientX - r.left) - r.width / 2) / (r.width / 2)) * 6);
  };

  return (
    <div
      style={{ perspective: 1400 }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <m.div className="psy-3d relative w-[min(62vw,280px)] lg:w-[320px] aspect-[784/1158]" style={{ rotateX, rotateY }}>
        <div className="absolute inset-0 translate-x-[5px] translate-y-[5px] rounded-[10px] bg-line" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={id}
            className="psy-backface absolute inset-0 rounded-[10px] overflow-hidden shadow-clarvo-elevated border border-line bg-white"
            initial={{ rotateY: -90, opacity: 0.6 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0.6 }}
            transition={{ duration: 0.3, ease: EASE_FLIP }}
          >
            <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 320px, 62vw" className="object-cover" />
          </m.div>
        </AnimatePresence>
      </m.div>
    </div>
  );
}
