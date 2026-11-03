'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Brain, 
  Compass, 
  BookOpen, 
  GraduationCap, 
  Award,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Container, SectionHeading, Chip, Button } from './primitives';
import MediaFrame from './MediaFrame';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';

interface GradePillarData {
  id: string;
  tabLabel: string;
  gradeBadge: string;
  title: string;
  headline: string;
  desc: string;
  imageSrc: string;
  imageAlt: string;
  imageMode: 'cover' | 'cutout';
  imageBg: 'paper' | 'sky' | 'midnight';
  focalPoint?: string;
  actionHref: string;
  actionText: string;
  modules: {
    code: string;
    title: string;
    subtitle: string;
    desc: string;
    href: string;
  }[];
}

const GRADE_TIERS: GradePillarData[] = [
  {
    id: 'g7-8',
    tabLabel: 'Grades 7–8',
    gradeBadge: 'Middle school foundation',
    title: 'Foundational Aptitude & Skill Discovery',
    headline: 'Early cognitive mapping and curiosity building before board examination stress',
    desc: 'Middle school is the decisive window to establish learning styles, cognitive processing stamina, and intellectual interests without the high-stakes anxiety of public examinations.',
    imageSrc: '/images/home/07-brand-moodboard.webp',
    imageAlt: 'Clarvo foundation learning and cognitive exploration for middle school students',
    imageMode: 'cover',
    imageBg: 'sky',
    focalPoint: '62% 55%',
    actionHref: '/discover',
    actionText: 'Explore middle school modules',
    modules: [
      {
        code: 'Diagnostic',
        title: 'Diagnostic cognitive evaluation',
        subtitle: 'Foundational Aptitude',
        desc: 'Evaluates working memory, spatial reasoning, and processing speed across 30 cognitive parameters.',
        href: '/psychometric-test',
      },
      {
        code: 'Internships',
        title: 'Social impact & micro-internships',
        subtitle: 'Grades 7–8 Impact',
        desc: 'Structured community initiatives, NGO volunteering, and early leadership exploration.',
        href: '/discover',
      },
      {
        code: 'Advisory',
        title: 'Parent & counselor advisory',
        subtitle: 'Development Strategy',
        desc: 'Objective consultations with certified educational psychologists to guide extracurricular choices.',
        href: '/book-a-demo',
      },
    ],
  },
  {
    id: 'g9-10',
    tabLabel: 'Grades 9–10',
    gradeBadge: 'Stream & subject choice',
    title: 'Evidence-Backed Stream Selection',
    headline: 'Eliminating costly stream switches across Science, Commerce and Humanities',
    desc: 'Stream choice in Class 10 sets the foundation for undergraduate eligibility. We combine cognitive aptitude, numerical stamina, and RIASEC vocational interest mapping to ensure complete family clarity.',
    imageSrc: '/images/home/04-girl-win-cutout.webp',
    imageAlt: 'Student celebrating confident Class 10 stream choice with Clarvo',
    imageMode: 'cutout',
    imageBg: 'sky',
    actionHref: '/discover',
    actionText: 'Explore Class 10 stream selection',
    modules: [
      {
        code: 'Stream Choice',
        title: 'Stream fitment index',
        subtitle: 'High-Stakes Decision',
        desc: 'Scientific alignment for PCM, PCB, Commerce & Humanities selection with RIASEC fitment.',
        href: '/discover',
      },
      {
        code: 'Mentoring',
        title: '1-to-1 subject mentoring',
        subtitle: 'Board Readiness',
        desc: 'Personalized private tutoring across IB MYP, Cambridge IGCSE, CBSE and ICSE syllabi.',
        href: '/book-a-demo',
      },
      {
        code: 'Roadmap',
        title: 'Multi-year academic roadmap',
        subtitle: 'Pre-University Planning',
        desc: 'Strategic milestone mapping connecting high-school subjects to 100+ modern global careers.',
        href: '/career-roadmap',
      },
    ],
  },
  {
    id: 'g11-12',
    tabLabel: 'Grades 11–12',
    gradeBadge: 'Admissions & mastery',
    title: 'Standardized Test Prep & Global Admissions',
    headline: 'Synchronizing board excellence, Digital SAT 1500+ and faculty-led research',
    desc: 'Senior high school requires flawless execution across standardized tests, academic rigor, and distinctive profile spikes. We guide students into premier Indian and international institutions.',
    imageSrc: '/images/home/05-presenter-cutout.webp',
    imageAlt: 'Clarvo senior high student presenting research project for university admissions',
    imageMode: 'cutout',
    imageBg: 'midnight',
    actionHref: '/university-finder',
    actionText: 'Explore university predictor',
    modules: [
      {
        code: 'SAT Prep',
        title: 'Digital SAT 1500+ prep',
        subtitle: 'Adaptive Mastery',
        desc: 'Diagnostic adaptive mock tests, question banks, Desmos shortcuts, and 1-on-1 coaching.',
        href: '/iq-test',
      },
      {
        code: 'Research',
        title: 'Research & peer-reviewed papers',
        subtitle: 'Intellectual Spike',
        desc: 'Mentored academic research papers published in indexed high school and undergraduate journals.',
        href: '/discover',
      },
      {
        code: 'Admissions',
        title: 'Global university matcher',
        subtitle: '500+ Colleges',
        desc: 'Data-driven admit chance estimations for top domestic universities and global colleges.',
        href: '/university-finder',
      },
    ],
  },
];

