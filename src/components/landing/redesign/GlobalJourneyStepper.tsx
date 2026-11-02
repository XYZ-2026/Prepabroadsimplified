'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  Sparkles, 
  Award, 
  GraduationCap, 
  Users, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Container, SectionHeading, Chip, Button } from './primitives';

interface JourneyStage {
  num: string;
  stepInt: number;
  gradeBadge: string;
  title: string;
  subtitle: string;
  headline: string;
  fullDesc: string;
  studentFocus: string;
  parentReassurance: string;
  keyDeliverables: string[];
  metricLabel: string;
  metricValue: string;
  link: string;
  actionText: string;
  icon: React.ReactNode;
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    num: '01',
    stepInt: 1,
    gradeBadge: 'Grades 7–8',
    title: 'Aptitude & self-discovery',
    subtitle: 'Foundational Aptitude & Cognitive Mapping',
    headline: 'Uncovering natural cognitive talents before academic pressure sets in',
    fullDesc: 'Middle school is the ideal window to assess cognitive processing speed, working memory, spatial reasoning, and early vocational curiosities without high-stakes pressure.',
    studentFocus: 'Discover what you naturally excel at through game-like cognitive modules without test anxiety.',
    parentReassurance: 'Gain early, objective baseline data to guide extracurriculars and skill-building years before board exams.',
    keyDeliverables: [
      '30-Factor Cognitive & Diagnostic Evaluation',
      'VARK Learning Modalities Assessment',
      'Curiosity & RIASEC Vocational Archetype Mapping',
      'Cognitive Strength vs Development Areas Analysis',
    ],
    metricLabel: 'Early Aptitude Clarity',
    metricValue: '96.2%',
    link: '/psychometric-test',
    actionText: 'Take diagnostic assessment',
    icon: <Compass className="w-4 h-4" />,
  },
  {
    num: '02',
    stepInt: 2,
    gradeBadge: 'Class 9–10',
    title: 'Stream & subject fit',
    subtitle: 'Evidence-Backed Class 11 Stream Choice',
    headline: 'Eliminating costly Class 11 stream switches before registration deadlines',
    fullDesc: 'Stream choice in Class 10 sets the trajectory for university eligibility. We analyze your aptitude, numerical stamina, and behavioral grit across PCM, PCB, Commerce, and Humanities.',
    studentFocus: 'Choose your subject combination with complete conviction instead of copying peer groups or coaching trends.',
    parentReassurance: 'Eliminates family friction with empirical data showing the highest probability of student academic success.',
    keyDeliverables: [
      'Stream Fitment Index across PCM, PCB, Commerce & Arts',
      'Parent-Student Aspirations & Consensus Report',
      'Board-Specific Subject Combinations (CBSE, ICSE, IB, Cambridge)',
      '1-on-1 Certified Counselor Strategy Debrief',
    ],
    metricLabel: 'Zero Stream Regret',
    metricValue: '99.1%',
    link: '/discover',
    actionText: 'Explore stream selection',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    num: '03',
    stepInt: 3,
    gradeBadge: 'Class 11',
    title: 'Academic mastery & SAT',
    subtitle: 'Digital SAT 1500+ & 1-on-1 Tutoring',
    headline: 'Synchronizing board excellence with elite standardized test mastery',
    fullDesc: 'Class 11 demands balancing heavy board syllabi with entrance exam readiness. We provide adaptive Digital SAT coaching and bespoke 1-to-1 tutoring for IB, Cambridge, and CBSE.',
    studentFocus: 'Master high-yield concepts, Desmos shortcuts, and adaptive pacing to break through score plateaus.',
    parentReassurance: 'Targeted private tutoring ensures board grades stay top-tier while opening up merit scholarship opportunities.',
    keyDeliverables: [
      'Digital SAT Adaptive Question Bank & Diagnostic Drills',
      '1-to-1 Mentorship for IB (HL/SL), Cambridge A-Levels & CBSE',
      'Pacing & Question-Type Time Loss Audits',
      'Merit Scholarship Score Target Roadmap',
    ],
    metricLabel: 'Target Score Potential',
    metricValue: '1500+',
    link: '/iq-test',
    actionText: 'Explore SAT & tutoring',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    num: '04',
    stepInt: 4,
    gradeBadge: 'Class 11–12',
    title: 'Research & profile spikes',
    subtitle: 'Original Research Papers & Leadership',
    headline: 'Building an unmistakable intellectual spike beyond standard grades',
    fullDesc: 'Top tier universities admit individuals with demonstrated intellectual initiative. We pair students with university faculty mentors to produce and publish original peer-reviewed research.',
    studentFocus: 'Author and publish an original paper in your field of passion, turning curiosity into recognized scholarship.',
    parentReassurance: 'Transforms your child’s application from a standard report card into an elite, differentiated portfolio.',
    keyDeliverables: [
      '1-on-1 Mentorship with University Faculty & Scholars',
      'Peer-Reviewed High School Journal Submission',
      'Community Impact & Social Innovation Micro-Internships',
      'Intellectual Spike & Evidence Dossier',
    ],
    metricLabel: 'Admissions Differentiation',
    metricValue: 'Top 2%',
    link: '/discover',
    actionText: 'View research tracks',
    icon: <Award className="w-4 h-4" />,
  },
  {
    num: '05',
    stepInt: 5,
    gradeBadge: 'Class 12',
    title: 'University & career launch',
    subtitle: 'Strategic Admissions & Career Pathways',
    headline: 'Strategic university shortlisting, scholarships & career trajectory',
    fullDesc: 'Translate high school accomplishments into successful university applications. We optimize college shortlists, admissions essays, scholarship submissions, and multi-year career roadmaps.',
    studentFocus: 'Target dream global colleges and top domestic universities with confidence in your fit and odds.',
    parentReassurance: 'Transparent ROI planning, scholarship maximization, and direct strategic guidance through every deadline.',
    keyDeliverables: [
      'Data-Driven College Shortlisting (Reach, Match, Safety)',
      'Common App, UCAS & Domestic Application Review',
      'Merit Scholarship & Financial Strategy Optimization',
      'Post-Graduation Career & Industry Alignment',
    ],
    metricLabel: 'Admissions Success Rate',
    metricValue: '97.4%',
    link: '/university-finder',
    actionText: 'Explore university matcher',
    icon: <GraduationCap className="w-4 h-4" />,
  },
];

