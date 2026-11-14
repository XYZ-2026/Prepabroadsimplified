'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Rocket, 
  Brain, 
  Compass, 
  Award, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';
import { Chip, Container, SectionHeading } from './primitives';
import MediaFrame from './MediaFrame';

export default function SupportBento() {
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
            subtitle="From psychometric assessment and stream choice to SAT prep, research and summer programs, founder-led entrepreneurship and admissions to Indian and global universities—every programme is engineered for student ambition and family clarity."
          />
        </div>

        {/* ── Bento Grid: Asymmetrical Tiles ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* TILE 1: Entrepreneurship Programme (Large 7 Cols on Desktop) */}
          <div className="lg:col-span-7 bg-white rounded-[24px] sm:rounded-[28px] border border-[#DDE3F0] p-6 sm:p-8 flex flex-col justify-between hover:border-[#1258DE] transition-all duration-200 group shadow-xs hover:shadow-clarvo-elevated">
            <div>
              {/* Chips matching brochure pills */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Chip variant="sky" size="sm">
                  <span>1 Year</span>
                </Chip>
                <Chip variant="paper" size="sm">
                  <span>Online</span>
                </Chip>
                <Chip variant="paper" size="sm">
                  <span>Grades 8–12</span>
                </Chip>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6EDFF] flex items-center justify-center text-[#1258DE]">
                  <Rocket className="w-4 h-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-dmsans font-bold text-[#12131C] tracking-tight group-hover:text-[#1258DE] transition-colors">
                  Entrepreneurship programme
                </h3>
              </div>

              <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#5B6275] max-w-xl font-dmsans mb-6">
                Learn by building. High-school students ideate, validate and launch genuine ventures with guidance from active startup founders, real product sprints, and venture mentor sessions.
              </p>
            </div>

            {/* Framed Photo inside Bento Tile using MediaFrame */}
            <MediaFrame
              src="/images/home/08-building-product.webp"
              alt="High school students building real-world ventures in Clarvo Entrepreneurship Programme"
              mode="cover"
              ratioDesktop="16/10"
              ratioTablet="16/10"
              focalPoint="55% 50%"
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#171822]/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-4 right-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-white text-xs font-dmsans font-bold pointer-events-auto">
                <span className="bg-[#171822]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  Founder mentorship &amp; venture demo day
                </span>
                <span className="inline-flex items-center gap-1 text-white bg-[#1258DE] px-3 py-1 rounded-full">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </MediaFrame>
          </div>

          {/* TILE 2: Psychometric Assessments & Diagnostics (5 Cols on Desktop) */}
          <div 
            id="assessments"
            className="scroll-mt-24 lg:col-span-5 bg-white rounded-[24px] sm:rounded-[28px] border border-[#DDE3F0] p-6 sm:p-8 flex flex-col justify-between hover:border-[#1258DE] transition-all duration-200 group shadow-xs hover:shadow-clarvo-elevated"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Chip variant="sky" size="sm">
                  <span>Grades 7–12</span>
                </Chip>
                <Chip variant="paper" size="sm">
                  <span>30 Diagnostic Modules</span>
                </Chip>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6EDFF] flex items-center justify-center text-[#1258DE]">
                  <Brain className="w-4 h-4" />
                </div>
                <Link href="/psychometric-assessment" className="hover:text-[#1258DE] transition-colors">
                  <h3 className="text-xl sm:text-2xl font-dmsans font-bold text-[#12131C] tracking-tight group-hover:text-[#1258DE] transition-colors">
                    Psychometric diagnostics
                  </h3>
                </Link>
              </div>

              <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#5B6275] font-dmsans mb-6">
                Scientifically evaluate cognitive agility, RIASEC vocational interests, Big Five behavioral traits, and VARK learning modalities before academic decisions.
              </p>
            </div>

            {/* Framed Photo inside Bento Tile using MediaFrame */}
            <MediaFrame
              src="/images/home/06-mentoring-laptop.webp"
              alt="1-on-1 counselor and student reviewing psychometric assessment insights"
              mode="cover"
              ratioDesktop="16/10"
              ratioTablet="16/10"
              focalPoint="50% 45%"
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#171822]/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-4 right-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-white text-xs font-dmsans font-bold pointer-events-auto">
                <Link
                  href="/psychometric-assessment"
                  className="bg-[#171822]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 hover:bg-[#171822] transition-colors"
                >
                  Explore 4 phases
                </Link>
                <Link
                  href="/psychometric-test"
                  className="inline-flex items-center gap-1 text-white bg-[#1258DE] px-3 py-1 rounded-full hover:bg-[#0D4ABF] transition-colors"
                >
                  <span>Take diagnostic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </MediaFrame>
          </div>

          {/* TILE 3: Stream Selection & Career Roadmaps (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] sm:rounded-[28px] border border-[#DDE3F0] p-6 sm:p-7 flex flex-col justify-between hover:border-[#1258DE] transition-all duration-200 group shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#E6EDFF] flex items-center justify-center text-[#1258DE]">
                  <Compass className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-dmsans font-bold text-[#5B6275] bg-[#F5F7FB] border border-[#DDE3F0] px-2.5 py-0.5 rounded-full">
                  100+ Careers
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-dmsans font-bold text-[#12131C] tracking-tight mb-2 group-hover:text-[#1258DE] transition-colors">
                Stream selection &amp; roadmaps
              </h3>

              <p className="text-[13.5px] leading-relaxed text-[#5B6275] font-dmsans">
                Map Class 10 stream choices (PCM, PCB, Commerce, Humanities) to 4-year degree requirements and industry milestones with zero guesswork.
              </p>
            </div>

            <Link
              href="/career-library"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-dmsans font-bold text-[#1258DE] hover:underline"
            >
              <span>Explore career roadmaps</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* TILE 4: Digital SAT Preparation (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] sm:rounded-[28px] border border-[#DDE3F0] p-6 sm:p-7 flex flex-col justify-between hover:border-[#1258DE] transition-all duration-200 group shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#E6EDFF] flex items-center justify-center text-[#1258DE]">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-dmsans font-bold text-[#5B6275] bg-[#F5F7FB] border border-[#DDE3F0] px-2.5 py-0.5 rounded-full">
                  Target 1500+
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-dmsans font-bold text-[#12131C] tracking-tight mb-2 group-hover:text-[#1258DE] transition-colors">
                Digital SAT preparation
              </h3>

              <p className="text-[13.5px] leading-relaxed text-[#5B6275] font-dmsans">
                Adaptive diagnostic mocks, pinpoint error analysis, Desmos calculator speed drills, and score acceleration coaching for high-stakes test takers.
              </p>
            </div>

            <Link
              href="/iq-test"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-dmsans font-bold text-[#1258DE] hover:underline"
            >
              <span>Explore SAT diagnostics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* TILE 5: Profile Building & Research (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] sm:rounded-[28px] border border-[#DDE3F0] p-6 sm:p-7 flex flex-col justify-between hover:border-[#1258DE] transition-all duration-200 group shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#E6EDFF] flex items-center justify-center text-[#1258DE]">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-dmsans font-bold text-[#5B6275] bg-[#F5F7FB] border border-[#DDE3F0] px-2.5 py-0.5 rounded-full">
                  Admissions Spikes
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-dmsans font-bold text-[#12131C] tracking-tight mb-2 group-hover:text-[#1258DE] transition-colors">
                Research &amp; profile building
              </h3>

              <p className="text-[13.5px] leading-relaxed text-[#5B6275] font-dmsans">
                Profile building for top universities: author original research papers with university mentors, add the right research and summer programs, and build a differentiated applicant portfolio.
              </p>
            </div>

            <Link
              href="/university-finder"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-dmsans font-bold text-[#1258DE] hover:underline"
            >
              <span>Match premier universities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </Container>
    </section>
  );
}

