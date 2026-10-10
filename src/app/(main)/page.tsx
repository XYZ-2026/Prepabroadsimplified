import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'CLARVO — Clarity for Their Future | Student Development Platform',
  description:
    'Empowering students in Grades 7–12 with psychometric assessments, personalized career roadmaps, elite SAT preparation, 1-to-1 tutoring, and university profile building.',
  keywords: [
    'CLARVO',
    'student development',
    'psychometric assessment',
    'stream selection class 10',
    'career guidance',
    'SAT preparation',
    'one-to-one tutoring',
    'research paper publication high school',
    'university admissions predictor',
    'Simplified Eduventures',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CLARVO — Clarity for Their Future | Student Development Platform',
    description:
      'Empowering students in Grades 7–12 with psychometric assessments, personalized career roadmaps, elite SAT preparation, 1-to-1 tutoring, and university profile building.',
    url: 'https://clarvo.in',
    siteName: 'CLARVO',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://clarvo.in/#organization',
      name: 'CLARVO',
      url: 'https://clarvo.in',
      parentOrganization: {
        '@type': 'Organization',
        name: 'Simplified Eduventures',
        url: 'https://simplifiededuventures.com',
      },
      description:
        'A premium student development platform for Grades 7–12 offering psychometric assessments, stream selection, SAT prep, 1-to-1 tutoring, and research profile building.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://clarvo.in/#website',
      url: 'https://clarvo.in',
      name: 'CLARVO',
      publisher: { '@id': 'https://clarvo.in/#organization' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://clarvo.in/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What age group and grades does CLARVO cater to?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'CLARVO is specifically architected for students in Grades 7 through 12, with grade-tailored diagnostic assessments, stream selection guidance for Class 10, SAT coaching, and university profile building for Class 11 and 12.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the 30-module Psychometric Assessment determine career and stream fit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our assessment evaluates cognitive agility, RIASEC vocational interests, Big Five personality traits, and VARK learning preferences to generate scientifically validated stream and career recommendations.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does High School Research & Profile Building work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Students are paired with seasoned research mentors to produce original academic research papers, aiming for publication in indexed, peer-reviewed international high school and undergraduate journals.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can parents participate in counseling and review assessment reports?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! CLARVO generates clear, comprehensive reports for families and offers dedicated 1-on-1 counselor strategy sessions to align parental aspirations with the student\'s verified aptitude.',
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC] text-[#080F1C] overflow-x-hidden font-sans min-h-screen flex flex-col selection:bg-[#2563EB] selection:text-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════════════════════════════════════════════════════════
         NAVBAR — Floating pill navbar + auth links
         ═══════════════════════════════════════════════════════════════ */}
      <LandingNavbar />

      <main>
        {/* ═══════════════════════════════════════════════════════════════
           HERO SECTION — 2-Column Exact Abroad Layout with CLARVO Theme
           ═══════════════════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 sm:py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14 lg:gap-20 items-center">
          {/* LEFT */}
          <div className="max-w-[540px] w-full">
            <div className="flex items-center gap-2.5 text-[#2563EB] text-[11px] tracking-[0.18em] uppercase font-bold mb-6">
              <span className="w-[6px] h-[6px] rounded-full bg-[#2563EB] animate-pulse" />
              AI-POWERED STUDENT DEVELOPMENT · GRADES 7–12
            </div>

            <h1 className="text-[32px] xs:text-[38px] sm:text-[46px] md:text-[56px] lg:text-[64px] leading-[1.05] tracking-[-0.05em] font-extrabold text-[#080F1C] break-words">
              Clarity for
              <br />
              <span className="text-[#2563EB]">
                Their Future.
              </span>
              <br />
              Built for Ambition.
            </h1>

            <p className="mt-5 sm:mt-7 text-[15px] md:text-[16px] leading-7 sm:leading-8 text-[#64748B] max-w-[500px]">
              Empowering students in Grades 7–12 with psychometric assessments, personalized career roadmaps, elite SAT preparation, 1-to-1 tutoring, and university profile building.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 w-full">
              <Link
                href="/auth?tab=register"
                className="h-[52px] sm:h-[54px] px-7 rounded-[10px] bg-[#2563EB] text-white text-[15px] font-bold inline-flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:bg-[#1D4ED8] hover:scale-[1.01] transition-all w-full sm:w-auto text-center cursor-pointer"
              >
                Start Assessment Free →
              </Link>
              <Link
                href="/discover"
                className="h-[52px] sm:h-[54px] px-7 rounded-[10px] border border-[#2563EB]/20 text-[#2563EB] text-[15px] font-semibold inline-flex items-center justify-center hover:bg-[#2563EB]/5 transition-all w-full sm:w-auto text-center"
              >
                Explore Academic Pillars
              </Link>
            </div>

            {/* STATS UNDER HERO */}
            <div className="flex flex-row flex-wrap gap-4 sm:gap-7 border-t border-[#E2E8F0] pt-5 sm:pt-7 mt-8 sm:mt-10 text-[12px] sm:text-[13px] text-[#64748B]">
              <div>
                <strong className="text-[#080F1C] font-bold text-[14px] sm:text-[15px]">
                  15,000+
                </strong>{' '}
                students guided
              </div>
              <div>
                <strong className="text-[#080F1C] font-bold text-[14px] sm:text-[15px]">
                  98%
                </strong>{' '}
                parent clarity rate
              </div>
              <div>
                <strong className="text-[#080F1C] font-bold text-[14px] sm:text-[15px]">
                  100+
                </strong>{' '}
                global universities
              </div>
            </div>
          </div>

          {/* RIGHT CARD — Browser Window Mock Card */}
          <div className="w-full max-w-[500px] bg-white border border-[#E2E8F0] rounded-[18px] overflow-hidden shadow-sm mx-auto lg:mx-0 lg:justify-self-end">
            {/* TOP BAR */}
            <div className="h-12 sm:h-14 border-b border-[#F1F5F9] flex items-center gap-3 sm:gap-4 px-4 sm:px-5 bg-[#F8FAFC]">
              <div className="flex gap-[7px] shrink-0">
                <span className="w-[9px] h-[9px] rounded-full bg-[#E2E8F0]" />
                <span className="w-[9px] h-[9px] rounded-full bg-[#CBD5E1]" />
                <span className="w-[9px] h-[9px] rounded-full bg-[#94A3B8]" />
              </div>
              <div className="text-[11px] sm:text-[13px] text-[#64748B] font-medium truncate">
                AI Profile &amp; Career Evaluator — app.clarvo.in
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6">
              <div className="inline-flex px-3 py-1.5 rounded-[7px] bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold tracking-[0.12em] uppercase">
                GRADE 10 · CAREER &amp; STREAM CLARITY
              </div>

              <h3 className="mt-4 text-[18px] leading-[1.45] text-[#080F1C] font-bold">
                Recommended Pathway: Artificial Intelligence &amp; Computational Physics
              </h3>

              <div className="mt-3 flex flex-wrap justify-between text-[12px] sm:text-[13px] text-[#64748B] gap-2">
                <span>Class of 2027 · Verified Assessment Data</span>
                <span className="text-[#2563EB] font-bold">Fit Score: 94%</span>
              </div>

              <div className="w-full h-px bg-[#F1F5F9] my-4 sm:my-6" />

              {[
                { title: 'Cognitive & Analytical Aptitude', width: '94%' },
                { title: 'STEM & Technology Affinity', width: '91%' },
                { title: 'SAT & Quantitative Readiness', width: '88%' },
                { title: 'Research & Leadership Potential', width: '92%' },
              ].map((metric) => (
                <div
                  key={metric.title}
                  className="grid grid-cols-[1fr_auto] sm:grid-cols-[160px_1fr_36px] items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-[12px] sm:text-[13px] text-[#64748B]"
                >
                  <span className="font-medium text-[#334155] col-span-1 sm:col-span-1 truncate">{metric.title}</span>
                  <div className="hidden sm:block w-full h-[6px] bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                      style={{ width: metric.width }}
                    />
                  </div>
                  <span className="font-bold text-[#080F1C] text-right">{metric.width}</span>
                  <div className="col-span-2 sm:hidden w-full h-[5px] bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] rounded-full"
                      style={{ width: metric.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           STATS STRIP — Full-Width Dark Banner (#080F1C)
           ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-[#080F1C]">
          <div className="grid grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {[
              { num: '15,000+', text: 'STUDENTS GUIDED', accent: true },
              { num: '30+', text: 'EVALUATION MODULES', accent: false },
              { num: '100+', text: 'CAREER SPECIALISATIONS', accent: true },
              { num: '98%', text: 'PARENT CLARITY RATING', accent: false },
            ].map((item) => (
              <div
                key={item.text}
                className="h-[120px] sm:h-[145px] border-r border-b lg:border-b-0 border-slate-800 flex flex-col items-center justify-center p-3 sm:p-4 text-center"
              >
                <span
                  className={`text-[32px] sm:text-[40px] md:text-[46px] font-black leading-none ${
                    item.accent ? 'text-[#38BDF8]' : 'text-white'
                  }`}
                >
                  {item.num}
                </span>
                <p className="mt-2 sm:mt-3 text-[#94A3B8] text-[10px] sm:text-[12px] tracking-[0.14em] font-bold uppercase">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           THE STUDENT JOURNEY — Step process with connector line
           ═══════════════════════════════════════════════════════════════ */}
        <section id="journey" className="bg-[#F1F5F9] px-4 sm:px-5 md:px-8 py-12 sm:py-16 lg:py-24 text-center">
          <div className="text-[#2563EB] text-[12px] tracking-[0.22em] font-bold uppercase mb-4">
            THE STUDENT DEVELOPMENT JOURNEY
          </div>
          <h2 className="text-[28px] sm:text-[36px] md:text-[50px] font-extrabold tracking-[-0.04em] text-[#080F1C] px-2">
            From self-discovery to Ivy League &amp; top university acceptance
          </h2>

          <div className="max-w-7xl mx-auto mt-10 sm:mt-14 relative">
            <div className="hidden lg:block absolute top-5 left-[9%] w-[82%] h-px bg-[#BFDBFE]" />

            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 relative z-10">
              {[
                { num: '01', title: 'Discovery', desc: '30-factor psychometric and cognitive diagnostic', active: true },
                { num: '02', title: 'Stream & Subjects', desc: 'Evidence-backed Class 11-12 stream mapping', active: false },
                { num: '03', title: 'Academic Mastery', desc: '1-to-1 tutoring & Digital SAT 1500+ prep', active: false },
                { num: '04', title: 'Profile & Research', desc: 'High school research publications & spike building', active: false },
                { num: '05', title: 'Global Admissions', desc: 'Shortlisting top global universities & applications', active: false },
              ].map((step) => (
                <div key={step.num} className="flex flex-col items-center w-[calc(50%-12px)] sm:w-[calc(33.333%-27px)] lg:w-[170px]">
                  <div
                    className={`w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] rounded-full flex items-center justify-center text-[14px] sm:text-[16px] font-black ${
                      step.active
                        ? 'bg-[#2563EB] text-white shadow-md'
                        : 'border-2 border-[#93C5FD] text-[#2563EB] bg-white'
                    }`}
                  >
                    {step.num}
                  </div>
                  <h3 className="mt-4 sm:mt-6 text-[16px] sm:text-[19px] font-bold text-[#080F1C]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[12px] sm:text-[14px] text-[#64748B] max-w-[170px] sm:max-w-[200px] text-center leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           ACADEMIC PILLARS & GRADE PATHWAYS — Grid layout (10 Cards)
           ═══════════════════════════════════════════════════════════════ */}
        <section id="programs" className="scroll-mt-24 sm:scroll-mt-28 px-4 sm:px-5 md:px-8 py-12 sm:py-16 lg:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-3">
              <div>
                <div className="text-[#2563EB] text-[12px] tracking-[0.2em] font-bold uppercase mb-3">
                  ACADEMIC EXCELLENCE
                </div>
                <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-extrabold tracking-[-0.04em] text-[#080F1C]">
                  Grade-Specific Pathways &amp; Academic Pillars
                </h2>
              </div>
              <Link
                href="/discover"
                className="px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-[13px] font-bold hover:bg-[#1D4ED8] transition-all shadow-sm inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <span>Explore All Modules</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-[16px] text-[#64748B] max-w-[650px]">
              Specialized developmental programs engineered specifically for students across Grades 7 through 12.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 mt-8 sm:mt-12">
              {[
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
              ].map((item) => (
                <Link
                  key={item.code}
                  href={item.href}
                  className="group bg-white border border-[#E2E8F0] rounded-[16px] p-5 sm:p-6 hover:border-[#2563EB] hover:-translate-y-1 transition-all shadow-xs hover:shadow-md flex flex-col justify-between h-full min-h-[250px] sm:min-h-[265px] cursor-pointer"
                >
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[12px] font-black text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-full uppercase border border-[#BFDBFE]">
                        {item.code}
                      </span>
                      <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-[17px] sm:text-[18px] font-bold text-[#080F1C] mb-1 min-h-[44px] sm:min-h-[48px] flex items-center leading-snug">
                      {item.name}
                    </h3>
                    <div className="text-[12px] sm:text-[13px] font-bold text-[#2563EB] mb-2">
                      {item.count}
                    </div>
                    <p className="text-[12px] sm:text-[13px] text-[#64748B] leading-relaxed min-h-[38px] sm:min-h-[42px] line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                    Explore <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           PLATFORM FEATURES — Bento Grid (Matching Abroad FeatureSection)
           ═══════════════════════════════════════════════════════════════ */}
        <section id="features" className="scroll-mt-24 sm:scroll-mt-28 px-4 sm:px-5 md:px-8 py-12 sm:py-16 lg:py-24 bg-[#F1F5F9]">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-8 border-b border-[#CBD5E1] pb-10">
            <div>
              <div className="text-[#2563EB] text-[12px] tracking-[0.2em] font-bold uppercase mb-4">
                PLATFORM FEATURES
              </div>
              <h2 className="text-[28px] sm:text-[36px] md:text-[52px] leading-[1.08] font-extrabold tracking-[-0.05em] text-[#080F1C]">
                Everything you need
                <br />
                to achieve academic clarity
              </h2>
            </div>
            <div className="max-w-full lg:max-w-[340px] text-left lg:text-right text-[#64748B] text-[14px] sm:text-[15px] leading-7 pt-0 sm:pt-3">
              From psychometric discovery to final university acceptance — every tool you need in one unified ecosystem.
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-[#CBD5E1] rounded-[20px] overflow-hidden bg-[#E2E8F0] gap-[1px]">
            {[
              { num: '01', title: 'Psychometric Battery', desc: '30-module evaluation assessing cognitive agility, Big Five behavioral traits, RIASEC career fitments, and VARK learning styles.', href: '/psychometric-test', linkText: 'Launch Assessment →' },
              { num: '02', title: 'AI Career Roadmap', desc: 'Predictive multi-year roadmap from Grade 8 through graduation, mapping internships, high school milestones, and college entry.', href: '/career-roadmap', linkText: 'View Career Roadmap →' },
              { num: '03', title: 'Digital SAT Accelerator', desc: 'Score diagnostics, adaptive drills, and 1-on-1 tutoring engineered to target 1500+ on the Digital SAT.', href: '/iq-test', linkText: 'Take SAT Diagnostic →' },
              { num: '04', title: 'Research & Publications', desc: 'Original high school research papers mentored by scholars and published in indexed academic journals.', href: '/discover', linkText: 'Explore Research →' },
              { num: '05', title: 'Global University Matcher', desc: 'Admit odds calculations and program shortlisting across 500+ Ivy League, Russell Group, and international institutes.', href: '/university-finder', linkText: 'Explore Universities →' },
              { num: '06', title: '1-to-1 Expert Mentorship', desc: 'Direct strategy sessions with certified educational psychologists and admissions advisors to support the whole family.', href: '/book-a-demo', linkText: 'Book Strategy Session →' },
            ].map((feature) => (
              <div
                key={feature.num}
                className="bg-[#F8FAFC] min-h-[200px] sm:min-h-[260px] p-6 sm:p-8 hover:bg-white transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-[#93C5FD] text-[16px] font-black">
                    {feature.num}
                  </div>
                  <h3 className="mt-5 text-[22px] font-bold tracking-[-0.03em] text-[#080F1C]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#64748B]">
                    {feature.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                  <Link
                    href={feature.href}
                    className="text-[13px] font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {feature.linkText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           DARK INTERACTIVE SECTION — CLARVO AI Career & Admissions Advisor
           ═══════════════════════════════════════════════════════════════ */}
        <section id="ai-advisor" className="scroll-mt-24 sm:scroll-mt-28 w-full bg-[#080F1C] px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-24 lg:py-28 overflow-hidden text-left">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* LEFT */}
            <div className="max-w-[540px]">
              <div className="text-[#38BDF8] text-[12px] tracking-[0.22em] uppercase font-bold mb-6">
                AI STUDENT &amp; CAREER ADVISOR
              </div>

              <h2 className="text-white text-[30px] sm:text-[42px] md:text-[58px] leading-[1.05] tracking-[-0.05em] font-extrabold">
                Personalized guidance
                <br />
                grounded in real
                <br />
                student outcomes
              </h2>

              <p className="mt-8 text-[#94A3B8] text-[16px] md:text-[17px] leading-[2.1] max-w-[500px]">
                Ask anything from stream selection after Grade 10 to SAT target timelines and Ivy League profile building. Our AI provides honest, data-backed guidance without guesswork.
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-3 mt-8 sm:mt-10">
                {['Stream Selection (Class 10)', 'Digital SAT 1500+ Strategy', 'Extracurricular Spike Building', 'Psychometric Analysis'].map((tag) => (
                  <div
                    key={tag}
                    className="h-[38px] sm:h-[42px] px-3 sm:px-4 rounded-[10px] border border-slate-700 bg-slate-900/80 text-[#CBD5E1] text-[13px] sm:text-[14px] flex items-center"
                  >
                    {tag}
                  </div>
                ))}
              </div>

              <Link
                href="/auth?tab=register"
                className="mt-8 sm:mt-12 h-[50px] sm:h-[56px] px-6 sm:px-8 rounded-[14px] bg-[#2563EB] text-white text-[14px] sm:text-[16px] font-bold hover:bg-[#1D4ED8] transition-all inline-flex items-center justify-center shadow-[0_10px_25px_rgba(37,99,235,0.35)] w-full sm:w-auto text-center cursor-pointer"
              >
                Try CLARVO AI Advisor Free →
              </Link>
            </div>

            {/* RIGHT — Dark Chat Widget Simulation */}
            <div className="flex justify-center lg:justify-end w-full">
              <div className="w-full max-w-[460px] rounded-[18px] border border-slate-800 bg-[#0F172A] overflow-hidden shadow-2xl">
                <div className="h-[64px] border-b border-slate-800 px-6 flex items-center gap-3">
                  <div className="w-[8px] h-[8px] rounded-full bg-[#38BDF8] animate-ping" />
                  <div className="text-[#38BDF8] tracking-[0.1em] text-[13px] font-bold uppercase">
                    CLARVO AI Student Advisor
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Student Message */}
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-[#38BDF8] text-[12px] flex items-center justify-center shrink-0 font-bold border border-slate-700">
                      ST
                    </div>
                    <div className="bg-slate-800/90 rounded-[14px] px-4 sm:px-5 py-4 max-w-[280px] sm:max-w-[320px] text-[#F1F5F9] text-[13px] sm:text-[14px] leading-relaxed">
                      I&apos;m in Grade 10 with 96% in Math and keen interest in AI. What stream and extracurricular spikes should I prioritize for top engineering colleges?
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 text-white font-black text-xs shadow-md">
                      CL
                    </div>
                    <div className="bg-[#1E293B] rounded-[14px] px-5 py-5 max-w-[330px] border border-slate-700">
                      <div className="text-[#94A3B8] text-[13px] leading-relaxed mb-3">
                        Based on psychometric profiling &amp; top STEM university admissions:
                      </div>
                      <div className="border-l-2 border-[#38BDF8] pl-3.5 space-y-2 text-[#E2E8F0] text-[13px] leading-relaxed">
                        <div>
                          <strong className="text-white">Recommended Stream:</strong> PCM + Advanced Computer Science
                        </div>
                        <div>
                          <strong className="text-white">Extracurricular Spike:</strong> Mentored Machine Learning research paper
                        </div>
                        <div>
                          <strong className="text-white">Testing Target:</strong> Digital SAT 1520+ by Grade 11 Spring
                        </div>
                        <div className="text-[12px] text-[#38BDF8] font-semibold pt-1">
                          💡 Tip: Highlighting published research boosts top-tier STEM admit odds by 34%.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="border-t border-slate-800 p-3 sm:p-4 flex gap-2 sm:gap-3 bg-[#0F172A]">
                  <input
                    type="text"
                    placeholder="Ask about stream choice, SAT, research..."
                    className="flex-1 h-[44px] sm:h-[48px] rounded-[12px] bg-slate-900 border border-slate-700 px-3 sm:px-4 text-[13px] sm:text-[14px] text-white outline-none placeholder:text-slate-500 min-w-0"
                    readOnly
                    aria-label="CLARVO AI Advisor chat input (demo)"
                  />
                  <Link
                    href="/auth?tab=register"
                    className="h-[44px] sm:h-[48px] px-4 sm:px-5 rounded-[12px] bg-[#2563EB] text-white text-[13px] sm:text-[14px] font-bold hover:bg-[#1D4ED8] transition-all shrink-0 flex items-center justify-center cursor-pointer"
                  >
                    Ask
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           FAQ SECTION — 2-Column Grid Card Layout
           ═══════════════════════════════════════════════════════════════ */}
        <section id="faq" className="my-14 sm:my-24 max-w-7xl mx-auto px-4 sm:px-5 md:px-10">
          <div className="text-center mb-12">
            <div className="text-[#2563EB] text-[12px] tracking-[0.22em] font-bold uppercase mb-3">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-[26px] sm:text-[34px] md:text-[46px] font-extrabold text-[#080F1C] tracking-[-0.03em]">
              Everything You Need to Know About CLARVO
            </h2>
            <p className="mt-3 text-[#64748B] text-[15px] max-w-xl mx-auto">
              Got questions about student assessments, Class 10 stream choices, SAT prep, or research mentoring? We have answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'What age group and grades does CLARVO cater to?',
                a: 'CLARVO is specifically architected for students in Grades 7 through 12, with grade-tailored diagnostic assessments, stream selection guidance for Class 10, SAT coaching, and university profile building for Class 11 and 12.',
              },
              {
                q: 'How does the 30-module Psychometric Assessment determine stream and career fit?',
                a: 'Our assessment evaluates cognitive agility, RIASEC vocational interests, Big Five behavioral traits, and VARK learning preferences to generate scientifically validated stream and career recommendations.',
              },
              {
                q: 'How does High School Research & Profile Building work?',
                a: 'Students are paired with seasoned research mentors to produce original academic research papers, aiming for publication in indexed, peer-reviewed international high school and undergraduate journals.',
              },
              {
                q: 'Can parents participate in counseling and review assessment reports?',
                a: 'Yes! CLARVO generates clear, comprehensive reports for families and offers dedicated 1-on-1 counselor strategy sessions to align parental aspirations with the student’s verified aptitude.',
              },
            ].map((item, i) => (
              <div key={i} className="p-7 bg-white rounded-[16px] border border-[#E2E8F0] shadow-xs hover:border-[#2563EB]/40 transition-all">
                <h3 className="text-[17px] font-bold text-[#080F1C] mb-3">
                  {item.q}
                </h3>
                <p className="text-[#64748B] text-[14px] leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
           PRE-FOOTER CTA BANNER — Deep Navy / Blue Gradient
           ═══════════════════════════════════════════════════════════════ */}
        <section className="w-full overflow-hidden mt-auto">
          <div className="bg-gradient-to-br from-[#0B1B3D] via-[#1E3A8A] to-[#2563EB] px-4 sm:px-6 md:px-10 py-14 sm:py-20 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-white font-extrabold tracking-[-0.05em] leading-[1.02]">
                <span className="block text-[32px] sm:text-[46px] md:text-[64px]">
                  Start building their
                </span>
                <span className="block mt-2 sm:mt-3 text-[#93C5FD] italic text-[32px] sm:text-[46px] md:text-[64px] leading-tight">
                  future legacy
                </span>
                <span className="block mt-1 text-white text-[32px] sm:text-[46px] md:text-[64px] leading-tight">
                  today
                </span>
              </h2>

              <p className="mt-6 sm:mt-8 text-blue-100 text-[15px] sm:text-[16px] md:text-[18px] leading-[1.9] sm:leading-[2.1] max-w-[760px] mx-auto px-2">
                Join 15,000+ ambitious students and parents navigating stream selection, SAT excellence, and global admissions with absolute clarity.
              </p>

              <Link
                href="/auth?tab=register"
                className="mt-8 sm:mt-10 w-full sm:w-auto h-[54px] sm:h-[58px] px-8 sm:px-12 rounded-[14px] bg-white text-[#1E3A8A] text-[15px] sm:text-[17px] font-bold hover:scale-[1.02] transition-all inline-flex items-center justify-center shadow-xl cursor-pointer"
              >
                Begin Student Assessment →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
         FOOTER — Matching Abroad Layout with Parent Attribution
         ═══════════════════════════════════════════════════════════════ */}
      <LandingFooter />
    </div>
  );
}
