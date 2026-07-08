'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PremiumToolsCards from '@/components/PremiumToolsCards';
import { 
  BrainCircuit, 
  Cpu, 
  Activity, 
  BarChart3, 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  Clock, 
  ShieldCheck, 
  Compass, 
  Lightbulb, 
  Layers, 
  FileQuestion,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  Target
} from 'lucide-react';

const stats = [
  { value: '50,000+', label: 'Assessed', icon: Cpu },
  { value: '60', label: 'Questions', icon: FileQuestion },
  { value: '45 Mins', label: 'Duration', icon: Clock },
  { value: 'AI-Powered', label: 'Analytics', icon: BrainCircuit },
];

const domains = [
  {
    title: 'Logical Reasoning',
    desc: 'Evaluate deductive capabilities, puzzle solving, heuristic modeling, and structural logic.',
    icon: Compass,
    color: 'from-red-500 to-rose-600',
  },
  {
    title: 'Pattern Recognition',
    desc: 'Test spatial-temporal sequencing, grid matrices, shape transformations, and structural order.',
    icon: Layers,
    color: 'from-red-500 to-rose-600',
  },
  {
    title: 'Numerical Intelligence',
    desc: 'Measure quantitative manipulation, rates of change, algebraic grids, and math sequences.',
    icon: Activity,
    color: 'from-rose-500 to-pink-600',
  },
  {
    title: 'Verbal Reasoning',
    desc: 'Refine textual comprehension, semantic analogies, logical arguments, and syntax relations.',
    icon: Lightbulb,
    color: 'from-red-600 to-rose-600',
  },
  {
    title: 'Analytical Thinking',
    desc: 'Challenge data sufficiency sorting, overlapping set configurations, and multi-variable grids.',
    icon: BarChart3,
    color: 'from-pink-600 to-rose-500',
  },
  {
    title: 'Problem Solving',
    desc: 'Evaluate algorithmic optimization, critical bottle-neck mitigation, and spatial calculations.',
    icon: BrainCircuit,
    color: 'from-rose-500 to-red-600',
  },
];

const steps = [
  { step: '01', title: 'Start Assessment', desc: 'Initialize your exam session securely.' },
  { step: '02', title: 'Answer 60 Questions', desc: 'Solve challenging CAT/GMAT-level logic and pattern queries.' },
  { step: '03', title: 'Generate Profile', desc: 'Wait for our local scoring engines to construct your cognitive breakdown.' },
  { step: '04', title: 'Unlock Premium Report', desc: 'Choose a report tier and review personalized career recommendations.' },
  { step: '05', title: 'Download Certificate', desc: 'Secure your unique verification ID and print your formal diploma.' },
];

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="flex-1 flex flex-col bg-white text-black relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] rounded-full bg-gradient-to-b from-[#9C1010]/5 to-transparent blur-[120px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-800 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-[#9C1010] animate-pulse"></span>
            Scientifically Validated IQ Assessment
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-slate-900 tracking-tighter leading-[1.05] mb-8 max-w-5xl mx-auto"
        >
          Discover Your True <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9C1010] to-[#E53935]">Cognitive Potential</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 leading-relaxed mb-12 max-w-2xl mx-auto font-medium"
        >
          A highly calibrated psychometric assessment covering logic, numerical intelligence, and spatial reasoning. Find out where you stand globally.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-20"
        >
          <Link
            href="/iq-test/instructions"
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#9C1010] hover:bg-[#8D1212] text-white font-bold shadow-xl shadow-[#9C1010]/20 text-center flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            Start Free Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#why-take"
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-center transition-all shadow-sm text-lg"
          >
            View Domains
          </a>
        </motion.div>

        {/* Floating Stats underneath Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md flex flex-col items-center justify-center text-center group transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#9C1010] mb-4 group-hover:scale-110 group-hover:bg-[#9C1010]/5 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Bento Grid Domains */}
      <section id="why-take" className="max-w-7xl mx-auto px-6 py-24 z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9C1010] mb-3">Cognitive Domains</h2>
          <h3 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            What We Measure
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((dom, i) => {
            const Icon = dom.icon;
            // Create a nice alternating 2-1-1 pattern
            const isLarge = i === 0 || i === 3; 
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className={`bg-white p-8 rounded-[2rem] border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden group ${
                  isLarge ? 'md:col-span-2' : ''
                }`}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#9C1010]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#9C1010] mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="relative z-10">
                  <h4 className="font-display font-bold text-2xl text-slate-900 mb-3 tracking-tight">
                    {dom.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-sm font-medium">
                    {dom.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section (Timeline) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100 relative z-10 bg-slate-50/50 rounded-[3rem] my-12 mx-4 md:mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9C1010] mb-3">The Process</h2>
          <h3 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Your Journey to Clarity
          </h3>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-[10%] w-[80%] h-0.5 bg-gradient-to-r from-transparent via-[#9C1010]/20 to-transparent z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-6 relative z-10">
            {steps.map((st, i) => (
              <div key={i} className="flex flex-col items-center text-center relative group">
                <div className="w-24 h-24 rounded-3xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center text-2xl font-display font-extrabold text-slate-300 mb-6 group-hover:border-[#9C1010] group-hover:text-[#9C1010] group-hover:scale-105 group-hover:shadow-lg transition-all duration-300">
                  {st.step}
                </div>
                <h4 className="font-display font-bold text-lg text-slate-900 mb-3">{st.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed px-2">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-24 z-10 w-full">
        <div className="bg-[#9C1010] rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
          
          <div className="relative z-10">
            <Target className="w-16 h-16 text-white/90 mx-auto mb-8" />
            <h3 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight mb-6">
              Ready to Discover Your Profile?
            </h3>
            <p className="text-white/90 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of ambitious students who have uncovered their cognitive strengths and used them to accelerate their academic journey.
            </p>
            <Link
              href="/iq-test/instructions"
              className="inline-flex px-12 py-5 rounded-2xl bg-white text-[#9C1010] hover:bg-slate-50 font-extrabold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl items-center gap-3 text-lg"
            >
              Start Your Assessment Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="max-w-4xl mx-auto px-6 py-24 border-t border-slate-100 z-10 w-full">
        <div className="text-center mb-16">
          <HelpCircle className="w-12 h-12 text-[#9C1010] mx-auto mb-6 opacity-80" />
          <h3 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h3>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 shadow-sm">
            <h4 className="font-display font-bold text-slate-900 text-lg">Is this IQ test scientifically validated?</h4>
            <p className="text-base text-slate-500 font-medium leading-relaxed mt-3">
              Yes. The questions are modeled after standard Wechsler Adult Intelligence Scale (WAIS) structures and CAT/GMAT psychometric reasoning logic to ensure a balanced, challenging distribution.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 shadow-sm">
            <h4 className="font-display font-bold text-slate-900 text-lg">Can I pause the 45-minute timer?</h4>
            <p className="text-base text-slate-500 font-medium leading-relaxed mt-3">
              No. To ensure scoring validity, the assessment must be completed in one sitting without pauses. The test automatically submits when the timer runs out.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 shadow-sm">
            <h4 className="font-display font-bold text-slate-900 text-lg">What do I get in the Basic vs Premium reports?</h4>
            <p className="text-base text-slate-500 font-medium leading-relaxed mt-3">
              The Basic Report contains your overall IQ score, percentile ranking, and domain breakdown graph. The Premium Report adds custom-generated AI insights (300-500 words of strengths/weaknesses), career suggestions, and a downloadable, validated PDF certificate.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Tools CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10 w-full border-t border-slate-100">
        <PremiumToolsCards />
      </section>
    </div>
  );
}
