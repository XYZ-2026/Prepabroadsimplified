/**
 * Semantic Roadmap Continuation Verification Suite
 * ────────────────────────────────────────────────
 * Tests the semantic continuation resolver, endpoint logic,
 * specialisation downstream pathways, study abroad integration,
 * and academic paths across Science, Commerce, and Arts.
 * 
 * Run: node scripts/verify-semantic-continuation.mjs
 */

import http from 'http';

console.log('🧪 Running Semantic Roadmap Continuation Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const baseUrl = 'http://localhost:3000';

  console.log('── Test 1: Architectural Specialisation (SPEC_004) Does NOT Stop Prematurely ──');
  const specRes = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=SPEC_004`);
  
  assert(specRes.node && specRes.node.canonicalName === 'Architectural', 'SPEC_004 loaded correctly');
  assert(specRes.continuation !== undefined, 'Continuation object is present in node response');
  assert(specRes.continuation.isTerminal === false, 'SPEC_004 is NOT marked as a terminal endpoint');
  assert(specRes.continuation.frontier && specRes.continuation.frontier.length > 0, `SPEC_004 has active frontier options (${specRes.continuation.frontier.length} found)`);

  const hasArchitectRole = specRes.continuation.frontier.some(f => f.id === 'PROF_004' && f.label === 'Architect');
  assert(hasArchitectRole, 'SPEC_004 frontier includes Architect profession role (PROF_004)');

  const hasInteriorDesignerRole = specRes.continuation.frontier.some(f => f.id === 'PROF_010');
  assert(hasInteriorDesignerRole, 'SPEC_004 frontier includes Interior Designer profession role (PROF_010)');

  const hasFurtherStudy = specRes.continuation.phases.furtherStudy.length > 0;
  assert(hasFurtherStudy, `SPEC_004 has further study options (${specRes.continuation.phases.furtherStudy.map(s => s.label).join(', ')})`);

  const hasStudyAbroad = specRes.continuation.frontier.some(f => f.nodeType === 'STUDY_ABROAD');
  assert(hasStudyAbroad, 'SPEC_004 frontier includes Study Abroad pathway');

  console.log('\n── Test 2: True Profession Endpoint (PROF_004 - Architect) ──');
  const profRes = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=PROF_004`);
  assert(profRes.node && profRes.node.type === 'PROFESSION', 'PROF_004 is a PROFESSION node');
  assert(profRes.continuation.isTerminal === true, 'PROF_004 is correctly marked as a terminal endpoint');
  assert(profRes.continuation.terminalType === 'JOB_ROLE_DESTINATION', 'PROF_004 terminalType is JOB_ROLE_DESTINATION');
  assert(profRes.continuation.terminalMessage.includes('Architect'), `PROF_004 terminal message humanized: "${profRes.continuation.terminalMessage}"`);

  console.log('\n── Test 3: Degree Continuation (DEGREE_001 - B.Tech.) ──');
  const degRes = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=DEGREE_001`);
  assert(degRes.continuation.isTerminal === false, 'DEGREE_001 (B.Tech.) is NOT terminal');
  assert(degRes.connections.outgoing.length > 0, `DEGREE_001 has direct specialisations (${degRes.connections.outgoing.length} found)`);
  assert(degRes.continuation.phases.studyAbroad.length > 0, 'DEGREE_001 has Study Abroad continuation branch');

  console.log('\n── Test 4: Academic Foundation Stages are Never Terminal ──');
  const levelRes = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=LEVEL_001`);
  assert(levelRes.continuation.isTerminal === false, 'LEVEL_001 (10th) is NOT terminal');

  const streamRes = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=STREAM_001`);
  assert(streamRes.continuation.isTerminal === false, 'STREAM_001 (Science) is NOT terminal');

  const subRes = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=SUBJECT_001`);
  assert(subRes.continuation.isTerminal === false, 'SUBJECT_001 (PCM) is NOT terminal');

  const fieldRes = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=FIELD_001`);
  assert(fieldRes.continuation.isTerminal === false, 'FIELD_001 (Engineering) is NOT terminal');

  console.log('\n── Test 5: Commerce Pathway Continuation ──');
  const commStream = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=STREAM_002`);
  assert(commStream.continuation.isTerminal === false, 'STREAM_002 (Commerce) is NOT terminal');
  assert(commStream.connections.outgoing.length > 0, `Commerce has ${commStream.connections.outgoing.length} outgoing paths`);

  console.log('\n── Test 6: Arts Pathway Continuation ──');
  const artsStream = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=STREAM_003`);
  assert(artsStream.continuation.isTerminal === false, 'STREAM_003 (Arts) is NOT terminal');
  assert(artsStream.connections.outgoing.length > 0, `Arts has ${artsStream.connections.outgoing.length} outgoing paths`);

  console.log('\n── Test 7: Synthetic Study Abroad Node Resolution ──');
  const abroadRes = await fetchJson(`${baseUrl}/api/career-roadmap/node?id=ABROAD_SPEC_004`);
  assert(abroadRes.node && abroadRes.node.type === 'STUDY_ABROAD', 'ABROAD_SPEC_004 resolves as STUDY_ABROAD');
  assert(abroadRes.node.displayName === 'Study Abroad Opportunities', 'ABROAD_SPEC_004 has humanized display name');
  assert(abroadRes.node.sourceName.includes('University Predictor'), 'ABROAD_SPEC_004 cites University Predictor');
  assert(abroadRes.continuation.isTerminal === true, 'ABROAD_SPEC_004 is an international terminal branch');

  console.log('\n── Test 8: Graph Endpoint Check Consistency ──');
  const graphRes = await fetchJson(`${baseUrl}/api/career-roadmap/graph?nodeId=SPEC_004&depth=1`);
  assert(graphRes.root && graphRes.root.isEndpoint === false, 'graph API root for SPEC_004 is NOT marked endpoint');
  assert(graphRes.root.childCount > 0, `graph API root for SPEC_004 childCount is ${graphRes.root.childCount}`);

  console.log(`\n═══════════════════════════════════════════════════`);
  console.log(`Results: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  if (passedTests === totalTests) {
    console.log('🎉 ALL SEMANTIC CONTINUATION TESTS PASSED!');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error running verification:', err);
  process.exit(1);
});
