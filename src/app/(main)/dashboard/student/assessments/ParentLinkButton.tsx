'use client';

import React, { useState } from 'react';
import componentsStyles from '@/styles/components.module.css';

export default function ParentLinkButton({ resultId }: { resultId: string }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/parent-assessment/generate-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId })
      });
      const data = await res.json();
      if (data.success && data.link) {
        await navigator.clipboard.writeText(data.link);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        alert("Failed to generate link.");
      }
    } catch (err) {
      alert("Error generating link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${componentsStyles.btn} ${componentsStyles.btnPrimary}`}
      style={{ width: '100%', textAlign: 'center', justifyContent: 'center', marginTop: '8px', backgroundColor: copied ? '#10b981' : undefined }}
      disabled={loading}
    >
      {loading ? 'Generating...' : copied ? 'Link Copied!' : 'Copy Parent Link'}
    </button>
  );
}
