import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie, getUserRole } from '@/lib/auth';
import type { EditorialStudent, EditorialScores } from '@/app/(main)/psychometric-test/class10_editorial_engine';
import { getOrGenerateReportSnapshot } from '@/lib/report-snapshot-service';
import { getWorkflowState } from '@/lib/assessment-workflow';
import { adaptReportData, resolveReportVariant } from '@/app/(main)/psychometric-test/report-engine/adapters';
import { buildUniversalExecutiveHTMLReport } from '@/app/(main)/psychometric-test/class10_html_report_builder';
import { buildUniversalExecutiveSummaryHTMLReport } from '@/app/(main)/psychometric-test/class10_executive_summary_builder';
import { getVariantConfig } from '@/app/(main)/psychometric-test/report-engine/universal-report-schema';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let browser: any = null;
  try {
    const body = await req.json().catch(() => ({}));
    const { resultId, student: reqStudent, scores: reqScores, reportType = 'full', isSample } = body;
    const urlType = new URL(req.url).searchParams.get('type');
    const isExecutive = reportType === 'executive' || urlType === 'executive';

    const decodedClaims = await verifySessionCookie();
    const isSampleRequest = isSample || 
      resultId?.toString().toUpperCase().includes('SAMPLE') || 
      reqStudent?.reportId?.toString().toUpperCase().includes('SAMPLE') ||
      reqStudent?.name?.toString().toLowerCase().includes('sample');
    const isDirectPayload = !resultId && reqStudent && reqScores;

    if (!decodedClaims && !isSampleRequest && !isDirectPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let data: any = null;
    let comparisonData: any = null;
    let parentProfile: any = null;

    if (resultId) {
      const role: any = decodedClaims ? await getUserRole() : null;
      const resultSnap = await adminDb.collection('psychometric_results').doc(resultId).get();

      if (resultSnap.exists) {
        data = resultSnap.data();
        if (decodedClaims && role === 'student') {
          if (data?.userId !== decodedClaims.uid) {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
          }
          const wfState = await getWorkflowState(resultId);
          if (wfState !== 'report_unlocked') {
            return NextResponse.json({ 
              success: false, 
              error: 'Report is locked. Complete the compulsory Parent Psychometric Assessment to unlock.' 
            }, { status: 403 });
          }
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

    // Determine variant and configuration
    const rawVariant = data?.assessmentType || body.assessmentType || body.variant;
    const gradeCandidate = data?.student?.grade || data?.studentInfo?.grade || reqStudent?.grade;
    const resolvedVariant = resolveReportVariant(rawVariant, gradeCandidate);
    const variantConfig = getVariantConfig(resolvedVariant);

    // Extract student & scores for Universal Report Builder
    let studentName = 'Candidate';
    let editorialStudent: EditorialStudent;
    let scores: EditorialScores;

    if (data) {
      const studentInfo = data.studentInfo || {};
      const studentObj = data.student || {};
      studentName = studentObj.name || studentInfo.name || data.name || data.userName || 'Candidate';
      
      let userProfileData: any = null;
      if (data.userId) {
        try {
          const userSnap = await adminDb.collection('users').doc(data.userId).get();
          if (userSnap.exists) {
            userProfileData = userSnap.data();
            if (userProfileData?.name && (!studentName || studentName === 'Candidate')) {
              studentName = userProfileData.name;
            }
          }
        } catch (e) {
          console.warn('[PDF Route] Could not fetch name from user record:', e);
        }
      }
      
      const rawGrade = studentObj.grade || studentInfo.grade || userProfileData?.grade || userProfileData?.academicGrade || variantConfig.defaultGradeLabel;
      const formattedGrade = rawGrade.toLowerCase().includes('class') || rawGrade.toLowerCase().includes('grade') ? rawGrade : `Class ${rawGrade}`;
      const defaultAge = resolvedVariant === 'junior' ? '13' : resolvedVariant === 'senior' ? '17' : '15';

      editorialStudent = {
        name: studentName,
        grade: formattedGrade,
        age: studentObj.age || studentInfo.age || defaultAge,
        school: studentObj.school || studentInfo.school || userProfileData?.currentSchool || userProfileData?.schoolName || '',
        city: studentObj.city || studentInfo.city || userProfileData?.city || 'India',
        stream: studentObj.stream || studentInfo.stream || userProfileData?.stream || '',
        mathStatus: studentObj.mathStatus || studentInfo.mathStatus || userProfileData?.mathStatus || '',
        subjects: studentObj.subjects || studentInfo.subjects || studentObj.subjectCombination || studentInfo.subjectCombination || userProfileData?.subjects || '',
        board: studentObj.board || studentInfo.board || userProfileData?.board || '',
        academicYear: studentObj.academicYear || studentInfo.academicYear || studentObj.graduationYear || studentInfo.graduationYear || userProfileData?.graduationYear || '',
        graduationYear: studentObj.graduationYear || studentInfo.graduationYear || userProfileData?.graduationYear || '',
        email: studentObj.email || studentInfo.email || data.email || '',
        date: data.createdAt || data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        reportId: `${variantConfig.reportIdPrefix}-${resultId.substring(0, 6).toUpperCase()}`,
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
    } else if (reqStudent && (reqScores || isSampleRequest)) {
      studentName = reqStudent.name || 'Candidate';
      const rawGrade = reqStudent.grade || variantConfig.defaultGradeLabel;
      const formattedGrade = rawGrade.toLowerCase().includes('class') || rawGrade.toLowerCase().includes('grade') ? rawGrade : `Class ${rawGrade}`;
      const defaultAge = resolvedVariant === 'junior' ? '13' : resolvedVariant === 'senior' ? '17' : '15';

      editorialStudent = {
        name: studentName,
        grade: formattedGrade,
        age: reqStudent.age || defaultAge,
        school: reqStudent.school || '',
        city: reqStudent.city || 'India',
        stream: reqStudent.stream || '',
        mathStatus: reqStudent.mathStatus || '',
        subjects: reqStudent.subjects || reqStudent.subjectCombination || '',
        board: reqStudent.board || '',
        academicYear: reqStudent.academicYear || reqStudent.graduationYear || '',
        graduationYear: reqStudent.graduationYear || '',
        email: reqStudent.email || '',
        date: reqStudent.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        reportId: reqStudent.reportId || `${variantConfig.reportIdPrefix}-${Math.floor(100000 + Math.random() * 900000)}`,
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
    console.log(`[PDF DOWNLOAD] mode=${isExecutive ? 'EXECUTIVE_SUMMARY' : 'FULL'} variant=${resolvedVariant} reportId=${targetId} source=SAVED_SNAPSHOT groq=false navigation=false`);
    const snapshotResult = await getOrGenerateReportSnapshot({
      resultId: targetId,
      student: editorialStudent,
      scores,
      comparisonData,
    });
    const personalization = snapshotResult.personalization;

    const adaptedData = adaptReportData(
      editorialStudent,
      scores,
      personalization,
      comparisonData,
      parentProfile,
      resolvedVariant
    );

    const targetHTMLReport = isExecutive
      ? buildUniversalExecutiveSummaryHTMLReport(adaptedData)
      : buildUniversalExecutiveHTMLReport(adaptedData);

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
        '--font-render-hinting=none',
        '--disable-web-security',
        '--allow-file-access-from-files'
      ]
    });

    const page = await browser.newPage();
    
    // Set 120s timeouts so large 56-page reports never hit the default 30000ms timeout
    page.setDefaultTimeout(120000);
    page.setDefaultNavigationTimeout(120000);

    // Set viewport to standard A4 resolution at 96 DPI
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    
    await page.setContent(targetHTMLReport, {
      waitUntil: 'domcontentloaded',
      timeout: 120000
    });

    // Wait for document fonts and canvas charts to finish rendering without hanging on remote CDNs
    await page.evaluate(async () => {
      if (document.fonts) {
        await Promise.race([
          document.fonts.ready,
          new Promise(r => setTimeout(r, 2500))
        ]);
      }
      await new Promise(r => setTimeout(r, 500));
    });

    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      displayHeaderFooter: false,
      timeout: 120000
    });

    await browser.close();
    browser = null;

    const variantTag = resolvedVariant === 'junior' ? 'Junior' : resolvedVariant === 'senior' ? 'Class12' : 'Class10';
    const safeFileName = isExecutive 
      ? `${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_${variantTag}_Executive_Career_Summary.pdf`
      : `${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_${variantTag}_Full_Psychometric_Report.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFileName}"`,
        'Content-Length': Buffer.byteLength(pdfBuffer).toString(),
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
