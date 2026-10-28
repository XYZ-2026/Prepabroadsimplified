import fs from 'fs';
import path from 'path';
import { adminDb } from '@/lib/firebase-admin';

export type ReviewCategory = 'stream' | 'sat' | 'international' | 'research';

export interface ReviewRecord {
  id: string;
  name: string;
  anonymisedName?: string;
  role: 'student' | 'parent';
  email?: string;
  school: string;
  allowSchoolDisplay?: boolean;
  grade: string;
  category?: ReviewCategory;
  reportType: string;
  rating: number; // 1 to 5
  headline: string;
  comment: string;
  impactTag?: string;
  status: 'pending' | 'approved' | 'rejected';
  isFeatured: boolean; // Flag controlled by admin to select what to be presented on the site!
  isVerified?: boolean; // Explicit verification flag confirmed against evidence
  consentRecorded?: boolean; // Permission to publish recorded
  consentDate?: string;
  evidenceRef?: string; // Stored privately, never exposed in public responses
  adminNotes?: string; // Stored privately, never exposed in public responses
  createdAt: string;
  updatedAt: string;
  reportId?: string;
}

export interface PublicReview {
  id: string;
  name: string;
  role: 'student' | 'parent';
  school?: string;
  grade: string;
  category: ReviewCategory;
  reportType: string;
  rating: number;
  headline: string;
  comment: string;
  impactTag?: string;
  isVerified: boolean;
  createdAt: string;
}

const LOCAL_REVIEWS_FILE = path.join(process.cwd(), 'src', 'data', 'reviews.json');

// Ensure local JSON storage exists
function ensureLocalStorageFile() {
  try {
    const dir = path.dirname(LOCAL_REVIEWS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_REVIEWS_FILE)) {
      fs.writeFileSync(LOCAL_REVIEWS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Review Service] Failed to ensure local storage file:', err);
  }
}

