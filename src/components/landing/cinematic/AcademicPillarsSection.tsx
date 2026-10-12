'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PILLARS = [
  { code: 'G7-8', badge: 'MIDDLE SCHOOL', name: 'Grades 7–8 Foundation', count: 'Aptitude Exploration', desc: 'Diagnostic testing, cognitive aptitude, and early STEM & humanities exploration.', href: '/discover' },
  { code: 'G9-10', badge: 'STREAM FIT', name: 'Grades 9–10 Stream Choice', count: 'High-Stakes Decision', desc: 'Scientific alignment for PCM, PCB, Commerce & Humanities selection with RIASEC fitment.', href: '/discover' },
  { code: 'G11-12', badge: 'SENIOR HIGH', name: 'Grades 11–12 Admissions', count: 'University Readiness', desc: 'Competitive university shortlisting, entrance exam prep & scholarship strategies.', href: '/discover' },
  { code: 'SAT', badge: 'DIGITAL SAT', name: 'Digital SAT 1500+ Prep', count: 'Adaptive Mastery', desc: 'Diagnostic adaptive mock tests, question banks, and 1-on-1 expert coaching.', href: '/iq-test' },
  { code: 'RES', badge: 'RESEARCH', name: 'Research & Publications', count: 'Peer-Reviewed Journals', desc: 'Mentored academic research papers published in indexed high school journals.', href: '/discover' },
  { code: '1-ON-1', badge: 'TUTORING', name: '1-to-1 Private Tutoring', count: 'Elite Subject Experts', desc: 'Personalized tutoring across IB, Cambridge (IGCSE/A-Levels), CBSE & ICSE curricula.', href: '/book-a-demo' },
  { code: 'PSY', badge: 'DIAGNOSTICS', name: 'Psychometric Battery', count: '30 Dimensions Assessed', desc: 'Cognitive agility, Big Five personality traits, RIASEC codes, and learning styles.', href: '/psychometric-test' },
  { code: 'ROAD', badge: 'STRATEGY', name: 'AI Career Roadmap', count: 'Multi-Year Milestones', desc: 'Dynamic step-by-step roadmap from Grade 8 through graduation, internships & admissions.', href: '/career-roadmap' },
  { code: 'UNI', badge: 'PREDICTOR', name: 'Global University Matcher', count: '500+ Top Global Colleges', desc: 'Data-driven admit chance estimations for Ivy League, Russell Group & top STEM institutes.', href: '/university-finder' },
  { code: 'ADV', badge: 'ADVISORY', name: 'Parent & Counselor Advisory', count: 'Strategic Sessions', desc: 'Direct consultations with educational psychologists and Ivy League alumni.', href: '/book-a-demo' },
];

export default function AcademicPillarsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="programs" className="scroll-mt-20 sm:scroll-mt-24 px-4 sm:px-6 md:px-10 py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#E4E7EC]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#2563EB] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
              ACADEMIC EXCELLENCE
            </div>
            <h2 className="text-[28px] sm:text-[36px] md:text-[46px] font-black tracking-[-0.04em] text-[#080F1C]">
              Grade-Specific Pathways &amp; Academic Pillars
            </h2>
            <p className="mt-2 text-[15px] sm:text-[16px] text-[#667085] max-w-2xl">
              Specialized developmental programs engineered specifically for students across Grades 7 through 12.
            </p>
          </div>

          <Link
            href="/discover"
            className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-bold shadow-xs inline-flex items-center gap-2 shrink-0 self-start sm:self-auto transition-all cursor-pointer hover:shadow-md"
          >
            <span>Explore All Modules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* 10 Pillar Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5"
        >
          {PILLARS.map((item) => (
            <motion.div
              key={item.code}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.05 : 0.4 },
                },
              }}
              whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.15 } }}
              className="h-full"
            >
              {item.href.startsWith('http') ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#F8FAFC] border border-[#E2E8F0] rounded-[18px] p-5 sm:p-6 hover:border-[#2563EB] hover:bg-white transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between h-full min-h-[250px] cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-black text-[#2563EB] bg-[#E8F0FF] px-2.5 py-0.5 rounded-md uppercase border border-[#BFDBFE]">
                        {item.code}
                      </span>
                      <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[#080F1C] mb-1 min-h-[44px] flex items-center leading-snug">
                      {item.name}
                    </h3>

                    <div className="text-[12px] font-bold text-[#2563EB] mb-2">
                      {item.count}
                    </div>

                    <p className="text-[12px] text-[#64748B] leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                    <span>Book Session</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="group bg-[#F8FAFC] border border-[#E2E8F0] rounded-[18px] p-5 sm:p-6 hover:border-[#2563EB] hover:bg-white transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between h-full min-h-[250px] cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-black text-[#2563EB] bg-[#E8F0FF] px-2.5 py-0.5 rounded-md uppercase border border-[#BFDBFE]">
                        {item.code}
                      </span>
                      <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[#080F1C] mb-1 min-h-[44px] flex items-center leading-snug">
                      {item.name}
                    </h3>

                    <div className="text-[12px] font-bold text-[#2563EB] mb-2">
                      {item.count}
                    </div>

                    <p className="text-[12px] text-[#64748B] leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                    <span>Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
