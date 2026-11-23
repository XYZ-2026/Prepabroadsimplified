import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/landing/redesign/primitives';
import { HERO } from '@/content/summerSchoolContent';
import { CtaLink } from './ui';

const CENTRE_Y = 57; // keep in step with .ss-orbit-card `top`
const SAMPLES = 36;

/** A point on the tilted orbit, in % of the stage width from its centre. depth: -1 behind, 1 in front. Depth becomes translateZ, so the graphics chip sorts front and back. */
function orbitPoint(angle: number) {
  const x = 35 * Math.cos(angle);
  return { x, y: 21 * Math.sin(angle) - 0.16 * x, depth: Math.sin(angle) };
}

const KEYFRAMES = Array.from({ length: SAMPLES + 1 }, (_, i) => {
  const { x, y, depth } = orbitPoint((i / SAMPLES) * 2 * Math.PI);
  const at = ((i / SAMPLES) * 100).toFixed(2);
  return `${at}%{transform:translate(-50%,-50%) translate3d(${x.toFixed(2)}cqw,${y.toFixed(2)}cqw,${(60 * depth).toFixed(1)}px) scale(${(0.88 + 0.14 * depth).toFixed(3)})}`;
}).join('');

/** Half of the orbit line: the front half is drawn over the student, the back half behind. */
const halfOrbit = (start: number) =>
  Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const { x, y } = orbitPoint(start + (i / SAMPLES) * Math.PI);
    return `${(50 + x).toFixed(2)},${(CENTRE_Y + y).toFixed(2)}`;
  }).join(' ');

function OrbitLine({ start, z }: { start: number; z: number }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `translateZ(${z}px)` }}>
      <polyline points={halfOrbit(start)} fill="none" stroke="var(--ss-light)" strokeOpacity="0.6" strokeWidth="0.35" strokeDasharray="1 1" />
    </svg>
  );
}

/** Student with the things they make circling like a moon: in front, then behind. */
function StudentOrbit() {
  return (
    <div className="ss-orbit w-full max-w-[620px] mx-auto">
      <div className="ss-stage relative aspect-square">
        <style>{`@keyframes ss-orbit{${KEYFRAMES}}`}</style>
        <div aria-hidden="true" className="absolute inset-[8%] rounded-full bg-clarvo-blue [transform:translateZ(-80px)]" />
        <div aria-hidden="true" className="absolute inset-[2%] rounded-full border border-white/15 [transform:translateZ(-80px)]" />
        <OrbitLine start={Math.PI} z={-70} />
        <Image src={HERO.photo.src} alt={HERO.photo.alt} fill preload fetchPriority="high" sizes="(min-width: 1024px) 340px, 50vw" className="object-contain object-bottom [transform:translateZ(0)]" />
        <OrbitLine start={0} z={1} />
        <ul aria-label="What students make" className="ss-stage absolute inset-0 pointer-events-none list-none p-0 m-0">
          {HERO.orbit.map(({ label, Icon }, i) => (
            <li
              key={label}
              className="ss-orbit-card pointer-events-auto rounded-card bg-white text-ink shadow-clarvo-elevated"
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className="w-8 h-8 shrink-0 rounded-lg bg-sky text-clarvo-blue flex items-center justify-center">
                <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
              </span>
              <span className="text-[12px] font-bold leading-tight">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SummerSchoolHero() {
  return (
    <section aria-label="Summer School and Certifications" className="bg-[var(--ss-navy)] text-white overflow-hidden">
      <Container className="pt-8 lg:pt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-6 items-center">
        <div className="md:order-2 md:pb-10">
          <p className="psy-fade m-0 text-[16px] font-bold text-[var(--ss-light)]">{HERO.kicker}</p>
          <h1 className="m-0 mt-3 font-dmsans font-bold leading-[1.02] tracking-[-0.03em] text-[clamp(2.6rem,5.4vw,4.75rem)] text-white">
            <span className="psy-line"><span>{HERO.title[0]}</span></span>{' '}
            <span className="psy-line"><span className="text-[var(--ss-light)]">{HERO.title[1]}</span></span>
          </h1>
          <p className="psy-fade mt-5 mb-7 max-w-[46ch] text-[17px] sm:text-[19px] leading-relaxed text-white/80">{HERO.copy}</p>
          <div className="psy-fade flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
            <CtaLink href="#start" light data-hero-cta="">{HERO.cta}</CtaLink>
            <CtaLink href="#programmes" outline>{HERO.secondary}</CtaLink>
          </div>
        </div>
        <StudentOrbit />
      </Container>
    </section>
  );
}
