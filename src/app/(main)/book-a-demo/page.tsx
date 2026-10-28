'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  School,
  AlertCircle,
  HelpCircle,
  Edit2
} from 'lucide-react';
import { COMPANY_CONFIG } from '@/config/company';

// Academic stages
const ACADEMIC_LEVELS = [
  { id: 'High School (Grades 9-12)', label: 'High School (Grades 9–12)', tag: 'Most Popular', desc: 'Stream selection, SAT prep, & university admissions' },
  { id: 'Middle School (Grades 6-8)', label: 'Middle School (Grades 6–8)', tag: 'Foundation', desc: 'Aptitude exploration & study habit building' },
  { id: 'Higher Education/University Prep', label: 'Higher Education / University Prep', tag: 'Senior', desc: 'College application roadmaps & profile building' },
  { id: 'Primary School (Grades 1-5)', label: 'Primary School (Grades 1–5)', tag: 'Early Years', desc: 'Learning style discovery & curiosity development' },
];

const GRADE_OPTIONS = [
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
  'First Year College / Undergraduate', 'Other'
];

const BOARD_OPTIONS = ['CBSE', 'ICSE', 'IB (International Baccalaureate)', 'Cambridge (IGCSE / A-Levels)', 'State Board', 'Other'];

const STREAM_OPTIONS = [
  { id: 'Science (PCM)', label: 'Science (PCM)', desc: 'Physics, Chemistry, Mathematics' },
  { id: 'Science (PCB)', label: 'Science (PCB)', desc: 'Physics, Chemistry, Biology' },
  { id: 'Commerce with Maths', label: 'Commerce with Mathematics', desc: 'Accounts, Economics, Business Studies, Math' },
  { id: 'Commerce without Maths', label: 'Commerce without Mathematics', desc: 'Accounts, Economics, Business Studies, Informatics' },
  { id: 'Humanities / Liberal Arts', label: 'Humanities / Liberal Arts', desc: 'Psychology, Sociology, Political Science, History' },
  { id: 'Not Decided Yet', label: 'Not Decided Yet', desc: 'Exploring stream compatibility' },
];

const DEVELOPMENT_AREAS = [
  'Academic Confidence Building',
  'Strength Identification',
  'Career Guidance & Future Planning',
  'Study Skills & Time Management',
  'Interest Exploration',
];

const CLARVO_EXPLORATION_OPTIONS = [
  'Psychometric Assessment and Student Insights',
  'Academic Tutoring',
  'SAT Preparation',
  'Research and Profile Building',
  'Academic and Career Guidance',
  'Personalised Student Development',
  'Not Sure Yet — I Would Like Guidance',
];

const TIME_FRAMES = [
  { id: 'Weekday Evenings (4pm - 7pm)', label: 'Weekday Evenings', hours: '4:00 PM – 7:00 PM' },
  { id: 'Weekend', label: 'Weekend', hours: 'Saturday / Sunday Flexible' },
  { id: 'Weekday Afternoons (12pm - 4pm)', label: 'Weekday Afternoons', hours: '12:00 PM – 4:00 PM' },
  { id: 'Weekday Mornings (9am - 12pm)', label: 'Weekday Mornings', hours: '9:00 AM – 12:00 PM' },
];

const STEPS = [
  { step: 1, name: 'Family Contact', desc: 'Guardian & Student Details' },
  { step: 2, name: 'Academic Profile', desc: 'Stage, School & Board' },
  { step: 3, name: 'Goals & Services', desc: 'Development Priorities' },
  { step: 4, name: 'Review & Schedule', desc: 'Time Preference & Submit' },
];

