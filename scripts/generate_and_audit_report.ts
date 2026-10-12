import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';
import { adaptReportData } from '../src/app/(main)/psychometric-test/report-engine/adapters';
import { buildUniversalExecutiveHTMLReport } from '../src/app/(main)/psychometric-test/class10_html_report_builder';
import type { EditorialStudent, EditorialScores, PersonalizationData } from '../src/app/(main)/psychometric-test/class10_editorial_engine';

async function main() {
  console.log('🚀 Starting CLARVO Class 12 Psychometric Report Generation & QA...');

  const student: EditorialStudent = {
    name: 'agam',
    grade: 'Class 12',
    age: 17,
    school: 'Delhi Public School',
    city: 'Delhi, India',
    stream: 'Science Stream',
    email: 'agampuri61@gmail.com',
    date: 'October 12, 2026',
    reportId: 'AS-12-PTX4VK',
    parentName: 'Parent of agam'
  };

  const scores: EditorialScores = {
    aptitude: {
      verbal: 40,
      numerical: 71,
      reasoning: 20,
      spatial: 33,
      overall: 41
    },
    personality: {
      openness: 40,
      conscientiousness: 40,
      extraversion: 65,
      agreeableness: 40,
      emotionalStability: 40
    },
    topRiasec: ['R', 'I', 'S'],
    riasec: { R: 32, I: 28, S: 24, E: 20, C: 18, A: 16 },
    topVark: 'A',
    vark: {
      V: 75,
      A: 90,
      R: 78,
      K: 72
    },
    topValues: ['leadership', 'adventure', 'stability'],
    careerFitment: [
      { name: 'Environmental Science', score: 68 },
      { name: 'Data Science & AI', score: 66 },
      { name: 'Software Engineering & IT', score: 62 }
    ]
  };

  const parentProfile: any = {
    numeric: {
      perceivedAptitude: 65,
      careerAlignment: 70,
      riskTolerance: 60,
      financialFlexibility: 85,
      internationalOpenness: 80,
      academicExpectation: 75
    },
    interpreted: {
      internationalOpenness: 'high'
    },
    choices: {
      perceivedStrengthArea: 'stem',
      perceivedCareerDirection: 'creative_media',
      perceivedSocialStyle: 'adaptable',
      academicExpectationChoice: 'above_average',
      salaryExpectation: 'growth_focus',
      educationBudget: 'budget_flexible',
      scholarshipDependency: 'scholarship_not_factor',
      financialReadiness: 'fully_planned',
      preferredRegion: 'north_america',
      postStudyEmployment: 'most_important',
      decisionOwnership: 'professional_guided',
      supportStyle: 'mentoring',
      primaryConcern: 'work_life_balance',
      desiredOutcome: 'meaningful_work',
      performanceExpectation: 'steady_pace'
    }
  };

  const comparisonData: any = {
    overallIndex: 75,
    alignmentLabel: 'MODERATE ALIGNMENT — AREAS FOR DISCUSSION',
    areas: [
      {
        id: 'career_direction',
        title: 'Career Direction',
        level: 'potential_gap',
        studentScore: 68,
        parentScore: 50,
        explanation: 'Student leans toward Environmental Science while parent assessment prioritizes creative media.',
        recommendation: 'Explore intersection of environmental sustainability and creative communications.'
      },
      {
        id: 'career_expectations',
        title: 'Career Expectations',
        level: 'moderate_alignment',
        studentScore: 70,
        parentScore: 65,
        explanation: 'Both parties value balanced growth and long-term career satisfaction.',
        recommendation: 'Align on university admission milestones.'
      },
      {
        id: 'financial_feasibility',
        title: 'Financial Feasibility',
        level: 'high_alignment',
        studentScore: 80,
        parentScore: 85,
        explanation: 'Strong alignment on higher education financial planning and flexible budget.',
        recommendation: 'Confirm target university tuition and scholarship deadlines.'
      },
      {
        id: 'study_abroad',
        title: 'Study Abroad Readiness',
        level: 'high_alignment',
        studentScore: 85,
        parentScore: 80,
        explanation: 'Shared openness to undergraduate study in North America.',
        recommendation: 'Shortlist accredited international programs.'
      },
      {
        id: 'decision_autonomy',
        title: 'Decision Autonomy',
        level: 'moderate_alignment',
        studentScore: 75,
        parentScore: 65,
        explanation: 'Student prefers high self-direction supported by professional guidance.',
        recommendation: 'Use counselor sessions to structure decisions.'
      },
      {
        id: 'risk_tolerance',
        title: 'Risk Tolerance',
        level: 'moderate_alignment',
        studentScore: 60,
        parentScore: 65,
        explanation: 'Balanced risk outlook on higher education pathways.',
        recommendation: 'Maintain a diversified college application portfolio (Reach/Fit/Accessible).'
      },
      {
        id: 'support_style',
        title: 'Support Style',
        level: 'high_alignment',
        studentScore: 75,
        parentScore: 75,
        explanation: 'Parents provide active mentorship and encouraging independence.',
        recommendation: 'Maintain structured bi-weekly check-ins.'
      }
    ]
  };

  const personalization: PersonalizationData = {
    executiveSummary: 'Candidate demonstrates dedicated engagement in environmental and scientific problem solving, supported by methodical execution discipline.',
    strengths: ['Numerical Logic', 'Auditory Processing', 'Methodical Execution'],
    growthAreas: ['Abstract Fluid Matrix Logic', 'Mental 3D Geometry'],
    moduleInsights: {},
    careerRoadmap: {
      shortTerm: [
        'Conduct a comprehensive syllabus gap audit for Class 12 Board exams and priority entrance tests.',
        'Finalize target portfolio of 10 colleges divided into Reach (3), Fit (4), and Accessible (3) tiers.',
        'Establish weekly timed 3-hour mock exam simulations under strict conditions.'
      ],
      mediumTerm: [
        'Complete Class 12 Pre-Board examinations with an 88%+ benchmark across all subjects.',
        'Submit university admission applications along with required documentation.',
        'Conduct financial alignment review with family to confirm tuition and scholarship deadlines.'
      ],
      longTerm: [
        'Execute Class 12 Board Examinations targeting a 90%+ aggregate.',
        'Appear for target competitive entrance examinations with calibrated pacing.',
        'Finalize university admission acceptance and prepare pre-college onboarding.'
      ]
    }
  };

  console.log('📦 Adapting report data with senior adapter...');
  const adaptedData = adaptReportData(
    student,
    scores,
    personalization,
    comparisonData,
    parentProfile,
    'senior'
  );

  console.log('🔨 Building executive HTML report...');
  const reportHtml = buildUniversalExecutiveHTMLReport(adaptedData);

  const htmlOutPath = path.join(process.cwd(), 'scratch', 'regenerated_report.html');
  fs.writeFileSync(htmlOutPath, reportHtml, 'utf8');
  console.log(`✅ HTML report saved to ${htmlOutPath} (${reportHtml.length} characters)`);

  // HTML Integrity Assertions
  console.log('\n--- Running HTML Assertions ---');
  const errors: string[] = [];

  if (reportHtml.includes('Class 10 Executive Psychometric Evaluation')) {
    errors.push('FAIL: Stale "Class 10 Executive Psychometric Evaluation" title found in HTML');
  }
  if (reportHtml.includes('border: 1px solid #d4af37')) {
    errors.push('FAIL: Legacy gold border "#d4af37" found in print CSS');
  }
  if (reportHtml.includes('budget_flexible')) {
    errors.push('FAIL: Raw enum "budget_flexible" found in HTML');
  }
  if (reportHtml.includes('creative_media')) {
    errors.push('FAIL: Raw enum "creative_media" found in HTML');
  }
  if (reportHtml.includes('Free from chronic worry')) {
    errors.push('FAIL: Clinical-adjacent claim "Free from chronic worry" found in HTML');
  }
  if (reportHtml.includes('ISO-Aligned Diagnostic')) {
    errors.push('FAIL: Unverified claim "ISO-Aligned Diagnostic" found in HTML');
  }
  if (reportHtml.includes('Cronbach\'s Alpha Reliability: α = 0.89')) {
    errors.push('FAIL: Unverified synthetic claim "α = 0.89" found in HTML');
  }
  if (reportHtml.includes('Systems Synergy (98%)')) {
    errors.push('FAIL: Hardcoded "Systems Synergy (98%)" found in HTML');
  }

  // Check pathway titles in HTML
  const hasEnvPathway = reportHtml.includes('Environmental Science, Climate Analytics & Sustainable Technologies');
  const hasDataPathway = reportHtml.includes('Data Science, Machine Learning & Statistical Computing');
  const hasSoftwarePathway = reportHtml.includes('Software Systems Engineering, Cloud Architecture & DevOps');

  if (!hasEnvPathway) errors.push('FAIL: Environmental Science pathway missing from HTML');
  if (!hasDataPathway) errors.push('FAIL: Data Science pathway missing from HTML');
  if (!hasSoftwarePathway) errors.push('FAIL: Software Systems Engineering pathway missing from HTML');

  if (errors.length > 0) {
    console.error('❌ HTML Assertions failed:', errors);
  } else {
    console.log('✅ All HTML Assertions passed!');
  }

  // Launch Puppeteer to generate PDF
  console.log('\n🖨️ Launching Puppeteer to generate 56-page PDF...');
  const browser = await puppeteer.launch({
    headless: true,
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
  page.setDefaultTimeout(180000);
  page.setDefaultNavigationTimeout(180000);
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

  await page.setContent(reportHtml, {
    waitUntil: 'domcontentloaded',
    timeout: 180000
  });

  await page.evaluate(async () => {
    if (document.fonts) {
      await Promise.race([
        document.fonts.ready,
        new Promise(r => setTimeout(r, 2500))
      ]);
    }
    await new Promise(r => setTimeout(r, 1000));
  });

  await page.emulateMediaType('print');

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    displayHeaderFooter: false,
    timeout: 180000
  });

  await browser.close();

  const pdfOutPath = path.join(process.cwd(), 'scratch', 'regenerated_Class12_Full_Psychometric_Report.pdf');
  fs.writeFileSync(pdfOutPath, pdfBuffer);
  console.log(`✅ Regenerated PDF saved to: ${pdfOutPath} (${pdfBuffer.length} bytes)`);

  console.log('🎉 Generation completed successfully!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
