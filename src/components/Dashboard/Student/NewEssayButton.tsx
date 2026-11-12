'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/student-workspace.module.css';

const TYPES = ['SOP', 'Personal Essay', 'Supplemental Essay', 'Scholarship Essay', 'Other'];

export default function NewEssayButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('SOP');
  const [university, setUniversity] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/student/essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, targetUniversity: university }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not create the essay.');
      router.push(`/dashboard/student/essays/${json.essay.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the essay.');
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setOpen(true)} disabled={disabled}>
        + New essay
      </button>
    );
  }

  return (
    <form onSubmit={create} className={`${styles.panel} ${styles.form}`} style={{ width: '100%', marginBottom: 0 }}>
      <h2 className={styles.panelTitle}>Start a new essay</h2>
      {error && <div className={`${styles.notice} ${styles.noticeError}`} role="alert">{error}</div>}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="essay-title">Title</label>
          <input id="essay-title" className={styles.input} value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Why Computer Science" required />
        </div>
        <div className={styles.field}>
          <label htmlFor="essay-type">Type</label>
          <select id="essay-type" className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="essay-uni">Target university (optional)</label>
        <input id="essay-uni" className={styles.input} value={university} maxLength={120} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g. University of Toronto" />
      </div>
      <div className={styles.actions} style={{ marginTop: 0 }}>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={busy}>{busy ? 'Creating…' : 'Create & start writing'}</button>
        <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setOpen(false)} disabled={busy}>Cancel</button>
      </div>
    </form>
  );
}
