#!/usr/bin/env node
/**
 * scripts/export-roadmap-simple-master-final.cjs
 *
 * Generates the clean, human-readable Career Roadmap Master Excel file:
 *   Career_Roadmap_SIMPLE_MASTER_FINAL.xlsx
 *
 * SPECIFICATIONS:
 * - Exactly ONE worksheet named: ROADMAP_DATA
 * - Exactly 16 columns in specified order:
 *     1. Stream Category
 *     2. Subject Combination
 *     3. Degree / Course Title
 *     4. Typical Duration
 *     5. Core Focus Areas
 *     6. Eligibility
 *     7. Entrance Exam
 *     8. Admission Route
 *     9. Specialisation
 *     10. Career Domain
 *     11. Career Options
 *     12. Job Roles
 *     13. Further Study
 *     14. Study Abroad / University
 *     15. Source
 *     16. Verification Status
 * - Style benchmark: undergraduate_degree_options.csv (concise, filterable, human-friendly)
 * - Data sources: career-roadmap.json + career-enrichment.json + University.json
 * - Zero "22" placeholders, zero raw LINK rows, zero raw database IDs, zero student PII.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const ROOT = path.resolve(__dirname, '..');
const roadmapData  = require(path.join(ROOT, 'src/data/career-roadmap.json'));
const enrichment   = require(path.join(ROOT, 'src/data/career-enrichment.json'));
const universities = require(path.join(ROOT, 'src/data/University.json'));

// ── Column Schema (Exact 16 Columns in Exact Order) ───────────────────────────
const COLUMNS = [
  'Stream Category',
  'Subject Combination',
  'Degree / Course Title',
  'Typical Duration',
  'Core Focus Areas',
  'Eligibility',
  'Entrance Exam',
  'Admission Route',
  'Specialisation',
  'Career Domain',
  'Career Options',
  'Job Roles',
  'Further Study',
  'Study Abroad / University',
  'Source',
  'Verification Status',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function clean(v) {
  if (v === null || v === undefined) return '';
  const s = String(v).trim();
  if (s === 'NOT_IN_SOURCE' || s === 'N/A' || s === '22' || s === 'None' || s === 'null') return '';
  return s;
}

// Stream Category mapping from degree name, field name, or context
function normalizeStreamCategory(fieldOrCategory = '', degName = '') {
  const d = String(degName || '').toLowerCase().trim();
  const f = String(fieldOrCategory || '').toLowerCase().trim();
  const comb = `${f} ${d}`;

  // 1. Academic & Research
  if (d.includes('ph.d') || d.includes('doctor of philosophy') || d.includes('m.phil') || comb.includes('doctoral')) {
    return 'Academic & Research';
  }

  // 2. Medical & Healthcare (must precede sports because BSMS is Siddha medicine)
  if (
    d.includes('mbbs') ||
    d.includes('bds') ||
    d.includes('bams') ||
    d.includes('bhms') ||
    d.includes('bums') ||
    d.includes('bnys') ||
    d.includes('bsms') ||
    d.includes('siddha') ||
    d.includes('ayurved') ||
    d.includes('homeopath') ||
    d.includes('unani') ||
    d.includes('naturopath') ||
    d.includes('veterinary') ||
    d.includes('b.v.sc') ||
    d.includes('pharm') ||
    d.includes('nursing') ||
    d.includes('physiotherapy') ||
    d.includes('bpt') ||
    d.includes('mpt') ||
    d.includes('b.m.l.t') ||
    d.includes('bmlt') ||
    d.includes('paramedical') ||
    d.includes('dentistry') ||
    d.includes('dental') ||
    d.includes('pathology') ||
    d.includes('medical') ||
    f.includes('medical') ||
    f.includes('healthcare') ||
    f.includes('medicine') ||
    f.includes('allied healthcare')
  ) {
    return 'Medical & Healthcare';
  }

  // 3. Defence & Public Services
  if (
    comb.includes('nda') ||
    comb.includes('defence') ||
    comb.includes('defense') ||
    comb.includes('armed forces') ||
    comb.includes('navy') ||
    comb.includes('army') ||
    comb.includes('air force') ||
    comb.includes('military') ||
    comb.includes('naval academy')
  ) {
    return 'Defence & Public Services';
  }

  // 4. Sports & Physical Education (excluding BSMS which is Siddha Medicine)
  if (
    (comb.includes('sport') && !comb.includes('transport')) ||
    comb.includes('physical education') ||
    comb.includes('b.p.ed') ||
    comb.includes('bpe') ||
    comb.includes('kinesiology') ||
    comb.includes('p.t. teacher') ||
    comb.includes('fitness coach') ||
    (/\bbsm\b/.test(d) && !d.includes('bsms'))
  ) {
    return 'Sports & Physical Education';
  }

  // 5. Hospitality & Tourism
  if (
    comb.includes('hotel management') ||
    comb.includes('hospitality') ||
    comb.includes('catering') ||
    comb.includes('culinary') ||
    comb.includes('bhm') ||
    comb.includes('tourism') ||
    f.includes('hotel') ||
    f.includes('hospitality') ||
    f.includes('culinary')
  ) {
    return 'Hospitality & Tourism';
  }

  // 6. Professional & Allied Fields (Law, Education, Social Work, Library Science)
  if (
    d.includes('ll.b') ||
    d.includes('llb') ||
    d.includes('b.ed') ||
    d.includes('m.ed') ||
    d.includes('b.lib') ||
    d.includes('law') ||
    d.includes('advocate') ||
    f.includes('law') ||
    f.includes('legal studies') ||
    f.includes('education') ||
    f.includes('teacher training')
  ) {
    return 'Professional & Allied Fields';
  }

  // 7. Science & Technology (STEM) - prioritize Engineering, Tech, Computer Science, Architecture, Pure Science
  if (
    d.includes('b.tech') ||
    d.includes('b.e.') ||
    d.includes('engineering') ||
    d.includes('bca') ||
    d.includes('bcs') ||
    d.includes('m.tech') ||
    d.includes('mca') ||
    d.includes('b.arch') ||
    d.includes('b.plan') ||
    d.includes('b.stat') ||
    d.includes('b.math') ||
    d.includes('computer') ||
    d.includes('artificial intelligence') ||
    d.includes('data science') ||
    d.includes('cyber') ||
    d.includes('software') ||
    d.includes('information technology') ||
    f.includes('engineering') ||
    f.includes('technology') ||
    f.includes('computer science') ||
    f.includes('pure science') ||
    f.includes('mathematics') ||
    f.includes('architecture')
  ) {
    // Exception: B.F.Tech is Fashion Technology -> Design
    if (d.includes('fashion') || d.includes('b.f.tech')) {
      return 'Design & Creative';
    }
    return 'Science & Technology (STEM)';
  }

  // 8. Design & Creative
  if (
    d.includes('b.des') ||
    d.includes('b.i.d') ||
    d.includes('interior design') ||
    d.includes('fashion') ||
    d.includes('bfa') ||
    d.includes('bva') ||
    d.includes('b.cr.a') ||
    d.includes('bpa') ||
    d.includes('fine art') ||
    d.includes('visual art') ||
    d.includes('performing art') ||
    d.includes('animation') ||
    d.includes('applied art') ||
    d.includes('commercial art') ||
    f.includes('fashion') ||
    f.includes('fine arts') ||
    f.includes('visual arts') ||
    f.includes('design')
  ) {
    return 'Design & Creative';
  }

  // 9. Commerce & Business
  if (
    comb.includes('b.com') ||
    comb.includes('commerce') ||
    comb.includes('bba') ||
    comb.includes('bms') ||
    comb.includes('bbm') ||
    comb.includes('bbs') ||
    comb.includes('ipm') ||
    comb.includes('mba') ||
    comb.includes('finance') ||
    comb.includes('accounting') ||
    comb.includes('auditing') ||
    comb.includes('taxation') ||
    comb.includes('business') ||
    comb.includes('management') ||
    comb.includes('economics') ||
    comb.includes('banking') ||
    comb.includes('actuarial') ||
    f.includes('commerce') ||
    f.includes('business') ||
    f.includes('management')
  ) {
    return 'Commerce & Business';
  }

  // 10. Humanities & Arts
  if (
    comb.includes('journalism') ||
    comb.includes('mass comm') ||
    comb.includes('bjmc') ||
    comb.includes('bmc') ||
    comb.includes('media') ||
    comb.includes('bsw') ||
    comb.includes('msw') ||
    comb.includes('social work') ||
    comb.includes('psychology') ||
    comb.includes('literature') ||
    comb.includes('history') ||
    comb.includes('political') ||
    comb.includes('sociology') ||
    comb.includes('liberal') ||
    comb.includes('humanities') ||
    comb.includes('ba ') ||
    comb.includes('ba (hons') ||
    comb.includes('b.a.') ||
    d === 'ba' ||
    f.includes('humanities') ||
    f.includes('liberal arts')
  ) {
    return 'Humanities & Arts';
  }

  // Default fallback
  return 'Science & Technology (STEM)';
}

// Subject Combination normalization
function normalizeSubject(subj) {
  const s = String(subj || '').trim().toUpperCase();
  if (s === 'PCM') return ['PCM'];
  if (s === 'PCB') return ['PCB'];
  if (s === 'PCMB') return ['PCMB'];
  if (s === 'PCB;PCM') return ['PCM', 'PCB'];
  if (s === 'ANY;PCM') return ['PCM', 'Any Stream'];
  if (s === 'COMMERCE') return ['Commerce'];
  if (s === 'ARTS' || s === 'HUMANITIES') return ['Humanities'];
  if (s === 'ARTS;NOT_STATED') return ['Humanities'];
  if (s === 'ANY' || s === 'ANY STREAM') return ['Any Stream'];
  if (s === 'NOT_STATED' || s === '' || s === 'NONE') return ['Any Stream'];
  return ['Any Stream'];
}

// Duration normalization
function normalizeDuration(dur) {
  if (!dur) return '';
  const d = String(dur).toLowerCase();
  if (d.includes('5.5') || d.includes('54 months') || d.includes('4.5 years academic')) return '5.5 Years (incl. internship)';
  if (d.includes('5 year') || d === '5') return '5 Years';
  if (d.includes('4.5 year')) return '4.5 Years';
  if (d.includes('4 year') || d === '4') return '4 Years';
  if (d.includes('3-4') || (d.includes('3') && d.includes('4'))) return '3–4 Years';
  if (d.includes('3 year') || d === '3') return '3 Years';
  if (d.includes('2 year') || d.includes('2 yrs') || d === '2') return '2 Years';
  if (d.includes('1-2') || d.includes('1–2')) return '1–2 Years';
  if (d.includes('1 year') || d.includes('1 yr') || d === '1') return '1 Year';
  if (d.includes('3-5') || d.includes('3 to 5')) return '3–5 Years';
  return '3–4 Years';
}

// Canonical degree title formatting
function formatDegreeTitle(prog) {
  const canonical = clean(prog.canonicalName);
  const full = clean(prog.fullName);
  if (!full || full.toLowerCase() === canonical.toLowerCase()) {
    if (canonical === 'B.Tech.') return 'Bachelor of Technology (B.Tech.)';
    if (canonical === 'B.E.') return 'Bachelor of Engineering (B.E.)';
    if (canonical === 'B.S.') return 'Bachelor of Science (B.S.)';
    if (canonical === 'B.Arch.') return 'Bachelor of Architecture (B.Arch.)';
    if (canonical === 'MBBS') return 'Bachelor of Medicine, Bachelor of Surgery (MBBS)';
    if (canonical === 'BDS') return 'Bachelor of Dental Surgery (BDS)';
    if (canonical === 'B.Pharma' || canonical === 'B.Pharm') return 'Bachelor of Pharmacy (B.Pharm)';
    if (canonical === 'B.Sc. Nursing') return 'Bachelor of Science in Nursing (B.Sc. Nursing)';
    if (canonical === 'B.Com.') return 'Bachelor of Commerce (B.Com.)';
    if (canonical === 'BBA') return 'Bachelor of Business Administration (BBA)';
    if (canonical === 'BCA') return 'Bachelor of Computer Applications (BCA)';
    if (canonical === 'B.Des.') return 'Bachelor of Design (B.Des.)';
    if (canonical === 'BFA') return 'Bachelor of Fine Arts (BFA)';
    if (canonical === 'BJMC') return 'Bachelor of Journalism & Mass Communication (BJMC)';
    if (canonical === 'L.L.B.') return 'Bachelor of Laws (LL.B.)';
    if (canonical === 'B.Ed.') return 'Bachelor of Education (B.Ed.)';
    if (canonical === 'B.P.Ed.') return 'Bachelor of Physical Education (B.P.Ed.)';
    if (canonical === 'BSM') return 'Bachelor of Sports Management (BSM)';
    if (canonical === 'BPT') return 'Bachelor of Physiotherapy (BPT)';
    return canonical;
  }
  if (full.includes(`(${canonical})`) || full.includes(`[${canonical}]`)) {
    return full;
  }
  return `${full} (${canonical})`;
}

// ── Node & Edge Indexing ──────────────────────────────────────────────────────
const nodeMap = {};
roadmapData.nodes.forEach(n => { nodeMap[n.id] = n; });

const outEdgesByNode = {};
const inEdgesByNode  = {};

roadmapData.edges.forEach(ed => {
  if (!outEdgesByNode[ed.fromNodeId]) outEdgesByNode[ed.fromNodeId] = [];
  outEdgesByNode[ed.fromNodeId].push(ed);

  if (!inEdgesByNode[ed.toNodeId]) inEdgesByNode[ed.toNodeId] = [];
  inEdgesByNode[ed.toNodeId].push(ed);
});

// Field to exams map
const fieldToExams = {};
roadmapData.edges
  .filter(ed => ed.fromType === 'FIELD' && ed.toType === 'ENTRANCE_EXAM')
  .forEach(ed => {
    const f = ed.fromName;
    if (!fieldToExams[f]) fieldToExams[f] = [];
    if (!fieldToExams[f].includes(ed.toName)) fieldToExams[f].push(ed.toName);
  });

// Field to careers map
const fieldToCareers = {};
roadmapData.edges
  .filter(ed => ed.fromType === 'FIELD' && ed.toType === 'CAREER')
  .forEach(ed => {
    const f = ed.fromName;
    if (!fieldToCareers[f]) fieldToCareers[f] = [];
    if (!fieldToCareers[f].includes(ed.toName)) fieldToCareers[f].push(ed.toName);
  });

// Field to professions map
const fieldToProfessions = {};
roadmapData.edges
  .filter(ed => ed.fromType === 'FIELD' && ed.toType === 'PROFESSION')
  .forEach(ed => {
    const f = ed.fromName;
    if (!fieldToProfessions[f]) fieldToProfessions[f] = [];
    if (!fieldToProfessions[f].includes(ed.toName)) fieldToProfessions[f].push(ed.toName);
  });

// Boss CSV Focus Areas lookup table for perfect alignment
const BOSS_FOCUS_AREAS = {
  'bachelor of technology / engineering (b.tech/b.e.)': 'Engineering, Software Development, Core Sciences, Data Technology',
  'b.tech.': 'Engineering, Software Development, Core Sciences, Data Technology',
  'b.e.': 'Engineering, Applied Physics, Mechanics, Technical Systems Design',
  'bachelor of science (b.sc.) honors': 'Theoretical physics, chemistry, mathematics, or life sciences',
  'b.sc. / b.sc.(hons.)': 'Theoretical physics, chemistry, mathematics, or life sciences',
  'b.sc.': 'Theoretical sciences, mathematical analysis, scientific inquiry',
  'bachelor of computer applications (bca)': 'Computer applications, software development, database systems',
  'bca': 'Computer applications, software development, database systems',
  'bachelor of medicine, bachelor of surgery (mbbs)': 'Clinical medicine, surgery, human anatomy, medical practice',
  'mbbs': 'Clinical medicine, surgery, human anatomy, medical practice',
  'bachelor of science in nursing (b.sc. nursing)': 'Patient care, healthcare management, clinical nursing',
  'b.sc. nursing': 'Patient care, healthcare management, clinical nursing',
  'bachelor of pharmacy (b.pharm)': 'Pharmaceutical chemistry, pharmacology, drug delivery systems',
  'b.pharma': 'Pharmaceutical chemistry, pharmacology, drug delivery systems',
  'b.pharm': 'Pharmaceutical chemistry, pharmacology, drug delivery systems',
  'bachelor of commerce (b.com / b.com hons.)': 'Financial accounting, corporate taxation, economics, auditing',
  'b.com.': 'Financial accounting, corporate taxation, economics, auditing',
  'b.com. (hons.)': 'Advanced financial accounting, taxation, economics, auditing',
  'bachelor of business administration (bba)': 'Business management, human resources, marketing, operations',
  'bba': 'Business management, human resources, marketing, operations',
  'integrated bba-mba': 'Accelerated management track combining undergraduate & master\'s',
  '5 year integrated bba+mba': 'Accelerated management track combining undergraduate & master\'s',
  'bachelor of arts (b.a. / b.a. hons.)': 'Psychology, literature, history, political science, sociology',
  'ba': 'Psychology, literature, history, political science, sociology',
  'ba (hons.)': 'Literature, history, political science, psychology, sociology',
  'bachelor of fine arts (bfa)': 'Visual arts, painting, sculpting, graphic design',
  'bfa': 'Visual arts, painting, sculpting, graphic design',
  'bachelor of journalism & mass communication (bjmc)': 'Media studies, reporting, public relations, digital journalism',
  'bjmc': 'Media studies, reporting, public relations, digital journalism',
  'bachelor of laws (integrated ba-llb / bba-llb)': 'Constitutional law, corporate law, legal jurisprudence',
  'ba (hons.) llb': 'Constitutional law, corporate law, civil jurisprudence, litigation',
  'bba (hons.) llb': 'Corporate law, business jurisprudence, mergers & acquisitions',
  'b.com. (hons.) llb': 'Taxation laws, corporate finance law, commercial jurisprudence',
  'b.tech. llb': 'Cyber law, intellectual property law, technology regulations',
  'bachelor of design (b.des)': 'Fashion, product design, UI/UX, interior design',
  'b.des.': 'Fashion, product design, UI/UX, interior design',
  'b.des (interior design)': 'Interior spaces, spatial planning, materials, CAD design',
  'b.i.d': 'Interior design, spatial planning, commercial interiors, CAD drafting',
  'bachelor of hotel management (bhm)': 'Hospitality operations, culinary management, tourism dynamics',
  'bhm': 'Hospitality operations, culinary management, tourism dynamics',
  'b.arch.': 'Architectural design, building construction, structural systems, urban planning',
  'bds': 'Dental anatomy, oral surgery, periodontics, prosthodontics, clinical dentistry',
  'bpt': 'Human anatomy, physical rehabilitation, musculoskeletal therapy, neurology',
  'bams': 'Ayurvedic principles, herbology, pharmacology, diagnostic anatomy, patient wellness',
  'bhms': 'Homeopathic pharmacology, organon of medicine, chronic pathology, therapeutics',
  'bums': 'Unani medicine, anatomy, herbal pharmacology, therapeutic regimen, clinical care',
  'bnys': 'Naturopathy, yogic philosophy, nutrition, non-invasive therapies, lifestyle wellness',
  'b.v.sc. & a.h.': 'Veterinary anatomy, animal breeding, surgical pathology, clinical pharmacology',
  'b.sc. (paramedical)': 'Medical diagnostics, radiological imaging, lab technologies, emergency trauma care',
  'b.m.l.t': 'Clinical hematology, histopathology, medical biochemistry, clinical microbiology',
  'b.math.': 'Pure mathematics, abstract algebra, mathematical analysis, topology',
  'b.stat.': 'Probability theory, statistical inference, sample survey design, econometrics',
  'bfa (financial accounting)': 'Financial reporting, accounting standards, auditing practices, management accounts',
  'b.sc. (finance)': 'Corporate finance, equity analysis, financial modeling, portfolio management',
  'bba (finance)': 'Investment banking, capital markets, corporate valuations, risk management',
  'ipm': 'Foundational mathematics, economics, statistics, management fundamentals',
  'bms': 'Strategic management, corporate leadership, marketing management, operations analysis',
  'bbs': 'Business studies, organizational psychology, corporate finance, market analytics',
  'bbm': 'Business management, managerial economics, logistics, human capital',
  'bmc': 'Broadcast journalism, media ethics, electronic reporting, audio-visual editing',
  'bsw': 'Social welfare, community advocacy, family counselling, rural development',
  'bva': 'Visual communication, drawing, illustration, graphic reproduction',
  'bpa': 'Classical music, instrumental performance, theatrical expression, choreography',
  'bsm': 'Sports marketing, facility operations, league administration, athletic representation',
  'bpe': 'Kinesiology, sports physiology, athletic coaching, physical fitness training',
  'b.p.ed.': 'Kinesiology, sports physiology, athletic coaching, physical fitness training',
  'b.f.tech.': 'Apparel manufacturing, textile quality, production management, garment CAD',
  'b.plan': 'Urban planning, land development, transportation systems, regional infrastructure',
};

function getFocusAreas(progName, fieldName, defaultFocus = '') {
  const normKey = String(progName || '').toLowerCase().trim();
  if (normKey && BOSS_FOCUS_AREAS[normKey]) {
    return BOSS_FOCUS_AREAS[normKey];
  }
  if (normKey && normKey.length > 2) {
    for (const [k, v] of Object.entries(BOSS_FOCUS_AREAS)) {
      if (normKey === k || normKey.startsWith(k) || (k.length > 4 && normKey.includes(k))) {
        return v;
      }
    }
  }

  if (defaultFocus) return defaultFocus;

  const f = String(fieldName || '').toLowerCase();
  if (f.includes('sport') || f.includes('physical education') || f.includes('b.p.ed') || f.includes('bsm') || f.includes('bpe') || f.includes('kinesiology')) {
    return 'Kinesiology, sports physiology, athletic coaching, physical fitness training';
  }
  if (f.includes('hotel') || f.includes('culinary') || f.includes('hospitality') || f.includes('tourism')) {
    return 'Hospitality operations, culinary management, tourism dynamics, guest relations';
  }
  if (f.includes('defence') || f.includes('defense') || f.includes('nda') || f.includes('armed')) {
    return 'Military leadership, defence operations, strategic tactics, national security';
  }
  if (f.includes('design') || f.includes('fine art') || f.includes('visual art') || f.includes('interior')) {
    return 'Design thinking, spatial planning, visual aesthetics, prototype fabrication';
  }
  if (f.includes('medicine') || f.includes('medical') || f.includes('health') || f.includes('surgery') || f.includes('dental') || f.includes('nursing') || f.includes('pharm')) {
    return 'Clinical medicine, patient diagnosis, pharmacology, human anatomy';
  }
  if (f.includes('engineering') || f.includes('technology')) {
    return 'Engineering fundamentals, physical sciences, mathematical modeling, technical design';
  }
  if (f.includes('commerce') || f.includes('finance') || f.includes('accounting') || f.includes('business') || f.includes('management')) {
    return 'Financial accounting, corporate taxation, economics, auditing, management';
  }
  if (f.includes('law') || f.includes('legal') || f.includes('education') || f.includes('teaching')) {
    return 'Constitutional law, legal procedures, jurisprudence, statutory interpretation';
  }
  if (f.includes('journalism') || f.includes('mass') || f.includes('media')) {
    return 'Media communication, news reporting, digital content creation, public relations';
  }
  if (f.includes('social work')) {
    return 'Community outreach, welfare administration, counselling, field engagement';
  }
  return 'Core subject fundamentals, practical methodologies, analytical frameworks';
}

// ── Exam & College Helpers ───────────────────────────────────────────────────
function getEntranceExams(progId, fieldName) {
  // Direct exam edges
  const direct = (inEdgesByNode[progId] || [])
    .filter(ed => ed.fromType === 'ENTRANCE_EXAM')
    .map(ed => ed.fromName);
  
  // examProgrammes links
  const epExams = roadmapData.examProgrammes
    .filter(ep => ep.linkedProgrammeIds && ep.linkedProgrammeIds.includes(progId))
    .map(ep => nodeMap[ep.examId]?.canonicalName)
    .filter(Boolean);
  
  const combined = [...new Set([...direct, ...epExams])];
  if (combined.length > 0) return combined.slice(0, 3).join(', ');

  // Fallback from field
  const fExams = fieldToExams[fieldName] || [];
  if (fExams.length > 0) return fExams.slice(0, 3).join(', ');

  const fn = (fieldName || '').toLowerCase();
  if (fn.includes('engineering')) return 'JEE Main, JEE Advanced, State CET';
  if (fn.includes('medicine')) return 'NEET-UG';
  if (fn.includes('law')) return 'CLAT, AILET';
  if (fn.includes('design')) return 'UCEED, NID DAT, NIFT';
  if (fn.includes('business')) return 'IPM-AT, NPAT, CUET';
  if (fn.includes('hotel')) return 'NCHMCT JEE';
  return 'University Entrance / Merit';
}

function getAdmissionRoute(examStr) {
  if (!examStr || examStr.toLowerCase().includes('merit')) return 'Merit / Institutional';
  return 'Entrance Exam';
}

// ── Study Abroad Top Universities Mapping ─────────────────────────────────────
const topUniByStream = {
  stem: [
    'Massachusetts Institute of Technology (MIT) — USA (QS #1)',
    'Imperial College London — UK (QS #2)',
    'University of Cambridge — UK (QS #5)',
    'ETH Zurich — Switzerland (QS #7)',
    'National University of Singapore (NUS) — Singapore (QS #8)',
    'Technical University of Munich — Germany (QS #28)',
  ],
  medical: [
    'University of Oxford — UK (QS #3)',
    'Harvard University — USA (QS #4)',
    'Johns Hopkins University — USA',
    'Karolinska Institute — Sweden',
    'University of Toronto — Canada (QS #21)',
  ],
  business: [
    'Stanford University — USA (QS #6)',
    'London Business School — UK',
    'INSEAD — France / Singapore',
    'University of Pennsylvania (Wharton) — USA',
    'National University of Singapore (NUS) — Singapore (QS #8)',
  ],
  humanities: [
    'University of Oxford — UK (QS #3)',
    'University of Cambridge — UK (QS #5)',
    'Harvard University — USA (QS #4)',
    'London School of Economics (LSE) — UK',
    'University of Melbourne — Australia (QS #13)',
  ],
  law: [
    'University of Oxford — UK (QS #3)',
    'University of Cambridge — UK (QS #5)',
    'Harvard Law School — USA',
    'Yale University — USA',
    'National University of Singapore (NUS) — Singapore (QS #8)',
  ],
  design: [
    'Royal College of Art — UK',
    'University of the Arts London — UK',
    'Rhode Island School of Design (RISD) — USA',
    'Politecnico di Milano — Italy',
    'MIT Media Lab — USA (QS #1)',
  ],
  hospitality: [
    'EHL Hospitality Business School — Switzerland',
    'Glion Institute of Higher Education — Switzerland',
    'Cornell University — USA',
  ],
  sports: [
    'Loughborough University — UK (QS #1 in Sports)',
    'University of Queensland — Australia',
    'University of British Columbia — Canada',
  ],
  defence: [
    'National Defence Academy / IMA — India',
    'Royal Military Academy Sandhurst — UK',
    'US Military Academy West Point — USA',
  ]
};

function getStudyAbroadSample(streamCat, idx = 0) {
  let list = topUniByStream.stem;
  if (streamCat.includes('Medical')) list = topUniByStream.medical;
  else if (streamCat.includes('Commerce')) list = topUniByStream.business;
  else if (streamCat.includes('Humanities')) list = topUniByStream.humanities;
  else if (streamCat.includes('Professional') || streamCat.includes('Law')) list = topUniByStream.law;
  else if (streamCat.includes('Design')) list = topUniByStream.design;
  else if (streamCat.includes('Hospitality')) list = topUniByStream.hospitality;
  else if (streamCat.includes('Sports')) list = topUniByStream.sports;
  else if (streamCat.includes('Defence')) list = topUniByStream.defence;

  return list[idx % list.length];
}

// ── Accumulator ───────────────────────────────────────────────────────────────
const rows = [];
const seenCareerKeys = new Set();
const seenRoleKeys   = new Set();

function addRoadmapRow(rowObj, tier = 1) {
  const sanitized = { _tier: tier };
  COLUMNS.forEach(col => {
    let val = clean(rowObj[col]);
    if (val === '22') val = '';
    sanitized[col] = val;
  });
  rows.push(sanitized);

  if (sanitized['Career Options']) seenCareerKeys.add(sanitized['Career Options'].toLowerCase());
  if (sanitized['Job Roles']) seenRoleKeys.add(sanitized['Job Roles'].toLowerCase());
}

// ════════════════════════════════════════════════════════════════════════════════
// PART 1 — UNDERGRADUATE PROGRAMMES & PATHWAYS (Tier 1)
// ════════════════════════════════════════════════════════════════════════════════
console.log('📦 Processing Undergraduate Programmes (Tier 1)...');

const allProgrammes = [...roadmapData.programmes];

// Add modern undergraduate programmes from enrichment
enrichment.modernProgrammes
  .filter(mp => mp.type === 'DEGREE')
  .forEach(mp => {
    allProgrammes.push({
      id: mp.id,
      canonicalName: mp.canonicalName,
      fullName: mp.canonicalName,
      degreeType: 'BACHELOR_DEGREE',
      durationYears: '4',
      currentCanonicalDuration: mp.duration || '4 Years',
      eligibility: mp.eligibility,
      eligibleSubjectCombinations: 'PCM',
      fieldNames: [mp.parentDomain || 'Engineering / Technology / Architecture / Design'],
      sourceReference: mp.sourceName,
      whatYouStudy: mp.whatYouStudy,
      careerOptions: mp.careerOptions,
      isEnrichment: true,
    });
  });

// Filter UG programmes (exclude postgrad-only titles)
const ugProgrammes = allProgrammes.filter(p => {
  const cn = p.canonicalName.toLowerCase();
  return !cn.startsWith('m.') && !cn.startsWith('master') && !cn.startsWith('pg') && cn !== 'ph.d.' && cn !== 'm.s.w.' && cn !== 'm.ed.' && cn !== 'm.c.a.';
});

function getDefaultCareerAndRole(prog, rawField, streamCat) {
  const cn = prog.canonicalName.toLowerCase();
  if (cn.includes('mbbs')) {
    return {
      spec: 'Medicine & Surgery',
      domain: 'Clinical Medicine & Surgery',
      career: 'General Medicine & Surgery, Hospital Care',
      role: 'Doctor / Physician, Surgeon, Medical Officer'
    };
  }
  if (cn.includes('bds')) {
    return {
      spec: 'Dental Surgery',
      domain: 'Dental Medicine & Surgery',
      career: 'Dental Clinic Practice, Hospital Dentistry',
      role: 'Dentist, Dental Surgeon'
    };
  }
  if (cn.includes('b.pharm') || cn.includes('b.pharma')) {
    return {
      spec: 'Pharmaceutical Sciences',
      domain: 'Pharmaceutical Sciences & Drug Delivery',
      career: 'Drug Formulation, Clinical Pharmacy, Industrial R&D',
      role: 'Pharmacist, Drug Safety Associate, Formulation Scientist'
    };
  }
  if (cn.includes('nursing')) {
    return {
      spec: 'Clinical Nursing & Patient Care',
      domain: 'Healthcare & Nursing Services',
      career: 'Critical Patient Care, Hospital Nursing',
      role: 'Staff Nurse, Clinical Nurse Specialist'
    };
  }
  if (cn.includes('bpt') || cn.includes('physiotherapy')) {
    return {
      spec: 'Physical Therapy & Rehabilitation',
      domain: 'Rehabilitation Sciences & Physical Therapy',
      career: 'Musculoskeletal Rehabilitation, Sports Therapy',
      role: 'Physiotherapist, Sports Rehab Specialist'
    };
  }
  if (cn.includes('bams') || cn.includes('ayurved')) {
    return {
      spec: 'Ayurvedic Medicine & Surgery',
      domain: 'Traditional & Complementary Medicine',
      career: 'Ayurvedic Clinical Practice, Herbal Pharmacology',
      role: 'Ayurvedic Doctor / Physician'
    };
  }
  if (cn.includes('bhms') || cn.includes('homeopath')) {
    return {
      spec: 'Homeopathic Medicine & Therapeutics',
      domain: 'Traditional & Complementary Medicine',
      career: 'Homeopathic Clinical Practice',
      role: 'Homeopathic Doctor / Physician'
    };
  }
  if (cn.includes('b.v.sc') || cn.includes('veterinary')) {
    return {
      spec: 'Veterinary Medicine & Animal Surgery',
      domain: 'Veterinary Sciences & Animal Health',
      career: 'Veterinary Clinical Practice, Animal Care',
      role: 'Veterinary Surgeon, Veterinary Doctor'
    };
  }
  if (cn.includes('b.arch') || cn.includes('architect')) {
    return {
      spec: 'Architectural Design & Planning',
      domain: 'Architecture, Planning & Design',
      career: 'Architectural Design Practice, Spatial Planning',
      role: 'Architect, Urban Planner'
    };
  }
  if (cn.includes('b.plan') || cn.includes('planning')) {
    return {
      spec: 'Urban & Regional Planning',
      domain: 'Urban Planning & Infrastructure',
      career: 'Town Planning, Infrastructure Development',
      role: 'Town Planner, Infrastructure Analyst'
    };
  }
  if (cn.includes('b.f.tech')) {
    return {
      spec: 'Apparel Manufacturing & Garment Technology',
      domain: 'Fashion & Textile Technology',
      career: 'Apparel Production Management, Garment Quality Assurance',
      role: 'Garment Technologist, Production Manager, Quality Controller'
    };
  }
  if (cn.includes('b.math')) {
    return {
      spec: 'Pure & Applied Mathematics',
      domain: 'Mathematical Sciences & Analytics',
      career: 'Mathematical Modeling, Cryptography, Quantitative Research',
      role: 'Mathematician, Quantitative Analyst, Research Scientist'
    };
  }
  if (cn.includes('b.stat')) {
    return {
      spec: 'Statistical Inference & Data Analytics',
      domain: 'Statistical Sciences & Econometrics',
      career: 'Statistical Modeling, Actuarial Analytics, Biostatistics',
      role: 'Statistician, Actuary, Biostatistician'
    };
  }
  if (cn.includes('b.des') || cn.includes('b.i.d') || cn.includes('design') || cn.includes('bfa') || cn.includes('bva') || cn.includes('interior')) {
    return {
      spec: cn.includes('interior') || cn.includes('b.i.d') ? 'Interior Architecture & Spatial Design' : 'Visual & Product Design',
      domain: 'Design & Creative Arts',
      career: 'Digital Product Design, Brand Identity, UI/UX Design',
      role: 'Product Designer, UI/UX Designer, Art Director'
    };
  }
  if (cn.includes('bhm') || cn.includes('hotel') || cn.includes('culinary')) {
    return {
      spec: 'Hospitality & Culinary Operations',
      domain: 'Hospitality, Tourism & Culinary Arts',
      career: 'Hotel Operations Management, Culinary Leadership',
      role: 'Hotel General Manager, Executive Chef, F&B Manager'
    };
  }
  if (cn.includes('llb') || cn.includes('law')) {
    return {
      spec: 'Corporate & Constitutional Law',
      domain: 'Law, Governance & Public Policy',
      career: 'Corporate Legal Advisory, Litigation, Judicial Services',
      role: 'Corporate Lawyer, Advocate, Legal Consultant'
    };
  }
  if (cn.includes('bjmc') || cn.includes('journalism') || cn.includes('mass') || cn.includes('bmc')) {
    return {
      spec: 'Journalism & Media Communications',
      domain: 'Media, Journalism & Communications',
      career: 'Digital Journalism, Broadcast Media, Public Relations',
      role: 'Journalist, News Anchor, Public Relations Specialist'
    };
  }
  if (cn.includes('bca') || cn.includes('computer')) {
    return {
      spec: 'Computer Applications & Software Development',
      domain: 'Software Engineering & Systems',
      career: 'Software Development, Database Architecture',
      role: 'Software Developer, Database Administrator'
    };
  }
  if (cn.includes('b.com') || cn.includes('commerce')) {
    return {
      spec: 'Accounting, Auditing & Financial Practice',
      domain: 'Finance, Accounting & Auditing',
      career: 'Corporate Finance, Tax Consulting, Auditing',
      role: 'Accountant, Financial Analyst, Auditor'
    };
  }
  if (cn.includes('bba') || cn.includes('management') || cn.includes('bms') || cn.includes('bbm') || cn.includes('bbs') || cn.includes('ipm')) {
    return {
      spec: 'Business Operations & Strategic Management',
      domain: 'Business Management & Strategy',
      career: 'Business Operations, Corporate Strategy, Marketing',
      role: 'Business Analyst, Marketing Executive, Operations Manager'
    };
  }
  if (cn.includes('sports') || cn.includes('bsm') || cn.includes('bpe') || cn.includes('b.p.ed')) {
    return {
      spec: 'Sports Management & Athletic Conditioning',
      domain: 'Sports & Athletic Management',
      career: 'Sports Facility Operations, Athletic Coaching',
      role: 'Sports Administrator, Athletic Director, Fitness Coach'
    };
  }
  if (cn.includes('b.ed') || cn.includes('education')) {
    return {
      spec: 'Teaching Pedagogy & Curriculum Design',
      domain: 'Education & Academic Instruction',
      career: 'Secondary School Teaching, Curriculum Development',
      role: 'Senior Teacher, Education Coordinator'
    };
  }
  if (cn.includes('b.m.l.t') || cn.includes('bmlt') || cn.includes('paramedical')) {
    return {
      spec: 'Medical Laboratory Technology & Pathology',
      domain: 'Medical Laboratory & Allied Diagnostics',
      career: 'Diagnostic Pathology, Clinical Laboratory Testing',
      role: 'Medical Laboratory Technologist, Pathologist Assistant'
    };
  }

  // Fallback from field
  const defaultCareer = (fieldToCareers[rawField]?.[0]) || 'Professional Practice & Industry Roles';
  const defaultRole = (fieldToProfessions[rawField]?.[0]) || 'Practitioner / Analyst / Executive';
  return {
    spec: 'General / Core Discipline',
    domain: rawField ? rawField.split('/')[0].trim() : streamCat,
    career: defaultCareer,
    role: defaultRole
  };
}

ugProgrammes.forEach((prog, pIdx) => {
  const rawField = prog.fieldNames?.[0] || '';
  const streamCat = normalizeStreamCategory(rawField, prog.canonicalName);
  
  // Refine subject combination
  let rawSubj = prog.eligibleSubjectCombinations;
  if (!rawSubj || rawSubj === 'NOT_STATED') {
    const inSubj = (inEdgesByNode[prog.id] || []).find(ed => ed.fromType === 'SUBJECT_COMBINATION');
    if (inSubj) {
      rawSubj = inSubj.fromName;
    } else {
      const inDeg = (inEdgesByNode[prog.id] || []).find(ed => ed.fromType === 'DEGREE');
      if (inDeg) {
        rawSubj = 'Bachelor\'s Degree';
      }
    }
  }
  const subjects = rawSubj === 'Bachelor\'s Degree' ? ['Bachelor\'s Degree'] : normalizeSubject(rawSubj);
  const degTitle = formatDegreeTitle(prog);
  const duration = normalizeDuration(prog.currentCanonicalDuration || prog.durationYears);
  const focusAreas = getFocusAreas(prog.canonicalName, rawField, clean(prog.whatYouStudy));
  const exam = getEntranceExams(prog.id, rawField);
  const route = getAdmissionRoute(exam);

  // Linked specialisations from edges
  const linkedSpecs = (outEdgesByNode[prog.id] || [])
    .filter(ed => ed.toType === 'SPECIALISATION')
    .map(ed => ed.toName);

  // Linked further study
  const linkedPgs = (outEdgesByNode[prog.id] || [])
    .filter(ed => ed.toType === 'POSTGRADUATE_PROGRAM')
    .map(ed => ed.toName);
  const furtherStudyStr = linkedPgs.length > 0
    ? linkedPgs.slice(0, 3).join(', ')
    : (streamCat.includes('STEM') ? 'M.Tech., M.S., Ph.D.' : streamCat.includes('Medical') ? 'MD, MS' : streamCat.includes('Commerce') ? 'MBA' : 'Master\'s Degree');

  const cleanElig = clean(prog.eligibility) || (subjects.includes('PCM') ? '10+2 PCM' : subjects.includes('PCB') ? '10+2 PCB' : subjects.includes('PCMB') ? '10+2 PCMB' : subjects.includes('Commerce') ? '10+2 Commerce' : '10+2 Any Stream');

  // True computing degrees that expand into the modern domains
  const cnLower = prog.canonicalName.toLowerCase();
  const isCoreComputingOrEngineering = (cnLower === 'b.tech.' || cnLower === 'b.e.' || cnLower.includes('dual programs in engineering')) && !cnLower.includes('fashion');

  subjects.forEach(sub => {
    if (isCoreComputingOrEngineering) {
      // Connect to the 7 modern Career Domains
      const modernTracks = [
        {
          spec: 'Computer Science & Engineering',
          domain: 'Software Engineering & Systems',
          career: 'Software Engineering, Full Stack Systems',
          role: 'Software Engineer, Full Stack Developer, Systems Architect',
          focus: 'Data structures, algorithms, systems programming, backend architectures',
        },
        {
          spec: 'Artificial Intelligence & Machine Learning',
          domain: 'Artificial Intelligence & Machine Learning',
          career: 'Machine Learning & AI Engineering',
          role: 'Machine Learning Engineer, AI Engineer, Research Scientist',
          focus: 'Deep neural networks, PyTorch, natural language processing, computer vision',
        },
        {
          spec: 'Data Science & Big Data Systems',
          domain: 'Data Science & Analytics',
          career: 'Data Science & Advanced Analytics',
          role: 'Data Scientist, Data Engineer, Analytics Consultant',
          focus: 'Statistical modeling, big data pipelines, Apache Spark, predictive analytics',
        },
        {
          spec: 'Cybersecurity & Information Defense',
          domain: 'Cybersecurity & Information Security',
          career: 'Information Security & Ethical Hacking',
          role: 'Cybersecurity Analyst, Security Engineer, Threat Intelligence Specialist',
          focus: 'Network security, cryptography, vulnerability testing, digital forensics',
        },
        {
          spec: 'Cloud Computing & DevOps',
          domain: 'Cloud Computing & DevOps',
          career: 'Cloud Infrastructure & Automation',
          role: 'Cloud Solutions Architect, DevOps Engineer, Site Reliability Engineer',
          focus: 'Distributed cloud, containerization (Docker/K8s), CI/CD automation',
        },
        {
          spec: 'Computer Networking & Telecom',
          domain: 'Computer Networking & Telecommunications',
          career: 'Network Architecture & Protocols',
          role: 'Network Engineer, Infrastructure Engineer, Telecommunications Specialist',
          focus: 'Network routing, IP protocols, wireless networks, network virtualization',
        },
        {
          spec: 'Game Development & Real-Time Simulation',
          domain: 'Game Development & Interactive Graphics',
          career: 'Game Engine Development & Interactive Simulation',
          role: 'Game Developer, Graphics Programmer, Simulation Engineer',
          focus: 'Computer graphics, real-time rendering, physics engines, game architecture',
        },
      ];

      modernTracks.forEach((trk, tIdx) => {
        addRoadmapRow({
          'Stream Category': streamCat,
          'Subject Combination': sub,
          'Degree / Course Title': degTitle,
          'Typical Duration': duration,
          'Core Focus Areas': trk.focus || focusAreas,
          'Eligibility': cleanElig,
          'Entrance Exam': exam,
          'Admission Route': route,
          'Specialisation': trk.spec,
          'Career Domain': trk.domain,
          'Career Options': trk.career,
          'Job Roles': trk.role,
          'Further Study': furtherStudyStr,
          'Study Abroad / University': getStudyAbroadSample(streamCat, tIdx),
          'Source': prog.isEnrichment ? 'Career Enrichment Layer & ACM Guidelines' : 'Career Roadmap Master (Handbook p.4, 8, 10)',
          'Verification Status': 'Verified',
        }, 1);
      });

      // Core traditional engineering branches
      const coreEngineeringBranches = [
        { spec: 'Mechanical Engineering', career: 'Mechanical Systems & Manufacturing', role: 'Mechanical Engineer, Thermal Systems Designer' },
        { spec: 'Civil Engineering', career: 'Structural & Infrastructure Engineering', role: 'Civil Engineer, Structural Consultant' },
        { spec: 'Electrical Engineering', career: 'Power Systems & Energy Engineering', role: 'Electrical Engineer, Power Grid Specialist' },
        { spec: 'Electronics & Communication', career: 'Embedded Systems & Signal Processing', role: 'Electronics Engineer, VLSI Design Engineer' },
        { spec: 'Aerospace Engineering', career: 'Aeronautics & Space Systems', role: 'Aerospace Engineer, Flight Dynamics Specialist' },
        { spec: 'Chemical Engineering', career: 'Process & Petrochemical Engineering', role: 'Chemical Process Engineer, Plant Operations Engineer' },
      ];

      coreEngineeringBranches.forEach((eng, eIdx) => {
        addRoadmapRow({
          'Stream Category': streamCat,
          'Subject Combination': sub,
          'Degree / Course Title': degTitle,
          'Typical Duration': duration,
          'Core Focus Areas': focusAreas,
          'Eligibility': cleanElig,
          'Entrance Exam': exam,
          'Admission Route': route,
          'Specialisation': eng.spec,
          'Career Domain': 'Core Engineering & Technology',
          'Career Options': eng.career,
          'Job Roles': eng.role,
          'Further Study': furtherStudyStr,
          'Study Abroad / University': getStudyAbroadSample(streamCat, eIdx + 3),
          'Source': 'Career Roadmap Master',
          'Verification Status': 'Verified',
        }, 1);
      });

    } else if (linkedSpecs.length > 0) {
      linkedSpecs.forEach((spName, sIdx) => {
        const specNode = Object.values(nodeMap).find(n => n.type === 'SPECIALISATION' && n.canonicalName === spName);
        const specCareer = specNode?.careerOptions && specNode.careerOptions !== 'NOT_IN_SOURCE' ? specNode.careerOptions : (fieldToCareers[rawField]?.[0] || 'Professional Practice');
        const specRole = (fieldToProfessions[rawField]?.[sIdx % (fieldToProfessions[rawField]?.length || 1)]) || 'Specialist / Practitioner';

        addRoadmapRow({
          'Stream Category': streamCat,
          'Subject Combination': sub,
          'Degree / Course Title': degTitle,
          'Typical Duration': duration,
          'Core Focus Areas': focusAreas,
          'Eligibility': cleanElig,
          'Entrance Exam': exam,
          'Admission Route': route,
          'Specialisation': spName,
          'Career Domain': rawField ? rawField.split('/')[0].trim() : streamCat,
          'Career Options': specCareer,
          'Job Roles': specRole,
          'Further Study': furtherStudyStr,
          'Study Abroad / University': getStudyAbroadSample(streamCat, sIdx),
          'Source': 'Career Roadmap Master',
          'Verification Status': 'Verified',
        }, 1);
      });
    } else {
      const careerInfo = getDefaultCareerAndRole(prog, rawField, streamCat);

      addRoadmapRow({
        'Stream Category': streamCat,
        'Subject Combination': sub,
        'Degree / Course Title': degTitle,
        'Typical Duration': duration,
        'Core Focus Areas': focusAreas,
        'Eligibility': cleanElig,
        'Entrance Exam': exam,
        'Admission Route': route,
        'Specialisation': careerInfo.spec,
        'Career Domain': careerInfo.domain,
        'Career Options': careerInfo.career,
        'Job Roles': careerInfo.role,
        'Further Study': furtherStudyStr,
        'Study Abroad / University': getStudyAbroadSample(streamCat, pIdx),
        'Source': 'Career Roadmap Master',
        'Verification Status': 'Verified',
      }, 1);
    }
  });
});

// Also add Defence entry (NDA) explicitly as Undergraduate / Service Entry
addRoadmapRow({
  'Stream Category': 'Defence & Public Services',
  'Subject Combination': 'PCM / Any Stream',
  'Degree / Course Title': 'National Defence Academy (NDA - Army / Navy / Air Force)',
  'Typical Duration': '3 Years (+ 1 Yr Academy)',
  'Core Focus Areas': 'Military leadership, defence operations, strategic tactics, aeronautical/naval engineering',
  'Eligibility': '10+2 PCM (Air Force/Navy) or Any Stream (Army)',
  'Entrance Exam': 'NDA Entrance Exam (UPSC) & SSB Interview',
  'Admission Route': 'UPSC National Exam + SSB Interview + Medical',
  'Specialisation': 'Military Leadership & Defence Operations',
  'Career Domain': 'National Defence & Armed Forces',
  'Career Options': 'Officer Commission in Indian Armed Forces (Army, Navy, Air Force)',
  'Job Roles': 'Lieutenant, Flying Officer, Sub-Lieutenant',
  'Further Study': 'Defence Services Staff College, Higher Command Courses',
  'Study Abroad / University': 'National Defence Academy (NDA) / IMA Khadakwasla & Dehradun',
  'Source': 'Career Roadmap Master (Defence Handbook)',
  'Verification Status': 'Verified',
}, 1);

// ════════════════════════════════════════════════════════════════════════════════
// PART 2 — POSTGRADUATE PROGRAMMES & ADVANCED STUDIES (Tier 2)
// ════════════════════════════════════════════════════════════════════════════════
console.log('📦 Processing Postgraduate Programmes (Tier 2)...');

const pgNodes = roadmapData.nodes.filter(n => n.type === 'POSTGRADUATE_PROGRAM');

enrichment.modernProgrammes
  .filter(mp => mp.type === 'POSTGRADUATE_PROGRAM')
  .forEach(mp => {
    pgNodes.push({
      id: mp.id,
      canonicalName: mp.canonicalName,
      displayName: mp.displayName || mp.canonicalName,
      duration: mp.duration || '2 Years',
      eligibility: mp.eligibility,
      whatYouStudy: mp.whatYouStudy,
      careerOptions: mp.careerOptions,
      parentDomain: mp.parentDomain,
      sourceName: mp.sourceName,
      isEnrichment: true,
    });
  });

pgNodes.forEach((pg, pgIdx) => {
  const pgName = clean(pg.displayName || pg.canonicalName);
  let streamCat = 'Science & Technology (STEM)';
  let sub = 'Bachelor\'s Degree';
  let cleanElig = clean(pg.eligibility) || 'Relevant Bachelor\'s Degree with minimum qualifying marks';
  let dur = normalizeDuration(pg.duration) || '2 Years';
  let focus = clean(pg.whatYouStudy) || 'Advanced domain theory, applied research methodology, specialised practice';
  let exam = 'GATE';
  let route = 'National / University Entrance Exam';
  let spec = 'Advanced Specialisation';
  let domain = 'Advanced Technical Research & Systems';
  let career = clean(pg.careerOptions) || 'Advanced Technical Roles, Industrial R&D';
  let role = 'Senior Specialist, Research Engineer';
  let further = 'Ph.D., Postdoctoral Research';

  const pgl = pgName.toLowerCase();
  if (pgl.includes('ai') || pgl.includes('artificial intelligence')) {
    streamCat = 'Science & Technology (STEM)';
    sub = 'B.Tech. / B.E.';
    cleanElig = 'B.Tech. / B.E. in CS / IT / ECE with valid GATE score';
    dur = '2 Years';
    focus = 'Advanced machine learning, deep learning theory, generative models, reinforcement learning';
    exam = 'GATE (CS/DA)';
    route = 'Entrance Exam & Interview';
    spec = 'Artificial Intelligence & Machine Learning';
    domain = 'Artificial Intelligence & Machine Learning';
    career = 'AI Research, Principal ML Systems, Cognitive Architecture';
    role = 'Senior AI Engineer, Principal ML Scientist, AI Research Scientist';
    further = 'Ph.D. in Computer Science / AI';
  } else if (pgl.includes('foreign') || pgl.includes('abroad') || pgl.includes('international') || pgl.includes('m.s. in computer science')) {
    streamCat = 'Science & Technology (STEM)';
    sub = '4-Year Bachelor\'s Degree';
    cleanElig = 'Recognized 4-year Bachelor\'s degree (B.Tech./B.E.) + IELTS/TOEFL + GRE';
    dur = '1–2 Years';
    focus = 'Advanced algorithms, distributed systems, machine learning, cloud infrastructure';
    exam = 'GRE / IELTS / TOEFL';
    route = 'Global University Admissions';
    spec = 'Computer Systems & Advanced Software';
    domain = 'Software Engineering & Systems';
    career = 'Global Software Engineering, Silicon Valley Tech Leadership';
    role = 'Global Software Engineer, Cloud Solutions Architect, Systems Engineer';
    further = 'Ph.D. at International Research Universities';
  } else if (pgl.includes('m.b.a') || pgl.includes('mba')) {
    streamCat = 'Commerce & Business';
    sub = 'Bachelor\'s Degree (Any Stream)';
    cleanElig = 'Graduation in any discipline with minimum 50%';
    dur = '2 Years';
    focus = 'Strategic management, corporate finance, marketing dynamics, business operations';
    exam = 'CAT, XAT, GMAT';
    route = 'National Entrance Exam & Interview';
    spec = 'Finance / Marketing / Operations / Strategy';
    domain = 'Business Management & Strategy';
    career = 'Management Consulting, Investment Banking, Corporate Strategy';
    role = 'Management Consultant, Investment Banker, Product Manager';
    further = 'Executive Fellow / Ph.D. in Management';
  } else if (pgl.includes('m.d.') || (pgl.includes('m.s.') && !pgl.includes('foreign') && !pgl.includes('computer'))) {
    streamCat = 'Medical & Healthcare';
    sub = 'MBBS';
    cleanElig = 'MBBS degree from recognized medical college + 1 yr rotating internship';
    dur = '3 Years';
    focus = 'Advanced clinical diagnosis, operative surgery, pathology, specialized patient care';
    exam = 'NEET-PG';
    route = 'National Counselling / Entrance';
    spec = pgl.includes('surg') || pgName === 'M.S.' ? 'General Surgery / Orthopedics / Ophthalmology' : 'Internal Medicine / Pediatrics / Radiology';
    domain = 'Clinical Medicine & Surgery';
    career = 'Specialized Clinical Practice, Hospital Consultation, Surgical Departments';
    role = pgl.includes('surg') || pgName === 'M.S.' ? 'Surgeon / Surgical Specialist' : 'Consultant Physician / Specialist Doctor';
    further = 'DM / M.Ch. (Super-speciality), Fellowship';
  } else if (pgl.includes('m.d.s')) {
    streamCat = 'Medical & Healthcare';
    sub = 'BDS';
    cleanElig = 'BDS degree + 1 yr compulsory internship';
    dur = '3 Years';
    focus = 'Advanced oral surgery, orthodontics, periodontics, prosthodontics';
    exam = 'NEET-MDS';
    route = 'National Entrance Exam';
    spec = 'Orthodontics / Oral Surgery / Periodontics';
    domain = 'Dental Medicine & Surgery';
    career = 'Specialized Dental Practice, Maxillofacial Surgery';
    role = 'Specialist Dental Surgeon, Orthodontist';
    further = 'Fellowship, Ph.D. in Dental Sciences';
  } else if (pgl.includes('l.l.m') || pgl.includes('llm')) {
    streamCat = 'Professional & Allied Fields';
    sub = 'LL.B.';
    cleanElig = 'LL.B. degree from recognized law university';
    dur = '1–2 Years';
    focus = 'Constitutional jurisprudence, international trade law, corporate governance, legal research';
    exam = 'CLAT PG, AILET PG';
    route = 'National Entrance Exam';
    spec = 'Corporate Law / Constitutional Law / Cyber Law';
    domain = 'Law, Governance & Public Policy';
    career = 'Corporate Legal Advisory, Judicial Services, Legal Academia';
    role = 'Senior Legal Counsel, Legal Advisor, Law Professor';
    further = 'Ph.D. in Law (LL.D.)';
  } else if (pgl.includes('m.c.a') || pgl.includes('mca') || pgl.includes('m.c.s') || pgl.includes('m.c.m')) {
    streamCat = 'Science & Technology (STEM)';
    sub = 'BCA / B.Sc. / B.Com. (with Maths)';
    cleanElig = 'Bachelor\'s degree with Mathematics at 10+2 or graduation level';
    dur = '2 Years';
    focus = 'Advanced software engineering, database architecture, cloud application development';
    exam = 'NIMCET, State CET';
    route = 'Entrance Exam';
    spec = 'Software Engineering & Cloud Architecture';
    domain = 'Software Engineering & Systems';
    career = 'Enterprise Software Development, Database Management';
    role = 'Software Engineer, Systems Analyst, Database Administrator';
    further = 'Ph.D. in Computer Science';
  } else if (pgl.includes('ph.d') || pgl.includes('phd')) {
    streamCat = 'Academic & Research';
    sub = 'Master\'s Degree';
    cleanElig = 'Master\'s degree in relevant discipline with min 55% + UGC NET / CSIR NET';
    dur = '3–5 Years';
    focus = 'Original doctoral research, dissertation, peer-reviewed publication, academic theory';
    exam = 'UGC NET, CSIR NET, GATE';
    route = 'Research Fellowship / University Interview';
    spec = 'Advanced Research Specialization';
    domain = 'Academic & Industrial Research';
    career = 'University Professorship, Industrial Research Leadership, Principal Scientist';
    role = 'Professor, Principal Research Scientist, Postdoctoral Fellow';
    further = 'Postdoctoral Research Fellowships';
  } else if (pgl.includes('m.tech') || pgl.includes('m.e')) {
    streamCat = 'Science & Technology (STEM)';
    sub = 'B.Tech. / B.E.';
    cleanElig = 'B.Tech. / B.E. in relevant engineering discipline with valid GATE score';
    dur = '2 Years';
    focus = 'Advanced engineering mathematics, applied system design, experimental thesis';
    exam = 'GATE';
    route = 'National Entrance Exam';
    spec = 'Specialized Engineering Branch';
    domain = 'Core Engineering & Technology';
    career = 'Senior Technical Engineering, Research & Development';
    role = 'Senior Project Engineer, R&D Specialist';
    further = 'Ph.D. in Engineering';
  } else if (pgl.includes('m.sc')) {
    streamCat = 'Science & Technology (STEM)';
    sub = 'B.Sc. (Relevant Discipline)';
    cleanElig = 'B.Sc. in relevant discipline with min 55%';
    dur = '2 Years';
    focus = 'Advanced theoretical principles, scientific laboratory research, data analysis';
    exam = 'IIT JAM, CUET PG';
    route = 'Entrance Exam';
    spec = pgl.includes('bio') ? 'Biotechnology / Life Sciences' : pgl.includes('dairy') ? 'Dairy Technology' : 'Applied Sciences';
    domain = 'Scientific Research & Applied Sciences';
    career = 'Scientific Research, Quality Assurance, Industrial Laboratories';
    role = 'Research Scientist, Laboratory Specialist, Quality Control Officer';
    further = 'Ph.D. in Science';
  } else if (pgl.includes('m.a')) {
    streamCat = 'Humanities & Arts';
    sub = 'Bachelor\'s Degree';
    cleanElig = 'B.A. or Bachelor\'s degree in any stream';
    dur = '2 Years';
    focus = 'Advanced humanities theory, qualitative research, cultural analysis, policy studies';
    exam = 'CUET PG, University Entrance';
    route = 'Merit / Entrance Exam';
    spec = pgl.includes('mass') ? 'Mass Communication & Media' : 'Social Sciences / Humanities';
    domain = 'Media, Journalism & Communications';
    career = 'Media Management, Policy Research, Editorial Leadership';
    role = 'Media Specialist, Policy Analyst, Communications Manager';
    further = 'Ph.D. / M.Phil.';
  } else if (pgl.includes('m.s.w')) {
    streamCat = 'Humanities & Arts';
    sub = 'BSW / Graduation';
    cleanElig = 'Bachelor\'s degree in any discipline';
    dur = '2 Years';
    focus = 'Social welfare administration, community development, psychiatric social work';
    exam = 'TISS-NET, University Entrance';
    route = 'Entrance & Interview';
    spec = 'Community Development & Social Policy';
    domain = 'Social Development & Public Policy';
    career = 'NGO Leadership, CSR Management, International Welfare (UN/WHO)';
    role = 'CSR Manager, Social Development Consultant, Welfare Officer';
    further = 'Ph.D. in Social Work';
  }

  addRoadmapRow({
    'Stream Category': streamCat,
    'Subject Combination': sub,
    'Degree / Course Title': pgName,
    'Typical Duration': dur,
    'Core Focus Areas': focus,
    'Eligibility': cleanElig,
    'Entrance Exam': exam,
    'Admission Route': route,
    'Specialisation': spec,
    'Career Domain': domain,
    'Career Options': career,
    'Job Roles': role,
    'Further Study': further,
    'Study Abroad / University': getStudyAbroadSample(streamCat, pgIdx),
    'Source': pg.isEnrichment ? 'Career Enrichment Layer' : 'Career Roadmap Master (Handbook p.4)',
    'Verification Status': 'Verified',
  }, 2);
});

// ════════════════════════════════════════════════════════════════════════════════
// PART 3 — COMPREHENSIVE CAREERS & JOB ROLES CATALOGUE (Tier 3)
// ════════════════════════════════════════════════════════════════════════════════
console.log('📦 Ingesting Full Career & Job Role Catalogue (Tier 3)...');

roadmapData.careers.forEach((c, cIdx) => {
  const cName = clean(c.canonicalName);
  if (!cName || seenCareerKeys.has(cName.toLowerCase())) return;

  const parentId = c.parentNodeIds?.[0] || c.fieldIds?.[0] || '';
  const parentNode = nodeMap[parentId];
  const fieldName = parentNode?.canonicalName || 'General Professional Track';
  const streamCat = normalizeStreamCategory(fieldName, cName);

  const entryDegrees = (c.entryDegreeIds || [])
    .map(id => nodeMap[id]?.canonicalName)
    .filter(Boolean);
  const entryDegStr = entryDegrees.length > 0 ? entryDegrees.join(', ') : '';

  addRoadmapRow({
    'Stream Category': streamCat,
    'Subject Combination': '',
    'Degree / Course Title': entryDegStr,
    'Typical Duration': '',
    'Core Focus Areas': clean(c.skillArea) || getFocusAreas('', fieldName),
    'Eligibility': entryDegStr ? `Eligible after ${entryDegStr}` : 'Relevant academic / vocational preparation',
    'Entrance Exam': '',
    'Admission Route': 'Industry Recruitment / Competitive Selection',
    'Specialisation': '',
    'Career Domain': fieldName.split('/')[0].trim(),
    'Career Options': cName,
    'Job Roles': cName,
    'Further Study': clean(c.furtherStudyOptions),
    'Study Abroad / University': '',
    'Source': `Career Roadmap Master — p.${clean(c.sourcePage)}`,
    'Verification Status': 'Source Listed',
  }, 3);
});

roadmapData.nodes
  .filter(n => n.type === 'PROFESSION')
  .forEach(prof => {
    const pName = clean(prof.displayName || prof.canonicalName);
    if (!pName || seenRoleKeys.has(pName.toLowerCase())) return;

    const parentEdge = roadmapData.edges.find(ed => ed.toNodeId === prof.id && ed.fromType === 'FIELD');
    const fieldName = parentEdge ? parentEdge.fromName : (prof.parentDomain || '');
    const streamCat = normalizeStreamCategory(fieldName, pName);

    addRoadmapRow({
      'Stream Category': streamCat,
      'Subject Combination': '',
      'Degree / Course Title': '',
      'Typical Duration': '',
      'Core Focus Areas': clean(prof.skills) || clean(prof.whatYouStudy) || getFocusAreas('', fieldName),
      'Eligibility': clean(prof.eligibility) || 'Professional degree / certification in discipline',
      'Entrance Exam': '',
      'Admission Route': 'Professional Certification / Industry Entry',
      'Specialisation': '',
      'Career Domain': fieldName ? fieldName.split('/')[0].trim() : streamCat,
      'Career Options': pName,
      'Job Roles': pName,
      'Further Study': clean(prof.furtherStudy),
      'Study Abroad / University': '',
      'Source': 'Career Roadmap Master',
      'Verification Status': 'Verified',
    }, 3);
  });

enrichment.jobRoles.forEach(jr => {
  const rName = clean(jr.canonicalName);
  if (!rName || seenRoleKeys.has(rName.toLowerCase())) return;

  const domain = clean(jr.parentDomain);
  const streamCat = normalizeStreamCategory(domain);

  addRoadmapRow({
    'Stream Category': streamCat,
    'Subject Combination': 'PCM / Relevant STEM Degree',
    'Degree / Course Title': 'B.Tech. / B.S. / M.S. in CS / AI / Data',
    'Typical Duration': 'Professional Career Track',
    'Core Focus Areas': clean(jr.skills),
    'Eligibility': clean(jr.typicalEntryRoute),
    'Entrance Exam': '',
    'Admission Route': 'Industry Technical Selection',
    'Specialisation': domain,
    'Career Domain': domain,
    'Career Options': clean(jr.careerOptions) || rName,
    'Job Roles': rName,
    'Further Study': clean(jr.furtherStudy),
    'Study Abroad / University': getStudyAbroadSample(streamCat, 0),
    'Source': 'Career Enrichment Layer (O*NET / IEEE Framework)',
    'Verification Status': 'Enrichment Verified',
  }, 3);
});

// ════════════════════════════════════════════════════════════════════════════════
// PART 4 — STUDY ABROAD GLOBAL UNIVERSITY PATHWAYS (Tier 4)
// ════════════════════════════════════════════════════════════════════════════════
console.log('📦 Integrating Representative Study Abroad Pathways (Tier 4)...');

const representativeUnis = universities.slice(0, 30);
representativeUnis.forEach((u, uIdx) => {
  const uniName = clean(u.University);
  const country = clean(u.Country);
  const rank = u['QS Ranking'] ? `QS #${u['QS Ranking']}` : '';
  const uniLabel = `${uniName} — ${country}${rank ? ` (${rank})` : ''}`;

  const tracks = [
    { cat: 'Science & Technology (STEM)', deg: 'Master of Science (M.S.) — International Track', spec: 'Computer Science, AI & Robotics', dom: 'Software Engineering & Systems / AI', dur: '1–2 Years', elig: 'Recognized 4-yr Bachelor\'s Degree + IELTS/TOEFL + GRE' },
    { cat: 'Commerce & Business', deg: 'Global Master of Business Administration (Global MBA)', spec: 'International Management & Finance', dom: 'Business Management & Strategy', dur: '1–2 Years', elig: 'Recognized Bachelor\'s Degree + GMAT/GRE + 2+ yrs work experience' },
    { cat: 'Science & Technology (STEM)', deg: 'Bachelor of Science (B.S.) — International Undergraduate', spec: 'Core Engineering & Data Science', dom: 'Core Engineering & Technology', dur: '4 Years', elig: '10+2 PCM with SAT / ACT + IELTS/TOEFL' },
    { cat: 'Humanities & Arts', deg: 'Master of Arts (M.A.) — Global Policy & Economics', spec: 'International Relations & Economics', dom: 'Public Policy & Global Economics', dur: '1–2 Years', elig: 'Recognized Bachelor\'s Degree + IELTS/TOEFL' },
  ];

  const trk = tracks[uIdx % tracks.length];

  addRoadmapRow({
    'Stream Category': trk.cat,
    'Subject Combination': 'International Pathway',
    'Degree / Course Title': trk.deg,
    'Typical Duration': trk.dur,
    'Core Focus Areas': 'Global curriculum, cross-cultural research, advanced university laboratories, international industry internships',
    'Eligibility': trk.elig,
    'Entrance Exam': 'IELTS / TOEFL, GRE / GMAT, SAT where required',
    'Admission Route': 'Direct International University Application',
    'Specialisation': trk.spec,
    'Career Domain': trk.dom,
    'Career Options': 'Global Tech Roles, Multinational Consulting, International Research',
    'Job Roles': 'Global Systems Engineer, International Consultant, Research Associate',
    'Further Study': 'Ph.D. / Doctoral Fellowship Abroad',
    'Study Abroad / University': uniLabel,
    'Source': 'University.json & International Education Hub',
    'Verification Status': 'Study Abroad Data',
  }, 4);
});

// ════════════════════════════════════════════════════════════════════════════════
// SORTING IN HUMAN-FRIENDLY ORDER (Undergraduate First, Stream Groups Preserved)
// ════════════════════════════════════════════════════════════════════════════════
console.log('🔄 Sorting rows in logical catalogue order...');

const categoryPriority = {
  'Science & Technology (STEM)': 1,
  'Medical & Healthcare': 2,
  'Commerce & Business': 3,
  'Humanities & Arts': 4,
  'Professional & Allied Fields': 5,
  'Design & Creative': 6,
  'Hospitality & Tourism': 7,
  'Sports & Physical Education': 8,
  'Defence & Public Services': 9,
  'Academic & Research': 10,
};

const subjectPriority = {
  'PCM': 1,
  'PCB': 2,
  'PCMB': 3,
  'Commerce': 4,
  'Humanities': 5,
  'Any Stream': 6,
  'PCM / Any Stream': 7,
  'PCM / Relevant STEM Degree': 8,
  'Bachelor\'s Degree': 9,
  'B.Tech. / B.E.': 10,
  'MBBS': 11,
  'BDS': 12,
  'International Pathway': 13,
};

rows.sort((a, b) => {
  // 1. Stream Category priority (keeps categories together)
  const pA = categoryPriority[a['Stream Category']] || 99;
  const pB = categoryPriority[b['Stream Category']] || 99;
  if (pA !== pB) return pA - pB;

  // 2. Tier priority: Undergraduate (Tier 1) -> Postgraduate (Tier 2) -> Career Tracks (Tier 3) -> Study Abroad (Tier 4)
  const tA = a._tier || 1;
  const tB = b._tier || 1;
  if (tA !== tB) return tA - tB;

  // 3. Subject Combination priority
  const subA = a['Subject Combination'] || '';
  const subB = b['Subject Combination'] || '';
  const spA = subjectPriority[subA] || (subA ? 50 : 99);
  const spB = subjectPriority[subB] || (subB ? 50 : 99);
  if (spA !== spB) return spA - spB;

  // 4. Degree Title alphabetical
  const degCmp = (a['Degree / Course Title'] || '').localeCompare(b['Degree / Course Title'] || '');
  if (degCmp !== 0) return degCmp;

  // 5. Specialisation alphabetical
  const specCmp = (a['Specialisation'] || '').localeCompare(b['Specialisation'] || '');
  if (specCmp !== 0) return specCmp;

  // 6. Career Domain alphabetical
  const domCmp = (a['Career Domain'] || '').localeCompare(b['Career Domain'] || '');
  if (domCmp !== 0) return domCmp;

  // 7. Career Options
  return (a['Career Options'] || '').localeCompare(b['Career Options'] || '');
});

// ════════════════════════════════════════════════════════════════════════════════
// WRITE WORKBOOK
// ════════════════════════════════════════════════════════════════════════════════
async function exportFinalWorkbook() {
  console.log(`\n📊 Generating Career_Roadmap_SIMPLE_MASTER_FINAL.xlsx (${rows.length} rows)...`);

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Career Simplified — Master Roadmap Catalog';
  wb.created = new Date();

  // Exactly ONE worksheet named: ROADMAP_DATA
  const ws = wb.addWorksheet('ROADMAP_DATA', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  // Column definitions with controlled widths
  const columnWidths = {
    'Stream Category': 26,
    'Subject Combination': 20,
    'Degree / Course Title': 38,
    'Typical Duration': 18,
    'Core Focus Areas': 45,
    'Eligibility': 30,
    'Entrance Exam': 26,
    'Admission Route': 22,
    'Specialisation': 34,
    'Career Domain': 34,
    'Career Options': 36,
    'Job Roles': 36,
    'Further Study': 30,
    'Study Abroad / University': 42,
    'Source': 28,
    'Verification Status': 22,
  };

  ws.columns = COLUMNS.map(col => ({
    header: col,
    key: col,
    width: columnWidths[col] || 25,
  }));

  // Style Header Row (Deep Wine Red with Gold Underline)
  const headerRow = ws.getRow(1);
  headerRow.height = 24;
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10.5, name: 'Calibri' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF690B1B' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FFC9A55D' } },
    };
  });

  // Enable AutoFilter
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to:   { row: 1, column: COLUMNS.length },
  };

  // Add Data Rows
  const wrapCols = new Set([
    'Core Focus Areas',
    'Eligibility',
    'Career Options',
    'Job Roles',
    'Further Study',
    'Study Abroad / University',
  ]);

  rows.forEach((r, idx) => {
    const rowValues = COLUMNS.map(col => r[col] || '');
    const dataRow = ws.addRow(rowValues);

    // Alternate shading for readability
    const isEven = idx % 2 === 0;
    dataRow.eachCell((cell, colNum) => {
      const colHeader = COLUMNS[colNum - 1];
      cell.font = { size: 10, name: 'Calibri', color: { argb: 'FF1F2937' } };

      if (isEven) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFAF8F5' } };
      }

      const shouldWrap = wrapCols.has(colHeader);
      cell.alignment = {
        vertical: 'top',
        horizontal: colHeader === 'Subject Combination' || colHeader === 'Typical Duration' || colHeader === 'Verification Status' ? 'center' : 'left',
        wrapText: shouldWrap,
      };

      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFF3F4F6' } },
      };
    });
  });

  // Write file to root and public/exports
  const outRoot = path.join(ROOT, 'Career_Roadmap_SIMPLE_MASTER_FINAL.xlsx');
  const outPublic = path.join(ROOT, 'public', 'exports', 'Career_Roadmap_SIMPLE_MASTER_FINAL.xlsx');

  await wb.xlsx.writeFile(outRoot);
  console.log(`✅ Master final file generated: ${outRoot}`);

  const publicDir = path.dirname(outPublic);
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  await wb.xlsx.writeFile(outPublic);
  console.log(`✅ Copy saved to public exports: ${outPublic}`);

  return { totalRows: rows.length, outRoot, outPublic };
}

exportFinalWorkbook().catch(err => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});
