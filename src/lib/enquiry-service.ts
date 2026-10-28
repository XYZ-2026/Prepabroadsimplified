import fs from 'fs';
import path from 'path';
import { adminDb } from '@/lib/firebase-admin';

export interface EnquiryRecord {
  id: string;
  parentName: string;
  phone: string;
  email?: string;
  studentName?: string;
  academicLevel: string;
  grade?: string;
  schoolName?: string;
  board?: string;
  stream?: string;
  developmentAreas: string[];
  clarvoExploration: string[];
  preferredTimeFrame: string;
  notes?: string;
  consent: boolean;
  status: 'new' | 'contacted' | 'scheduled' | 'converted' | 'archived';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  sourcePage?: string;
}

const LOCAL_STORAGE_FILE = path.join(process.cwd(), 'src', 'data', 'enquiries.json');

// Ensure local data storage directory and file exist
function ensureLocalStorageFile() {
  try {
    const dir = path.dirname(LOCAL_STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_STORAGE_FILE)) {
      fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Enquiry Service] Failed to ensure local storage file:', err);
  }
}

// Read enquiries from local JSON file
function readLocalEnquiries(): EnquiryRecord[] {
  try {
    ensureLocalStorageFile();
    if (!fs.existsSync(LOCAL_STORAGE_FILE)) return [];
    const content = fs.readFileSync(LOCAL_STORAGE_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('[Enquiry Service] Error reading local enquiries:', err);
    return [];
  }
}

// Write enquiries to local JSON file
function writeLocalEnquiries(enquiries: EnquiryRecord[]): void {
  try {
    ensureLocalStorageFile();
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(enquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Enquiry Service] Error writing local enquiries:', err);
  }
}

/**
 * Create a new demo enquiry
 */
export async function createEnquiry(
  data: Omit<EnquiryRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<EnquiryRecord> {
  const now = new Date().toISOString();
  const id = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newRecord: EnquiryRecord = {
    ...data,
    id,
    status: 'new',
    createdAt: now,
    updatedAt: now,
  };

  // 1. Always save to local JSON storage for redundancy & offline reliability
  try {
    const localList = readLocalEnquiries();
    localList.unshift(newRecord);
    writeLocalEnquiries(localList);
  } catch (localErr) {
    console.warn('[Enquiry Service] Local write error:', localErr);
  }

  // 2. Persist to Firestore if available
  try {
    if (adminDb) {
      await adminDb.collection('demo_enquiries').doc(id).set({
        ...newRecord,
        timestamp: new Date(),
      });
    }
  } catch (fsErr) {
    console.warn('[Enquiry Service] Firestore write note (local saved):', fsErr);
  }

  return newRecord;
}

/**
 * Fetch all enquiries with optional filters and sorting (newest first)
 */
export async function getAllEnquiries(options?: {
  status?: string;
  search?: string;
  academicLevel?: string;
}): Promise<EnquiryRecord[]> {
  const map = new Map<string, EnquiryRecord>();

  // 1. Fetch from Firestore if available
  try {
    if (adminDb) {
      const snap = await adminDb.collection('demo_enquiries').orderBy('createdAt', 'desc').limit(200).get();
      snap.docs.forEach((doc) => {
        const d = doc.data();
        map.set(doc.id, {
          id: doc.id,
          parentName: d.parentName || d.name || 'Parent',
          phone: d.phone || '',
          email: d.email || '',
          studentName: d.studentName || '',
          academicLevel: d.academicLevel || 'Not Specified',
          developmentAreas: Array.isArray(d.developmentAreas) ? d.developmentAreas : [],
          clarvoExploration: Array.isArray(d.clarvoExploration) ? d.clarvoExploration : [],
          preferredTimeFrame: d.preferredTimeFrame || 'Flexible',
          notes: d.notes || '',
          consent: d.consent ?? true,
          status: d.status || 'new',
          adminNotes: d.adminNotes || '',
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt || d.createdAt || new Date().toISOString(),
          sourcePage: d.sourcePage || '/book-a-demo',
        });
      });
    }
  } catch (fsErr) {
    console.warn('[Enquiry Service] Firestore query note (falling back to local):', fsErr);
  }

  // 2. Merge local enquiries
  try {
    const localList = readLocalEnquiries();
    localList.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    });
  } catch (localErr) {
    console.warn('[Enquiry Service] Local read warning:', localErr);
  }

  let list = Array.from(map.values());

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply filters
  if (options?.status && options.status !== 'all') {
    list = list.filter((item) => item.status === options.status);
  }

  if (options?.academicLevel && options.academicLevel !== 'all') {
    list = list.filter((item) => item.academicLevel === options.academicLevel);
  }

  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (item) =>
        item.parentName.toLowerCase().includes(q) ||
        (item.studentName && item.studentName.toLowerCase().includes(q)) ||
        item.phone.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * Update enquiry status or admin notes
 */
export async function updateEnquiry(
  id: string,
  updates: Partial<Pick<EnquiryRecord, 'status' | 'adminNotes'>>
): Promise<EnquiryRecord | null> {
  const now = new Date().toISOString();

  // 1. Update local
  let updatedRecord: EnquiryRecord | null = null;
  const localList = readLocalEnquiries();
  const index = localList.findIndex((item) => item.id === id);
  if (index !== -1) {
    localList[index] = {
      ...localList[index],
      ...updates,
      updatedAt: now,
    };
    writeLocalEnquiries(localList);
    updatedRecord = localList[index];
  }

  // 2. Update Firestore
  try {
    if (adminDb) {
      await adminDb.collection('demo_enquiries').doc(id).set(
        {
          ...updates,
          updatedAt: now,
        },
        { merge: true }
      );
    }
  } catch (fsErr) {
    console.warn('[Enquiry Service] Firestore update note:', fsErr);
  }

  return updatedRecord;
}

/**
 * Delete / Archive enquiry
 */
export async function deleteEnquiry(id: string): Promise<boolean> {
  // 1. Delete local
  const localList = readLocalEnquiries();
  const filtered = localList.filter((item) => item.id !== id);
  writeLocalEnquiries(filtered);

  // 2. Delete Firestore
  try {
    if (adminDb) {
      await adminDb.collection('demo_enquiries').doc(id).delete();
    }
  } catch (fsErr) {
    console.warn('[Enquiry Service] Firestore delete note:', fsErr);
  }

  return true;
}
