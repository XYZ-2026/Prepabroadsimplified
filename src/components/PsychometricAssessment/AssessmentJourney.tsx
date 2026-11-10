import React from 'react';
import { UserCheck, BrainCircuit, Cpu, FileCheck2, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface StepItem {
  step: string;
  title: string;
  desc: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
}

const JOURNEY_STEPS: StepItem[] = [
  {
    step: '01',
    title: 'Profile Calibration & Grade Intake',
    desc: 'The student selects their current academic grade (Grades 7–12), curriculum board (CBSE, ICSE, IB, Cambridge), and subject preferences.',
    details: 'Customizes the diagnostic baseline so questions reflect the student’s academic maturity level.',
    icon: UserCheck,
  },
  {
    step: '02',
    title: '30-Module Diagnostic Session',
    desc: 'The student navigates 30 focused evaluation modules across personality, cognitive processing speed, and VARK learning styles.',
    details: 'Completed in an untimed, zero-stress format (~45–60 min) designed to measure natural intuitive responses.',
    icon: BrainCircuit,
  },
  {
    step: '03',
    title: 'Multi-Dimensional Algorithmic Synthesis',
    desc: 'Our assessment engine processes responses across Big Five, Cattell-Horn-Carroll cognitive factors, and Holland RIASEC interest matrices.',
    details: 'Calculates objective percentiles, quantitative ceilings, and stream compatibility indices without subjective human bias.',
    icon: Cpu,
  },
  {
    step: '04',
    title: '50+ Page Universal Executive Dossier',
    desc: 'A comprehensive, publication-quality report is generated with visual charts, percentile breakdowns, and grade-tailored pathways.',
    details: 'Includes personalized strengths, growth vectors, 90-day study plans, and parental discussion frameworks.',
    icon: FileCheck2,
  },
  {
    step: '05',
    title: 'Counsellor Strategy Consultation',
    desc: 'Families can optionally sit down with a certified CLARVO education counsellor to interpret the dossier and align goals.',
    details: 'Transforms diagnostic numbers into a cohesive 3-to-5-year academic, stream, and global university admissions plan.',
    icon: Users,
  },
];

export default function AssessmentJourney() {
  return (
    <section
      id="journey"
      aria-label="The Five Steps of the CLARVO Assessment Journey"
      className="w-full py-16 sm:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-bold text-[#1258DE] bg-[#E8F0FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-dmsans">
            Predictable & Transparent Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-dmsans text-[#080F1C] tracking-tight">
            How the assessment journey unfolds
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] font-dmsans leading-relaxed">
            From first calibration to a detailed family roadmap, our structured process replaces anxiety with structured clarity.
          </p>
        </div>

        {/* 5-Step Connected Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {JOURNEY_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl bg-[#F8FAFC] border border-[#E4E7EC] p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-anton text-[#BFDBFE] font-bold">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#E8F0FF] flex items-center justify-center text-[#1258DE]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-[#080F1C] font-dmsans leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E2E8F0] text-[11px] text-[#475569] font-medium leading-normal">
                  {item.details}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA inline */}
        <div className="mt-12 text-center">
          <Link
            href="/psychometric-test"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#1258DE] hover:bg-[#0F47B8] shadow-sm transition-colors"
          >
            <span>Begin Step 01: Profile Calibration</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}

