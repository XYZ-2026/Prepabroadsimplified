'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { Container, SectionHeading } from './primitives';

interface FAQItem {
  q: string;
  a: string;
  tag?: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    q: 'What age group and grades does Clarvo cater to?',
    a: 'Clarvo is specifically architected for students in Grades 7 through 12, with grade-tailored diagnostic assessments, stream selection guidance for Class 10, Digital SAT coaching, faculty-led research, and university profile building for Classes 11 and 12.',
    tag: 'Grade Coverage',
  },
  {
    q: 'How does the 30-module Psychometric Assessment determine stream and career fit?',
    a: 'Our diagnostic battery evaluates fluid cognitive agility, RIASEC vocational interests, Big Five behavioral persistence, and VARK learning preferences to generate scientifically validated stream and career recommendations without guesswork.',
    tag: 'Scientific Methodology',
  },
  {
    q: 'How does High School Research & Profile Building work?',
    a: 'Students are paired 1-on-1 with university faculty and published research mentors to author original academic research papers, aiming for publication in indexed, peer-reviewed international high school and undergraduate journals.',
    tag: 'Research & Publications',
  },
  {
    q: 'Can parents participate in counseling and review assessment reports?',
    a: 'Yes! Clarvo generates clear, comprehensive reports for families and offers dedicated 1-on-1 counselor strategy sessions to align parental aspirations with the student’s verified aptitude.',
    tag: 'Family Guidance',
  },
  {
    q: 'How does Clarvo help with study abroad admissions?',
    a: 'We guide students from Class 8 to 12 through study abroad planning for the USA, UK, Canada, Australia, Europe and Asia: course and country fit, university shortlisting, SAT preparation, essays and SOPs, application tracking, document checklists and visa interview preparation.',
    tag: 'Study Abroad',
  },
  {
    q: 'Do you help with Indian university admissions as well?',
    a: 'Yes. Many families apply in India and abroad together. We help with stream selection after Class 10, planning for entrance routes such as CUET, JEE, NEET and CLAT, and applications to leading private universities that review essays, activities and interviews.',
    tag: 'Indian Universities',
  },
  {
    q: 'My child is applying for 2027 admissions. Is it too late to start?',
    a: 'No. Many 2027 deadlines, including US Regular Decision, the main UCAS deadline, most Indian entrance exams and private university rounds, fall between January and June 2027. We help Class 12 students prioritise deadlines, finalise university lists and complete strong applications.',
    tag: 'Admissions 2027',
  },
  {
    q: 'Can you help my child find summer programs and research programs?',
    a: 'Yes. As part of profile building, our counsellors shortlist summer programs and research programs that fit the student’s interests and target universities, and our mentor-led research program helps students in Classes 9–12 write and submit an original research paper.',
    tag: 'Summer & Research',
  },
  {
    q: 'How is Clarvo different from conventional coaching centers or school career fairs?',
    a: 'Unlike coaching institutes that push every student into generic engineering or medical coaching batches, Clarvo is an objective diagnostic and strategy platform. We do not sell test-prep coaching batches; our sole purpose is empirical fitment, cognitive measurement, and multi-year clarity for families.',
    tag: 'Objective Advisory',
  },
  {
    q: 'What is the Entrepreneurship Programme format and duration?',
    a: 'The Entrepreneurship Programme runs for 1 year online for high-school students in Grades 8 through 12. Students work with active startup founders, ideating, validating prototypes, and launching real-world initiatives without disrupting school schedules.',
    tag: 'Entrepreneurship',
  },
];

export default function AccordionFAQ() {
  // First item open by default
  const [openIdx, setOpenIdx] = useState<number>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section 
      id="faq"
      aria-label="Frequently Asked Questions"
      className="scroll-mt-20 py-16 sm:py-20 lg:py-24 bg-white border-b border-[#DDE3F0]"
    >
      <Container>
        {/* Section Heading: Strictly sentence case, no tracked all-caps eyebrows */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <SectionHeading
            title="Frequently asked questions"
            subtitle="Everything you need to know about our diagnostic assessments, stream selection, research mentorship, and university admissions strategy."
          />
        </div>

        {/* ── Accessible Accordion ── */}
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const btnId = `faq-btn-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <div 
                key={idx}
                className={`rounded-[20px] sm:rounded-[22px] border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#F5F7FB] border-[#1258DE] shadow-xs'
                    : 'bg-white border-[#DDE3F0] hover:border-[#CBD5E1]'
                }`}
              >
                {/* Accordion Button */}
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-[#1258DE] focus-visible:ring-inset rounded-[20px]"
                >
                  <div className="space-y-1 pr-2">
                    {faq.tag && (
                      <span className={`text-[11px] font-dmsans font-bold uppercase tracking-wider block transition-colors ${
                        isOpen ? 'text-[#1258DE]' : 'text-[#767E94]'
                      }`}>
                        {faq.tag}
                      </span>
                    )}
                    <h3 className="text-[15px] sm:text-[17px] font-dmsans font-bold text-[#12131C] leading-snug">
                      {faq.q}
                    </h3>
                  </div>

                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-250 border ${
                      isOpen
                        ? 'bg-[#1258DE] text-white border-[#1258DE] rotate-180'
                        : 'bg-white text-[#767E94] border-[#DDE3F0]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Panel: Height animation 250ms via CSS Grid transition */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`grid transition-[grid-template-rows] duration-250 ease-out overflow-hidden ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-[#DDE3F0]/60 mt-1">
                      <p className="text-[14px] sm:text-[15px] text-[#5B6275] leading-relaxed font-dmsans pt-3">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
}

