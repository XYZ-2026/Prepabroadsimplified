import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const claims = await verifySessionCookie();
    if (!claims) {
      return NextResponse.json({
        authenticated: false,
        hasCompletedTest: false,
        results: [],
        resultsByType: {},
      });
    }

    const { searchParams } = new URL(request.url);
    const requestedType = searchParams.get('type'); // e.g. 'junior', 'grade10', 'senior'

    const results: Array<{
      resultId: string;
      testName: string;
      assessmentType: string;
      assessmentVariant: string;
      createdAt: string;
      reportUrl: string;
    }> = [];

    // Fetch user's completed psychometric results from Firestore
    try {
      const snapshot = await adminDb
        .collection('psychometric_results')
        .where('userId', '==', claims.uid)
        .get();

      if (!snapshot.empty) {
        snapshot.docs.forEach(doc => {
          const d = doc.data();
          results.push({
            resultId: doc.id,
            testName: d.testName || 'Psychometric Assessment',
            assessmentType: d.assessmentType || (d.testType || 'senior'),
            assessmentVariant: d.assessmentVariant || '',
            createdAt: d.createdAt || '',
            reportUrl: `/psychometric-test?resultId=${doc.id}`,
          });
        });
      }
    } catch (dbErr) {
      console.warn('[User Status Route] Firestore fetch fallback:', dbErr);
    }

    // Also check memory cache fallback
    const gCache = (globalThis as any).__psychometricResultsCache;
    if (gCache) {
      for (const [id, d] of gCache.entries()) {
        if (d.userId === claims.uid && !results.some(r => r.resultId === id)) {
          results.push({
            resultId: id,
            testName: d.testName || 'Psychometric Assessment',
            assessmentType: d.assessmentType || (d.testType || 'senior'),
            assessmentVariant: d.assessmentVariant || '',
            createdAt: d.createdAt || '',
            reportUrl: `/psychometric-test?resultId=${id}`,
          });
        }
      }
    }

    if (results.length === 0) {
      return NextResponse.json({
        authenticated: true,
        hasCompletedTest: false,
        results: [],
        resultsByType: {},
        latestResultId: null,
      });
    }

    // Sort most recent first
    results.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return timeB - timeA;
    });

    // Group by category/type: 'junior', 'grade10', 'senior'
    const resultsByType: Record<string, typeof results[0]> = {};
    for (const r of results) {
      const t = (r.assessmentType || '').toLowerCase();
      const v = (r.assessmentVariant || '').toUpperCase();

      if (t === 'junior' || v === 'JUNIOR_7_9' || t.includes('junior') || t.includes('7') || t.includes('8') || t.includes('9')) {
        if (!resultsByType['junior']) resultsByType['junior'] = r;
      } else if (t === 'grade10' || v === 'CLASS_10' || t.includes('10')) {
        if (!resultsByType['grade10']) resultsByType['grade10'] = r;
      } else {
        if (!resultsByType['senior']) resultsByType['senior'] = r;
      }
    }

    let matchingResult: typeof results[0] | null = null;
    if (requestedType) {
      const reqLower = requestedType.toLowerCase();
      if (reqLower === 'junior' || reqLower.includes('7') || reqLower.includes('9')) {
        matchingResult = resultsByType['junior'] || null;
      } else if (reqLower === 'grade10' || reqLower.includes('10')) {
        matchingResult = resultsByType['grade10'] || null;
      } else if (reqLower === 'senior' || reqLower === 'grade12' || reqLower.includes('12')) {
        matchingResult = resultsByType['senior'] || null;
      }
    }

    return NextResponse.json({
      authenticated: true,
      hasCompletedTest: true,
      totalCompleted: results.length,
      latestResultId: results[0].resultId,
      latestReportUrl: results[0].reportUrl,
      matchingResult,
      resultsByType,
      results,
    });
  } catch (error: any) {
    console.error('Error fetching psychometric user status:', error);
    return NextResponse.json(
      { authenticated: false, hasCompletedTest: false, results: [], resultsByType: {} },
      { status: 200 }
    );
  }
}
