'use client';

import React, { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Check } from 'lucide-react';
import { RESEARCH_CONTENT, type ProgramId } from '@/content/researchContent';
import { EASE_OUT, springUi } from '@/components/PsychometricAssessment/motion/tokens';
import Reveal from '@/components/PsychometricAssessment/motion/Reveal';
import SectionHeading from './SectionHeading';

const content = RESEARCH_CONTENT.compare;
const programs = RESEARCH_CONTENT.programs.items;

function Cell({ v }: { v: string | boolean }) {
  if (v === true) {
    return (
      <span className="inline-flex w-6 h-6 rounded-full bg-sky items-center justify-center">
        <Check className="w-3.5 h-3.5 text-clarvo-blue" strokeWidth={3} aria-label="Included" />
      </span>
    );
  }
  if (v === false) return <span className="text-muted" aria-label="Not included">–</span>;
  return <>{v}</>;
}

/**
 * Side-by-side comparison. Desktop: a full table with the featured column tinted.
 * Mobile: a segmented switch that shows one track at a time, so nothing scrolls sideways.
 */
export default function CompareSection() {
  const [active, setActive] = useState<ProgramId>('mentorship');

  return (
    <section id="compare" aria-label="Compare research programs" className="w-full bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <SectionHeading eyebrow={content.eyebrow} headline={content.headline} />

        {/* Desktop table */}
        <Reveal index={2} className="hidden md:block mt-12 rounded-[20px] bg-white border border-line overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="w-[26%] px-6 py-5 text-[13px] font-semibold text-muted">
                  <span className="sr-only">Feature</span>
                </th>
                {programs.map((p) => (
                  <th
                    key={p.id}
                    scope="col"
                    className={`px-6 py-5 text-[15px] font-bold ${p.featured ? 'bg-clarvo-blue text-white' : 'text-ink'}`}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.rows.map((row) => (
                <tr key={row.label} className="group">
                  <th scope="row" className="px-6 py-4 text-[15px] font-semibold text-ink border-0 border-t border-solid border-line group-hover:bg-paper transition-colors">
                    {row.label}
                  </th>
                  {programs.map((p) => (
                    <td
                      key={p.id}
                      className={`px-6 py-4 text-[15px] text-ink/80 border-0 border-t border-solid border-line transition-colors ${
                        p.featured ? 'bg-sky/40 group-hover:bg-sky/70' : 'group-hover:bg-paper'
                      }`}
                    >
                      <Cell v={row.values[p.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* Mobile switcher */}
        <div className="md:hidden mt-8">
          <div role="tablist" aria-label="Choose a track" className="relative grid grid-cols-3 p-1 rounded-full bg-white border border-line">
            {programs.map((p) => {
              const on = active === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="compare-panel"
                  onClick={() => setActive(p.id)}
                  className={`relative z-10 h-10 rounded-full bg-transparent border-0 text-[13.5px] font-bold cursor-pointer transition-colors ${on ? 'text-white' : 'text-ink'}`}
                >
                  {on && (
                    <m.span layoutId="compare-pill" transition={springUi} className="absolute inset-0 -z-10 rounded-full bg-clarvo-blue" aria-hidden="true" />
                  )}
                  {p.shortName}
                </button>
              );
            })}
          </div>

          <div id="compare-panel" role="tabpanel" className="mt-4 rounded-[18px] bg-white border border-line overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <m.dl
                key={active}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="m-0"
              >
                {content.rows.map((row, i) => (
                  <div key={row.label} className={`flex items-start justify-between gap-4 px-5 py-3.5 ${i ? 'border-0 border-t border-solid border-line' : ''}`}>
                    <dt className="text-[14px] font-semibold text-muted">{row.label}</dt>
                    <dd className="m-0 text-[14.5px] font-semibold text-ink text-right max-w-[55%]">
                      <Cell v={row.values[active]} />
                    </dd>
                  </div>
                ))}
              </m.dl>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