export default function BookADemoPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentName: '',
    academicLevel: 'High School (Grades 9-12)',
    grade: '',
    schoolName: '',
    board: 'CBSE',
    stream: '',
    developmentAreas: ['Career Guidance & Future Planning', 'Strength Identification'],
    clarvoExploration: ['Psychometric Assessment and Student Insights', 'Academic and Career Guidance'],
    preferredTimeFrame: 'Weekday Evenings (4pm - 7pm)',
    notes: '',
    consent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState<string>('');
  const [prefilledFromAuth, setPrefilledFromAuth] = useState(false);

  // Check if user is signed in to prefill verified fields
  useEffect(() => {
    async function loadAuthProfile() {
      try {
        const res = await fetch('/api/user/update-profile');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.user) {
            const u = json.user;
            setFormData(prev => ({
              ...prev,
              parentName: prev.parentName || u.name || '',
              email: prev.email || u.email || '',
              phone: prev.phone || u.mobile || '',
              studentName: prev.studentName || u.studentName || (u.role === 'student' ? u.name : ''),
              grade: prev.grade || (u.grade ? `Grade ${u.grade}` : ''),
              schoolName: prev.schoolName || u.schoolName || u.currentSchool || '',
              board: prev.board || u.board || 'CBSE',
              stream: prev.stream || u.stream || '',
            }));
            setPrefilledFromAuth(true);
          }
        }
      } catch {
        // Guest user or offline, normal flow continues
      }
    }
    loadAuthProfile();
  }, []);

  // Multi-select toggle
  const toggleArrayItem = (key: 'developmentAreas' | 'clarvoExploration', item: string) => {
    setFormData((prev) => {
      const current = prev[key];
      const exists = current.includes(item);
      if (exists) {
        return { ...prev, [key]: current.filter((x) => x !== item) };
      } else {
        return { ...prev, [key]: [...current, item] };
      }
    });
  };

  // Step-scoped validation
  const validateStep = (stepNumber: number): boolean => {
    const errs: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.parentName.trim() || formData.parentName.trim().length < 2) {
        errs.parentName = 'Please enter the Parent / Guardian full name.';
      }

      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!cleanPhone || cleanPhone.length < 7 || cleanPhone.length > 16) {
        errs.phone = 'Please enter a valid phone or WhatsApp number (7–15 digits).';
      }

      if (formData.email.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          errs.email = 'Please enter a valid email address.';
        }
      }
    } else if (stepNumber === 2) {
      if (!formData.academicLevel) {
        errs.academicLevel = 'Please select the student’s academic stage.';
      }
    } else if (stepNumber === 3) {
      if (formData.developmentAreas.length === 0 && formData.clarvoExploration.length === 0) {
        errs.goals = 'Please select at least one development priority or CLARVO service.';
      }
    } else if (stepNumber === 4) {
      if (!formData.preferredTimeFrame) {
        errs.preferredTimeFrame = 'Please select a preferred consultation time window.';
      }
      if (!formData.consent) {
        errs.consent = 'Please confirm consent to allow our advisory team to contact you.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    setSubmitError(null);
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate step 4
    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/book-a-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/book-a-demo',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to submit consultation request.');
      }

      setSubmittedId(data.enquiryId || `ENQ-${Date.now().toString().slice(-6)}`);
      setIsSuccess(true);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again or reach out to support@clarvo.in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if stream selection is relevant (High School Grades 10-12)
  const isHighSchool = formData.academicLevel.includes('High School') || 
    formData.grade.includes('10') || 
    formData.grade.includes('11') || 
    formData.grade.includes('12');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-[#2563EB] selection:text-white pb-20">
      
      {/* ── TOP HERO HEADER ── */}
      <section className="bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] border-b border-[#E4E7EC] pt-8 sm:pt-12 pb-8 px-4 sm:px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] border border-[#2563EB]/25 text-[#2563EB] text-[11px] font-bold tracking-[0.14em] uppercase mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ADMISSIONS & ACADEMIC ADVISORY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#080F1C] tracking-tight leading-tight mb-3">
            Request an Educational Consultation
          </h1>
          <p className="text-sm sm:text-base text-[#475467] max-w-2xl mx-auto leading-relaxed">
            Connect with our certified education strategists to evaluate your child’s academic profile, stream fitment, or standardized test readiness.
          </p>

          {prefilledFromAuth && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-full">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prefilled from your verified CLARVO account. You can review or edit anytime.</span>
            </div>
          )}
        </div>
      </section>

      {/* ── MAIN CONTENT WIZARD CONTAINER ── */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 md:px-8 mt-6 sm:mt-10">
        
        {/* SUCCESS CONFIRMATION STATE */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl p-6 sm:p-12 text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/60 inline-block mb-3">
              CONSULTATION REQUEST RECEIVED
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-[#080F1C] tracking-tight mb-3">
              Thank You, {formData.parentName || 'Parent'}!
            </h2>

            <p className="text-sm sm:text-base text-[#475467] max-w-lg mx-auto leading-relaxed mb-6">
              Your consultation request has been recorded. Our educational guidance team will contact you via WhatsApp/Phone at <strong className="text-slate-900">{formData.phone}</strong> during your preferred window ({formData.preferredTimeFrame}) to finalize your session.
            </p>

            <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4 sm:p-6 max-w-md mx-auto text-left text-xs text-[#475467] space-y-2 mb-8">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-semibold text-slate-700">Reference ID:</span>
                <span className="font-mono text-slate-900 font-bold">{submittedId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="font-semibold text-slate-700">Student Stage:</span>
                <span className="text-slate-900">{formData.academicLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-700">Preferred Window:</span>
                <span className="text-slate-900">{formData.preferredTimeFrame}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/sample-reports"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold shadow-md transition"
              >
                Inspect Sample Psychometric Reports
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition"
              >
                Return to Homepage
              </Link>
            </div>
          </motion.div>
        ) : (
          /* ── ACTIVE WIZARD CONTAINER ── */
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden">
            
            {/* PROGRESS BAR HEADER */}
            <div className="bg-[#FAFBFD] border-b border-[#E2E8F0] px-4 sm:px-8 py-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-bold text-[#2563EB] uppercase tracking-wider">
                  Step {currentStep} of 4 · {STEPS[currentStep - 1].name}
                </span>
                <span className="text-xs text-[#64748B] font-medium hidden sm:inline">
                  {STEPS[currentStep - 1].desc}
                </span>
              </div>

              {/* Visual Step Dots / Bar */}
              <div className="grid grid-cols-4 gap-2">
                {STEPS.map((s) => {
                  const isDone = s.step < currentStep;
                  const isCurrent = s.step === currentStep;
                  return (
                    <div key={s.step} className="flex flex-col gap-1.5">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isDone 
                            ? 'bg-[#2563EB]' 
                            : isCurrent 
                            ? 'bg-[#2563EB] shadow-xs' 
                            : 'bg-slate-200'
                        }`} 
                      />
                      <span className={`text-[10px] sm:text-[11px] font-semibold text-center truncate ${
                        isCurrent ? 'text-[#2563EB]' : isDone ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        {s.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FORM BODY */}
            <div className="p-5 sm:p-8 md:p-10">
              <AnimatePresence mode="wait">
                
                {/* ── STEP 1: CONTACT & FAMILY INFO ── */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#080F1C] tracking-tight">
                        Family Contact Details
                      </h2>
                      <p className="text-xs sm:text-sm text-[#475467] mt-1">
                        Please provide contact information so our senior guidance counselor can connect with you.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Parent / Guardian Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Parent / Guardian Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={formData.parentName}
                            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                            placeholder="e.g. Rajiv Sharma"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                              errors.parentName 
                                ? 'border-rose-400 focus:ring-rose-200' 
                                : 'border-slate-300 focus:border-[#2563EB] focus:ring-blue-100'
                            }`}
                          />
                        </div>
                        {errors.parentName && (
                          <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.parentName}
                          </p>
                        )}
                      </div>

                      {/* Phone / WhatsApp */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Phone / WhatsApp Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                              errors.phone 
                                ? 'border-rose-400 focus:ring-rose-200' 
                                : 'border-slate-300 focus:border-[#2563EB] focus:ring-blue-100'
                            }`}
                          />
                        </div>
                        {errors.phone ? (
                          <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.phone}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-500 mt-1">We respect your privacy; no spam or automated telemarketing.</p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Email Address <span className="text-slate-400 font-normal lowercase">(optional for confirmation)</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="rajiv.sharma@example.com"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                              errors.email 
                                ? 'border-rose-400 focus:ring-rose-200' 
                                : 'border-slate-300 focus:border-[#2563EB] focus:ring-blue-100'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Student Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Student Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={formData.studentName}
                            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                            placeholder="e.g. Aarav Sharma"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: STUDENT ACADEMIC PROFILE ── */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#080F1C] tracking-tight">
                        Student Academic Background
                      </h2>
                      <p className="text-xs sm:text-sm text-[#475467] mt-1">
                        Select the student&apos;s current academic stage and educational board to personalize your advisory agenda.
                      </p>
                    </div>

                    {/* Academic Stage Options */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                        Academic Stage <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ACADEMIC_LEVELS.map((lvl) => {
                          const isSelected = formData.academicLevel === lvl.id;
                          return (
                            <button
                              key={lvl.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, academicLevel: lvl.id })}
                              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                                isSelected 
                                  ? 'border-[#2563EB] bg-blue-50/60 ring-2 ring-[#2563EB]/20 shadow-xs' 
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-sm font-bold ${isSelected ? 'text-[#2563EB]' : 'text-slate-900'}`}>
                                  {lvl.label}
                                </span>
                                {lvl.tag && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {lvl.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#64748B] leading-relaxed">
                                {lvl.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                      {errors.academicLevel && (
                        <p className="text-xs text-rose-500 mt-1.5">{errors.academicLevel}</p>
                      )}
                    </div>

                    {/* Grade & School Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Specific Grade / Class
                        </label>
                        <select
                          value={formData.grade}
                          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                          className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 bg-white"
                        >
                          <option value="">Select Grade</option>
                          {GRADE_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Education Board
                        </label>
                        <select
                          value={formData.board}
                          onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                          className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 bg-white"
                        >
                          {BOARD_OPTIONS.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Current School / College
                        </label>
                        <input
                          type="text"
                          value={formData.schoolName}
                          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                          placeholder="e.g. Modern School, DPS, etc."
                          className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 bg-white placeholder-slate-400"
                        />
                      </div>
                    </div>

                    {/* Conditional Stream Selection (Shown when High School is selected) */}
                    {isHighSchool && (
                      <div className="pt-2 border-t border-slate-100">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                          Academic Stream & Subject Orientation
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {STREAM_OPTIONS.map((st) => {
                            const isSelected = formData.stream === st.id;
                            return (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, stream: st.id })}
                                className={`px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                                  isSelected 
                                    ? 'border-[#2563EB] bg-blue-50/70 text-[#2563EB] font-bold' 
                                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                <div className="text-xs font-bold leading-tight">{st.label}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── STEP 3: GOALS & SERVICES ── */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#080F1C] tracking-tight">
                        Goals &amp; Service Priorities
                      </h2>
                      <p className="text-xs sm:text-sm text-[#475467] mt-1">
                        Select what you would like to focus on during your consultation session (multi-select allowed).
                      </p>
                    </div>

                    {/* Primary Student Development Priorities */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                        Student Development Priorities
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {DEVELOPMENT_AREAS.map((area) => {
                          const isSelected = formData.developmentAreas.includes(area);
                          return (
                            <button
                              key={area}
                              type="button"
                              onClick={() => toggleArrayItem('developmentAreas', area)}
                              className={`px-4 py-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'border-[#2563EB] bg-blue-50/60 text-[#2563EB] font-bold'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <span className="text-xs sm:text-sm">{area}</span>
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ml-2 ${
                                isSelected ? 'bg-[#2563EB] text-white' : 'border border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CLARVO Services to Explore */}
                    <div className="pt-2 border-t border-slate-100">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                        CLARVO Services You Wish to Explore
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {CLARVO_EXPLORATION_OPTIONS.map((svc) => {
                          const isSelected = formData.clarvoExploration.includes(svc);
                          return (
                            <button
                              key={svc}
                              type="button"
                              onClick={() => toggleArrayItem('clarvoExploration', svc)}
                              className={`px-4 py-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'border-[#2563EB] bg-blue-50/60 text-[#2563EB] font-bold'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <span className="text-xs sm:text-sm">{svc}</span>
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ml-2 ${
                                isSelected ? 'bg-[#2563EB] text-white' : 'border border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.goals && (
                        <p className="text-xs text-rose-500 mt-2">{errors.goals}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 4: PREFERRED TIME & REVIEW ── */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#080F1C] tracking-tight">
                        Preferred Time Window &amp; Summary
                      </h2>
                      <p className="text-xs sm:text-sm text-[#475467] mt-1">
                        Select when you are most available to speak, review your details, and submit your consultation request.
                      </p>
                    </div>

                    {/* Preferred Time Window */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                        Preferred Consultation Time Window <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TIME_FRAMES.map((tf) => {
                          const isSelected = formData.preferredTimeFrame === tf.id;
                          return (
                            <button
                              key={tf.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, preferredTimeFrame: tf.id })}
                              className={`p-3.5 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? 'border-[#2563EB] bg-blue-50/70 text-[#2563EB] ring-2 ring-[#2563EB]/20 font-bold'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#2563EB]" />
                                <span className="text-sm font-bold">{tf.label}</span>
                              </div>
                              <span className="text-xs text-slate-500 block mt-1 ml-6">{tf.hours}</span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.preferredTimeFrame && (
                        <p className="text-xs text-rose-500 mt-1.5">{errors.preferredTimeFrame}</p>
                      )}
                    </div>

                    {/* Optional Notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Questions, Specific Goals, or Notes <span className="text-slate-400 font-normal lowercase">(optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Mention any specific concerns (e.g., student wants to explore AI vs Computer Science, needs SAT 1500+ strategy)..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none"
                      />
                    </div>

                    {/* CONCISE REVIEW SUMMARY CARD */}
                    <div className="bg-[#FAFBFD] rounded-2xl border border-slate-200 p-4 sm:p-5 text-xs text-slate-700 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                          Review Your Consultation Request
                        </span>
                        <span className="text-[11px] text-[#2563EB] font-semibold">Ready to Submit</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Parent / Guardian:</span>
                            <button type="button" onClick={() => setCurrentStep(1)} className="text-[#2563EB] hover:underline flex items-center gap-0.5 text-[11px]">
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                          </div>
                          <p className="font-semibold text-slate-900 mt-0.5">{formData.parentName || '—'}</p>
                          <p className="text-slate-600 text-[11px]">{formData.phone} {formData.email ? `· ${formData.email}` : ''}</p>
                          {formData.studentName && <p className="text-slate-600 text-[11px]">Student: {formData.studentName}</p>}
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Academic Background:</span>
                            <button type="button" onClick={() => setCurrentStep(2)} className="text-[#2563EB] hover:underline flex items-center gap-0.5 text-[11px]">
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                          </div>
                          <p className="font-semibold text-slate-900 mt-0.5">{formData.academicLevel}</p>
                          <p className="text-slate-600 text-[11px]">
                            {formData.grade ? `${formData.grade} · ` : ''}{formData.board}{formData.schoolName ? ` · ${formData.schoolName}` : ''}
                          </p>
                          {formData.stream && <p className="text-[#2563EB] text-[11px] font-medium">Stream: {formData.stream}</p>}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-500">Selected Priorities &amp; Services:</span>
                          <button type="button" onClick={() => setCurrentStep(3)} className="text-[#2563EB] hover:underline flex items-center gap-0.5 text-[11px]">
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {[...formData.developmentAreas, ...formData.clarvoExploration].map((item, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-50 text-[#2563EB] rounded-md text-[10.5px] font-medium border border-blue-100">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Contact Consent */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                          className="mt-1 w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                          I agree to allow CLARVO’s educational guidance team to contact me via phone, WhatsApp, or email regarding this consultation request. No marketing spam.
                        </span>
                      </label>
                      {errors.consent && (
                        <p className="text-xs text-rose-500 mt-1.5 ml-7">{errors.consent}</p>
                      )}
                    </div>

                    {submitError && (
                      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* WIZARD ACTIONS FOOTER */}
            <div className="bg-[#FAFBFD] border-t border-[#E2E8F0] px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-400 text-white text-xs sm:text-sm font-black shadow-lg flex items-center gap-2 transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Request a Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        )}

        {/* TRUST BANNER BELOW WIZARD */}
        <div className="mt-8 text-center text-xs text-[#64748B] flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Privacy &amp; Data Protection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Certified Psychometric Counsellors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <School className="w-4 h-4 text-[#2563EB]" />
            <span>{COMPANY_CONFIG.legalName}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
