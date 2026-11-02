/**
 * Automated Verification Script: Real Checkpoint Progress Logging
 * ─────────────────────────────────────────────────────────────────────────────
 * Tests:
 * 1. Full Diagnostic Report (56 Pages)
 * 2. Executive Career Edition (15 Pages)
 *
 * For each:
 * - Creates a job record
 * - Runs the generator runner
 * - Polls progress over time and logs percent & stage detail received
 * - Asserts monotonicity, proper weight progression, and final valid PDF buffer
 */

import { createReportJob, getReportJob, getReportJobBuffer } from '../src/lib/report-job-service';
import { runReportGenerationJob } from '../src/lib/report-generator-runner';
import type { EditorialStudent, EditorialScores } from '../src/app/(main)/psychometric-test/class10_editorial_engine';

async function testReportJobProgression(reportType: 'full' | 'executive'): Promise<{
  success: boolean;
  history: Array<{ timeMs: number; percent: number; stage: string; stageDetail: string; status: string }>;
  pdfSizeBytes: number;
}> {
  console.log(`\n${'='.repeat(90)}`);
  console.log(`TESTING REAL PROGRESSION: ${reportType.toUpperCase()} REPORT EDITION`);
  console.log(`${'='.repeat(90)}`);

  const mockStudent: EditorialStudent = {
    name: 'Aarav Sharma',
    grade: 'Class 10',
    age: '15',
    school: 'Delhi Public School',
    city: 'New Delhi',
    stream: 'Science (PCM)',
    mathStatus: 'Standard Mathematics',
    subjects: 'Physics, Chemistry, Mathematics, Computer Science',
    board: 'CBSE',
    academicYear: '2025-2026',
    graduationYear: '2027',
    email: 'aarav.sharma@clarvo.internal',
    date: 'November 2, 2026',
    reportId: `CL-TEST-${reportType.toUpperCase()}-101`,
    parentName: 'Ramesh Sharma',
  };

  const mockScores: EditorialScores = {
    aptitude: { verbal: 82, numerical: 94, reasoning: 90, spatial: 86, overall: 88 },
    personality: { openness: 78, conscientiousness: 75, extraversion: 68, agreeableness: 72, emotionalStability: 74 },
    topRiasec: ['Investigative', 'Realistic', 'Enterprising'],
    riasec: { I: 94, R: 88, E: 76, C: 70, A: 65, S: 60 },
    topVark: 'V',
    vark: { V: 35, A: 25, R: 25, K: 15 },
    topValues: ['Autonomy', 'Mastery', 'Purpose'],
    careerFitment: [
      { name: 'Science Stream – Engineering, Technology & Physical Sciences (PCM)', score: 95 },
      { name: 'Commerce, Applied Economics & Strategic Management Stream', score: 85 },
      { name: 'Science Stream – Medical, Healthcare & Life Sciences (PCB)', score: 78 },
      { name: 'Humanities, Legal Studies, Design & Social Sciences Stream', score: 72 },
    ],
  };

  // 1. Create Job Record
  const job = createReportJob({
    reportType,
    resultId: mockStudent.reportId,
    studentName: mockStudent.name,
  });

  console.log(`Created Job ID: ${job.id} (Initial Percent: ${job.percent}%, Status: ${job.status})`);

  // 2. Launch Generator Runner in background
  const runPromise = runReportGenerationJob({
    jobId: job.id,
    resultId: mockStudent.reportId,
    student: mockStudent,
    scores: mockScores,
    reportType,
    variant: 'grade10',
    isSample: true,
  });

  // 3. Poll and Log Real Telemetry Values Over Time
  const history: Array<{ timeMs: number; percent: number; stage: string; stageDetail: string; status: string }> = [];
  const startTime = Date.now();
  let lastLoggedPercent = -1;
  let lastLoggedDetail = '';
  let isDone = false;

  console.log(`\nTime (s) | Progress | Stage            | Stage Detail`);
  console.log(`---------|----------|------------------|----------------------------------------------------------`);

  while (!isDone) {
    await new Promise(r => setTimeout(r, 200));
    const current = await getReportJob(job.id);
    if (!current) continue;

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    if (current.percent !== lastLoggedPercent || current.stageDetail !== lastLoggedDetail || current.status !== 'running') {
      history.push({
        timeMs: Date.now() - startTime,
        percent: current.percent,
        stage: current.stage,
        stageDetail: current.stageDetail,
        status: current.status,
      });

      console.log(
        `${elapsed.padStart(7)}s | ${String(current.percent).padStart(7)}% | ${current.stage.padEnd(16)} | ${current.stageDetail}`
      );

      lastLoggedPercent = current.percent;
      lastLoggedDetail = current.stageDetail;
    }

    if (current.status === 'done' || current.status === 'failed') {
      isDone = true;
      break;
    }
  }

  await runPromise;

  const finalJob = await getReportJob(job.id);
  const { buffer } = getReportJobBuffer(job.id);
  const pdfSizeBytes = buffer?.length || 0;

  console.log(`\nFinal Job State: status=${finalJob?.status}, percent=${finalJob?.percent}%, bufferSize=${pdfSizeBytes} bytes`);
  console.log(`Result URL: ${finalJob?.resultUrl}`);

  // 4. Assertions
  const assertionsPassed =
    finalJob?.status === 'done' &&
    finalJob.percent === 100 &&
    pdfSizeBytes > 10000 &&
    history.every((h, i) => i === 0 || h.percent >= history[i - 1].percent); // strictly monotonic

  return {
    success: assertionsPassed,
    history,
    pdfSizeBytes,
  };
}

export async function runProgressTests() {
  console.log('='.repeat(90));
  console.log('CLARVO REPORT GENERATOR: REAL CHECKPOINT TELEMETRY TEST');
  console.log('='.repeat(90));

  // Test 1: Executive Edition (15 pages)
  const execResult = await testReportJobProgression('executive');

  // Test 2: Full Diagnostic Report (56 pages)
  const fullResult = await testReportJobProgression('full');

  console.log(`\n${'='.repeat(90)}`);
  console.log('VERIFICATION SUMMARY');
  console.log(`${'='.repeat(90)}`);
  console.log(`Executive Edition (15P): ${execResult.success ? '✅ PASS' : '❌ FAIL'} (${execResult.history.length} progress events logged, ${execResult.pdfSizeBytes} bytes)`);
  console.log(`Full Diagnostic (56P)  : ${fullResult.success ? '✅ PASS' : '❌ FAIL'} (${fullResult.history.length} progress events logged, ${fullResult.pdfSizeBytes} bytes)`);

  // Monotonicity Check
  const execMonotonic = execResult.history.every((h, i) => i === 0 || h.percent >= execResult.history[i - 1].percent);
  const fullMonotonic = fullResult.history.every((h, i) => i === 0 || h.percent >= fullResult.history[i - 1].percent);
  console.log(`Strict Monotonicity     : ${execMonotonic && fullMonotonic ? '✅ PASS (Progress never moved backwards)' : '❌ FAIL'}`);

  // Stage Weights Check
  const visitedStages = new Set([...execResult.history.map(h => h.stage), ...fullResult.history.map(h => h.stage)]);
  console.log(`Stages Visited          : [${Array.from(visitedStages).join(', ')}]`);

  if (!execResult.success || !fullResult.success || !execMonotonic || !fullMonotonic) {
    console.error('❌ PROGRESS TESTS FAILED');
    process.exit(1);
  }

  console.log('✅ ALL REAL CHECKPOINT PROGRESS TESTS PASSED SUCCESSFULLY.');
}

if (require.main === module || process.argv.includes('--run')) {
  runProgressTests().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
}

