'use client';

import React, { useRef, useState } from 'react';
import { Field, FieldError, FormNotice, inputClass, primaryButtonClass } from '@/components/Auth/popup/formUi';
import { SUMMER_SCHOOL_GRADES, SUMMER_SCHOOL_NAME } from '@/content/summerSchoolContent';
import { isValidMobile } from '@/lib/quick-signup';

const EMPTY = { parentName: '', studentName: '', phone: '', email: '', grade: '', schoolName: '', companyWebsite: '' };
type Errors = Partial<Record<keyof typeof EMPTY | 'consent', string>>;

/** Order matters: after a failed submit, focus goes to the first field with an error. */
function validate(v: typeof EMPTY, consent: boolean): Errors {
  const errors: Errors = {};
  if (v.parentName.trim().length < 2) errors.parentName = 'Enter the parent or guardian’s name.';
  if (v.studentName.trim().length < 2) errors.studentName = 'Enter the student’s name.';
  if (!isValidMobile(v.phone)) errors.phone = 'Enter a 10-digit mobile number, or add + and the country code.';
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'Check the email address.';
  if (!v.grade) errors.grade = 'Choose the student’s grade.';
  if (v.schoolName.trim().length < 2) errors.schoolName = 'Enter the school name.';
  if (!consent) errors.consent = 'Tick this box so we can contact you.';
  return errors;
}

export default function EnquiryForm() {
  const [values, setValues] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const form = useRef<HTMLFormElement>(null);
  const sending = useRef(false);

  const showErrors = (found: Errors) => {
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) form.current?.querySelector<HTMLElement>(`#ss-${first}`)?.focus();
  };

  const bind = (key: keyof typeof EMPTY) => ({
    id: `ss-${key}`,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      setErrors((x) => ({ ...x, [key]: undefined }));
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending.current) return;
    setFormError('');
    const found = validate(values, consent);
    showErrors(found);
    if (Object.keys(found).length) return;

    sending.current = true;
    setStatus('sending');
    try {
      const res = await fetch('/api/book-a-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          consent,
          academicLevel: values.grade === 'Grade 8' ? 'Middle School (Grades 6-8)' : 'High School (Grades 9-12)',
          clarvoExploration: [SUMMER_SCHOOL_NAME],
          sourcePage: 'summer-school:form',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus('sent');
        return;
      }
      if (data.errors) showErrors(data.errors);
      setFormError(data.message || 'We could not send your request. Check the details and try again.');
    } catch {
      setFormError('We could not reach our server. Check your internet connection and try again.');
    } finally {
      sending.current = false;
    }
    setStatus('idle');
  };

  if (status === 'sent') {
    return (
      <FormNotice tone="success">
        <strong>Request received.</strong> A CLARVO counsellor will contact you on {values.phone}.
      </FormNotice>
    );
  }

  return (
    <form ref={form} onSubmit={submit} noValidate aria-label="Schedule a consultation call">
      {formError && <FormNotice tone="error">{formError}</FormNotice>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field {...bind('parentName')} label="Parent / guardian name" autoComplete="name" maxLength={100} error={errors.parentName} />
        <Field {...bind('studentName')} label="Student name" maxLength={100} error={errors.studentName} />
        <Field {...bind('phone')} label="Parent mobile number" type="tel" autoComplete="tel" maxLength={20} error={errors.phone} />
        <Field {...bind('email')} label="Email (optional)" type="email" autoComplete="email" maxLength={120} error={errors.email} />
        <div>
          <label htmlFor="ss-grade" className="block mb-1.5 text-[14.5px] font-semibold text-ink">Grade</label>
          <select {...bind('grade')} aria-invalid={Boolean(errors.grade)} aria-describedby={errors.grade ? 'ss-grade-error' : undefined} className={`${inputClass(Boolean(errors.grade))} !bg-white !text-ink`}>
            <option value="">Select grade</option>
            {SUMMER_SCHOOL_GRADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <FieldError id="ss-grade-error" message={errors.grade} />
        </div>
        <Field {...bind('schoolName')} label="School name" maxLength={150} error={errors.schoolName} />
        {/* Hidden from people; bots that fill it are ignored by the server. */}
        <div aria-hidden="true" className="absolute w-px h-px overflow-hidden -left-[9999px]">
          <input {...bind('companyWebsite')} tabIndex={-1} autoComplete="off" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ss-consent" className="flex items-start gap-3 min-h-11 py-1 text-[16px] leading-snug text-ink cursor-pointer">
            <input
              type="checkbox"
              id="ss-consent"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                setErrors((x) => ({ ...x, consent: undefined }));
              }}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? 'ss-consent-error' : undefined}
              className="mt-0.5 w-5 h-5 shrink-0 accent-[var(--clarvo-blue,#1258DE)]"
            />
            <span>
              I am the student&apos;s parent or guardian, or have their permission. CLARVO may contact me about this request. See the{' '}
              <a href="/privacy" target="_blank" rel="noopener" className="text-clarvo-blue">Privacy Policy</a>.
            </span>
          </label>
          <FieldError id="ss-consent-error" message={errors.consent} />
        </div>
      </div>
      <button type="submit" disabled={status === 'sending'} className={`${primaryButtonClass} mt-5`}>
        {status === 'sending' ? 'Sending…' : 'Request my free consultation'}
      </button>
    </form>
  );
}
