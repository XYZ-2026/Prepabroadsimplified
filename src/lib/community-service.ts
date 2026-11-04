import fs from 'fs';
import path from 'path';
import { adminDb } from '@/lib/firebase-admin';
import { createEnquiry } from '@/lib/enquiry-service';

export type CommunityCampaign = 'clarvo_student_parent_community' | 'mentor_counsellor_community';
export type CommunityType = 'student_parent' | 'counsellor_mentor';

export interface CommunityLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  schoolName?: string;
  grade?: string;
  priorityGoal?: string;
  linkedInUrl?: string;
  source: CommunityCampaign;
  status: 'new' | 'contacted' | 'converted' | 'archived';
  createdAt: string;
  updatedAt: string;
  ip?: string;
  userAgent?: string;
}

export interface LinkHistoryItem {
  id: string;
  url: string;
  previousUrl?: string;
  updatedBy: string;
  updatedAt: string;
  note?: string;
}

export interface CommunitySettings {
  activeWhatsAppUrl: string;
  qrLandingPageUrl: string;
  updatedAt: string;
  updatedBy: string;
  history: LinkHistoryItem[];
}

const SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'community-settings.json');
const COUNSELLOR_SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'counsellor-community-settings.json');
const LEADS_FILE = path.join(process.cwd(), 'src', 'data', 'community-leads.json');

const INITIAL_WHATSAPP_URL = 'https://chat.whatsapp.com/JevCH59LcE33ahR612sLEG';
const INITIAL_COUNSELLOR_WHATSAPP_URL = 'https://chat.whatsapp.com/C6UVHin2Qkv9rhBqON8BHQ';

const DEFAULT_SETTINGS: CommunitySettings = {
  activeWhatsAppUrl: INITIAL_WHATSAPP_URL,
  qrLandingPageUrl: '/join-community',
  updatedAt: new Date().toISOString(),
  updatedBy: 'System (Initial Setup)',
  history: [
    {
      id: 'hist_initial',
      url: INITIAL_WHATSAPP_URL,
      updatedBy: 'System (Initial Setup)',
      updatedAt: new Date().toISOString(),
      note: 'Initial official WhatsApp Community group link configured.',
    },
  ],
};

const DEFAULT_COUNSELLOR_SETTINGS: CommunitySettings = {
  activeWhatsAppUrl: INITIAL_COUNSELLOR_WHATSAPP_URL,
  qrLandingPageUrl: '/join-counsellor-community',
  updatedAt: new Date().toISOString(),
  updatedBy: 'System (Initial Setup)',
  history: [
    {
      id: 'hist_counsellor_initial',
      url: INITIAL_COUNSELLOR_WHATSAPP_URL,
      updatedBy: 'System (Initial Setup)',
      updatedAt: new Date().toISOString(),
      note: 'Initial official Global Counselling Association WhatsApp group link configured.',
    },
  ],
};

/**
 * Check if Firebase Admin is configured with active credentials
 */
function isFirestoreReady(): boolean {
  if (!adminDb) return false;
  const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  return !!(key && key.length > 50 && process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
}

function ensureDirectoryExists(filePath: string) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.warn('[Community Service] Error ensuring directory:', err);
  }
}

/**
 * Validate that a URL is a legitimate WhatsApp invitation link (prevents open-redirect attacks)
 */
