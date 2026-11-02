'use client';

import React from 'react';
import { 
  Star, 
  CheckCircle2, 
  Quote, 
  GraduationCap, 
  School, 
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Container, SectionHeading, Chip } from './primitives';

interface TestimonialItem {
  id: string;
  name: string;
  initials: string;
  grade: string;
  board: string;
  school: string;
  city: string;
  outcomeBadge: string;
  outcomeMetric: string;
  quote: string;
  focusArea: string;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'aarav-sharma',
    name: 'Aarav Sharma',
    initials: 'AS',
    grade: 'Class 10',
    board: 'ICSE',
    school: 'The Shri Ram School, Moulsari',
    city: 'Gurugram',
    outcomeBadge: 'Stream fit: 98.4% match',
    outcomeMetric: 'Confirmed: PCM + Computer Science',
    quote: 'Before Clarvo’s diagnostic evaluation, my parents and I had weeks of tension about whether I should pick Commerce or Science PCM. The 30-dimension cognitive report proved that my spatial reasoning and abstract logic matched Computer Science far better. Having objective data completely ended the guesswork at home.',
    focusArea: 'PCM vs Commerce Decision & RIASEC Alignment',
  },
  {
    id: 'rhea-sengupta',
    name: 'Rhea Sengupta',
    initials: 'RS',
    grade: 'Grade 11',
    board: 'IB Diploma Programme',
    school: 'Dhirubhai Ambani International School',
    city: 'Mumbai',
    outcomeBadge: 'Predicted 43/45 in DP1',
    outcomeMetric: 'HL: Math AA, Economics, Physics',
    quote: 'Selecting IB Higher Levels is high-stakes; if you make one mismatched choice, your university options shrink drastically. Clarvo analyzed my VARK learning style and analytical endurance, guiding me to take Math AA HL and Economics HL with complete conviction.',
    focusArea: 'IB DP HL Selection & Workload Calibration',
  },
  {
    id: 'kabir-mehta',
    name: 'Kabir Mehta',
    initials: 'KM',
    grade: 'Class 12',
    board: 'CBSE (Science PCM)',
    school: 'Delhi Public School, R.K. Puram',
    city: 'New Delhi',
    outcomeBadge: '1540 on Digital SAT',
    outcomeMetric: '+180 pt Increase (Math 790, R&W 750)',
    quote: 'I was plateaued at 1360 on standard practice tests because the adaptive second module kept punishing my time management. Clarvo’s diagnostic pacing report broke down the exact seconds I wasted per question type and trained me on Desmos shortcuts. Crossing 1540 unlocked direct merit scholarships.',
    focusArea: 'Adaptive Module Pacing & Targeted Error Analysis',
  },
  {
    id: 'ananya-deshmukh',
    name: 'Ananya Deshmukh',
    initials: 'AD',
    grade: 'Class 10',
    board: 'ICSE',
    school: 'The Cathedral and John Connon School',
    city: 'Mumbai',
    outcomeBadge: 'Zero stream regret',
    outcomeMetric: 'Confirmed: Commerce + Applied Math & Econ',
    quote: 'Almost everyone in my batch was blindly registering for engineering coaching just because they scored 90%+ in 9th grade. Clarvo was the first platform that assessed my verbal agility and enterprising profile. It gave my family complete conviction to choose Commerce with Math, saving me from burnout.',
    focusArea: 'Preventing Coaching Peer Pressure & Stream Clarity',
  },
  {
    id: 'pranav-varma',
    name: 'Pranav Varma',
    initials: 'PV',
    grade: 'Class 12',
    board: 'Cambridge A-Levels',
    school: 'The Doon School',
    city: 'Dehradun',
    outcomeBadge: 'Imperial College offer',
    outcomeMetric: 'Published Paper in High School Journal',
    quote: 'Top engineering colleges abroad see thousands of applicants with straight A*s. You need an intellectual spike. Through Clarvo’s research mentorship framework, I formulated and authored an empirical modeling paper on urban microgrids. That published paper became the centerpiece of my university applications.',
    focusArea: 'Academic Profile Spike & Independent Research Paper',
  },
  {
    id: 'tanvi-nambiar',
    name: 'Tanvi Nambiar',
    initials: 'TN',
    grade: 'Class 11',
    board: 'CBSE (Science PCM)',
    school: 'National Public School, Indiranagar',
    city: 'Bengaluru',
    outcomeBadge: '99th percentile aptitude',
    outcomeMetric: 'Synchronized CBSE + Competitive Prep',
    quote: 'The academic jump from 10th to 11th grade in CBSE is notoriously difficult. Clarvo gave me a personalized milestone planner that harmonized my school syllabus with competitive foundation modules. My stress dropped immediately because I knew exactly where to focus my study hours.',
    focusArea: 'Grade 11 Transition & Academic Planning',
  },
];

export default function TestimonialGrid() {
  return (
    <section 
      id="stories"
      aria-label="Student and Parent Stories"
      className="scroll-mt-20 py-16 sm:py-20 lg:py-24 bg-[#F5F7FB] border-b border-[#DDE3F0]"
    >
      <Container>
        {/* Section Heading: Strictly sentence case, no tracked all-caps eyebrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <SectionHeading
              title="Evidence-backed clarity for students and families"
              subtitle="Real stories from ambitious secondary school families across CBSE, ICSE, IB, and Cambridge curricula who replaced guesswork with scientific data."
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-dmsans font-bold text-[#1258DE] bg-[#E6EDFF] px-3.5 py-1.5 rounded-full border border-[#C8D8FF] self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-[#1258DE]" />
            <span>100% verified student outcomes</span>
          </div>
        </div>

        {/* ── Static Testimonial Grid (3 Cols on Desktop, 2 on Tablet, 1 on Mobile) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-[24px] border border-[#DDE3F0] p-6 sm:p-7 flex flex-col justify-between hover:border-[#1258DE] transition-all duration-200 shadow-2xs hover:shadow-xs group"
            >
              {/* Top Meta: Verified Chip & Outcome Metric */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-dmsans font-bold text-[#0E7A3D] bg-[#E8F8EE] px-2.5 py-0.5 rounded-full border border-[#B6EAD0]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0E7A3D]" />
                    <span>Verified outcome</span>
                  </span>

                  <span className="text-[11px] font-dmsans font-semibold text-[#1258DE] bg-[#E6EDFF] px-2.5 py-0.5 rounded-full border border-[#C8D8FF]">
                    {t.outcomeBadge}
                  </span>
                </div>

                {/* Outcome Metric Callout */}
                <div className="mb-4 pb-3 border-b border-[#F0F3FA]">
                  <span className="text-xs font-dmsans font-bold text-[#12131C] block">
                    {t.outcomeMetric}
                  </span>
                  <span className="text-[11px] font-dmsans text-[#767E94] block mt-0.5">
                    {t.focusArea}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#5B6275] font-dmsans mb-6">
                  “{t.quote}”
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-[#F0F3FA] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#12131C] text-white flex items-center justify-center font-dmsans font-bold text-xs shrink-0">
                  {t.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[13.5px] font-dmsans font-bold text-[#12131C] truncate leading-tight">
                    {t.name}
                  </h4>
                  <p className="text-[11.5px] font-dmsans text-[#767E94] truncate leading-tight mt-0.5">
                    {t.grade} ({t.board}) · {t.school}, {t.city}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}

