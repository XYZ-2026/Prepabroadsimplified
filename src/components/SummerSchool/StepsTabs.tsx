'use client';

import React, { useRef, useState } from 'react';
import { Container } from '@/components/landing/redesign/primitives';
import { STEPS } from '@/content/summerSchoolContent';
import { Underlined } from './motion';
import { CARD_TITLE, Heading, SECTION } from './ui';

export default function StepsTabs() {
  const [{ active, dir }, setState] = useState({ active: 0, dir: 1 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = STEPS[active];

  const select = (next: number) => setState({ active: next, dir: next >= active ? 1 : -1 });

  const onKeyDown = (e: React.KeyboardEvent) => {
    const move = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!move) return;
    const next = (active + move + STEPS.length) % STEPS.length;
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <section aria-label="How it works" className="bg-paper">
      <Container className={SECTION}>
        <Heading center>
          From first idea to finished work in <Underlined>4 steps</Underlined>
        </Heading>
        <div role="tablist" aria-label="Steps" onKeyDown={onKeyDown} className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {STEPS.map((s, i) => (
            <button
              key={s.tab}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`ss-tab-${i}`}
              aria-selected={i === active}
              aria-controls="ss-step-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              className={`min-h-14 px-3 py-2 rounded-2xl border text-[16px] font-bold cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clarvo-blue,#1258DE)] ${
                i === active ? 'bg-clarvo-blue border-clarvo-blue text-white' : 'bg-white border-line text-ink hover:border-clarvo-blue'
              }`}
            >
              {i + 1}. {s.tab}
            </button>
          ))}
        </div>
        <div aria-hidden="true" className="mt-4 h-1 rounded-full bg-line overflow-hidden">
          <div className="h-full bg-clarvo-blue origin-left transition-transform duration-300 ease-out motion-reduce:transition-none" style={{ transform: `scaleX(${(active + 1) / STEPS.length})` }} />
        </div>

        <div role="tabpanel" id="ss-step-panel" aria-labelledby={`ss-tab-${active}`} tabIndex={0} className="mt-12 max-w-3xl mx-auto min-h-[24rem] sm:min-h-[21rem]">
          <div
            key={active}
            className="ss-panel-in relative rounded-panel bg-white border border-line p-6 pt-10 sm:p-10 text-[16px] sm:text-[17px] leading-relaxed text-ink"
            style={{ '--dir': dir } as React.CSSProperties}
          >
            <span aria-hidden="true" className="absolute right-6 sm:right-10 -top-8 w-16 h-16 rounded-2xl bg-clarvo-blue text-white flex items-center justify-center">
              <step.Icon className="w-8 h-8" />
            </span>
            <h3 className={`${CARD_TITLE} text-ink`}>{step.title}</h3>
            <p className="m-0 mt-3">{step.body}</p>
            <ul className="my-4 pl-5 list-disc marker:text-clarvo-blue">
              {step.points.map((point) => (
                <li key={point} className="mt-1.5">{point}</li>
              ))}
            </ul>
            <p className="m-0 font-bold">{step.end}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