export function validateWhatsAppUrl(rawUrl: string): { valid: boolean; error?: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'WhatsApp invitation URL is required.' };
  }

  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith('https://')) {
    return { valid: false, error: 'URL must use secure HTTPS (https://).' };
  }

  try {
    const parsed = new URL(trimmed);
    const validHostnames = [
      'chat.whatsapp.com',
      'wa.me',
      'api.whatsapp.com',
      'whatsapp.com',
      'www.whatsapp.com',
    ];

    const isAllowedHost = validHostnames.some(
      (h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`)
    );

    if (!isAllowedHost) {
      return {
        valid: false,
        error: `Only official WhatsApp links are allowed (${validHostnames.slice(0, 2).join(' or ')}).`,
      };
    }

    // chat.whatsapp.com links must contain an invite code
    if (parsed.hostname === 'chat.whatsapp.com' && parsed.pathname.length < 5) {
      return { valid: false, error: 'Please provide a valid WhatsApp group invitation link with an invite code.' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format.' };
  }
}

/**
 * Get active community settings from Firestore with local JSON fallback
 */
export async function getCommunitySettings(communityType: CommunityType = 'student_parent'): Promise<CommunitySettings> {
  const isCounsellor = communityType === 'counsellor_mentor';
  const docId = isCounsellor ? 'counsellor_whatsapp_config' : 'whatsapp_config';
  const filePath = isCounsellor ? COUNSELLOR_SETTINGS_FILE : SETTINGS_FILE;
  const defaultSettings = isCounsellor ? DEFAULT_COUNSELLOR_SETTINGS : DEFAULT_SETTINGS;

  // 1. Try Firestore if available
  try {
    if (isFirestoreReady()) {
      const doc = await adminDb.collection('community_settings').doc(docId).get();
      if (doc.exists) {
        const data = doc.data() as CommunitySettings;
        if (data?.activeWhatsAppUrl) {
          return {
            ...defaultSettings,
            ...data,
          };
        }
      }
    }
  } catch (err) {
    console.warn(`[Community Service] Firestore read error for ${communityType}, falling back to local file:`, err);
  }

  // 2. Fallback to local JSON storage
  try {
    ensureDirectoryExists(filePath);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.activeWhatsAppUrl === 'string') {
        return parsed as CommunitySettings;
      }
    }
  } catch (err) {
    console.error(`[Community Service] Local settings file read error for ${communityType}:`, err);
  }

  // 3. Fallback to default initial settings and seed file
  try {
    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
  } catch {}

  return defaultSettings;
}

/**
 * Update the active WhatsApp group URL (Admin only)
 */
export async function updateCommunityWhatsAppUrl(
  newUrl: string,
  updatedBy: string,
  note?: string,
  communityType: CommunityType = 'student_parent'
): Promise<CommunitySettings> {
  const validation = validateWhatsAppUrl(newUrl);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid WhatsApp URL');
  }

  const isCounsellor = communityType === 'counsellor_mentor';
  const docId = isCounsellor ? 'counsellor_whatsapp_config' : 'whatsapp_config';
  const filePath = isCounsellor ? COUNSELLOR_SETTINGS_FILE : SETTINGS_FILE;

  const current = await getCommunitySettings(communityType);
  const now = new Date().toISOString();
  const historyItem: LinkHistoryItem = {
    id: `hist_${isCounsellor ? 'counsellor_' : ''}${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    url: newUrl.trim(),
    previousUrl: current.activeWhatsAppUrl,
    updatedBy: updatedBy || 'Administrator',
    updatedAt: now,
    note: note?.trim() || '',
  };

  const updatedSettings: CommunitySettings = {
    ...current,
    activeWhatsAppUrl: newUrl.trim(),
    updatedAt: now,
    updatedBy: updatedBy || 'Administrator',
    history: [historyItem, ...(current.history || [])].slice(0, 50), // keep latest 50 history entries
  };

  // 1. Write to local JSON storage
  try {
    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, JSON.stringify(updatedSettings, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[Community Service] Failed writing local settings for ${communityType}:`, err);
  }

  // 2. Write to Firestore
  try {
    if (isFirestoreReady()) {
      await adminDb.collection('community_settings').doc(docId).set(updatedSettings);
    }
  } catch (err) {
    console.warn(`[Community Service] Firestore settings write error for ${communityType}:`, err);
  }

  return updatedSettings;
}

export interface SaveCommunityLeadInput {
  name: string;
  phone: string;
  email: string;
  schoolName?: string;
  grade?: string;
  priorityGoal?: string;
  linkedInUrl?: string;
  campaign?: CommunityCampaign;
}

/**
 * Save a new community lead from the landing page
 */
export async function saveCommunityLead(
  data: SaveCommunityLeadInput,
  metadata?: { ip?: string; userAgent?: string }
): Promise<CommunityLead> {
  const now = new Date().toISOString();
  const isCounsellor = data.campaign === 'mentor_counsellor_community';
  const id = `comm_${isCounsellor ? 'couns_' : ''}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const priorityGoal = data.priorityGoal?.trim() || '';

  const lead: CommunityLead = {
    id,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim().toLowerCase(),
    schoolName: data.schoolName ? data.schoolName.trim() : undefined,
    grade: data.grade ? data.grade.trim() : undefined,
    priorityGoal: priorityGoal || undefined,
    linkedInUrl: data.linkedInUrl ? data.linkedInUrl.trim() : undefined,
    source: isCounsellor ? 'mentor_counsellor_community' : 'clarvo_student_parent_community',
    status: 'new',
    createdAt: now,
    updatedAt: now,
    ip: metadata?.ip || '',
    userAgent: metadata?.userAgent || '',
  };

  // 1. Save to local JSON leads file
  try {
    ensureDirectoryExists(LEADS_FILE);
    let currentLeads: CommunityLead[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) currentLeads = parsed;
    }
    currentLeads.unshift(lead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(currentLeads, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Community Service] Local lead write error:', err);
  }

  // 2. Save to Firestore community_leads collection (filtering out any undefined fields)
  try {
    if (isFirestoreReady()) {
      const cleanDoc = Object.fromEntries(
        Object.entries(lead).filter(([_, v]) => v !== undefined)
      );
      await adminDb.collection('community_leads').doc(id).set(cleanDoc);
    }
  } catch (err) {
    console.warn('[Community Service] Firestore lead write error:', err);
  }

  // 3. Mirror into demo_enquiries for centralized admin visibility
  try {
    if (isCounsellor) {
      await createEnquiry({
        parentName: lead.name,
        phone: lead.phone,
        email: lead.email,
        studentName: lead.name,
        academicLevel: 'Counsellor / Mentor Community',
        grade: 'Professional Counsellor / Mentor',
        schoolName: lead.linkedInUrl || 'Independent / Educational Counsellor',
        developmentAreas: ['Global Counselling Association', 'Mentor Network'],
        clarvoExploration: ['Global Counselling Association WhatsApp Community'],
        preferredTimeFrame: 'Immediate',
        notes: `Joined CLARVO Global Counselling Association WhatsApp Community via QR Landing Page (/join-counsellor-community).${lead.linkedInUrl ? ` LinkedIn: ${lead.linkedInUrl}` : ''}`,
        consent: true,
        sourcePage: '/join-counsellor-community',
      });
    } else {
      await createEnquiry({
        parentName: lead.name,
        phone: lead.phone,
        email: lead.email,
        studentName: lead.name,
        academicLevel: 'High School (Grades 7-12)',
        grade: lead.grade || '',
        schoolName: lead.schoolName || '',
        developmentAreas: [priorityGoal || 'WhatsApp Community'],
        clarvoExploration: ['Student & Parent WhatsApp Community'],
        preferredTimeFrame: 'Immediate',
        notes: `Joined CLARVO Student & Parent WhatsApp Community via QR Landing Page (/join-community).${priorityGoal ? ` Priority: ${priorityGoal}.` : ''}`,
        consent: true,
        sourcePage: '/join-community',
      });
    }
  } catch (err) {
    console.warn('[Community Service] Mirror to enquiry error:', err);
  }

  return lead;
}

/**
 * Check if a lead is test data
 */
export function isTestLead(lead: Partial<CommunityLead>): boolean {
  if (!lead) return false;
  const email = (lead.email || '').toLowerCase();
  const name = (lead.name || '').toLowerCase();
  return (
    email.includes('test') ||
    email.includes('example.com') ||
    email.includes('@clarvo.test') ||
    name.includes('test') ||
    name === 'aarav sharma'
  );
}

/**
 * Delete a single community lead by ID
 */
export async function deleteCommunityLead(leadId: string): Promise<boolean> {
  // 1. Delete from local JSON
  try {
    ensureDirectoryExists(LEADS_FILE);
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((l: CommunityLead) => l.id !== leadId);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
      }
    }
  } catch (err) {
    console.error('[Community Service] Error deleting local lead:', err);
  }

  // 2. Delete from Firestore
  try {
    if (isFirestoreReady()) {
      await adminDb.collection('community_leads').doc(leadId).delete();
    }
  } catch (err) {
    console.warn('[Community Service] Firestore delete lead error:', err);
  }

  return true;
}

/**
 * Purge all test leads from storage
 */
export async function purgeTestLeads(): Promise<number> {
  let count = 0;
  try {
    ensureDirectoryExists(LEADS_FILE);
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        const nonTest = parsed.filter((l: CommunityLead) => !isTestLead(l));
        count += parsed.length - nonTest.length;
        fs.writeFileSync(LEADS_FILE, JSON.stringify(nonTest, null, 2), 'utf-8');
      }
    }
  } catch {}

  try {
    if (isFirestoreReady()) {
      const snapshot = await adminDb.collection('community_leads').get();
      for (const doc of snapshot.docs) {
        const data = doc.data() as CommunityLead;
        if (isTestLead(data)) {
          await doc.ref.delete();
          count++;
        }
      }
    }
  } catch {}

  return count;
}

