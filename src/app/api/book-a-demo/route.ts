import { NextRequest, NextResponse, after } from 'next/server';
import { createEnquiry, updateEnquiry } from '@/lib/enquiry-service';
import { notifySupportOfEnquiry } from '@/lib/enquiry-notification';
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit';

// In-memory deduplication cache for demo enquiries (phone+email -> timestamp)
const recentSubmissions = new Map<string, number>();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  // Allow international prefix (+), numbers, spaces, hyphens, min 7 digits, max 16 digits
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{7,16}$/.test(cleaned);
}

const cap = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const capList = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 20).map((x) => x.slice(0, 80)) : [];

export async function POST(req: NextRequest) {
  try {
    if (!isSameOrigin(req)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Per-IP limit so the form cannot be used to flood the support inbox
    const limit = rateLimit(`book-a-demo:${clientIp(req)}`, 5, 10 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { success: false, error: 'Too many requests', message: 'Too many requests. Please try again in a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    // Honeypot: real users never fill this hidden field. Pretend success so bots learn nothing.
    if (typeof body.companyWebsite === 'string' && body.companyWebsite.trim() !== '') {
      return NextResponse.json({ success: true, enquiryId: `ENQ-${Date.now().toString().slice(-6)}` });
    }

    const {
      parentName,
      phone,
      email,
      studentName,
      academicLevel,
      grade,
      schoolName,
      board,
      stream,
      developmentAreas = [],
      clarvoExploration = [],
      preferredTimeFrame,
      notes = '',
      consent,
      sourcePage = '/book-a-demo',
    } = body;

    // 1. Validation
    const errors: Record<string, string> = {};

    const cleanParentName = cap(parentName, 100);
    if (!cleanParentName || cleanParentName.length < 2) {
      errors.parentName = 'Please enter the Parent / Guardian name (at least 2 characters).';
    }

    const cleanPhone = cap(phone, 24);
    if (!cleanPhone || !isValidPhone(cleanPhone)) {
      errors.phone = 'Please provide a valid contact phone number (7–15 digits).';
    }

    const cleanEmail = cap(email, 120).toLowerCase();
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!consent) {
      errors.consent = 'You must agree to allow CLARVO to contact you regarding your enquiry.';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, error: 'Validation failed', errors }, { status: 400 });
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
          message: 'An enquiry with this phone number was recently received. Our advisors will be in touch shortly.',
        },
        { status: 429 }
      );
    }

    // 3. Save enquiry to Firestore and local storage (admin dashboard keeps working exactly as before)
    const newEnquiry = await createEnquiry({
      parentName: cleanParentName,
      phone: cleanPhone,
      email: cleanEmail || undefined,
      studentName: cap(studentName, 100) || undefined,
      academicLevel: cap(academicLevel, 80) || 'High School (Grades 9-12)',
      grade: cap(grade, 60) || undefined,
      schoolName: cap(schoolName, 150) || undefined,
      board: cap(board, 60) || undefined,
      stream: cap(stream, 60) || undefined,
      developmentAreas: capList(developmentAreas),
      clarvoExploration: capList(clarvoExploration),
      preferredTimeFrame: cap(preferredTimeFrame, 80) || 'Flexible',
      notes: cap(notes, 1500),
      consent: true,
      sourcePage: cap(sourcePage, 60) || '/book-a-demo',
    });

    recentSubmissions.set(dedupeKey, now);
    if (recentSubmissions.size > 2000) {
      for (const [k, t] of recentSubmissions) if (now - t > 2 * 60 * 1000) recentSubmissions.delete(k);
    }

    // 4. Alert the support team by email AFTER the response is sent. A failure here never affects the user,
    //    and the outcome is recorded on the enquiry so the admin can see it.
    after(async () => {
      try {
        const status = await notifySupportOfEnquiry(newEnquiry);
        await updateEnquiry(newEnquiry.id, { notifyStatus: status });
      } catch (notifyErr) {
        console.error('[Book a Demo API] Support notification error:', notifyErr);
        await updateEnquiry(newEnquiry.id, { notifyStatus: 'failed' }).catch(() => {});
      }
    });

    return NextResponse.json({
      success: true,
      enquiryId: newEnquiry.id,
      message: 'Thank you! Your enquiry has been recorded. Our educational guidance team will contact you shortly to schedule your demo.',
    });
  } catch (err: any) {
    console.error('[Book a Demo API] Server error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry. Please try again or reach out to support@clarvo.in.' },
      { status: 500 }
    );
  }
}
