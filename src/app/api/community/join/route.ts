import { NextRequest, NextResponse } from 'next/server';
import { saveCommunityLead, getCommunitySettings, validateWhatsAppUrl } from '@/lib/community-service';

// In-memory deduplication cache: phone_email -> timestamp
const recentSubmissions = new Map<string, number>();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone: string): boolean {
  // Accepts international format (+), digits, spaces, hyphens, min 7 digits, max 16 digits
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?[0-9]{7,16}$/.test(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, schoolName, grade, priorityGoal } = body;

    const errors: Record<string, string> = {};

    // 1. Validation of the required fields
    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (!cleanName || cleanName.length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }

    const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
    if (!cleanPhone || !isValidPhone(cleanPhone)) {
      errors.phone = 'Please enter a valid phone number (e.g. +91 98765 43210).';
    }

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      errors.email = 'Please provide a valid email address.';
    }

    const cleanSchoolName = typeof schoolName === 'string' ? schoolName.trim() : '';
    if (!cleanSchoolName || cleanSchoolName.length < 2) {
      errors.schoolName = 'Please enter your school or institution name.';
    }

    const cleanGrade = typeof grade === 'string' ? grade.trim() : '';
    if (!cleanGrade) {
      errors.grade = 'Please select your grade or class.';
    }

    // Optional field: what are you looking for on priority
    const cleanPriorityGoal = typeof priorityGoal === 'string' ? priorityGoal.trim().slice(0, 300) : '';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // 2. Prevent rapid duplicate submissions (within 60 seconds)
    const dedupeKey = `${cleanPhone.replace(/\D/g, '')}_${cleanEmail}`;
    const now = Date.now();
    const lastSub = recentSubmissions.get(dedupeKey);

    if (lastSub && now - lastSub < 60 * 1000) {
      // Fetch latest configured WhatsApp URL and return it gracefully without failing the user
      const settings = await getCommunitySettings();
      return NextResponse.json({
        success: true,
        redirectUrl: settings.activeWhatsAppUrl,
        message: 'Your details were already recorded. Redirecting to WhatsApp community...',
      });
    }

    recentSubmissions.set(dedupeKey, now);

    // Clean up old entries from memory cache periodically
    if (recentSubmissions.size > 2000) {
      for (const [key, timestamp] of recentSubmissions.entries()) {
        if (now - timestamp > 5 * 60 * 1000) {
          recentSubmissions.delete(key);
        }
      }
    }

    // 3. Capture client metadata
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : undefined;
    const userAgent = req.headers.get('user-agent') || undefined;

    // 4. Save the Community Lead
    const lead = await saveCommunityLead(
      {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        schoolName: cleanSchoolName,
        grade: cleanGrade,
        priorityGoal: cleanPriorityGoal,
      },
      { ip, userAgent }
    );

    // 5. Retrieve currently active WhatsApp group URL
    const settings = await getCommunitySettings();
    const activeUrl = settings.activeWhatsAppUrl?.trim();

    // Verify destination URL is legitimate before providing it
    const urlCheck = validateWhatsAppUrl(activeUrl);

    if (!urlCheck.valid) {
      return NextResponse.json({
        success: true,
        leadId: lead.id,
        redirectUrl: null,
        message:
          'Your details have been successfully recorded! The community group link is currently being refreshed. Our team will send your invite link shortly.',
      });
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      redirectUrl: activeUrl,
      message: 'Lead registered successfully. Redirecting to WhatsApp...',
    });
  } catch (error: any) {
    console.error('[Community Join API] Error processing lead:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to process your request at this time. Please try again.',
      },
      { status: 500 }
    );
  }
}

