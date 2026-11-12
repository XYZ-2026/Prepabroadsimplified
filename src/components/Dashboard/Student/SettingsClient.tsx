'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/student-workspace.module.css';
import { clientLogout } from '@/lib/client-logout';
import type { Preferences, PreferenceKey } from '@/lib/user-preferences';

interface Props {
  name: string;
  email: string;
  signInMethod: 'password' | 'google';
  initialPreferences: Preferences;
  deletionRequestedAt?: string;
  supportEmail: string;
}

const PREF_ROWS: { key: PreferenceKey; label: string; desc: string }[] = [
  { key: 'emailReportReady', label: 'Report ready', desc: 'Email me when my assessment report is ready to view.' },
  { key: 'emailCounsellorUpdates', label: 'Counsellor updates', desc: 'Email me about notes, sessions and messages from my counsellor.' },
  { key: 'emailTipsOffers', label: 'Tips and offers', desc: 'Occasional emails about study-abroad tips, webinars and CLARVO offers. Off unless you turn it on.' },
  { key: 'whatsappConsent', label: 'WhatsApp contact', desc: 'Allow the CLARVO team to contact me on WhatsApp about my guidance.' },
];

function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={styles.switch}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    />
  );
}

export default function SettingsClient({ name, email, signInMethod, initialPreferences, deletionRequestedAt, supportEmail }: Props) {
  // ── Notifications ──
  const [prefs, setPrefs] = useState<Preferences>(initialPreferences);
  const [prefMsg, setPrefMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const updatePref = async (key: PreferenceKey, value: boolean) => {
    const previous = prefs[key];
    setPrefs((p) => ({ ...p, [key]: value }));
    setPrefMsg(null);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Could not save.');
      setPrefMsg({ ok: true, text: 'Preference saved.' });
    } catch (err) {
      setPrefs((p) => ({ ...p, [key]: previous }));
      setPrefMsg({ ok: false, text: err instanceof Error ? err.message : 'Could not save.' });
    }
  };

  // ── Portfolio visibility ──
  const [portfolio, setPortfolio] = useState<any | null | undefined>(undefined); // undefined = loading
  const [portfolioErr, setPortfolioErr] = useState('');
  const [portfolioBusy, setPortfolioBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch('/api/portfolio')
      .then(async (res) => {
        if (!res.ok) throw new Error('unavailable');
        const json = await res.json();
        if (mounted) setPortfolio(json.portfolio || null);
      })
      .catch(() => {
        if (mounted) {
          setPortfolio(null);
          setPortfolioErr('Portfolio settings are unavailable right now.');
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const togglePortfolio = async (published: boolean) => {
    if (!portfolio) return;
    setPortfolioBusy(true);
    setPortfolioErr('');
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...portfolio, published }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not update your portfolio.');
      setPortfolio(json.portfolio);
    } catch (err) {
      setPortfolioErr(err instanceof Error ? err.message : 'Could not update your portfolio.');
    } finally {
      setPortfolioBusy(false);
    }
  };

  // ── Change password ──
  const [pwOpen, setPwOpen] = useState(false);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwBusy(true);
    setPwMsg(null);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: curPw, newPassword: newPw }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Could not change your password.');
      setPwMsg({ ok: true, text: 'Password updated. Use your new password next time you sign in.' });
      setCurPw('');
      setNewPw('');
    } catch (err) {
      setPwMsg({ ok: false, text: err instanceof Error ? err.message : 'Could not change your password.' });
    } finally {
      setPwBusy(false);
    }
  };

  // ── Deletion request ──
  const [delStage, setDelStage] = useState<'idle' | 'confirm' | 'sent'>(deletionRequestedAt ? 'sent' : 'idle');
  const [delReason, setDelReason] = useState('');
  const [delBusy, setDelBusy] = useState(false);
  const [delErr, setDelErr] = useState('');

  const requestDeletion = async () => {
    setDelBusy(true);
    setDelErr('');
    try {
      const res = await fetch('/api/user/delete-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: delReason }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Could not send your request.');
      setDelStage('sent');
    } catch (err) {
      setDelErr(err instanceof Error ? err.message : 'Could not send your request.');
    } finally {
      setDelBusy(false);
    }
  };

  return (
    <div>
      {/* Account */}
      <section className={styles.panel} aria-labelledby="st-account">
        <h2 id="st-account" className={styles.panelTitle}>Account</h2>
        <p className={styles.panelSub}>Your sign-in details. Change your name, phone or school from your profile.</p>
        <div className={styles.kv}><span className={styles.kvLabel}>Name</span><span className={styles.kvValue}>{name || '—'}</span></div>
        <div className={styles.kv}><span className={styles.kvLabel}>Email</span><span className={styles.kvValue}>{email}</span></div>
        <div className={styles.kv}><span className={styles.kvLabel}>Sign-in method</span><span className={styles.kvValue}>{signInMethod === 'google' ? 'Google' : 'Email and password'}</span></div>

        <div className={styles.actions}>
          <Link href="/dashboard/student/profile/edit" className={`${styles.btn} ${styles.btnOutline}`}>Edit profile</Link>
          {signInMethod === 'password' && (
            <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setPwOpen((o) => !o)} aria-expanded={pwOpen}>
              Change password
            </button>
          )}
          <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => clientLogout('/')}>Sign out</button>
        </div>

        {signInMethod === 'google' && (
          <p className={styles.hint} style={{ marginTop: 10 }}>Your password is managed by Google.</p>
        )}

        {pwOpen && signInMethod === 'password' && (
          <form onSubmit={changePassword} className={styles.form} style={{ marginTop: 16 }}>
            {pwMsg && (
              <div className={`${styles.notice} ${pwMsg.ok ? styles.noticeOk : styles.noticeError}`} role={pwMsg.ok ? 'status' : 'alert'} style={{ marginBottom: 0 }}>
                {pwMsg.text}
              </div>
            )}
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="cur-pw">Current password</label>
                <input id="cur-pw" type="password" autoComplete="current-password" className={styles.input} value={curPw} onChange={(e) => setCurPw(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label htmlFor="new-pw">New password</label>
                <input id="new-pw" type="password" autoComplete="new-password" minLength={8} className={styles.input} value={newPw} onChange={(e) => setNewPw(e.target.value)} required />
                <span className={styles.hint}>At least 8 characters.</span>
              </div>
            </div>
            <div className={styles.actions} style={{ marginTop: 0 }}>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={pwBusy}>{pwBusy ? 'Updating…' : 'Update password'}</button>
            </div>
          </form>
        )}
      </section>

      {/* Notifications */}
      <section className={styles.panel} aria-labelledby="st-notify">
        <h2 id="st-notify" className={styles.panelTitle}>Notifications &amp; contact</h2>
        <p className={styles.panelSub}>Choose how CLARVO may reach you.</p>
        {prefMsg && (
          <div className={`${styles.notice} ${prefMsg.ok ? styles.noticeOk : styles.noticeError}`} role={prefMsg.ok ? 'status' : 'alert'}>{prefMsg.text}</div>
        )}
        {PREF_ROWS.map((row) => (
          <div key={row.key} className={styles.toggleRow}>
            <div className={styles.toggleText}>
              <div className={styles.toggleLabel}>{row.label}</div>
              <div className={styles.toggleDesc}>{row.desc}</div>
            </div>
            <Switch checked={prefs[row.key]} onChange={(v) => updatePref(row.key, v)} label={row.label} />
          </div>
        ))}
      </section>

      {/* Privacy */}
      <section className={styles.panel} aria-labelledby="st-privacy">
        <h2 id="st-privacy" className={styles.panelTitle}>Privacy</h2>
        <p className={styles.panelSub}>Control what other people can see.</p>
        {portfolioErr && <div className={`${styles.notice} ${styles.noticeError}`} role="alert">{portfolioErr}</div>}
        <div className={styles.toggleRow}>
          <div className={styles.toggleText}>
            <div className={styles.toggleLabel}>Public portfolio</div>
            <div className={styles.toggleDesc}>
              {portfolio === undefined
                ? 'Checking your portfolio…'
                : portfolio
                ? portfolio.published
                  ? `Anyone with your link can view it: /${portfolio.username}`
                  : 'Your portfolio is hidden from the public.'
                : 'You have not created a portfolio yet.'}
            </div>
          </div>
          {portfolio ? (
            <Switch checked={!!portfolio.published} onChange={togglePortfolio} label="Public portfolio" disabled={portfolioBusy} />
          ) : portfolio === null && !portfolioErr ? (
            <Link href="/dashboard/student/extracurriculars" className={`${styles.btn} ${styles.btnOutline}`}>Create</Link>
          ) : null}
        </div>
        <div className={styles.links}>
          <Link href="/privacy" className={styles.linkRow}>Privacy Policy <span aria-hidden="true">→</span></Link>
          <Link href="/terms" className={styles.linkRow}>Terms of Use <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      {/* Your data */}
      <section className={styles.panel} aria-labelledby="st-data">
        <h2 id="st-data" className={styles.panelTitle}>Your data</h2>
        <p className={styles.panelSub}>Download a copy of your profile and essays, or ask us to delete your account.</p>
        <div className={styles.actions} style={{ marginTop: 0 }}>
          <a href="/api/user/export" download className={`${styles.btn} ${styles.btnOutline}`}>Download my data</a>
        </div>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
          <div className={styles.toggleLabel}>Delete my account</div>
          {delStage === 'sent' ? (
            <div className={`${styles.notice} ${styles.noticeInfo}`} style={{ marginTop: 10, marginBottom: 0 }} role="status">
              Your deletion request has been received. Our team will verify it with you and confirm by email. Your reports stay available until then.
            </div>
          ) : delStage === 'confirm' ? (
            <div style={{ marginTop: 10 }} className={styles.form}>
              <p className={styles.toggleDesc} style={{ margin: 0 }}>
                This sends a request to the CLARVO team. We verify it with you first, so nothing is deleted by accident. Deleting your account also removes your assessment reports.
              </p>
              <div className={styles.field}>
                <label htmlFor="del-reason">Reason (optional)</label>
                <textarea id="del-reason" className={styles.textarea} rows={2} maxLength={500} value={delReason} onChange={(e) => setDelReason(e.target.value)} />
              </div>
              {delErr && <div className={`${styles.notice} ${styles.noticeError}`} role="alert" style={{ marginBottom: 0 }}>{delErr}</div>}
              <div className={styles.actions} style={{ marginTop: 0 }}>
                <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={requestDeletion} disabled={delBusy}>{delBusy ? 'Sending…' : 'Send deletion request'}</button>
                <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setDelStage('idle')} disabled={delBusy}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.toggleDesc}>Ask us to permanently delete your account and data.</p>
              <div className={styles.actions} style={{ marginTop: 8 }}>
                <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setDelStage('confirm')}>Request account deletion</button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Help */}
      <section className={styles.panel} aria-labelledby="st-help">
        <h2 id="st-help" className={styles.panelTitle}>Help</h2>
        <div className={styles.links}>
          <a href={`mailto:${supportEmail}`} className={styles.linkRow}>Contact support — {supportEmail} <span aria-hidden="true">→</span></a>
          <Link href="/book-a-demo?from=dashboard:settings" className={styles.linkRow}>Book a consultation <span aria-hidden="true">→</span></Link>
          <Link href="/about-us" className={styles.linkRow}>About CLARVO <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
