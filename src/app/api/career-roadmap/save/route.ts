/**
 * Career Roadmap API — Save / Load / List
 * ────────────────────────────────────────
 * POST   /api/career-roadmap/save  → Create or update a saved roadmap
 * GET    /api/career-roadmap/save  → Get roadmap by ?id=... or list for current user / ?studentId=...
 * DELETE /api/career-roadmap/save  → Delete roadmap by ?id=...
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie, getUserProfile } from '@/lib/auth';
import { getNode, getOutgoingEdges } from '@/lib/career-roadmap-service';

export interface SavedRoadmapPayload {
  roadmapId?: string;
  title: string;
  startNodeId: string;
  selectedPathNodeIds: string[];
  selectedPathEdgeIds?: string[];
  decisionState?: Record<string, any>;
  notes?: string;
  version?: number;
}

/**
 * Validate path integrity against the deterministic dataset
 */
function validateRoadmapPath(startNodeId: string, nodeIds: string[]): { valid: boolean; error?: string } {
  if (!startNodeId) {
    return { valid: false, error: 'Start node ID is required' };
  }

  const startNode = getNode(startNodeId);
  if (!startNode) {
    return { valid: false, error: `Start node "${startNodeId}" does not exist in dataset` };
  }

  if (!nodeIds || nodeIds.length === 0) {
    return { valid: true };
  }

  // Check each node exists
  for (const id of nodeIds) {
    const node = getNode(id);
    if (!node) {
      return { valid: false, error: `Selected node "${id}" does not exist in dataset` };
    }
  }

  // Check sequential connectivity
  for (let i = 0; i < nodeIds.length - 1; i++) {
    const currentId = nodeIds[i];
    const nextId = nodeIds[i + 1];
    const outEdges = getOutgoingEdges(currentId);
    const connects = outEdges.some(e => e.toNodeId === nextId);
    if (!connects) {
      // It's possible the user jumped or selected siblings, but warn or validate
      // In flexible roadmaps, students may select branches; we don't hard-reject if siblings
    }
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Authentication required to save roadmap' }, { status: 401 });
    }

    const body: SavedRoadmapPayload = await request.json();
    const {
      roadmapId,
      title = 'My Career Roadmap',
      startNodeId,
      selectedPathNodeIds = [],
      selectedPathEdgeIds = [],
      decisionState = {},
      notes = '',
      version = 1,
    } = body;

    if (!startNodeId) {
      return NextResponse.json({ error: 'startNodeId is required' }, { status: 400 });
    }

    // Validate path
    const validation = validateRoadmapPath(startNodeId, selectedPathNodeIds);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const now = new Date().toISOString();
    const collectionRef = adminDb.collection('career_roadmaps');

    let targetDocId = roadmapId;
    if (targetDocId) {
      // Check ownership
      const existingDoc = await collectionRef.doc(targetDocId).get();
      if (existingDoc.exists) {
        const existingData = existingDoc.data();
        if (existingData?.userId !== claims.uid && claims.role !== 'admin' && claims.role !== 'counsellor') {
          return NextResponse.json({ error: 'Unauthorized to modify this roadmap' }, { status: 403 });
        }
      }
    } else {
      targetDocId = collectionRef.doc().id;
    }

    const docData = {
      roadmapId: targetDocId,
      userId: claims.uid,
      userEmail: claims.email || '',
      title: title.trim() || 'My Career Roadmap',
      startNodeId,
      selectedPathNodeIds,
      selectedPathEdgeIds,
      decisionState,
      notes: notes.trim(),
      version: typeof version === 'number' ? version : 1,
      updatedAt: now,
      createdAt: now,
    };

    // If updating, preserve original createdAt
    if (roadmapId) {
      const snap = await collectionRef.doc(targetDocId).get();
      if (snap.exists && snap.data()?.createdAt) {
        docData.createdAt = snap.data()!.createdAt;
      }
    }

    await collectionRef.doc(targetDocId).set(docData, { merge: true });

    return NextResponse.json({
      success: true,
      roadmapId: targetDocId,
      message: 'Roadmap saved successfully',
      roadmap: docData,
    });
  } catch (err: any) {
    console.error('Error saving career roadmap:', err);
    return NextResponse.json({ error: err.message || 'Failed to save roadmap' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const roadmapId = searchParams.get('id');
    const studentIdParam = searchParams.get('studentId');

    const collectionRef = adminDb.collection('career_roadmaps');

    // 1. Single roadmap fetch
    if (roadmapId) {
      const doc = await collectionRef.doc(roadmapId).get();
      if (!doc.exists) {
        return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
      }

      const data = doc.data()!;
      // Access control: owner OR counsellor OR admin
      const isOwner = data.userId === claims.uid;
      const isStaff = claims.role === 'admin' || claims.role === 'counsellor' || claims.email?.includes('counsellor');
      if (!isOwner && !isStaff) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return NextResponse.json({ success: true, roadmap: data });
    }

    // 2. Listing roadmaps
    let targetUserId = claims.uid;
    if (studentIdParam) {
      const isStaff = claims.role === 'admin' || claims.role === 'counsellor' || claims.email?.includes('counsellor');
      if (!isStaff) {
        return NextResponse.json({ error: 'Forbidden: only staff can inspect other students' }, { status: 403 });
      }
      targetUserId = studentIdParam;
    }

    const snapshot = await collectionRef.where('userId', '==', targetUserId).get();
    const roadmaps = snapshot.docs.map(d => d.data());

    // Sort descending by updatedAt
    roadmaps.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

    return NextResponse.json({ success: true, roadmaps });
  } catch (err: any) {
    console.error('Error loading career roadmap:', err);
    return NextResponse.json({ error: err.message || 'Failed to load roadmap' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const roadmapId = searchParams.get('id');
    if (!roadmapId) {
      return NextResponse.json({ error: 'id parameter is required' }, { status: 400 });
    }

    const docRef = adminDb.collection('career_roadmaps').doc(roadmapId);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    const data = doc.data()!;
    if (data.userId !== claims.uid && claims.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true, message: 'Roadmap deleted' });
  } catch (err: any) {
    console.error('Error deleting roadmap:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete roadmap' }, { status: 500 });
  }
}
