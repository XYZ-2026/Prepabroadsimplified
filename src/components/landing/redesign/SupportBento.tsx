'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { Rocket, Brain, Compass, Award, Globe, ArrowRight, type LucideIcon } from 'lucide-react';
import { Chip, Container, SectionHeading } from './primitives';
import MediaFrame from './MediaFrame';
import SignInModal from '@/components/Auth/SignInModal';
import { useSessionUser } from '@/components/providers/SessionProvider';

const CAREER_LIBRARY_URL = '/career-library';

/**
 * Stretched-control classes: the ::after covers the whole card (the nearest `relative`
 * ancestor), so a tap anywhere on the card triggers the heading's link or button.
 * The focus ring is drawn on that overlay so keyboard users see the whole card highlighted.
 */
const STRETCHED =
  "focus-visible:outline-none after:content-[''] after:absolute after:inset-0 after:z-[5] after:rounded-[24px] sm:after:rounded-[28px] focus-visible:after:ring-2 focus-visible:after:ring-[#1258DE] focus-visible:after:ring-offset-2";

type CardAction = { href: string } | { onClick: () => void };

interface ServiceCardProps {
  id: string;
  /** Desktop grid span (12-column grid). */
  span: 'lg:col-span-7' | 'lg:col-span-5' | 'lg:col-span-4';
  chips: { label: string; variant: 'sky' | 'paper' }[];
  Icon: LucideIcon;
  title: string;
  description: string;
  image: { src: string; alt: string; focalPoint: string; sizes: string };
  /** Dark label pill on the photo (optional). */
  photoLabel?: string;
  /** Blue call-to-action pill on the photo; also read out as part of the card's link name. */
  ctaLabel: string;
  action: CardAction;
}

