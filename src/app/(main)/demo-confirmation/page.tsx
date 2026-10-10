'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DemoConfirmationPage() {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = sessionStorage.getItem('clarvo_demo_name');
      if (storedName) {
        setUserName(storedName);
      }
    }
  }, []);

  return (
    <div style={{ minHeight: '80vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ maxWidth: '640px', width: '100%', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E4E7EC', padding: '48px 36px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
        
        {/* Success Icon */}
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E8F0FF', color: '#2563EB', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', border: '2px solid #BFDBFE' }}>
          ✓
        </div>

        <div style={{ display: 'inline-block', background: '#E8F0FF', color: '#2563EB', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Enquiry Received
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#080F1C', letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
          {userName ? `Thank You, ${userName}!` : 'Thank You!'}
        </h1>

        <p style={{ fontSize: '16px', color: '#344054', lineHeight: '1.6', margin: '0 0 28px 0' }}>
          Your consultation enquiry has been recorded. Our educational guidance team will contact you shortly to understand your child's learning journey and explain how CLARVO can help unlock their potential.
        </p>

        {/* What to expect card */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E4E7EC', borderRadius: '16px', padding: '20px', textAlign: 'left', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#080F1C', margin: '0 0 12px 0' }}>
            What happens next?
          </h2>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#667085', lineHeight: '1.7' }}>
            <li>A CLARVO academic advisor will reach out to the phone number and email provided.</li>
            <li>We will review your child's current grade (Grades 7–12), academic goals, and stream questions.</li>
            <li>We will walk you through our 30-module psychometric diagnostic framework and sample reports.</li>
          </ul>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <Link
            href="/sample-reports"
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#2563EB',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            }}
          >
            Explore Sample Reports
          </Link>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: '#FFFFFF',
              color: '#344054',
              border: '1.5px solid #E4E7EC',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
