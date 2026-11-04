'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Briefcase, 
  Network, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Lock,
  AlertCircle,
  ExternalLink,
  Users
} from 'lucide-react';

interface FormState {
  name: string;
  phone: string;
  email: string;
  linkedInUrl: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  linkedInUrl?: string;
  consent?: string;
  general?: string;
}

const COUNSELLOR_BENEFITS = [
  {
    num: '01',
    title: 'Free Counsellor Certification',
    desc: "Strengthen your counselling knowledge through CLARVO's certification initiative, designed to support professional learning and development.",
    badge: 'CLARVO Certified',
    icon: GraduationCap,
    accent: 'bg-blue-50 text-[#1258DE] border-blue-200',
  },
  {
    num: '02',
    title: 'Professional Recognition & Visibility',
    desc: 'Highlight your counselling experience, professional contributions and achievements while building visibility within a community of fellow professionals.',
    badge: 'Peer Network',
    icon: Award,
    accent: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    num: '03',
    title: 'Knowledge Building & Expert Workshops',
    desc: 'Participate in knowledge-sharing sessions, professional workshops and educational discussions that support continuous learning in counselling and student development.',
    badge: 'Live Sessions',
    icon: BookOpen,
    accent: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    num: '04',
    title: 'Freelancing & Career Opportunities',
    desc: 'Explore relevant freelance assignments, professional collaborations and counselling-related job opportunities shared within the community.',
    badge: 'Subject to Selection',
    icon: Briefcase,
    accent: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    num: '05',
    title: 'B2B School Counselling Networks',
    desc: 'Build professional connections and explore collaboration opportunities with schools, educational institutions and counselling networks.',
    badge: 'Institutional Growth',
    icon: Network,
    accent: 'bg-purple-50 text-purple-600 border-purple-200',
  },
];

