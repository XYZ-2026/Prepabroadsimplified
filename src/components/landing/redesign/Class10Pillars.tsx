'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Target, TrendingUp, ArrowRight, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { Container, SectionHeading, Button } from './primitives';

interface PillarItem {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  highlight: string;
}

const PILLARS: PillarItem[] = [
  {
    num: '01',
    title: 'Aptitude over assumptions',
    desc: 'Empirical measurement of numerical stamina, fluid logic, and spatial reasoning proves whether rigorous STEM or Commerce is genuinely aligned with your child’s cognitive architecture.',
    icon: <Target className="w-5 h-5 text-[#1258DE]" />,
    highlight: 'Zero guesswork in stream selection',
  },
  {
    num: '02',
    title: 'Eliminating costly stream switches',
    desc: 'Over 40% of secondary school students switch streams after Class 11 due to peer pressure and societal assumptions. Clarvo provides empirical proof before school registration deadlines.',
    icon: <ShieldCheck className="w-5 h-5 text-[#1258DE]" />,
    highlight: '99.1% verified stream satisfaction',
  },
  {
    num: '03',
    title: '4-year university trajectory',
    desc: 'Class 10 stream choices are not merely for school board examinations—they directly determine undergraduate eligibility across 100+ modern professions and premier global universities.',
    icon: <TrendingUp className="w-5 h-5 text-[#1258DE]" />,
    highlight: 'Mapped to 500+ global colleges',
  },
];

export default function Class10Pillars() {
  return (
    <section 
      aria-label="Class 10 Strategic Value"
      className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FB] border-b border-[#DDE3F0]"
    >
      <Container>
        {/* Section Heading: Strictly sentence case, no tracked all-caps eyebrows */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <SectionHeading
            title="Class 10 strategic stream selection"
            subtitle="Eliminating stream regret before subject registration deadlines. Why verified diagnostic evidence matters before choosing PCM, PCB, Commerce, or Humanities."
          />
        </div>

        {/* 3 Pillars Grid: Responsive on tablet portrait */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {PILLARS.map((pillar, pIdx) => (
            <div
              key={pillar.num}
              className={`bg-white rounded-[24px] sm:rounded-[28px] border border-[#DDE3F0] p-6 sm:p-8 flex flex-col justify-between hover:border-[#1258DE] transition-all duration-200 group shadow-xs hover:shadow-clarvo-elevated ${
                pIdx === 2 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-[#E6EDFF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {pillar.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#8D96AA]">
                    Pillar {pillar.num}
                  </span>
                </div>

                <h3 className="text-xl font-dmsans font-bold text-[#12131C] tracking-tight mb-2.5 group-hover:text-[#1258DE] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-[#5B6275] font-dmsans">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#DDE3F0] flex items-center gap-1.5 text-xs font-dmsans font-bold text-[#1258DE]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1258DE] shrink-0" />
                <span>{pillar.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 sm:mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="md"
            href="/book-a-demo"
            icon={<ArrowRight className="w-4 h-4" />}
            elevated
          >
            Request full sample report
          </Button>

          <Button
            variant="secondary"
            size="md"
            href="/sample-reports"
          >
            Explore report gallery
          </Button>
        </div>
      </Container>
    </section>
  );
}

