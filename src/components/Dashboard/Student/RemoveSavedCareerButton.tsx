'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import styles from '@/styles/student-workspace.module.css';

export default function RemoveSavedCareerButton({ careerId, careerName }: { careerId: string; careerName: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const remove = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/student/saved-careers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careerId, saved: false }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Could not remove this career.');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove this career.');
      setBusy(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnOutline}`}
        onClick={remove}
        disabled={busy}
        aria-label={`Remove ${careerName} from saved careers`}
      >
        <Bookmark size={16} fill="currentColor" /> {busy ? 'Removing…' : 'Saved'}
      </button>
      {error && <span className={styles.saveErr} style={{ fontSize: 12 }} role="alert">{error}</span>}
    </div>
  );
}
