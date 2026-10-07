/**
 * Career Roadmap Master Complete Data Exporter
 * ─────────────────────────────────────────────
 * Combines all runtime roadmap data sources:
 *   1. Career_Roadmap_Master_PRODUCTION.xlsx (Nodes, Edges, Programmes, Colleges, Exams, Careers, Start Options)
 *   2. src/data/career-enrichment.json (Layer B Modern Domains, Careers, Professions/Job Roles, Accredited Programmes, Relationships)
 *   3. src/data/University.json (Study Abroad Global Universities)
 * 
 * Generates EXACTLY ONE worksheet: ROADMAP_MASTER_DATA
 * Output filename: Career_Roadmap_COMPLETE_DATA.xlsx
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const MASTER_WORKBOOK_PATH = path.join(ROOT, 'Career_Roadmap_Master_PRODUCTION.xlsx');
const ENRICHMENT_PATH = path.join(ROOT, 'src', 'data', 'career-enrichment.json');
const UNIVERSITY_PATH = path.join(ROOT, 'src', 'data', 'University.json');
const OUTPUT_FILENAME = 'Career_Roadmap_COMPLETE_DATA.xlsx';
const OUTPUT_PATH = path.join(ROOT, OUTPUT_FILENAME);
const PUBLIC_EXPORT_DIR = path.join(ROOT, 'public', 'exports');
const PUBLIC_EXPORT_PATH = path.join(PUBLIC_EXPORT_DIR, OUTPUT_FILENAME);

function safeStr(val) {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

function readSheet(wb, name) {
  const ws = wb.Sheets[name];
  if (!ws) {
    console.warn(`Sheet "${name}" not found in master workbook.`);
    return [];
  }
  return XLSX.utils.sheet_to_json(ws, { defval: '' });
}

function runExport() {
  console.log('============================================================');
  console.log('🚀 Generating Complete Career Roadmap Master Excel Export');
  console.log('============================================================\n');

  if (!fs.existsSync(MASTER_WORKBOOK_PATH)) {
    console.error(`❌ Master workbook not found at: ${MASTER_WORKBOOK_PATH}`);
    process.exit(1);
  }

  const masterWb = XLSX.readFile(MASTER_WORKBOOK_PATH);
  const rows = [];
  const typeCounts = {};

  function addRow(recordType, recordId, data) {
    const row = {
      record_id: safeStr(recordId),
      record_type: safeStr(recordType),
      node_id: safeStr(data.node_id),
      parent_node_id: safeStr(data.parent_node_id),
      from_node_id: safeStr(data.from_node_id),
      to_node_id: safeStr(data.to_node_id),
      relationship_type: safeStr(data.relationship_type),
      canonical_name: safeStr(data.canonical_name),
      display_name: safeStr(data.display_name),
      short_name: safeStr(data.short_name),
      node_type: safeStr(data.node_type),
      roadmap_phase: safeStr(data.roadmap_phase),
      description: safeStr(data.description),
      what_is_it: safeStr(data.what_is_it),
      what_you_study: safeStr(data.what_you_study),
      what_you_do: safeStr(data.what_you_do),
      duration: safeStr(data.duration),
      eligibility: safeStr(data.eligibility),
      typical_entry_route: safeStr(data.typical_entry_route),
      skills: safeStr(data.skills),
      further_study_options: safeStr(data.further_study_options),
      career_options: safeStr(data.career_options),
      degree_family: safeStr(data.degree_family),
      field_ids: safeStr(data.field_ids),
      field_names: safeStr(data.field_names),
      college_name: safeStr(data.college_name),
      college_id: safeStr(data.college_id),
      campus: safeStr(data.campus),
      admission_basis: safeStr(data.admission_basis),
      entrance_exam_name: safeStr(data.entrance_exam_name),
      exam_id: safeStr(data.exam_id),
      eligibility_context: safeStr(data.eligibility_context),
      country: safeStr(data.country),
      university_name: safeStr(data.university_name),
      qs_ranking: safeStr(data.qs_ranking),
      required_profile_score: safeStr(data.required_profile_score),
      source_name: safeStr(data.source_name),
      source_type: safeStr(data.source_type),
      source_url: safeStr(data.source_url),
      source_page: safeStr(data.source_page),
      source_section: safeStr(data.source_section),
      source_date: safeStr(data.source_date),
      verification_status: safeStr(data.verification_status),
      confidence: safeStr(data.confidence),
      enrichment_flag: safeStr(data.enrichment_flag),
      notes: safeStr(data.notes),
    };
    rows.push(row);
    typeCounts[recordType] = (typeCounts[recordType] || 0) + 1;
  }

  // ── 1. Master Nodes ──
  console.log('📦 Ingesting 17_API_NODES...');
  const nodes = readSheet(masterWb, '17_API_NODES');
  nodes.forEach(n => {
    addRow('NODE', n.node_id, {
      node_id: n.node_id,
      canonical_name: n.canonical_name,
      display_name: n.display_name || n.canonical_name,
      short_name: n.short_name,
      node_type: n.node_type,
      roadmap_phase: n.application_stage,
      description: n.description,
      what_is_it: n.what_is_it,
      what_you_study: n.what_you_study,
      duration: n.duration,
      eligibility: n.eligibility,
      skills: n.skills,
      typical_entry_route: n.typical_entry_route,
      further_study_options: n.further_study,
      career_options: n.career_options,
      source_name: n.source_name || 'Career Handbook',
      source_type: n.source_type || 'HANDBOOK',
      source_url: n.source_url,
      source_page: n.source_page,
      source_section: n.source_section,
      source_date: n.source_date || '2024',
      verification_status: n.canonical_status || n.node_status || 'VERIFIED',
      confidence: n.canonical_confidence || n.confidence || 'HIGH',
      enrichment_flag: n.enrichment_flag || 'LAYER_A_CORE',
      notes: n.parent_domain ? `Parent Domain: ${n.parent_domain}` : '',
    });
  });

  // ── 2. Master Edges ──
  console.log('📦 Ingesting 18_API_EDGES...');
  const edges = readSheet(masterWb, '18_API_EDGES');
  edges.forEach(e => {
    addRow('EDGE', e.edge_id, {
      from_node_id: e.from_node_id,
      to_node_id: e.to_node_id,
      relationship_type: e.edge_type,
      display_name: `${e.from_name || e.from_node_id} → ${e.to_name || e.to_node_id}`,
      description: e.condition || e.edge_role,
      duration: e.duration_text,
      source_name: e.source_reference || 'Career Handbook',
      source_type: e.source_type || 'HANDBOOK',
      source_page: e.source_page,
      verification_status: e.canonical_status || e.status || 'ACTIVE',
      confidence: e.confidence || 'HIGH',
      enrichment_flag: 'LAYER_A_CORE',
      notes: e.edge_role ? `Edge Role: ${e.edge_role}` : '',
    });
  });

  // ── 3. Master Programmes ──
  console.log('📦 Ingesting 19_API_PROGRAMMES...');
  const programmes = readSheet(masterWb, '19_API_PROGRAMMES');
  programmes.forEach(p => {
    addRow('PROGRAMME', p.degree_id, {
      node_id: p.degree_id,
      canonical_name: p.canonical_name,
      display_name: p.full_name || p.canonical_name,
      degree_family: p.degree_type,
      duration: p.current_canonical_duration || (p.duration_total_years ? `${p.duration_total_years} Years` : ''),
      eligibility: p.eligibility,
      field_ids: p.field_ids,
      field_names: p.field_names,
      source_name: p.source_reference || 'UGC / AICTE / Handbook',
      source_type: 'GOVERNMENT',
      source_page: p.source_page,
      verification_status: p.eligibility_status || 'VERIFIED',
      confidence: p.confidence || 'HIGH',
      enrichment_flag: 'LAYER_A_CORE',
      notes: p.notes,
    });
  });

  // ── 4. Master College Programmes ──
  console.log('📦 Ingesting 20_API_COLLEGE_PROGRAMMES...');
  const collegeProgrammes = readSheet(masterWb, '20_API_COLLEGE_PROGRAMMES');
  collegeProgrammes.forEach(cp => {
    addRow('COLLEGE_PROGRAMME', cp.college_program_id, {
      college_id: cp.college_id,
      college_name: cp.college_name,
      node_id: cp.programme_id || cp.degree_id,
      display_name: cp.programme_name,
      campus: cp.campus,
      eligibility: cp.eligibility,
      admission_basis: cp.admission_basis,
      exam_id: cp.entrance_exam_id,
      source_name: cp.source || 'Institution Directory',
      source_type: 'DIRECTORY',
      source_url: cp.official_programme_url,
      source_page: cp.source_page,
      source_date: cp.source_date,
      verification_status: cp.status || 'VERIFIED',
      confidence: cp.confidence || 'HIGH',
      enrichment_flag: 'LAYER_A_CORE',
      notes: cp.notes || cp.relationship_level,
    });
  });

  // ── 5. Master Exam Programmes ──
  console.log('📦 Ingesting 21_API_EXAM_PROGRAMMES...');
  const examProgrammes = readSheet(masterWb, '21_API_EXAM_PROGRAMMES');
  examProgrammes.forEach(ep => {
    addRow('EXAM_PROGRAMME', ep.map_id, {
      exam_id: ep.exam_id,
      entrance_exam_name: ep.exam_name,
      node_id: ep.programme_id || ep.degree_id,
      display_name: `${ep.exam_name} → ${ep.programme_name || ep.degree_name}`,
      eligibility_context: ep.eligibility_context,
      college_id: ep.institution_id,
      source_name: ep.source || 'NTA / Exam Authority',
      source_type: 'GOVERNMENT',
      source_url: ep.source_url,
      source_date: ep.source_date,
      verification_status: ep.status || 'ACTIVE',
      confidence: ep.confidence || 'HIGH',
      enrichment_flag: 'LAYER_A_CORE',
      notes: ep.time_sensitive ? 'Time sensitive examination schedule' : '',
    });
  });

  // ── 6. Master Careers ──
  console.log('📦 Ingesting 22_API_CAREERS...');
  const careers = readSheet(masterWb, '22_API_CAREERS');
  careers.forEach(c => {
    addRow('CAREER', c.career_id, {
      node_id: c.career_id,
      canonical_name: c.canonical_name,
      display_name: c.canonical_name,
      node_type: c.node_type || 'CAREER',
      description: c.description,
      field_ids: c.field_ids,
      skills: c.skill_area,
      further_study_options: c.further_study_options,
      source_name: c.source_reference || 'Career Handbook',
      source_type: 'HANDBOOK',
      source_page: c.source_page,
      verification_status: 'VERIFIED',
      confidence: 'HIGH',
      enrichment_flag: 'LAYER_A_CORE',
      notes: c.career_category ? `Category: ${c.career_category}` : '',
    });
  });

  // ── 7. Master Start Options ──
  console.log('📦 Ingesting 23_START_OPTIONS...');
  const startOptions = readSheet(masterWb, '23_START_OPTIONS');
  startOptions.forEach((so, idx) => {
    addRow('START_OPTION', `START_OPT_${idx + 1}`, {
      to_node_id: so.next_node_id,
      node_type: so.next_node_type,
      display_name: so.next_node_name,
      relationship_type: so.edge_type,
      description: so.condition,
      duration: so.duration_text,
      source_name: so.source_reference || 'Handbook Foundation Framework',
      source_type: 'HANDBOOK',
      source_page: so.source_page,
      verification_status: so.canonical_status || 'ACTIVE',
      confidence: so.confidence || 'HIGH',
      enrichment_flag: 'LAYER_A_CORE',
    });
  });

  // ── 8. Academic Branches ──
  console.log('📦 Ingesting 24_ACADEMIC_BRANCHES...');
  const branches = readSheet(masterWb, '24_ACADEMIC_BRANCHES');
  branches.forEach((b, idx) => {
    addRow('ACADEMIC_BRANCH', `ACAD_BRANCH_${idx + 1}`, {
      from_node_id: b.from_node_id,
      to_node_id: b.to_node_id,
      display_name: `${b.from_name} → ${b.to_name}`,
      relationship_type: b.edge_type,
      description: b.condition,
      source_name: b.source_reference || 'National Curriculum Framework',
      source_type: 'GOVERNMENT',
      verification_status: b.canonical_status || 'VERIFIED',
      confidence: b.confidence || 'HIGH',
      enrichment_flag: 'LAYER_A_CORE',
    });
  });

  // ── 9. Layer B Enrichment Dataset ──
  if (fs.existsSync(ENRICHMENT_PATH)) {
    console.log('📦 Ingesting Layer B Enrichment Dataset (career-enrichment.json)...');
    try {
      const enr = JSON.parse(fs.readFileSync(ENRICHMENT_PATH, 'utf8'));

      // Career Domains
      if (Array.isArray(enr.careerDomains)) {
        enr.careerDomains.forEach(cd => {
          addRow('CAREER_DOMAIN', cd.id, {
            node_id: cd.id,
            canonical_name: cd.canonicalName,
            display_name: cd.displayName || cd.canonicalName,
            short_name: cd.displayName,
            node_type: 'CAREER_DOMAIN',
            roadmap_phase: 'INDUSTRY_TRACK',
            description: cd.whatIsIt,
            what_is_it: cd.whatIsIt,
            what_you_study: cd.whatYouStudy,
            duration: cd.duration,
            typical_entry_route: cd.typicalEntryRoute,
            skills: cd.skills,
            further_study_options: cd.furtherStudy,
            career_options: cd.careerOptions,
            source_name: cd.sourceName || 'ACM/IEEE CS2023 & AICTE Guidelines',
            source_type: cd.sourceType || 'STANDARD',
            source_url: cd.sourceUrl,
            source_date: cd.sourceDate || '2024',
            verification_status: cd.verificationStatus || 'VERIFIED',
            confidence: cd.confidence || 'HIGH',
            enrichment_flag: 'LAYER_B_ENRICHED',
            notes: cd.notes,
          });
        });
      }

      // Enriched Careers
      if (Array.isArray(enr.careerTracksAndCareers)) {
        enr.careerTracksAndCareers.forEach(ct => {
          addRow('ENRICHED_CAREER', ct.id, {
            node_id: ct.id,
            canonical_name: ct.canonicalName,
            display_name: ct.displayName || ct.canonicalName,
            node_type: 'CAREER',
            roadmap_phase: 'CAREER_DIRECTION',
            description: ct.whatIsIt,
            what_is_it: ct.whatIsIt,
            what_you_study: ct.whatYouStudy,
            duration: ct.duration,
            typical_entry_route: ct.typicalEntryRoute,
            skills: ct.skills,
            further_study_options: ct.furtherStudy,
            career_options: ct.careerOptions,
            source_name: ct.sourceName || 'O*NET / ACM Computing Curricula',
            source_type: ct.sourceType || 'STANDARD',
            source_url: ct.sourceUrl,
            source_date: ct.sourceDate || '2024',
            verification_status: ct.verificationStatus || 'VERIFIED',
            confidence: ct.confidence || 'HIGH',
            enrichment_flag: 'LAYER_B_ENRICHED',
          });
        });
      }

      // Job Roles / Professions
      if (Array.isArray(enr.jobRoles)) {
        enr.jobRoles.forEach(jr => {
          addRow('JOB_ROLE', jr.id, {
            node_id: jr.id,
            canonical_name: jr.canonicalName,
            display_name: jr.displayName || jr.canonicalName,
            node_type: 'PROFESSION',
            roadmap_phase: 'PROFESSIONAL_DESTINATION',
            description: jr.whatIsIt,
            what_is_it: jr.whatIsIt,
            what_you_study: jr.whatYouStudy,
            duration: jr.duration,
            typical_entry_route: jr.typicalEntryRoute,
            skills: jr.skills,
            further_study_options: jr.furtherStudy,
            career_options: jr.careerOptions,
            source_name: jr.sourceName || 'U.S. BLS / O*NET Standard Occupational Classification',
            source_type: jr.sourceType || 'GOVERNMENT',
            source_url: jr.sourceUrl,
            source_date: jr.sourceDate || '2024',
            verification_status: jr.verificationStatus || 'VERIFIED',
            confidence: jr.confidence || 'HIGH',
            enrichment_flag: 'LAYER_B_ENRICHED',
          });
        });
      }

      // Modern Programmes
      if (Array.isArray(enr.modernProgrammes)) {
        enr.modernProgrammes.forEach(mp => {
          addRow('MODERN_PROGRAMME', mp.id, {
            node_id: mp.id,
            canonical_name: mp.canonicalName,
            display_name: mp.displayName || mp.canonicalName,
            node_type: 'DEGREE',
            roadmap_phase: 'UNDERGRADUATE',
            description: mp.whatIsIt,
            what_is_it: mp.whatIsIt,
            what_you_study: mp.whatYouStudy,
            duration: mp.duration,
            eligibility: mp.eligibility,
            typical_entry_route: mp.typicalEntryRoute,
            skills: mp.skills,
            further_study_options: mp.furtherStudy,
            career_options: mp.careerOptions,
            source_name: mp.sourceName || 'AICTE Model Curriculum for Emerging Tech',
            source_type: mp.sourceType || 'GOVERNMENT',
            source_url: mp.sourceUrl,
            source_date: mp.sourceDate || '2024',
            verification_status: mp.verificationStatus || 'VERIFIED',
            confidence: mp.confidence || 'HIGH',
            enrichment_flag: 'LAYER_B_ENRICHED',
          });
        });
      }

      // Enriched Relationships / Edges
      if (Array.isArray(enr.relationships)) {
        enr.relationships.forEach(rel => {
          addRow('ENRICHED_EDGE', rel.id, {
            from_node_id: rel.fromNodeId,
            to_node_id: rel.toNodeId,
            relationship_type: rel.relationshipType,
            description: rel.condition,
            source_name: rel.sourceName || 'ACM/IEEE Modern Career Curricula',
            source_type: 'STANDARD',
            verification_status: rel.status || 'ACTIVE',
            confidence: rel.confidence || 'HIGH',
            enrichment_flag: 'LAYER_B_ENRICHED',
            notes: `Specificity Weight: ${rel.specificityWeight || 100}`,
          });
        });
      }
    } catch (err) {
      console.warn('⚠️  Could not parse career-enrichment.json:', err.message);
    }
  }

  // ── 10. Study Abroad Universities (University.json) ──
  if (fs.existsSync(UNIVERSITY_PATH)) {
    console.log('📦 Ingesting Study Abroad Universities (University.json)...');
    try {
      const universities = JSON.parse(fs.readFileSync(UNIVERSITY_PATH, 'utf8'));
      universities.forEach((u, idx) => {
        const uId = `UNIV_ABROAD_${String(idx + 1).padStart(3, '0')}`;
        addRow('STUDY_ABROAD_UNIVERSITY', uId, {
          college_id: uId,
          university_name: u.University,
          country: u.Country,
          qs_ranking: u['QS Ranking'],
          required_profile_score: u['Required Profile Score'],
          display_name: `${u.University} (${u.Country})`,
          description: `Global university ranked QS #${u['QS Ranking'] || 'N/A'}. Required student profile score: ${u['Required Profile Score'] || 'N/A'}.`,
          duration: '1–4 Years (Undergraduate / Master\'s)',
          eligibility: 'Academic Qualifications + English Language (IELTS/TOEFL) + Profile Evaluation',
          source_name: 'Career Simplified Global University Dataset',
          source_type: 'DATABASE',
          source_url: '/university-finder',
          source_date: '2026',
          verification_status: 'SOURCE_CONFIRMED',
          confidence: 'HIGH',
          enrichment_flag: 'STUDY_ABROAD_INTEGRATED',
          notes: `QS World Rank: ${u['QS Ranking'] || 'N/A'}`,
        });
      });
    } catch (err) {
      console.warn('⚠️  Could not parse University.json:', err.message);
    }
  }

  console.log(`\n📊 Total Unified Master Rows Assembled: ${rows.length}`);
  console.log('Breakdown by record_type:');
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`   • ${type.padEnd(25)}: ${count} rows`);
  });

  // ── Build Single Worksheet ──
  console.log('\n📑 Constructing single worksheet: "ROADMAP_MASTER_DATA"...');
  const ws = XLSX.utils.json_to_sheet(rows, {
    header: [
      'record_id',
      'record_type',
      'node_id',
      'parent_node_id',
      'from_node_id',
      'to_node_id',
      'relationship_type',
      'canonical_name',
      'display_name',
      'short_name',
      'node_type',
      'roadmap_phase',
      'description',
      'what_is_it',
      'what_you_study',
      'what_you_do',
      'duration',
      'eligibility',
      'typical_entry_route',
      'skills',
      'further_study_options',
      'career_options',
      'degree_family',
      'field_ids',
      'field_names',
      'college_name',
      'college_id',
      'campus',
      'admission_basis',
      'entrance_exam_name',
      'exam_id',
      'eligibility_context',
      'country',
      'university_name',
      'qs_ranking',
      'required_profile_score',
      'source_name',
      'source_type',
      'source_url',
      'source_page',
      'source_section',
      'source_date',
      'verification_status',
      'confidence',
      'enrichment_flag',
      'notes',
    ],
  });

  // Freeze top header row
  ws['!views'] = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  // Compute autofilter range
  const lastCol = XLSX.utils.encode_col(46); // 47 columns (0..46)
  ws['!autofilter'] = { ref: `A1:${lastCol}${rows.length + 1}` };

  // Set readable column widths
  const colWidths = [
    { wch: 22 }, // record_id
    { wch: 24 }, // record_type
    { wch: 18 }, // node_id
    { wch: 18 }, // parent_node_id
    { wch: 18 }, // from_node_id
    { wch: 18 }, // to_node_id
    { wch: 26 }, // relationship_type
    { wch: 36 }, // canonical_name
    { wch: 36 }, // display_name
    { wch: 20 }, // short_name
    { wch: 20 }, // node_type
    { wch: 24 }, // roadmap_phase
    { wch: 55 }, // description
    { wch: 55 }, // what_is_it
    { wch: 55 }, // what_you_study
    { wch: 50 }, // what_you_do
    { wch: 25 }, // duration
    { wch: 50 }, // eligibility
    { wch: 45 }, // typical_entry_route
    { wch: 50 }, // skills
    { wch: 45 }, // further_study_options
    { wch: 50 }, // career_options
    { wch: 20 }, // degree_family
    { wch: 25 }, // field_ids
    { wch: 35 }, // field_names
    { wch: 35 }, // college_name
    { wch: 18 }, // college_id
    { wch: 20 }, // campus
    { wch: 20 }, // admission_basis
    { wch: 30 }, // entrance_exam_name
    { wch: 18 }, // exam_id
    { wch: 40 }, // eligibility_context
    { wch: 18 }, // country
    { wch: 40 }, // university_name
    { wch: 12 }, // qs_ranking
    { wch: 22 }, // required_profile_score
    { wch: 35 }, // source_name
    { wch: 18 }, // source_type
    { wch: 35 }, // source_url
    { wch: 16 }, // source_page
    { wch: 25 }, // source_section
    { wch: 14 }, // source_date
    { wch: 20 }, // verification_status
    { wch: 14 }, // confidence
    { wch: 24 }, // enrichment_flag
    { wch: 45 }, // notes
  ];
  ws['!cols'] = colWidths;

  // Create workbook with EXACTLY ONE worksheet
  const outWb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(outWb, ws, 'ROADMAP_MASTER_DATA');

  // Verify only 1 worksheet
  if (outWb.SheetNames.length !== 1 || outWb.SheetNames[0] !== 'ROADMAP_MASTER_DATA') {
    console.error('❌ Validation Failed: Workbook must contain exactly ONE sheet named "ROADMAP_MASTER_DATA".');
    process.exit(1);
  }

  // Write file to root
  console.log(`💾 Writing workbook to: ${OUTPUT_PATH}`);
  XLSX.writeFile(outWb, OUTPUT_PATH, { compression: true });

  // Copy to public exports for optional web download
  if (!fs.existsSync(PUBLIC_EXPORT_DIR)) {
    fs.mkdirSync(PUBLIC_EXPORT_DIR, { recursive: true });
  }
  fs.copyFileSync(OUTPUT_PATH, PUBLIC_EXPORT_PATH);
  console.log(`💾 Copied to public download endpoint: ${PUBLIC_EXPORT_PATH}`);

  const fileSizeMB = (fs.statSync(OUTPUT_PATH).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ EXPORT SUCCESSFUL:`);
  console.log(`   • File: ${OUTPUT_FILENAME} (${fileSizeMB} MB)`);
  console.log(`   • Sheets: [${outWb.SheetNames.join(', ')}] (Strict count: 1)`);
  console.log(`   • Total Records: ${rows.length}`);
  console.log('============================================================\n');

  return {
    filename: OUTPUT_FILENAME,
    totalRows: rows.length,
    sheets: outWb.SheetNames,
    typeCounts,
  };
}

if (require.main === module) {
  runExport();
}

module.exports = { runExport };
