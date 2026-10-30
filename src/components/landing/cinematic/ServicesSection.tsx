'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Brain, 
  Compass, 
  Award, 
  GraduationCap, 
  Globe, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ServiceItem {
  id: string;
  stepNumber: string;
  title: string;
  tag: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  actionText: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'psychometric',
    stepNumber: '01',
    title: 'Psychometric Assessments & Student Insights',
    tag: 'Grades 7–12',
    description: 'Scientifically evaluate cognitive agility, RIASEC vocational interests, Big Five behavioral traits, and VARK learning styles.',
    href: '/psychometric-test',
    icon: <Brain className="w-5 h-5 text-[#2563EB]" />,
    actionText: 'Take Diagnostic',
  },
  {
    id: 'roadmaps',
    stepNumber: '02',
    title: 'Personalised Career Guidance & Roadmaps',
    tag: '147+ Pathways',
    description: 'Map Class 10 stream choices (PCM, PCB, Commerce, Humanities) to 4-year degree requirements and career milestones.',
    href: '/career-library',
    icon: <Compass className="w-5 h-5 text-[#2563EB]" />,
    actionText: 'Explore Roadmaps',
  },
  {
    id: 'sat',
    stepNumber: '03',
    title: 'SAT Preparation',
    tag: 'Digital SAT 1500+',
    description: 'Diagnostic adaptive mocks, targeted error analysis, pacing strategy, and personalized score acceleration coaching.',
    href: '/iq-test',
    icon: <Award className="w-5 h-5 text-[#2563EB]" />,
    actionText: 'SAT Diagnostics',
  },
  {
    id: 'tutoring',
    stepNumber: '04',
    title: 'One-to-One Tutoring',
    tag: 'Elite Mentors',
    description: 'Individualised academic learning support across IB, Cambridge (IGCSE/A-Levels), CBSE and ICSE secondary curricula.',
    href: '/book-a-demo',
    icon: <GraduationCap className="w-5 h-5 text-[#2563EB]" />,
    actionText: 'Book Advisory',
  },
  {
    id: 'profile',
    stepNumber: '05',
    title: 'University Profile Building',
    tag: 'Admissions & Spikes',
    description: 'Produce original academic research papers, build cohesive extracurricular spikes, and shortlist premier global universities.',
    href: '/university-finder',
    icon: <Globe className="w-5 h-5 text-[#2563EB]" />,
    actionText: 'Match Colleges',
  },
];

export default function ServicesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section 
      id="services" 
      className="scroll-mt-20 sm:scroll-mt-24 px-3.5 sm:px-6 md:px-10 py-10 sm:py-16 md:py-20 bg-[#F8FAFC] border-b border-[#E4E7EC]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.4 }}
          className="text-left mb-6 sm:mb-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FF] border border-[#2563EB]/20 text-[#2563EB] text-[10.5px] sm:text-[11px] font-bold tracking-[0.14em] uppercase mb-2.5">
            <Sparkles className="w-3 h-3" />
            <span>THE FIVE PILLARS OF CLARVO</span>
          </div>
          <h2 className="text-[24px] xs:text-[28px] sm:text-[34px] md:text-[40px] font-black tracking-[-0.04em] text-[#080F1C] leading-[1.12]">
            Comprehensive Support for Every Stage
          </h2>
          <p className="mt-2 text-[13.5px] sm:text-[15.5px] text-[#475569] leading-relaxed">
            From early aptitude discovery and stream choice to standardized tests and university admissions—every service is built for student ambition and family clarity.
          </p>
        </motion.div>

        {/* Services Cards: 1 column on mobile, 2 on tablet, 3 on desktop, 5 on wide screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ 
                duration: shouldReduceMotion ? 0.05 : 0.35, 
                delay: shouldReduceMotion ? 0 : index * 0.05 
              }}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
              className="h-full"
            >
              <Link
                href={service.href}
                className="group h-full bg-white border border-[#E4E7EC] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 cursor-pointer"
              >
                <div>
                  {/* Top Row: Icon + Number + Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#E8F0FF] border border-[#BFDBFE]/60 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#2563EB] transition-all duration-200">
                        <div className="group-hover:text-white transition-colors duration-200">
                          {service.icon}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-black text-[#94A3B8] group-hover:text-[#2563EB] transition-colors">
                        {service.stepNumber}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#E2E8F0] shrink-0">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[15px] sm:text-[16px] font-extrabold text-[#080F1C] group-hover:text-[#2563EB] transition-colors leading-snug mb-1.5 min-h-[42px] flex items-center">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[12.5px] sm:text-[13px] text-[#64748B] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Action Affordance */}
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] font-bold text-[#2563EB]">
                  <span>{service.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
