'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Lock, X } from 'lucide-react';
import AuthForm from '@/components/Auth/AuthForm';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  /** Path to return to after sign-in or registration (same site only). */
  redirectTo: string;
  title?: string;
  subtitle?: string;
}

/**
 * Sign-in popup built on the same AuthForm as /auth (same Firebase + session cookie flow).
 * After success the browser does a full navigation to `redirectTo`, so server pages
 * re-render with the new session.
 */
export default function SignInModal({
  open,
  onClose,
  redirectTo,
  title = 'Sign in to continue',
  subtitle = 'Create a free account or sign in to unlock full admitted-student profiles.',
}: SignInModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  // The portal can only render in the browser; wait for mount so server and client HTML match
  // even when the modal starts open (e.g. a locked profile opened from a shared link).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const prevFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [open, mounted, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '5vh 16px',
        overflowY: 'auto',
        background: 'rgba(8, 15, 28, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation: 'clarvoFadeIn 0.18s ease both',
      }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes clarvoFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes clarvoRiseIn { from { opacity: 0; transform: translateY(14px) scale(.98) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) { [data-signin-dialog], [data-signin-dialog] * { animation: none !important } }
      `}</style>
      <div
        ref={dialogRef}
        data-signin-dialog=""
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-modal-title"
        tabIndex={-1}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 500,
          outline: 'none',
          animation: 'clarvoRiseIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '18px 20px',
            marginBottom: 10,
            borderRadius: 16,
            background: '#0B1D45',
            color: '#fff',
          }}
        >
          <span
            style={{
              flexShrink: 0,
              width: 36,
              height: 36,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(143, 177, 255, 0.18)',
              color: '#8FB1FF',
            }}
          >
            <Lock size={18} aria-hidden="true" />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id="signin-modal-title" style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
              {title}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13.5, lineHeight: 1.45, color: 'rgba(255,255,255,0.75)' }}>{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign-in"
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              border: 0,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#667085', background: '#fff', borderRadius: 18 }}>Loading…</div>}>
          <AuthForm defaultTab="login" redirectTo={redirectTo} />
        </Suspense>
      </div>
    </div>,
    document.body,
  );
}
