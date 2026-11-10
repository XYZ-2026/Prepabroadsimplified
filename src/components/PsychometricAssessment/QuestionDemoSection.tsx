'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Check } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import Reveal from './motion/Reveal';
import { EASE_OUT, springData, springUi } from './motion/tokens';

const content = PSYCHOMETRIC_CONTENT.sampleQuestions;

type TabId = 'personality' | 'reasoning' | 'study';
const TABS: Array<{ id: TabId; title: string }> = [
  { id: 'personality', title: content.personality.title },
  { id: 'reasoning', title: content.reasoning.title },
  { id: 'study', title: content.studyHabits.title },
];

// Sequence rotates 90° clockwise each step: up → right → down → left.
const SHAPES = {
  up: '24,6 42,38 6,38',
  right: '42,24 10,42 10,6',
  down: '24,42 6,10 42,10',
  left: '6,24 38,6 38,42',
};
const REASONING_OPTIONS: Array<{ id: string; points: string }> = [
  { id: 'A', points: SHAPES.up },
  { id: 'B', points: SHAPES.right },
  { id: 'C', points: SHAPES.left },
  { id: 'D', points: SHAPES.down },
];
const REASONING_CORRECT = 'C';

/**
 * Try a question (spec 5.4). Signature motion: the chosen option springs,
 * the live trait bar springs to its new value and an "Added to profile" tag
 * appears for 1.2s.
 */
