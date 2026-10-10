import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Compass, 
  Target, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Lightbulb, 
  Eye, 
  Zap, 
  Layers, 
  HeartHandshake, 
  TrendingUp 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Simplified Eduventures | CLARVO',
  description:
    'Simplified Eduventures exists to help students and families navigate important education decisions with greater clarity, structured guidance, and thoughtful planning.',
  alternates: {
    canonical: '/about-us',
  },
  openGraph: {
    title: 'About Simplified Eduventures | CLARVO',
    description:
      'Simplified Eduventures exists to help students and families navigate important education decisions with greater clarity, structured guidance, and thoughtful planning.',
    url: 'https://clarvo.com/about-us',
  },
};

export default function AboutUsPage() {
  const philosophyPillars = [
    {
      step: '01',
      title: 'Understand',
      description: 'Make relevant information accessible, transparent, and genuinely understandable for students and parents.',
      icon: <Eye className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      step: '02',
      title: 'Personalise',
      description: 'Recognise each student’s unique interests, intellectual goals, cognitive strengths, and family circumstances.',
      icon: <Target className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      step: '03',
      title: 'Take Action',
      description: 'Translate diagnostic understanding into practical, actionable next steps and evidence-backed decisions.',
      icon: <Zap className="w-6 h-6 text-[#2563EB]" />,
    },
  ];

  const studentJourneyStages = [
    {
      step: '01',
      stage: 'DISCOVER',
      title: 'Discover Possibilities',
      desc: 'Explore personal interests, cognitive aptitudes, and hidden strengths through standardized psychometric inquiry.',
    },
    {
      step: '02',
      stage: 'PREPARE',
      title: 'Prepare Academically',
      desc: 'Strengthen subject competencies, test readiness, and build meaningful profile experiences systematically.',
    },
    {
      step: '03',
      stage: 'DECIDE',
      title: 'Decide Confidently',
      desc: 'Evaluate subject streams and university destinations with a transparent view of all available pathways.',
    },
    {
      step: '04',
      stage: 'GROW',
      title: 'Grow & Evolve',
      desc: 'Advance through continuous learning, structured mentorship, and purposeful milestone planning.',
    },
  ];

  const clarvoServices = [
    {
      title: 'Discover',
      badge: 'Assessments & Insights',
      desc: 'Multi-dimensional evaluations uncovering cognitive patterns, RIASEC occupational interests, and VARK learning preferences.',
      href: '/discover',
      actionLabel: 'Explore Diagnostics',
      icon: <Compass className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      title: 'Excel',
      badge: 'Academic Progression',
      desc: 'Targeted SAT preparation, test readiness, and subject-specific academic coaching built to elevate classroom mastery.',
      href: '/book-a-demo',
      actionLabel: 'Academic Programs',
      icon: <GraduationCap className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      title: 'Build',
      badge: 'Research & Profile',
      desc: 'Strategic profile architecture aligning candidate achievements with verified global university admissions benchmarks.',
      href: '/university-finder',
      actionLabel: 'University Matching',
      icon: <Target className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      title: 'Guide',
      badge: 'Advisory & Planning',
      desc: 'One-to-one certified counselor consultations aligning parent expectations with student stream choices and future milestones.',
      href: '/sample-reports',
      actionLabel: 'Sample Reports',
      icon: <Users className="w-6 h-6 text-[#2563EB]" />,
    },
  ];

  const coreValues = [
    {
      title: 'Clarity Over Confusion',
      desc: 'Help students and parents see past noise and focus on factors that truly matter in their academic progression.',
      icon: <Lightbulb className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      title: 'Personalised Thinking',
      desc: 'Respect that every learner’s cognitive strengths, values, pace, and aspirations are inherently individual.',
      icon: <HeartHandshake className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      title: 'Guidance With Purpose',
      desc: 'Prioritize actionable, high-utility next steps over information overload and speculative generic advice.',
      icon: <Layers className="w-5 h-5 text-[#2563EB]" />,
    },
    {
      title: 'Long-Term Perspective',
      desc: 'Evaluate how today’s subject elections and study habits connect with future higher education opportunities.',
      icon: <TrendingUp className="w-5 h-5 text-[#2563EB]" />,
    },
  ];

  const missionPrinciples = [
    { title: 'Simplify', desc: 'Make complex educational data, requirements, and options understandable.' },
    { title: 'Guide', desc: 'Help students and parents navigate pivotal academic and career transitions.' },
    { title: 'Personalise', desc: 'Respect each candidate’s distinct context, strengths, and goals.' },
    { title: 'Empower', desc: 'Foster confidence to make thoughtful, self-directed decisions.' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#080F1C] font-sans flex flex-col selection:bg-[#2563EB] selection:text-white">
      
      {/* ── SECTION 1: HERO — ABOUT SIMPLIFIED EDUVENTURES ── */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 px-4 md:px-8 bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] border-b border-[#E4E7EC]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F0FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>ABOUT SIMPLIFIED EDUVENTURES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#080F1C] leading-[1.15] mb-6">
            Making Education Decisions Simpler.
          </h1>

          <p className="text-base sm:text-lg text-[#344054] leading-relaxed max-w-2xl mx-auto mb-10">
            Simplified Eduventures exists to help students and families navigate important education decisions with greater clarity. From understanding individual strengths to exploring academic pathways and preparing for the future, our approach brings structured guidance and thoughtful planning into the student journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/discover"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm text-center shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore CLARVO</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/book-a-demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-[#E4E7EC] text-[#080F1C] font-semibold text-sm text-center shadow-sm transition-all"
            >
              Get Guidance
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: WHY SIMPLIFIED EDUVENTURES EXISTS ── */}
      <section className="py-20 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#2563EB] font-bold text-xs tracking-widest uppercase mb-2 block">
            The Problem We Solve
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#080F1C] tracking-tight">
            Education Shouldn’t Feel Complicated.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white p-8 rounded-2xl border border-[#E4E7EC] shadow-sm flex flex-col justify-between">
            <div className="space-y-4 text-sm text-[#344054] leading-relaxed">
              <p>
                Secondary school students and parents routinely face hundreds of disconnected information sources—conflicting board syllabi, admission cutoffs, testing dates, and career buzzwords.
              </p>
              <p>
                Important academic decisions—such as Class 11 stream combinations, exam selection, and college targeting—are frequently evaluated in isolation under deadline pressure rather than through structured, evidence-based self-reflection.
              </p>
              <p>
                More information is not always enough. Students do not need more uncurated web pages; they need assistance understanding what data means for their individual circumstances and immediate next step.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E4E7EC] text-xs font-bold text-[#667085] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Evidence-based diagnostic methodology</span>
            </div>
          </div>

          <div className="bg-[#080F1C] text-white p-8 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[#93C5FD] font-bold text-xs uppercase tracking-wider block mb-3">
                The Structured Alternative
              </span>
              <h3 className="text-2xl font-extrabold mb-4 text-white tracking-tight">
                From Overload to Structured Direction
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Simplified Eduventures introduces a disciplined framework that translates complex psychometric data into clear, practical next steps. Every choice is benchmarked against personal cognitive potential rather than peer pressure.
              </p>
            </div>

            <div className="space-y-2.5 border-t border-slate-800 pt-5 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Single cohesive diagnostic dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Collaborative parent-student alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Deterministic pathway recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: OUR PHILOSOPHY ── */}
      <section className="py-20 px-4 md:px-8 bg-white border-y border-[#E4E7EC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#2563EB] font-bold text-xs tracking-widest uppercase mb-2 block">
              Core Principles
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#080F1C] tracking-tight">
              Where Complexity Meets Clarity.
            </h2>
            <p className="text-[#667085] mt-3 text-base">
              Our guiding approach to making critical academic transitions understandable, collaborative, and actionable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyPillars.map((p) => (
              <div
                key={p.step}
                className="bg-[#F8FAFC] p-8 rounded-2xl border border-[#E4E7EC] hover:border-[#BFDBFE] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E4E7EC] flex items-center justify-center shadow-sm">
                      {p.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-[#667085]">
                      {p.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#080F1C] mb-3">
                    {p.title}
                  </h3>

                  <p className="text-sm text-[#344054] leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THE STUDENT JOURNEY ── */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#2563EB] font-bold text-xs tracking-widest uppercase mb-2 block">
            Multi-Stage Development
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#080F1C] tracking-tight">
            Supporting the Journey, Not Just One Decision.
          </h2>
          <p className="text-[#667085] mt-3 text-base">
            Student development spans connected milestones. Guidance should nourish the broader horizon rather than a single exam.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentJourneyStages.map((st) => (
            <div
              key={st.step}
              className="bg-white p-7 rounded-2xl border border-[#E4E7EC] shadow-sm flex flex-col justify-between relative"
            >
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#2563EB] bg-[#E8F0FF] px-2.5 py-1 rounded-md inline-block mb-4">
                  {st.stage}
                </span>
                <h3 className="text-lg font-extrabold text-[#080F1C] mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  {st.desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#E4E7EC] text-[11px] font-bold text-[#94A3B8]">
                Stage {st.step}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: INTRODUCING CLARVO ── */}
      <section className="py-20 px-4 md:px-8 bg-[#F1F5F9] border-y border-[#E4E7EC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#2563EB] font-bold text-xs tracking-widest uppercase mb-2 block">
              Flagship Student Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#080F1C] tracking-tight">
              Meet CLARVO.
            </h2>
            <p className="text-[#344054] mt-3 text-base leading-relaxed">
              CLARVO is a platform under Simplified Eduventures, built around the belief that students and families benefit from greater clarity, personalised support, and thoughtful planning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clarvoServices.map((srv) => (
              <div
                key={srv.title}
                className="bg-white p-7 rounded-2xl border border-[#E4E7EC] shadow-sm hover:shadow-lg hover:border-[#BFDBFE] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    {srv.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block mb-1">
                    {srv.badge}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#080F1C] mb-2 group-hover:text-[#2563EB] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#667085] leading-relaxed mb-6">
                    {srv.desc}
                  </p>
                </div>

                <Link
                  href={srv.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                >
                  <span>{srv.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: THE PEOPLE BEHIND THE VISION ── */}
      <section className="py-20 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#E4E7EC] shadow-sm">
          <div className="max-w-2xl">
            <span className="text-[#2563EB] font-bold text-xs tracking-widest uppercase mb-2 block">
              Leadership Philosophy
            </span>
            <h2 className="text-3xl font-extrabold text-[#080F1C] tracking-tight mb-4">
              The Thinking Behind Simplified Eduventures
            </h2>
            <p className="text-sm md:text-base text-[#344054] leading-relaxed mb-4">
              Our multidisciplinary team comprises psychometricians, educators, curriculum strategists, and academic advisors united by a single conviction: secondary school transitions demand transparent, data-backed guidance rather than speculative marketing.
            </p>
            <p className="text-sm md:text-base text-[#667085] leading-relaxed">
              By combining standardized global assessment models (CBSE, ICSE, IB, Cambridge) with empathetic one-to-one family counseling, we help students transition from secondary school into university with clarity and measurable purpose.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: OUR CORE VALUES ── */}
      <section className="py-20 px-4 md:px-8 bg-white border-y border-[#E4E7EC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#2563EB] font-bold text-xs tracking-widest uppercase mb-2 block">
              Ethical Standards
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#080F1C] tracking-tight">
              What Guides Us.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((cv) => (
              <div
                key={cv.title}
                className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#E4E7EC] flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E4E7EC] flex items-center justify-center mb-4">
                    {cv.icon}
                  </div>
                  <h3 className="text-base font-extrabold text-[#080F1C] mb-2">
                    {cv.title}
                  </h3>
                  <p className="text-xs text-[#667085] leading-relaxed">
                    {cv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: OUR VISION ── */}
      <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto text-center w-full">
        <span className="text-[#2563EB] font-bold text-xs tracking-widest uppercase mb-2 block">
          Our Vision
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#080F1C] tracking-tight mb-6">
          A Clearer Path Forward.
        </h2>
        <blockquote className="text-lg md:text-xl text-[#344054] leading-relaxed font-normal max-w-3xl mx-auto">
          “Our vision is to help build an education environment where students and families can approach important decisions with greater understanding and confidence. We believe that relevant information, thoughtful guidance, and a clear view of possible next steps can help students navigate their journeys more deliberately.”
        </blockquote>
      </section>

      {/* ── SECTION 9: OUR MISSION ── */}
      <section className="py-16 px-4 md:px-8 bg-[#F1F5F9] border-y border-[#E4E7EC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#2563EB] font-bold text-xs tracking-widest uppercase mb-2 block">
              Our Mission
            </span>
            <h2 className="text-3xl font-extrabold text-[#080F1C] tracking-tight">
              Turning Complexity Into Action.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionPrinciples.map((mp) => (
              <div
                key={mp.title}
                className="bg-white p-6 rounded-2xl border border-[#E4E7EC] text-center"
              >
                <h3 className="text-lg font-extrabold text-[#2563EB] mb-2">
                  {mp.title}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  {mp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: CLOSING CTA ── */}
      <section className="py-20 px-4 md:px-8 max-w-5xl mx-auto text-center w-full">
        <div className="bg-[#080F1C] text-white rounded-3xl p-8 md:p-14 border border-slate-800 shadow-xl">
          <span className="text-blue-400 font-bold text-xs uppercase tracking-wider block mb-2">
            Take The Next Step
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
            Your Next Decision Deserves Clarity.
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
            Discover how CLARVO can support your next step. Explore the platform or connect with our team to learn more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book-a-demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm text-center shadow-lg transition-all"
            >
              Book a Demo
            </Link>
            <Link
              href="/discover"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm text-center border border-white/20 transition-all"
            >
              Explore CLARVO
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
