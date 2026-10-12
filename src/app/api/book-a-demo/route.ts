import { NextRequest, NextResponse } from 'next/server';
import { createEnquiry } from '@/lib/enquiry-service';

// In-memory rate-limiter / deduplication cache for demo enquiries (phone -> timestamp)
const recentSubmissions = new Map<string, number>();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  // Allow international prefix (+), numbers, spaces, hyphens, min 7 digits, max 16 digits
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{7,16}$/.test(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parentName,
      phone,
      email,
      studentName,
      academicLevel,
      developmentAreas = [],
      clarvoExploration = [],
      preferredTimeFrame,
      notes = '',
      consent,
      sourcePage = '/book-a-demo',
    } = body;

    // 1. Validation
    const errors: Record<string, string> = {};

    const cleanParentName = typeof parentName === 'string' ? parentName.trim() : '';
    if (!cleanParentName || cleanParentName.length < 2) {
      errors.parentName = 'Please enter the Parent / Guardian name (at least 2 characters).';
    }

    const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
    if (!cleanPhone || !isValidPhone(cleanPhone)) {
      errors.phone = 'Please provide a valid contact phone number (7–15 digits).';
    }

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      errors.email = 'Please provide a valid email address.';
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

    // 2. Prevent duplicate rapid submissions (within 2 minutes)
    const dedupeKey = `${cleanPhone.replace(/\D/g, '')}_${cleanEmail}`;
    const now = Date.now();
    const lastSub = recentSubmissions.get(dedupeKey);
    if (lastSub && now - lastSub < 2 * 60 * 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate submission detected',
          message: 'An enquiry with this phone number was recently received. Our advisors will be in touch shortly.'
        },
        { status: 429 }
      );
    }

    // 3. Save enquiry to Firestore and local storage
    const newEnquiry = await createEnquiry({
      parentName: cleanParentName,
      phone: cleanPhone,
      email: cleanEmail || undefined,
      studentName: typeof studentName === 'string' ? studentName.trim() : undefined,
      academicLevel: academicLevel || 'High School (Grades 9-12)',
      developmentAreas: Array.isArray(developmentAreas) ? developmentAreas : [],
      clarvoExploration: Array.isArray(clarvoExploration) ? clarvoExploration : [],
      preferredTimeFrame: preferredTimeFrame || 'Flexible',
      notes: typeof notes === 'string' ? notes.trim() : '',
      consent: true,
      sourcePage,
    });

    recentSubmissions.set(dedupeKey, now);

    return NextResponse.json({
      success: true,
      enquiryId: newEnquiry.id,
      message: "Thank you! Your enquiry has been recorded. Our educational guidance team will contact you shortly to schedule your demo."
    });

  } catch (err: any) {
    console.error('[Book a Demo API] Server error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry. Please try again or reach out to support@clarvo.in.' },
      { status: 500 }
    );
  }
}