export default function GlobalJourneyStepper() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeStage = JOURNEY_STAGES[activeIdx];

  return (
    <section 
      id="journey"
      aria-label="Self-Discovery to Global Admissions Journey"
      className="py-16 sm:py-20 lg:py-24 bg-white border-b border-[#DDE3F0]"
    >
      <Container>
        {/* Section Heading: Strictly sentence case, no tracked all-caps eyebrows */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <SectionHeading
            title="From self-discovery to global admissions"
            subtitle="A cohesive 5-stage developmental continuum. Whether beginning early aptitude discovery in Class 7 or executing targeted college shortlists in Class 12, each milestone builds upon empirical data."
          />
        </div>

        {/* ── 5-Step Horizontal Stepper with Continuous Path Line ── */}
        <div className="relative mb-10 sm:mb-14">
          
          {/* Continuous SVG Path Line behind stepper nodes (Desktop / Tablet) */}
          <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-[2px] pointer-events-none -z-0">
            {/* Background track line */}
            <div className="w-full h-full bg-[#E6EDFF]" />
            {/* Progress line fill up to active step */}
            <div 
              className="h-full bg-[#1258DE] transition-all duration-300"
              style={{
                width: `${(activeIdx / (JOURNEY_STAGES.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Stepper Buttons (Role="tablist") */}
          <div 
            role="tablist" 
            aria-label="Student Journey Steps"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 relative z-10"
          >
            {JOURNEY_STAGES.map((stage, idx) => {
              const isActive = idx === activeIdx;
              const isPast = idx < activeIdx;

              return (
                <button
                  key={stage.num}
                  role="tab"
                  id={`journey-tab-${stage.num}`}
                  aria-selected={isActive}
                  aria-controls={`journey-panel-${stage.num}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative flex flex-col items-center text-center p-3 sm:p-4 rounded-[18px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1258DE] focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-[#F5F7FB] border border-[#1258DE] shadow-xs'
                      : 'bg-white border border-[#DDE3F0] hover:border-[#CBD5E1] hover:bg-[#FAFBFD]'
                  }`}
                >
                  {/* Step Number Bubble */}
                  <div 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-dmsans font-bold text-sm sm:text-base transition-all duration-200 mb-2 border ${
                      isActive
                        ? 'bg-[#1258DE] text-white border-[#1258DE] shadow-sm scale-105'
                        : isPast
                        ? 'bg-[#E6EDFF] text-[#1258DE] border-[#C8D8FF]'
                        : 'bg-[#F5F7FB] text-[#5B6275] border-[#DDE3F0]'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 text-[#1258DE]" />
                    ) : (
                      <span>{stage.num}</span>
                    )}
                  </div>

                  {/* Grade Badge */}
                  <span className={`text-[11px] font-dmsans font-semibold px-2 py-0.5 rounded-full mb-1 transition-colors ${
                    isActive 
                      ? 'bg-[#E6EDFF] text-[#1258DE]' 
                      : 'bg-[#F5F7FB] text-[#767E94]'
                  }`}>
                    {stage.gradeBadge}
                  </span>

                  {/* Step Title */}
                  <span className={`text-xs sm:text-[13px] font-dmsans font-bold leading-tight transition-colors line-clamp-2 ${
                    isActive ? 'text-[#12131C]' : 'text-[#5B6275]'
                  }`}>
                    {stage.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Stage Detail Panel (Role="tabpanel") ── */}
        <div 
          role="tabpanel"
          id={`journey-panel-${activeStage.num}`}
          aria-labelledby={`journey-tab-${activeStage.num}`}
          className="bg-[#F5F7FB] rounded-[24px] sm:rounded-[28px] border border-[#DDE3F0] p-6 sm:p-8 lg:p-10 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (7 Cols): Headline, Full Description, Perspectives */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Chip variant="sky" size="sm">
                    <span>{activeStage.gradeBadge}</span>
                  </Chip>
                  <span className="text-xs text-[#767E94] font-dmsans font-medium">
                    {activeStage.subtitle}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-dmsans font-bold text-[#12131C] tracking-tight leading-snug mb-3">
                  {activeStage.headline}
                </h3>

                <p className="text-[15px] sm:text-[16px] text-[#5B6275] leading-relaxed font-dmsans">
                  {activeStage.fullDesc}
                </p>
              </div>

              {/* Student & Parent Differentiated Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-[18px] border border-[#DDE3F0]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-[#E6EDFF] flex items-center justify-center text-[#1258DE]">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-dmsans font-bold text-[#12131C]">
                      For the student
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#5B6275] leading-relaxed font-dmsans">
                    {activeStage.studentFocus}
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-[18px] border border-[#DDE3F0]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-[#E8F8EE] flex items-center justify-center text-[#0E7A3D]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-dmsans font-bold text-[#12131C]">
                      For parents
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#5B6275] leading-relaxed font-dmsans">
                    {activeStage.parentReassurance}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (5 Cols): Key Deliverables Checklist, Metric, and CTA */}
            <div className="lg:col-span-5 bg-white rounded-[20px] sm:rounded-[24px] border border-[#DDE3F0] p-6 sm:p-7 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DDE3F0]">
                  <span className="text-xs font-dmsans font-bold uppercase tracking-wider text-[#767E94]">
                    Stage deliverables
                  </span>
                  <div className="text-right">
                    <span className="block text-xl font-anton text-[#1258DE] leading-none">
                      {activeStage.metricValue}
                    </span>
                    <span className="text-[10.5px] font-dmsans font-medium text-[#767E94]">
                      {activeStage.metricLabel}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {activeStage.keyDeliverables.map((item, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#E6EDFF] flex items-center justify-center text-[#1258DE] shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] font-dmsans font-medium text-[#12131C] leading-snug">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[#DDE3F0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Button 
                  href={activeStage.link}
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  <span>{activeStage.actionText}</span>
                </Button>
                
                <span className="text-xs text-[#767E94] font-dmsans text-center sm:text-right">
                  Step {activeStage.stepInt} of 5
                </span>
              </div>
            </div>

          </div>
        </div>

      </Container>
    </section>
  );
}
