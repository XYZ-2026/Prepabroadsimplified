'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function DemoBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    consent: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Campaign & Source tracking
  const [sourceData, setSourceData] = useState<{
    sourcePage: string;
    campaignParams: Record<string, string>;
  }>({
    sourcePage: '/book-a-demo',
    campaignParams: {},
  });

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchParams) {
      ['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'source'].forEach((key) => {
        const val = searchParams.get(key);
        if (val) params[key] = val;
      });
    }

    setSourceData({
      sourcePage: typeof document !== 'undefined' && document.referrer ? document.referrer : '/book-a-demo',
      campaignParams: params,
    });
  }, [searchParams]);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Please enter your full name (at least 2 characters).';
        }
        return '';
      case 'email':
        if (!value || typeof value !== 'string') {
          return 'Please enter your email address.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address (e.g. parent@example.com).';
        }
        return '';
      case 'phone':
        if (!value || typeof value !== 'string') {
          return 'Please enter your contact phone number.';
        }
        const cleaned = value.replace(/[\s\-\(\)]/g, '');
        if (!/^\+?[0-9]{8,15}$/.test(cleaned)) {
          return 'Please enter a valid phone number (8 to 15 digits).';
        }
        return '';
      case 'consent':
        if (!value) {
          return 'Consent to contact is required to submit your demo request.';
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Inline validation clear
    const fieldErr = validateField(name, val);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErr,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate all fields
    const newErrors: Record<string, string> = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      consent: validateField('consent', formData.consent),
    };

    const hasErrors = Object.values(newErrors).some((err) => err.length > 0);
    setErrors(newErrors);

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/book-a-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sourcePage: sourceData.sourcePage,
          campaignParams: sourceData.campaignParams,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || data.error || 'Failed to submit enquiry. Please retry.');
      }

      // Success: Save temporary session note and redirect to confirmation
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('clarvo_demo_name', formData.name);
        sessionStorage.setItem('clarvo_demo_email', formData.email);
      }

      router.push('/demo-confirmation');

    } catch (err: any) {
      setServerError(err.message || 'We could not submit your request at this time. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', background: '#F8FAFC', padding: '48px 16px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#2563EB', fontSize: '14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            ← Back to CLARVO Home
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* Left Column: Brand Context & Value Proposition */}
          <div style={{ padding: '16px 8px' }}>
            <div style={{ display: 'inline-block', background: '#E8F0FF', color: '#2563EB', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Personalised Consultation
            </div>

            <h1 style={{ fontSize: '36px', lineHeight: '1.2', fontWeight: 800, color: '#080F1C', letterSpacing: '-0.02em', marginBottom: '16px' }}>
              Clarity for Their Future Starts Here.
            </h1>

            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#344054', marginBottom: '32px' }}>
              Tell us a little about yourself. Our team will connect with you to understand your child's needs and explain how CLARVO can help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E4E7EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', fontSize: '18px', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  🎯
                </div>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#080F1C', margin: '0 0 4px 0' }}>Grades 7–12 Psychometric Diagnostics</h2>
                  <p style={{ fontSize: '13px', color: '#667085', margin: 0, lineHeight: '1.5' }}>Evaluate 30 core cognitive, RIASEC interest, personality, and VARK learning dimensions.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E4E7EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', fontSize: '18px', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  🗺️
                </div>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#080F1C', margin: '0 0 4px 0' }}>Personalised Subject & Career Roadmaps</h2>
                  <p style={{ fontSize: '13px', color: '#667085', margin: 0, lineHeight: '1.5' }}>Empower confident Class 11 stream choices and verified university admissions tracks.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E4E7EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', fontSize: '18px', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  🤝
                </div>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#080F1C', margin: '0 0 4px 0' }}>One-to-One Academic Mentorship</h2>
                  <p style={{ fontSize: '13px', color: '#667085', margin: 0, lineHeight: '1.5' }}>Dedicated parent-student alignment sessions with certified guidance counselors.</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '36px', padding: '16px', borderRadius: '12px', background: '#E8F0FF', border: '1px solid #BFDBFE' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#1E40AF', lineHeight: '1.5' }}>
                <strong>Want to see a real dossier first?</strong> Explore our sample psychometric evaluation reports anytime on the{' '}
                <Link href="/sample-reports" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'underline' }}>
                  Sample Reports Hub
                </Link>.
              </p>
            </div>
          </div>

          {/* Right Column: Demo Request Form */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E4E7EC', padding: '36px 32px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#080F1C', margin: '0 0 6px 0' }}>
                Schedule a Consultation
              </h2>
              <p style={{ fontSize: '13px', color: '#667085', margin: 0 }}>
                Fill in the details below. Our academic advisors will reach out to assist you.
              </p>
            </div>

            {serverError && (
              <div role="alert" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#DC2626', fontSize: '16px' }}>⚠️</span>
                <p style={{ margin: 0, fontSize: '13px', color: '#991B1B', lineHeight: '1.4' }}>{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              
              {/* Field 1: Name */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="name" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#344054', marginBottom: '6px' }}>
                  Your Full Name <span style={{ color: '#2563EB' }}>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: `1.5px solid ${errors.name ? '#EF4444' : '#E4E7EC'}`,
                    fontSize: '14px',
                    color: '#080F1C',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: isSubmitting ? '#F8FAFC' : '#FFFFFF',
                  }}
                />
                {errors.name && (
                  <p id="name-error" style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#DC2626' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Field 2: Phone Number */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="phone" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#344054', marginBottom: '6px' }}>
                  Contact Phone Number <span style={{ color: '#2563EB' }}>*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: `1.5px solid ${errors.phone ? '#EF4444' : '#E4E7EC'}`,
                    fontSize: '14px',
                    color: '#080F1C',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: isSubmitting ? '#F8FAFC' : '#FFFFFF',
                  }}
                />
                {errors.phone && (
                  <p id="phone-error" style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#DC2626' }}>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Field 3: Email ID */}
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#344054', marginBottom: '6px' }}>
                  Email Address <span style={{ color: '#2563EB' }}>*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. parent@clarvo.com"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: `1.5px solid ${errors.email ? '#EF4444' : '#E4E7EC'}`,
                    fontSize: '14px',
                    color: '#080F1C',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: isSubmitting ? '#F8FAFC' : '#FFFFFF',
                  }}
                />
                {errors.email && (
                  <p id="email-error" style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#DC2626' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Consent Checkbox */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#2563EB' }}
                  />
                  <span style={{ fontSize: '12px', color: '#667085', lineHeight: '1.5' }}>
                    I consent to receiving academic guidance and consultation communications from CLARVO via phone, WhatsApp, or email in accordance with our{' '}
                    <Link href="/privacy" style={{ color: '#2563EB', textDecoration: 'underline' }}>
                      Privacy Policy
                    </Link>.
                  </span>
                </label>
                {errors.consent && (
                  <p style={{ margin: '6px 0 0 26px', fontSize: '12px', color: '#DC2626' }}>
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-submit-demo"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '10px',
                  background: isSubmitting ? '#93C5FD' : '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Submitting Enquiry...
                  </>
                ) : (
                  <>
                    Book a Demo
                    <span>→</span>
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '11px', color: '#667085', marginTop: '14px' }}>
                🔒 Your personal information is kept strictly confidential.
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function BookADemoPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#667085' }}>Loading CLARVO Consultation Form...</p>
      </div>
    }>
      <DemoBookingForm />
    </Suspense>
  );
}
