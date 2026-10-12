'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import styles from '@/styles/components.module.css';
import RequestAccessButton from './RequestAccessButton';

interface ToolLockedProps {
  toolName: string;
  toolId: string;
}

export default function ToolLocked({ toolName, toolId }: ToolLockedProps) {
  const isPsychometric = toolId === 'psychometricTest' || toolName.toLowerCase().includes('psychometric');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '84px',
        height: '84px',
        borderRadius: '50%',
        backgroundColor: isPsychometric ? '#fef3c7' : '#fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: isPsychometric ? '0 10px 25px -5px rgba(245, 158, 11, 0.2)' : '0 10px 25px -5px rgba(239, 68, 68, 0.2)',
      }}>
        {isPsychometric ? (
          <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
        ) : (
          <Lock className="w-10 h-10 text-red-600" />
        )}
      </div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '9999px',
        backgroundColor: isPsychometric ? '#fffbeb' : '#fef2f2',
        border: isPsychometric ? '1px solid #fde68a' : '1px solid #fecaca',
        color: isPsychometric ? '#b45309' : '#b91c1c',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        marginBottom: '16px'
      }}>
        {isPsychometric ? '⏳ Test Access Pending Admin Approval' : '🔒 Access Restricted'}
      </div>
      
      <h1 style={{
        fontSize: '32px',
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: '16px',
        fontFamily: 'var(--font-display)',
        maxWidth: '650px',
        lineHeight: 1.25
      }}>
        {isPsychometric ? 'Your Psychometric Test is Awaiting Activation' : 'Access Restricted'}
      </h1>
      
      <p style={{
        fontSize: '15px',
        color: '#64748b',
        maxWidth: '560px',
        lineHeight: '1.65',
        marginBottom: '28px'
      }}>
        {isPsychometric
          ? 'Welcome to CLARVO! Your account has been registered successfully. To maintain diagnostic integrity and grade-tier allocation, psychometric test access is granted individually by your administrator from the admin dashboard.'
          : `Your access to the ${toolName} has been restricted by the administrator. Please request access or contact support.`}
      </p>

      {isPsychometric && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '18px 24px',
          maxWidth: '540px',
          width: '100%',
          marginBottom: '32px',
          textAlign: 'left',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Next Steps for Assessment Access:
          </div>
          <ul style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.6', margin: 0, paddingLeft: '18px' }}>
            <li>Your registration is logged and awaiting 1-click test activation by your administrator.</li>
            <li>Click <strong>&quot;Notify Administrator&quot;</strong> below to expedite your test approval.</li>
            <li>Once approved, clicking <strong>&quot;Refresh Access Status&quot;</strong> will launch your assessment.</li>
          </ul>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Access Status
        </button>

        <RequestAccessButton toolId={toolId} toolName={toolName} />

        <Link href="/dashboard" className={`${styles.btn} ${styles.btnPrimary}`} style={{ padding: '12px 20px', borderRadius: '12px' }}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
