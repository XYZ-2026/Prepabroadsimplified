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
    title: 'Psychometric Assessments',
    tag: 'Grades 7–12',
    description: 'Explore strengths, interests, cognitive traits and learning patterns through standardized evaluation.',
    href: '/psychometric-test',
    icon: <Brain className="w-5 h-5 text-[#2563EB]" />,
    actionText: 'Take Assessment',
  },
  {
    id: 'roadmaps',
    title: 'Personalised Career Roadmaps',
    tag: '147+ Pathways',
    description: 'Understand possible career paths, subject combination prerequisites and milestone timelines.',
    href: '/career-roadmap',
    icon: <Compass className="w-5 h-5 text-[#2563EB]" />,
    actionText: 'Explore Roadmaps',
  },
  {
    id: 'sat',
    title: 'SAT Preparation',
    tag: 'Digital SAT 1500+',
    description: 'Targeted academic support, diagnostic adaptive mocks and high-score strategies.',
    href: '/iq-test',
    icon: <Award className="w-5 h-5 text-[#2563EB]" />,
    actionText: 'SAT Diagnostics',
  },
  {
    id: 'tutoring',
    title: '1-to-1 Tutoring',
    tag: 'Elite Mentors',
    description: 'Individualised academic learning support across IB, Cambridge, CBSE and ICSE curricula.',
    href: '/book-a-demo',
    icon: <GraduationCap className="w-5 h-5 text-[#2563EB]" />,
    actionText: 'Book Advisory',
  },
  {
    id: 'profile',
    title: 'University Profile Building',
    tag: 'Admissions & Spikes',
    description: 'Explore research paper opportunities, peer-reviewed publications and competitive admissions portfolios.',
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
      className="scroll-mt-20 sm:scroll-mt-24 px-4 sm:px-6 md:px-10 py-10 sm:py-16 md:py-20 bg-[#F8FAFC] border-b border-[#E4E7EC]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.4 }}
          className="text-left mb-7 sm:mb-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FF] border border-[#2563EB]/20 text-[#2563EB] text-[11px] font-bold tracking-[0.16em] uppercase mb-3">
            <Sparkles className="w-3 h-3" />
            <span>OUR CORE SERVICES</span>
          </div>
          <h2 className="text-[26px] xs:text-[30px] sm:text-[36px] md:text-[42px] font-black tracking-[-0.04em] text-[#080F1C] leading-[1.12]">
            Support for Every Next Step
          </h2>
          <p className="mt-2.5 text-[14px] sm:text-[16px] text-[#475569] leading-relaxed">
            Explore how CLARVO can support your child&apos;s academic development and future planning.
          </p>
        </motion.div>

        {/* Services Cards: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ 
                duration: shouldReduceMotion ? 0.05 : 0.35, 
                delay: shouldReduceMotion ? 0 : index * 0.06 
              }}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.15 } }}
              className="h-full"
            >
              <Link
                href={service.href}
                className="group h-full bg-white border border-[#E4E7EC] rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] transition-all duration-200 cursor-pointer"
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F0FF] border border-[#BFDBFE]/60 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#2563EB] transition-all duration-200">
                      <div className="group-hover:text-white transition-colors duration-200">
                        {service.icon}
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold text-[#64748B] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#E2E8F0]">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[#080F1C] group-hover:text-[#2563EB] transition-colors leading-snug mb-1.5">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] sm:text-[13.5px] text-[#64748B] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Action Affordance */}
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[12.5px] font-bold text-[#2563EB]">
                  <span>{service.actionText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
