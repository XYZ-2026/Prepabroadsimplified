'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PROGRAMS } from '@/content/summerSchoolContent';

const ARROW =
  'w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer hover:bg-white/20 disabled:opacity-40 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

/** What students finish with. Swipe, use the arrows or the keyboard; it never moves by itself. */
export default function OutcomeCarousel() {
  const row = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const go = (i: number) => {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    row.current?.scrollTo({ left: i * row.current.clientWidth, behavior: smooth ? 'smooth' : 'instant' });
  };

  return (
    <div className="max-w-md">
      <ul
        ref={row}
        tabIndex={0}
        aria-label="What students finish with"
        onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="list-none p-0 m-0 flex overflow-x-auto snap-x snap-mandatory rounded-photo bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [contain:paint] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {PROGRAMS.map((p) => (
          <li key={p.title} className="w-full shrink-0 snap-start p-4">
            <div className="relative aspect-[3/2] rounded-card overflow-hidden">
              <Image src={p.photo.src} alt="" fill sizes="(min-width: 640px) 420px, 90vw" className="object-cover object-[center_40%]" />
            </div>
            <p className="m-0 mt-4 text-[20px] font-bold text-clarvo-blue leading-snug">{p.outcome}</p>
            <p className="m-0 text-[16px] text-muted">from {p.title}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between">
        <button type="button" className={ARROW} aria-label="Previous" disabled={active === 0} onClick={() => go(active - 1)}>
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <p className="m-0 text-[16px] text-white/80" aria-live="polite">
          {active + 1} of {PROGRAMS.length}
        </p>
        <button type="button" className={ARROW} aria-label="Next" disabled={active === PROGRAMS.length - 1} onClick={() => go(active + 1)}>
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
