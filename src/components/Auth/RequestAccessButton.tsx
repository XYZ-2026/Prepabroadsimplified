'use client';

import React, { useState } from 'react';
import styles from '@/styles/components.module.css';

interface RequestAccessButtonProps {
  toolName: string;
  toolId: string;
}

export default function RequestAccessButton({ toolName, toolId }: RequestAccessButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleRequest = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/student/request-tool-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, toolName }),
      });
      
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Failed to request access:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <button className={`${styles.btn} ${styles.btnPrimary}`} disabled style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
        Request Sent ✓
      </button>
    );
  }

  return (
    <button 
      className={`${styles.btn} ${styles.btnOutline}`} 
      onClick={handleRequest}
      disabled={status === 'loading'}
    >
      {status === 'loading' ? 'Requesting...' : 'Request Access'}
    </button>
  );
}