export default function CounsellorCommunityLandingClient() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    linkedInUrl: '',
    consent: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const isValidUrl = (urlStr: string): boolean => {
    try {
      const parsed = new URL(urlStr.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Name: required, min 2 chars
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (at least 2 characters).';
    }

    // 2. Phone: required, international / Indian format
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || !/^\+?[0-9]{7,16}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid contact number (e.g. +91 98765 43210).';
    }

    // 3. Email: required, valid format
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter your professional email address.';
    }

    // 4. LinkedIn Profile URL: optional, validate if provided
    if (formData.linkedInUrl.trim()) {
      if (!isValidUrl(formData.linkedInUrl.trim())) {
        newErrors.linkedInUrl = 'Please enter a valid URL (e.g. https://www.linkedin.com/in/your-profile).';
      }
    }

    // 5. Consent: required
    if (!formData.consent) {
      newErrors.consent = 'Please confirm your consent to join the community.';
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
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          linkedInUrl: formData.linkedInUrl.trim() || undefined,
          campaign: 'mentor_counsellor_community',
        }),
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

      // If active WhatsApp invitation URL exists, initiate immediate redirection
      if (data.redirectUrl) {
        setSubmittedMessage('Details recorded successfully! Redirecting you to the Counsellor WhatsApp Community...');
        window.location.href = data.redirectUrl;
      } else {
        // Fallback message if WhatsApp invitation URL is currently being updated
        setSubmitting(false);
        setSubmittedMessage(
          data.message ||
            'Your registration has been saved! The counsellor group invitation is currently being refreshed and our team will share it with you shortly.'
        );
      }
    } catch (err) {
      console.error('Counsellor submission error:', err);
      setErrors({
        general: 'A network error occurred. Please check your connection and try again.',
      });
      setSubmitting(false);
    }
  };

  const renderBenefits = () => (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#1258DE]" />
          <span>Association Offerings &amp; Professional Benefits</span>
        </div>
        <span className="text-[10px] font-semibold text-[#1258DE] bg-[#E6EDFF] px-2 py-0.5 rounded-full">
          5 Core Pillars
        </span>
      </div>

      {/* Grid: 1 col on mobile, 2 cols on tablet & desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {COUNSELLOR_BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon;
          const isLastOdd = index === COUNSELLOR_BENEFITS.length - 1 && COUNSELLOR_BENEFITS.length % 2 !== 0;
          return (
            <div
              key={benefit.num}
              className={`p-3.5 sm:p-4 rounded-xl bg-white border border-[#DDE3F0] shadow-2xs hover:border-[#1258DE]/40 transition-all flex items-start gap-3 ${
                isLastOdd ? 'sm:col-span-2' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${benefit.accent} mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="text-[12.5px] sm:text-[13px] font-bold text-[#12131C] leading-snug">
                    {benefit.title}
                  </h3>
                  <span className="text-[9px] font-bold uppercase text-[#5B6275] bg-[#F5F7FB] px-1.5 py-0.5 rounded border border-[#DDE3F0] shrink-0">
                    {benefit.badge}
                  </span>
                </div>
                <p className="text-[11px] sm:text-[11.5px] text-[#5B6275] mt-1 leading-relaxed whitespace-normal break-words">
                  {benefit.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Professional Credibility Reassurance */}
      <div className="flex items-center flex-wrap gap-2 text-[10.5px] text-[#5B6275] pt-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Curated Professional Network</span>
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-[#1258DE]" />
          <span>No Spam · Strictly Moderated Guidance</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] flex flex-col justify-between selection:bg-[#1258DE] selection:text-white font-sans">
      
      {/* ── Compact Professional Header ── */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#DDE3F0] py-2.5 px-3.5 sm:px-6 md:px-8 shrink-0 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-transparent.png"
              alt="CLARVO"
              width={28}
              height={28}
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="text-[15px] sm:text-[17px] font-black tracking-[-0.03em] text-[#12131C] leading-none">
                CLARVO
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#1258DE] leading-none mt-0.5">
                Global Counselling Association
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[9.5px] sm:text-[10.5px] font-bold text-[#1258DE] bg-[#E6EDFF] px-2.5 py-0.5 rounded-full border border-[#1258DE]/20">
            <Users className="w-3 h-3 text-[#1258DE]" />
            <span>Mentor &amp; Counsellor Community</span>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 md:px-8 py-3.5 sm:py-6 lg:py-8 flex flex-col justify-center">
        
        {/* Intro Banner for Both Mobile and Desktop */}
        <div className="mb-3.5 sm:mb-5">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6EDFF] border border-[#1258DE]/20 text-[#1258DE] text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.08em] uppercase mb-1.5">
            <Sparkles className="w-2.5 h-2.5 text-[#1258DE]" />
            <span>CLARVO — GLOBAL COUNSELLING ASSOCIATION</span>
          </div>

          <h1 className="text-[20px] xs:text-[23px] sm:text-[30px] md:text-[34px] font-black text-[#12131C] tracking-tight leading-[1.12]">
            Connect. Grow. <span className="text-[#1258DE]">Make an Impact.</span>
          </h1>

          <p className="text-[12px] sm:text-[14px] font-semibold text-[#12131C] mt-1">
            A Professional Community for the Future of Counselling.
          </p>

          <p className="mt-1 text-[11px] xs:text-[12px] sm:text-[13px] text-[#5B6275] leading-relaxed max-w-2xl">
            Join a growing community of career counsellors, educational counsellors and mentors committed to continuous learning, professional growth and better student guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          
          {/* ── LEFT COLUMN (7 Cols on Desktop): Hidden on Mobile so Form opens right away ── */}
          <div className="hidden lg:block lg:col-span-7 flex flex-col space-y-4">
            {renderBenefits()}
          </div>

          {/* ── RIGHT COLUMN (5 Cols on Desktop, Full Width on Mobile): EXACT 4-FIELD FORM ── */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-[#DDE3F0] shadow-[0_8px_25px_rgba(18,88,222,0.06)] p-3.5 sm:p-5 lg:p-6">
              
              <div className="border-b border-[#DDE3F0] pb-2 sm:pb-2.5 mb-2.5 sm:mb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14.5px] sm:text-[16.5px] font-black text-[#12131C] tracking-tight leading-tight">
                    Join the Counsellor Community
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Free Access
                  </span>
                </div>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#5B6275] mt-0.5">
                  Enter your details to receive instant access to the official WhatsApp community.
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
                
                {/* Field 1: Name (Required) */}
                <div>
                  <label htmlFor="name" className="block text-[10.5px] sm:text-[11px] font-bold text-[#12131C] mb-0.5">
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
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={`w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border text-[12.5px] sm:text-[13px] text-[#12131C] placeholder:text-[#94A3B8] bg-white transition-all focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#DDE3F0] focus:border-[#1258DE] focus:ring-blue-100'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-600 mt-0.5">{errors.name}</p>}
                </div>

                {/* Field 2: Phone Number (Required) */}
                <div>
                  <label htmlFor="phone" className="block text-[10.5px] sm:text-[11px] font-bold text-[#12131C] mb-0.5">
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
                    placeholder="Enter your contact number (e.g. +91 98765 43210)"
                    autoComplete="tel"
                    className={`w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border text-[12.5px] sm:text-[13px] text-[#12131C] placeholder:text-[#94A3B8] bg-white transition-all focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#DDE3F0] focus:border-[#1258DE] focus:ring-blue-100'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-600 mt-0.5">{errors.phone}</p>}
                </div>

                {/* Field 3: Email Address (Required) */}
                <div>
                  <label htmlFor="email" className="block text-[10.5px] sm:text-[11px] font-bold text-[#12131C] mb-0.5">
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
                    placeholder="Enter your professional email address"
                    autoComplete="email"
                    className={`w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border text-[12.5px] sm:text-[13px] text-[#12131C] placeholder:text-[#94A3B8] bg-white transition-all focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#DDE3F0] focus:border-[#1258DE] focus:ring-blue-100'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-red-600 mt-0.5">{errors.email}</p>}
                </div>

                {/* Field 4: LinkedIn Profile URL (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label htmlFor="linkedInUrl" className="block text-[10.5px] sm:text-[11px] font-bold text-[#12131C]">
                      LinkedIn Profile URL
                    </label>
                    <span className="text-[10px] font-medium text-[#5B6275]">Optional</span>
                  </div>
                  <input
                    id="linkedInUrl"
                    type="url"
                    value={formData.linkedInUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, linkedInUrl: e.target.value });
                      if (errors.linkedInUrl) setErrors({ ...errors, linkedInUrl: undefined });
                    }}
                    placeholder="https://www.linkedin.com/in/your-profile"
                    className={`w-full h-9 sm:h-9.5 px-3 rounded-lg sm:rounded-xl border text-[12.5px] sm:text-[13px] text-[#12131C] placeholder:text-[#94A3B8] bg-white transition-all focus:outline-none focus:ring-2 ${
                      errors.linkedInUrl
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-[#DDE3F0] focus:border-[#1258DE] focus:ring-blue-100'
                    }`}
                  />
                  {errors.linkedInUrl && <p className="text-[10px] text-red-600 mt-0.5">{errors.linkedInUrl}</p>}
                </div>

                {/* Required Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => {
                        setFormData({ ...formData, consent: e.target.checked });
                        if (errors.consent) setErrors({ ...errors, consent: undefined });
                      }}
                      className="mt-0.5 w-3.5 h-3.5 rounded text-[#1258DE] border-[#DDE3F0] focus:ring-[#1258DE] cursor-pointer"
                    />
                    <span className="text-[10px] sm:text-[10.5px] text-[#5B6275] leading-snug">
                      I agree to receive community updates from CLARVO. Protected under our{' '}
                      <Link href="/privacy" target="_blank" className="text-[#1258DE] hover:underline font-semibold">
                        Privacy Policy
                      </Link>.
                    </span>
                  </label>
                  {errors.consent && <p className="text-[10px] text-red-600 mt-0.5">{errors.consent}</p>}
                </div>

                {/* Submit Action: EXACT CTA "Join the Counsellor Community →" */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-10 sm:h-11 rounded-lg sm:rounded-xl bg-[#1258DE] hover:bg-[#0E46B3] text-white text-[13px] sm:text-[13.5px] font-bold inline-flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(18,88,222,0.28)] hover:shadow-[0_6px_20px_rgba(18,88,222,0.38)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                  >
                    <span>{submitting ? 'Connecting to WhatsApp...' : 'Join the Counsellor Community →'}</span>
                  </button>
                </div>

                <div className="text-center pt-0.5">
                  <span className="text-[9.5px] sm:text-[10px] text-[#5B6275] flex items-center justify-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-[#16A34A]" />
                    <span>Official Invitation · Zero Spam · Verified Network</span>
                  </span>
                </div>

              </form>
            </div>
          </div>

        </div>

        {/* ── MOBILE VIEW ONLY: 5 Offerings placed immediately BELOW the form ── */}
        <div className="block lg:hidden w-full mt-6 pt-5 border-t border-[#DDE3F0]">
          {renderBenefits()}
        </div>

      </main>

      {/* ── Ultra-Compact Professional Footer ── */}
      <footer className="w-full border-t border-[#DDE3F0] bg-white py-2.5 px-3.5 text-center text-[10px] sm:text-[10.5px] text-[#5B6275] shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col xs:flex-row items-center justify-between gap-1">
          <span>&copy; {new Date().getFullYear()} CLARVO (CLARVO EDUCATION PRIVATE LIMITED).</span>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="hover:text-[#1258DE] transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <span className="text-[#94A3B8]">Counsellor Association Direct QR Access</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

