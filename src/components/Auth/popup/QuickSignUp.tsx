'use client';

// The short, single-screen sign-up used only inside the sign-up popup (SignInModal).
// The full /auth page keeps its own 4-step wizard (AuthForm) and does not use this.
import React, { useRef, useState } from 'react';
import { ACADEMIC_GRADES, type AcademicGrade } from '@/lib/psychometric-access-policy';
import {
  FIELD_MAX,
  PARENT_CONSENT_TEXT,
  PASSWORD_MIN_LENGTH,
  normalizeQuickSignUp,
  validateQuickSignUp,
  type QuickSignUpErrors,
  type QuickSignUpField,
} from '@/lib/quick-signup';
import {
  Divider,
  Field,
  FieldError,
  FormNotice,
  GoogleIcon,
  PasswordField,
  errorMessage,
  linkButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
} from './formUi';
import { googleErrorMessage, type GooglePrefill } from './googleAuth';
import { continueWithGoogle } from './googlePopup';

const GRADE_LABEL: Record<AcademicGrade, string> = {
  '7': '7th',
  '8': '8th',
  '9': '9th',
  '10': '10th',
  '11': '11th',
  '12': '12th',
  UG: 'Undergrad',
};

/** Order used to move focus to the first problem after a failed submit. */
const FIELD_ORDER: QuickSignUpField[] = [
  'name',
  'parentName',
  'mobile',
  'email',
  'grade',
  'school',
  'city',
  'password',
  'confirmPassword',
  'parentConsent',
];

const FIELD_DOM_ID: Record<QuickSignUpField, string> = {
  name: 'qs-name',
  parentName: 'qs-parent',
  mobile: 'qs-mobile',
  email: 'qs-email',
  grade: 'qs-grade-7',
  school: 'qs-school',
  city: 'qs-city',
  password: 'qs-password',
  confirmPassword: 'qs-confirm',
  parentConsent: 'qs-consent',
};

interface QuickSignUpProps {
  /** Same-site path to open once the account exists. */
  redirectTo: string;
  /** Switch the popup to its Sign in tab, prefilled with this email. */
  onSwitchToSignIn: (email: string) => void;
  /** Set when a new Google user arrived from the Sign in tab: finish the form for this account. */
  initialGoogle?: GooglePrefill | null;
}

