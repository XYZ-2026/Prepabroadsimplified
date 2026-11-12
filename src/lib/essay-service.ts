// Student-owned essay drafts — Firestore: users/{uid}/essays/{essayId}
// Server-only. The path is always built from the authenticated uid, so a student can never reach another student's essays.
import { adminDb } from '@/lib/firebase-admin';

export const ESSAY_TYPES = ['SOP', 'Personal Essay', 'Supplemental Essay', 'Scholarship Essay', 'Other'] as const;
export type EssayType = (typeof ESSAY_TYPES)[number];
export const ESSAY_STATUSES = ['draft', 'final'] as const;
export type EssayStatus = (typeof ESSAY_STATUSES)[number];

export const MAX_ESSAYS_PER_STUDENT = 25;
export const MAX_ESSAY_CHARS = 20000;

export interface EssayRecord {
  id: string;
  title: string;
  type: EssayType;
  targetUniversity: string;
  prompt: string;
  content: string;
  wordCount: number;
  status: EssayStatus;
  createdAt: string;
  updatedAt: string;
}

export type EssaySummary = Omit<EssayRecord, 'content' | 'prompt'> & { excerpt: string };

export const ESSAY_ID_PATTERN = /^[A-Za-z0-9]{10,40}$/;

export class EssayError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

const col = (uid: string) => adminDb.collection('users').doc(uid).collection('essays');

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').slice(0, max) : '';

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function toRecord(id: string, d: FirebaseFirestore.DocumentData): EssayRecord {
  const content = typeof d.content === 'string' ? d.content : '';
  return {
    id,
    title: d.title || 'Untitled essay',
    type: (ESSAY_TYPES as readonly string[]).includes(d.type) ? d.type : 'Other',
    targetUniversity: d.targetUniversity || '',
    prompt: d.prompt || '',
    content,
    wordCount: typeof d.wordCount === 'number' ? d.wordCount : countWords(content),
    status: d.status === 'final' ? 'final' : 'draft',
    createdAt: d.createdAt || '',
    updatedAt: d.updatedAt || d.createdAt || '',
  };
}

export async function listEssays(uid: string): Promise<EssaySummary[]> {
  const snap = await col(uid).get();
  return snap.docs
    .map((doc) => toRecord(doc.id, doc.data()))
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
    .map(({ content, prompt, ...rest }) => ({ ...rest, excerpt: content.replace(/\s+/g, ' ').trim().slice(0, 160) }));
}

export async function getEssay(uid: string, id: string): Promise<EssayRecord | null> {
  if (!ESSAY_ID_PATTERN.test(id)) return null;
  const doc = await col(uid).doc(id).get();
  return doc.exists ? toRecord(doc.id, doc.data() || {}) : null;
}

export async function createEssay(uid: string, input: Record<string, unknown>): Promise<EssayRecord> {
  const existing = await col(uid).count().get();
  if (existing.data().count >= MAX_ESSAYS_PER_STUDENT) {
    throw new EssayError(`You can keep up to ${MAX_ESSAYS_PER_STUDENT} essays. Delete one to add another.`, 409);
  }

  const now = new Date().toISOString();
  const content = clean(input.content, MAX_ESSAY_CHARS);
  const type = (ESSAY_TYPES as readonly string[]).includes(input.type as string) ? (input.type as EssayType) : 'SOP';
  const data = {
    title: clean(input.title, 120).trim() || 'Untitled essay',
    type,
    targetUniversity: clean(input.targetUniversity, 120).trim(),
    prompt: clean(input.prompt, 1000),
    content,
    wordCount: countWords(content),
    status: 'draft' as EssayStatus,
    createdAt: now,
    updatedAt: now,
  };
  const ref = await col(uid).add(data);
  return { id: ref.id, ...data };
}

export async function updateEssay(uid: string, id: string, input: Record<string, unknown>): Promise<EssayRecord> {
  if (!ESSAY_ID_PATTERN.test(id)) throw new EssayError('Essay not found.', 404);
  const ref = col(uid).doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new EssayError('Essay not found.', 404);

  const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (input.title !== undefined) patch.title = clean(input.title, 120).trim() || 'Untitled essay';
  if (input.targetUniversity !== undefined) patch.targetUniversity = clean(input.targetUniversity, 120).trim();
  if (input.prompt !== undefined) patch.prompt = clean(input.prompt, 1000);
  if (input.type !== undefined && (ESSAY_TYPES as readonly string[]).includes(input.type as string)) patch.type = input.type;
  if (input.status !== undefined && (ESSAY_STATUSES as readonly string[]).includes(input.status as string)) patch.status = input.status;
  if (input.content !== undefined) {
    const content = clean(input.content, MAX_ESSAY_CHARS);
    patch.content = content;
    patch.wordCount = countWords(content);
  }

  await ref.set(patch, { merge: true });
  const fresh = await ref.get();
  return toRecord(fresh.id, fresh.data() || {});
}

export async function deleteEssay(uid: string, id: string): Promise<void> {
  if (!ESSAY_ID_PATTERN.test(id)) throw new EssayError('Essay not found.', 404);
  await col(uid).doc(id).delete();
}
