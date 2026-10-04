/**
 * Career Roadmap Data Ingestion Script
 * ─────────────────────────────────────
 * Reads Career_Roadmap_Master_PRODUCTION.xlsx and produces
 * a single typed JSON file at src/data/career-roadmap.json.
 * 
 * Run: node scripts/generate-career-roadmap-data.cjs
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const WORKBOOK_PATH = path.join(ROOT, 'Career_Roadmap_Master_PRODUCTION.xlsx');
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'career-roadmap.json');

// ── Helpers ──────────────────────────────────────────────────
function readSheet(wb, name) {
  const ws = wb.Sheets[name];
  if (!ws) throw new Error(`Sheet "${name}" not found in workbook`);
  return XLSX.utils.sheet_to_json(ws, { defval: '' });
}

function splitSemicolon(value) {
  if (!value || typeof value !== 'string') return [];
  return value.split(';').map(s => s.trim()).filter(Boolean);
}

function normalizeStatus(status) {
  if (!status) return 'UNKNOWN';
  const s = String(status).toUpperCase().trim();
  return s || 'UNKNOWN';
}

// ── Ingestion ────────────────────────────────────────────────
function ingest() {
  console.log(`\n📖 Reading workbook: ${WORKBOOK_PATH}`);
  const wb = XLSX.readFile(WORKBOOK_PATH);

  // ── 1. NODES (17_API_NODES) ──
  const rawNodes = readSheet(wb, '17_API_NODES');
  console.log(`   17_API_NODES: ${rawNodes.length} rows`);

  const nodes = rawNodes.map(row => ({
    id: String(row.node_id || '').trim(),
    type: String(row.node_type || '').trim(),
    canonicalName: String(row.canonical_name || '').trim(),
    displayName: String(row.display_name || '').trim(),
    shortName: String(row.short_name || '').trim(),
    description: String(row.description || '').trim(),
    descriptionStatus: String(row.description_status || '').trim(),
    parentDomain: String(row.parent_domain || '').trim(),
    aliases: splitSemicolon(row.aliases),
    applicationStage: String(row.application_stage || '').trim(),
    status: normalizeStatus(row.node_status),
    canonicalStatus: String(row.canonical_status || '').trim(),
    canonicalConfidence: String(row.canonical_confidence || '').trim(),
    whatIsIt: String(row.what_is_it || '').trim(),
    whatYouStudy: String(row.what_you_study || '').trim(),
    duration: String(row.duration || '').trim(),
    eligibility: String(row.eligibility || '').trim(),
    skills: String(row.skills || '').trim(),
    typicalEntryRoute: String(row.typical_entry_route || '').trim(),
    furtherStudy: String(row.further_study || '').trim(),
    careerOptions: String(row.career_options || '').trim(),
    sourceName: String(row.source_name || '').trim(),
    sourcePage: String(row.source_page || '').trim(),
    sourceSection: String(row.source_section || '').trim(),
    sourceType: String(row.source_type || '').trim(),
    confidence: String(row.confidence || '').trim(),
    sourceUrl: String(row.source_url || '').trim(),
    sourceDate: String(row.source_date || '').trim(),
    enrichmentFlag: String(row.enrichment_flag || '').trim(),
  }));

  // ── 2. EDGES (18_API_EDGES) ──
  const rawEdges = readSheet(wb, '18_API_EDGES');
  console.log(`   18_API_EDGES: ${rawEdges.length} rows`);

  const edges = rawEdges.map(row => ({
    id: String(row.edge_id || '').trim(),
    fromNodeId: String(row.from_node_id || '').trim(),
    toNodeId: String(row.to_node_id || '').trim(),
    fromType: String(row.from_type || '').trim(),
    toType: String(row.to_type || '').trim(),
    fromName: String(row.from_name || '').trim(),
    toName: String(row.to_name || '').trim(),
    edgeType: String(row.edge_type || '').trim(),
    edgeRole: String(row.edge_role || '').trim(),
    condition: String(row.condition || '').trim(),
    durationText: String(row.duration_text || '').trim(),
    status: normalizeStatus(row.status),
    canonicalStatus: String(row.canonical_status || '').trim(),
    confidence: String(row.confidence || '').trim(),
    sourceType: String(row.source_type || '').trim(),
    sourceReference: String(row.source_reference || '').trim(),
    sourcePage: String(row.source_page || '').trim(),
  }));

  // ── 3. PROGRAMMES (19_API_PROGRAMMES) ──
  const rawProgrammes = readSheet(wb, '19_API_PROGRAMMES');
  console.log(`   19_API_PROGRAMMES: ${rawProgrammes.length} rows`);

  const programmes = rawProgrammes.map(row => ({
    id: String(row.degree_id || '').trim(),
    canonicalName: String(row.canonical_name || '').trim(),
    fullName: String(row.full_name || '').trim(),
    degreeType: String(row.degree_type || '').trim(),
    durationYears: String(row.duration_total_years || '').trim(),
    durationAcademicYears: String(row.duration_academic_years || '').trim(),
    durationInternshipYears: String(row.duration_internship_years || '').trim(),
    durationStatus: String(row.duration_status || '').trim(),
    currentCanonicalDuration: String(row.current_canonical_duration || '').trim(),
    eligibilityStatus: String(row.eligibility_status || '').trim(),
    eligibility: String(row.eligibility || '').trim(),
    eligibleSubjectCombinations: String(row.eligible_subject_combinations || '').trim(),
    fieldIds: splitSemicolon(row.field_ids),
    fieldNames: splitSemicolon(row.field_names),
    sourcePage: String(row.source_page || '').trim(),
    sourceReference: String(row.source_reference || '').trim(),
    confidence: String(row.confidence || '').trim(),
    notes: String(row.notes || '').trim(),
  }));

  // ── 4. COLLEGE PROGRAMMES (20_API_COLLEGE_PROGRAMMES) ──
  const rawCollegeProgrammes = readSheet(wb, '20_API_COLLEGE_PROGRAMMES');
  console.log(`   20_API_COLLEGE_PROGRAMMES: ${rawCollegeProgrammes.length} rows`);

  const collegeProgrammes = rawCollegeProgrammes.map(row => ({
    id: String(row.college_program_id || '').trim(),
    collegeId: String(row.college_id || '').trim(),
    collegeName: String(row.college_name || '').trim(),
    degreeId: String(row.degree_id || '').trim(),
    programmeId: String(row.programme_id || '').trim(),
    specialisationId: String(row.specialisation_id || '').trim(),
    fieldId: String(row.field_id || '').trim(),
    programmeName: String(row.programme_name || '').trim(),
    campus: String(row.campus || '').trim(),
    eligibility: String(row.eligibility || '').trim(),
    entranceExamId: String(row.entrance_exam_id || '').trim(),
    source: String(row.source || '').trim(),
    confidence: String(row.confidence || '').trim(),
    status: normalizeStatus(row.status),
    relationshipLevel: String(row.relationship_level || '').trim(),
    admissionBasis: String(row.admission_basis || '').trim(),
    listName: String(row.list_name || '').trim(),
  }));

  // ── 5. EXAM PROGRAMMES (21_API_EXAM_PROGRAMMES) ──
  const rawExamProgrammes = readSheet(wb, '21_API_EXAM_PROGRAMMES');
  console.log(`   21_API_EXAM_PROGRAMMES: ${rawExamProgrammes.length} rows`);

  const examProgrammes = rawExamProgrammes.map(row => ({
    id: String(row.map_id || '').trim(),
    examId: String(row.exam_id || '').trim(),
    examName: String(row.exam_name || '').trim(),
    programmeId: String(row.programme_id || '').trim(),
    programmeName: String(row.programme_name || '').trim(),
    degreeId: String(row.degree_id || '').trim(),
    degreeName: String(row.degree_name || '').trim(),
    institutionId: String(row.institution_id || '').trim(),
    eligibilityContext: String(row.eligibility_context || '').trim(),
    source: String(row.source || '').trim(),
    confidence: String(row.confidence || '').trim(),
    status: normalizeStatus(row.status),
    timeSensitive: String(row.time_sensitive || '').trim(),
  }));

  // ── 6. CAREERS (22_API_CAREERS) ──
  const rawCareers = readSheet(wb, '22_API_CAREERS');
  console.log(`   22_API_CAREERS: ${rawCareers.length} rows`);

  const careers = rawCareers.map(row => ({
    id: String(row.career_id || '').trim(),
    nodeType: String(row.node_type || '').trim(),
    canonicalName: String(row.canonical_name || '').trim(),
    careerCategory: String(row.career_category || '').trim(),
    description: String(row.description || '').trim(),
    fieldIds: splitSemicolon(row.field_ids),
    entryDegreeIds: splitSemicolon(row.entry_degree_ids),
    parentNodeIds: splitSemicolon(row.parent_node_ids),
    specialisationIds: splitSemicolon(row.specialisation_ids),
    skillArea: String(row.skill_area || '').trim(),
    furtherStudyOptions: String(row.further_study_options || '').trim(),
    sourcePage: String(row.source_page || '').trim(),
    sourceReference: String(row.source_reference || '').trim(),
  }));

  // ── 7. START OPTIONS (23_START_OPTIONS) ──
  const rawStartOptions = readSheet(wb, '23_START_OPTIONS');
  console.log(`   23_START_OPTIONS: ${rawStartOptions.length} rows`);

  const startOptions = rawStartOptions.map(row => ({
    nextNodeId: String(row.next_node_id || '').trim(),
    nextNodeType: String(row.next_node_type || '').trim(),
    nextNodeName: String(row.next_node_name || '').trim(),
    edgeType: String(row.edge_type || '').trim(),
    condition: String(row.condition || '').trim(),
    durationText: String(row.duration_text || '').trim(),
    canonicalStatus: String(row.canonical_status || '').trim(),
    confidence: String(row.confidence || '').trim(),
    sourceReference: String(row.source_reference || '').trim(),
    sourcePage: String(row.source_page || '').trim(),
  }));

  // ── 8. STATUS LEGEND (26_STATUS_LEGEND) ──
  const rawStatusLegend = readSheet(wb, '26_STATUS_LEGEND');
  console.log(`   26_STATUS_LEGEND: ${rawStatusLegend.length} rows`);

  const statusLegend = rawStatusLegend.map(row => ({
    status: String(row['Status / Flag'] || '').trim(),
    interpretation: String(row['Interpretation'] || '').trim(),
    frontendRule: String(row['Frontend rule'] || '').trim(),
  }));

  // ── 9. DATA QUALITY (25_DATA_QUALITY) ──
  const rawDataQuality = readSheet(wb, '25_DATA_QUALITY');
  const dataQuality = {};
  for (const row of rawDataQuality) {
    const key = String(row.metric || '').trim();
    const val = row.value;
    if (key) dataQuality[key] = val;
  }

  // ── Validation ─────────────────────────────────────────────
  console.log('\n🔍 Running validation...');
  const errors = [];
  const warnings = [];

  // Check node_id uniqueness
  const nodeIds = new Set();
  for (const node of nodes) {
    if (!node.id) { errors.push(`Node missing id`); continue; }
    if (nodeIds.has(node.id)) errors.push(`Duplicate node_id: ${node.id}`);
    nodeIds.add(node.id);
  }

  // Check edge referential integrity
  let orphanedEdges = 0;
  for (const edge of edges) {
    if (!nodeIds.has(edge.fromNodeId)) {
      orphanedEdges++;
      if (orphanedEdges <= 5) warnings.push(`Edge ${edge.id}: from_node_id "${edge.fromNodeId}" not found in nodes`);
    }
    if (!nodeIds.has(edge.toNodeId)) {
      orphanedEdges++;
      if (orphanedEdges <= 5) warnings.push(`Edge ${edge.id}: to_node_id "${edge.toNodeId}" not found in nodes`);
    }
  }
  if (orphanedEdges > 5) warnings.push(`... and ${orphanedEdges - 5} more orphaned edge references`);

  // Check edge_id uniqueness
  const edgeIds = new Set();
  for (const edge of edges) {
    if (edgeIds.has(edge.id)) errors.push(`Duplicate edge_id: ${edge.id}`);
    edgeIds.add(edge.id);
  }

  // Node type distribution
  const typeDistribution = {};
  for (const node of nodes) {
    typeDistribution[node.type] = (typeDistribution[node.type] || 0) + 1;
  }

  // Status distribution
  const statusDistribution = {};
  for (const node of nodes) {
    statusDistribution[node.status] = (statusDistribution[node.status] || 0) + 1;
  }

  const activeEdges = edges.filter(e => e.status === 'ACTIVE').length;
  const pendingEdges = edges.filter(e => e.status !== 'ACTIVE').length;

  console.log(`\n📊 Summary:`);
  console.log(`   Nodes: ${nodes.length} (${Object.entries(typeDistribution).map(([k, v]) => `${k}: ${v}`).join(', ')})`);
  console.log(`   Edges: ${edges.length} (ACTIVE: ${activeEdges}, Other: ${pendingEdges})`);
  console.log(`   Programmes: ${programmes.length}`);
  console.log(`   College Programmes: ${collegeProgrammes.length}`);
  console.log(`   Exam Programmes: ${examProgrammes.length}`);
  console.log(`   Careers: ${careers.length}`);
  console.log(`   Start Options: ${startOptions.length}`);

  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`);
    errors.forEach(e => console.log(`   • ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`);
    warnings.forEach(w => console.log(`   • ${w}`));
  }

  if (errors.length > 0) {
    console.error('\n🚫 Aborting due to validation errors.');
    process.exit(1);
  }

  // ── Output ─────────────────────────────────────────────────
  const output = {
    _meta: {
      version: '1.0.0',
      datasetVersion: dataQuality.dataset_version || '1.0.0',
      datasetDate: dataQuality.dataset_date || new Date().toISOString().split('T')[0],
      generatedAt: new Date().toISOString(),
      source: 'Career_Roadmap_Master_PRODUCTION.xlsx',
      counts: {
        nodes: nodes.length,
        edges: edges.length,
        activeEdges,
        programmes: programmes.length,
        collegeProgrammes: collegeProgrammes.length,
        examProgrammes: examProgrammes.length,
        careers: careers.length,
        startOptions: startOptions.length,
      },
      nodeTypeDistribution: typeDistribution,
      nodeStatusDistribution: statusDistribution,
    },
    statusLegend,
    startOptions,
    nodes,
    edges,
    programmes,
    collegeProgrammes,
    examProgrammes,
    careers,
  };

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  const sizeMB = (fs.statSync(OUTPUT_PATH).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ Written to ${OUTPUT_PATH} (${sizeMB} MB)`);
  console.log('');
}

ingest();
