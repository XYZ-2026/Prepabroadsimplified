'use client';

// Sign-in and password reset for the sign-up popup. Uses the same login flow as the /auth page:
// Firebase first (so passwords changed through a reset email work), then the server session.
import React, { useRef, useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth as clientAuth } from '@/lib/firebase-auth';
import {
  Divider,
  Field,
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PopupSignInProps {
  redirectTo: string;
  initialEmail?: string;
  onSwitchToSignUp: () => void;
  /** A new Google user signed in here: send them to the short form to finish (parent consent included). */
  onGoogleNeedsDetails: (prefill: GooglePrefill) => void;
}

export default function PopupSignIn({ redirectTo, initialEmail = '', onSwitchToSignUp, onGoogleNeedsDetails }: PopupSignInProps) {
  const [mode, setMode] = useState<'signin' | 'forgot'>('signin');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const start = () => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(true);
    setFormError('');
    setMessage('');
    return true;
  };
  const finish = () => {
    busyRef.current = false;
    setBusy(false);
  };
  const offlineOr = (err: unknown, fallback: string) =>
    typeof navigator !== 'undefined' && navigator.onLine === false
      ? 'You seem to be offline. Check your internet connection and try again.'
      : errorMessage(err, fallback);

  const checkEmail = (value: string) => (!value ? 'Enter your email address.' : !EMAIL_RE.test(value) ? 'Check the email address.' : undefined);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const errs = { email: checkEmail(cleanEmail), password: password ? undefined : 'Enter your password.' };
    setErrors(errs);
    if (errs.email) return emailRef.current?.focus();
    if (errs.password) return passwordRef.current?.focus();
    if (!start()) return;

    try {
      let idToken: string | null = null;
      try {
        const cred = await signInWithEmailAndPassword(clientAuth, cleanEmail, password);
        idToken = await cred.user.getIdToken();
      } catch {
        // Not in Firebase (or wrong password there): the server checks its own stored password next.
      }
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, email: cleanEmail, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'That email and password do not match. Please try again.');
      }
      window.location.href = redirectTo;
    } catch (err) {
      setFormError(offlineOr(err, 'Sign-in did not work. Please try again.'));
      finish();
    }
  };

  const handleGoogle = async () => {
    if (!start()) return;
    try {
      const prefill = await continueWithGoogle();
      if (prefill) onGoogleNeedsDetails(prefill);
      else window.location.href = redirectTo;
    } catch (err) {
      setFormError(googleErrorMessage(err) ?? '');
    } finally {
      finish();
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const emailError = checkEmail(cleanEmail);
    setErrors({ email: emailError });
    if (emailError) return emailRef.current?.focus();
    if (!start()) return;
    try {
      await sendPasswordResetEmail(clientAuth, cleanEmail);
      setMessage(`If ${cleanEmail} has an account, a reset link is on its way. Check your inbox and spam folder.`);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      // Don't reveal whether an email is registered.
      if (code === 'auth/user-not-found') {
        setMessage(`If ${cleanEmail} has an account, a reset link is on its way. Check your inbox and spam folder.`);
      } else {
        setFormError(offlineOr(err, 'We could not send the reset email. Please try again.'));
      }
    } finally {
      finish();
    }
  };

  if (mode === 'forgot') {
    return (
      <div>
        <h3 className="mt-0 mb-1 text-[18px] font-bold text-ink font-dmsans">Reset your password</h3>
        <p className="mt-0 mb-4 text-[15px] leading-relaxed text-muted font-dmsans">
          Enter your account email and we&apos;ll send you a link to set a new password.
        </p>
        {formError && <FormNotice tone="error">{formError}</FormNotice>}
        {message && <FormNotice tone="success">{message}</FormNotice>}
        <form onSubmit={handleForgot} noValidate aria-label="Reset your password">
          <Field
            ref={emailRef}
            id="ps-forgot-email"
            label="Email address"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({});
            }}
            error={errors.email}
          />
          <button type="submit" disabled={busy} className={`${primaryButtonClass} mt-5`}>
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <p className="mt-4 mb-0 text-center text-[14.5px] text-muted font-dmsans">
          <button type="button" className={linkButtonClass} onClick={() => { setMode('signin'); setFormError(''); setMessage(''); }}>
            Back to sign in
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={handleGoogle} disabled={busy} className={secondaryButtonClass}>
        <GoogleIcon />
        Continue with Google
      </button>
      <Divider label="or sign in with email" />

      {formError && <FormNotice tone="error">{formError}</FormNotice>}

      <form onSubmit={handleSignIn} noValidate aria-label="Sign in">
        <div className="grid gap-4">
          <Field
            ref={emailRef}
            id="ps-email"
            label="Email address"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((x) => ({ ...x, email: undefined }));
            }}
            error={errors.email}
          />
          <PasswordField
            ref={passwordRef}
            id="ps-password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((x) => ({ ...x, password: undefined }));
            }}
            error={errors.password}
          />
        </div>
        <div className="mt-2 text-right text-[14px]">
          <button type="button" className={linkButtonClass} onClick={() => { setMode('forgot'); setFormError(''); setErrors({}); }}>
            Forgot password?
          </button>
        </div>
        <button type="submit" disabled={busy} className={`${primaryButtonClass} mt-4`}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 mb-0 text-center text-[14.5px] text-muted font-dmsans">
        New to CLARVO?{' '}
        <button type="button" className={linkButtonClass} onClick={onSwitchToSignUp}>
          Create a free account
        </button>
      </p>
    </div>
  );
}