export default function QuickSignUp({ redirectTo, onSwitchToSignIn, initialGoogle = null }: QuickSignUpProps) {
  const [values, setValues] = useState({
    name: initialGoogle?.name ?? '',
    parentName: initialGoogle?.parentName ?? '',
    mobile: initialGoogle?.mobile ?? '',
    email: initialGoogle?.email ?? '',
    grade: '' as AcademicGrade | '',
    school: initialGoogle?.school ?? '',
    city: initialGoogle?.city ?? '',
    password: '',
    confirmPassword: '',
    parentConsent: false,
  });
  const [errors, setErrors] = useState<QuickSignUpErrors>({});
  const [formError, setFormError] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [google, setGoogle] = useState<{ email: string } | null>(initialGoogle);
  const submittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isUg = values.grade === 'UG';
  const busy = submitting || googleBusy;

  const set = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    // Clear a field's error as soon as the person starts fixing it.
    if (errors[key as QuickSignUpField]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusFirstError = (errs: QuickSignUpErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`#${FIELD_DOM_ID[first]}`);
    el?.focus();
  };

  const showServerError = (message: string, fields?: QuickSignUpErrors) => {
    if (fields && Object.keys(fields).length) {
      setErrors(fields);
      focusFirstError(fields);
    }
    const taken = /already registered/i.test(message);
    setAlreadyRegistered(taken);
    setFormError(taken ? 'This email already has a CLARVO account.' : message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return; // double-click / double-Enter guard
    setFormError('');
    setAlreadyRegistered(false);

    const input = normalizeQuickSignUp({ ...values, email: google ? google.email : values.email });
    const errs = validateQuickSignUp(input, { requirePassword: !google });
    setErrors(errs);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      const res = google
        ? await fetch('/api/user/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              signupForm: 'quick',
              role: 'student',
              name: input.name,
              mobile: input.mobile,
              parentName: input.parentName,
              grade: input.grade,
              schoolName: input.school,
              city: input.city,
              parentConsent: true,
              onboarding: { completed: true, completedAt: new Date().toISOString() },
            }),
          })
        : await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              signupForm: 'quick',
              role: 'student',
              name: input.name,
              email: input.email,
              mobile: input.mobile,
              parentName: input.parentName,
              grade: input.grade,
              school: input.school,
              city: input.city,
              password: input.password,
              confirmPassword: input.confirmPassword,
              parentConsent: true,
            }),
          });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401 && google) {
          throw new Error('Your Google sign-in has expired. Please choose "Continue with Google" again.');
        }
        showServerError(
          data.error || 'We could not create your account. Please check your details and try again.',
          data.fields,
        );
        return;
      }
      // Full page load so the server renders the next page with the new session.
      window.location.href = redirectTo;
    } catch (err) {
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
      setFormError(
        offline
          ? "You seem to be offline. Check your internet connection, then press 'Create free account' again."
          : errorMessage(err, 'Something went wrong on our side. Please try again in a moment.'),
      );
      if (google && err instanceof Error && /expired/.test(err.message)) setGoogle(null);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (busy) return;
    setFormError('');
    setAlreadyRegistered(false);
    setGoogleBusy(true);
    try {
      const prefill = await continueWithGoogle();
      if (!prefill) {
        window.location.href = redirectTo;
        return;
      }
      // New Google account: keep what we know and ask only for the rest.
      setGoogle({ email: prefill.email });
      setValues((v) => ({
        ...v,
        name: v.name || prefill.name,
        email: prefill.email,
        mobile: v.mobile || prefill.mobile,
        parentName: v.parentName || prefill.parentName,
        school: v.school || prefill.school,
        city: v.city || prefill.city,
        password: '',
        confirmPassword: '',
      }));
      setErrors({});
    } catch (err) {
      setFormError(googleErrorMessage(err) ?? '');
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <div>
      {!google && (
        <>
          <button type="button" onClick={handleGoogle} disabled={busy} className={secondaryButtonClass}>
            <GoogleIcon />
            {googleBusy ? 'Connecting to Google…' : 'Continue with Google'}
          </button>
          <Divider label="or sign up with email" />
        </>
      )}

      {google && (
        <FormNotice tone="success">
          Signed in with Google as <strong className="break-all">{google.email}</strong>. Add the details below to finish.
        </FormNotice>
      )}

      {formError && (
        <FormNotice tone="error">
          <span>{formError}</span>
          {alreadyRegistered && (
            <>
              {' '}
              <button type="button" className={linkButtonClass} onClick={() => onSwitchToSignIn(values.email.trim())}>
                Sign in instead
              </button>
            </>
          )}
        </FormNotice>
      )}

      <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Create a free account">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
          <Field
            id="qs-name"
            label="Student's full name"
            autoComplete="name"
            placeholder="e.g. Rahul Sharma"
            maxLength={FIELD_MAX.name}
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
          />
          <Field
            id="qs-parent"
            label="Parent / guardian name"
            autoComplete="off"
            placeholder="e.g. Priya Sharma"
            maxLength={FIELD_MAX.parentName}
            value={values.parentName}
            onChange={(e) => set('parentName', e.target.value)}
            error={errors.parentName}
          />
          <Field
            id="qs-mobile"
            label="Mobile number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            maxLength={FIELD_MAX.mobile}
            value={values.mobile}
            onChange={(e) => set('mobile', e.target.value)}
            error={errors.mobile}
          />
          <Field
            id="qs-email"
            label="Email address"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="name@gmail.com"
            maxLength={FIELD_MAX.email}
            readOnly={Boolean(google)}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            error={errors.email}
          />

          <fieldset
            className="sm:col-span-2 m-0 p-0 border-0 min-w-0"
            aria-describedby={errors.grade ? 'qs-grade-error' : undefined}
          >
            <legend className="p-0 mb-1.5 text-[14.5px] font-semibold text-ink font-dmsans">Current grade</legend>
            <div className="grid grid-cols-4 gap-2">
              {ACADEMIC_GRADES.map((g) => (
                <label key={g} className={`relative block ${g === 'UG' ? 'col-span-2' : ''}`}>
                  <input
                    type="radio"
                    name="qs-grade"
                    id={`qs-grade-${g}`}
                    value={g}
                    checked={values.grade === g}
                    onChange={() => set('grade', g)}
                    className="peer sr-only"
                  />
                  <span
                    className={`box-border flex items-center justify-center h-11 rounded-xl border border-solid bg-white text-[15px] font-semibold font-dmsans text-ink cursor-pointer select-none transition-colors duration-150 hover:border-[#1258DE] peer-checked:bg-[#1258DE] peer-checked:border-[#1258DE] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1258DE] ${
                      errors.grade ? 'border-[#C0362C]' : 'border-[#C9D1E2]'
                    }`}
                  >
                    {GRADE_LABEL[g]}
                  </span>
                </label>
              ))}
            </div>
            <FieldError id="qs-grade-error" message={errors.grade} />
          </fieldset>

          <Field
            id="qs-school"
            label={isUg ? 'College / university name' : 'School name'}
            autoComplete="organization"
            placeholder={isUg ? 'e.g. University of Delhi' : 'e.g. Delhi Public School, R.K. Puram'}
            maxLength={FIELD_MAX.school}
            value={values.school}
            onChange={(e) => set('school', e.target.value)}
            error={errors.school}
          />
          <Field
            id="qs-city"
            label="City"
            autoComplete="address-level2"
            placeholder="e.g. Mumbai"
            maxLength={FIELD_MAX.city}
            value={values.city}
            onChange={(e) => set('city', e.target.value)}
            error={errors.city}
          />

          {!google && (
            <>
              <PasswordField
                id="qs-password"
                label="Create password"
                autoComplete="new-password"
                maxLength={FIELD_MAX.password}
                value={values.password}
                onChange={(e) => set('password', e.target.value)}
                hint={`At least ${PASSWORD_MIN_LENGTH} characters`}
                error={errors.password}
              />
              <PasswordField
                id="qs-confirm"
                label="Confirm password"
                autoComplete="new-password"
                maxLength={FIELD_MAX.password}
                value={values.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
              />
            </>
          )}

          <div className="sm:col-span-2">
            <label
              htmlFor="qs-consent"
              className="flex items-start gap-3 min-h-11 py-1 cursor-pointer text-[14.5px] leading-snug text-ink font-dmsans"
            >
              <input
                type="checkbox"
                id="qs-consent"
                checked={values.parentConsent}
                onChange={(e) => set('parentConsent', e.target.checked)}
                aria-invalid={errors.parentConsent ? true : undefined}
                aria-describedby={errors.parentConsent ? 'qs-consent-error' : undefined}
                className="mt-0.5 w-5 h-5 shrink-0 accent-[#1258DE] cursor-pointer"
              />
              <span>{PARENT_CONSENT_TEXT}</span>
            </label>
            <FieldError id="qs-consent-error" message={errors.parentConsent} />
          </div>
        </div>

        <button type="submit" disabled={busy} className={`${primaryButtonClass} mt-5`}>
          {submitting ? 'Creating your account…' : google ? 'Finish sign-up' : 'Create free account'}
        </button>

        <p className="mt-3 mb-0 text-center text-[13px] leading-relaxed text-muted font-dmsans">
          By signing up you agree to our{' '}
          <a href="/terms" target="_blank" rel="noopener" className="text-[#1258DE] underline underline-offset-2">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" target="_blank" rel="noopener" className="text-[#1258DE] underline underline-offset-2">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
