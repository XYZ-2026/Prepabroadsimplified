'use client';

import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

// Google Form Question Options
const ACADEMIC_LEVELS = [
  { id: 'High School (Grades 9-12)', label: 'High School (Grades 9–12)', tag: 'Most Popular', desc: 'Stream selection, SAT prep, & university admissions' },
  { id: 'Middle School (Grades 6-8)', label: 'Middle School (Grades 6–8)', tag: 'Foundation', desc: 'Aptitude exploration & study habit building' },
  { id: 'Higher Education/University Prep', label: 'Higher Education / University Prep', tag: 'Senior', desc: 'College application roadmaps & profile building' },
  { id: 'Primary School (Grades 1-5)', label: 'Primary School (Grades 1–5)', tag: 'Early Years', desc: 'Learning style discovery & curiosity development' },
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

export default function BookADemoPage() {
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentName: '',
    academicLevel: 'High School (Grades 9-12)',
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

  // Toggle multi-select checkbox arrays
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

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.parentName.trim() || formData.parentName.trim().length < 2) {
      errs.parentName = 'Please enter your full Parent / Guardian name.';
    }

    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 8 || cleanPhone.length > 15) {
      errs.phone = 'Please enter a valid contact phone or WhatsApp number.';
    }

    if (formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.consent) {
      errs.consent = 'Please agree to allow CLARVO to contact you regarding your enquiry.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        throw new Error(data.error || data.message || 'Failed to submit demo request.');
      }

      setSubmittedId(data.enquiryId || `ENQ-${Date.now().toString().slice(-6)}`);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Something went wrong. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16 px-4 sm:px-6 lg:px-12 text-[#080F1C]">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#2563EB] text-[11px] font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Live Demo &amp; Consultation Booking
          </div>
        </div>

        {/* SUCCESS CONFIRMATION VIEW */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#E2E8F0] shadow-xl text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-[#E8F0FF] px-3.5 py-1 rounded-full">
              Demo Enquiry Confirmed
            </span>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#080F1C] mt-4">
              Thank You, {formData.parentName}!
            </h1>

            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Your consultation request has been recorded in the CLARVO Advisory queue. Our senior educational guidance counselor will contact you via WhatsApp / Call to confirm your private 1-on-1 walkthrough.
            </p>

            <div className="my-8 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Reference ID</span>
                <span className="font-mono font-bold text-[#2563EB]">{submittedId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Contact Phone</span>
                <span className="font-bold text-slate-800">{formData.phone}</span>
              </div>
              {formData.studentName && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Student Name</span>
                  <span className="font-bold text-slate-800">{formData.studentName}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Academic Level</span>
                <span className="font-bold text-slate-800">{formData.academicLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Preferred Time Frame</span>
                <span className="font-bold text-[#2563EB]">{formData.preferredTimeFrame}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Return to Homepage</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sample-reports"
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm inline-flex items-center justify-center transition-all"
              >
                <span>Explore Sample Dossiers</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* MAIN TWO-COLUMN SPLIT FORM */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Value Proposition & Social Proof */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0FF] text-[#2563EB] text-[11px] font-bold tracking-[0.16em] uppercase mb-4">
                  INDIVIDUAL DEMO &amp; ADVISORY SESSION
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.1] text-[#080F1C]">
                  Clarity for their future starts with a single conversation.
                </h1>
                <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                  Join 15,000+ parents and students navigating Class 10 stream choices, Digital SAT prep, and global university roadmaps with objective psychometric data.
                </p>
              </div>

              {/* What happens during the demo */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#2563EB]">
                  What Your 1-on-1 Demo Includes:
                </h3>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">30-Dimension Diagnostic Walkthrough</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Preview actual psychometric, RIASEC, and cognitive reports tailored to your child’s grade.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Stream &amp; Subject Optimization</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Resolve PCM vs Commerce vs Humanities confusion with data-backed fitment metrics.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Digital SAT Pacing &amp; Admissions Roadmap</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Understand adaptive test scoring benchmarks and independent research publication spikes.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Quote Pill */}
              <div className="bg-gradient-to-br from-[#080F1C] to-[#1E3A8A] rounded-2xl p-6 text-white shadow-lg space-y-3">
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="ml-1 text-[11px] font-bold text-blue-200">Verified Parent Feedback</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-blue-100 italic">
                  “The 30-minute consultation showed us exactly why our son was struggling with general coaching and pointed him toward Applied Math and Computational Economics. We saved years of stress.”
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Parent of Class 10 Student</span>
                  <span className="text-blue-300">The Shri Ram School, Moulsari</span>
                </div>
              </div>

              {/* Privacy badge */}
              <div className="flex items-center gap-2.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Zero spam guarantee. Your family’s details are strictly confidential.</span>
              </div>
            </div>

            {/* Right Column: The Comprehensive Demo Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-6 sm:p-9 border border-[#E2E8F0] shadow-xl space-y-7 relative"
              >
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Question 1 & 2: Parent Name & Phone */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#2563EB] mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>1. Contact &amp; Family Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Parent Name */}
                    <div id="field-parentName">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Parent / Guardian Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.parentName}
                          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                          placeholder="e.g. Rajesh Sharma"
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                            errors.parentName ? 'border-red-400 bg-red-50/20' : 'border-[#CBD5E1] bg-white'
                          }`}
                        />
                      </div>
                      {errors.parentName && (
                        <p className="text-[11px] font-semibold text-red-600 mt-1">{errors.parentName}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div id="field-phone">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Phone / WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 98200 12345"
                          className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                            errors.phone ? 'border-red-400 bg-red-50/20' : 'border-[#CBD5E1] bg-white'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] font-semibold text-red-600 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div id="field-email">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="parent@example.com"
                        className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          errors.email ? 'border-red-400 bg-red-50/20' : 'border-[#CBD5E1] bg-white'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] font-semibold text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Student Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Student Name <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        placeholder="e.g. Aarav"
                        className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Question 3: Primary Academic Level */}
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#2563EB] mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>2. What is the primary academic level of the student?</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3.5">
                    Select the student’s current grade or stage:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ACADEMIC_LEVELS.map((level) => {
                      const isSelected = formData.academicLevel === level.id;
                      return (
                        <button
                          type="button"
                          key={level.id}
                          onClick={() => setFormData({ ...formData, academicLevel: level.id })}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#2563EB] bg-[#E8F0FF] shadow-xs ring-1 ring-[#2563EB]'
                              : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-extrabold text-[#080F1C]">{level.label}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-200/80 text-slate-600'
                            }`}>
                              {level.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">{level.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 4: Areas of Student Development */}
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#2563EB] mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>3. Which areas of student development are you most interested in exploring?</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Select all that apply to your child’s current goals:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {DEVELOPMENT_AREAS.map((area) => {
                      const isChecked = formData.developmentAreas.includes(area);
                      return (
                        <button
                          type="button"
                          key={area}
                          onClick={() => toggleArrayItem('developmentAreas', area)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                            isChecked
                              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[10px] ${
                            isChecked ? 'bg-white text-[#2563EB]' : 'border border-slate-300'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span>{area}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 5: What would you like to explore with CLARVO? */}
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#2563EB] mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>4. What would you like to explore with CLARVO?</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Choose one or more CLARVO offerings:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CLARVO_EXPLORATION_OPTIONS.map((opt) => {
                      const isChecked = formData.clarvoExploration.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggleArrayItem('clarvoExploration', opt)}
                          className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                            isChecked
                              ? 'bg-[#E8F0FF] text-[#1E3A8A] font-bold border-[#BFDBFE]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 mt-0.5 text-[10px] ${
                            isChecked ? 'bg-[#2563EB] text-white' : 'border border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 6: Preferred Time Frame */}
                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#2563EB] mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>5. What is your preferred time frame for a demo?</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TIME_FRAMES.map((slot) => {
                      const isSelected = formData.preferredTimeFrame === slot.id;
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setFormData({ ...formData, preferredTimeFrame: slot.id })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold leading-tight">{slot.label}</div>
                            <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                              {slot.hours}
                            </div>
                          </div>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-white bg-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#2563EB]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 7: Additional Notes */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Specific Questions or Goals <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Tell us about your child's current school, subjects of interest, or target milestones..."
                    className="w-full p-3 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                {/* Consent Checkbox */}
                <div id="field-consent" className="pt-2 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I agree to allow CLARVO counseling advisors to contact me via Call / WhatsApp regarding my child&apos;s demo and academic roadmap.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-[11px] font-semibold text-red-600 mt-1">{errors.consent}</p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-13 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Your Demo Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Demo Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2.5">
                    🔒 All requests are stored securely in our official admissions queue.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
