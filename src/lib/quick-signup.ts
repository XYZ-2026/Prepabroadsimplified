// Rules for the short sign-up form used inside the sign-up popup (QuickSignUp).
// Shared by the browser (instant feedback) and /api/auth/register (authoritative check),
// so both always agree. The full /auth page wizard does not use this file.
import { normalizeGrade, type AcademicGrade } from '@/lib/psychometric-access-policy';

/** Wording the parent/guardian (or student) agrees to. Stored with the consent record. */
export const PARENT_CONSENT_TEXT =
  "I am the student's parent or guardian, or I have their permission to create this account.";

/** Bump when PARENT_CONSENT_TEXT changes, so each stored record says which wording was agreed to. */
export const PARENT_CONSENT_VERSION = 'popup-2026-11';

export const PASSWORD_MIN_LENGTH = 8;

export const FIELD_MAX = {
  name: 100,
  parentName: 100,
  email: 120,
  mobile: 20,
  school: 120,
  city: 60,
  password: 128,
} as const;

export interface QuickSignUpInput {
  name: string;
  email: string;
  mobile: string;
  parentName: string;
  grade: string;
  school: string;
  city: string;
  parentConsent: boolean;
  /** Left out for Google sign-ups, which have no password. */
  password?: string;
  confirmPassword?: string;
}

export type QuickSignUpField = keyof QuickSignUpInput;
export type QuickSignUpErrors = Partial<Record<QuickSignUpField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Letters from any script, spaces, and the punctuation found in real names (O'Brien, Anne-Marie, S. Kumar).
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

/** Digits only; accepts "+91 98765 43210", "098765-43210", etc. */
export function mobileDigits(mobile: string): string {
  return mobile.replace(/\D/g, '');
}

/**
 * A usable phone number: an Indian mobile (10 digits starting 6–9, optionally with 0 or 91
 * in front) or, for families abroad, an international number written with a leading "+".
 */
export function isValidMobile(mobile: string): boolean {
  const raw = mobile.trim();
  const d = mobileDigits(raw);
  if (/^(?:0|91)?[6-9]\d{9}$/.test(d)) return true;
  return raw.startsWith('+') && d.length >= 8 && d.length <= 15;
}

const clean = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Trims and caps every field; never trusts types sent by a browser. */
export function normalizeQuickSignUp(raw: Record<string, unknown>): QuickSignUpInput {
  return {
    name: clean(raw.name, FIELD_MAX.name).replace(/\s+/g, ' '),
    email: clean(raw.email, FIELD_MAX.email).toLowerCase(),
    mobile: clean(raw.mobile, FIELD_MAX.mobile),
    parentName: clean(raw.parentName, FIELD_MAX.parentName).replace(/\s+/g, ' '),
    grade: typeof raw.grade === 'string' ? raw.grade.trim() : '',
    school: clean(raw.school, FIELD_MAX.school),
    city: clean(raw.city, FIELD_MAX.city),
    parentConsent: raw.parentConsent === true,
    // Passwords are never trimmed: spaces may be intentional.
    password: typeof raw.password === 'string' ? raw.password : undefined,
    confirmPassword: typeof raw.confirmPassword === 'string' ? raw.confirmPassword : undefined,
  };
}

/**
 * Returns one plain-language message per invalid field (empty object when everything is fine).
 * `requirePassword` is false for Google sign-ups.
 */
export function validateQuickSignUp(input: QuickSignUpInput, opts: { requirePassword: boolean }): QuickSignUpErrors {
  const e: QuickSignUpErrors = {};
  const grade: AcademicGrade | null = input.grade ? normalizeGrade(input.grade) : null;
  const isUg = grade === 'UG';

  if (!input.name) e.name = "Enter the student's full name.";
  else if (input.name.length < 2 || !NAME_RE.test(input.name)) e.name = 'Use letters only for the name (for example, Rahul Sharma).';

  if (!input.mobile) e.mobile = 'Enter a mobile number so a counsellor can reach you.';
  else if (!isValidMobile(input.mobile)) e.mobile = 'Enter a 10-digit mobile number, or add + and the country code if outside India.';

  if (!input.email) e.email = 'Enter an email address.';
  else if (!EMAIL_RE.test(input.email)) e.email = 'Check the email address (for example, name@gmail.com).';

  if (!input.parentName) e.parentName = "Enter the parent or guardian's name.";
  else if (input.parentName.length < 2 || !NAME_RE.test(input.parentName)) e.parentName = 'Use letters only for the parent or guardian name.';

  if (!grade) e.grade = 'Choose the current grade.';

  if (!input.school) e.school = isUg ? 'Enter the college or university name.' : 'Enter the school name.';
  if (!input.city) e.city = 'Enter the city.';

  if (opts.requirePassword) {
    const pw = input.password ?? '';
    if (!pw) e.password = 'Create a password.';
    else if (pw.length < PASSWORD_MIN_LENGTH) e.password = `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
    else if (pw.length > FIELD_MAX.password) e.password = `Use at most ${FIELD_MAX.password} characters.`;

    if (!input.confirmPassword) e.confirmPassword = 'Type the password again.';
    else if (pw && input.confirmPassword !== pw) e.confirmPassword = "The passwords don't match.";
  }

  if (!input.parentConsent) e.parentConsent = 'Tick this box to confirm a parent or guardian agrees.';

  return e;
}

/** The consent record saved on the user document. */
export function parentConsentRecord(parentName: string, method: 'Email & password' | 'Google') {
  return {
    given: true,
    parentName,
    text: PARENT_CONSENT_TEXT,
    version: PARENT_CONSENT_VERSION,
    method: 'self-declared checkbox',
    signupMethod: method,
    at: new Date().toISOString(),
  };
}
