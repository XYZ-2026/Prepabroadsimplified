import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';
import { getAllCareerProfiles, extractMatchScoresFromReport } from '@/lib/career-library/career-service';

export async function GET() {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({
        authenticated: false,
        hasReport: false,
        matches: {}
      });
    }

    const userId = claims.uid;
    const allProfiles = getAllCareerProfiles();

    // Query user's psychometric results (most recent completed test)
    let latestResult: any = null;
    try {
      const snap = await adminDb
        .collection('psychometric_results')
        .where('userId', '==', userId)
        .get();

      if (!snap.empty) {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a: any, b: any) => {
          const tA = new Date(a.createdAt || 0).getTime();
          const tB = new Date(b.createdAt || 0).getTime();
          return tB - tA;
        });
        latestResult = docs[0];
      }
    } catch (dbErr) {
      console.warn('[Career Library API] Firestore fetch warning:', dbErr);
    }

    // In-memory cache fallback if Firestore had no connection in dev
    if (!latestResult) {
      const gCache = (globalThis as any).__psychometricResultsCache;
      if (gCache) {
        for (const [, d] of gCache.entries()) {
          if (d.userId === userId) {
            latestResult = d;
            break;
          }
        }
      }
    }

    if (!latestResult) {
      return NextResponse.json({
        authenticated: true,
        hasReport: false,
        matches: {}
      });
    }

    // Extract validated match scores
    const matchScores = extractMatchScoresFromReport(latestResult, allProfiles);

    const simplifiedMatches: Record<string, number> = {};
    for (const [id, matchObj] of Object.entries(matchScores)) {
      if (typeof matchObj.matchScore === 'number') {
        simplifiedMatches[id] = matchObj.matchScore;
      }
    }

    return NextResponse.json({
      authenticated: true,
      hasReport: true,
      testName: latestResult.testName || 'Psychometric Assessment',
      matches: simplifiedMatches
    });
  } catch (err: any) {
    console.error('[Career Library Match API Error]:', err);
    return NextResponse.json(
      { authenticated: false, hasReport: false, matches: {}, error: 'Failed to fetch match scores' },
      { status: 500 }
    );
  }
}
