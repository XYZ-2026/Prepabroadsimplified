// Regression: a new Google user must finish the short form (parent consent included), from either
// popup tab. An earlier version of the popup's Sign in tab let them straight through.
import { test, expect } from '@playwright/test';
import { completeGoogleLogin, googleErrorMessage } from '../src/components/Auth/popup/googleAuth';

const identity = { idToken: 't', email: 'New@Example.com', name: 'Asha Rao', mobile: '' };
const realFetch = globalThis.fetch;

/** login reply, then profile reply */
function mockFetch(login: [number, unknown], profile: [number, unknown]) {
  globalThis.fetch = (async (url: unknown) => {
    const [status, body] = String(url).includes('/login') ? login : profile;
    return new Response(JSON.stringify(body), { status });
  }) as typeof fetch;
}

test.beforeEach(({}, info) => {
  test.skip(info.project.name !== 'desktop-1440x900', 'pure unit tests: run once');
});
test.afterEach(() => {
  globalThis.fetch = realFetch;
});

test('new student: must finish the form, prefilled with what Google gave us', async () => {
  mockFetch([200, { role: 'student' }], [200, { user: { grade: '', name: '' } }]);
  expect(await completeGoogleLogin(identity)).toEqual({
    email: 'new@example.com', name: 'Asha Rao', mobile: '', parentName: '', school: '', city: '',
  });
});

test('student with a finished profile goes straight in', async () => {
  mockFetch([200, { role: 'student' }], [200, { user: { grade: '10' } }]);
  expect(await completeGoogleLogin(identity)).toBeNull();
});

test('counsellors are not asked for student details', async () => {
  mockFetch([200, { role: 'counsellor' }], [500, {}]);
  expect(await completeGoogleLogin(identity)).toBeNull();
});

test('a profile that cannot be read is an error, never treated as a new user', async () => {
  mockFetch([200, { role: 'student' }], [500, {}]);
  await expect(completeGoogleLogin(identity)).rejects.toThrow(/could not load your profile/);
});

test('a rejected login shows the server message', async () => {
  mockFetch([429, { error: 'Too many sign-in attempts.' }], [200, {}]);
  await expect(completeGoogleLogin(identity)).rejects.toThrow('Too many sign-in attempts.');
});

test('closing the Google window is not an error; other failures read plainly', () => {
  expect(googleErrorMessage({ code: 'auth/popup-closed-by-user' })).toBeNull();
  expect(googleErrorMessage({ code: 'auth/popup-blocked' })).toMatch(/Allow pop-ups/);
  expect(googleErrorMessage({ code: 'auth/internal-error', message: 'Firebase: x' })).not.toMatch(/Firebase/);
  expect(googleErrorMessage(new Error('We could not load your profile.'))).toBe('We could not load your profile.');
});
