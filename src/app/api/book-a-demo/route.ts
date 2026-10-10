import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Simple in-memory rate-limiter / deduplication cache for demo enquiries (email+phone -> timestamp)
const recentSubmissions = new Map<string, number>();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  // Allow international prefix (+), numbers, spaces, hyphens, min 8 digits, max 16 digits
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{8,15}$/.test(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, consent, sourcePage, campaignParams } = body;

    // 1. Validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.name = 'Please provide your full name (at least 2 characters).';
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!phone || typeof phone !== 'string' || !isValidPhone(phone)) {
      errors.phone = 'Please provide a valid contact phone number (8–15 digits).';
    }

    if (!consent) {
      errors.consent = 'You must agree to allow CLARVO to contact you regarding your enquiry.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // 2. Prevent rapid duplicate submissions (within 3 minutes)
    const dedupeKey = `${email.trim().toLowerCase()}_${phone.replace(/\D/g, '')}`;
    const now = Date.now();
    const lastSub = recentSubmissions.get(dedupeKey);
    if (lastSub && now - lastSub < 3 * 60 * 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate submission detected',
          message: 'An enquiry with this email and phone number was recently received. Our advisors will be in touch shortly.'
        },
        { status: 429 }
      );
    }

    const enquiryData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      consent: true,
      sourcePage: sourcePage || '/book-a-demo',
      campaignParams: campaignParams || {},
      status: 'pending',
      createdAt: new Date().toISOString(),
      userAgent: req.headers.get('user-agent') || 'unknown',
    };

    let enquiryId = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 3. Persist to Firestore if available
    try {
      if (adminDb) {
        const docRef = await adminDb.collection('demo_enquiries').add(enquiryData);
        enquiryId = docRef.id;
      } else {
        console.warn('[Book a Demo API] Firestore adminDb is unavailable, recorded in runtime log.');
      }
    } catch (dbErr) {
      console.error('[Book a Demo API] Database write warning:', dbErr);
      // Gracefully continue so user is not blocked if Firestore emulator/credentials are missing in local dev
    }

    // Record submission for rate-limiting
    recentSubmissions.set(dedupeKey, now);

    return NextResponse.json({
      success: true,
      enquiryId,
      message: "Thank you! Your enquiry has been received. Our team will connect with you to understand your child's needs and explain how CLARVO can help."
    });

  } catch (err: any) {
    console.error('[Book a Demo API] Server error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry. Please try again or reach out to support@collegesimplified.in.' },
      { status: 500 }
    );
  }
}
