'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/student-workspace.module.css';
import type { EssayRecord } from '@/lib/essay-service';

const TYPES = ['SOP', 'Personal Essay', 'Supplemental Essay', 'Scholarship Essay', 'Other'];
const MAX_CHARS = 20000;

type SaveState = 'saved' | 'dirty' | 'saving' | 'error';

const wordCount = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

export default function EssayEditor({ essay }: { essay: EssayRecord }) {
  const router = useRouter();
  const [title, setTitle] = useState(essay.title);
  const [type, setType] = useState<string>(essay.type);
  const [university, setUniversity] = useState(essay.targetUniversity);
  const [prompt, setPrompt] = useState(essay.prompt);
  const [content, setContent] = useState(essay.content);
  const [status, setStatus] = useState<string>(essay.status);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const latest = useRef({ title, type, university, prompt, content, status });
  latest.current = { title, type, university, prompt, content, status };
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const pending = useRef(false);

  const save = useCallback(async () => {
    if (inFlight.current) {
      pending.current = true;
      return;
    }
    inFlight.current = true;
    setSaveState('saving');
    try {
      const l = latest.current;
      const res = await fetch(`/api/student/essays/${essay.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: l.title,
          type: l.type,
          targetUniversity: l.university,
          prompt: l.prompt,
          content: l.content,
          status: l.status,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Could not save.');
      setError('');
      setSaveState('saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
      setSaveState('error');
    } finally {
      inFlight.current = false;
      if (pending.current) {
        pending.current = false;
        save();
      }
    }
  }, [essay.id]);

  // Debounced autosave whenever any field changes
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSaveState('dirty');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, 1200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [title, type, university, prompt, content, status, save]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (saveState === 'dirty' || saveState === 'saving' || saveState === 'error') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [saveState]);

  const remove = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/student/essays/${essay.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete the essay.');
      router.push('/dashboard/student/essays');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the essay.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const words = wordCount(content);
  const label =
    saveState === 'saving' ? 'Saving…' : saveState === 'dirty' ? 'Unsaved changes' : saveState === 'error' ? 'Not saved — retrying on next edit' : 'All changes saved';
  const labelClass = saveState === 'saved' ? styles.saveOk : saveState === 'error' ? styles.saveErr : '';

  return (
    <div className={styles.form}>
      <div className={styles.editorBar}>
        <span className={`${styles.saveState} ${labelClass}`} role="status" aria-live="polite">{label}</span>
        <div className={styles.actions} style={{ margin: 0 }}>
          <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setStatus(status === 'final' ? 'draft' : 'final')}>
            {status === 'final' ? 'Mark as draft' : 'Mark as final'}
          </button>
          {saveState === 'error' && (
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={save}>Retry save</button>
          )}
        </div>
      </div>

      {error && <div className={`${styles.notice} ${styles.noticeError}`} role="alert">{error}</div>}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="e-title">Title</label>
          <input id="e-title" className={styles.input} value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="e-type">Type</label>
          <select id="e-type" className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="e-uni">Target university</label>
        <input id="e-uni" className={styles.input} value={university} maxLength={120} onChange={(e) => setUniversity(e.target.value)} />
      </div>

      <div className={styles.field}>
        <label htmlFor="e-prompt">Essay prompt (optional)</label>
        <textarea id="e-prompt" className={styles.textarea} rows={3} value={prompt} maxLength={1000} onChange={(e) => setPrompt(e.target.value)} placeholder="Paste the question you are answering" />
      </div>

      <div className={styles.field}>
        <label htmlFor="e-content">Your essay</label>
        <textarea
          id="e-content"
          className={`${styles.textarea} ${styles.essayText}`}
          value={content}
          maxLength={MAX_CHARS}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing here…"
        />
        <div className={styles.counter}>
          <span>{words.toLocaleString('en-IN')} words</span>
          <span>{content.length.toLocaleString('en-IN')} / {MAX_CHARS.toLocaleString('en-IN')} characters</span>
        </div>
      </div>

      <div className={styles.actions}>
        {confirmDelete ? (
          <>
            <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={remove} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Yes, delete this essay'}
            </button>
            <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setConfirmDelete(false)} disabled={deleting}>Keep it</button>
          </>
        ) : (
          <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => setConfirmDelete(true)}>Delete essay</button>
        )}
      </div>
    </div>
  );
}
