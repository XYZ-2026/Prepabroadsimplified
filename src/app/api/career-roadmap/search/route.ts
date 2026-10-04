/**
 * Career Roadmap API — Search
 * ────────────────────────────
 * GET /api/career-roadmap/search?q=engineering&limit=20 → search nodes by name
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchNodes } from '@/lib/career-roadmap-service';
import { NODE_TYPE_CONFIG } from '@/lib/career-roadmap-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get('q') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    if (query.length < 2) {
      return NextResponse.json({ results: [], query });
    }

    const nodes = searchNodes(query, limit);

    return NextResponse.json({
      query,
      resultCount: nodes.length,
      results: nodes.map(n => ({
        id: n.id,
        type: n.type,
        typeLabel: NODE_TYPE_CONFIG[n.type]?.label || n.type,
        icon: NODE_TYPE_CONFIG[n.type]?.icon || '📌',
        label: n.displayName || n.canonicalName,
        canonicalName: n.canonicalName,
        status: n.status,
        confidence: n.canonicalConfidence || n.confidence,
      })),
    });
  } catch (error) {
    console.error('[career-roadmap/search] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
