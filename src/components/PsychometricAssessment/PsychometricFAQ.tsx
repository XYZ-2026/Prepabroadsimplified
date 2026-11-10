'use client';

import React, { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Plus } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import Reveal from './motion/Reveal';
import { EASE_OUT } from './motion/tokens';

const content = PSYCHOMETRIC_CONTENT.faq;

/** FAQ (spec 5.9). Height animates 0.25s; copy shared with the FAQPage JSON-LD. */
export default function PsychometricFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" aria-label="Frequently Asked Questions about CLARVO Psychometric Assessment" className="w-full bg-white border-b border-line">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <Reveal as="h2" className="font-dmsans font-bold text-ink tracking-tight text-[clamp(1.875rem,6vw,3rem)] leading-[1.1] m-0 mb-8 sm:mb-10">
          {content.sectionHeadline}
        </Reveal>

        <ul className="list-none p-0 m-0 border-t border-line">
          {content.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.question} className="border-b border-line">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full min-h-[64px] py-4 flex items-center justify-between gap-4 text-left bg-transparent border-0 cursor-pointer text-[17px] sm:text-[19px] font-bold text-ink"
                  >
                    {item.question}
                    <m.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                      className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-clarvo-blue text-white' : 'bg-sky text-clarvo-blue'
                      }`}
                      aria-hidden="true"
                    >
                      <Plus className="w-4 h-4" />
                    </m.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="text-[16px] sm:text-[17px] text-muted leading-relaxed m-0 pb-5 pr-12">{item.answer}</p>
                    </m.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
