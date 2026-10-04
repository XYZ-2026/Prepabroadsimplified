import {
  getNode,
  getNodeDetail,
  getRoadmapFrontier,
  getCareerDomainOptions,
  getCareerOptions,
  getJobRoleOptions,
  getFurtherStudyOptions,
  getStudyAbroadOptions,
  getBroaderFieldCareers,
  isTrueRoadmapEndpoint,
  searchNodes,
} from '../src/lib/career-roadmap-service.js';

console.log('============================================================');
console.log('ROADMAP STUDIO: MODERN ENRICHMENT & TAXONOMY VALIDATION');
console.log('============================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// ─────────────────────────────────────────────────────────────
// TEST A: Computer Science (SPEC_009) must NOT be an endpoint
// ─────────────────────────────────────────────────────────────
console.log('--- TEST A: Computer Science (SPEC_009) Continuity ---');
const csNode = getNode('SPEC_009');
assert(csNode !== undefined, 'Computer Science node exists in unified graph');
assert(csNode.displayName === 'Computer Science', 'Computer Science display name is correct');

const csIsTerminal = isTrueRoadmapEndpoint('SPEC_009');
assert(csIsTerminal === false, 'Computer Science is NOT a terminal endpoint');

const csFrontier = getRoadmapFrontier('SPEC_009');
assert(csFrontier.length > 0, `Computer Science has active frontier options (${csFrontier.length} found)`);

const csDomains = getCareerDomainOptions('SPEC_009');
assert(csDomains.length >= 5, `Computer Science reveals Career Domains (${csDomains.length} domains found)`);
console.log('  Revealed Domains:', csDomains.map(d => d.label).join(', '));

const hasSWE = csDomains.some(d => d.id === 'DOMAIN_SWE');
const hasAIML = csDomains.some(d => d.id === 'DOMAIN_AIML');
const hasData = csDomains.some(d => d.id === 'DOMAIN_DATA');
const hasCyber = csDomains.some(d => d.id === 'DOMAIN_CYBER');
const hasCloud = csDomains.some(d => d.id === 'DOMAIN_CLOUD_DEVOPS');

assert(hasSWE, 'Includes Software Engineering');
assert(hasAIML, 'Includes AI & Machine Learning');
assert(hasData, 'Includes Data & Analytics');
assert(hasCyber, 'Includes Cybersecurity');
assert(hasCloud, 'Includes Cloud & DevOps');

// Rule 8 & 9: Specificity precedence - no field careers dumped into CS frontier
const hasFieldPollution = csFrontier.some(f => f.label.includes('Pilot') || f.label.includes('Teacher'));
assert(!hasFieldPollution, 'Specificity Precedence enforced: Broad field careers (Pilot, Teacher) are NOT in CS frontier');

const broaderField = getBroaderFieldCareers('SPEC_009');
assert(broaderField.length > 0, `Broader field options isolated properly (${broaderField.length} options)`);

// ─────────────────────────────────────────────────────────────
// TEST B: M.E. (PG_021) must NOT be an endpoint
// ─────────────────────────────────────────────────────────────
console.log('\n--- TEST B: M.E. (PG_021) Continuation ---');
const meNode = getNode('PG_021');
assert(meNode !== undefined, 'M.E. node exists');
const meIsTerminal = isTrueRoadmapEndpoint('PG_021');
assert(meIsTerminal === false, 'M.E. is NOT a terminal endpoint');

const meFrontier = getRoadmapFrontier('PG_021');
assert(meFrontier.length > 0, `M.E. has frontier options (${meFrontier.length} found)`);
console.log('  M.E. Frontier:', meFrontier.map(f => `${f.label} (${f.nodeType})`).join(', '));

const meHasPhd = meFrontier.some(f => f.id === 'PG_018' || f.label.toLowerCase().includes('ph.d'));
const meHasDomains = meFrontier.some(f => f.nodeType === 'CAREER_DOMAIN');
assert(meHasPhd, 'M.E. connects to Ph.D. / Doctoral Research');
assert(meHasDomains, 'M.E. connects to advanced Career Domains');

// ─────────────────────────────────────────────────────────────
// TEST C: M.S. Abroad (PG_022) must NOT be an endpoint
// ─────────────────────────────────────────────────────────────
console.log('\n--- TEST C: M.S. Abroad (PG_022) Continuation ---');
const msAbroadNode = getNode('PG_022');
assert(msAbroadNode !== undefined, 'M.S. Abroad node exists');
const msIsTerminal = isTrueRoadmapEndpoint('PG_022');
assert(msIsTerminal === false, 'M.S. Abroad is NOT a terminal endpoint');

const msFrontier = getRoadmapFrontier('PG_022');
assert(msFrontier.length > 0, `M.S. Abroad has frontier options (${msFrontier.length} found)`);
console.log('  M.S. Abroad Frontier:', msFrontier.map(f => `${f.label} (${f.nodeType})`).join(', '));

const msHasMsCs = msFrontier.some(f => f.id === 'PG_ENR_MS_CS');
assert(msHasMsCs, 'M.S. Abroad connects to M.S. in Computer Science (Abroad)');

// ─────────────────────────────────────────────────────────────
// TEST D: AI & ML -> Machine Learning -> Machine Learning Engineer
// ─────────────────────────────────────────────────────────────
console.log('\n--- TEST D: AI/ML Track & Job Role Resolution ---');
const aimlNode = getNode('DOMAIN_AIML');
assert(aimlNode !== undefined, 'AI & ML Career Domain exists');
assert(aimlNode.type === 'CAREER_DOMAIN', 'AI & ML is typed as CAREER_DOMAIN');

const aimlCareers = getCareerOptions('DOMAIN_AIML');
assert(aimlCareers.length >= 2, `AI & ML offers career directions (${aimlCareers.length} found)`);
console.log('  AI & ML Career Directions:', aimlCareers.map(c => c.label).join(', '));

const mlCareer = aimlCareers.find(c => c.id === 'CAREER_ENR_ML');
assert(mlCareer !== undefined, 'Machine Learning career exists in AI & ML');

const mlJobRoles = getJobRoleOptions('CAREER_ENR_ML');
assert(mlJobRoles.length >= 1, `Machine Learning leads to specific job roles (${mlJobRoles.length} found)`);
console.log('  ML Job Roles:', mlJobRoles.map(j => j.label).join(', '));

const hasMlEng = mlJobRoles.some(j => j.id === 'PROF_ENR_ML_ENG');
assert(hasMlEng, 'Machine Learning leads to Machine Learning Engineer (PROF_ENR_ML_ENG)');

const mlEngNode = getNode('PROF_ENR_ML_ENG');
assert(mlEngNode !== undefined, 'Machine Learning Engineer node exists');
assert(mlEngNode.type === 'PROFESSION', 'ML Engineer is typed as PROFESSION');
assert(isTrueRoadmapEndpoint('PROF_ENR_ML_ENG') === true, 'ML Engineer is a valid terminal job destination');

// ─────────────────────────────────────────────────────────────
// TEST E: Cybersecurity -> Security Engineering -> Cybersecurity Engineer
// ─────────────────────────────────────────────────────────────
console.log('\n--- TEST E: Cybersecurity Track & Job Role Resolution ---');
const cyberNode = getNode('DOMAIN_CYBER');
assert(cyberNode !== undefined, 'Cybersecurity Career Domain exists');

const cyberCareers = getCareerOptions('DOMAIN_CYBER');
assert(cyberCareers.length >= 1, 'Cybersecurity offers Security Engineering');

const secEngCareer = cyberCareers.find(c => c.id === 'CAREER_ENR_SEC_ENG');
assert(secEngCareer !== undefined, 'Security Engineering career found');

const secJobRoles = getJobRoleOptions('CAREER_ENR_SEC_ENG');
const hasSecEngRole = secJobRoles.some(j => j.id === 'PROF_ENR_SEC_ENG');
assert(hasSecEngRole, 'Security Engineering leads to Cybersecurity Engineer (PROF_ENR_SEC_ENG)');

// ─────────────────────────────────────────────────────────────
// TEST F: Data & Analytics -> Data Science -> Data Scientist
// ─────────────────────────────────────────────────────────────
console.log('\n--- TEST F: Data & Analytics Track & Job Role Resolution ---');
const dataDomain = getNode('DOMAIN_DATA');
assert(dataDomain !== undefined, 'Data & Analytics Career Domain exists');

const dataCareers = getCareerOptions('DOMAIN_DATA');
const dsCareer = dataCareers.find(c => c.id === 'CAREER_ENR_DATA_SCIENCE');
assert(dsCareer !== undefined, 'Data Science career found under Data & Analytics');

const dsJobRoles = getJobRoleOptions('CAREER_ENR_DATA_SCIENCE');
const hasDataScientist = dsJobRoles.some(j => j.id === 'PROF_ENR_DATA_SCIENTIST');
assert(hasDataScientist, 'Data Science leads to Data Scientist (PROF_ENR_DATA_SCIENTIST)');

// ─────────────────────────────────────────────────────────────
// TEST G: Search Capabilities for Modern Programmes and Domains
// ─────────────────────────────────────────────────────────────
console.log('\n--- TEST G: Search for Modern Tech Terms ---');
const queries = ['AI', 'Machine Learning', 'Data Science', 'Cybersecurity', 'Cloud', 'DevOps'];
for (const q of queries) {
  const results = searchNodes(q, 5);
  assert(results.length > 0, `Search for "${q}" returned ${results.length} results`);
  console.log(`  "${q}" ->`, results.map(r => `${r.displayName || r.canonicalName} [${r.type}]`).join(', '));
}

// ─────────────────────────────────────────────────────────────
// TEST H: NodeDetail and Provenance Metadata
// ─────────────────────────────────────────────────────────────
console.log('\n--- TEST H: Node Detail & Provenance ---');
const csDetail = getNodeDetail('SPEC_009');
assert(csDetail.continuation.phases.careerDomains.length >= 5, 'CS detail includes careerDomains phase');
assert(csDetail.continuation.phases.broaderFieldCareers.length > 0, 'CS detail includes broaderFieldCareers phase');
assert(csDetail.enrichment.isEnriched === false, 'CS identified as Layer A source graph');

const aiDetail = getNodeDetail('DOMAIN_AIML');
assert(aiDetail.enrichment.isEnriched === true, 'AI & ML domain identified as Layer B enriched');
assert(aiDetail.enrichment.verificationStatus === 'VERIFIED', 'AI & ML verification status is VERIFIED');
assert(aiDetail.enrichment.enrichmentSource.includes('ACM/IEEE'), 'AI & ML provenance has ACM/IEEE citation');

console.log('\n============================================================');
console.log(`SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('============================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
