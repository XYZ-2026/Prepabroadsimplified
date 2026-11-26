'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Compass, FolderOpen, Search, Users, type LucideIcon } from 'lucide-react';
import { Container } from './primitives';
import './free-for-students.css';

/** Only tools that are free today: the first and third are public, the others need a free account. */
const FREE_TOOLS: { title: string; note: string; href: string; Icon: LucideIcon }[] = [
  { title: 'Choose a stream', note: '100+ career roadmaps', href: '/career-library', Icon: Compass },
  { title: 'Find universities', note: 'Search 500+ universities', href: '/university-finder', Icon: Search },
  { title: 'Learn from admits', note: 'Real student profiles', href: '/admitted-students', Icon: Users },
  { title: 'Build a portfolio', note: 'One link to share', href: '/dashboard/student/portfolio', Icon: FolderOpen },
];

// One line splitting into the four columns below it (their centres sit at 125, 375, 625 and 875).
const BRANCHES = [125, 375, 625, 875].map((x) => `M500 0 V28 C500 78, ${x} 42, ${x} 100`);

/** Statement under the hero: what CLARVO does, that it is free, and the decisions it helps with. */
export default function FreeForStudents() {
  const ref = useRef<HTMLElement>(null);
  // `done` is the server and no-JS state, so nothing is ever hidden without the script that shows it.
  const [draw, setDraw] = useState<'done' | 'waiting' | 'drawing'>('done');

  useEffect(() => {
    const section = ref.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (section.getBoundingClientRect().top < window.innerHeight * 0.7) return;
    setDraw('waiting');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setDraw('drawing');
        observer.disconnect();
      },
      { rootMargin: '0px 0px -30% 0px' },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} aria-labelledby="free-for-students" data-draw={draw} className="free-band bg-clarvo-blue text-white font-dmsans">
      <Container className="pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20">
        <h2
          id="free-for-students"
          className="m-0 mx-auto max-w-[17ch] text-center text-white font-dmsans font-bold text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] [text-wrap:balance]"
        >
          Helping students make better decisions,{' '}
          <span className="relative inline-block whitespace-nowrap">
            for free
            <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" className="absolute left-0 -bottom-[0.12em] w-full h-[0.16em] overflow-visible">
              <path pathLength={1} d="M2 8 C 40 2, 60 11, 100 6 S 160 3, 198 7" className="free-line" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
            </svg>
          </span>
        </h2>
        <p className="m-0 mt-6 sm:mt-8 text-center text-[17px] sm:text-[20px] lg:text-[22px] leading-[1.5] text-white [text-wrap:balance]">
          The platform is completely open, for the whole student community.
        </p>

        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true" className="free-tree hidden md:block mt-6 w-full h-24 origin-top text-white/60">
          {BRANCHES.map((d) => (
            <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        <ul className="list-none p-0 m-0 mt-10 md:mt-0 grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-2 md:gap-0">
          {FREE_TOOLS.map(({ title, note, href, Icon }) => (
            <li key={href} className="free-tool">
              <Link
                href={href}
                className="group h-full flex md:flex-col items-center gap-4 md:gap-3 rounded-2xl px-3 py-3 md:pt-0 md:pb-4 text-left md:text-center text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="w-14 h-14 shrink-0 rounded-full bg-white text-clarvo-blue flex items-center justify-center transition-colors duration-200 group-hover:bg-sky">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[18px] font-bold leading-snug group-hover:underline underline-offset-4">{title}</span>
                  <span className="block text-[16px] leading-snug text-white/90">{note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
