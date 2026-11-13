import React from 'react';
import { RESEARCH_CONTENT } from '@/content/researchContent';

/** Thin band under the hero: the four facts that define every track. */
export default function FactStrip() {
  return (
    <div className="w-full bg-white border-b border-line">
      <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-5 sm:pt-16 lg:pt-5 flex flex-wrap justify-center gap-x-8 gap-y-2.5 list-none m-0">
        {RESEARCH_CONTENT.facts.map((f) => (
          <li key={f} className="flex items-center gap-2 text-[14px] font-semibold text-ink">
            <span className="w-1.5 h-1.5 rounded-full bg-clarvo-blue shrink-0" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
