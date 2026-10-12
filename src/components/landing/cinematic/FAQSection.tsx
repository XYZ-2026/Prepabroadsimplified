'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What age group and grades does CLARVO cater to?',
    a: 'CLARVO is specifically architected for students in Grades 7 through 12, with grade-tailored diagnostic assessments, stream selection guidance for Class 10, SAT coaching, and university profile building for Class 11 and 12.',
  },
  {
    q: 'How does the 30-module Psychometric Assessment determine stream and career fit?',
    a: 'Our assessment evaluates cognitive agility, RIASEC vocational interests, Big Five behavioral traits, and VARK learning preferences to generate scientifically validated stream and career recommendations without guesswork.',
  },
  {
    q: 'How does High School Research & Profile Building work?',
    a: 'Students are paired with seasoned research mentors to produce original academic research papers, aiming for publication in indexed, peer-reviewed international high school and undergraduate journals.',
  },
  {
    q: 'Can parents participate in counseling and review assessment reports?',
    a: 'Yes! CLARVO generates clear, comprehensive reports for families and offers dedicated 1-on-1 counselor strategy sessions to align parental aspirations with the student’s verified aptitude.',
  },
];

export default function FAQSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="faq" className="scroll-mt-20 sm:scroll-mt-24 my-16 sm:my-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#2563EB] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 className="text-[28px] sm:text-[38px] md:text-[46px] font-black text-[#080F1C] tracking-[-0.03em]">
          Everything You Need to Know About CLARVO
        </h2>
        <p className="mt-3 text-[#64748B] text-[15px] sm:text-[16px] max-w-xl mx-auto">
          Got questions about student assessments, Class 10 stream choices, SAT prep, or research mentoring? We have answers.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
      >
        {FAQS.map((item, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: shouldReduceMotion ? 0.05 : 0.4 },
              },
            }}
            whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
            className="p-6 sm:p-7 bg-white rounded-[20px] border border-[#E2E8F0] shadow-xs hover:border-[#2563EB]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#080F1C] mb-3 leading-snug">
                {item.q}
              </h3>
              <p className="text-[#475569] text-[14px] leading-relaxed">
                {item.a}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[11px] font-bold text-[#2563EB] flex items-center gap-1">
              <span>Verified Policy</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