export default function GradePillarsSegmented() {
  const [activeTierId, setActiveTierId] = useState<string>('g9-10');
  const prefersReducedMotion = useReducedMotionPreference();
  const currentTier = GRADE_TIERS.find((t) => t.id === activeTierId) || GRADE_TIERS[1];

  return (
    <section 
      id="programs"
      aria-label="Grade-Specific Pathways & Academic Pillars"
      className="scroll-mt-20 py-16 sm:py-20 lg:py-24 bg-white border-b border-[#DDE3F0]"
    >
      <Container>
        {/* Section Heading: Strictly sentence case, no tracked all-caps eyebrows */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-3xl">
            <SectionHeading
              title="Grade-specific pathways & academic pillars"
              subtitle="Developmental programmes tailored for each stage of middle and high school. From early curiosity in Grade 7 to published research and university admissions in Grade 12."
            />
          </div>

          <div className="shrink-0">
            <Button
              href="/discover"
              variant="secondary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              <span>Explore all modules</span>
            </Button>
          </div>
        </div>

        {/* ── Segmented Control Tabs ── */}
        <div className="flex justify-center mb-10 sm:mb-12">
          <div 
            role="tablist"
            aria-label="Grade level selection"
            className="inline-flex p-1.5 rounded-full bg-[#F5F7FB] border border-[#DDE3F0] gap-1 shadow-2xs max-w-full overflow-x-auto"
          >
            {GRADE_TIERS.map((tier) => {
              const isSelected = tier.id === activeTierId;
              return (
                <button
                  key={tier.id}
                  role="tab"
                  id={`grade-tab-${tier.id}`}
                  aria-selected={isSelected}
                  aria-controls={`grade-panel-${tier.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveTierId(tier.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-[14px] font-dmsans font-bold transition-all duration-200 outline-none whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#1258DE] ${
                    isSelected
                      ? 'bg-[#1258DE] text-white shadow-xs'
                      : 'text-[#5B6275] hover:text-[#12131C] hover:bg-white/60'
                  }`}
                >
                  {tier.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tier Display with Short Cross-Fade ── */}
        <div
          role="tabpanel"
          id={`grade-panel-${currentTier.id}`}
          aria-labelledby={`grade-tab-${currentTier.id}`}
          className={`transition-opacity duration-200 ${
            prefersReducedMotion ? '' : 'transition-opacity duration-200'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column (5 Cols): Stage Photo with MediaFrame */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <MediaFrame
                src={currentTier.imageSrc}
                alt={currentTier.imageAlt}
                mode={currentTier.imageMode}
                backdrop={currentTier.imageBg}
                ratioDesktop="4/5"
                ratioTablet="16/10"
                focalPoint={currentTier.focalPoint}
                sizes="(max-width: 1024px) 100vw, 42vw"
              >
                {/* Visual Label Pill at Bottom */}
                <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dmsans font-bold border backdrop-blur-md shadow-2xs ${
                    currentTier.imageBg === 'midnight'
                      ? 'bg-[#171822]/85 text-white border-white/20'
                      : 'bg-white/90 text-[#12131C] border-[#DDE3F0]'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-[#1258DE]" />
                    <span>{currentTier.title}</span>
                  </div>
                </div>
              </MediaFrame>
            </div>

            {/* Right Column (7 Cols): Headline, Description, Module Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="mb-3">
                  <Chip variant="sky" size="sm">
                    <span>{currentTier.gradeBadge}</span>
                  </Chip>
                </div>

                <h3 className="text-2xl sm:text-3xl font-dmsans font-bold text-[#12131C] tracking-tight leading-snug mb-3">
                  {currentTier.headline}
                </h3>

                <p className="text-[15px] sm:text-[16px] text-[#5B6275] leading-relaxed font-dmsans mb-6">
                  {currentTier.desc}
                </p>

                {/* 3 Module Cards */}
                <div className="space-y-3.5">
                  {currentTier.modules.map((mod) => (
                    <Link
                      key={mod.code}
                      href={mod.href}
                      className="group p-4 sm:p-5 rounded-[18px] bg-[#F5F7FB] border border-[#DDE3F0] hover:border-[#1258DE] hover:bg-white transition-all duration-200 flex items-start justify-between gap-4 shadow-2xs hover:shadow-xs block"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-dmsans font-bold text-[#1258DE] bg-[#E6EDFF] px-2.5 py-0.5 rounded-md border border-[#C8D8FF]">
                            {mod.code}
                          </span>
                          <span className="text-xs font-dmsans font-medium text-[#767E94]">
                            {mod.subtitle}
                          </span>
                        </div>
                        <h4 className="text-[15px] sm:text-[16px] font-dmsans font-bold text-[#12131C] group-hover:text-[#1258DE] transition-colors leading-snug">
                          {mod.title}
                        </h4>
                        <p className="text-xs sm:text-[13px] text-[#5B6275] leading-relaxed font-dmsans">
                          {mod.desc}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white border border-[#DDE3F0] flex items-center justify-center text-[#767E94] group-hover:text-white group-hover:bg-[#1258DE] group-hover:border-[#1258DE] transition-all shrink-0 mt-1">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  href={currentTier.actionHref}
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  <span>{currentTier.actionText}</span>
                </Button>
              </div>

            </div>

          </div>
        </div>

      </Container>
    </section>
  );
}

