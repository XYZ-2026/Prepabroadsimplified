'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSessionUser, dashboardHomeFor } from '@/components/providers/SessionProvider';
import { clientLogout } from '@/lib/client-logout';

/** Signed-in avatar with a dropdown. Renders nothing for guests. */
export default function UserAvatarMenu({ align = 'right' }: { align?: 'left' | 'right' }) {
  const user = useSessionUser();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const initial = (user.name || user.email || 'U').trim().charAt(0).toUpperCase();
  const displayName = user.name || user.email.split('@')[0] || 'Account';

  const items: { label: string; href: string }[] = [
    { label: 'Dashboard', href: dashboardHomeFor(user.role) },
    ...(user.role === 'student'
      ? [
          { label: 'My Profile', href: '/dashboard/student/profile' },
          { label: 'My Assessments', href: '/dashboard/student/assessments' },
          { label: 'Settings', href: '/dashboard/student/settings' },
        ]
      : []),
  ];

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const els = Array.from(wrapRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') || []);
    if (!els.length) return;
    const idx = els.indexOf(document.activeElement as HTMLElement);
    const next = e.key === 'ArrowDown' ? (idx + 1) % els.length : (idx - 1 + els.length) % els.length;
    els[next]?.focus();
  };

  const hover = (on: boolean) => (e: React.SyntheticEvent<HTMLElement>) => {
    e.currentTarget.style.background = on ? '#f1f5f9' : 'transparent';
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${displayName}`}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid #dbeafe',
          background: '#2563EB',
          color: '#fff',
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          onKeyDown={onMenuKeyDown}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            [align]: 0,
            minWidth: 230,
            maxWidth: 'min(280px, calc(100vw - 24px))',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            boxShadow: '0 12px 32px rgba(15,23,42,0.14)',
            padding: 8,
            zIndex: 100,
            textAlign: 'left',
          }}
        >
          <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '11px 12px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#334155', textDecoration: 'none' }}
              onMouseEnter={hover(true)}
              onMouseLeave={hover(false)}
              onFocus={hover(true)}
              onBlur={hover(false)}
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            role="menuitem"
            onClick={() => clientLogout('/')}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '11px 12px',
              marginTop: 4,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#b91c1c',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={hover(true)}
            onMouseLeave={hover(false)}
            onFocus={hover(true)}
            onBlur={hover(false)}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
