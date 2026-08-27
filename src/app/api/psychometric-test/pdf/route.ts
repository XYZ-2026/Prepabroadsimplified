import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie, getUserRole } from '@/lib/auth';
import { buildClass10ExecutiveHTMLReport } from '@/app/(main)/psychometric-test/class10_html_report_builder';
import type { EditorialStudent, EditorialScores } from '@/app/(main)/psychometric-test/class10_editorial_engine';
import { getOrGenerateReportSnapshot } from '@/lib/report-snapshot-service';

export async function POST(req: NextRequest) {
  let browser: any = null;
  try {
    const decodedClaims = await verifySessionCookie();
    if (!decodedClaims) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { resultId, student: reqStudent, scores: reqScores, reportType = 'full' } = body;
    const urlType = new URL(req.url).searchParams.get('type');
    const isExecutive = reportType === 'executive' || urlType === 'executive';

    let data: any = null;
    let comparisonData: any = null;
    let parentProfile: any = null;

    if (resultId) {
      const role: any = await getUserRole();
      const resultSnap = await adminDb.collection('psychometric_results').doc(resultId).get();

      if (resultSnap.exists) {
        data = resultSnap.data();
        if (role === 'student' && data?.userId !== decodedClaims.uid) {
          return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
        }
      }

      // Fetch comparison and parent profile documents
      const compSnap = await adminDb.collection('assessment_comparisons').doc(resultId).get();
      if (compSnap.exists) {
        comparisonData = compSnap.data();
      }
      const parentSnap = await adminDb.collection('parent_assessments').doc(resultId).get();
      if (parentSnap.exists) {
        parentProfile = parentSnap.data()?.parentProfile;
      }
    }

    // Extract student & scores for Class 10 Report Builder
    let studentName = 'Candidate';
    let editorialStudent: EditorialStudent;
    let scores: EditorialScores;

    if (data) {
      const studentInfo = data.studentInfo || {};
      const studentObj = data.student || {};
      studentName = studentObj.name || studentInfo.name || data.name || data.userName || 'Candidate';
      
      if ((!studentName || studentName === 'Candidate') && data.userId) {
        try {
          const userSnap = await adminDb.collection('users').doc(data.userId).get();
          if (userSnap.exists && userSnap.data()?.name) {
            studentName = userSnap.data()?.name;
          }
        } catch (e) {
          console.warn('[PDF Route] Could not fetch name from user record:', e);
        }
      }
      
      editorialStudent = {
        name: studentName,
        grade: studentObj.grade || studentInfo.grade || 'Class 10',
        age: studentObj.age || studentInfo.age || '15',
        school: studentObj.school || studentInfo.school || '',
        city: studentObj.city || studentInfo.city || 'India',
        stream: studentObj.stream || studentInfo.stream || '',
        email: studentObj.email || studentInfo.email || data.email || '',
        date: data.createdAt || data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        reportId: `AS-10-${resultId.substring(0, 6).toUpperCase()}`,
        parentName: data.parentName || studentObj.parentName || studentInfo.parentName || '',
      };

      const overallApt = Math.round(
        ((data.scores?.aptitude?.numerical || 75) +
         (data.scores?.aptitude?.reasoning || 80) +
         (data.scores?.aptitude?.verbal || 75) +
         (data.scores?.aptitude?.spatial || 74)) / 4
      );

      scores = {
        aptitude: {
          verbal: data.scores?.aptitude?.verbal || 75,
          numerical: data.scores?.aptitude?.numerical || 78,
          reasoning: data.scores?.aptitude?.reasoning || 80,
          spatial: data.scores?.aptitude?.spatial || 74,
          overall: overallApt,
        },
        personality: {
          openness: data.scores?.personality?.openness || 75,
          conscientiousness: data.scores?.personality?.conscientiousness || 76,
          extraversion: data.scores?.personality?.extraversion || 68,
          agreeableness: data.scores?.personality?.agreeableness || 74,
          emotionalStability: data.scores?.personality?.emotionalStability || 70,
        },
        topRiasec: data.scores?.topRiasec || ['Investigative', 'Realistic', 'Artistic'],
        riasec: data.scores?.riasec || {},
        topVark: data.scores?.topVark || 'V',
        vark: data.scores?.vark || {},
        topValues: data.scores?.topValues || ['Autonomy', 'Mastery', 'Purpose'],
        careerFitment: data.scores?.careerFitment || [
          { name: 'STEM & Engineering Pathway', score: 95 },
          { name: 'Data Science & Analytical Computing', score: 92 },
          { name: 'Architecture & Design Systems', score: 88 },
          { name: 'Business Analytics & Commerce', score: 84 },
        ],
      };
    } else if (reqStudent && reqScores) {
      studentName = reqStudent.name || 'Candidate';
      editorialStudent = {
        name: studentName,
        grade: reqStudent.grade || 'Class 10',
        age: reqStudent.age || '15',
        school: reqStudent.school || '',
        city: reqStudent.city || 'India',
        stream: reqStudent.stream || '',
        email: reqStudent.email || '',
        date: reqStudent.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        reportId: reqStudent.reportId || `AS-10-${Math.floor(100000 + Math.random() * 900000)}`,
        parentName: reqStudent.parentName || '',
      };

      const overallApt = Math.round(
        ((reqScores?.aptitude?.numerical || 75) +
         (reqScores?.aptitude?.reasoning || 80) +
         (reqScores?.aptitude?.verbal || 75) +
         (reqScores?.aptitude?.spatial || 74)) / 4
      );

      scores = {
        aptitude: {
          verbal: reqScores?.aptitude?.verbal || 75,
          numerical: reqScores?.aptitude?.numerical || 78,
          reasoning: reqScores?.aptitude?.reasoning || 80,
          spatial: reqScores?.aptitude?.spatial || 74,
          overall: reqScores?.aptitude?.overall || overallApt,
        },
        personality: {
          openness: reqScores?.personality?.openness || 75,
          conscientiousness: reqScores?.personality?.conscientiousness || 76,
          extraversion: reqScores?.personality?.extraversion || 68,
          agreeableness: reqScores?.personality?.agreeableness || 74,
          emotionalStability: reqScores?.personality?.emotionalStability || 70,
        },
        topRiasec: reqScores?.topRiasec || ['Investigative', 'Realistic', 'Artistic'],
        riasec: reqScores?.riasec || {},
        topVark: reqScores?.topVark || 'V',
        vark: reqScores?.vark || {},
        topValues: reqScores?.topValues || ['Autonomy', 'Mastery', 'Purpose'],
        careerFitment: reqScores?.careerFitment || [
          { name: 'STEM & Engineering Pathway', score: 95 },
          { name: 'Data Science & Analytical Computing', score: 92 },
          { name: 'Architecture & Design Systems', score: 88 },
          { name: 'Business Analytics & Commerce', score: 84 },
        ],
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'resultId or valid student/scores assessment payload is required' },
        { status: 400 }
      );
    }

    const targetId = resultId || editorialStudent.reportId;
    console.log(`[PDF DOWNLOAD] mode=${isExecutive ? 'EXECUTIVE_SUMMARY' : 'FULL'} reportId=${targetId} source=SAVED_SNAPSHOT groq=false navigation=false`);
    const snapshotResult = await getOrGenerateReportSnapshot({
      resultId: targetId,
      student: editorialStudent,
      scores,
      comparisonData,
    });
    const personalization = snapshotResult.personalization;

    let targetHTMLReport = '';
    if (isExecutive) {
      const { buildClass10ExecutiveSummaryHTMLReport } = await import('@/app/(main)/psychometric-test/class10_executive_summary_builder');
      targetHTMLReport = buildClass10ExecutiveSummaryHTMLReport(editorialStudent, scores, personalization, comparisonData, parentProfile);
    } else {
      targetHTMLReport = buildClass10ExecutiveHTMLReport(editorialStudent, scores, personalization, comparisonData, parentProfile);
    }

    // Launch Headless Chromium via Puppeteer
    const puppeteer = (await import('puppeteer')).default;
    browser = await puppeteer.launch({
      headless: true,
      ...(process.env.PUPPETEER_EXECUTABLE_PATH && {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      }),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting=none'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport to standard A4 resolution at 96 DPI
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    
    await page.setContent(targetHTMLReport, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
      timeout: 60000
    });

    // Wait for document fonts and canvas charts to finish rendering
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
      await new Promise(r => setTimeout(r, 600));
    });

    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      displayHeaderFooter: false
    });

    await browser.close();
    browser = null;

    const safeFileName = isExecutive 
      ? `${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_Class10_Executive_Career_Summary.pdf`
      : `${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_Class10_Full_Psychometric_Report.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error: any) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    console.error('Error generating PDF via Chromium:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
