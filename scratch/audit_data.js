const fs = require('fs');
const path = require('path');
const vm = require('vm');

let code = fs.readFileSync(path.join(__dirname, '../src/data/career-library/branches_data.js'), 'utf-8');

// Replace const declarations with globalThis assignments
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
const explicitRoadmapKeys = sandbox.__EXPLICIT_ROADMAP_KEYS || [];

const branchIds = BRANCHES.map(b => b.id);
const uniqueBranchIds = new Set(branchIds);

// Clusters
const clusterKeys = Object.keys(CLUSTERS);
const invalidClusterRefs = [];
BRANCHES.forEach(b => {
  if (!CLUSTERS[b.cluster]) {
    invalidClusterRefs.push({ id: b.id, cluster: b.cluster });
  }
});

// Explicit vs generated roadmaps
const explicitSet = new Set(explicitRoadmapKeys);
let explicitlyAuthoredCount = 0;
let fallbackGeneratedCount = 0;
const missingRoadmapRefs = [];

BRANCHES.forEach(b => {
  if (explicitSet.has(b.id)) {
    explicitlyAuthoredCount++;
  } else if (ROADMAPS[b.id]) {
    fallbackGeneratedCount++;
  } else {
    missingRoadmapRefs.push(b.id);
  }
});

// Check fields expected by UI
const fieldIssues = [];
BRANCHES.forEach(b => {
  const missing = [];
  ['id', 'name', 'cluster', 'desc', 'difficulty', 'futureScope', 'whoSuits', 'coreSkills', 'tools', 'careers'].forEach(f => {
    if (b[f] === undefined || b[f] === null) missing.push(f);
  });
  if (missing.length > 0) fieldIssues.push({ id: b.id, missing });
});

// Duplicate check
const duplicates = [];
const seen = new Set();
BRANCHES.forEach(b => {
  if (seen.has(b.id)) duplicates.push(b.id);
  seen.add(b.id);
});

// Stream distribution
const streamDistribution = {};
const clusterDistribution = {};
BRANCHES.forEach(b => {
  const c = CLUSTERS[b.cluster];
  const stream = c ? c.stream : 'unknown';
  streamDistribution[stream] = (streamDistribution[stream] || 0) + 1;
  clusterDistribution[b.cluster] = (clusterDistribution[b.cluster] || 0) + 1;
});

const report = {
  totalBranchProfiles: BRANCHES.length,
  uniqueBranchIds: uniqueBranchIds.size,
  duplicateBranchIds: duplicates,
  totalClusters: clusterKeys.length,
  totalTraits: TRAITS.length,
  totalStreams: STREAMS ? Object.keys(STREAMS).length : 0,
  explicitlyAuthoredRoadmaps: explicitlyAuthoredCount,
  fallbackGeneratedRoadmaps: fallbackGeneratedCount,
  totalRoadmaps: Object.keys(ROADMAPS).length,
  missingRoadmapRefs,
  invalidClusterRefs,
  fieldIssues,
  streamDistribution,
  clusterDistribution
};

console.log(JSON.stringify(report, null, 2));
