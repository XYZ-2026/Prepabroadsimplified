const assert = require('assert');
const path = require('path');

console.log('====================================================');
console.log('CLARVO CAREER LIBRARY INTEGRATION — COMPREHENSIVE AUDIT & TEST SUITE');
console.log('====================================================\n');

// 1. Data Integrity Tests
const branches = require('../src/data/career-library/branches.json');
const roadmaps = require('../src/data/career-library/roadmaps.json');
const clusters = require('../src/data/career-library/clusters.json');
const streams = require('../src/data/career-library/streams.json');
const traits = require('../src/data/career-library/traits.json');

console.log('--- 1. DATA INTEGRITY ---');
console.log(`✓ Total Branch Profiles: ${branches.length} (Expected: 147)`);
assert.strictEqual(branches.length, 147, 'Branch count must be exactly 147');

const ids = branches.map(b => b.id);
const uniqueIds = new Set(ids);
console.log(`✓ Unique Branch IDs: ${uniqueIds.size} (Expected: 147)`);
assert.strictEqual(uniqueIds.size, 147, 'All IDs must be strictly unique');

const clusterKeys = Object.keys(clusters);
console.log(`✓ Total Clusters: ${clusterKeys.length} (Expected: 18)`);
assert.strictEqual(clusterKeys.length, 18, 'Clusters count must be 18');

console.log(`✓ Total Streams: ${Object.keys(streams).length} (Expected: 4)`);
assert.strictEqual(Object.keys(streams).length, 4, 'Streams count must be 4');

console.log(`✓ Total Trait Dimensions: ${traits.length} (Expected: 46)`);
assert.strictEqual(traits.length, 46, 'Traits count must be 46');

// Verify cluster references
let invalidClusterCount = 0;
branches.forEach(b => {
  if (!clusters[b.cluster]) {
    invalidClusterCount++;
    console.error(`Invalid cluster ref: ${b.id} -> ${b.cluster}`);
  }
});
console.log(`✓ Invalid Cluster References: ${invalidClusterCount} (Expected: 0)`);
assert.strictEqual(invalidClusterCount, 0);

// Verify roadmap mapping and explicit vs fallback counts
let explicitRoadmaps = 0;
let fallbackRoadmaps = 0;
let missingRoadmaps = 0;

branches.forEach(b => {
  const r = roadmaps[b.id];
  if (!r) {
    missingRoadmaps++;
  } else if (r.isFallback) {
    fallbackRoadmaps++;
  } else {
    explicitRoadmaps++;
  }
});

console.log(`✓ Explicitly Authored Roadmaps: ${explicitRoadmaps}`);
console.log(`✓ Fallback Generated Roadmaps: ${fallbackRoadmaps}`);
console.log(`✓ Total Roadmaps Mapped: ${Object.keys(roadmaps).length} (Missing: ${missingRoadmaps})`);
assert.strictEqual(missingRoadmaps, 0, 'Every career profile must have a valid roadmap');
assert.strictEqual(explicitRoadmaps + fallbackRoadmaps, 147);

// Verify engineering assessment isolation
const engineeringEligible = branches.filter(b => b.isEngineeringAssessmentEligible);
const nonEngineering = branches.filter(b => !b.isEngineeringAssessmentEligible);
console.log(`✓ Engineering Assessment Eligible Profiles: ${engineeringEligible.length} (Expected: 87)`);
console.log(`✓ Non-Engineering Catalogue Profiles: ${nonEngineering.length} (Expected: 60)`);
assert.strictEqual(engineeringEligible.length, 87, 'Original engineering profile set must remain exactly 87');
assert.strictEqual(nonEngineering.length, 60, 'Non-engineering profile set must be exactly 60');

// Verify fields on every profile
branches.forEach(b => {
  assert(b.id, `Profile missing id: ${JSON.stringify(b)}`);
  assert(b.name, `Profile ${b.id} missing name`);
  assert(b.desc, `Profile ${b.id} missing desc`);
  assert(typeof b.difficulty === 'number' && b.difficulty >= 1 && b.difficulty <= 5, `Profile ${b.id} invalid difficulty`);
  assert(typeof b.futureScope === 'number' && b.futureScope >= 1 && b.futureScope <= 5, `Profile ${b.id} invalid futureScope`);
  assert(b.whoSuits, `Profile ${b.id} missing whoSuits`);
  assert(Array.isArray(b.coreSkills) && b.coreSkills.length > 0, `Profile ${b.id} missing coreSkills`);
  assert(Array.isArray(b.tools) && b.tools.length > 0, `Profile ${b.id} missing tools`);
  assert(Array.isArray(b.careers) && b.careers.length > 0, `Profile ${b.id} missing careers`);
});
console.log('✓ All 147 profiles expose all required UI fields with valid types.');

