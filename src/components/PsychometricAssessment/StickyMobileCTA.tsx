'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, m } from 'motion/react';
import { CalendarDays } from 'lucide-react';
import { PSYCHOMETRIC_CONTENT, bookCallHref } from '@/content/psychometricContent';
import { springUi } from './motion/tokens';

const bar = PSYCHOMETRIC_CONTENT.stickyBar;

/**
 * Sticky mobile CTA (spec 5.11). Shows on touch or narrow screens once the
 * hero CTAs leave the viewport; hides once the final CTA is reached.
 * Visibility comes from IntersectionObserver, never from scroll offsets.
 */
export default function StickyMobileCTA() {
  const [eligible, setEligible] = useState(false);
  const [heroOut, setHeroOut] = useState(false);
  const [finalIn, setFinalIn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setEligible(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!eligible) return;
    // The hero renders a desktop and a mobile copy of its CTAs; watch the visible one.
    const heroCta = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-cta]')).find((el) => el.offsetParent !== null);
    const finalCta = document.getElementById('start');
    const observers: IntersectionObserver[] = [];
    if (heroCta) {
      const o = new IntersectionObserver(([e]) => setHeroOut(!e.isIntersecting && e.boundingClientRect.top < 0));
      o.observe(heroCta);
      observers.push(o);
    }
    if (finalCta) {
      // Hidden from the moment the final CTA enters until the end of the page, so the bar never covers the footer.
      const o = new IntersectionObserver(([e]) => setFinalIn(e.isIntersecting || e.boundingClientRect.top < 0), { threshold: 0.2 });
      o.observe(finalCta);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [eligible]);

  const visible = eligible && heroOut && !finalIn;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="sticky-cta"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={springUi}
          className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-0 border-t border-solid border-line px-4 pt-2.5"
          style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <Link
              href={bookCallHref('sticky-bar')}
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full text-[16px] font-bold text-white bg-clarvo-blue no-underline"
            >
              <CalendarDays className="w-[18px] h-[18px]" aria-hidden={true} />
              {PSYCHOMETRIC_CONTENT.bookCall.label}
            </Link>
            <a href={bar.secondary.href} className="h-12 px-4 inline-flex items-center text-[16px] font-bold text-clarvo-blue no-underline">
              {bar.secondary.label}
            </a>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
