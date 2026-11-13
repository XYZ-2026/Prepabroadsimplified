'use client';

import React, { useCallback, useState } from 'react';
import SignInModal from './SignInModal';

interface AuthGateProps {
  /** Server-resolved: is there a valid session? When true the gate does nothing. */
  signedIn: boolean;
  /**
   * `marked`: only links carrying `data-auth-gate` are locked; after sign-in the user goes to that link.
   * `actions`: every link that leaves the page (anything but an in-page `#hash`) is locked;
   *            after sign-in the user returns to the current page.
   */
  mode: 'marked' | 'actions';
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Wraps server-rendered content and intercepts clicks in the capture phase, so the content
 * itself needs no changes. Signed-out clicks on locked links open the sign-in popup instead.
 */
export default function AuthGate({ signedIn, mode, title, subtitle, children }: AuthGateProps) {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const close = useCallback(() => setRedirectTo(null), []);

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (signedIn) return;
    const link = (e.target as HTMLElement).closest('a');
    if (!link || !e.currentTarget.contains(link)) return;

    const raw = link.getAttribute('href') || '';
    let target: string;
    if (mode === 'marked') {
      if (!link.hasAttribute('data-auth-gate')) return;
      target = raw;
    } else {
      if (raw.startsWith('#')) return; // in-page navigation stays free
      target = window.location.pathname + window.location.search;
    }

    e.preventDefault();
    e.stopPropagation();
    setRedirectTo(target);
  };

  return (
    <div onClickCapture={onClickCapture} style={{ display: 'contents' }}>
      {children}
      <SignInModal open={redirectTo !== null} onClose={close} redirectTo={redirectTo || '/'} title={title} subtitle={subtitle} />
    </div>
  );
}
