import React from 'react';
import Reveal from '@/components/PsychometricAssessment/motion/Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  headline: string;
  subcopy?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/** Eyebrow + headline + optional sub, shared by every /research section. */
export default function SectionHeading({ eyebrow, headline, subcopy, align = 'left', tone = 'light', className = '' }: SectionHeadingProps) {
  const center = align === 'center';
  const dark = tone === 'dark';
  return (
    <div className={`${center ? 'text-center mx-auto' : ''} max-w-3xl ${className}`}>
      <Reveal as="p" className={`text-[13px] font-bold uppercase tracking-[0.12em] m-0 mb-3 ${dark ? 'text-[#8FB1FF]' : 'text-clarvo-blue'}`}>
        {eyebrow}
      </Reveal>
      <Reveal
        as="h2"
        index={1}
        className={`font-dmsans font-bold tracking-tight text-[clamp(1.875rem,5.5vw,2.9rem)] leading-[1.1] m-0 ${dark ? 'text-white' : 'text-ink'}`}
      >
        {headline}
      </Reveal>
      {subcopy && (
        <Reveal
          as="p"
          index={2}
          className={`text-[17px] sm:text-[18px] leading-relaxed mt-4 mb-0 ${center ? 'mx-auto' : ''} max-w-[60ch] ${dark ? 'text-white/70' : 'text-muted'}`}
        >
          {subcopy}
        </Reveal>
      )}
    </div>
  );
}
