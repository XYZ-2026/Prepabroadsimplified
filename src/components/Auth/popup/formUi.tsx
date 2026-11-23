'use client';

// Small building blocks shared by the sign-up popup's forms (QuickSignUp, PopupSignIn).
import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export const inputClass = (invalid: boolean) =>
  [
    'box-border block w-full h-12 px-3.5 rounded-xl border border-solid bg-white font-dmsans text-[16px] text-ink',
    'placeholder:text-[#6B7185] outline-none transition-[border-color,box-shadow] duration-150',
    'focus:border-[#1258DE] focus:shadow-[0_0_0_3px_rgba(18,88,222,0.22)]',
    'read-only:bg-[#F1F4F9] read-only:text-muted',
    invalid ? 'border-[#C0362C]' : 'border-[#C9D1E2]',
  ].join(' ');

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 mb-0 flex items-start gap-1.5 text-[13.5px] leading-snug text-[#B3261E] font-dmsans">
      <AlertCircle size={15} aria-hidden="true" className="mt-px shrink-0" />
      <span>{message}</span>
    </p>
  );
}

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

/** Label + input + hint + error, wired together for screen readers. */
export const Field = React.forwardRef<HTMLInputElement, FieldProps>(function Field(
  { id, label, error, hint, className, ...input },
  ref,
) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={`min-w-0 ${className ?? ''}`}>
      <label htmlFor={id} className="block mb-1.5 text-[14.5px] font-semibold text-ink font-dmsans">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={inputClass(Boolean(error))}
        {...input}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 mb-0 text-[13px] text-muted font-dmsans">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
});

type PasswordFieldProps = Omit<FieldProps, 'type'>;

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { id, label, error, hint, className, ...input },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={`min-w-0 ${className ?? ''}`}>
      <label htmlFor={id} className="block mb-1.5 text-[14.5px] font-semibold text-ink font-dmsans">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={visible ? 'text' : 'password'}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={`${inputClass(Boolean(error))} pr-12`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute right-0.5 top-0.5 w-11 h-11 flex items-center justify-center rounded-[10px] border-0 bg-transparent text-muted cursor-pointer hover:text-ink focus-visible:outline-2 focus-visible:outline-[#1258DE]"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 mb-0 text-[13px] text-muted font-dmsans">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
});

/** Form-level message (server errors, confirmations). Announced to screen readers when it appears. */
export function FormNotice({
  tone,
  children,
}: {
  tone: 'error' | 'success';
  children: React.ReactNode;
}) {
  const styles =
    tone === 'error'
      ? 'bg-[#FDECEA] border-[#F2B8B5] text-[#8C1D18]'
      : 'bg-[#E7F6EC] border-[#A8DDB9] text-[#14532D]';
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`mb-4 px-3.5 py-3 rounded-xl border border-solid text-[14.5px] leading-snug font-dmsans ${styles}`}
    >
      {children}
    </div>
  );
}

export const primaryButtonClass =
  'box-border w-full h-12 px-5 rounded-xl border-0 bg-[#1258DE] text-white text-[16px] font-bold font-dmsans cursor-pointer transition-colors duration-150 hover:bg-[#0E48B8] disabled:opacity-70 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1258DE]';

export const secondaryButtonClass =
  'box-border w-full h-12 px-5 rounded-xl border border-solid border-[#C9D1E2] bg-white text-ink text-[15.5px] font-semibold font-dmsans cursor-pointer flex items-center justify-center gap-2.5 transition-colors duration-150 hover:bg-[#F5F7FB] disabled:opacity-70 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1258DE]';

export const linkButtonClass =
  'p-0 border-0 bg-transparent font-dmsans font-semibold text-[#1258DE] underline underline-offset-2 cursor-pointer hover:text-[#0E48B8] focus-visible:outline-2 focus-visible:outline-[#1258DE] [font-size:inherit]';

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4" aria-hidden="true">
      <span className="flex-1 h-px bg-line" />
      <span className="text-[13px] text-muted font-dmsans">{label}</span>
      <span className="flex-1 h-px bg-line" />
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

/** Accept only same-site paths ("/x"), never "//host" or absolute URLs. */
export function safeRedirect(path?: string): string {
  return path && path.startsWith('/') && !path.startsWith('//') ? path : '/dashboard/student/profile';
}

/** Readable message from an unknown thrown value. */
export function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}
