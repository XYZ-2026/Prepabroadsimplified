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

const rules = [
  { text: 'Complete the assessment in one sitting.', icon: CheckCircle2 },
  { text: 'The timer cannot be paused once started.', icon: Clock },
  { text: 'Each question carries equal weight in the score calculation.', icon: HelpCircle },
  { text: 'Ensure a stable internet connection before beginning.', icon: Wifi },
  { text: 'Solve questions independently without using external references or calculators.', icon: Brain },
  { text: 'Your intelligence report is compiled instantly upon submission.', icon: CheckCircle2 },
];

export default function InstructionsPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

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
      {/* Background accents */}
      <div className="absolute top-0 w-full h-[40vh] bg-gradient-to-b from-slate-200/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#690b1b]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-400/10 blur-[120px] pointer-events-none" />

      {/* Back to Home Link */}
      <Link href="/iq-test" className="absolute top-8 left-8 text-sm font-semibold text-slate-500 hover:text-black transition-colors flex items-center gap-1.5 z-10">
        <ChevronLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-white rounded-[2rem] border border-white/40 p-1 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative z-10 backdrop-blur-xl"
      >
        <div className="rounded-[1.75rem] border border-slate-100 bg-white/60 p-6 md:p-8 h-full flex flex-col">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-slate-100 pb-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#690b1b] blur-lg opacity-30 rounded-full animate-pulse" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#690b1b] to-[#600505] flex items-center justify-center text-white relative z-10 shadow-lg border border-[#c41616]">
                <Brain className="w-8 h-8 drop-shadow-md" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mb-1">Assessment Instructions</h1>
              <p className="text-sm text-slate-500 font-medium">Abroad Simplified Advanced Intelligence Assessment</p>
            </div>
          </div>

          {/* Info Grid (Premium) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Questions</div>
              <div className="text-2xl font-display font-black text-slate-800">60</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-10 h-10 bg-[#690b1b]/5 rounded-bl-full" />
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Duration</div>
              <div className="text-2xl font-display font-black text-slate-800">45<span className="text-base text-slate-400 ml-1">min</span></div>
            </div>
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Difficulty</div>
              <div className="text-sm font-display font-bold text-[#690b1b] tracking-widest mt-1 flex items-center gap-1.5">
                EASY <span className="text-slate-300">•</span> MED <span className="text-slate-300">•</span> ADV
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#690b1b]/0 via-[#690b1b]/20 to-[#690b1b]/0" />
            <div className="pl-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Evaluated Domains</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm font-medium text-slate-700">
                {['Logical Reasoning', 'Pattern Recognition', 'Numerical Intelligence', 'Verbal Reasoning', 'Analytical Thinking', 'Problem Solving'].map((domain, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-[#690b1b]/10 group-hover:border-[#690b1b]/30 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#690b1b] transition-colors" />
                    </div>
                    <span className="group-hover:text-black transition-colors">{domain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-slate-900 rounded-[1.5rem] p-6 mb-6 shadow-inner relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#690b1b]" />
              Crucial Guidelines
            </h2>
            <div className="space-y-3 relative z-10">
              {rules.map((rule, idx) => {
                const Icon = rule.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 text-[#690b1b]" />
                    </div>
                    <span className="text-sm text-slate-300 leading-relaxed font-medium">{rule.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="mt-auto">
            <button
              onClick={handleStartTest}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#690b1b] to-[#7a0c0c] hover:from-[#7a0c0c] hover:to-[#5c0808] text-white font-semibold text-base transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(105, 11, 27,0.3)] hover:shadow-[0_15px_30px_rgba(105, 11, 27,0.4)] hover:-translate-y-0.5 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Initializing Secure Session...
                </span>
              ) : (
                <>
                  Begin Assessment
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </div>
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              Secured & Monitored Session
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
