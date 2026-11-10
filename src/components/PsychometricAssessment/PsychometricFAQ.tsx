'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'What is the difference between a psychometric assessment and an academic or IQ test?',
    answer:
      'An academic test measures knowledge recall in specific school subjects, and an IQ test attempts to measure abstract problem-solving under strict time constraints. A psychometric assessment is fundamentally different: it evaluates natural behavioral traits, cognitive processing inclinations, learning modalities (VARK), and vocational affinities (RIASEC). There is no "pass" or "fail", and it does not assign a clinical or intellectual label. Instead, it provides an objective baseline to help families make informed stream, subject, and university choices.',
  },
  {
    question: 'How should my child prepare for the 30-module assessment?',
    answer:
      'No preparation, coaching, or revision is required or recommended. The assessment is designed to measure spontaneous, authentic cognitive and behavioral responses. Studying beforehand creates artificial bias and obscures genuine natural strengths. Students should simply take the assessment in a quiet, distraction-free environment when well-rested.',
  },
  {
    question: 'How does the assessment assist Class 10 students in choosing an academic stream?',
    answer:
      'In Phase IV (Alignment), the assessment maps the student’s quantitative, verbal, and abstract problem-solving profiles against empirical benchmarks required for Science (PCM/PCB), Commerce, and Humanities. It evaluates whether the student has the quantitative endurance for higher mathematics, the spatial agility for engineering, the biological memory indexing for medical fields, or the strategic reasoning for business and legal studies.',
  },
  {
    question: 'Can parents participate in reviewing the findings?',
    answer:
      'Yes, absolutely. The resulting 50+ page executive dossier contains a dedicated "Family Alignment & Parental Guide" section. This outlines specific home study strategies, communication vectors, and recommended conversation frameworks so parents and students can align expectations without friction.',
  },
  {
    question: 'How long does the assessment take to complete?',
    answer:
      'The assessment takes approximately 45 to 60 minutes in total. It is split across four distinct phases covering 30 self-contained modules. Students can take short breaks between phases to avoid cognitive fatigue.',
  },
  {
    question: 'Is student data confidential and protected?',
    answer:
      'All candidate responses, percentile rankings, and generated reports are strictly confidential. CLARVO never sells data, shares candidate scores with schools without explicit parental consent, or publishes student profiles. Sample reports on our site feature 100% fictional synthetic profiles.',
  },
];

export default function PsychometricFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions about CLARVO Psychometric Assessment"
      className="w-full py-16 sm:py-24 bg-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#1258DE] text-xs font-bold font-dmsans">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-dmsans text-[#080F1C] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] font-dmsans max-w-xl mx-auto">
            Everything students, parents, and counsellors need to know about the diagnostic process and reporting.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#2563EB] bg-[#F8FAFC] shadow-xs'
                    : 'border-[#E4E7EC] bg-white hover:border-[#CBD5E1]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1258DE]"
                >
                  <span className="font-bold font-dmsans text-base sm:text-lg text-[#080F1C]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#1258DE] text-white rotate-180'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#475569] font-dmsans leading-relaxed border-t border-[#EDF2F7]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

