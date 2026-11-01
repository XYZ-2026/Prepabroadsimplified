'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Compass, 
  GraduationCap, 
  Award, 
  BookOpen, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Lock,
  AlertCircle
} from 'lucide-react';

interface FormState {
  name: string;
  phone: string;
  email: string;
  schoolName: string;
  grade: string;
  priorityGoal?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  schoolName?: string;
  grade?: string;
  priorityGoal?: string;
  general?: string;
}

const GRADE_OPTIONS = [
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'Other / Gap Year',
];

const COMMUNITY_BENEFITS = [
  {
    num: '01',
    title: 'Career Guidance & Educational Insights',
    fullTitle: 'Career Guidance and Educational Insights',
    desc: 'Evidence-backed direction on stream selection, subject choices, and 100+ high-growth modern professions.',
    icon: Compass,
    accent: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    num: '02',
    title: 'Indian & Study Abroad Updates',
    fullTitle: 'Indian and Study Abroad Updates',
    desc: 'Real-time intelligence on premier Indian universities, global admissions, entrance exams, and policy shifts.',
    icon: GraduationCap,
    accent: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    num: '03',
    title: 'Scholarships, Summer Programs & Research',
    fullTitle: 'Scholarships, Summer Programs and Research Opportunities',
    desc: 'Curated notifications for merit scholarships, high-school research mentorships, and selective summer programs.',
    icon: Award,
    accent: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    num: '04',
    title: 'Profile Building & Skill-Development',
    fullTitle: 'Profile Building and Skill-Development Resources',
    desc: 'Practical toolkits to build genuine intellectual spikes, extracurricular portfolios, and leadership initiatives.',
    icon: BookOpen,
    accent: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    num: '05',
    title: 'Expert Guidance & Informative Discussions',
    fullTitle: 'Expert Guidance and Informative Discussions',
    desc: 'Interactive Q&A sessions, webinars with senior educational psychologists, and evidence-based guidance for families.',
    icon: MessageSquare,
    accent: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
];

export default function CommunityLandingClient() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    schoolName: '',
    grade: '',
    priorityGoal: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name.';
    }

    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || !/^\+?[0-9]{7,16}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g. +91 98765 43210).';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.schoolName.trim() || formData.schoolName.trim().length < 2) {
      newErrors.schoolName = 'Please enter your school or institution name.';
    }

    if (!formData.grade) {
      newErrors.grade = 'Please select your current grade.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    setSubmittedMessage(null);

    try {
      const res = await fetch('/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.error || 'Failed to submit details. Please try again.' });
        }
        setSubmitting(false);
        return;
      }

      // If active WhatsApp URL exists, initiate immediate redirection
      if (data.redirectUrl) {
        setSubmittedMessage('Details recorded successfully! Redirecting you to WhatsApp...');
        window.location.href = data.redirectUrl;
      } else {
        // Fallback if link is currently undergoing admin refresh
        setSubmitting(false);
        setSubmittedMessage(
          data.message ||
            'Your details have been saved! Our team will send your WhatsApp community invitation shortly.'
        );
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({
        general: 'A network error occurred. Please check your connection and try again.',
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFBFD] flex flex-col justify-between selection:bg-[#2563EB] selection:text-white">
      {/* ── Compact Brand Bar ── */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#E4E7EC] py-2 px-3.5 sm:px-6 md:px-8 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-transparent.png"
              alt="CLARVO"
              width={30}
              height={30}
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              priority
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-[16px] sm:text-[18px] font-black tracking-[-0.03em] text-[#080F1C]">
                CLARVO
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B]">
                · Student &amp; Parent Community
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[9.5px] sm:text-[10.5px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#86EFAC]/40">
            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#16A34A]" />
            <span>Official Invitation</span>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 md:px-8 py-3 sm:py-6 lg:py-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
          
          {/* ── LEFT COLUMN (7 Cols on Desktop): Headline & 5 Benefit Cards ── */}
          <div className="lg:col-span-7 flex flex-col space-y-3 sm:space-y-4">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F0FF] border border-[#2563EB]/25 text-[#2563EB] text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.1em] uppercase mb-1.5 sm:mb-2">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#2563EB]" />
                <span>EXCLUSIVE COMMUNITY ACCESS</span>
              </div>

              <h1 className="text-[20px] xs:text-[23px] sm:text-[30px] md:text-[36px] font-black text-[#080F1C] tracking-tight leading-[1.12]">
                Join the CLARVO <br className="hidden sm:inline" />
                <span className="text-[#2563EB]">Student &amp; Parent Community!</span>
              </h1>

              <p className="mt-1 sm:mt-1.5 text-[11.5px] xs:text-[12.5px] sm:text-[13.5px] text-[#475569] leading-relaxed max-w-xl">
                A verified WhatsApp network sharing expert career guidance, Indian and study-abroad updates, scholarships, high-school research opportunities, and student-development resources.
              </p>
            </div>

            {/* 5 Community Benefit Cards */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider text-[#64748B]">
                What You Receive Inside the Community
              </div>

              {/* Responsive Benefits Grid: 2 columns on all devices */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {COMMUNITY_BENEFITS.slice(0, 4).map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.num}
                      className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white border border-[#E4E7EC] shadow-2xs hover:border-[#CBD5E1] transition-all flex items-start gap-1.5 sm:gap-2"
                    >
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center shrink-0 border ${benefit.accent}`}>
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-[11px] sm:text-[12px] font-bold text-[#080F1C] leading-tight truncate sm:whitespace-normal">
                          {benefit.title}
                        </h2>
                        <p className="hidden sm:block text-[10.5px] text-[#64748B] mt-0.5 leading-snug line-clamp-2">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* 5th Benefit: Full width across both columns */}
                {COMMUNITY_BENEFITS.slice(4).map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.num}
                      className="col-span-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white border border-[#E4E7EC] shadow-2xs hover:border-[#CBD5E1] transition-all flex items-start gap-1.5 sm:gap-2"
                    >
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center shrink-0 border ${benefit.accent}`}>
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-[11px] sm:text-[12px] font-bold text-[#080F1C] leading-tight">
                          {benefit.title}
                        </h2>
                        <p className="hidden sm:block text-[10.5px] text-[#64748B] mt-0.5 leading-snug">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="hidden sm:flex items-center gap-2.5 text-[10.5px] text-[#64748B] pt-0.5">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#16A34A]" />
                <span>Verified Admissions Guidance</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#2563EB]" />
                <span>Zero Spam · Moderated Community</span>
              </span>
            </div>
          </div>

          {/* ── RIGHT COLUMN (5 Cols on Desktop): Exactly 5 Form Fields + CTA ── */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-[#CBD5E1] shadow-[0_8px_25px_rgba(8,15,28,0.06)] p-3.5 sm:p-5 lg:p-6">
              <div className="border-b border-[#E4E7EC] pb-2 sm:pb-2.5 mb-2.5 sm:mb-3">
                <h3 className="text-[15px] sm:text-[17px] font-extrabold text-[#080F1C] tracking-tight leading-tight">
                  Enter Your Details to Join
                </h3>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] mt-0.5">
                  Complete these quick details to instantly receive the WhatsApp group link.
                </p>
              </div>

              {errors.general && (
                <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errors.general}</span>
                </div>
              )}

              {submittedMessage && (
                <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{submittedMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-2 sm:space-y-2.5">
                {/* 1. Name */}
                <div>
                  <label htmlFor="name" className="block text-[10.5px] sm:text-[11px] font-bold text-[#080F1C] mb-0.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className={`w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border text-[12.5px] sm:text-[13px] text-[#080F1C] placeholder:text-[#94A3B8] bg-white transition-all focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-600 mt-0.5">{errors.name}</p>}
                </div>

                {/* 2. Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-[10.5px] sm:text-[11px] font-bold text-[#080F1C] mb-0.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    inputMode="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="e.g. +91 98765 43210"
                    autoComplete="tel"
                    className={`w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border text-[12.5px] sm:text-[13px] text-[#080F1C] placeholder:text-[#94A3B8] bg-white transition-all focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-600 mt-0.5">{errors.phone}</p>}
                </div>

                {/* 3. Email Address */}
                <div>
                  <label htmlFor="email" className="block text-[10.5px] sm:text-[11px] font-bold text-[#080F1C] mb-0.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    inputMode="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className={`w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border text-[12.5px] sm:text-[13px] text-[#080F1C] placeholder:text-[#94A3B8] bg-white transition-all focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-red-600 mt-0.5">{errors.email}</p>}
                </div>

                {/* 4. School Name */}
                <div>
                  <label htmlFor="schoolName" className="block text-[10.5px] sm:text-[11px] font-bold text-[#080F1C] mb-0.5">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="schoolName"
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => {
                      setFormData({ ...formData, schoolName: e.target.value });
                      if (errors.schoolName) setErrors({ ...errors, schoolName: undefined });
                    }}
                    placeholder="Enter your school name"
                    className={`w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border text-[12.5px] sm:text-[13px] text-[#080F1C] placeholder:text-[#94A3B8] bg-white transition-all focus:outline-none focus:ring-2 ${
                      errors.schoolName
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                    }`}
                  />
                  {errors.schoolName && <p className="text-[10px] text-red-600 mt-0.5">{errors.schoolName}</p>}
                </div>

                {/* 5. Grade */}
                <div>
                  <label htmlFor="grade" className="block text-[10.5px] sm:text-[11px] font-bold text-[#080F1C] mb-0.5">
                    Grade <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="grade"
                      required
                      value={formData.grade}
                      onChange={(e) => {
                        setFormData({ ...formData, grade: e.target.value });
                        if (errors.grade) setErrors({ ...errors, grade: undefined });
                      }}
                      className={`w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border text-[12.5px] sm:text-[13px] text-[#080F1C] bg-white transition-all focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                        errors.grade
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-[#CBD5E1] focus:border-[#2563EB] focus:ring-blue-100'
                      }`}
                    >
                      <option value="" disabled>Select your grade</option>
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#64748B]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.grade && <p className="text-[10px] text-red-600 mt-0.5">{errors.grade}</p>}
                </div>

                {/* 6. What are you looking for on priority? (optional) */}
                <div>
                  <label htmlFor="priorityGoal" className="block text-[10.5px] sm:text-[11px] font-bold text-[#080F1C] mb-0.5">
                    What are you looking for on priority? <span className="font-normal text-[#64748B] text-[10px]">(optional)</span>
                  </label>
                  <input
                    id="priorityGoal"
                    type="text"
                    value={formData.priorityGoal}
                    onChange={(e) => setFormData({ ...formData, priorityGoal: e.target.value })}
                    placeholder="e.g. Stream Selection, SAT Prep, Career Guidance..."
                    className="w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border border-[#CBD5E1] text-[12.5px] sm:text-[13px] text-[#080F1C] placeholder:text-[#94A3B8] bg-white transition-all focus:outline-none focus:ring-2 focus:border-[#2563EB] focus:ring-blue-100"
                  />
                  {/* Quick Priority Suggestion Chips */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {[
                      'Stream Selection',
                      'Career Guidance',
                      'SAT Prep (1500+)',
                      'Research Papers',
                      'Study Abroad'
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFormData({ ...formData, priorityGoal: preset })}
                        className={`text-[9.5px] sm:text-[10px] px-2 py-0.5 rounded-md font-medium border transition-colors cursor-pointer ${
                          formData.priorityGoal === preset
                            ? 'bg-[#2563EB] text-white border-[#2563EB]'
                            : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit CTA Button — Exactly "Join the Community →" */}
                <div className="pt-1.5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-10 sm:h-11 rounded-lg sm:rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13.5px] sm:text-[14px] font-bold inline-flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(37,99,235,0.28)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.38)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                  >
                    <span>{submitting ? 'Connecting to WhatsApp...' : 'Join the Community →'}</span>
                  </button>
                </div>

                <div className="text-center pt-0.5">
                  <span className="text-[9.5px] sm:text-[10px] text-[#64748B] flex items-center justify-center gap-1">
                    <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#16A34A]" />
                    <span>Your data is protected under CLARVO privacy policy</span>
                  </span>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* ── Ultra-Compact Footer ── */}
      <footer className="w-full border-t border-[#E4E7EC] bg-white py-2 px-3.5 text-center text-[10px] sm:text-[10.5px] text-[#64748B] shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col xs:flex-row items-center justify-between gap-1">
          <span>&copy; {new Date().getFullYear()} CLARVO (CLARVO EDUCATION PRIVATE LIMITED).</span>
          <span className="text-[#94A3B8]">Direct QR Campaign Access</span>
        </div>
      </footer>
    </div>
  );
}
