'use client';

import React, { useId, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { Plus } from 'lucide-react';
import { EASE_OUT } from './motion/tokens';

export interface FAQItem {
  question: string;
  answer: string;
}

/** Accordion list shared by the psychometric and research pages. One item open at a time; height animates 0.25s. */
export default function FAQList({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();

  return (
    <ul className="list-none p-0 m-0 border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const qId = `${uid}-q-${i}`;
        const aId = `${uid}-a-${i}`;
        return (
          <li key={item.question} className="border-b border-line">
            <h3 className="m-0">
              <button
                type="button"
                id={qId}
                aria-expanded={isOpen}
                aria-controls={aId}
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
                  id={aId}
                  role="region"
                  aria-labelledby={qId}
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
  );
}