function ServiceCard({ id, span, chips, Icon, title, description, image, photoLabel, ctaLabel, action }: ServiceCardProps) {
  const large = span !== 'lg:col-span-4';
  const titleClass = `m-0 font-dmsans font-bold text-[#12131C] tracking-tight group-hover:text-[#1258DE] transition-colors ${
    large ? 'text-xl sm:text-2xl' : 'text-xl sm:text-2xl lg:text-xl'
  }`;
  // Name starts with the visible title (WCAG label-in-name), then says what happens.
  const actionName = `${title}: ${ctaLabel}`;

  let heading: React.ReactNode = title;
  if (action && 'href' in action) {
    heading = (
      <Link href={action.href} aria-label={actionName} className={`text-inherit no-underline ${STRETCHED}`}>
        {title}
      </Link>
    );
  } else if (action) {
    heading = (
      <button
        type="button"
        onClick={action.onClick}
        aria-label={actionName}
        aria-haspopup="dialog"
        className={`p-0 m-0 bg-transparent border-0 cursor-pointer text-left text-inherit [font:inherit] [letter-spacing:inherit] ${STRETCHED}`}
      >
        {title}
      </button>
    );
  }

  return (
    <li
      id={id}
      className={`relative group scroll-mt-24 shrink-0 snap-start w-[88%] sm:w-[62%] md:w-[46%] lg:w-auto ${span} bg-white rounded-[24px] sm:rounded-[28px] border border-solid border-[#DDE3F0] p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 shadow-xs ${
        action ? 'hover:border-[#1258DE] hover:shadow-clarvo-elevated' : ''
      }`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {chips.map((chip) => (
            <Chip key={chip.label} variant={chip.variant} size="sm">
              <span>{chip.label}</span>
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 shrink-0 rounded-xl bg-[#E6EDFF] flex items-center justify-center text-[#1258DE]">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
          <h3 className={titleClass}>{heading}</h3>
        </div>

        <p className="m-0 text-[14px] sm:text-[15px] leading-relaxed text-[#5B6275] font-dmsans mb-6">{description}</p>
      </div>

      <MediaFrame
        src={image.src}
        alt={image.alt}
        mode="cover"
        ratioDesktop="16/10"
        ratioTablet="16/10"
        focalPoint={image.focalPoint}
        sizes={image.sizes}
        className="mt-4"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#171822]/40 via-transparent to-transparent pointer-events-none" />
        {/* Visual only: the whole card is the control, so these pills pass taps through to it. */}
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white text-xs font-dmsans font-bold pointer-events-none"
        >
          {photoLabel && (
            <span className="bg-[#171822]/80 backdrop-blur-md px-3 py-1 rounded-full border border-solid border-white/20">
              {photoLabel}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-white bg-[#1258DE] px-3 py-1 rounded-full">
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </MediaFrame>
    </li>
  );
}

export default function SupportBento() {
  // Resolved on the server by the layout; null for guests.
  const sessionUser = useSessionUser();
  const [careerSignUpOpen, setCareerSignUpOpen] = useState(false);
  const openCareerSignUp = useCallback(() => setCareerSignUpOpen(true), []);
  const closeCareerSignUp = useCallback(() => setCareerSignUpOpen(false), []);

  return (
    <section
      id="services"
      aria-label="Clarvo Support for Every Stage"
      className="scroll-mt-20 py-14 sm:py-20 lg:py-24 bg-[#F5F7FB] border-b border-[#DDE3F0]"
    >
      <Container>
        {/* Section Heading: Strictly sentence case, no tracked all-caps eyebrows */}
        <div className="mb-10 sm:mb-14 max-w-3xl">
          <SectionHeading
            title="Study abroad, admissions & profile building support for every stage"
            subtitle="From psychometric assessment and stream choice to SAT prep, research and summer programs, summer school certifications and admissions to Indian and global universities—every programme is engineered for student ambition and family clarity."
          />
        </div>

        {/*
          Below lg: a swipe carousel (scroll-snap, next card peeks in). The row bleeds to the
          screen edges so cards line up with the page gutter. `contain: paint` stops the
          off-screen cards from widening the page on Android Chrome (same fix as the
          psychometric page's swipe rows).
          lg and up: a 12-column grid, two large cards then three small ones.
        */}
        <ul
          aria-label="Clarvo services"
          data-testid="services-carousel"
          className="m-0 list-none flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 scroll-px-4 sm:-mx-6 sm:px-6 sm:scroll-px-6 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [contain:paint] lg:grid lg:grid-cols-12 lg:overflow-visible lg:mx-0 lg:px-0 lg:py-0 lg:[contain:none]"
        >
          {/* 1. Psychometric */}
          <ServiceCard
            id="assessments"
            span="lg:col-span-7"
            chips={[
              { label: 'Grades 7–12', variant: 'sky' },
              { label: '30 Diagnostic Modules', variant: 'paper' },
            ]}
            Icon={Brain}
            title="Psychometric diagnostics"
            description="Scientifically evaluate cognitive agility, RIASEC vocational interests, Big Five behavioral traits, and VARK learning modalities before academic decisions."
            image={{
              src: '/images/home/06-mentoring-laptop.webp',
              alt: '1-on-1 counselor and student reviewing psychometric assessment insights',
              focalPoint: '50% 45%',
              sizes: '(max-width: 1024px) 88vw, 55vw',
            }}
            photoLabel="Explore 4 phases"
            ctaLabel="Take diagnostic"
            action={{ href: '/psychometric-assessment' }}
          />

          {/* 2. Research & profile building */}
          <ServiceCard
            id="research-tile"
            span="lg:col-span-5"
            chips={[{ label: 'Admissions Spikes', variant: 'paper' }]}
            Icon={Globe}
            title="Research & profile building"
            description="Profile building for top universities: author original research papers with university mentors, add the right research and summer programs, and build a differentiated applicant portfolio."
            image={{
              src: '/images/home/11-research-mentor.webp',
              alt: 'Student explaining her research paper to a mentor',
              focalPoint: '50% 40%',
              sizes: '(max-width: 1024px) 88vw, 40vw',
            }}
            ctaLabel="Explore research programmes"
            action={{ href: '/research' }}
          />

          {/* 3. Summer school & certifications */}
          <ServiceCard
            id="summer-school-tile"
            span="lg:col-span-4"
            chips={[
              { label: 'Grades 8–12', variant: 'sky' },
              { label: 'Summer', variant: 'paper' },
            ]}
            Icon={Rocket}
            title="Summer School & Certifications"
            description="Mentor-guided programmes in business, technology, research and leadership. Students finish with a pitch, prototype, paper or project they can show."
            image={{
              src: '/images/summer-school/business.webp',
              alt: 'Student pitching a prototype to classmates',
              focalPoint: '55% 50%',
              sizes: '(max-width: 1024px) 88vw, 32vw',
            }}
            ctaLabel="Explore programmes"
            action={{ href: '/summer-school' }}
          />

          {/* 4. Digital SAT: leads to an enquiry; `from` tells the admin which button it came from */}
          <ServiceCard
            id="sat-tile"
            span="lg:col-span-4"
            chips={[{ label: 'Target 1500+', variant: 'paper' }]}
            Icon={Award}
            title="Digital SAT preparation"
            description="Adaptive diagnostic mocks, pinpoint error analysis, Desmos calculator speed drills, and score acceleration coaching for high-stakes test takers."
            image={{
              src: '/images/home/10-sat-prep.webp',
              alt: 'Student working through a Digital SAT practice test on a laptop',
              focalPoint: '40% 40%',
              sizes: '(max-width: 1024px) 88vw, 32vw',
            }}
            ctaLabel="Book an SAT consultation"
            action={{ href: '/book-a-demo?from=home:services-sat' }}
          />

          {/* 5. Stream selection: guests sign up free first (lead capture), then land in the Career Library */}
          <ServiceCard
            id="career-roadmaps-tile"
            span="lg:col-span-4"
            chips={[{ label: '100+ Careers', variant: 'paper' }]}
            Icon={Compass}
            title="Stream selection & roadmaps"
            description="Map Class 10 stream choices (PCM, PCB, Commerce, Humanities) to 4-year degree requirements and industry milestones with zero guesswork."
            image={{
              src: '/images/home/09-stream-roadmap.webp',
              alt: 'Student and parent exploring stream and career roadmap options on a laptop',
              focalPoint: '50% 40%',
              sizes: '(max-width: 1024px) 88vw, 32vw',
            }}
            ctaLabel={sessionUser ? 'Explore career roadmaps' : 'Sign up free to explore roadmaps'}
            action={sessionUser ? { href: CAREER_LIBRARY_URL } : { onClick: openCareerSignUp }}
          />
        </ul>
      </Container>

      <SignInModal
        open={careerSignUpOpen}
        onClose={closeCareerSignUp}
        redirectTo={CAREER_LIBRARY_URL}
        defaultTab="register"
        title="Explore 100+ career roadmaps, free"
        subtitle="Create a free account and we will take you straight to the Career Library: stream choices, degree paths and skills for each career."
      />
    </section>
  );
}
