#!/usr/bin/env node
/**
 * scripts/export-simple-master.cjs
 *
 * Generates Career_Roadmap_SIMPLE_MASTER.xlsx
 * - Exactly ONE worksheet named ROADMAP_DATA
 * - Human-readable columns (no raw IDs)
 * - One row per meaningful entity / relationship
 * - Sources: career-roadmap.json + career-enrichment.json + University.json
 *
 * Usage:
 *   node scripts/export-simple-master.cjs
 */

'use strict';

const path = require('path');
const fs   = require('fs');
const ExcelJS = require('exceljs');

// ── Data sources ─────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..');
const roadmapData   = require(path.join(ROOT, 'src/data/career-roadmap.json'));
const enrichment    = require(path.join(ROOT, 'src/data/career-enrichment.json'));
const universities  = require(path.join(ROOT, 'src/data/University.json'));

// ── Column Headers (human-readable, boss-facing) ─────────────────────────────
const HEADERS = [
  'Category',
  'Stream',
  'Subject Combination',
  'Field',
  'Course / Programme',
  'Degree',
  'Specialisation',
  'Duration',
  'Eligibility',
  'Entrance Exam',
  'Admission Route',
  'College / University',
  'Country',
  'Further Study',
  'Career Domain',
  'Career',
  'Job Role',
  'Source',
  'Verification Status',
  'Source URL',
];

// ── Helper: resolve edge target node names ────────────────────────────────────
const nodeMap = {};
roadmapData.nodes.forEach(n => { nodeMap[n.id] = n; });

function nodeName(id) {
  const n = nodeMap[id];
  return n ? (n.displayName || n.canonicalName || id) : id;
}

// ── Helper: clean "NOT_IN_SOURCE" sentinel values ─────────────────────────────
function clean(v) {
  if (!v || v === 'NOT_IN_SOURCE' || v === 'N/A' || v === '') return '';
  return String(v).trim();
}

// ── Rows accumulator ──────────────────────────────────────────────────────────
const rows = [];

