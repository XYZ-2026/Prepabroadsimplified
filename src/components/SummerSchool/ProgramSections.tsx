import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/landing/redesign/primitives';
import { ADVANTAGES, CTA, HERO, MENTORS, PROGRAMS, STAND_OUT, type Photo } from '@/content/summerSchoolContent';
import { CurvedArrow, JoinFrom, Underlined } from './motion';
import { CARD_TITLE, CtaLink, Heading, SECTION, SWIPE } from './ui';

function CoverPhoto({ photo, sizes, position = 'object-[center_25%]' }: { photo: Photo; sizes: string; position?: string }) {
  return <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className={`object-cover ${position}`} />;
}

/** Technology has a tall photo; the last card fills the tablet row. */
const CELL: Record<number, string> = { 1: 'lg:row-span-2', 4: 'sm:col-span-2 lg:col-span-1' };

export function ProgramsBento() {
  return (
    <section id="programmes" aria-label="Programmes" className="bg-paper scroll-mt-16">
      <Container className={SECTION}>
        <Heading sub="Each programme has a mentor, a clear plan and one finished piece of work.">
          Choose a programme. Finish with <Underlined>something real</Underlined>.
        </Heading>
        <ul aria-label="Programme list" tabIndex={0} className={`${SWIPE} sm:grid sm:grid-cols-2 lg:grid-cols-3`}>
          {PROGRAMS.map((p, i) => (
            <li key={p.title} className={`w-[84%] sm:w-auto flex flex-col rounded-photo overflow-hidden bg-white border border-line ${CELL[i] ?? ''}`}>
              <div className="p-5 sm:p-6">
                <h3 className={`${CARD_TITLE} text-ink`}>{p.title}</h3>
                <p className="m-0 mt-2 text-[16px] leading-relaxed text-muted">{p.body}</p>
                <p className="m-0 mt-4 text-[16px] text-ink">
                  You finish with: <strong className="text-clarvo-blue">{p.outcome}</strong>
                </p>
              </div>
              <div className="relative mt-auto grow min-h-56">
                <CoverPhoto photo={p.photo} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 84vw" position={i === 1 ? 'object-[center_62%]' : undefined} />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function StandOutFormula() {
  const box = 'flex flex-col items-center justify-center text-center min-h-36 sm:min-h-44 w-full sm:w-72 rounded-photo px-6';
  return (
    <section aria-label="What universities look for" className="bg-[var(--ss-navy)] text-white">
      <Container className={SECTION}>
        <Heading center dark>What are selective universities looking for?</Heading>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
          <JoinFrom side="left" className={`${box} border border-white/40`}>
            <p className="m-0 text-[26px] font-bold leading-tight">Strong academics</p>
            <p className="m-0 mt-2 text-[16px] text-white/80">Grades and test scores</p>
          </JoinFrom>
          <span className="text-[36px] font-bold leading-none" aria-label="plus">+</span>
          <JoinFrom side="right" className={`${box} bg-clarvo-blue`}>
            <p className="m-0 text-[26px] font-bold leading-tight">A stand-out factor</p>
            <p className="m-0 mt-2 text-[16px]">Work that shows who they are</p>
          </JoinFrom>
        </div>

        <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="order-2 lg:order-1 lg:col-span-9 rounded-panel bg-white text-ink p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold leading-snug">
              <p className="m-0 text-muted">
                {STAND_OUT.lead} <Underlined>{STAND_OUT.highlight}</Underlined>
              </p>
              <p className="m-0 mt-6">{STAND_OUT.close}</p>
            </div>
            <figure className="m-0">
              <div className="relative aspect-[3/2] rounded-card overflow-hidden">
                <CoverPhoto photo={STAND_OUT.photo} sizes="(min-width: 768px) 420px, 100vw" />
              </div>
              <figcaption className="mt-3 text-[16px] font-semibold">{STAND_OUT.caption}</figcaption>
            </figure>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-3">
            <div className="hidden lg:block mb-4">
              <CurvedArrow />
            </div>
            <p className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight">How a student can stand out</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Mentors() {
  return (
    <section aria-label="Mentors" className="bg-white">
      <Container className={SECTION}>
        <Heading sub="Each student works with the people who fit their programme.">
          Meet the <Underlined>mentors</Underlined> behind the work
        </Heading>
        <ul aria-label="Mentor types" tabIndex={0} className={`${SWIPE} sm:grid sm:grid-cols-3 sm:gap-6`}>
          {MENTORS.map((mentor) => (
            <li key={mentor.title} className="w-[84%] sm:w-auto">
              <div className="relative aspect-[4/3] rounded-photo overflow-hidden">
                <CoverPhoto photo={mentor.photo} sizes="(min-width: 640px) 33vw, 84vw" />
              </div>
              <h3 className={`${CARD_TITLE} text-ink mt-4`}>{mentor.title}</h3>
              <p className="m-0 mt-1 text-[16px] leading-relaxed text-muted">{mentor.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

const ADVANTAGE_COLOURS = ['bg-clarvo-blue text-white', 'bg-sky text-ink', 'bg-[var(--ss-navy)] text-white'];

export function Advantage() {
  return (
    <section aria-label="Why CLARVO" className="bg-white">
      <Container className="pb-16 sm:pb-20 lg:pb-24">
        <Heading center>The CLARVO advantage</Heading>
        <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-3 rounded-panel overflow-hidden">
          {ADVANTAGES.map((a, i) => (
            <li key={a.title} className={`${ADVANTAGE_COLOURS[i]} p-7 sm:p-9`}>
              <h3 className={`${CARD_TITLE} text-inherit`}>{a.title}</h3>
              <p className="m-0 mt-3 text-[16px] leading-relaxed">{a.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Blue panel with the group standing on its bottom edge, as on the home page. */
export function CtaBand() {
  return (
    <section aria-label="Get started" className="bg-paper">
      <Container className={SECTION}>
        <div className="rounded-panel bg-clarvo-blue text-white overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-end">
          <div className="lg:col-span-5 self-center p-7 sm:p-10 lg:pr-0">
            <h2 className="m-0 font-dmsans font-bold text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.08] tracking-[-0.02em] text-white">{CTA.title}</h2>
            <p className="mt-4 mb-7 text-[17px] leading-relaxed text-white/90">{CTA.body}</p>
            <CtaLink href="#start" light>{HERO.cta}</CtaLink>
          </div>
          <div className="relative lg:col-span-7 aspect-[1400/801] lg:mt-8">
            <Image src={CTA.photo.src} alt={CTA.photo.alt} fill sizes="(min-width: 1024px) 700px, 100vw" className="object-contain object-bottom" />
          </div>
        </div>
      </Container>
    </section>
  );
}