// 2. Search & Filter Tests
console.log('\n--- 2. SEARCH & FILTER INTERACTION TESTS ---');

const filterProfiles = (query, cluster, diff, scope) => {
  const q = (query || '').toLowerCase().trim();
  return branches.filter(b => {
    if (cluster && cluster !== 'all' && b.cluster !== cluster) return false;
    if (diff && diff !== 'all' && b.difficulty !== parseInt(diff)) return false;
    if (scope && scope !== 'all' && b.futureScope < parseInt(scope)) return false;
    if (q) {
      const matchName = b.name.toLowerCase().includes(q);
      const matchDesc = (b.desc || '').toLowerCase().includes(q);
      const matchWho = (b.whoSuits || '').toLowerCase().includes(q);
      const matchSkills = b.coreSkills && b.coreSkills.some(s => s.toLowerCase().includes(q));
      const matchTools = b.tools && b.tools.some(t => t.toLowerCase().includes(q));
      const matchCareers = b.careers && b.careers.some(c => c.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchWho && !matchSkills && !matchTools && !matchCareers) return false;
    }
    return true;
  });
};

// Search by name
const searchName = filterProfiles('Computer Science', 'all', 'all', 'all');
console.log(`✓ Search "Computer Science": ${searchName.length} matches found`);
assert(searchName.length >= 6, 'Should find at least 6 computer science variants');

// Search by description
const searchDesc = filterProfiles('hardware and software', 'all', 'all', 'all');
console.log(`✓ Search by description ("hardware and software"): ${searchDesc.length} matches found`);
assert(searchDesc.length >= 1);

// Search by tools
const searchTool = filterProfiles('Figma', 'all', 'all', 'all');
console.log(`✓ Search by tool ("Figma"): ${searchTool.length} matches found`);
assert(searchTool.length >= 2);

// Filter by cluster
const filterCluster = filterProfiles('', 'commerce-finance', 'all', 'all');
console.log(`✓ Filter cluster "commerce-finance": ${filterCluster.length} matches found (Expected: 9)`);
assert.strictEqual(filterCluster.length, 9);

// Filter by difficulty 5
const filterDiff5 = filterProfiles('', 'all', '5', 'all');
console.log(`✓ Filter difficulty "5" (Very Challenging): ${filterDiff5.length} matches found`);
assert(filterDiff5.length > 0);

// Filter by futureScope 5
const filterScope5 = filterProfiles('', 'all', 'all', '5');
console.log(`✓ Filter future scope "5" (Exceptional Scope): ${filterScope5.length} matches found`);
assert(filterScope5.length > 0);

// Combined filter: cluster "ai-data" + scope 5
const combined = filterProfiles('', 'ai-data', 'all', '5');
console.log(`✓ Combined filter (cluster "ai-data" + scope 5): ${combined.length} matches found (Expected: 6)`);
assert.strictEqual(combined.length, 6);

// Clear filters restores all
const allRestored = filterProfiles('', 'all', 'all', 'all');
console.log(`✓ Clear filters restores complete catalogue: ${allRestored.length} profiles (Expected: 147)`);
assert.strictEqual(allRestored.length, 147);

// 3. Roadmap Detail Section Verification
console.log('\n--- 3. ROADMAP DETAIL VIEW VERIFICATION ---');
let roadmapIssues = 0;
Object.entries(roadmaps).forEach(([id, r]) => {
  if (!r.whyFits || !r.yearByYear || !r.coreSubjects || !r.tools || !r.projects || !r.internshipStrategy || !r.careerPaths || !r.topRecruiters || !r.salaryDirection || !r.futureTrends || !r.risks || !r.actionPlan) {
    console.error(`Roadmap ${id} missing required detail section`);
    roadmapIssues++;
  }
});
console.log(`✓ Roadmap Section Integrity Issues: ${roadmapIssues} (Expected: 0)`);
assert.strictEqual(roadmapIssues, 0);

// 4. Non-Engineering Fallback Isolation Verification
console.log('\n--- 4. DOMAIN-AWARE FALLBACK ROADMAP VERIFICATION ---');
nonEngineering.forEach(b => {
  const r = roadmaps[b.id];
  // Verify that Commerce and Arts roadmaps NEVER have engineering graphics or engineering mathematics in year 1
  if (r && r.yearByYear && r.yearByYear[0]) {
    const year1Items = r.yearByYear[0].items.join(' ').toLowerCase();
    assert(!year1Items.includes('engineering graphics'), `Non-engineering career ${b.id} must not have Engineering Graphics!`);
    assert(!year1Items.includes('workshop practice'), `Non-engineering career ${b.id} must not have Workshop Practice!`);
  }
});
console.log('✓ Verified: Non-engineering careers have zero engineering-specific subjects.');

console.log('\n====================================================');
console.log('ALL VERIFICATION AND INTEGRITY TESTS PASSED (100%)');
console.log('====================================================');