function addRow(fields) {
  rows.push({
    Category:             fields.category             || '',
    'Stream':             fields.stream               || '',
    'Subject Combination':fields.subjectCombination   || '',
    'Field':              fields.field                || '',
    'Course / Programme': fields.course               || '',
    'Degree':             fields.degree               || '',
    'Specialisation':     fields.specialisation       || '',
    'Duration':           fields.duration             || '',
    'Eligibility':        fields.eligibility          || '',
    'Entrance Exam':      fields.entranceExam         || '',
    'Admission Route':    fields.admissionRoute       || '',
    'College / University': fields.college            || '',
    'Country':            fields.country              || '',
    'Further Study':      fields.furtherStudy         || '',
    'Career Domain':      fields.careerDomain         || '',
    'Career':             fields.career               || '',
    'Job Role':           fields.jobRole              || '',
    'Source':             fields.source               || '',
    'Verification Status':fields.verificationStatus   || '',
    'Source URL':         fields.sourceUrl            || '',
  });
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 1 — STREAMS
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.nodes
  .filter(n => n.type === 'STREAM')
  .forEach(n => {
    addRow({
      category: 'STREAM',
      stream: clean(n.displayName || n.canonicalName),
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: clean(n.canonicalStatus) || 'SOURCE_CONFIRMED',
    });
  });

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 2 — SUBJECT COMBINATIONS
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.nodes
  .filter(n => n.type === 'SUBJECT_COMBINATION')
  .forEach(n => {
    // Find parent stream via edges
    const parentEdge = roadmapData.edges.find(
      e => e.to === n.id && nodeMap[e.from]?.type === 'STREAM'
    );
    addRow({
      category: 'SUBJECT COMBINATION',
      stream: parentEdge ? nodeName(parentEdge.from) : '',
      subjectCombination: clean(n.displayName || n.canonicalName),
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: clean(n.canonicalStatus) || 'SOURCE_CONFIRMED',
    });
  });

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 3 — FIELDS
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.nodes
  .filter(n => n.type === 'FIELD')
  .forEach(n => {
    addRow({
      category: 'FIELD',
      field: clean(n.displayName || n.canonicalName),
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: clean(n.canonicalStatus) || 'SOURCE_CONFIRMED',
    });
  });

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 4 — DEGREES / PROGRAMMES
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.programmes.forEach(p => {
  addRow({
    category: 'DEGREE',
    field: clean(p.fieldNames?.[0]),
    course: clean(p.canonicalName),
    degree: clean(p.fullName || p.canonicalName),
    duration: clean(p.currentCanonicalDuration || p.durationYears ? `${p.durationYears} years` : ''),
    eligibility: clean(p.eligibility),
    subjectCombination: clean(p.eligibleSubjectCombinations),
    source: `Career Roadmap Master (runtime) — p.${clean(p.sourcePage)}`,
    verificationStatus: clean(p.eligibilityStatus) || 'SOURCE_CONFIRMED',
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 5 — SPECIALISATIONS
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.nodes
  .filter(n => n.type === 'SPECIALISATION')
  .forEach(n => {
    // Find parent degree
    const parentEdge = roadmapData.edges.find(
      e => e.to === n.id && nodeMap[e.from]?.type === 'DEGREE'
    );
    addRow({
      category: 'SPECIALISATION',
      course: parentEdge ? nodeName(parentEdge.from) : '',
      specialisation: clean(n.displayName || n.canonicalName),
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: clean(n.canonicalStatus) || 'SOURCE_CONFIRMED',
    });
  });

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 6 — ENTRANCE EXAMS
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.nodes
  .filter(n => n.type === 'ENTRANCE_EXAM')
  .forEach(n => {
    addRow({
      category: 'ENTRANCE EXAM',
      entranceExam: clean(n.displayName || n.canonicalName),
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: clean(n.canonicalStatus) || 'SOURCE_CONFIRMED',
    });
  });

// Exam-programme links
roadmapData.examProgrammes.forEach(ep => {
  const examNode = nodeMap[ep.examId];
  if (!examNode) return;
  ep.linkedProgrammeIds?.forEach(progId => {
    const prog = nodeMap[progId];
    if (!prog) return;
    addRow({
      category: 'EXAM → PROGRAMME LINK',
      course: clean(prog.displayName || prog.canonicalName),
      entranceExam: clean(examNode.displayName || examNode.canonicalName),
      admissionRoute: 'Entrance Exam',
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: 'SOURCE_CONFIRMED',
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 7 — COLLEGES
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.nodes
  .filter(n => n.type === 'COLLEGE' || n.type === 'COLLEGE_GROUP')
  .forEach(n => {
    addRow({
      category: 'COLLEGE',
      college: clean(n.displayName || n.canonicalName),
      country: 'India',
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: clean(n.canonicalStatus) || 'SOURCE_CONFIRMED',
    });
  });

// College-programme links
roadmapData.collegeProgrammes.forEach(cp => {
  const collegeNode = nodeMap[cp.collegeId];
  if (!collegeNode) return;
  cp.programmeIds?.forEach(progId => {
    const prog = roadmapData.programmes.find(p => p.id === progId);
    if (!prog) return;
    addRow({
      category: 'COLLEGE → PROGRAMME LINK',
      college: clean(collegeNode.displayName || collegeNode.canonicalName),
      course: clean(prog.canonicalName),
      degree: clean(prog.fullName || prog.canonicalName),
      country: 'India',
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: 'SOURCE_CONFIRMED',
    });
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 8 — CAREERS (from roadmap)
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.careers.forEach(c => {
  const entryDegreeNames = (c.entryDegreeIds || [])
    .map(id => {
      const prog = roadmapData.programmes.find(p => p.id === id);
      return prog ? clean(prog.canonicalName) : '';
    })
    .filter(Boolean);

  addRow({
    category: 'CAREER',
    career: clean(c.canonicalName),
    degree: entryDegreeNames.join('; '),
    source: `Career Roadmap Master (runtime) — p.${clean(c.sourcePage)}`,
    verificationStatus: 'SOURCE_CONFIRMED',
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 9 — PROFESSIONS / JOB ROLES (from roadmap)
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.nodes
  .filter(n => n.type === 'PROFESSION' || n.type === 'RECRUITMENT_EXAM')
  .forEach(n => {
    addRow({
      category: n.type === 'PROFESSION' ? 'JOB ROLE' : 'RECRUITMENT EXAM',
      jobRole: n.type === 'PROFESSION' ? clean(n.displayName || n.canonicalName) : '',
      entranceExam: n.type === 'RECRUITMENT_EXAM' ? clean(n.displayName || n.canonicalName) : '',
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: clean(n.canonicalStatus) || 'SOURCE_CONFIRMED',
    });
  });

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 10 — POSTGRADUATE PROGRAMMES (from roadmap)
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.nodes
  .filter(n => n.type === 'POSTGRADUATE_PROGRAM')
  .forEach(n => {
    addRow({
      category: 'POSTGRADUATE',
      degree: clean(n.displayName || n.canonicalName),
      duration: clean(n.duration),
      eligibility: clean(n.eligibility),
      furtherStudy: clean(n.displayName || n.canonicalName),
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: clean(n.canonicalStatus) || 'SOURCE_CONFIRMED',
    });
  });

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 11 — CERTIFICATIONS & ROUTES
// ════════════════════════════════════════════════════════════════════════════════
roadmapData.nodes
  .filter(n => n.type === 'CERTIFICATION')
  .forEach(n => {
    addRow({
      category: 'CERTIFICATION',
      course: clean(n.displayName || n.canonicalName),
      source: 'Career Roadmap Master (runtime)',
      verificationStatus: clean(n.canonicalStatus) || 'SOURCE_CONFIRMED',
    });
  });

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 12 — ENRICHMENT: CAREER DOMAINS
// ════════════════════════════════════════════════════════════════════════════════
enrichment.careerDomains.forEach(domain => {
  addRow({
    category: 'CAREER DOMAIN',
    careerDomain: clean(domain.canonicalName),
    field: clean(domain.parentDomain),
    source: 'Career Enrichment Layer (runtime)',
    verificationStatus: 'ENRICHMENT_VERIFIED',
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 13 — ENRICHMENT: CAREERS & TRACKS
// ════════════════════════════════════════════════════════════════════════════════
enrichment.careerTracksAndCareers.forEach(c => {
  addRow({
    category: 'CAREER',
    careerDomain: clean(c.parentDomain),
    career: clean(c.canonicalName),
    source: 'Career Enrichment Layer (runtime)',
    verificationStatus: 'ENRICHMENT_VERIFIED',
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 14 — ENRICHMENT: JOB ROLES
// ════════════════════════════════════════════════════════════════════════════════
enrichment.jobRoles.forEach(role => {
  addRow({
    category: 'JOB ROLE',
    careerDomain: clean(role.parentDomain),
    jobRole: clean(role.canonicalName),
    source: 'Career Enrichment Layer (runtime)',
    verificationStatus: 'ENRICHMENT_VERIFIED',
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 15 — ENRICHMENT: MODERN PROGRAMMES
// ════════════════════════════════════════════════════════════════════════════════
enrichment.modernProgrammes.forEach(p => {
  addRow({
    category: 'DEGREE',
    field: clean(p.parentDomain),
    course: clean(p.canonicalName),
    degree: clean(p.canonicalName),
    duration: clean(p.duration),
    eligibility: clean(p.eligibility),
    entranceExam: clean(p.entranceExam),
    careerDomain: clean(p.parentDomain),
    source: 'Career Enrichment Layer (runtime)',
    verificationStatus: 'ENRICHMENT_VERIFIED',
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 16 — ENRICHMENT: RELATIONSHIPS (domain → career, etc.)
// ════════════════════════════════════════════════════════════════════════════════
if (Array.isArray(enrichment.relationships)) {
  enrichment.relationships.forEach(r => {
    addRow({
      category: `LINK: ${r.fromType || 'ENTITY'} → ${r.toType || 'ENTITY'}`,
      careerDomain: clean(r.fromDomain),
      career: r.toType === 'CAREER' ? clean(r.toName) : '',
      jobRole: r.toType === 'PROFESSION' ? clean(r.toName) : '',
      degree: r.toType === 'DEGREE' ? clean(r.toName) : '',
      source: 'Career Enrichment Layer (runtime)',
      verificationStatus: 'ENRICHMENT_VERIFIED',
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 17 — UNIVERSITIES (Study Abroad data from University.json)
// ════════════════════════════════════════════════════════════════════════════════
universities.forEach(u => {
  const rank = u['QS Ranking'] ? `QS #${u['QS Ranking']}` : '';
  addRow({
    category: 'UNIVERSITY',
    college: clean(u.University),
    country: clean(u.Country),
    source: `University.json (runtime) — ${rank}`,
    verificationStatus: 'STUDY_ABROAD_DATA',
  });
});

// ════════════════════════════════════════════════════════════════════════════════
// EXPORT COUNTS
// ════════════════════════════════════════════════════════════════════════════════
const countByCategory = {};
rows.forEach(r => {
  const cat = r.Category || 'UNKNOWN';
  countByCategory[cat] = (countByCategory[cat] || 0) + 1;
});

console.log('\n══════════════════════════════════════════════════');
console.log('  CAREER_ROADMAP_SIMPLE_MASTER — EXPORT SUMMARY');
console.log('══════════════════════════════════════════════════');
console.log(`  Total rows: ${rows.length}`);
console.log('\n  Breakdown by Category:');
Object.entries(countByCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, cnt]) => {
  console.log(`    ${cat.padEnd(40)} ${cnt}`);
});
console.log('══════════════════════════════════════════════════\n');

// ════════════════════════════════════════════════════════════════════════════════
// WRITE EXCEL
// ════════════════════════════════════════════════════════════════════════════════
async function writeExcel() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Career Simplified — Roadmap Export';
  wb.created = new Date();

  // Exactly ONE worksheet
  const ws = wb.addWorksheet('ROADMAP_DATA', {
    views: [{ state: 'frozen', ySplit: 1 }], // freeze header row
  });

  // Header row
  ws.columns = HEADERS.map(h => ({
    header: h,
    key: h,
    width: Math.max(h.length + 4, 18),
  }));

  // Style header row
  const headerRow = ws.getRow(1);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF690B1B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FFC9A55D' } },
    };
  });
  headerRow.height = 22;

  // Add auto-filter
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to:   { row: 1, column: HEADERS.length },
  };

  // Data rows
  rows.forEach((r, idx) => {
    const values = HEADERS.map(h => r[h] || '');
    const row = ws.addRow(values);
    // Alternate row shading for readability
    if (idx % 2 === 0) {
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAF8F5' } };
      });
    }
    row.eachCell(cell => {
      cell.alignment = { vertical: 'top', wrapText: true };
    });
  });

  // Auto-fit column widths based on content (cap at 60)
  ws.columns.forEach(col => {
    let maxLen = col.header ? col.header.length : 10;
    col.eachCell({ includeEmpty: false }, cell => {
      const len = String(cell.value || '').length;
      if (len > maxLen) maxLen = len;
    });
    col.width = Math.min(maxLen + 2, 60);
  });

  // Output paths
  const outRoot = path.join(ROOT, 'Career_Roadmap_SIMPLE_MASTER.xlsx');
  const outPublic = path.join(ROOT, 'public', 'exports', 'Career_Roadmap_SIMPLE_MASTER.xlsx');

  await wb.xlsx.writeFile(outRoot);
  console.log(`✅  Written: ${outRoot}`);

  // Also write to public/exports if directory exists
  const exportsDir = path.dirname(outPublic);
  if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });
  await wb.xlsx.writeFile(outPublic);
  console.log(`✅  Written: ${outPublic}`);
}

writeExcel().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
