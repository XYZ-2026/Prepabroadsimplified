"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Brain, Star, Target, BookOpen, Briefcase, ChevronRight, CheckCircle2, X } from "lucide-react";
import "@/app/(main)/psychometric-test/assessment.css";
import { PARENT_ASSESSMENT, PARENT_SEC_META } from "@/app/(main)/psychometric-test/parent-assessment-data";

type Screen = "verifying" | "invalid_result" | "landing" | "parent_info" | "questions" | "submitting" | "thank_you";

function ParentAssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultIdParam = searchParams.get('resultId');

  const [screen, setScreen] = useState<Screen>("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Data from result verification
  const [studentName, setStudentName] = useState("");
  const [resultId, setResultId] = useState("");
  
  // Parent Info
  const [parentName, setParentName] = useState("");
  const [parentRelation, setParentRelation] = useState("");
  
  // Assessment State
  const [currentSecIdx, setCurrentSecIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showSecIntro, setShowSecIntro] = useState(true);

  // Auto-save refs
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedAnswersRef = useRef<Record<number, number>>({});

  useEffect(() => {
    // Verify result ID or fetch latest pending for user
    fetch('/api/parent-assessment/verify-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resultId: resultIdParam })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudentName(data.studentName);
          setResultId(data.resultId);
          if (data.savedState) {
            setAnswers(data.savedState.answers || {});
            setParentName(data.savedState.parentName || "");
            setParentRelation(data.savedState.parentRelation || "");
            lastSavedAnswersRef.current = data.savedState.answers || {};
          }
          setScreen("landing");
        } else {
          setScreen("invalid_result");
          setErrorMessage(data.error || "Psychometric assessment result not found.");
        }
      })
      .catch(err => {
        console.error(err);
        setScreen("invalid_result");
        setErrorMessage("Failed to load assessment. Please make sure you have completed the student psychometric test.");
      });
  }, [resultIdParam]);

  // Save Progress
  const saveProgress = async (currentAnswers: Record<number, number>) => {
    if (!resultId) return;
    try {
      await fetch('/api/parent-assessment/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId,
          answers: currentAnswers,
          parentName,
          parentRelation
        })
      });
      lastSavedAnswersRef.current = { ...currentAnswers };
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const scheduleSave = (currentAnswers: Record<number, number>) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(currentAnswers);
    }, 4000);
  };

  const handleStart = () => {
    if (parentName && parentRelation) {
      setScreen("questions");
      saveProgress(answers);
    } else {
      setScreen("parent_info");
    }
  };

  const handleContinueToQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !parentRelation) return;
    setScreen("questions");
    saveProgress(answers);
  };

  const handleAnswer = (qId: number, optionIdx: number) => {
    const newAnswers = { ...answers, [qId]: optionIdx };
    setAnswers(newAnswers);
    scheduleSave(newAnswers);

    setTimeout(() => {
      goNextQ();
    }, 350);
  };

  const goNextQ = () => {
    const currentSection = PARENT_ASSESSMENT.sections[currentSecIdx];
    if (currentQIdx < currentSection.questions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      if (currentSecIdx < PARENT_ASSESSMENT.sections.length - 1) {
        setCurrentSecIdx(prev => prev + 1);
        setCurrentQIdx(0);
        setShowSecIntro(true);
        saveProgress(answers);
      } else {
        handleSubmitFinal();
      }
    }
  };

  const goPrevQ = () => {
    if (currentQIdx > 0) {
      setCurrentQIdx(prev => prev - 1);
    } else if (currentSecIdx > 0) {
      setCurrentSecIdx(prev => prev - 1);
      setCurrentQIdx(PARENT_ASSESSMENT.sections[currentSecIdx - 1].questions.length - 1);
      setShowSecIntro(false);
    }
  };

  const handleSubmitFinal = async () => {
    if (!resultId) return;
    setScreen("submitting");
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    try {
      const res = await fetch('/api/parent-assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId,
          answers,
          parentName,
          parentRelation
        })
      });
      const data = await res.json();
      if (data.success) {
        setScreen("thank_you");
      } else {
        alert("Failed to submit assessment: " + (data.error || "Unknown error"));
        setScreen("questions");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try submitting again.");
      setScreen("questions");
    }
  };

  const renderIcon = (iconStr: string, size = 24) => {
    const iconMap: Record<string, React.ElementType> = {
      '👁️': Brain,
      '🎯': Target,
      '💰': Briefcase,
      '🌍': Star,
      '🤝': CheckCircle2,
      '🛡️': BookOpen,
    };
    const IconComponent = iconMap[iconStr] || Brain;
    return <IconComponent size={size} />;
  };

  if (screen === "verifying") {
    return (
      <div className="assessment-root">
        <div className="as-load-screen">
          <div className="as-ring"></div>
          <p className="as-load-title">Loading Parent Assessment...</p>
        </div>
      </div>
    );
  }

  if (screen === "invalid_result") {
    return (
      <div className="assessment-root">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px', padding: '2.5rem', background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--sh-lg)' }}>
            <div style={{ color: '#ef4444', marginBottom: '1.5rem' }}>
              <X size={56} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--t1)' }}>Parent Assessment Locked</h2>
            <p style={{ color: 'var(--t3)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>{errorMessage}</p>
            <button 
              onClick={() => router.push('/psychometric-test')}
              className="as-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Go to Student Psychometric Test →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "landing") {
    return (
      <div className="assessment-root">
        <div className="as-hero">
          <div className="as-hero-bg"></div>
          <div className="as-hero-badge">
            <Brain size={16} /> Parent–Student Alignment Battery
          </div>
          <h1 className="as-hero-title">
            Parent Psychometric <span className="r">Assessment</span>
          </h1>
          <p className="as-hero-sub">
            {studentName} has completed their student psychometric test. Completing this 20-question evaluation unlocks {studentName}'s comprehensive career dossier and family consensus insights.
          </p>
          <div className="as-hero-cta">
            <button onClick={handleStart} className="as-btn-primary" style={{ padding: '16px 40px', fontSize: '17px' }}>
              Begin Parent Evaluation →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "parent_info") {
    return (
      <div className="assessment-root">
        <div className="as-form-wrap">
          <div className="as-form-hd">
            <h1>Parent / Guardian Details</h1>
            <p>Please enter your information to personalize the family consensus evaluation.</p>
          </div>
          <div className="as-form-card">
            <form onSubmit={handleContinueToQuestions}>
              <div className="as-form-grid">
                <div className="as-fg full">
                  <label className="as-flbl">Your Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="as-finp"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                  />
                </div>
                <div className="as-fg full">
                  <label className="as-flbl">Relationship to {studentName}</label>
                  <select 
                    required
                    className="as-finp as-finp-select"
                    value={parentRelation}
                    onChange={e => setParentRelation(e.target.value)}
                  >
                    <option value="">Select relationship...</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Legal Guardian</option>
                    <option value="other">Other Relative</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="as-btn-primary as-form-submit" style={{ justifyContent: 'center' }}>
                Start Questions →
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "submitting") {
    return (
      <div className="assessment-root">
        <div className="as-load-screen">
          <div className="as-ring"></div>
          <p className="as-load-title">Analyzing Parent–Student Alignment...</p>
          <p className="as-load-sub">Unlocking full career dossier & family insights...</p>
        </div>
      </div>
    );
  }

  if (screen === "thank_you") {
    return (
      <div className="assessment-root">
        <div className="as-hero" style={{ padding: '60px 24px' }}>
          <div style={{ color: 'var(--green)', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
          </div>
          <h1 className="as-hero-title" style={{ fontSize: '2.5rem' }}>
            Parent Assessment <span className="r">Completed!</span>
          </h1>
          <p className="as-hero-sub" style={{ maxWidth: '620px' }}>
            Thank you for completing your evaluation. The complete career assessment dossier, aptitude analysis, and AI family consensus report for <strong>{studentName}</strong> have been fully unlocked!
          </p>
          <div className="as-hero-cta">
            <button 
              onClick={() => router.push(`/psychometric-test?resultId=${resultId}`)}
              className="as-btn-primary" 
              style={{ padding: '16px 36px', fontSize: '17px' }}
            >
              View Full Career Report →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Questions Screen ─────────────────────────────────────────────────────

  const currentSection = PARENT_ASSESSMENT.sections[currentSecIdx];
  const currentQuestion = currentSection.questions[currentQIdx];
  const sectionMeta = PARENT_SEC_META.find(s => s.id === currentSection.id);
  
  const totalQuestions = PARENT_ASSESSMENT.sections.reduce((acc, sec) => acc + sec.questions.length, 0);
  const totalAnswered = Object.keys(answers).length;
  const progressPct = Math.round((totalAnswered / totalQuestions) * 100);

  if (showSecIntro && sectionMeta) {
    return (
      <div className="assessment-root">
        <div className="as-form-wrap" style={{ paddingTop: '60px' }}>
          <div className="as-form-card" style={{ borderColor: sectionMeta.color }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${sectionMeta.color}15`, color: sectionMeta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {renderIcon(sectionMeta.icon, 32)}
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: sectionMeta.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  SECTION {currentSecIdx + 1} OF {PARENT_ASSESSMENT.sections.length}
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--t1)', margin: '4px 0 8px' }}>{sectionMeta.name}</h2>
                <p style={{ color: 'var(--t3)', fontSize: '15px', lineHeight: 1.6 }}>{sectionMeta.desc}</p>
              </div>
            </div>
            
            <div style={{ background: 'var(--bg)', padding: '20px', borderRadius: '14px', marginBottom: '28px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--t1)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={18} style={{ color: sectionMeta.color }} />
                Why this matters
              </h3>
              <p style={{ color: 'var(--t2)', fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>{sectionMeta.why}</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0, listStyle: 'none' }}>
                {sectionMeta.whyPoints.map((pt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--t2)' }}>
                    <CheckCircle2 size={16} style={{ color: sectionMeta.color, flexShrink: 0, marginTop: '2px' }} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              className="as-btn-primary"
              style={{ width: '100%', justifyContent: 'center', background: sectionMeta.color }}
              onClick={() => setShowSecIntro(false)}
            >
              Start Section <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isLikert = currentSection.type === 'likert';

  return (
    <div className="assessment-root">
      {/* Sticky Q Header & Progress */}
      <div className="as-q-header">
        <div className="as-q-hd-inner">
          <div className="as-q-sec-info">
            <div className="as-q-sec-icon" style={{ backgroundColor: `${currentSection.color}15`, color: currentSection.color }}>
              {renderIcon(currentSection.icon, 20)}
            </div>
            <div>
              <div className="as-q-sec-lbl">SECTION {currentSecIdx + 1} OF {PARENT_ASSESSMENT.sections.length}</div>
              <div className="as-q-sec-name">{currentSection.name}</div>
            </div>
          </div>
          <div className="as-q-prog-info">
            <div style={{ fontWeight: 700, color: 'var(--t1)' }}>Parent Evaluation Progress</div>
            <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '2px' }}>{progressPct}% Complete</div>
          </div>
        </div>
        <div className="as-prog-wrap">
          <div className="as-prog-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Main Question Body */}
      <div className="as-q-body">
        <div className="as-q-card">
          <div className="as-q-num">
            Question {currentQIdx + 1} of {currentSection.questions.length}
          </div>

          <div className="as-q-text">
            {currentQuestion.text}
          </div>

          <div>
            {isLikert ? (
              <div className="as-likert-row">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers[currentQuestion.id] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(currentQuestion.id, i)}
                      className={`as-lik-btn ${isSelected ? 'sel' : ''}`}
                    >
                      <span className="as-lik-lbl">{opt}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="as-opts">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = answers[currentQuestion.id] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(currentQuestion.id, i)}
                      className={`as-opt-btn ${isSelected ? 'sel' : ''}`}
                    >
                      <span className="as-opt-ltr">{String.fromCharCode(65 + i)}</span>
                      <span className="as-opt-txt">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="as-nav-btns" style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <button 
              onClick={goPrevQ} 
              className="as-btn-secondary"
              disabled={currentSecIdx === 0 && currentQIdx === 0}
            >
              Previous
            </button>
            
            <button 
              onClick={goNextQ} 
              className="as-btn-primary"
              disabled={answers[currentQuestion.id] === undefined}
            >
              {currentSecIdx === PARENT_ASSESSMENT.sections.length - 1 && currentQIdx === currentSection.questions.length - 1 ? 'Submit Evaluation →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParentAssessmentPage() {
  return (
    <Suspense fallback={<div className="assessment-root"><div className="as-load-screen"><div className="as-ring"></div></div></div>}>
      <ParentAssessmentContent />
    </Suspense>
  );
}
