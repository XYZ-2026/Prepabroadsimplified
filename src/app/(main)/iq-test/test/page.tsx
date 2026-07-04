'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Clock, 
  Check, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  category: string;
  imageUrl?: string;
  selected_option?: string | null;
}

const CATEGORY_NAMES: Record<string, string> = {
  'logical_reasoning': 'Logical',
  'pattern_recognition': 'Patterns',
  'numerical_intelligence': 'Math',
  'verbal_reasoning': 'Verbal',
  'analytical_thinking': 'Analytical',
  'problem_solving': 'Problems'
};

export default function TestPage() {
  const router = useRouter();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45 * 60);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const aid = sessionStorage.getItem('active_assessment_id');
    if (!aid) {
      router.push('/instructions');
      return;
    }
    setAssessmentId(aid);

    const loadQuestions = async () => {
      try {
        const res = await fetch('/api/iq-test/questions');
        const data = await res.json();
        
        if (data.success) {
          // Initialize selected_option as null
          const mapped = data.questions.map((q: any, idx: number) => ({
            ...q,
            id: idx,
            selected_option: null
          }));
          setQuestions(mapped);
        } else {
          setError(data.message || 'Failed to load assessment questions.');
        }
        setLoading(false);
      } catch (err: any) {
        console.error('[Load Questions Error]:', err);
        setError(err.message || 'Failed to load assessment questions.');
        setLoading(false);
      }
    };

    loadQuestions();
  }, [router]);

  useEffect(() => {
    if (loading || error || showSubmitModal || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, error, showSubmitModal, submitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveAnswer = async (qIndex: number, option: string | null) => {
    // We keep state locally and don't ping the server per-question to save bandwidth.
    setSaveStatus('saved');
  };

  const handleSelectOption = (optionLetter: string) => {
    if (submitting) return;
    const updated = [...questions];
    const prevOption = updated[currentIndex].selected_option;
    const newOption = prevOption === optionLetter ? null : optionLetter;
    updated[currentIndex].selected_option = newOption;
    setQuestions(updated);
    saveAnswer(currentIndex, newOption);
  };

  const goNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || submitting || loading) return;
      const key = e.key.toLowerCase();
      if (key === 'a') handleSelectOption('A');
      else if (key === 'b') handleSelectOption('B');
      else if (key === 'c') handleSelectOption('C');
      else if (key === 'd') handleSelectOption('D');
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions, showSubmitModal, submitting, loading, goNext, goPrev]);

  const handleManualSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const executeSubmission = async () => {
    if (!assessmentId) return;
    setSubmitting(true);
    setShowSubmitModal(false);
    try {
      const answers = questions.map(q => ({
        question: q.question,
        answer: q.selected_option
      }));

      const res = await fetch('/api/iq-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      
      const data = await res.json();
      if (data.success) {
        // Clear any old local storage data, redirect to the persistent result page
        sessionStorage.removeItem('iq_score');
        sessionStorage.removeItem('iq_correct');
        sessionStorage.removeItem('iq_total');
        sessionStorage.removeItem('iq_evaluated');
        router.replace(`/iq-test/result/${data.resultId}`);
      } else {
        throw new Error('Server error');
      }
    } catch (err: any) {
      console.error('[Submission Error]:', err);
      alert(err.message || 'Failed to submit test. Please check connection and try again.');
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (!assessmentId || submitting) return;
    setSubmitting(true);
    try {
      const answers = questions.map(q => ({
        question: q.question,
        answer: q.selected_option
      }));

      const res = await fetch('/api/iq-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('iq_score', data.score);
        sessionStorage.setItem('iq_correct', data.correctCount);
        sessionStorage.setItem('iq_total', data.totalCount);
        router.replace(`/iq-test/result/${data.resultId || 'results'}`);
      }
    } catch (err) {
      console.error('[Auto-Submit Error]:', err);
      router.replace(`/iq-test/results`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-10 h-10 text-[#9C1010] animate-spin" />
        <span className="text-sm text-slate-500">Loading your secure assessment session...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center gap-4 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-[#9C1010]" />
        <h1 className="text-xl font-bold text-slate-800">Initialization Error</h1>
        <p className="text-sm text-slate-500 max-w-md">{error}</p>
        <button onClick={() => router.push('/instructions')} className="px-6 py-2 bg-[#9C1010] text-white rounded-lg text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter(q => q.selected_option !== null).length;
  const progressPercent = (answeredCount / questions.length) * 100;
  const uniqueCategories = ['all', ...Array.from(new Set(questions.map(q => q.category)))];

  const getQuestionButtonClass = (index: number, q: Question) => {
    const isCurrent = index === currentIndex;
    const isAnswered = q.selected_option !== null;

    let base = "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer border ";
    
    if (isCurrent) {
      base += "border-[#9C1010] bg-[#9C1010]/10 text-[#9C1010] ring-2 ring-primary/20 ";
    } else if (isAnswered) {
      base += "border-emerald-300 bg-emerald-50 text-emerald-700 ";
    } else {
      base += "border-slate-200 bg-slate-50/40 text-slate-400 hover:border-slate-350 hover:text-slate-700 ";
    }

    return base;
  };
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-black font-sans overflow-hidden select-none relative">
      
      {/* Background accents */}
      <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-slate-200/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#9C1010]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-400/10 blur-[120px] pointer-events-none" />

      {/* Main Grid: Question Space + Navigation Panel */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Question Area */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto relative z-10">
          <div className="max-w-4xl w-full mx-auto flex flex-col justify-between min-h-full">
            
            {/* Elevated Card */}
            <div className="bg-white rounded-[2rem] border border-white/40 p-1 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl flex-1 flex flex-col">
              <div className="rounded-[1.75rem] border border-slate-100 bg-white/80 p-5 md:p-8 flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#9C1010]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            {/* Header info */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Domain</span>
                  <span className="text-sm font-semibold text-slate-800">{CATEGORY_NAMES[currentQuestion.category] || currentQuestion.category}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Progress</span>
                    <span className="text-xs font-semibold text-slate-700">{answeredCount} of 60</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm font-bold border transition-colors ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-[#9C1010] animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-[#9C1010]' : 'text-slate-400'}`} />
                    <span className="font-mono text-base tracking-wide">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden relative z-10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#9C1010] to-[#d62828] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Question Text */}
              <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 leading-relaxed mb-6 whitespace-pre-wrap relative z-10">
                <span className="text-slate-400 mr-2">{currentIndex + 1}.</span> {currentQuestion.question}
              </h2>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3 mb-6 relative z-10">
                {[
                  { key: 'A', text: currentQuestion.optionA },
                  { key: 'B', text: currentQuestion.optionB },
                  { key: 'C', text: currentQuestion.optionC },
                  { key: 'D', text: currentQuestion.optionD },
                ].map((opt) => {
                  const isSelected = currentQuestion.selected_option === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      disabled={submitting}
                      className={`w-full p-4 md:p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all duration-300 group shadow-sm transform hover:-translate-y-0.5 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#9C1010]/5 to-transparent border-[#9C1010] shadow-[0_0_15px_rgba(156,16,16,0.1)] ring-1 ring-[#9C1010]/20' 
                          : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4 pr-4">
                        <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${
                          isSelected ? 'bg-[#9C1010] text-white shadow-inner' : 'bg-slate-100/80 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                        }`}>
                          {opt.key}
                        </div>
                        <span className={`text-base font-medium leading-relaxed transition-colors ${
                          isSelected ? 'text-[#9C1010]' : 'text-slate-700 group-hover:text-slate-900'
                        }`}>
                          {opt.text}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#9C1010] flex items-center justify-center text-white shrink-0 shadow-sm">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Question Actions */}
            <div className="border-t border-slate-100 pt-5 mt-auto flex items-center justify-between relative z-10">
              <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                Question {currentIndex + 1} of 60
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0 || submitting}
                  className="w-12 h-12 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-sm transition-all hover:-translate-x-0.5"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goNext}
                  disabled={currentIndex === questions.length - 1 || submitting}
                  className="w-12 h-12 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-sm transition-all hover:translate-x-0.5"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
              </div>
            </div>
          </div>
        </main>

        {/* Right Side: Sidebar Navigation Grid */}
        <aside className="w-80 bg-white/70 backdrop-blur-xl border-l border-white/60 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden shrink-0 hidden lg:flex relative z-10">
          
          {/* Domain Quick Filters */}
          <div className="p-5 border-b border-slate-200/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-3">
              Category Filter
            </span>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider border transition-all cursor-pointer shadow-sm ${
                    selectedFilter === cat
                      ? 'bg-[#9C1010] border-[#9C1010] text-white shadow-md shadow-[#9C1010]/20'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All' : (CATEGORY_NAMES[cat] || cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Question Links */}
          <div className="flex-1 overflow-y-auto p-5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-4">
              Questions Map
            </span>
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((q, idx) => {
                if (selectedFilter !== 'all' && q.category !== selectedFilter) {
                  return null;
                }
                const isCurrent = idx === currentIndex;
                const isAnswered = q.selected_option !== null;

                let baseClass = "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer border shadow-sm ";
                
                if (isCurrent) {
                  baseClass += "border-[#9C1010] bg-[#9C1010] text-white ring-4 ring-[#9C1010]/20 transform scale-110 shadow-lg ";
                } else if (isAnswered) {
                  baseClass += "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ";
                } else {
                  baseClass += "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50 ";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => { if (!submitting) setCurrentIndex(idx); }}
                    className={baseClass}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action Footer Panel */}
          <div className="p-5 bg-slate-50/80 border-t border-slate-200/50 backdrop-blur-md">
            <button
              onClick={handleManualSubmitClick}
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#9C1010] to-[#7a0c0c] hover:from-[#7a0c0c] hover:to-[#5c0808] text-white font-bold text-sm transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#9C1010]/20 hover:shadow-[#9C1010]/40 transform hover:-translate-y-0.5"
            >
              Submit Assessment
            </button>
          </div>
        </aside>
      </div>

      {/* Confirmation Submit Modal overlay */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-2xl relative"
            >
              <h3 className="text-xl font-display font-extrabold text-slate-900 mb-2">Submit Assessment?</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Are you sure you want to end your test? You have answered{' '}
                <strong className="text-slate-800 font-bold">{answeredCount} of 60</strong> questions.{' '}
                You will not be able to change your selections after submission.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={executeSubmission}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-[#9C1010] text-white font-semibold text-xs hover:bg-[#9C1010]-hover shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Confirm Submit'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
