// Unit tests for the sign-up popup's validation rules (src/lib/quick-signup.ts).
// Pure Node: no browser or server needed. Runs in one Playwright project only.
import { test, expect } from '@playwright/test';
import {
  isValidMobile,
  mobileDigits,
  normalizeQuickSignUp,
  parentConsentRecord,
  validateQuickSignUp,
  PARENT_CONSENT_TEXT,
  PARENT_CONSENT_VERSION,
  FIELD_MAX,
} from '../src/lib/quick-signup';

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'desktop-1440x900', 'pure unit tests: run once');
});

const valid = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  mobile: '98765 43210',
  parentName: 'Priya Sharma',
  grade: '10',
  school: 'Delhi Public School',
  city: 'Mumbai',
  parentConsent: true,
  password: 'secret123',
  confirmPassword: 'secret123',
};

const check = (over: Record<string, unknown> = {}, requirePassword = true) =>
  validateQuickSignUp(normalizeQuickSignUp({ ...valid, ...over }), { requirePassword });

test.describe('quick sign-up: validation', () => {
  test('a complete, correct form has no errors', () => {
    expect(check()).toEqual({});
  });

  test('every field is required (empty form)', () => {
    const errs = validateQuickSignUp(normalizeQuickSignUp({}), { requirePassword: true });
    expect(Object.keys(errs).sort()).toEqual(
      ['city', 'confirmPassword', 'email', 'grade', 'mobile', 'name', 'parentConsent', 'parentName', 'password', 'school'].sort(),
    );
  });

  test('whitespace-only answers count as empty', () => {
    const errs = check({ name: '   ', parentName: '\t', school: '  ', city: ' ' });
    expect(errs.name).toMatch(/full name/);
    expect(errs.parentName).toMatch(/parent or guardian/);
    expect(errs.school).toBe('Enter the school name.');
    expect(errs.city).toBe('Enter the city.');
  });

  test('names: letters from any script and real-name punctuation are fine; digits and symbols are not', () => {
    expect(check({ name: "D'Souza Anne-Marie" }).name).toBeUndefined();
    expect(check({ name: 'S. Kumar' }).name).toBeUndefined();
    expect(check({ name: 'राहुल शर्मा' }).name).toBeUndefined();
    expect(check({ name: 'R' }).name).toBeDefined();
    expect(check({ name: 'Rahul123' }).name).toBeDefined();
    expect(check({ name: '<script>' }).name).toBeDefined();
    expect(check({ parentName: '1234' }).parentName).toBeDefined();
  });

  test('grade must be 7 to 12 or undergraduate', () => {
    for (const g of ['7', '8', '9', '10', '11', '12', 'UG']) expect(check({ grade: g }).grade).toBeUndefined();
    expect(check({ grade: '' }).grade).toBeDefined();
    expect(check({ grade: 'banana' }).grade).toBeDefined();
    expect(check({ grade: 42 }).grade).toBeDefined(); // wrong type
  });

  test('school wording follows the grade', () => {
    expect(check({ grade: 'UG', school: '' }).school).toBe('Enter the college or university name.');
    expect(check({ grade: '9', school: '' }).school).toBe('Enter the school name.');
  });

  test('email format', () => {
    expect(check({ email: 'not-an-email' }).email).toBeDefined();
    expect(check({ email: 'a@b' }).email).toBeDefined();
    expect(check({ email: '  RAHUL@Example.COM ' }).email).toBeUndefined();
  });

  test('passwords: minimum length, maximum length and matching', () => {
    expect(check({ password: 'short', confirmPassword: 'short' }).password).toMatch(/at least 8/);
    const long = 'x'.repeat(FIELD_MAX.password + 1);
    expect(check({ password: long, confirmPassword: long }).password).toMatch(/at most/);
    expect(check({ confirmPassword: 'different1' }).confirmPassword).toMatch(/don't match/);
    expect(check({ confirmPassword: '' }).confirmPassword).toBeDefined();
  });

  test('Google sign-ups skip the password fields', () => {
    expect(check({ password: undefined, confirmPassword: undefined }, false)).toEqual({});
  });

  test('consent must be exactly true (not a truthy string) and is never assumed', () => {
    expect(check({ parentConsent: false }).parentConsent).toBeDefined();
    expect(check({ parentConsent: 'true' }).parentConsent).toBeDefined();
    expect(check({ parentConsent: undefined }).parentConsent).toBeDefined();
  });
});

test.describe('quick sign-up: mobile numbers', () => {
  test('accepts Indian mobiles in common formats', () => {
    for (const m of ['9876543210', '98765 43210', '+91 98765 43210', '+91-9876543210', '09876543210', '919876543210']) {
      expect(isValidMobile(m), m).toBe(true);
    }
  });

  test('accepts international numbers written with +', () => {
    expect(isValidMobile('+1 415 555 0123')).toBe(true);
    expect(isValidMobile('+44 20 7946 0958')).toBe(true);
  });

  test('rejects too short, wrong start digit, letters and too long', () => {
    for (const m of ['12345', '5876543210', 'abcdefghij', '98765', '+1234567890123456', '']) {
      expect(isValidMobile(m), m).toBe(false);
    }
  });

  test('mobileDigits strips everything but digits', () => {
    expect(mobileDigits('+91 (987) 654-3210')).toBe('919876543210');
  });
});

test.describe('quick sign-up: cleaning input', () => {
  test('trims, lowercases email, collapses spaces in names and caps lengths', () => {
    const n = normalizeQuickSignUp({
      name: '  Rahul    Sharma ',
      email: ' Rahul@Example.COM ',
      school: 'S'.repeat(500),
      city: 'C'.repeat(500),
      password: '  keep spaces  ',
    });
    expect(n.name).toBe('Rahul Sharma');
    expect(n.email).toBe('rahul@example.com');
    expect(n.school.length).toBe(FIELD_MAX.school);
    expect(n.city.length).toBe(FIELD_MAX.city);
    expect(n.password).toBe('  keep spaces  ');
  });

  test('non-string values become empty, never crash', () => {
    const n = normalizeQuickSignUp({ name: 123, email: null, mobile: {}, grade: ['10'], password: 5 });
    expect(n).toMatchObject({ name: '', email: '', mobile: '', grade: '', password: undefined });
  });
});

test.describe('quick sign-up: consent record', () => {
  test('records who, what wording, which version, how and when', () => {
    const r = parentConsentRecord('Priya Sharma', 'Google');
    expect(r).toMatchObject({
      given: true,
      parentName: 'Priya Sharma',
      text: PARENT_CONSENT_TEXT,
      version: PARENT_CONSENT_VERSION,
      method: 'self-declared checkbox',
      signupMethod: 'Google',
    });
    expect(Number.isNaN(Date.parse(r.at))).toBe(false);
  });
});
