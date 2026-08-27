'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Clock, 
  Check, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface QuestionOption {
  label: string;
  text: string;
  svgContent?: string;
}

interface IQQuestion {
  id: number;
  section: number;
  sectionName: string;
  category: string;
  difficulty: string;
  prompt: string;
  questionType: 'svg_matrix' | 'svg_sequence' | 'svg_analogy' | 'svg_spatial' | 'text' | 'numeric_pattern';
  svgData?: {
    matrixType?: '2x2' | '3x3' | 'analogy' | 'sequence' | 'shape_count' | 'pattern_grid';
    gridCells?: string[];
    missingIndex?: number;
    options?: string[];
  };
  options: QuestionOption[];
  userOption?: string | null;
}

export default function IQTestRunnerPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<IQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 Minutes default
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Stages: 'prep' -> 'testing' -> 'distraction_check' -> 'calculating'
  const [stage, setStage] = useState<'prep' | 'testing' | 'distraction_check' | 'calculating'>('prep');
  const [calcProgress, setCalcProgress] = useState<number>(0);
  const [distractionReported, setDistractionReported] = useState<'Yes' | 'No' | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const advancingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load 45 Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/iq-test/questions');
        const data = await res.json();

        if (data.success && Array.isArray(data.questions) && data.questions.length === 45) {
          // Restore saved progress if available
          const savedAnswersJson = localStorage.getItem('iq45_answers');
          let savedAnswers: Record<number, string> = {};
          if (savedAnswersJson) {
            try { savedAnswers = JSON.parse(savedAnswersJson); } catch (e) {}
          }

          const mapped: IQQuestion[] = data.questions.map((q: any) => ({
            ...q,
            userOption: savedAnswers[q.id] || null
          }));

          setQuestions(mapped);

          // Restore timer
          const savedTime = localStorage.getItem('iq45_time_left');
          if (savedTime) {
            const parsed = parseInt(savedTime, 10);
            if (!isNaN(parsed) && parsed > 0) setTimeLeft(parsed);
          }

          setLoading(false);

          // Pre-test prep animation timer (1.5 seconds)
          setTimeout(() => {
            setStage('testing');
          }, 1500);

        } else {
          setError(data.message || 'Failed to initialize the 45-question cognitive bank.');
          setLoading(false);
        }
      } catch (err: any) {
        console.error('[Load IQ Questions Error]:', err);
        setError(err.message || 'Error loading cognitive test session.');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (loading || error || stage !== 'testing' || submitting) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        const nextTime = prev - 1;
        localStorage.setItem('iq45_time_left', nextTime.toString());
        return nextTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, error, stage, submitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionLabel: string) => {
    if (submitting || advancingRef.current || stage !== 'testing') return;

    const updated = [...questions];
    const currentQ = updated[currentIndex];
    const prevSelection = currentQ.userOption;
    const newSelection = prevSelection === optionLabel ? null : optionLabel;

    currentQ.userOption = newSelection;
    setQuestions(updated);

    // Save to local progress
    const savedAnswersJson = localStorage.getItem('iq45_answers');
    let savedAnswers: Record<number, string> = {};
    if (savedAnswersJson) {
      try { savedAnswers = JSON.parse(savedAnswersJson); } catch (e) {}
    }
    if (newSelection) {
      savedAnswers[currentQ.id] = newSelection;
    } else {
      delete savedAnswers[currentQ.id];
    }
    localStorage.setItem('iq45_answers', JSON.stringify(savedAnswers));

    // Auto-advance to next question if selected
    if (newSelection !== null && currentIndex < questions.length - 1) {
      advancingRef.current = true;
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        advancingRef.current = false;
      }, 300);
    }
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

  const handleFinishTestSequence = () => {
    setStage('distraction_check');
  };

  const handleTimeExpired = () => {
    setStage('distraction_check');
  };

  const submitFinalAssessment = async (distractionAnswer: 'Yes' | 'No') => {
    setDistractionReported(distractionAnswer);
    setStage('calculating');
    setSubmitting(true);

    // Calculation progress animation
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setCalcProgress(Math.min(100, prog));
      if (prog >= 100) clearInterval(interval);
    }, 300);

    try {
      const answersPayload = questions.map(q => ({
        questionId: q.id,
        userOption: q.userOption || null
      }));

      const elapsedTime = (15 * 60) - timeLeft;

      const res = await fetch('/api/iq-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answersPayload,
          distractionReported: distractionAnswer,
          elapsedTime
        })
      });

      const data = await res.json();

      // Clear local storage test progress
      localStorage.removeItem('iq45_answers');
      localStorage.removeItem('iq45_time_left');

      if (data.success && data.resultId) {
        setTimeout(() => {
          router.replace(`/iq-test/result/${data.resultId}`);
        }, 1800);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error('[Submit Error]:', err);
      alert(err.message || 'Failed to submit cognitive test. Please retry.');
      setSubmitting(false);
      setStage('testing');
    }
  };

  if (loading || stage === 'prep') {
    return (
      <div className="min-h-screen bg-[#faf8fc] flex flex-col justify-center items-center gap-5 px-6 text-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-[#690b1b]/10 flex items-center justify-center text-[#690b1b] animate-pulse">
            <BrainCircuit className="w-10 h-10" />
          </div>
          <Loader2 className="w-8 h-8 text-[#690b1b] animate-spin absolute -top-2 -right-2" />
        </div>
        <h2 className="text-2xl font-display font-extrabold text-slate-900">Preparing Cognitive Assessment</h2>
        <div className="flex flex-col gap-2 max-w-sm w-full text-xs font-semibold text-slate-500">
          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <span>Assessment structure (45 items)</span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <span>Visual Matrix & Spatial Engines</span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-sm">
            <span>Standardized Scoring Model</span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center gap-4 px-6 text-center">
        <AlertCircle className="w-12 h-12 text-[#690b1b]" />
        <h1 className="text-xl font-bold text-slate-900">Session Initialization Error</h1>
        <p className="text-sm text-slate-500 max-w-md">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-[#690b1b] text-white rounded-xl text-xs font-bold shadow-md">
          Retry Session
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = questions.filter(q => q.userOption !== null).length;

  return (
    <div className="min-h-screen bg-[#f8f6fb] text-slate-900 font-sans flex flex-col select-none relative overflow-x-hidden">
      
      {/* ── TOP HEADER SHELL ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100/60 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        {/* Back Button */}
        <button 
          onClick={() => {
            if (confirm("Exit cognitive test? Your progress is saved locally.")) {
              router.push('/iq-test');
            }
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#690b1b] transition-colors bg-slate-100/70 hover:bg-slate-100 px-3 py-2 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Exit to IQ Home</span>
        </button>

        {/* Center Progress Counter */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200/60">
          <span className="text-sm font-display font-extrabold text-[#690b1b]">{currentIndex + 1}</span>
          <span className="text-xs font-bold text-purple-400">/ 45</span>
        </div>

        {/* Right Timer */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors ${
          timeLeft < 180 ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <Clock className="w-4 h-4 text-purple-600" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* ── MAIN CONTENT CANVAS ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 flex flex-col justify-between">
        
        {/* Section Header Badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-[#690b1b]/10 text-[#690b1b] text-[10px] font-extrabold tracking-widest uppercase">
              SECTION {currentQ.section} OF 5
            </span>
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              {currentQ.sectionName}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {answeredCount} of 45 Answered
          </span>
        </div>

        {/* Question Card Frame */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 md:p-10 shadow-xl shadow-purple-900/5 mb-8 flex-1 flex flex-col justify-between relative overflow-hidden">
          
          <div>
            {/* Question Prompt */}
            <h2 className="text-lg md:text-xl font-display font-bold text-slate-900 leading-snug mb-6">
              <span className="text-[#690b1b] mr-2">Q{currentIndex + 1}.</span> {currentQ.prompt}
            </h2>

            {/* SVG Visual Puzzle Frame (if applicable) */}
            {currentQ.svgData && (
              <div className="mb-8 p-6 bg-purple-50/40 rounded-2xl border border-purple-100/80 flex items-center justify-center">
                {currentQ.svgData.matrixType === '2x2' && (
                  <div className="grid grid-cols-2 gap-3 max-w-[260px] w-full">
                    {currentQ.svgData.gridCells?.map((cellSvg, idx) => (
                      <div key={idx} className="w-full aspect-square bg-white rounded-xl border border-purple-200/80 flex items-center justify-center p-2 shadow-sm">
                        {cellSvg === '?' ? (
                          <div className="text-2xl font-bold text-[#690b1b] animate-bounce">?</div>
                        ) : (
                          <svg viewBox="0 0 100 100" className="w-full h-full" dangerouslySetInnerHTML={{ __html: cellSvg }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {currentQ.svgData.matrixType === '3x3' && (
                  <div className="grid grid-cols-3 gap-2 max-w-[320px] w-full">
                    {currentQ.svgData.gridCells?.map((cellSvg, idx) => (
                      <div key={idx} className="w-full aspect-square bg-white rounded-lg border border-purple-200/80 flex items-center justify-center p-1.5 shadow-sm">
                        {cellSvg === '?' ? (
                          <div className="text-xl font-bold text-[#690b1b] animate-bounce">?</div>
                        ) : (
                          <svg viewBox="0 0 100 100" className="w-full h-full" dangerouslySetInnerHTML={{ __html: cellSvg }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {currentQ.questionType === 'svg_spatial' && currentQ.svgData?.gridCells && (
                  <div className="w-full max-w-[200px] aspect-square bg-white rounded-2xl border border-purple-200 p-3 flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 100 100" className="w-full h-full" dangerouslySetInnerHTML={{ __html: currentQ.svgData.gridCells[0] }} />
                  </div>
                )}
              </div>
            )}

            {/* Answer Options Grid */}
            <div className={`grid gap-3.5 ${currentQ.svgData ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
              {currentQ.options.map((opt) => {
                const isSelected = currentQ.userOption === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt.label)}
                    className={`w-full p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#690b1b]/5 border-[#690b1b] ring-2 ring-[#690b1b]/20 shadow-md' 
                        : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-[#690b1b] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {opt.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#690b1b]" />}
                    </div>

                    {opt.svgContent ? (
                      <div className="w-full aspect-square bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full" dangerouslySetInnerHTML={{ __html: opt.svgContent }} />
                      </div>
                    ) : (
                      <span className={`text-sm font-medium leading-normal ${isSelected ? 'text-[#690b1b] font-bold' : 'text-slate-700'}`}>
                        {opt.text}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-xs flex items-center gap-1 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {currentIndex === 44 ? (
            <button
              onClick={handleFinishTestSequence}
              className="px-6 py-3 rounded-xl bg-[#690b1b] hover:bg-[#830e22] text-white font-extrabold text-xs shadow-lg shadow-[#690b1b]/20 flex items-center gap-2 cursor-pointer"
            >
              Finish Assessment <Sparkles className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={goNext}
              className="px-5 py-2.5 rounded-xl bg-[#690b1b] hover:bg-[#830e22] text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-[#690b1b]/15 cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      {/* ── DISTRACTION METADATA CHECK MODAL ── */}
      <AnimatePresence>
        {stage === 'distraction_check' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-purple-100 rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#690b1b] flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-extrabold text-slate-900 mb-2">Test Environment Check</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Did you experience any major distractions while taking the test? 
                <br /><span className="text-[10px] text-slate-400 font-normal">(This metadata evaluates test conditions and does not alter your IQ score calculation).</span>
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => submitFinalAssessment('No')}
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  No, I was focused
                </button>
                <button
                  onClick={() => submitFinalAssessment('Yes')}
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-xl bg-[#690b1b] hover:bg-[#830e22] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Yes, I got distracted
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CALCULATION TRANSITION OVERLAY ── */}
      <AnimatePresence>
        {stage === 'calculating' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#690b1b]/10 text-[#690b1b] flex items-center justify-center mb-6 animate-pulse">
                <BrainCircuit className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-2">Calculating Your Cognitive Score...</h2>
              <p className="text-xs text-slate-500 mb-6">Evaluating 45 standardized visual and logical reasoning items.</p>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden mb-6 relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#690b1b] to-purple-600 rounded-full"
                  animate={{ width: `${calcProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="flex flex-col gap-2 w-full text-xs font-semibold text-slate-600 text-left">
                <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                  <span>Analyzing item responses</span>
                  {calcProgress >= 30 ? <Check className="w-4 h-4 text-emerald-600" /> : <Loader2 className="w-4 h-4 animate-spin text-purple-600" />}
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                  <span>Calculating domain percentile scores</span>
                  {calcProgress >= 70 ? <Check className="w-4 h-4 text-emerald-600" /> : null}
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                  <span>Generating cognitive classification report</span>
                  {calcProgress >= 100 ? <Check className="w-4 h-4 text-emerald-600" /> : null}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
