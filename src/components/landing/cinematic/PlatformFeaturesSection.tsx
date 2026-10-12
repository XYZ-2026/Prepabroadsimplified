'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    num: '01',
    title: 'Psychometric Battery',
    desc: '30-module evaluation assessing cognitive agility, Big Five behavioral traits, RIASEC career fitments, and VARK learning styles.',
    href: '/psychometric-test',
    linkText: 'Launch Assessment →',
  },
  {
    num: '02',
    title: 'AI Career Roadmap',
    desc: 'Predictive multi-year roadmap from Grade 8 through graduation, mapping internships, high school milestones, and college entry.',
    href: '/career-roadmap',
    linkText: 'View Career Roadmap →',
  },
  {
    num: '03',
    title: 'Digital SAT Accelerator',
    desc: 'Score diagnostics, adaptive drills, and 1-on-1 tutoring engineered to target 1500+ on the Digital SAT.',
    href: '/iq-test',
    linkText: 'Take SAT Diagnostic →',
  },
  {
    num: '04',
    title: 'Research & Publications',
    desc: 'Original high school research papers mentored by scholars and published in indexed academic journals.',
    href: '/discover',
    linkText: 'Explore Research →',
  },
  {
    num: '05',
    title: 'Global University Matcher',
    desc: 'Admit odds calculations and program shortlisting across 500+ Ivy League, Russell Group, and international institutes.',
    href: '/university-finder',
    linkText: 'Explore Universities →',
  },
  {
    num: '06',
    title: '1-to-1 Expert Mentorship',
    desc: 'Direct strategy sessions with certified educational psychologists and admissions advisors to support the whole family.',
    href: '/book-a-demo',
    linkText: 'Book Strategy Session →',
  },
];

export default function PlatformFeaturesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="features" className="scroll-mt-20 sm:scroll-mt-24 px-4 sm:px-6 md:px-10 py-16 sm:py-24 bg-[#F8FAFC] border-b border-[#E4E7EC]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
          className="flex flex-col lg:flex-row justify-between gap-8 border-b border-[#CBD5E1] pb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#2563EB] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
              PLATFORM FEATURES
            </div>
            <h2 className="text-[28px] sm:text-[38px] md:text-[50px] leading-[1.08] font-black tracking-[-0.05em] text-[#080F1C]">
              Everything you need <br />
              to achieve academic clarity
            </h2>
          </div>
          <div className="max-w-full lg:max-w-[360px] text-left lg:text-right text-[#64748B] text-[14px] sm:text-[15px] leading-relaxed pt-2">
            From psychometric discovery to final university acceptance — every tool you need in one unified ecosystem.
          </div>
        </motion.div>

        {/* Bento Grid */}
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
          className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-[#CBD5E1] rounded-[22px] overflow-hidden bg-[#E2E8F0] gap-[1px]"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.num}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.05 : 0.4 },
                },
              }}
              whileHover={shouldReduceMotion ? {} : { backgroundColor: '#F8FAFC' }}
              className="bg-[#FFFFFF] min-h-[220px] sm:min-h-[270px] p-6 sm:p-8 transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="text-[#2563EB] text-[16px] font-black font-mono">
                  {feature.num}
                </div>
                <h3 className="mt-4 text-[20px] sm:text-[22px] font-extrabold tracking-[-0.03em] text-[#080F1C]">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-[13px] sm:text-[14px] leading-relaxed text-[#64748B]">
                  {feature.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F1F5F9]">
                {feature.href.startsWith('http') ? (
                  <a
                    href={feature.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1.5 transition-all group-hover:translate-x-0.5"
                  >
                    <span>{feature.linkText}</span>
                  </a>
                ) : (
                  <Link
                    href={feature.href}
                    className="text-[13px] font-bold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1.5 transition-all group-hover:translate-x-0.5"
                  >
                    <span>{feature.linkText}</span>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