/**
 * Retrieve all community leads for the admin dashboard (optional filter by campaign)
 */
export async function getCommunityLeads(campaign?: CommunityCampaign): Promise<CommunityLead[]> {
  const leadsMap = new Map<string, CommunityLead>();

  // 1. First populate from local file (always instant and resilient)
  try {
    ensureDirectoryExists(LEADS_FILE);
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        for (const lead of parsed) {
          if (lead && lead.id && !isTestLead(lead)) {
            if (!campaign || lead.source === campaign) {
              leadsMap.set(lead.id, lead);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[Community Service] Error reading local leads file:', err);
  }

  // 2. Fetch and merge from Firestore community_leads collection
  try {
    if (isFirestoreReady()) {
      let query: FirebaseFirestore.Query = adminDb
        .collection('community_leads')
        .orderBy('createdAt', 'desc')
        .limit(200);

      if (campaign) {
        query = query.where('source', '==', campaign);
      }

      const snapshot = await query.get();

      if (!snapshot.empty) {
        snapshot.docs.forEach((doc) => {
          const data = doc.data() as CommunityLead;
          if (data && data.id && !isTestLead(data)) {
            leadsMap.set(data.id, data);
          }
        });
      }
    }
  } catch (err) {
    console.warn('[Community Service] Firestore leads fetch error:', err);
  }

  const allLeads = Array.from(leadsMap.values());
  allLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return allLeads;
}
