'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Play, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  Wifi, 
  Brain, 
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import TermsPopup from '@/components/TermsPopup';

const rules = [
  { text: 'Complete the assessment in one sitting without external aid.', icon: CheckCircle2 },
  { text: '15-minute standardized countdown timer.', icon: Clock },
  { text: '45 items across 5 core cognitive reasoning domains.', icon: HelpCircle },
  { text: 'Ensure a stable internet connection before beginning.', icon: Wifi },
  { text: 'Solve questions independently using visual & logical analysis.', icon: Brain },
  { text: 'Your estimated cognitive score is compiled instantly upon completion.', icon: CheckCircle2 },
];

export default function InstructionsPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showTerms, setShowTerms] = React.useState(false);

  const handleStartTest = async () => {
    setLoading(true);
    setError('');
    try {
      sessionStorage.setItem('active_assessment_id', 'test_' + Date.now().toString());
      router.push('/iq-test/test');
    } catch (err: any) {
      console.error('[Start Test Error]:', err);
      setError(err.message || 'Failed to initialize the assessment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center py-6 px-4 relative font-sans">
      <div className="absolute top-0 w-full h-[40vh] bg-gradient-to-b from-slate-200/50 to-transparent pointer-events-none" />

      <Link href="/iq-test" className="absolute top-8 left-8 text-sm font-semibold text-slate-500 hover:text-black transition-colors flex items-center gap-1.5 z-10">
        <ChevronLeft className="w-4 h-4" />
        Back to IQ Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-[2rem] border border-purple-100 p-1 shadow-2xl relative z-10"
      >
        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 md:p-8 flex flex-col">
          
          <div className="flex flex-col md:flex-row items-center gap-6 border-b border-slate-100 pb-6 mb-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#690b1b] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#690b1b]/20">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight mb-1">Assessment Instructions</h1>
              <p className="text-xs text-slate-500 font-medium">Standardized 45-Item Visual & Logical Cognitive Assessment</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center justify-center bg-purple-50/50 border border-purple-100 rounded-2xl p-4 text-center">
              <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest mb-1">Questions</div>
              <div className="text-2xl font-display font-black text-[#690b1b]">45</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-purple-50/50 border border-purple-100 rounded-2xl p-4 text-center">
              <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest mb-1">Duration</div>
              <div className="text-2xl font-display font-black text-[#690b1b]">15<span className="text-xs text-slate-400 ml-1">min</span></div>
            </div>
            <div className="flex flex-col items-center justify-center bg-purple-50/50 border border-purple-100 rounded-2xl p-4 text-center">
              <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest mb-1">Sections</div>
              <div className="text-2xl font-display font-black text-[#690b1b]">5</div>
            </div>
          </div>

          <div className="mb-6 pl-4 border-l-2 border-[#690b1b]">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">5 Cognitive Domains</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
              <div>1. Visual Pattern & Matrix Reasoning</div>
              <div>2. Spatial / Figure Reasoning</div>
              <div>3. Numerical & Quantitative Reasoning</div>
              <div>4. Logical & Verbal Reasoning</div>
              <div className="sm:col-span-2">5. Sequence, Working Memory & Abstract Reasoning</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 mb-6 text-white">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#690b1b]" />
              Guidelines
            </h2>
            <div className="space-y-2.5">
              {rules.map((rule, idx) => {
                const Icon = rule.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-relaxed font-medium">{rule.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 text-center">
              {error}
            </div>
          )}

          <div>
            <button
              onClick={() => setShowTerms(true)}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#690b1b] hover:bg-[#830e22] text-white font-extrabold text-sm shadow-xl shadow-[#690b1b]/20 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              {loading ? 'Initializing Session...' : 'Begin Cognitive Assessment'}
            </button>
          </div>

        </div>
      </motion.div>

      <TermsPopup
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onProceed={() => {
          setShowTerms(false);
          handleStartTest();
        }}
      />
    </div>
  );
}