// Read reviews from local JSON file
function readLocalReviews(): ReviewRecord[] {
  try {
    ensureLocalStorageFile();
    if (!fs.existsSync(LOCAL_REVIEWS_FILE)) return [];
    const content = fs.readFileSync(LOCAL_REVIEWS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[Review Service] Error reading local reviews:', err);
    return [];
  }
}

// Write reviews to local JSON file
function writeLocalReviews(reviews: ReviewRecord[]): void {
  try {
    ensureLocalStorageFile();
    fs.writeFileSync(LOCAL_REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Review Service] Error writing local reviews:', err);
  }
}

/**
 * Public Sanitization: strictly strips private student info, email, evidence refs, and admin notes
 */
export function sanitizeReviewForPublic(r: ReviewRecord): PublicReview {
  // Respect minor privacy: if school display not authorized, show generic verified label
  const displayName = r.anonymisedName || r.name;
  const schoolLabel = r.allowSchoolDisplay !== false ? r.school : 'Leading Indian High School';

  // Map category or infer from existing impact tag/report type if unset
  let cat: ReviewCategory = r.category || 'stream';
  if (!r.category) {
    const lower = `${r.reportType} ${r.impactTag} ${r.headline} ${r.comment}`.toLowerCase();
    if (lower.includes('sat')) cat = 'sat';
    else if (lower.includes('ib') || lower.includes('cambridge') || lower.includes('a-level')) cat = 'international';
    else if (lower.includes('research') || lower.includes('paper') || lower.includes('admit')) cat = 'research';
    else cat = 'stream';
  }

  return {
    id: r.id,
    name: displayName,
    role: r.role,
    school: schoolLabel,
    grade: r.grade,
    category: cat,
    reportType: r.reportType,
    rating: Math.max(1, Math.min(5, Number(r.rating) || 5)),
    headline: r.headline,
    comment: r.comment,
    impactTag: r.impactTag,
    isVerified: Boolean(r.isVerified),
    createdAt: r.createdAt,
  };
}

/**
 * Create a new student or parent review (starts in pending state, unverified until moderation)
 */
export async function createReview(
  data: Omit<ReviewRecord, 'id' | 'status' | 'isFeatured' | 'isVerified' | 'createdAt' | 'updatedAt'>
): Promise<ReviewRecord> {
  const timestamp = new Date().toISOString();
  const id = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newReview: ReviewRecord = {
    ...data,
    id,
    rating: Math.max(1, Math.min(5, Number(data.rating) || 5)),
    status: 'pending', // Starts in pending moderation
    isFeatured: false, // Must be explicitly approved and featured by admin
    isVerified: false, // Verification must be backed by authorized counselor docket
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // 1. Save to local fallback JSON
  try {
    const existing = readLocalReviews();
    existing.unshift(newReview);
    writeLocalReviews(existing);
  } catch (localErr) {
    console.error('[Review Service] Failed to save to local storage:', localErr);
  }

  // 2. Save to Firestore if available
  try {
    await adminDb.collection('student_reviews').doc(id).set(newReview);
  } catch (firestoreErr) {
    console.warn('[Review Service] Firestore write skipped/failed, saved locally:', firestoreErr);
  }

  return newReview;
}

/**
 * Get all reviews (for Admin Dashboard)
 */
export async function getAllReviews(): Promise<ReviewRecord[]> {
  const localList = readLocalReviews();
  const resultMap = new Map<string, ReviewRecord>();

  // Add local records first
  localList.forEach((r) => resultMap.set(r.id, r));

  // Fetch Firestore records and merge
  try {
    const snapshot = await adminDb
      .collection('student_reviews')
      .orderBy('createdAt', 'desc')
      .get();

    snapshot.forEach((doc) => {
      const data = doc.data() as ReviewRecord;
      resultMap.set(data.id || doc.id, { ...data, id: data.id || doc.id });
    });
  } catch (err) {
    // If Firestore fails (e.g. offline dev), localList will be used seamlessly
  }

  const merged = Array.from(resultMap.values());
  merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return merged;
}

/**
 * Get approved & featured reviews (for Homepage and Public Testimonials)
 */
export async function getFeaturedReviews(): Promise<ReviewRecord[]> {
  const all = await getAllReviews();
  return all.filter((r) => r.status === 'approved' && r.isFeatured);
}

/**
 * Get approved reviews supporting up to 25 authentic reviews per category
 */
export async function getReviewsByCategory(
  category?: string,
  limit: number = 25
): Promise<ReviewRecord[]> {
  const approved = await getFeaturedReviews();

  if (!category || category === 'all') {
    return approved.slice(0, Math.min(limit, 100));
  }

  const filtered = approved.filter((r) => {
    const pub = sanitizeReviewForPublic(r);
    return pub.category === category;
  });

  // Supports up to 25 authentic reviews per category without fabrication
  return filtered.slice(0, Math.min(limit, 25));
}

/**
 * Calculate actual category counts from approved records
 */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const approved = await getFeaturedReviews();
  const counts: Record<string, number> = {
    all: approved.length,
    stream: 0,
    sat: 0,
    international: 0,
    research: 0,
  };

  approved.forEach((r) => {
    const pub = sanitizeReviewForPublic(r);
    if (counts[pub.category] !== undefined) {
      counts[pub.category]++;
    }
  });

  return counts;
}

/**
 * Update review status, isFeatured flag, verification, or admin notes (Admin only)
 */
export async function updateReview(
  id: string,
  updates: Partial<Pick<ReviewRecord, 'status' | 'isFeatured' | 'isVerified' | 'consentRecorded' | 'consentDate' | 'evidenceRef' | 'adminNotes' | 'headline' | 'comment' | 'impactTag' | 'category' | 'anonymisedName' | 'allowSchoolDisplay'>>
): Promise<ReviewRecord | null> {
  const timestamp = new Date().toISOString();
  let updatedRecord: ReviewRecord | null = null;

  // 1. Update in local storage
  const localList = readLocalReviews();
  const index = localList.findIndex((r) => r.id === id);

  if (index !== -1) {
    localList[index] = {
      ...localList[index],
      ...updates,
      updatedAt: timestamp,
    };
    writeLocalReviews(localList);
    updatedRecord = localList[index];
  }

  // 2. Update in Firestore
  try {
    const docRef = adminDb.collection('student_reviews').doc(id);
    const doc = await docRef.get();
    if (doc.exists) {
      await docRef.update({
        ...updates,
        updatedAt: timestamp,
      });
      const data = (await docRef.get()).data() as ReviewRecord;
      updatedRecord = { ...data, id };
    } else if (updatedRecord) {
      // If was only local, sync to Firestore
      await docRef.set(updatedRecord);
    }
  } catch (err) {
    console.warn('[Review Service] Firestore update skipped/failed, updated locally:', err);
  }

  return updatedRecord;
}

/**
 * Delete a review (Admin only)
 */
export async function deleteReview(id: string): Promise<boolean> {
  // 1. Delete from local storage
  try {
    const localList = readLocalReviews();
    const filtered = localList.filter((r) => r.id !== id);
    writeLocalReviews(filtered);
  } catch (err) {
    console.error('[Review Service] Local delete error:', err);
  }

  // 2. Delete from Firestore
  try {
    await adminDb.collection('student_reviews').doc(id).delete();
  } catch (err) {
    console.warn('[Review Service] Firestore delete skipped/failed:', err);
  }

  return true;
}
