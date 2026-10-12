'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Star,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  School,
  ArrowRight,
  ShieldCheck,
  User,
  MessageSquare,
  ThumbsUp,
  ChevronLeft
} from 'lucide-react';

const REPORT_OPTIONS = [
  'Psychometric Diagnostic & Stream Fit (56-Page Dossier)',
  'Executive Career Edition (15-Page Summary)',
  'Class 10 Stream Selection Report',
  'Digital SAT 1500+ Readiness Diagnostic',
  'Global & Domestic University Matcher',
  '1-to-1 Parent & Counselor Advisory Session',
  'Other / Platform Experience',
];

const IMPACT_TAGS = [
  'Stream Choice Clarity',
  'Parent-Student Consensus',
  'Exam Score Strategy',
  'Time Saved & No Guesswork',
  'Career Roadmap Direction',
  'Confidence Booster',
];

const GRADE_OPTIONS = [
  'Grade 7–8 (Middle School)',
  'Grade 9 (Early High School)',
  'Grade 10 (Stream Selection Year)',
  'Grade 11 (IB / CBSE / Cambridge)',
  'Grade 12 (Senior Year / Admissions)',
  'Undergraduate / College',
  'Parent of High School Student',
];

function ReviewFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial query params if coming from a report
  const initialReportParam = searchParams.get('report') || '';
  const initialReportId = searchParams.get('reportId') || '';
  const initialGradeParam = searchParams.get('grade') || '';
  const initialNameParam = searchParams.get('name') || '';

  let defaultReport = REPORT_OPTIONS[0];
  if (initialReportParam.toLowerCase().includes('iq') || initialReportParam.toLowerCase().includes('sat')) {
    defaultReport = 'Digital SAT 1500+ Readiness Diagnostic';
  } else if (initialReportParam.toLowerCase().includes('exec')) {
    defaultReport = 'Executive Career Edition (15-Page Summary)';
  } else if (initialReportParam.toLowerCase().includes('stream') || initialReportParam.toLowerCase().includes('10')) {
    defaultReport = 'Class 10 Stream Selection Report';
  }

  const [name, setName] = useState(initialNameParam);
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState(initialGradeParam || GRADE_OPTIONS[2]);
  const [reportType, setReportType] = useState(defaultReport);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');
  const impactTagInitial = IMPACT_TAGS[0];
  const [selectedTag, setSelectedTag] = useState<string>(impactTagInitial);
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedReview, setSubmittedReview] = useState<any | null>(null);

  const RATING_LABELS: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good & Informative',
    4: 'Very Good & High Clarity',
    5: 'Outstanding / Life-Changing!',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!school.trim()) {
      setErrorMessage('Please enter your school or institution name.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 15) {
      setErrorMessage('Please write at least a few sentences describing how the report or session helped you.');
      return;
    }
    if (!consent) {
      setErrorMessage('Please agree to allow CLARVO to display your verified review.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role,
          email: email.trim() || undefined,
          school: school.trim(),
          grade,
          reportType,
          rating,
          headline: headline.trim() || (rating === 5 ? 'Life-Changing Clarity for Our Academic Future' : 'Invaluable Diagnostic Insights'),
          comment: comment.trim(),
          impactTag: selectedTag,
          reportId: initialReportId || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSubmittedReview(data.review);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedReview) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl p-8 sm:p-12 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold tracking-widest uppercase mb-3">
            REVIEW RECEIVED & VERIFIED
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-[#080F1C] tracking-tight">
            Thank you, {submittedReview.name}!
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#64748B] leading-relaxed">
            Your review and feedback have been securely submitted to the CLARVO team. Our administrators review every submission to ensure authentic, verified feedback across schools before featuring it on the platform.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= submittedReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                />
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">
                {submittedReview.rating} / 5 Stars
              </span>
            </div>
            <div className="text-sm font-bold text-[#080F1C] mb-1">
              "{submittedReview.headline}"
            </div>
            <div className="text-xs text-[#64748B] line-clamp-3">
              "{submittedReview.comment}"
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span>{submittedReview.school} · {submittedReview.grade}</span>
              <span className="font-mono">{submittedReview.id}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Return to Your Report
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#080F1C] text-sm font-semibold transition-all cursor-pointer"
            >
              Explore Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Back Nav */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Previous Page</span>
          </button>
          <span className="text-[11px] font-semibold text-[#94A3B8] tracking-widest uppercase">
            STUDENT FEEDBACK & VERIFICATION
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#080F1C] via-[#1E3A8A] to-[#2563EB] p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)] pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-[11px] font-bold tracking-widest uppercase mb-4 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              AUTHENTIC STUDENT & PARENT REVIEWS
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Share Your Experience with CLARVO
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-2xl font-normal leading-relaxed">
              Help students and families in Grade 7 through 12 make informed decisions. Your feedback directly shapes our diagnostic accuracy and mentorship roadmap.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Overall Star Rating */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <label className="block text-sm font-black text-[#080F1C] uppercase tracking-wider mb-1">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <div className="text-xs text-[#64748B]">
                  Click the stars to rate your report and consultation experience.
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-1">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-115 transition-transform cursor-pointer focus:outline-hidden"
                        title={`${star} Star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-[#2563EB]">
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* 2. Reviewer Profile & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Role */}
              <div className="col-span-full">
                <label className="block text-xs font-bold text-[#475467] uppercase tracking-wider mb-2">
                  I am giving this review as a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      role === 'student'
                        ? 'bg-[#E8F0FF] border-[#2563EB] text-[#2563EB] shadow-xs'
                        : 'bg-white border-[#E4E7EC] text-[#475467] hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('parent')}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      role === 'parent'
                        ? 'bg-[#E8F0FF] border-[#2563EB] text-[#2563EB] shadow-xs'
                        : 'bg-white border-[#E4E7EC] text-[#475467] hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Parent / Guardian</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#475467] uppercase tracking-wider mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-[#080F1C] text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-hidden transition"
                />
              </div>

              {/* School Name */}
              <div>
                <label className="block text-xs font-bold text-[#475467] uppercase tracking-wider mb-2">
                  School / College Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi Public School (DPS), R.K. Puram"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-[#080F1C] text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-hidden transition"
                />
              </div>

              {/* Grade / Academic Level */}
              <div>
                <label className="block text-xs font-bold text-[#475467] uppercase tracking-wider mb-2">
                  Grade / Academic Stage <span className="text-red-500">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-[#080F1C] text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-hidden transition bg-white"
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Report Reviewed */}
              <div>
                <label className="block text-xs font-bold text-[#475467] uppercase tracking-wider mb-2">
                  Report / Tool Evaluated <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-[#080F1C] text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-hidden transition bg-white"
                >
                  {REPORT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Review Headline & Detailed Comment */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475467] uppercase tracking-wider mb-2">
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cleared our dilemma on Commerce with Math vs Science PCM in 1 day"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-[#080F1C] text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-hidden transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475467] uppercase tracking-wider mb-2">
                  Detailed Feedback / Your Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe how the diagnostic insights helped you or your family: Was it the stream match, cognitive breakdown, time saved, or clarity on subjects?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] text-[#080F1C] text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-hidden transition leading-relaxed"
                />
              </div>
            </div>

            {/* 4. Primary Outcome / Impact Tag */}
            <div>
              <label className="block text-xs font-bold text-[#475467] uppercase tracking-wider mb-2">
                Primary Impact Area:
              </label>
              <div className="flex flex-wrap gap-2">
                {IMPACT_TAGS.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-[#475467] hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Consent Checkbox */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                />
                <span className="text-xs text-[#475467] leading-relaxed">
                  I confirm this is my authentic feedback. I permit CLARVO to display my name, school, grade, and feedback on their verified testimonials section and reports.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified student feedback submitted directly to the CLARVO Admin Portal.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Review...</span>
                ) : (
                  <>
                    <span>Submit Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SubmitReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 rounded-full border-4 border-[#2563EB] border-t-transparent animate-spin" />
      </div>
    }>
      <ReviewFormContent />
    </Suspense>
  );
}
