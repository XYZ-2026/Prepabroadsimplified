'use client';

import React, { useRef, useState } from 'react';
import { Field, FieldError, FormNotice, inputClass, primaryButtonClass } from '@/components/Auth/popup/formUi';
import { SUMMER_SCHOOL_GRADES, SUMMER_SCHOOL_NAME } from '@/content/summerSchoolContent';
import { isValidMobile } from '@/lib/quick-signup';

const EMPTY = { programme: '', parentName: '', studentName: '', phone: '', email: '', grade: '', schoolName: '', month: '', time: '', companyWebsite: '' };
type Errors = Partial<Record<keyof typeof EMPTY | 'consent', string>>;

const TIMES = ['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Not sure yet'];

interface EnquiryFormProps {
  /** Shows a programme picker when given. */
  programmes?: { slug: string; name: string }[];
  /** Slug of the programme this page is about. */
  selected?: string;
  /** Upcoming months: turns the form into a batch request. */
  months?: string[];
}

/** Order matters: after a failed submit, focus goes to the first field with an error. */
function validate(v: typeof EMPTY, consent: boolean, asks: { programme: boolean; batch: boolean }): Errors {
  const errors: Errors = {};
  if (asks.programme && !v.programme) errors.programme = 'Choose a programme.';
  if (v.parentName.trim().length < 2) errors.parentName = 'Enter the parent or guardian’s name.';
  if (v.studentName.trim().length < 2) errors.studentName = 'Enter the student’s name.';
  if (!isValidMobile(v.phone)) errors.phone = 'Enter a 10-digit mobile number, or add + and the country code.';
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = 'Check the email address.';
  if (!v.grade) errors.grade = 'Choose the student’s grade.';
  if (v.schoolName.trim().length < 2) errors.schoolName = 'Enter the school name.';
  if (asks.batch && !v.month) errors.month = 'Choose a month.';
  if (asks.batch && !v.time) errors.time = 'Choose a time.';
  if (!consent) errors.consent = 'Tick this box so we can contact you.';
  return errors;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  error?: string;
  wide?: boolean;
}

function SelectField({ id, label, placeholder, options, error, wide, ...select }: SelectFieldProps) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="block mb-1.5 text-[14.5px] font-semibold text-ink">{label}</label>
      <select id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`${inputClass(Boolean(error))} !bg-white !text-ink`} {...select}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

const plain = (values: string[]) => values.map((value) => ({ value, label: value }));

export default function EnquiryForm({ programmes, selected = '', months }: EnquiryFormProps) {
  const [values, setValues] = useState({ ...EMPTY, programme: selected });
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
    const found = validate(values, consent, { programme: Boolean(programmes), batch: Boolean(months) });
    showErrors(found);
    if (Object.keys(found).length) return;

    sending.current = true;
    setStatus('sending');
    const { programme, month, time, ...contact } = values;
    try {
      const res = await fetch('/api/book-a-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          consent,
          academicLevel: values.grade === 'Grade 8' ? 'Middle School (Grades 6-8)' : 'High School (Grades 9-12)',
          clarvoExploration: [programmes?.find((p) => p.slug === programme)?.name ?? SUMMER_SCHOOL_NAME],
          ...(months && { preferredTimeFrame: `${month}, ${time}` }),
          sourcePage: `summer-school:${months ? 'batches' : selected || 'form'}`,
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
    <form ref={form} onSubmit={submit} noValidate aria-label={months ? 'Request a batch' : 'Schedule a consultation call'}>
      {formError && <FormNotice tone="error">{formError}</FormNotice>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {programmes && (
          <SelectField {...bind('programme')} label="Programme" placeholder="Select programme" options={programmes.map((p) => ({ value: p.slug, label: p.name }))} error={errors.programme} wide />
        )}
        <Field {...bind('parentName')} label="Parent / guardian name" autoComplete="name" maxLength={100} error={errors.parentName} />
        <Field {...bind('studentName')} label="Student name" maxLength={100} error={errors.studentName} />
        <Field {...bind('phone')} label="Parent mobile number" type="tel" autoComplete="tel" maxLength={20} error={errors.phone} />
        <Field {...bind('email')} label="Email (optional)" type="email" autoComplete="email" maxLength={120} error={errors.email} />
        <SelectField {...bind('grade')} label="Grade" placeholder="Select grade" options={plain(SUMMER_SCHOOL_GRADES)} error={errors.grade} />
        <Field {...bind('schoolName')} label="School name" maxLength={150} error={errors.schoolName} />
        {months && (
          <>
            <SelectField {...bind('month')} label="Preferred month" placeholder="Select month" options={plain(months)} error={errors.month} />
            <SelectField {...bind('time')} label="Preferred time" placeholder="Select time" options={plain(TIMES)} error={errors.time} />
          </>
        )}
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
        {status === 'sending' ? 'Sending…' : months ? 'Request this batch' : 'Request my free consultation'}
      </button>
    </form>
  );
}
