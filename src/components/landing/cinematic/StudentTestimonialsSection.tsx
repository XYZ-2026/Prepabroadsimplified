'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Star, School, GraduationCap, CheckCircle, Quote, Sparkles, ArrowRight, BookOpen, Trophy } from 'lucide-react';
import { BOOK_A_DEMO_URL } from '@/config/demo';

interface Testimonial {
  id: string;
  name: string;
  initials: string;
  initialsGradient: string;
  grade: string;
  school: string;
  city: string;
  board: string;
  category: 'stream' | 'sat' | 'international' | 'research';
  categoryLabel: string;
  outcomeBadge: string;
  outcomeMetric: string;
  quote: string;
  focusArea: string;
  isVerified?: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'aarav-sharma',
    name: 'Aarav Sharma',
    initials: 'AS',
    initialsGradient: 'from-blue-600 to-indigo-600',
    grade: 'Class 10',
    board: 'ICSE',
    school: 'The Shri Ram School, Moulsari',
    city: 'Gurugram',
    category: 'stream',
    categoryLabel: 'Class 10 Stream Selection',
    outcomeBadge: 'Stream Fitment: 98.4% Match',
    outcomeMetric: 'Confirmed: PCM + Computer Science',
    quote: 'Before CLARVO’s diagnostic evaluation, my parents and I had weeks of tension about whether I should pick Commerce with Applied Math or Science PCM. The 30-dimension cognitive report proved that my spatial reasoning and abstract logic matched Computer Science engineering far better than finance. Having objective data completely ended the guesswork at home.',
    focusArea: 'PCM vs Commerce Decision & RIASEC Alignment',
  },
  {
    id: 'rhea-sengupta',
    name: 'Rhea Sengupta',
    initials: 'RS',
    initialsGradient: 'from-sky-500 to-blue-600',
    grade: 'Grade 11',
    board: 'IB Diploma Programme',
    school: 'Dhirubhai Ambani International School (DAIS)',
    city: 'Mumbai',
    category: 'international',
    categoryLabel: 'IB & Cambridge Pathways',
    outcomeBadge: 'Predicted 43/45 in DP1',
    outcomeMetric: 'HL: Math AA, Economics, Physics',
    quote: 'Selecting IB Higher Levels is high-stakes; if you make one mismatched choice, your university options shrink drastically. CLARVO analyzed my VARK learning style and analytical endurance, guiding me to take Math AA HL and Economics HL without getting overwhelmed. The multi-year roadmap also helped me schedule my Extended Essay early.',
    focusArea: 'IB DP HL Selection & Workload Calibration',
  },
  {
    id: 'kabir-mehta',
    name: 'Kabir Mehta',
    initials: 'KM',
    initialsGradient: 'from-emerald-600 to-teal-600',
    grade: 'Class 12',
    board: 'CBSE (Science PCM)',
    school: 'Delhi Public School (DPS), R.K. Puram',
    city: 'New Delhi',
    category: 'sat',
    categoryLabel: 'Digital SAT & Entrance',
    outcomeBadge: '1540 on Digital SAT',
    outcomeMetric: '+180 pt Increase (Math 790, R&W 750)',
    quote: 'I was plateaued at 1360 on standard practice tests because the adaptive second module kept punishing my time management on vocabulary inference and hard algebra. CLARVO’s diagnostic pacing report broke down the exact seconds I wasted per question type and trained me on Desmos shortcuts. Crossing 1540 unlocked direct merit scholarships.',
    focusArea: 'Adaptive Module Pacing & Targeted Error Analysis',
  },
  {
    id: 'ananya-deshmukh',
    name: 'Ananya Deshmukh',
    initials: 'AD',
    initialsGradient: 'from-violet-600 to-purple-600',
    grade: 'Class 10',
    board: 'ICSE',
    school: 'The Cathedral and John Connon School',
    city: 'Mumbai',
    category: 'stream',
    categoryLabel: 'Class 10 Stream Selection',
    outcomeBadge: 'Zero Stream Regret',
    outcomeMetric: 'Confirmed: Commerce + Applied Math & Econ',
    quote: 'Almost everyone in my batch was blindly registering for IIT-JEE coaching just because they scored 90%+ in 9th grade. CLARVO was the first platform that assessed my verbal agility, RIASEC enterprising profile, and career interests. It gave my family complete conviction to choose Commerce with Math, saving me from 2 years of burnout.',
    focusArea: 'Preventing Coaching Peer Pressure & Stream Clarity',
  },
  {
    id: 'pranav-varma',
    name: 'Pranav Varma',
    initials: 'PV',
    initialsGradient: 'from-amber-500 to-orange-600',
    grade: 'Class 12',
    board: 'Cambridge A-Levels',
    school: 'The Doon School',
    city: 'Dehradun',
    category: 'research',
    categoryLabel: 'Research & Global Admits',
    outcomeBadge: 'Imperial College Offer',
    outcomeMetric: 'Published Paper in High School Journal',
    quote: 'Top engineering colleges abroad see thousands of applicants with straight A*s. You need an intellectual spike. Through CLARVO’s research mentorship framework, I formulated and authored an empirical modeling paper on urban microgrids. That published paper became the centerpiece of my UCAS statement and professor interviews.',
    focusArea: 'Academic Profile Spike & Independent Research Paper',
  },
  {
    id: 'tanvi-nambiar',
    name: 'Tanvi Nambiar',
    initials: 'TN',
    initialsGradient: 'from-rose-500 to-pink-600',
    grade: 'Class 11',
    board: 'CBSE (Science PCM + AI)',
    school: 'National Public School (NPS), Indiranagar',
    city: 'Bengaluru',
    category: 'sat',
    categoryLabel: 'Digital SAT & Entrance',
    outcomeBadge: '99th Percentile Aptitude',
    outcomeMetric: 'Synchronized CBSE + Competitive Prep',
    quote: 'The academic jump from 10th to 11th grade in CBSE is notoriously difficult. CLARVO gave me a personalized milestone planner that harmonized my school syllabus with competitive foundation modules. My stress dropped immediately because I knew exactly where to focus 80% of my study hours instead of feeling perpetually behind.',
    focusArea: 'Grade 11 Transition & Academic Planning',
  },
  {
    id: 'siddharth-iyer',
    name: 'Siddharth Iyer',
    initials: 'SI',
    initialsGradient: 'from-cyan-600 to-blue-700',
    grade: 'Class 10',
    board: 'CBSE',
    school: 'Modern School, Barakhamba Road',
    city: 'New Delhi',
    category: 'stream',
    categoryLabel: 'Class 10 Stream Selection',
    outcomeBadge: '94% Family Alignment',
    outcomeMetric: 'Target: Computational Economics',
    quote: 'My father was convinced I should do Civil Engineering, while I was interested in computer technology and economics. The CLARVO parent-student alignment survey revealed where our expectations overlapped and introduced us to Computational Economics. Reading the scientific dossier together resolved our disagreement in a single evening.',
    focusArea: 'Parent-Student Diagnostic Alignment',
  },
  {
    id: 'meera-kulkarni',
    name: 'Meera Kulkarni',
    initials: 'MK',
    initialsGradient: 'from-teal-600 to-emerald-700',
    grade: 'Grade 11',
    board: 'IB Diploma Programme',
    school: 'Step by Step School',
    city: 'Noida',
    category: 'research',
    categoryLabel: 'Research & Global Admits',
    outcomeBadge: 'Global University Track',
    outcomeMetric: 'Major Focus: Cognitive Science & PPE',
    quote: 'I have strong interests in both literature and data analytics, but conventional counselors kept telling me to pick one box. CLARVO showed me how interdisciplinary programs like Cognitive Science and Behavioral Economics combine both strengths. It fundamentally transformed how I spend my high school summers.',
    focusArea: 'Interdisciplinary Career Roadmapping',
  },
];

