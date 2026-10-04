/**
 * Career Roadmap API — Graph Explorer
 * ────────────────────────────────────
 * GET /api/career-roadmap/graph?nodeId=X&depth=2  → subgraph from nodeId
 * GET /api/career-roadmap/graph?start=true         → start options + root graph
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getSubgraph,
  getStartOptions,
  getNode,
  getDatasetMeta,
  getAvailableNodeTypes,
  getOutgoingEdges,
  isTrueRoadmapEndpoint,
  getRoadmapFrontier,
} from '@/lib/career-roadmap-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const nodeId = searchParams.get('nodeId');
    const depth = Math.min(parseInt(searchParams.get('depth') || '2', 10), 4);
    const isStart = searchParams.get('start') === 'true';

    if (isStart) {
      const startOptions = getStartOptions();
      const meta = getDatasetMeta();
      const nodeTypes = getAvailableNodeTypes();

      // Build initial graph from LEVEL_001 (10th S.S.C.)
      const rootGraph = getSubgraph('LEVEL_001', 1);

      return NextResponse.json({
        startOptions,
        meta,
        nodeTypes,
        graph: {
          nodes: rootGraph.nodes.map(n => ({
            id: n.id,
            type: n.type,
            label: n.displayName || n.canonicalName,
            status: n.status,
            confidence: n.canonicalConfidence || n.confidence,
            childCount: getRoadmapFrontier(n.id).length,
            isEndpoint: isTrueRoadmapEndpoint(n.id),
          })),
          edges: rootGraph.edges.map(e => ({
            id: e.id,
            source: e.fromNodeId,
            target: e.toNodeId,
            edgeType: e.edgeType,
            label: e.edgeType.replace(/_/g, ' '),
            condition: e.condition,
            durationText: e.durationText,
          })),
        },
      });
    }

    if (!nodeId) {
      return NextResponse.json(
        { error: 'nodeId parameter is required' },
        { status: 400 }
      );
    }

    const node = getNode(nodeId);
    if (!node) {
      return NextResponse.json(
        { error: `Node "${nodeId}" not found` },
        { status: 404 }
      );
    }

    const subgraph = getSubgraph(nodeId, depth);

    return NextResponse.json({
      root: {
        id: node.id,
        type: node.type,
        label: node.displayName || node.canonicalName,
        status: node.status,
        childCount: getRoadmapFrontier(node.id).length,
        isEndpoint: isTrueRoadmapEndpoint(node.id),
      },
      graph: {
        nodes: subgraph.nodes.map(n => ({
          id: n.id,
          type: n.type,
          label: n.displayName || n.canonicalName,
          status: n.status,
          confidence: n.canonicalConfidence || n.confidence,
          childCount: getRoadmapFrontier(n.id).length,
          isEndpoint: isTrueRoadmapEndpoint(n.id),
        })),
        edges: subgraph.edges.map(e => ({
          id: e.id,
          source: e.fromNodeId,
          target: e.toNodeId,
          edgeType: e.edgeType,
          label: e.edgeType.replace(/_/g, ' '),
          condition: e.condition,
          durationText: e.durationText,
        })),
      },
    });
  } catch (error) {
    console.error('[career-roadmap/graph] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
