/**
 * Career Roadmap API — Node Detail
 * ─────────────────────────────────
 * GET /api/career-roadmap/node?id=NODE_ID → full node detail with relationships
 */

import { NextRequest, NextResponse } from 'next/server';
import { getNodeDetail } from '@/lib/career-roadmap-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const nodeId = searchParams.get('id');

    if (!nodeId) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 400 }
      );
    }

    const detail = getNodeDetail(nodeId);
    if (!detail) {
      return NextResponse.json(
        { error: `Node "${nodeId}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      node: {
        id: detail.node.id,
        type: detail.node.type,
        canonicalName: detail.node.canonicalName,
        displayName: detail.node.displayName,
        description: detail.node.description,
        status: detail.node.status,
        canonicalStatus: detail.node.canonicalStatus,
        confidence: detail.node.canonicalConfidence || detail.node.confidence,
        applicationStage: detail.node.applicationStage,
        parentDomain: detail.node.parentDomain,
        whatIsIt: detail.node.whatIsIt,
        whatYouStudy: detail.node.whatYouStudy,
        duration: detail.node.duration,
        eligibility: detail.node.eligibility,
        skills: detail.node.skills,
        typicalEntryRoute: detail.node.typicalEntryRoute,
        furtherStudy: detail.node.furtherStudy,
        careerOptions: detail.node.careerOptions,
        sourceName: detail.node.sourceName,
        sourcePage: detail.node.sourcePage,
      },
      connections: {
        incoming: detail.incomingEdges.map(e => ({
          id: e.id,
          fromNodeId: e.fromNodeId,
          fromName: e.fromName,
          fromType: e.fromType,
          edgeType: e.edgeType,
          condition: e.condition,
          durationText: e.durationText,
        })),
        outgoing: detail.outgoingEdges.map(e => ({
          id: e.id,
          toNodeId: e.toNodeId,
          toName: e.toName,
          toType: e.toType,
          edgeType: e.edgeType,
          condition: e.condition,
          durationText: e.durationText,
        })),
      },
      relatedProgrammes: detail.relatedProgrammes.map(p => ({
        id: p.id,
        name: p.fullName || p.canonicalName,
        degreeType: p.degreeType,
        duration: p.currentCanonicalDuration,
        eligibility: p.eligibility,
        fieldNames: p.fieldNames,
      })),
      relatedCareers: detail.relatedCareers.map(c => ({
        id: c.id,
        name: c.canonicalName,
        category: c.careerCategory,
        skillArea: c.skillArea,
      })),
      relatedColleges: detail.relatedColleges.slice(0, 20).map(c => ({
        id: c.id,
        collegeName: c.collegeName,
        programmeName: c.programmeName,
        confidence: c.confidence,
        status: c.status,
      })),
      relatedExams: detail.relatedExams.map(e => ({
        id: e.id,
        examName: e.examName,
        programmeName: e.programmeName,
        eligibilityContext: e.eligibilityContext,
      })),
      continuation: detail.continuation,
      enrichment: detail.enrichment,
    });
  } catch (error) {
    console.error('[career-roadmap/node] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
