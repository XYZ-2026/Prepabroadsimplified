'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { Lock, X } from 'lucide-react';
import { linkButtonClass, safeRedirect } from '@/components/Auth/popup/formUi';
import type { GooglePrefill } from '@/components/Auth/popup/googleAuth';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  /** Path to return to after sign-in or registration (same site only). */
  redirectTo: string;
  title?: string;
  subtitle?: string;
  /** Which tab opens first. Lead-gen CTAs open on Register. */
  defaultTab?: 'login' | 'register';
}

type PopupTab = 'login' | 'register';

function FormLoading() {
  return (
    <p role="status" className="m-0 py-24 text-center text-[16px] text-muted font-dmsans">
      Loading the form…
    </p>
  );
}

function FormFailed() {
  return (
    <div role="alert" className="py-16 text-center text-[16px] text-ink font-dmsans">
      <p className="m-0 mb-4">The form could not load. Check your internet connection and try again.</p>
      <button type="button" className={linkButtonClass} onClick={() => window.location.reload()}>
        Reload the page
      </button>
    </div>
  );
}

// The forms bring in Firebase, so they are only downloaded when the popup opens.
const QuickSignUp = dynamic(() => import('@/components/Auth/popup/QuickSignUp').catch(() => ({ default: FormFailed })), { ssr: false, loading: FormLoading });
const PopupSignIn = dynamic(() => import('@/components/Auth/popup/PopupSignIn').catch(() => ({ default: FormFailed })), { ssr: false, loading: FormLoading });

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Sign-up / sign-in popup. It has its own short sign-up form (QuickSignUp); the /auth page keeps
 * the full 4-step wizard. Both use the same server routes and session cookie. After success the
 * browser does a full navigation to `redirectTo`, so server pages re-render with the new session.
 *
 * Layout: the panel is never taller than the screen. The header stays put and the form scrolls
 * inside the panel, so nothing can run off the page on a phone or a short laptop screen.
 */
export default function SignInModal({
  open,
  onClose,
  redirectTo,
  title = 'Sign in to continue',
  subtitle = 'Create a free account or sign in to unlock full admitted-student profiles.',
  defaultTab = 'login',
}: SignInModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<PopupTab>(defaultTab);
  const [signInEmail, setSignInEmail] = useState('');
  const [googlePrefill, setGooglePrefill] = useState<GooglePrefill | null>(null);
  // The portal can only render in the browser; wait for mount so server and client HTML match
  // even when the modal starts open (e.g. a locked profile opened from a shared link).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Each time the popup opens, start on the tab the caller asked for.
  useEffect(() => {
    if (open) setTab(defaultTab);
  }, [open, defaultTab]);

  useEffect(() => {
    if (!open || !mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const prevFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Keep keyboard focus inside the popup while it is open.
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [open, mounted, onClose]);

  const switchToSignIn = useCallback((email: string) => {
    setSignInEmail(email);
    setTab('login');
  }, []);
  const switchToSignUp = useCallback(() => setTab('register'), []);
  const finishGoogleSignUp = useCallback((prefill: GooglePrefill) => {
    setGooglePrefill(prefill);
    setTab('register');
  }, []);

  if (!open || !mounted) return null;

  const destination = safeRedirect(redirectTo);
  const tabClass = (active: boolean) =>
    `flex-1 h-11 rounded-[10px] border-0 font-dmsans text-[15px] font-semibold cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1258DE] ${
      active ? 'bg-white text-ink shadow-[0_1px_3px_rgba(18,19,28,0.12)]' : 'bg-transparent text-muted hover:text-ink'
    }`;

  return createPortal(
    <div
      data-signin-overlay=""
      className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center sm:p-4 bg-[rgba(8,15,28,0.55)] backdrop-blur-[6px]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        [data-signin-overlay] { animation: clarvoFadeIn 0.18s ease-out both }
        [data-signin-dialog] { animation: clarvoRiseIn 0.26s cubic-bezier(0.22, 1, 0.36, 1) both }
        @keyframes clarvoFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes clarvoRiseIn { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) {
          [data-signin-overlay], [data-signin-dialog], [data-signin-dialog] * { animation: none !important; transition: none !important }
        }
      `}</style>
      <div
        ref={dialogRef}
        data-signin-dialog=""
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-modal-title"
        aria-describedby="signin-modal-subtitle"
        tabIndex={-1}
        className="relative flex flex-col w-full sm:max-w-[560px] max-h-[94dvh] sm:max-h-[calc(100dvh-32px)] bg-white rounded-t-[20px] sm:rounded-[20px] overflow-hidden outline-none shadow-[0_30px_80px_-20px_rgba(8,15,28,0.45)]"
      >
        {/* Header: stays visible while the form scrolls */}
        <div className="shrink-0 flex items-start gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-4 bg-[#0B1D45] text-white">
          <span
            aria-hidden="true"
            className="hidden min-[400px]:flex shrink-0 w-9 h-9 rounded-[10px] items-center justify-center bg-[rgba(143,177,255,0.18)] text-[#8FB1FF]"
          >
            <Lock size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <h2 id="signin-modal-title" className="m-0 text-[17px] sm:text-[18px] font-bold leading-snug text-white font-dmsans">
              {title}
            </h2>
            <p id="signin-modal-subtitle" className="mt-1 mb-0 text-[14px] leading-snug text-white/80 font-dmsans">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 -mr-1 -mt-1 w-11 h-11 rounded-full border-0 flex items-center justify-center cursor-pointer bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable body */}
        <div data-signin-body="" className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 pt-4 pb-6">
          <div className="flex gap-1 p-1 mb-5 rounded-xl bg-paper" role="group" aria-label="Choose an option">
            <button type="button" aria-pressed={tab === 'register'} onClick={() => setTab('register')} className={tabClass(tab === 'register')}>
              Create account
            </button>
            <button type="button" aria-pressed={tab === 'login'} onClick={() => setTab('login')} className={tabClass(tab === 'login')}>
              Sign in
            </button>
          </div>

          {tab === 'register' ? (
            <QuickSignUp redirectTo={destination} onSwitchToSignIn={switchToSignIn} initialGoogle={googlePrefill} />
          ) : (
            <PopupSignIn
              key={signInEmail}
              redirectTo={destination}
              initialEmail={signInEmail}
              onSwitchToSignUp={switchToSignUp}
              onGoogleNeedsDetails={finishGoogleSignUp}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
