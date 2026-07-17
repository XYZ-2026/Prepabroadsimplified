import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';
import styles from '@/styles/components.module.css';
import RequestAccessButton from './RequestAccessButton';

interface ToolLockedProps {
  toolName: string;
  toolId: string;
}

export default function ToolLocked({ toolName, toolId }: ToolLockedProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <Lock className="w-10 h-10 text-red-600" />
      </div>
      
      <h1 style={{
        fontSize: '32px',
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: '16px',
        fontFamily: 'var(--font-display)'
      }}>
        Access Restricted
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#64748b',
        maxWidth: '500px',
        lineHeight: '1.6',
        marginBottom: '32px'
      }}>
        Your access to the <strong>{toolName}</strong> has been locked by the administrator. 
        If you believe this is an error or would like to request access, please use the button below.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/dashboard" className={`${styles.btn} ${styles.btnPrimary}`}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Link>
        <RequestAccessButton toolId={toolId} toolName={toolName} />
      </div>
    </div>
  );
}
