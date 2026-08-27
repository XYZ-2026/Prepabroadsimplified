'use client';

import React, { useState } from 'react';

export default function OverrideLockButton({ resultId, onOverrideSuccess }: { resultId: string, onOverrideSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleOverride = async () => {
    const reason = prompt("Enter reason for overriding the parent lock:");
    if (!reason) return;

    setLoading(true);
    try {
      const res = await fetch('/api/counsellor/override-parent-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId, reason })
      });
      const data = await res.json();
      if (data.success) {
        alert("Report unlocked successfully.");
        onOverrideSuccess();
      } else {
        alert("Failed to unlock report: " + data.error);
      }
    } catch (err) {
      alert("Error unlocking report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleOverride}
      disabled={loading}
      style={{
        padding: '10px 16px',
        background: '#fff',
        border: '1px solid #e2e8f0',
        color: '#64748b',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: loading ? 'default' : 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      {loading ? 'Unlocking...' : 'Override Lock 🔓'}
    </button>
  );
}
