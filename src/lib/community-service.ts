import fs from 'fs';
import path from 'path';
import { adminDb } from '@/lib/firebase-admin';
import { createEnquiry } from '@/lib/enquiry-service';

export interface CommunityLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  schoolName: string;
  grade: string;
  priorityGoal?: string;
  source: 'clarvo_student_parent_community';
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
const LEADS_FILE = path.join(process.cwd(), 'src', 'data', 'community-leads.json');

const INITIAL_WHATSAPP_URL = 'https://chat.whatsapp.com/JevCH59LcE33ahR612sLEG';

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
export async function getCommunitySettings(): Promise<CommunitySettings> {
  // 1. Try Firestore if available
  try {
    if (isFirestoreReady()) {
      const doc = await adminDb.collection('community_settings').doc('whatsapp_config').get();
      if (doc.exists) {
        const data = doc.data() as CommunitySettings;
        if (data?.activeWhatsAppUrl) {
          return {
            ...DEFAULT_SETTINGS,
            ...data,
          };
        }
      }
    }
  } catch (err) {
    console.warn('[Community Service] Firestore read error, falling back to local file:', err);
  }

  // 2. Fallback to local JSON storage
  try {
    ensureDirectoryExists(SETTINGS_FILE);
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.activeWhatsAppUrl === 'string') {
        return parsed as CommunitySettings;
      }
    }
  } catch (err) {
    console.error('[Community Service] Local settings file read error:', err);
  }

  // 3. Fallback to default initial settings and seed file
  try {
    ensureDirectoryExists(SETTINGS_FILE);
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
  } catch {}

  return DEFAULT_SETTINGS;
}

/**
 * Update the active WhatsApp group URL (Admin only)
 */
export async function updateCommunityWhatsAppUrl(
  newUrl: string,
  updatedBy: string,
  note?: string
): Promise<CommunitySettings> {
  const validation = validateWhatsAppUrl(newUrl);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid WhatsApp URL');
  }

  const current = await getCommunitySettings();
  const now = new Date().toISOString();
  const historyItem: LinkHistoryItem = {
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
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
    ensureDirectoryExists(SETTINGS_FILE);
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Community Service] Failed writing local settings:', err);
  }

  // 2. Write to Firestore
  try {
    if (isFirestoreReady()) {
      await adminDb.collection('community_settings').doc('whatsapp_config').set(updatedSettings);
    }
  } catch (err) {
    console.warn('[Community Service] Firestore settings write error:', err);
  }

  return updatedSettings;
}

/**
 * Save a new community lead from the landing page
 */
export async function saveCommunityLead(
  data: {
    name: string;
    phone: string;
    email: string;
    schoolName: string;
    grade: string;
    priorityGoal?: string;
  },
  metadata?: { ip?: string; userAgent?: string }
): Promise<CommunityLead> {
  const now = new Date().toISOString();
  const id = `comm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const priorityGoal = data.priorityGoal?.trim() || '';

  const lead: CommunityLead = {
    id,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim().toLowerCase(),
    schoolName: data.schoolName.trim(),
    grade: data.grade.trim(),
    priorityGoal,
    source: 'clarvo_student_parent_community',
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

  // 2. Save to Firestore community_leads collection
  try {
    if (isFirestoreReady()) {
      await adminDb.collection('community_leads').doc(id).set(lead);
    }
  } catch (err) {
    console.warn('[Community Service] Firestore lead write error:', err);
  }

  // 3. Mirror into demo_enquiries for centralized admin visibility
  try {
    await createEnquiry({
      parentName: lead.name,
      phone: lead.phone,
      email: lead.email,
      studentName: lead.name,
      academicLevel: 'High School (Grades 7-12)',
      grade: lead.grade,
      schoolName: lead.schoolName,
      developmentAreas: [priorityGoal || 'WhatsApp Community'],
      clarvoExploration: ['Student & Parent WhatsApp Community'],
      preferredTimeFrame: 'Immediate',
      notes: `Joined CLARVO Student & Parent WhatsApp Community via QR Landing Page (/join-community).${priorityGoal ? ` Priority: ${priorityGoal}.` : ''}`,
      consent: true,
      sourcePage: '/join-community',
    });
  } catch (err) {
    console.warn('[Community Service] Mirror to enquiry error:', err);
  }

  return lead;
}

/**
 * Retrieve all community leads for the admin dashboard
 */
export async function getCommunityLeads(): Promise<CommunityLead[]> {
  const leadsMap = new Map<string, CommunityLead>();

  // 1. First populate from local file (always instant and resilient)
  try {
    ensureDirectoryExists(LEADS_FILE);
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        for (const lead of parsed) {
          if (lead && lead.id) {
            leadsMap.set(lead.id, lead);
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
      const snapshot = await adminDb
        .collection('community_leads')
        .orderBy('createdAt', 'desc')
        .limit(200)
        .get();

      if (!snapshot.empty) {
        snapshot.docs.forEach((doc) => {
          const data = doc.data() as CommunityLead;
          if (data && data.id) {
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