export default function QuestionDemoSection() {
  const [tab, setTab] = useState<TabId>('personality');
  const [personality, setPersonality] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [study, setStudy] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const answered = () => setPulse((n) => n + 1);

  const bar = (() => {
    if (tab === 'personality') {
      return {
        trait: content.personality.trait,
        value: personality ? `${personality} of 5` : null,
        pct: personality ? personality * 20 : 0,
      };
    }
    if (tab === 'reasoning') {
      const correct = reasoning === REASONING_CORRECT;
      return {
        trait: content.reasoning.trait,
        value: reasoning ? (correct ? content.reasoning.correctLabel : content.reasoning.otherLabel) : null,
        pct: reasoning ? (correct ? 92 : 58) : 0,
      };
    }
    const opt = content.studyHabits.options.find((o) => o.id === study);
    return { trait: opt ? opt.trait : 'Learning style', value: opt ? `${opt.pct}%` : null, pct: opt ? opt.pct : 0 };
  })();

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section aria-label="What a Psychometric Question Looks Like" className="w-full bg-paper border-b border-line">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <Reveal className="mb-7 sm:mb-10">
          <h2 className="font-dmsans font-bold text-ink tracking-tight text-[clamp(1.875rem,6vw,3rem)] leading-[1.1] m-0">
            {content.sectionHeadline}
          </h2>
          <p className="text-[17px] sm:text-[18px] text-muted mt-3 mb-0">{content.sectionSubcopy}</p>
        </Reveal>

        {/* Segmented control */}
        <div role="tablist" aria-label="Sample question types" className="relative grid grid-cols-3 p-1 rounded-full bg-white border border-line mb-5 max-w-md">
          {TABS.map((t, i) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`q-tab-${t.id}`}
                aria-selected={isActive}
                aria-controls="q-panel"
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`relative h-11 rounded-full border-0 bg-transparent cursor-pointer text-[14px] sm:text-[15px] font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {isActive && (
                  <m.span layoutId="q-tab-pill" className="absolute inset-0 rounded-full bg-clarvo-blue" transition={springUi} />
                )}
                <span className="relative">{t.title}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Question card */}
          <div
            role="tabpanel"
            id="q-panel"
            aria-labelledby={`q-tab-${tab}`}
            className="lg:col-span-8 rounded-[28px] bg-white border border-line p-5 sm:p-8 min-h-[300px]"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-sky text-[13px] font-semibold text-clarvo-blue mb-4">
              {content.notice}
            </span>

            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              >
                {tab === 'personality' && (
                  <fieldset className="border-0 p-0 m-0">
                    <legend className="text-[20px] sm:text-[24px] font-bold text-ink leading-snug mb-5 p-0">
                      “{content.personality.prompt}”
                    </legend>
                    <div className="grid grid-cols-5 gap-2">
                      {content.personality.scaleLabels.map((label, i) => {
                        const value = i + 1;
                        const selected = personality === value;
                        return (
                          <m.button
                            key={label}
                            type="button"
                            aria-label={label}
                            aria-pressed={selected}
                            onClick={() => {
                              setPersonality(value);
                              answered();
                            }}
                            whileTap={{ scale: 0.94 }}
                            animate={{ scale: selected ? 1.06 : 1 }}
                            transition={springUi}
                            className={`h-14 sm:h-16 rounded-[14px] border text-[18px] font-bold cursor-pointer transition-colors ${
                              selected ? 'bg-clarvo-blue border-clarvo-blue text-white' : 'bg-paper border-line text-ink hover:border-clarvo-blue/50'
                            }`}
                          >
                            {value}
                          </m.button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[13px] text-muted mt-2">
                      <span>{content.personality.scaleEnds[0]}</span>
                      <span>{content.personality.scaleEnds[1]}</span>
                    </div>
                  </fieldset>
                )}

                {tab === 'reasoning' && (
                  <fieldset className="border-0 p-0 m-0">
                    <legend className="text-[20px] sm:text-[24px] font-bold text-ink leading-snug mb-5 p-0">
                      {content.reasoning.prompt}
                    </legend>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5" aria-label="Pattern: triangle pointing up, right, down, then unknown">
                      {[SHAPES.up, SHAPES.right, SHAPES.down].map((pts, i) => (
                        <Tile key={i} points={pts} />
                      ))}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] border-2 border-dashed border-clarvo-blue bg-sky flex items-center justify-center text-[22px] font-bold text-clarvo-blue">
                        ?
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {REASONING_OPTIONS.map((opt) => {
                        const selected = reasoning === opt.id;
                        return (
                          <m.button
                            key={opt.id}
                            type="button"
                            aria-label={`Option ${opt.id}`}
                            aria-pressed={selected}
                            onClick={() => {
                              setReasoning(opt.id);
                              answered();
                            }}
                            whileTap={{ scale: 0.94 }}
                            animate={{ scale: selected ? 1.06 : 1 }}
                            transition={springUi}
                            className={`h-20 rounded-[14px] border flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                              selected ? 'bg-clarvo-blue border-clarvo-blue text-white' : 'bg-paper border-line text-ink hover:border-clarvo-blue/50'
                            }`}
                          >
                            <svg width="30" height="30" viewBox="0 0 48 48" aria-hidden="true">
                              <polygon points={opt.points} fill={selected ? '#FFFFFF' : '#1258DE'} />
                            </svg>
                            <span className="text-[13px] font-bold">{opt.id}</span>
                          </m.button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {tab === 'study' && (
                  <fieldset className="border-0 p-0 m-0">
                    <legend className="text-[20px] sm:text-[24px] font-bold text-ink leading-snug mb-5 p-0">
                      “{content.studyHabits.prompt}”
                    </legend>
                    <div className="space-y-2.5">
                      {content.studyHabits.options.map((opt) => {
                        const selected = study === opt.id;
                        return (
                          <m.button
                            key={opt.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => {
                              setStudy(opt.id);
                              answered();
                            }}
                            whileTap={{ scale: 0.98 }}
                            transition={springUi}
                            className={`w-full min-h-[56px] flex items-center gap-3 px-4 rounded-[14px] border text-left text-[16px] font-semibold cursor-pointer transition-colors ${
                              selected ? 'bg-sky border-clarvo-blue text-ink' : 'bg-paper border-line text-ink hover:border-clarvo-blue/50'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                                selected ? 'bg-clarvo-blue border-clarvo-blue text-white' : 'bg-white border-line'
                              }`}
                            >
                              {selected && <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" />}
                            </span>
                            {opt.label}
                          </m.button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}
              </m.div>
            </AnimatePresence>
          </div>

          {/* Live trait bar */}
          <LiveBar trait={bar.trait} value={bar.value} pct={bar.pct} pulse={pulse} />
        </div>
      </div>
    </section>
  );
}

function Tile({ points }: { points: string }) {
  return (
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] border border-line bg-white flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 48 48" aria-hidden="true">
        <polygon points={points} fill="#1258DE" />
      </svg>
    </div>
  );
}

function LiveBar({ trait, value, pct, pulse }: { trait: string; value: string | null; pct: number; pulse: number }) {
  const [showTag, setShowTag] = useState(false);

  useEffect(() => {
    if (pulse === 0) return;
    setShowTag(true);
    const t = setTimeout(() => setShowTag(false), 1200);
    return () => clearTimeout(t);
  }, [pulse]);

  return (
    <div className="lg:col-span-4 rounded-[28px] bg-white border border-line p-5 sm:p-6 flex flex-col justify-center" aria-live="polite">
      <div className="flex items-center justify-between gap-2 mb-2 min-h-[28px]">
        <span className="text-[13px] font-semibold text-muted">Live profile</span>
        <AnimatePresence>
          {showTag && (
            <m.span
              key={pulse}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="px-2.5 py-1 rounded-full bg-sky text-[13px] font-semibold text-clarvo-blue"
            >
              + {PSYCHOMETRIC_CONTENT.sampleQuestions.addedLabel}
            </m.span>
          )}
        </AnimatePresence>
      </div>
      <div className="text-[19px] font-bold text-ink mb-3">{trait}</div>
      <div className="h-3 rounded-full bg-sky overflow-hidden">
        <m.div
          className="h-full rounded-full bg-clarvo-blue origin-left"
          initial={false}
          animate={{ scaleX: pct / 100 }}
          transition={springData}
        />
      </div>
      <div className="text-[14px] font-semibold text-clarvo-blue mt-2 min-h-[20px]">{value ?? 'Pick an answer'}</div>
    </div>
  );
}
