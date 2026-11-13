'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { Clapperboard, Lock } from 'lucide-react';
import SignInModal from './SignInModal';

interface LockedProfileProps {
  redirectTo: string;
  name: string;
  college: string;
  major?: string;
  portfolioHref: string;
}

/** Placeholder shown instead of a full profile when signed out. Opens the sign-in popup on arrival. */
export default function LockedProfile({ redirectTo, name, college, major, portfolioHref }: LockedProfileProps) {
  const [open, setOpen] = useState(true);
  const close = useCallback(() => setOpen(false), []);
  const firstName = name.split(' ')[0] || name;

  return (
    <div style={{ position: 'relative', marginTop: 16 }}>
      {/* Blurred stand-in for the profile so the page reads as "there is more here" */}
      <div aria-hidden="true" style={{ filter: 'blur(6px)', opacity: 0.55, pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ height: 150, borderRadius: 20, background: 'linear-gradient(135deg,#0B1D45,#1258DE)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginTop: 16 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ height: 150, borderRadius: 16, background: '#fff', border: '1px solid #E4E7EC' }}>
              <div style={{ margin: 18, height: 12, width: '45%', borderRadius: 6, background: '#DDE3F0' }} />
              <div style={{ margin: '0 18px 10px', height: 10, width: '80%', borderRadius: 6, background: '#EEF2F7' }} />
              <div style={{ margin: '0 18px 10px', height: 10, width: '65%', borderRadius: 6, background: '#EEF2F7' }} />
              <div style={{ margin: '0 18px', height: 10, width: '72%', borderRadius: 6, background: '#EEF2F7' }} />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 48,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 440,
            margin: '0 16px',
            padding: '28px 24px',
            textAlign: 'center',
            borderRadius: 20,
            background: '#fff',
            border: '1px solid #E4E7EC',
            boxShadow: '0 24px 60px -24px rgba(18,88,222,0.35)',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              width: 44,
              height: 44,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              background: '#E6EDFF',
              color: '#1258DE',
            }}
          >
            <Lock size={20} aria-hidden="true" />
          </span>
          <h1 style={{ margin: '14px 0 4px', fontSize: 22, fontWeight: 800, color: '#080F1C', lineHeight: 1.25 }}>{name}</h1>
          <p style={{ margin: 0, fontSize: 14.5, color: '#5B6275' }}>
            Admitted to <strong style={{ color: '#080F1C' }}>{college}</strong>
            {major ? ` · ${major}` : ''}
          </p>
          <p style={{ margin: '14px 0 20px', fontSize: 14.5, lineHeight: 1.5, color: '#5B6275' }}>
            Sign in to see {firstName}&apos;s scores, activities, awards and essays.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              width: '100%',
              height: 48,
              border: 0,
              borderRadius: 999,
              cursor: 'pointer',
              background: '#1258DE',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Sign in to view profile
          </button>
          <Link
            href={portfolioHref}
            style={{
              marginTop: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: '#1258DE',
              textDecoration: 'none',
            }}
          >
            <Clapperboard size={15} aria-hidden="true" /> Or view {firstName}&apos;s portfolio
          </Link>
        </div>
      </div>

      <SignInModal
        open={open}
        onClose={close}
        redirectTo={redirectTo}
        title={`Sign in to view ${firstName}'s full profile`}
        subtitle="Scores, activities, awards and essays are available with a free CLARVO account."
      />
    </div>
  );
}