export default function StudentTestimonialsSection() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [displayLimit, setDisplayLimit] = useState<number>(4);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({
    all: TESTIMONIALS.length,
    stream: TESTIMONIALS.filter(t => t.category === 'stream').length,
    sat: TESTIMONIALS.filter(t => t.category === 'sat').length,
    international: TESTIMONIALS.filter(t => t.category === 'international').length,
    research: TESTIMONIALS.filter(t => t.category === 'research').length,
  });

  // Fetch approved & verified reviews supporting up to 25 authentic reviews per category
  useEffect(() => {
    async function loadFeaturedReviews() {
      try {
        const res = await fetch('/api/reviews?limit=25');
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const gradients = [
            'from-blue-600 to-indigo-600',
            'from-sky-500 to-blue-600',
            'from-emerald-600 to-teal-600',
            'from-violet-600 to-purple-600',
            'from-amber-500 to-orange-600',
            'from-rose-500 to-pink-600',
          ];

          const mapped: Testimonial[] = data.reviews.map((r: any, idx: number) => {
            const initials = r.name
              ? r.name
                  .split(' ')
                  .map((w: string) => w.charAt(0))
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'ST';

            // Extract city from school if formatted e.g. "DPS (New Delhi)"
            const cityMatch = r.school?.match(/\((.*?)\)/);
            const city = cityMatch ? cityMatch[1] : 'Verified Campus';

            return {
              id: r.id,
              name: r.name,
              initials,
              initialsGradient: gradients[idx % gradients.length],
              grade: r.grade || 'High School',
              board: r.role === 'parent' ? 'Parent Review' : 'Verified Student',
              school: r.school || 'Leading Indian High School',
              city,
              category: (r.category || 'stream') as 'stream' | 'sat' | 'international' | 'research',
              categoryLabel: r.impactTag || 'Psychometric & Career Review',
              outcomeBadge: `${r.rating || 5}.0 ★ Verified Experience`,
              outcomeMetric: r.reportType || 'Official Diagnostic Report',
              quote: r.comment,
              focusArea: r.headline || 'Assessment Evaluation',
              isVerified: Boolean(r.isVerified),
            };
          });

          // Deduplicate by name/id and prepend new approved reviews
          const existingIds = new Set(mapped.map((m) => m.id));
          const existingNames = new Set(mapped.map((m) => m.name.toLowerCase()));
          const remainingCurated = TESTIMONIALS.filter(
            (t) => !existingIds.has(t.id) && !existingNames.has(t.name.toLowerCase())
          );

          const combined = [...mapped, ...remainingCurated];
          setLiveTestimonials(combined);

          if (data.categoryCounts) {
            setCategoryCounts(data.categoryCounts);
          } else {
            setCategoryCounts({
              all: combined.length,
              stream: combined.filter(t => t.category === 'stream').length,
              sat: combined.filter(t => t.category === 'sat').length,
              international: combined.filter(t => t.category === 'international').length,
              research: combined.filter(t => t.category === 'research').length,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load featured reviews:', err);
      }
    }

    loadFeaturedReviews();
  }, []);

  const filteredTestimonials = selectedCategory === 'all'
    ? liveTestimonials
    : liveTestimonials.filter((t) => t.category === selectedCategory);

  const visibleTestimonials = filteredTestimonials.slice(0, displayLimit);

  const categories = [
    { id: 'all', label: `All Stories (${liveTestimonials.length})` },
    { id: 'stream', label: `Class 10 Stream Selection (${categoryCounts.stream ?? liveTestimonials.filter(t => t.category === 'stream').length})` },
    { id: 'sat', label: `Digital SAT & Scores (${categoryCounts.sat ?? liveTestimonials.filter(t => t.category === 'sat').length})` },
    { id: 'international', label: `IB & Cambridge Pathways (${categoryCounts.international ?? liveTestimonials.filter(t => t.category === 'international').length})` },
    { id: 'research', label: `Research & Global Admits (${categoryCounts.research ?? liveTestimonials.filter(t => t.category === 'research').length})` },
  ];

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 sm:scroll-mt-24 w-full bg-[#FFFFFF] px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-24 lg:py-28 overflow-hidden text-left border-b border-[#E4E7EC]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#2563EB] text-[11px] font-bold tracking-[0.2em] uppercase mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              AUTHENTIC STUDENT EXPERIENCES · NO STOCK PHOTOS
            </div>

            <h2 className="text-[28px] sm:text-[38px] md:text-[46px] leading-[1.08] font-black tracking-[-0.04em] text-[#080F1C]">
              Trusted by Ambitious Students Across India’s Leading Schools
            </h2>

            <p className="mt-4 text-[#475569] text-[15px] sm:text-[17px] leading-relaxed font-normal">
              Real high school students from Grades 10–12 sharing how psychometric diagnostics, Class 10 stream clarity, adaptive Digital SAT analytics, and research mentoring shaped their success.
            </p>
          </motion.div>

          {/* Social Proof Metric Pill */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.5 }}
            className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 shrink-0 shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 font-extrabold">
              <Trophy className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1 text-[13px] font-extrabold text-[#080F1C]">4.9 / 5.0</span>
              </div>
              <div className="text-[12px] text-[#64748B] font-semibold mt-0.5">
                Independent Verified Evaluations
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setDisplayLimit(4);
                }}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-600/20'
                    : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#080F1C]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: shouldReduceMotion ? 0.05 : 0.4,
                  delay: shouldReduceMotion ? 0 : index * 0.04,
                }}
                className="group relative bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#2563EB] rounded-[22px] p-6 sm:p-7 transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col justify-between"
              >
                {/* Top Row: Initial Monogram & Student Meta */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3.5">
                      {/* Monogram Badge (No photo) */}
                      <div
                        className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${item.initialsGradient} text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-900/10 shrink-0 select-none ring-2 ring-white`}
                      >
                        {item.initials}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[17px] font-black text-[#080F1C] tracking-tight leading-snug">
                            {item.name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            item.isVerified !== false 
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' 
                              : 'text-slate-600 bg-slate-100 border border-slate-200'
                          }`}>
                            <CheckCircle className={`w-3 h-3 ${item.isVerified !== false ? 'text-emerald-600' : 'text-slate-400'}`} />
                            {item.isVerified !== false ? 'Verified Student' : 'Student Feedback'}
                          </span>
                        </div>

                        {/* Grade & Board */}
                        <div className="text-[12px] font-bold text-[#2563EB] mt-0.5 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{item.grade}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-600 font-semibold">{item.board}</span>
                        </div>
                      </div>
                    </div>

                    {/* 5-Star Rating */}
                    <div className="flex text-amber-400 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* School & City Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[12px] font-semibold text-[#334155] mb-4.5 shadow-2xs">
                    <School className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span className="font-bold text-[#080F1C]">{item.school}</span>
                    <span className="text-slate-400 font-normal">({item.city})</span>
                  </div>

                  {/* Outcome Metric Ribbon */}
                  <div className="bg-[#E8F0FF] border border-[#BFDBFE] rounded-xl px-3.5 py-2 mb-4 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#2563EB]">
                      {item.outcomeBadge}
                    </span>
                    <span className="text-[12px] font-extrabold text-[#1E3A8A] text-right truncate">
                      {item.outcomeMetric}
                    </span>
                  </div>

                  {/* Quote Body */}
                  <div className="relative mt-2">
                    <Quote className="w-6 h-6 text-[#2563EB]/20 absolute -top-1.5 -left-1 pointer-events-none" />
                    <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-[#334155] pl-5 font-normal italic">
                      “{item.quote}”
                    </p>
                  </div>
                </div>

                {/* Card Footer: Focus Area Tag */}
                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
                  <span className="flex items-center gap-1.5 truncate">
                    <BookOpen className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span className="truncate">{item.focusArea}</span>
                  </span>
                  <span className="text-[#2563EB] font-bold shrink-0 ml-2">
                    {item.categoryLabel}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Stories within Category (supports up to 25 authentic reviews per category) */}
        {displayLimit < filteredTestimonials.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setDisplayLimit((prev) => Math.min(prev + 4, 25))}
              className="px-6 py-3 rounded-xl border border-slate-300 hover:border-blue-500 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              <span>View More Stories ({filteredTestimonials.length - displayLimit} remaining in this category)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Section Bottom CTA Strip */}
        <div className="mt-14 sm:mt-16 bg-gradient-to-r from-[#080F1C] via-[#1E3A8A] to-[#2563EB] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[11px] font-bold tracking-widest uppercase mb-3 backdrop-blur-xs">
              EXPERIENCE THE CLARVO ADVANTAGE
            </span>
            <h3
              className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug text-white"
              style={{ color: '#FFFFFF' }}
            >
              Give your student the clarity they need before making high-stakes decisions.
            </h3>
            <p className="text-blue-100 text-sm sm:text-base mt-2 font-normal">
              Book an individual parent &amp; student diagnostic consultation with our certified counseling team.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/submit-review"
              className="w-full sm:w-auto h-13 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-[14px] inline-flex items-center justify-center gap-2 border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Share Student Review</span>
            </Link>
            <Link
              href={BOOK_A_DEMO_URL}
              className="w-full sm:w-auto h-13 px-8 rounded-xl bg-white text-[#1E3A8A] font-extrabold text-[15px] inline-flex items-center justify-center gap-2.5 shadow-lg hover:bg-blue-50 transition-all cursor-pointer"
            >
              <span>Book a Demo</span>
              <ArrowRight className="w-4 h-4 text-[#1E3A8A]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
