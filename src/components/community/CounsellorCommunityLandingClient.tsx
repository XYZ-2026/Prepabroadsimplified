'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Field, FieldError, FormNotice, primaryButtonClass } from '@/components/Auth/popup/formUi';

const PHOTO = {
  src: '/images/community/counsellors-together.webp',
  alt: 'Eight counsellors, mentors, professors and industry experts holding hands in front of a university',
};

const BENEFITS = [
  { title: 'Free Counsellor Certification', body: 'Learn through CLARVO’s certification initiative.' },
  { title: 'Professional Recognition & Visibility', body: 'Show your experience to fellow professionals.' },
  { title: 'Knowledge Building & Expert Workshops', body: 'Join live sessions and discussions.' },
  { title: 'Freelancing & Career Opportunities', body: 'See assignments and jobs shared in the group, subject to selection.' },
  { title: 'B2B School Counselling Networks', body: 'Meet schools and institutions to work with.' },
];

const EMPTY = { name: '', phone: '', email: '', linkedInUrl: '' };
type FormErrors = Partial<Record<keyof typeof EMPTY | 'consent' | 'general', string>>;

function isWebLink(value: string): boolean {
  try {
    return /^https?:$/.test(new URL(value).protocol);
  } catch {
    return false;
  }
}

function validate(v: typeof EMPTY, consent: boolean): FormErrors {
  const errors: FormErrors = {};
  if (v.name.trim().length < 2) errors.name = 'Please enter your full name (at least 2 characters).';
  if (!/^\+?[0-9]{7,16}$/.test(v.phone.replace(/[\s\-()]/g, ''))) errors.phone = 'Please enter a valid contact number (e.g. +91 98765 43210).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'Please enter your professional email address.';
  if (v.linkedInUrl.trim() && !isWebLink(v.linkedInUrl.trim())) errors.linkedInUrl = 'Please enter a valid URL (e.g. https://www.linkedin.com/in/your-profile).';
  if (!consent) errors.consent = 'Please confirm your consent to join the community.';
  return errors;
}

function JoinForm() {
  const [values, setValues] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const sending = useRef(false);

  const bind = (key: keyof typeof EMPTY) => ({
    id: key,
    value: values[key],
    error: errors[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      setErrors((x) => ({ ...x, [key]: undefined }));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending.current) return;
    const found = validate(values, consent);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    sending.current = true;
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim(),
          linkedInUrl: values.linkedInUrl.trim() || undefined,
          campaign: 'mentor_counsellor_community',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrors(data.errors || { general: data.error || 'Failed to submit details. Please try again.' });
      } else if (data.redirectUrl) {
        setMessage('Details recorded. Opening the counsellor WhatsApp community…');
        window.location.href = data.redirectUrl;
        return; // stay disabled while WhatsApp opens
      } else {
        setMessage(data.message || 'Your registration has been saved. Our team will share the group invitation with you shortly.');
      }
    } catch {
      setErrors({ general: 'A network error occurred. Please check your connection and try again.' });
    }
    sending.current = false;
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Join the Counsellor Community">
      {errors.general && <FormNotice tone="error">{errors.general}</FormNotice>}
      {message && <FormNotice tone="success">{message}</FormNotice>}
      <div className="grid gap-3.5">
        <Field {...bind('name')} label="Name" autoComplete="name" maxLength={100} />
        <Field {...bind('phone')} label="Phone number" type="tel" inputMode="tel" autoComplete="tel" maxLength={24} placeholder="+91 98765 43210" />
        <Field {...bind('email')} label="Email address" type="email" inputMode="email" autoComplete="email" maxLength={120} />
        <Field {...bind('linkedInUrl')} label="LinkedIn profile (optional)" type="url" maxLength={300} placeholder="https://www.linkedin.com/in/your-profile" />
        <div>
          <label htmlFor="consent" className="flex items-start gap-3 min-h-11 py-1 cursor-pointer text-[15px] leading-snug text-ink">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                setErrors((x) => ({ ...x, consent: undefined }));
              }}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? 'consent-error' : undefined}
              className="mt-0.5 w-5 h-5 shrink-0 accent-[var(--clarvo-blue,#1258DE)] cursor-pointer"
            />
            <span>
              I agree to receive community updates from CLARVO. See the{' '}
              <Link href="/privacy" target="_blank" className="text-clarvo-blue">Privacy Policy</Link>.
            </span>
          </label>
          <FieldError id="consent-error" message={errors.consent} />
        </div>
      </div>
      <button type="submit" disabled={submitting} className={`${primaryButtonClass} !px-2 mt-4`}>
        {submitting ? 'Connecting to WhatsApp…' : 'Join the Counsellor Community →'}
      </button>
    </form>
  );
}

export default function CounsellorCommunityLandingClient() {
  return (
    <div className="min-h-screen w-full bg-paper text-ink font-dmsans flex flex-col selection:bg-clarvo-blue selection:text-white">
      <header className="bg-white border-0 border-b border-solid border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2.5">
          <Image src="/logo-transparent.png" alt="" width={28} height={28} preload />
          <span className="text-[18px] font-bold tracking-tight leading-none">CLARVO</span>
        </div>
      </header>

      {/* Phones: heading, form, then the photo and pointers, so the form opens without scrolling. */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-5 sm:gap-y-8 lg:grid-rows-[auto_1fr]">
        <div className="lg:col-span-7">
          <p className="m-0 text-[14px] font-bold text-clarvo-blue">CLARVO — GLOBAL COUNSELLING ASSOCIATION</p>
          <h1 className="m-0 mt-1 sm:mt-2 font-dmsans font-bold tracking-[-0.03em] leading-[1.06] text-[clamp(1.75rem,4.4vw,3.25rem)]">
            Connect. Grow. <span className="block text-clarvo-blue">Make an Impact.</span>
          </h1>
          <p className="m-0 mt-1.5 sm:mt-3 text-[16px] sm:text-[18px] leading-snug text-muted">
            A Professional Community for the Future of Counselling.
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-8 rounded-panel bg-white border border-solid border-line p-5 sm:p-8">
          <h2 className="m-0 font-dmsans text-[20px] sm:text-[24px] font-bold tracking-tight leading-tight">Join the Counsellor Community</h2>
          <p className="m-0 mt-1 mb-4 text-[16px] text-muted">Free to join, through WhatsApp.</p>
          <JoinForm />
        </div>

        <div className="lg:col-span-7">
          <figure className="m-0">
            <div className="relative aspect-[3/2] rounded-photo overflow-hidden">
              <Image src={PHOTO.src} alt={PHOTO.alt} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-4 text-[16px] sm:text-[18px] leading-snug">
              <span className="font-bold">SAT mentors, admission counsellors, PhD professors and industry experts.</span>{' '}
              <span className="text-clarvo-blue font-bold">Growing together.</span>
            </figcaption>
          </figure>
          <ul className="list-none p-0 m-0 mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-3 first:sm:col-span-2">
                <Check className="w-5 h-5 mt-0.5 shrink-0 text-clarvo-blue" strokeWidth={3} aria-hidden="true" />
                <div>
                  <h3 className="m-0 font-dmsans text-[17px] font-bold leading-snug">{b.title}</h3>
                  <p className="m-0 mt-0.5 text-[16px] leading-snug text-muted">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="border-0 border-t border-solid border-line bg-white py-4 px-4 text-center text-[14px] text-muted">
        &copy; {new Date().getFullYear()} CLARVO EDUCATION PRIVATE LIMITED.{' '}
        <Link href="/privacy" className="text-clarvo-blue">Privacy Policy</Link>
      </footer>
    </div>
  );
}
