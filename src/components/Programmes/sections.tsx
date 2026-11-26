import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/landing/redesign/primitives';
import { CARD_TITLE, CtaLink, Heading, SECTION, SWIPE } from '@/components/SummerSchool/ui';
import type { Photo } from '@/content/summerSchoolContent';
import { SINGLES, programmeUrl } from '@/content/programmeList';
import { ALL_PROGRAMMES, type Programme } from '@/content/programmesContent';
import { LitStatement, ScrollCamera } from './motion';

const NAVY = 'bg-[var(--ss-navy)] text-white';
const SHADE =
  'absolute inset-0 bg-[linear-gradient(0deg,#0b1d45_4%,rgba(11,29,69,0.78)_45%,rgba(11,29,69,0.25)_80%)] md:bg-[linear-gradient(90deg,#0b1d45_4%,rgba(11,29,69,0.7)_34%,transparent_72%),linear-gradient(0deg,#0b1d45_2%,rgba(11,29,69,0.74)_42%,transparent_74%)]';

interface HeroProps {
  kicker: { label: string; href: string };
  title: string;
  line: string;
  facts: { label: string; value: string }[];
  photo: Photo;
  cta: string;
  secondary: { label: string; href: string };
}

/** Opening shot: full-screen picture, one title, the facts families ask for. */
export function ProgrammeHero({ kicker, title, line, facts, photo, cta, secondary }: HeroProps) {
  return (
    <section aria-label={title} className={`relative isolate overflow-hidden flex items-end min-h-[calc(100svh-64px)] sm:min-h-[calc(100svh-70px)] ${NAVY}`}>
      <ScrollCamera>
        <div className="pg-camera absolute inset-x-0 top-0 h-[56svh] sm:h-full">
          <Image src={photo.src} alt={photo.alt} fill preload fetchPriority="high" sizes="(max-width: 639px) max(100vw, 84vh), max(100vw, 150vh)" className="object-cover" style={{ objectPosition: photo.focus }} />
        </div>
      </ScrollCamera>
      <div aria-hidden="true" className={`${SHADE} max-sm:bg-[linear-gradient(180deg,transparent_20svh,rgba(11,29,69,0.82)_40svh,#0b1d45_50svh)]`} />
      <div aria-hidden="true" className="pg-bar absolute inset-x-0 top-0 h-[12%] bg-ink origin-top" />
      <div aria-hidden="true" className="pg-bar absolute inset-x-0 bottom-0 h-[12%] bg-ink origin-bottom" />

      <Container className="relative pt-[40svh] sm:pt-40 pb-8 sm:pb-10">
        <Link href={kicker.href} className="inline-flex items-center min-h-11 text-[16px] font-bold text-white">
          {kicker.label}
        </Link>
        <h1 className="m-0 mt-1 max-w-[14ch] font-dmsans font-bold leading-none tracking-[-0.035em] text-[clamp(2.75rem,8vw,6.5rem)] text-white [text-wrap:balance]">
          <span className="psy-line"><span>{title}</span></span>
        </h1>
        <p className="m-0 mt-5 max-w-[42ch] text-[18px] sm:text-[21px] leading-[1.5] text-white">{line}</p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <CtaLink href="#start" light data-hero-cta="">{cta}</CtaLink>
          <CtaLink href={secondary.href} outline>{secondary.label}</CtaLink>
        </div>
        <dl className="m-0 mt-10 grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 border-0 border-t border-solid border-white/30 pt-5">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-[14px] text-white/80">{f.label}</dt>
              <dd className="m-0 mt-0.5 text-[16px] sm:text-[18px] font-bold leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export function Mission({ text }: { text: string }) {
  return (
    <section aria-label="The challenge" className={NAVY}>
      <Container className="py-24 sm:py-36 lg:py-48">
        <LitStatement text={text} />
      </Container>
    </section>
  );
}

const ACT_COLOURS = ['bg-clarvo-blue text-white', 'bg-white text-ink', NAVY, 'bg-sky text-ink'];

/** The weeks, parts or paths, as scenes that slide over each other. */
export function Acts({ title, acts }: { title: string; acts: Programme['acts'] }) {
  return (
    <section id="inside" aria-label={title} className="bg-paper scroll-mt-16">
      <Container className={`${SECTION} [&>div]:mb-0`}>
        <Heading>{title}</Heading>
      </Container>
      <ol className="list-none p-0 m-0">
        {acts.map((act, i) => (
          <li key={act.label} className={`pg-act relative overflow-hidden flex items-center ${ACT_COLOURS[i % ACT_COLOURS.length]}`}>
            <span aria-hidden="true" className="absolute right-[2vw] bottom-[-0.18em] font-bold leading-none text-[clamp(11rem,38vw,34rem)] opacity-[0.12] select-none">
              {i + 1}
            </span>
            <Container className="relative py-16 sm:py-20">
              <p className="m-0 text-[18px] font-bold">{act.label}</p>
              <h3 className="m-0 mt-2 max-w-[14ch] font-dmsans font-bold tracking-[-0.03em] leading-[1.04] text-[clamp(2.25rem,6vw,5rem)] text-inherit">{act.title}</h3>
              <ul className="list-none p-0 m-0 mt-8 max-w-2xl">
                {act.points.map((point) => (
                  <li key={point} className="py-3.5 border-0 border-t border-solid border-current/25 text-[18px] sm:text-[22px] leading-snug">
                    {point}
                  </li>
                ))}
              </ul>
            </Container>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Outcome({ programme: p }: { programme: Programme }) {
  return (
    <section aria-label="What you finish with" className="bg-white">
      <Container className={`${SECTION} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end`}>
        <div className="lg:col-span-7">
          <p className="m-0 text-[18px] text-muted">You finish with</p>
          <h2 className="m-0 mt-1 font-dmsans font-bold tracking-[-0.025em] leading-[1.06] text-[clamp(2.25rem,6vw,5rem)] text-clarvo-blue [text-wrap:balance]">{p.outcome}</h2>
        </div>
        <div className="lg:col-span-5">
          <h3 className={`${CARD_TITLE} text-ink`}>A good fit for</h3>
          <ul className="list-none p-0 m-0 mt-3">
            {p.suits.map((s) => (
              <li key={s} className="flex gap-3 py-2 text-[17px] leading-snug text-ink">
                <Check className="w-5 h-5 mt-0.5 shrink-0 text-clarvo-blue" strokeWidth={3} aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function Poster({ programme: p, wide }: { programme: Programme; wide: boolean }) {
  return (
    <Link
      href={programmeUrl(p.slug)}
      className={`pg-poster relative block aspect-[2/3] ${wide ? 'sm:aspect-[3/2]' : ''} rounded-photo overflow-hidden bg-[var(--ss-navy)] text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clarvo-blue,#1258DE)]`}
    >
      <Image src={p.photo.src} alt="" fill sizes={wide ? '(min-width: 640px) 620px, 140vw' : '(min-width: 1024px) 680px, (min-width: 640px) 110vw, 140vw'} className="object-cover" style={{ objectPosition: p.photo.focus }} />
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,#0b1d45_8%,rgba(11,29,69,0.75)_38%,transparent_70%)]" />
      <span className="absolute inset-x-4 bottom-4">
        <span className="block text-[20px] font-bold leading-tight">{p.name}</span>
        <span className="block mt-1 text-[16px] leading-snug text-white/90">{p.outcome}</span>
      </span>
    </Link>
  );
}

const COLUMNS: Record<number, string> = { 1: 'sm:grid-cols-2', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };

/** Wall of posters. Phones swipe through it. */
export function PosterWall({ title, sub, slugs }: { title: string; sub?: string; slugs: string[] }) {
  const shown = ALL_PROGRAMMES.filter((p) => slugs.includes(p.slug));
  const wide = shown.length <= 2;
  const columns = COLUMNS[shown.length] ?? 'sm:grid-cols-3 lg:grid-cols-5';
  return (
    <section aria-label={title} className="bg-paper">
      <Container className={SECTION}>
        <Heading sub={sub}>{title}</Heading>
        <ul aria-label={title} tabIndex={0} className={`${SWIPE} sm:grid ${columns}`}>
          {shown.map((p) => (
            <li key={p.slug} className="w-[62%] sm:w-auto">
              <Poster programme={p} wide={wide} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Tracks as a listing: name and what is inside. */
export function TrackList({ programmes }: { programmes: Programme[] }) {
  return (
    <section aria-label="Leadership tracks" className={NAVY}>
      <Container className={SECTION}>
        <Heading dark sub="Choose a role. Each track puts three Jr MBA programmes together around it.">Leadership tracks</Heading>
        <ul className="list-none p-0 m-0">
          {programmes.map((p) => (
            <li key={p.slug} className="border-0 border-t border-solid border-white/25">
              <Link
                href={programmeUrl(p.slug)}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-x-6 gap-y-1 items-baseline py-6 text-white no-underline focus-visible:outline-2 focus-visible:outline-white"
              >
                <span className="lg:col-span-5 font-bold tracking-[-0.02em] leading-tight text-[clamp(1.6rem,3vw,2.5rem)] group-hover:underline underline-offset-8 decoration-2">{p.name}</span>
                <span className="lg:col-span-6 text-[17px] leading-snug text-white/85">{p.acts.map((a) => a.title).join(', ')}</span>
                <ArrowRight className="hidden lg:block lg:col-span-1 justify-self-end w-6 h-6" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** End credits: straight into the next programme. */
export function NextProgramme({ programme: p }: { programme: Programme }) {
  return (
    <section aria-label="Next programme" className="relative isolate overflow-hidden bg-[var(--ss-navy)]">
      <Link href={programmeUrl(p.slug)} className="pg-poster block text-white no-underline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white">
        <Image src={p.photo.src} alt="" fill sizes="max(100vw, 640px)" className="object-cover" style={{ objectPosition: p.photo.focus }} />
        <span aria-hidden="true" className={SHADE} />
        <Container className="relative py-20 sm:py-32">
          <span className="block text-[18px] font-bold text-white">Next programme</span>
          <span className="block font-bold tracking-[-0.03em] leading-[1.05] text-[clamp(2.25rem,6.5vw,5rem)]">
            {p.name} <ArrowRight className="inline-block w-[0.8em] h-[0.8em]" aria-hidden="true" />
          </span>
        </Container>
      </Link>
    </section>
  );
}

export const SINGLE_SLUGS = SINGLES.map((s) => s.slug);
