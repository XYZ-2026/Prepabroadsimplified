import React from 'react';
import Image from 'next/image';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import Reveal from './motion/Reveal';

const content = PSYCHOMETRIC_CONTENT.familyTrust;

/** Family trust (spec 5.8). Calm by design: `enter` motion only. */
export default function ParentReassurance() {
  return (
    <section aria-label="Built for families" className="w-full bg-paper border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        <Reveal className="lg:col-span-5 relative overflow-hidden rounded-[20px] aspect-[16/10] lg:aspect-[4/5] bg-sky">
          <Image src={content.photo.src} alt={content.photo.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" style={{ objectPosition: '50% 40%' }} />
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal as="h2" className="font-dmsans font-bold text-ink tracking-tight text-[clamp(1.875rem,6vw,3rem)] leading-[1.1] m-0 mb-8">
            {content.sectionHeadline}
          </Reveal>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 list-none p-0 m-0">
            {content.principles.map((p, i) => (
              <Reveal as="li" key={p.title} index={i} className="border-t-2 border-clarvo-blue pt-4">
                <h3 className="text-[19px] font-bold text-ink m-0">{p.title}</h3>
                <p className="text-[16px] text-muted leading-snug mt-1 mb-0">{p.line}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
