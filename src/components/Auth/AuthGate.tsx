'use client';

import React, { useCallback, useState } from 'react';
import SignInModal from './SignInModal';
import { PORTFOLIO_BUILDER_URL } from '@/components/portfolio/portfolioTypes';

interface AuthGateProps {
  /** Server-resolved: is there a valid session? When true the gate does nothing. */
  signedIn: boolean;
  /**
   * `marked`: only links carrying `data-auth-gate` are locked; after sign-in the user goes to that link.
   * `actions`: every link that leaves the page (anything but an in-page `#hash`) is locked;
   *            after sign-in the user returns to the current page, except dashboard links,
   *            which take them where they clicked.
   */
  mode: 'marked' | 'actions';
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

interface Pending {
  target: string;
  /** The click was "build my own portfolio": open on Register with portfolio wording. */
  build: boolean;
}

const builderPath = PORTFOLIO_BUILDER_URL.split('#')[0];

/**
 * Wraps server-rendered content and intercepts clicks in the capture phase, so the content
 * itself needs no changes. Signed-out clicks on locked links open the sign-in popup instead.
 */
export default function AuthGate({ signedIn, mode, title, subtitle, children }: AuthGateProps) {
  const [pending, setPending] = useState<Pending | null>(null);
  const close = useCallback(() => setPending(null), []);

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
      // Dashboard links (e.g. "Build your portfolio") mean "take me there": go there after sign-in.
      // Anything else returns the visitor to the page they were on.
      target = raw.startsWith('/dashboard/') ? raw : window.location.pathname + window.location.search;
    }

    e.preventDefault();
    e.stopPropagation();
    setPending({ target, build: target.split('#')[0] === builderPath });
  };

  const build = pending?.build ?? false;

  return (
    <div onClickCapture={onClickCapture} style={{ display: 'contents' }}>
      {children}
      <SignInModal
        open={pending !== null}
        onClose={close}
        redirectTo={pending?.target || '/'}
        defaultTab={build ? 'register' : 'login'}
        title={build ? 'Create your free portfolio' : title}
        subtitle={
          build
            ? 'Sign up free and we will take you straight to the portfolio builder: your story, activities and resume on one shareable link.'
            : subtitle
        }
      />
    </div>
  );
}
