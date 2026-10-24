const fs = require('fs');
const path = require('path');
const vm = require('vm');

let code = fs.readFileSync(path.join(__dirname, '../src/data/career-library/branches_data.js'), 'utf-8');

code = code.replace(/const TRAITS\s*=/g, 'globalThis.TRAITS =');
code = code.replace(/const CLUSTERS\s*=/g, 'globalThis.CLUSTERS =');
code = code.replace(/const BRANCHES\s*=/g, 'globalThis.BRANCHES =');
code = code.replace(/const ROADMAPS\s*=/g, 'globalThis.ROADMAPS =');
code = code.replace(/const STREAMS\s*=/g, 'globalThis.STREAMS =');

code = code.replace(
  '(function generateRemainingRoadmaps(){',
  'globalThis.__EXPLICIT_ROADMAP_KEYS = Object.keys(globalThis.ROADMAPS);\n(function generateRemainingRoadmaps(){'
);

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const TRAITS = sandbox.TRAITS;
const CLUSTERS = sandbox.CLUSTERS;
const BRANCHES = sandbox.BRANCHES;
const ROADMAPS = sandbox.ROADMAPS;
const STREAMS = sandbox.STREAMS;
const explicitRoadmapKeys = new Set(sandbox.__EXPLICIT_ROADMAP_KEYS || []);

// Convert to structured JSON files
const branchesWithMeta = BRANCHES.map(b => {
  const cluster = CLUSTERS[b.cluster];
  const stream = cluster ? cluster.stream : 'engineering';
  return {
    ...b,
    stream,
    isEngineeringAssessmentEligible: stream === 'engineering',
    hasExplicitRoadmap: explicitRoadmapKeys.has(b.id)
  };
});

const roadmapsWithMeta = {};
Object.keys(ROADMAPS).forEach(id => {
  roadmapsWithMeta[id] = {
    ...ROADMAPS[id],
    isFallback: !explicitRoadmapKeys.has(id)
  };
});

fs.writeFileSync(
  path.join(__dirname, '../src/data/career-library/branches.json'),
  JSON.stringify(branchesWithMeta, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(__dirname, '../src/data/career-library/roadmaps.json'),
  JSON.stringify(roadmapsWithMeta, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(__dirname, '../src/data/career-library/clusters.json'),
  JSON.stringify(CLUSTERS, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(__dirname, '../src/data/career-library/streams.json'),
  JSON.stringify(STREAMS, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(__dirname, '../src/data/career-library/traits.json'),
  JSON.stringify(TRAITS, null, 2),
  'utf-8'
);

console.log('Successfully generated JSON files:');
console.log('- branches.json:', branchesWithMeta.length, 'records');
console.log('- roadmaps.json:', Object.keys(roadmapsWithMeta).length, 'records');
console.log('- clusters.json:', Object.keys(CLUSTERS).length, 'clusters');
console.log('- streams.json:', Object.keys(STREAMS).length, 'streams');
console.log('- traits.json:', TRAITS.length, 'traits');
