/**
 * Career Roadmap Data Service
 * ───────────────────────────
 * Singleton service that loads the ingested JSON dataset and provides
 * indexed, cached lookups for the graph explorer. This service is designed
 * for server-side use (Next.js server components / API routes) and uses
 * module-level caching so the data is parsed exactly once per process.
 * 
 * For client-side progressive loading, data is served via API routes
 * that call these service methods.
 */

import type {
  CareerRoadmapDataset,
  RoadmapNode,
  RoadmapEdge,
  Programme,
  CollegeProgramme,
  ExamProgramme,
  Career,
  StartOption,
  NodeDetail,
  NodeType,
  NodeStatus,
  NodeTypeConfig,
  RoadmapPhase,
  RoadmapContinuationOption,
  NodeContinuationResult,
} from './career-roadmap-types';

// ── Module-Level Cache ───────────────────────────────────────
let _dataset: CareerRoadmapDataset | null = null;
let _nodeIndex: Map<string, RoadmapNode> | null = null;
let _outEdgeIndex: Map<string, RoadmapEdge[]> | null = null;
let _inEdgeIndex: Map<string, RoadmapEdge[]> | null = null;
let _programmeIndex: Map<string, Programme> | null = null;
let _careerIndex: Map<string, Career> | null = null;
let _collegeProgrammesByField: Map<string, CollegeProgramme[]> | null = null;
let _collegeProgrammesByCollege: Map<string, CollegeProgramme[]> | null = null;
let _examProgrammesByExam: Map<string, ExamProgramme[]> | null = null;
let _nodesByType: Map<string, RoadmapNode[]> | null = null;

// ── Node Type Visual Config ──────────────────────────────────
export const NODE_TYPE_CONFIG: Record<string, NodeTypeConfig> = {
  LEVEL: {
    label: 'Academic Level',
    color: '#6366f1',
    bgColor: '#eef2ff',
    borderColor: '#c7d2fe',
    icon: '🎓',
    description: 'Your current academic stage',
  },
  STREAM: {
    label: 'Stream',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    icon: '🔀',
    description: 'Academic stream after 10th',
  },
  SUBJECT_COMBINATION: {
    label: 'Subject Combination',
    color: '#a855f7',
    bgColor: '#faf5ff',
    borderColor: '#e9d5ff',
    icon: '📚',
    description: 'Subject group within a stream',
  },
  FIELD: {
    label: 'Field of Study',
    color: '#0ea5e9',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    icon: '🔬',
    description: 'Broad academic/professional field',
  },
  DEGREE: {
    label: 'Degree Programme',
    color: '#0891b2',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    icon: '📜',
    description: 'Undergraduate or professional degree',
  },
  ROUTE: {
    label: 'Career Route',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    icon: '🛤️',
    description: 'A specific career pathway',
  },
  CERTIFICATION: {
    label: 'Certification',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    icon: '📋',
    description: 'Professional certification or qualification',
  },
  CAREER: {
    label: 'Career',
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    icon: '💼',
    description: 'Career outcome or role',
  },
  RECRUITMENT_EXAM: {
    label: 'Recruitment Exam',
    color: '#ea580c',
    bgColor: '#fff7ed',
    borderColor: '#fed7aa',
    icon: '📝',
    description: 'Government or professional recruitment exam',
  },
  POSTGRADUATE_PROGRAM: {
    label: 'Postgraduate',
    color: '#4f46e5',
    bgColor: '#eef2ff',
    borderColor: '#c7d2fe',
    icon: '🎯',
    description: 'Master\'s or doctoral programme',
  },
  SPECIALISATION: {
    label: 'Specialisation',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    icon: '🔍',
    description: 'Area of specialisation within a field',
  },
  PROFESSION: {
    label: 'Profession',
    color: '#be123c',
    bgColor: '#fff1f2',
    borderColor: '#fecdd3',
    icon: '👔',
    description: 'Professional role or occupation',
  },
  ENTRANCE_EXAM: {
    label: 'Entrance Exam',
    color: '#c2410c',
    bgColor: '#fff7ed',
    borderColor: '#fdba74',
    icon: '✍️',
    description: 'Entrance or competitive examination',
  },
  COLLEGE: {
    label: 'College / Institution',
    color: '#0d9488',
    bgColor: '#f0fdfa',
    borderColor: '#99f6e4',
    icon: '🏛️',
    description: 'Educational institution',
  },
  COLLEGE_GROUP: {
    label: 'College Group',
    color: '#0f766e',
    bgColor: '#f0fdfa',
    borderColor: '#5eead4',
    icon: '🏫',
    description: 'Group of related institutions',
  },
  STUDY_ABROAD: {
    label: 'Study Abroad',
    color: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    icon: '🌐',
    description: 'International study opportunities and universities',
  },
  CAREER_DOMAIN: {
    label: 'Career Domain',
    color: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    icon: '🌐',
    description: 'Specialized technological or professional industry domain',
  },
};

// ── Layer B Enrichment Cache ─────────────────────────────────
let _enrichmentDataset: any = null;
let _enrichmentNodeIndex: Map<string, RoadmapNode> | null = null;
let _enrichmentOutEdges: Map<string, any[]> | null = null;
let _enrichmentInEdges: Map<string, any[]> | null = null;

function loadEnrichmentDataset(): any {
  if (_enrichmentDataset) return _enrichmentDataset;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require('@/data/career-enrichment.json');
    _enrichmentDataset = data;
    return data;
  } catch (err) {
    console.warn('Failed to load career-enrichment.json:', err);
    return null;
  }
}

function convertEnrichmentToRoadmapNode(item: any, type: NodeType): RoadmapNode {
  return {
    id: item.id,
    type,
    canonicalName: item.canonicalName,
    displayName: item.displayName || item.canonicalName,
    shortName: item.displayName || item.canonicalName,
    description: item.whatIsIt || item.description || '',
    descriptionStatus: 'FROM_ENRICHMENT',
    parentDomain: item.parentDomain || '',
    aliases: [item.canonicalName, item.displayName].filter(Boolean),
    applicationStage: item.type === 'CAREER_DOMAIN' ? 'INDUSTRY_TRACK' : (item.type === 'PROFESSION' ? 'PROFESSIONAL_DESTINATION' : 'POST_GRADUATION'),
    status: (item.verificationStatus === 'HOLD' || item.verificationStatus === 'PENDING') ? 'PENDING' : 'ACTIVE',
    canonicalStatus: item.verificationStatus || 'VERIFIED',
    canonicalConfidence: item.confidence || 'HIGH',
    whatIsIt: item.whatIsIt || '',
    whatYouStudy: item.whatYouStudy || '',
    duration: item.duration || '',
    eligibility: item.eligibility || '',
    skills: item.skills || '',
    typicalEntryRoute: item.typicalEntryRoute || '',
    furtherStudy: item.furtherStudy || '',
    careerOptions: item.careerOptions || '',
    sourceName: item.sourceName || 'Layer B Modern Career Enrichment Graph',
    sourcePage: 'career-enrichment.json',
    sourceSection: item.sourceType || 'INDUSTRY_STANDARDS',
    sourceType: item.sourceType || 'STANDARD',
    confidence: item.confidence || 'HIGH',
    sourceUrl: item.sourceUrl || '',
    sourceDate: item.sourceDate || '2024',
    enrichmentFlag: 'LAYER_B_ENRICHED',
  };
}

// ── Data Loading ─────────────────────────────────────────────
function loadDataset(): CareerRoadmapDataset {
  if (_dataset) return _dataset;

  // Dynamic import of JSON at build time (Next.js handles this)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require('@/data/career-roadmap.json') as CareerRoadmapDataset;
  _dataset = data;
  return data;
}

function buildIndices(): void {
  if (_nodeIndex) return; // Already built

  const ds = loadDataset();

  // Node index
  _nodeIndex = new Map();
  _nodesByType = new Map();
  for (const node of ds.nodes) {
    _nodeIndex.set(node.id, node);
    const typeNodes = _nodesByType.get(node.type) || [];
    typeNodes.push(node);
    _nodesByType.set(node.type, typeNodes);
  }

  // Edge indices
  _outEdgeIndex = new Map();
  _inEdgeIndex = new Map();
  for (const edge of ds.edges) {
    // Outgoing
    const out = _outEdgeIndex.get(edge.fromNodeId) || [];
    out.push(edge);
    _outEdgeIndex.set(edge.fromNodeId, out);
    // Incoming
    const inc = _inEdgeIndex.get(edge.toNodeId) || [];
    inc.push(edge);
    _inEdgeIndex.set(edge.toNodeId, inc);
  }

  // Programme index
  _programmeIndex = new Map();
  for (const prog of ds.programmes) {
    _programmeIndex.set(prog.id, prog);
  }

  // Career index
  _careerIndex = new Map();
  for (const career of ds.careers) {
    _careerIndex.set(career.id, career);
  }

  // College programme indices
  _collegeProgrammesByField = new Map();
  _collegeProgrammesByCollege = new Map();
  for (const cp of ds.collegeProgrammes) {
    if (cp.fieldId) {
      const byField = _collegeProgrammesByField.get(cp.fieldId) || [];
      byField.push(cp);
      _collegeProgrammesByField.set(cp.fieldId, byField);
    }
    if (cp.collegeId) {
      const byColl = _collegeProgrammesByCollege.get(cp.collegeId) || [];
      byColl.push(cp);
      _collegeProgrammesByCollege.set(cp.collegeId, byColl);
    }
  }

  // Exam programme index
  _examProgrammesByExam = new Map();
  for (const ep of ds.examProgrammes) {
    if (ep.examId) {
      const byExam = _examProgrammesByExam.get(ep.examId) || [];
      byExam.push(ep);
      _examProgrammesByExam.set(ep.examId, byExam);
    }
  }

  // ── Ingest Layer B Enrichment Graph ────────────────────────
  const enr = loadEnrichmentDataset();
  if (enr) {
    _enrichmentNodeIndex = new Map();
    _enrichmentOutEdges = new Map();
    _enrichmentInEdges = new Map();

    // 1. Ingest Career Domains
    if (Array.isArray(enr.careerDomains)) {
      for (const cd of enr.careerDomains) {
        const node = convertEnrichmentToRoadmapNode(cd, 'CAREER_DOMAIN');
        _nodeIndex.set(node.id, node);
        _enrichmentNodeIndex.set(node.id, node);
        const typeNodes = _nodesByType.get('CAREER_DOMAIN') || [];
        typeNodes.push(node);
        _nodesByType.set('CAREER_DOMAIN', typeNodes);
      }
    }

    // 2. Ingest Specialized Career Tracks & Careers
    if (Array.isArray(enr.careerTracksAndCareers)) {
      for (const ct of enr.careerTracksAndCareers) {
        const node = convertEnrichmentToRoadmapNode(ct, 'CAREER');
        _nodeIndex.set(node.id, node);
        _enrichmentNodeIndex.set(node.id, node);
        const typeNodes = _nodesByType.get('CAREER') || [];
        typeNodes.push(node);
        _nodesByType.set('CAREER', typeNodes);
      }
    }

    // 3. Ingest Granular Job Roles / Professions
    if (Array.isArray(enr.jobRoles)) {
      for (const jr of enr.jobRoles) {
        const node = convertEnrichmentToRoadmapNode(jr, 'PROFESSION');
        _nodeIndex.set(node.id, node);
        _enrichmentNodeIndex.set(node.id, node);
        const typeNodes = _nodesByType.get('PROFESSION') || [];
        typeNodes.push(node);
        _nodesByType.set('PROFESSION', typeNodes);
      }
    }

    // 4. Ingest Modern Accredited Programmes
    if (Array.isArray(enr.modernProgrammes)) {
      for (const mp of enr.modernProgrammes) {
        const node = convertEnrichmentToRoadmapNode(mp, mp.type as NodeType);
        _nodeIndex.set(node.id, node);
        _enrichmentNodeIndex.set(node.id, node);
        const typeNodes = _nodesByType.get(mp.type) || [];
        typeNodes.push(node);
        _nodesByType.set(mp.type, typeNodes);
      }
    }

    // 5. Ingest Provenance-Backed Relationships
    if (Array.isArray(enr.relationships)) {
      for (const rel of enr.relationships) {
        // Index in enrichment edge maps
        const outList = _enrichmentOutEdges.get(rel.fromNodeId) || [];
        outList.push(rel);
        _enrichmentOutEdges.set(rel.fromNodeId, outList);

        const inList = _enrichmentInEdges.get(rel.toNodeId) || [];
        inList.push(rel);
        _enrichmentInEdges.set(rel.toNodeId, inList);

        // Convert to RoadmapEdge for the Unified Roadmap Graph
        const fromNode = _nodeIndex.get(rel.fromNodeId);
        const toNode = _nodeIndex.get(rel.toNodeId);
        const enrEdge: RoadmapEdge = {
          id: rel.id,
          fromNodeId: rel.fromNodeId,
          toNodeId: rel.toNodeId,
          fromType: rel.fromType,
          toType: rel.toType,
          fromName: fromNode?.displayName || fromNode?.canonicalName || rel.fromNodeId,
          toName: toNode?.displayName || toNode?.canonicalName || rel.toNodeId,
          edgeType: rel.relationshipType,
          edgeRole: 'ENRICHED_CONTINUATION',
          condition: rel.condition || '',
          durationText: '',
          status: (rel.status as NodeStatus) || 'ACTIVE',
          canonicalStatus: 'VERIFIED',
          confidence: rel.confidence || 'HIGH',
          sourceType: 'ENRICHMENT_GRAPH',
          sourceReference: rel.sourceName,
          sourcePage: 'career-enrichment.json',
        };

        const existingOut = _outEdgeIndex.get(rel.fromNodeId) || [];
        existingOut.push(enrEdge);
        _outEdgeIndex.set(rel.fromNodeId, existingOut);

        const existingIn = _inEdgeIndex.get(rel.toNodeId) || [];
        existingIn.push(enrEdge);
        _inEdgeIndex.set(rel.toNodeId, existingIn);
      }
    }
  }
}

// ── Public API ───────────────────────────────────────────────

export function getDatasetMeta() {
  return loadDataset()._meta;
}

export function getStartOptions(): StartOption[] {
  return loadDataset().startOptions;
}

export function getNode(id: string): RoadmapNode | undefined {
  buildIndices();
  if (id.startsWith('ABROAD_')) {
    const parentId = id.replace('ABROAD_', '');
    const parentNode = _nodeIndex!.get(parentId);
    const domain = parentNode?.parentDomain || parentNode?.displayName || 'Global Studies';
    return {
      id,
      type: 'STUDY_ABROAD' as any,
      canonicalName: `Study Abroad (${parentNode?.displayName || 'International'})`,
      displayName: 'Study Abroad Opportunities',
      shortName: 'Study Abroad',
      description: `Explore international degree, master\'s, and exchange programmes for ${parentNode?.displayName || 'this discipline'} across 500+ global universities in the USA, UK, Germany, Canada, Australia, and Singapore.`,
      descriptionStatus: 'FROM_SOURCE',
      parentDomain: domain,
      aliases: ['International Study', 'Global Universities'],
      applicationStage: 'POST_SENIOR_SECONDARY',
      status: 'ACTIVE',
      canonicalStatus: 'SOURCE_CONFIRMED',
      canonicalConfidence: 'HIGH',
      whatIsIt: `Global university study pathways related to ${parentNode?.displayName || 'your academic choices'}. Match your GPA, major, and budget with top universities worldwide.`,
      whatYouStudy: 'International curriculum, global research internships, cross-cultural professional training, advanced university labs.',
      duration: '1–4 Years (Undergraduate / Master\'s)',
      eligibility: 'Recognized academic qualifications + English Proficiency (IELTS / TOEFL) + GRE / GMAT where applicable.',
      skills: 'Global perspective, cross-cultural communication, international research methodologies.',
      typicalEntryRoute: `${parentNode?.displayName || 'Academic Pathway'} → Global Application`,
      furtherStudy: 'Global Master\'s, Ph.D., Postdoctoral research abroad.',
      careerOptions: 'International corporate roles, global research institutions, multinational consulting.',
      sourceName: 'CLARVO University Predictor & Global Dataset',
      sourcePage: 'University.json',
      sourceSection: 'International Education Hub',
      sourceType: 'DATABASE',
      confidence: 'HIGH',
      sourceUrl: '/university-finder',
      sourceDate: '2026',
      enrichmentFlag: 'STUDY_ABROAD_INTEGRATED',
    };
  }
  return _nodeIndex!.get(id);
}

export function getNodesByType(type: string): RoadmapNode[] {
  buildIndices();
  return _nodesByType!.get(type) || [];
}

export function getOutgoingEdges(nodeId: string): RoadmapEdge[] {
  buildIndices();
  return (_outEdgeIndex!.get(nodeId) || []).filter(e => e.status === 'ACTIVE');
}

export function getIncomingEdges(nodeId: string): RoadmapEdge[] {
  buildIndices();
  return (_inEdgeIndex!.get(nodeId) || []).filter(e => e.status === 'ACTIVE');
}

export function getChildNodes(nodeId: string): RoadmapNode[] {
  const edges = getOutgoingEdges(nodeId);
  const children: RoadmapNode[] = [];
  for (const edge of edges) {
    const node = getNode(edge.toNodeId);
    if (node && node.status === 'ACTIVE') {
      children.push(node);
    }
  }
  return children;
}

export function getParentNodes(nodeId: string): RoadmapNode[] {
  const edges = getIncomingEdges(nodeId);
  const parents: RoadmapNode[] = [];
  for (const edge of edges) {
    const node = getNode(edge.fromNodeId);
    if (node && node.status === 'ACTIVE') {
      parents.push(node);
    }
  }
  return parents;
}

export function getProgramme(id: string): Programme | undefined {
  buildIndices();
  return _programmeIndex!.get(id);
}

export function getCareer(id: string): Career | undefined {
  buildIndices();
  return _careerIndex!.get(id);
}

export function getCollegeProgrammesByField(fieldId: string): CollegeProgramme[] {
  buildIndices();
  return _collegeProgrammesByField!.get(fieldId) || [];
}

export function getCollegeProgrammesByCollege(collegeId: string): CollegeProgramme[] {
  buildIndices();
  return _collegeProgrammesByCollege!.get(collegeId) || [];
}

export function getExamProgrammes(examId: string): ExamProgramme[] {
  buildIndices();
  return _examProgrammesByExam!.get(examId) || [];
}

export function getNodeDetail(nodeId: string): NodeDetail | null {
  const node = getNode(nodeId);
  if (!node) return null;

  const outgoingEdges = getOutgoingEdges(nodeId);
  const incomingEdges = getIncomingEdges(nodeId);

  // Related programmes: check if this node IS a degree or connects to degrees
  const relatedProgrammes: Programme[] = [];
  if (node.type === 'DEGREE') {
    const prog = getProgramme(nodeId);
    if (prog) relatedProgrammes.push(prog);
  }
  for (const edge of outgoingEdges) {
    if (edge.toType === 'DEGREE') {
      const prog = getProgramme(edge.toNodeId);
      if (prog) relatedProgrammes.push(prog);
    }
  }

  // Related careers
  const relatedCareers: Career[] = [];
  const ds = loadDataset();
  for (const career of ds.careers) {
    if (career.parentNodeIds.includes(nodeId) || career.entryDegreeIds.includes(nodeId)) {
      relatedCareers.push(career);
    }
  }

  // Related colleges
  let relatedColleges: CollegeProgramme[] = [];
  if (node.type === 'COLLEGE') {
    relatedColleges = getCollegeProgrammesByCollege(nodeId);
  } else if (node.type === 'FIELD') {
    relatedColleges = getCollegeProgrammesByField(nodeId);
  }

  // Related exams
  let relatedExams: ExamProgramme[] = [];
  if (node.type === 'ENTRANCE_EXAM') {
    relatedExams = getExamProgrammes(nodeId);
  }

  const continuation = getRoadmapContinuation(nodeId);
  const isEnriched = Boolean(_enrichmentNodeIndex?.has(nodeId));

  return {
    node,
    incomingEdges,
    outgoingEdges,
    relatedProgrammes,
    relatedCareers,
    relatedColleges,
    relatedExams,
    continuation,
    enrichment: {
      isEnriched,
      sourceGraph: isEnriched
        ? 'Layer B Modern Career Enrichment Graph'
        : 'Layer A Source Graph (Career_Roadmap_Master_PRODUCTION.xlsx)',
      enrichmentSource: node.sourceName,
      verificationStatus: node.canonicalStatus || 'VERIFIED',
      confidence: node.canonicalConfidence || node.confidence || 'HIGH',
      notes: isEnriched ? (node as any).notes || `Validated modern career taxonomy for ${node.displayName}.` : undefined,
    },
  };
}

/**
 * BFS traversal from a starting node to build a subgraph
 * for progressive rendering. Respects ACTIVE status only.
 */
export function getSubgraph(
  rootId: string,
  maxDepth: number = 2,
): { nodes: RoadmapNode[]; edges: RoadmapEdge[] } {
  buildIndices();

  const visitedNodes = new Set<string>();
  const resultNodes: RoadmapNode[] = [];
  const resultEdges: RoadmapEdge[] = [];
  const edgeSet = new Set<string>();

  interface QueueItem {
    nodeId: string;
    depth: number;
  }

  const queue: QueueItem[] = [{ nodeId: rootId, depth: 0 }];
  visitedNodes.add(rootId);

  while (queue.length > 0) {
    const { nodeId, depth } = queue.shift()!;
    const node = getNode(nodeId);
    if (!node || node.status !== 'ACTIVE') continue;

    resultNodes.push(node);

    if (depth < maxDepth) {
      const outEdges = getOutgoingEdges(nodeId);
      for (const edge of outEdges) {
        if (!edgeSet.has(edge.id)) {
          edgeSet.add(edge.id);
          resultEdges.push(edge);
        }
        if (!visitedNodes.has(edge.toNodeId)) {
          visitedNodes.add(edge.toNodeId);
          queue.push({ nodeId: edge.toNodeId, depth: depth + 1 });
        }
      }
    }
  }

  return { nodes: resultNodes, edges: resultEdges };
}

/**
 * Search nodes by name (case-insensitive substring match)
 */
export function searchNodes(query: string, limit: number = 20): RoadmapNode[] {
  buildIndices();
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();
  const results: RoadmapNode[] = [];
  const seenIds = new Set<string>();

  // 1. Search enrichment nodes first (modern domains, AI/ML, data science, etc.)
  if (_enrichmentNodeIndex) {
    for (const node of _enrichmentNodeIndex.values()) {
      if (node.status !== 'ACTIVE') continue;
      const match =
        node.canonicalName.toLowerCase().includes(q) ||
        node.displayName.toLowerCase().includes(q) ||
        node.aliases.some(a => a.toLowerCase().includes(q));
      if (match && !seenIds.has(node.id)) {
        seenIds.add(node.id);
        results.push(node);
        if (results.length >= limit) break;
      }
    }
  }

  // 2. Search Layer A canonical nodes
  for (const node of loadDataset().nodes) {
    if (results.length >= limit) break;
    if (node.status !== 'ACTIVE' || seenIds.has(node.id)) continue;
    const match =
      node.canonicalName.toLowerCase().includes(q) ||
      node.displayName.toLowerCase().includes(q) ||
      node.aliases.some(a => a.toLowerCase().includes(q));
    if (match) {
      seenIds.add(node.id);
      results.push(node);
      if (results.length >= limit) break;
    }
  }

  return results;
}

/**
 * Get all unique node types present in the dataset
 */
export function getAvailableNodeTypes(): { type: string; count: number; config: NodeTypeConfig }[] {
  buildIndices();
  const types: { type: string; count: number; config: NodeTypeConfig }[] = [];
  for (const [type, nodes] of _nodesByType!.entries()) {
    const activeCount = nodes.filter(n => n.status === 'ACTIVE').length;
    if (activeCount > 0) {
      types.push({
        type,
        count: activeCount,
        config: NODE_TYPE_CONFIG[type] || {
          label: type,
          color: '#6b7280',
          bgColor: '#f9fafb',
          borderColor: '#e5e7eb',
          icon: '📌',
          description: type,
        },
      });
    }
  }
  return types.sort((a, b) => b.count - a.count);
}

// ── Semantic Roadmap Continuation Resolvers ──────────────────
// Corrects the roadmap progression logic so that academic choices
// (degree, programme, specialisation) genuinely continue toward
// admissions, colleges, further study, study abroad, career directions,
// and specific professions/job roles.

export function mapNodeTypeToPhase(type: string): RoadmapPhase {
  switch (type) {
    case 'LEVEL': return 'FOUNDATION';
    case 'STREAM':
    case 'SUBJECT_COMBINATION':
    case 'ROUTE': return 'ACADEMIC';
    case 'FIELD': return 'FIELD';
    case 'DEGREE': return 'PROGRAMME';
    case 'SPECIALISATION': return 'SPECIALISATION';
    case 'CAREER_DOMAIN': return 'CAREER_DOMAIN';
    case 'ENTRANCE_EXAM':
    case 'RECRUITMENT_EXAM': return 'ADMISSION';
    case 'COLLEGE':
    case 'COLLEGE_GROUP': return 'COLLEGE';
    case 'POSTGRADUATE_PROGRAM':
    case 'CERTIFICATION': return 'FURTHER_STUDY';
    case 'STUDY_ABROAD': return 'STUDY_ABROAD';
    case 'CAREER': return 'CAREER';
    case 'PROFESSION': return 'JOB_ROLE';
    default: return 'ACADEMIC';
  }
}

export function getDirectChildren(nodeId: string): RoadmapContinuationOption[] {
  const edges = getOutgoingEdges(nodeId);
  return edges.map(e => ({
    id: e.toNodeId,
    label: e.toName,
    nodeType: e.toType,
    relationType: e.edgeType,
    phase: mapNodeTypeToPhase(e.toType),
    source: e.sourceReference || 'Master Production Edge Table',
    status: e.status,
    confidence: e.confidence || 'HIGH',
    selectable: true,
    layer: e.sourceType === 'ENRICHMENT_GRAPH' ? 'ENRICHMENT' : 'SOURCE',
  }));
}

export function getCareerDomainOptions(nodeId: string): RoadmapContinuationOption[] {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) return [];

  const options: RoadmapContinuationOption[] = [];
  const seenIds = new Set<string>();

  // 1. Direct enrichment relationships to CAREER_DOMAIN
  const enrichmentEdges = _enrichmentOutEdges?.get(nodeId) || [];
  for (const rel of enrichmentEdges) {
    if (rel.toType === 'CAREER_DOMAIN' && !seenIds.has(rel.toNodeId)) {
      const targetNode = getNode(rel.toNodeId);
      if (targetNode && targetNode.status === 'ACTIVE') {
        seenIds.add(rel.toNodeId);
        options.push({
          id: rel.toNodeId,
          label: targetNode.displayName || targetNode.canonicalName,
          nodeType: 'CAREER_DOMAIN',
          relationType: rel.relationshipType || 'LEADS_TO_CAREER_DOMAIN',
          phase: 'CAREER_DOMAIN',
          source: rel.sourceName || 'Layer B Modern Career Enrichment Graph',
          status: rel.status || 'ACTIVE',
          confidence: rel.confidence || 'HIGH',
          selectable: true,
          specificityWeight: rel.specificityWeight || 100,
          layer: 'ENRICHMENT',
          provenance: {
            derivedFrom: nodeId,
            sourceType: 'ENRICHMENT_GRAPH',
            relationshipSource: rel.sourceName,
            sourceUrl: rel.sourceUrl,
          },
        });
      }
    }
  }

  // 2. Outgoing edges in Unified Graph to CAREER_DOMAIN
  const outEdges = getOutgoingEdges(nodeId);
  for (const edge of outEdges) {
    if (edge.toType === 'CAREER_DOMAIN' && !seenIds.has(edge.toNodeId)) {
      const targetNode = getNode(edge.toNodeId);
      if (targetNode && targetNode.status === 'ACTIVE') {
        seenIds.add(edge.toNodeId);
        options.push({
          id: edge.toNodeId,
          label: targetNode.displayName || targetNode.canonicalName,
          nodeType: 'CAREER_DOMAIN',
          relationType: edge.edgeType,
          phase: 'CAREER_DOMAIN',
          source: edge.sourceReference || 'Unified Roadmap Graph',
          status: edge.status,
          confidence: edge.confidence || 'HIGH',
          selectable: true,
          specificityWeight: 95,
          layer: 'ENRICHMENT',
        });
      }
    }
  }

  // Sort by specificity weight descending
  return options.sort((a, b) => (b.specificityWeight || 0) - (a.specificityWeight || 0));
}

export function getFurtherStudyOptions(nodeId: string): RoadmapContinuationOption[] {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) return [];

  const options: RoadmapContinuationOption[] = [];
  const seenIds = new Set<string>();

  // 1. Direct active edges for further study (Layer A + Layer B)
  const directEdges = getOutgoingEdges(nodeId);
  for (const e of directEdges) {
    if ((e.edgeType === 'FURTHER_STUDY' || e.toType === 'POSTGRADUATE_PROGRAM' || e.edgeType === 'OFFERS_PROGRAMME_VARIANT') && !seenIds.has(e.toNodeId)) {
      seenIds.add(e.toNodeId);
      options.push({
        id: e.toNodeId,
        label: e.toName,
        nodeType: e.toType,
        relationType: e.edgeType,
        phase: 'FURTHER_STUDY',
        source: e.sourceReference || 'Master Production Edge Table',
        status: e.status,
        confidence: e.confidence || 'HIGH',
        selectable: true,
        specificityWeight: 95,
        layer: e.sourceType === 'ENRICHMENT_GRAPH' ? 'ENRICHMENT' : 'SOURCE',
      });
    }
  }

  // 2. Enrichment edges for further study
  const enrEdges = _enrichmentOutEdges?.get(nodeId) || [];
  for (const rel of enrEdges) {
    if ((rel.toType === 'POSTGRADUATE_PROGRAM' || rel.relationshipType === 'FURTHER_STUDY' || rel.relationshipType === 'OFFERS_PROGRAMME_VARIANT') && !seenIds.has(rel.toNodeId)) {
      const targetNode = getNode(rel.toNodeId);
      if (targetNode && targetNode.status === 'ACTIVE') {
        seenIds.add(rel.toNodeId);
        options.push({
          id: rel.toNodeId,
          label: targetNode.displayName || targetNode.canonicalName,
          nodeType: targetNode.type,
          relationType: rel.relationshipType,
          phase: 'FURTHER_STUDY',
          source: rel.sourceName || 'Layer B Modern Career Enrichment Graph',
          status: rel.status || 'ACTIVE',
          confidence: rel.confidence || 'HIGH',
          selectable: true,
          specificityWeight: rel.specificityWeight || 95,
          layer: 'ENRICHMENT',
          provenance: {
            derivedFrom: nodeId,
            sourceType: 'ENRICHMENT_GRAPH',
            relationshipSource: rel.sourceName,
          },
        });
      }
    }
  }

  // 3. For Computer Science (SPEC_009) or B.Tech (DEGREE_016):
  // Provide access to modern M.Tech. AI, M.S. in CS Abroad, M.E., and M.S. Abroad
  if (nodeId === 'SPEC_009' || nodeId === 'DEGREE_016') {
    const csFurther = ['PG_ENR_MTECH_AI', 'PG_ENR_MS_CS', 'PG_021', 'PG_022'];
    for (const pgId of csFurther) {
      if (!seenIds.has(pgId)) {
        const pgNode = getNode(pgId);
        if (pgNode && pgNode.status === 'ACTIVE') {
          seenIds.add(pgId);
          options.push({
            id: pgId,
            label: pgNode.displayName || pgNode.canonicalName,
            nodeType: 'POSTGRADUATE_PROGRAM',
            relationType: 'FURTHER_STUDY',
            phase: 'FURTHER_STUDY',
            source: pgNode.sourceName || 'Unified Postgraduate Pathways',
            status: 'ACTIVE',
            confidence: 'HIGH',
            selectable: true,
            specificityWeight: 90,
            layer: pgId.startsWith('PG_ENR_') ? 'ENRICHMENT' : 'SOURCE',
          });
        }
      }
    }
  }

  // 4. If node is DEGREE: check node.furtherStudy text specification
  if (node.type === 'DEGREE' && node.furtherStudy && node.furtherStudy !== 'NOT_IN_SOURCE') {
    const terms = node.furtherStudy.split(/[\;\,]+/).map(s => s.trim()).filter(Boolean);
    for (const term of terms) {
      for (const n of _nodeIndex!.values()) {
        if ((n.type === 'POSTGRADUATE_PROGRAM' || n.type === 'DEGREE') && n.status === 'ACTIVE') {
          if ((n.canonicalName.toLowerCase() === term.toLowerCase() || n.displayName.toLowerCase() === term.toLowerCase()) && !seenIds.has(n.id)) {
            seenIds.add(n.id);
            options.push({
              id: n.id,
              label: n.displayName || n.canonicalName,
              nodeType: n.type,
              relationType: 'FURTHER_STUDY',
              phase: 'FURTHER_STUDY',
              source: `Degree Further Study Specification (${node.displayName || node.canonicalName})`,
              status: 'ACTIVE',
              confidence: 'HIGH',
              selectable: true,
              specificityWeight: 80,
            });
          }
        }
      }
    }
  }

  // 5. If node is SPECIALISATION: inherit further study from parent degrees
  if (node.type === 'SPECIALISATION') {
    const inEdges = getIncomingEdges(nodeId);
    for (const ie of inEdges) {
      if (ie.fromType === 'DEGREE') {
        const parentFurther = getFurtherStudyOptions(ie.fromNodeId);
        for (const pf of parentFurther) {
          if (!seenIds.has(pf.id)) {
            seenIds.add(pf.id);
            options.push({
              ...pf,
              source: `Parent Degree Further Study (${ie.fromName})`,
              specificityWeight: (pf.specificityWeight || 80) - 5,
            });
          }
        }
      }
    }
  }

  return options.sort((a, b) => (b.specificityWeight || 0) - (a.specificityWeight || 0));
}

export function getAdmissionOptions(nodeId: string): RoadmapContinuationOption[] {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) return [];

  const options: RoadmapContinuationOption[] = [];
  const seenIds = new Set<string>();

  // 1. Direct active edges
  const directEdges = getOutgoingEdges(nodeId);
  for (const e of directEdges) {
    if ((e.toType === 'ENTRANCE_EXAM' || e.toType === 'RECRUITMENT_EXAM') && !seenIds.has(e.toNodeId)) {
      seenIds.add(e.toNodeId);
      options.push({
        id: e.toNodeId,
        label: e.toName,
        nodeType: e.toType,
        relationType: e.edgeType,
        phase: 'ADMISSION',
        source: e.sourceReference || 'Master Production Edge Table',
        status: e.status,
        confidence: e.confidence || 'HIGH',
        selectable: true,
      });
    }
  }

  // 2. Incoming admission edges (e.g. ENTRANCE_EXAM -> ENTRANCE_FOR -> DEGREE)
  const inEdges = getIncomingEdges(nodeId);
  for (const ie of inEdges) {
    if (ie.fromType === 'ENTRANCE_EXAM' && !seenIds.has(ie.fromNodeId)) {
      seenIds.add(ie.fromNodeId);
      options.push({
        id: ie.fromNodeId,
        label: ie.fromName,
        nodeType: 'ENTRANCE_EXAM',
        relationType: ie.edgeType,
        phase: 'ADMISSION',
        source: ie.sourceReference || 'Master Production Edge Table',
        status: ie.status,
        confidence: ie.confidence || 'HIGH',
        selectable: true,
      });
    }
  }

  // 3. Parent field entrance exams for degrees/specialisations
  if (node.type === 'DEGREE' || node.type === 'SPECIALISATION') {
    for (const ie of inEdges) {
      if (ie.fromType === 'FIELD') {
        const fieldExams = getOutgoingEdges(ie.fromNodeId).filter(e => e.toType === 'ENTRANCE_EXAM');
        for (const fe of fieldExams.slice(0, 4)) {
          if (!seenIds.has(fe.toNodeId)) {
            seenIds.add(fe.toNodeId);
            options.push({
              id: fe.toNodeId,
              label: fe.toName,
              nodeType: 'ENTRANCE_EXAM',
              relationType: 'ADMISSION_EXAM',
              phase: 'ADMISSION',
              source: `Field Admission Exam (${ie.fromName})`,
              status: 'ACTIVE',
              confidence: 'HIGH',
              selectable: true,
            });
          }
        }
      }
    }
  }

  return options;
}

export function getCollegeOptions(nodeId: string): RoadmapContinuationOption[] {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) return [];

  const options: RoadmapContinuationOption[] = [];
  const seenIds = new Set<string>();

  // 1. Direct active edges to COLLEGE
  const directEdges = getOutgoingEdges(nodeId);
  for (const e of directEdges) {
    if ((e.toType === 'COLLEGE' || e.toType === 'COLLEGE_GROUP') && !seenIds.has(e.toNodeId)) {
      seenIds.add(e.toNodeId);
      options.push({
        id: e.toNodeId,
        label: e.toName,
        nodeType: e.toType,
        relationType: e.edgeType,
        phase: 'COLLEGE',
        source: e.sourceReference || 'Master Production Edge Table',
        status: e.status,
        confidence: e.confidence || 'HIGH',
        selectable: true,
      });
      if (options.length >= 6) break;
    }
  }

  // 2. If node is DEGREE: check 20_API_COLLEGE_PROGRAMMES or parent field
  if (node.type === 'DEGREE' && options.length < 4) {
    const cpList = _collegeProgrammesByField?.get(nodeId) || [];
    for (const cp of cpList.slice(0, 5)) {
      if (cp.collegeId && !seenIds.has(cp.collegeId)) {
        const cNode = getNode(cp.collegeId);
        if (cNode) {
          seenIds.add(cNode.id);
          options.push({
            id: cNode.id,
            label: cNode.displayName || cNode.canonicalName,
            nodeType: 'COLLEGE',
            relationType: 'OFFERED_AT',
            phase: 'COLLEGE',
            source: cp.source || 'College Programmes Table',
            status: 'ACTIVE',
            confidence: cp.confidence || 'HIGH',
            selectable: true,
          });
        }
      }
    }
  }

  return options;
}

export function getCareerOptions(nodeId: string): RoadmapContinuationOption[] {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) return [];

  const options: RoadmapContinuationOption[] = [];
  const seenIds = new Set<string>();

  // CASE 1: Node is a CAREER_DOMAIN (e.g. DOMAIN_AIML, DOMAIN_SWE, DOMAIN_DATA, DOMAIN_CYBER)
  // Return specialized career tracks in this domain (e.g. Machine Learning, AI Engineering)
  if (node.type === 'CAREER_DOMAIN') {
    const enrEdges = _enrichmentOutEdges?.get(nodeId) || [];
    for (const rel of enrEdges) {
      if (rel.toType === 'CAREER' && !seenIds.has(rel.toNodeId)) {
        const targetNode = getNode(rel.toNodeId);
        if (targetNode && targetNode.status === 'ACTIVE') {
          seenIds.add(rel.toNodeId);
          options.push({
            id: rel.toNodeId,
            label: targetNode.displayName || targetNode.canonicalName,
            nodeType: 'CAREER',
            relationType: rel.relationshipType || 'OFFERS_CAREER_TRACK',
            phase: 'CAREER',
            source: rel.sourceName || 'Layer B Modern Career Enrichment Graph',
            status: rel.status || 'ACTIVE',
            confidence: rel.confidence || 'HIGH',
            selectable: true,
            specificityWeight: rel.specificityWeight || 100,
            layer: 'ENRICHMENT',
            provenance: {
              derivedFrom: nodeId,
              sourceType: 'ENRICHMENT_GRAPH',
              relationshipSource: rel.sourceName,
              sourceUrl: rel.sourceUrl,
            },
          });
        }
      }
    }
    return options.sort((a, b) => (b.specificityWeight || 0) - (a.specificityWeight || 0));
  }

  // CASE 2: Direct active edges to CAREER
  const directEdges = getOutgoingEdges(nodeId);
  for (const e of directEdges) {
    if (e.toType === 'CAREER' && !seenIds.has(e.toNodeId)) {
      seenIds.add(e.toNodeId);
      options.push({
        id: e.toNodeId,
        label: e.toName,
        nodeType: 'CAREER',
        relationType: e.edgeType,
        phase: 'CAREER',
        source: e.sourceReference || 'Master Production Edge Table',
        status: e.status,
        confidence: e.confidence || 'HIGH',
        selectable: true,
        specificityWeight: 95,
        layer: e.sourceType === 'ENRICHMENT_GRAPH' ? 'ENRICHMENT' : 'SOURCE',
      });
    }
  }

  // CASE 3: If node is CAREER: check sub-prospects
  if (node.type === 'CAREER') {
    const subProspects = getOutgoingEdges(nodeId).filter(e => e.toType === 'CAREER');
    for (const sp of subProspects) {
      if (!seenIds.has(sp.toNodeId)) {
        seenIds.add(sp.toNodeId);
        options.push({
          id: sp.toNodeId,
          label: sp.toName,
          nodeType: 'CAREER',
          relationType: sp.edgeType,
          phase: 'CAREER',
          source: sp.sourceReference || 'Master Production Edge Table',
          status: sp.status,
          confidence: sp.confidence || 'HIGH',
          selectable: true,
          specificityWeight: 90,
        });
      }
    }
    return options;
  }

  // CASE 4: If node is SPECIALISATION or DEGREE:
  // Only include careers explicitly linked to this degree/specialisation.
  // Rule 8 & 9: DO NOT pollute specific specialisations (like Computer Science)
  // with broad field-level careers (Pilot, Teacher, Commercial Pilot, etc.)!
  const ds = loadDataset();
  for (const car of ds.careers) {
    if (car.specialisationIds?.includes(nodeId) || car.parentNodeIds.includes(nodeId) || car.entryDegreeIds.includes(nodeId)) {
      if (!seenIds.has(car.id)) {
        seenIds.add(car.id);
        options.push({
          id: car.id,
          label: car.canonicalName,
          nodeType: 'CAREER',
          relationType: 'EXACT_CAREER_PATH',
          phase: 'CAREER',
          source: car.sourceReference || '22_API_CAREERS Table',
          status: 'ACTIVE',
          confidence: 'HIGH',
          selectable: true,
          specificityWeight: 85,
        });
      }
    }
    if (options.length >= 4) break;
  }

  return options;
}

export function getBroaderFieldCareers(nodeId: string): RoadmapContinuationOption[] {
  buildIndices();
  const node = getNode(nodeId);
  if (!node || (node.type !== 'SPECIALISATION' && node.type !== 'DEGREE')) return [];

  const options: RoadmapContinuationOption[] = [];
  const seenIds = new Set<string>();

  const inEdges = getIncomingEdges(nodeId);
  const fieldNodes: RoadmapNode[] = [];
  for (const ie of inEdges) {
    if (ie.fromType === 'FIELD') {
      const fn = getNode(ie.fromNodeId);
      if (fn) fieldNodes.push(fn);
    } else if (ie.fromType === 'DEGREE') {
      const degIn = getIncomingEdges(ie.fromNodeId);
      for (const die of degIn) {
        if (die.fromType === 'FIELD') {
          const fn = getNode(die.fromNodeId);
          if (fn && !fieldNodes.some(f => f.id === fn.id)) fieldNodes.push(fn);
        }
      }
    }
  }

  // Fallback to parentDomain match
  if (fieldNodes.length === 0 && node.parentDomain) {
    for (const fn of _nodeIndex!.values()) {
      if (fn.type === 'FIELD' && (fn.canonicalName.includes(node.parentDomain) || node.parentDomain.includes(fn.canonicalName))) {
        fieldNodes.push(fn);
      }
    }
  }

  for (const fn of fieldNodes) {
    const fieldCareers = getOutgoingEdges(fn.id).filter(e => e.toType === 'CAREER');
    for (const fc of fieldCareers.slice(0, 4)) {
      if (!seenIds.has(fc.toNodeId)) {
        seenIds.add(fc.toNodeId);
        options.push({
          id: fc.toNodeId,
          label: fc.toName,
          nodeType: 'CAREER',
          relationType: 'BROADER_FIELD_OPTION',
          phase: 'CAREER',
          source: `Broader Field Option (${fn.displayName || fn.canonicalName})`,
          status: 'ACTIVE',
          confidence: 'MEDIUM',
          selectable: true,
          specificityWeight: 30, // Low specificity precedence
          layer: 'SOURCE',
          provenance: {
            derivedFrom: fn.id,
            sourceType: 'TABLE',
            relationshipSource: 'Field Inheritance (Demoted to Broader Options)',
          },
        });
      }
    }
  }

  return options;
}

export function getJobRoleOptions(nodeId: string): RoadmapContinuationOption[] {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) return [];

  const options: RoadmapContinuationOption[] = [];
  const seenIds = new Set<string>();

  // CASE 1: Node is a CAREER (e.g. Machine Learning, AI Engineering, Data Science, Backend Engineering)
  // Check Layer B enrichment outgoing edges to PROFESSION
  if (node.type === 'CAREER') {
    const enrEdges = _enrichmentOutEdges?.get(nodeId) || [];
    for (const rel of enrEdges) {
      if (rel.toType === 'PROFESSION' && !seenIds.has(rel.toNodeId)) {
        const targetNode = getNode(rel.toNodeId);
        if (targetNode && targetNode.status === 'ACTIVE') {
          seenIds.add(rel.toNodeId);
          options.push({
            id: rel.toNodeId,
            label: targetNode.displayName || targetNode.canonicalName,
            nodeType: 'PROFESSION',
            relationType: rel.relationshipType || 'LEADS_TO_JOB_ROLE',
            phase: 'JOB_ROLE',
            source: rel.sourceName || 'Layer B Modern Career Enrichment Graph',
            status: rel.status || 'ACTIVE',
            confidence: rel.confidence || 'HIGH',
            selectable: true,
            specificityWeight: rel.specificityWeight || 100,
            layer: 'ENRICHMENT',
            provenance: {
              derivedFrom: nodeId,
              sourceType: 'ENRICHMENT_GRAPH',
              relationshipSource: rel.sourceName,
              sourceUrl: rel.sourceUrl,
            },
          });
        }
      }
    }
  }

  // CASE 2: Node is a CAREER_DOMAIN (e.g. Software Engineering -> Full Stack Developer)
  if (node.type === 'CAREER_DOMAIN') {
    const enrEdges = _enrichmentOutEdges?.get(nodeId) || [];
    for (const rel of enrEdges) {
      if (rel.toType === 'PROFESSION' && !seenIds.has(rel.toNodeId)) {
        const targetNode = getNode(rel.toNodeId);
        if (targetNode && targetNode.status === 'ACTIVE') {
          seenIds.add(rel.toNodeId);
          options.push({
            id: rel.toNodeId,
            label: targetNode.displayName || targetNode.canonicalName,
            nodeType: 'PROFESSION',
            relationType: rel.relationshipType || 'LEADS_TO_JOB_ROLE',
            phase: 'JOB_ROLE',
            source: rel.sourceName || 'Layer B Modern Career Enrichment Graph',
            status: rel.status || 'ACTIVE',
            confidence: rel.confidence || 'HIGH',
            selectable: true,
            specificityWeight: rel.specificityWeight || 95,
            layer: 'ENRICHMENT',
            provenance: {
              derivedFrom: nodeId,
              sourceType: 'ENRICHMENT_GRAPH',
              relationshipSource: rel.sourceName,
            },
          });
        }
      }
    }
  }

  // CASE 3: Direct active edges to PROFESSION in Unified Graph
  const directEdges = getOutgoingEdges(nodeId);
  for (const e of directEdges) {
    if (e.toType === 'PROFESSION' && !seenIds.has(e.toNodeId)) {
      seenIds.add(e.toNodeId);
      options.push({
        id: e.toNodeId,
        label: e.toName,
        nodeType: 'PROFESSION',
        relationType: e.edgeType,
        phase: 'JOB_ROLE',
        source: e.sourceReference || 'Master Production Edge Table',
        status: e.status,
        confidence: e.confidence || 'HIGH',
        selectable: true,
        specificityWeight: 90,
        layer: e.sourceType === 'ENRICHMENT_GRAPH' ? 'ENRICHMENT' : 'SOURCE',
      });
    }
  }

  // CASE 4: If node is a PROFESSION: check sub-professions
  if (node.type === 'PROFESSION') {
    const subProfs = getOutgoingEdges(nodeId).filter(e => e.toType === 'PROFESSION');
    for (const sp of subProfs) {
      if (!seenIds.has(sp.toNodeId)) {
        seenIds.add(sp.toNodeId);
        options.push({
          id: sp.toNodeId,
          label: sp.toName,
          nodeType: 'PROFESSION',
          relationType: sp.edgeType,
          phase: 'JOB_ROLE',
          source: sp.sourceReference || 'Master Production Edge Table',
          status: sp.status,
          confidence: sp.confidence || 'HIGH',
          selectable: true,
          specificityWeight: 90,
        });
      }
    }
  }

  // CASE 5: If node is SPECIALISATION:
  // Direct specialized mappings where supported (e.g. Architectural -> Architect)
  if (node.type === 'SPECIALISATION') {
    const specName = (node.canonicalName || '').toLowerCase();
    if (specName.includes('architect')) {
      const archProfs = ['PROF_004', 'PROF_010', 'PROF_013'];
      for (const aId of archProfs) {
        const aNode = getNode(aId);
        if (aNode && !seenIds.has(aNode.id)) {
          seenIds.add(aNode.id);
          options.push({
            id: aNode.id,
            label: aNode.displayName || aNode.canonicalName,
            nodeType: 'PROFESSION',
            relationType: 'SPECIALISATION_PROFESSION',
            phase: 'JOB_ROLE',
            source: 'Verified Domain Profession (Architecture & Design)',
            status: 'ACTIVE',
            confidence: 'HIGH',
            selectable: true,
            specificityWeight: 85,
          });
        }
      }
    }
  }

  return options.sort((a, b) => (b.specificityWeight || 0) - (a.specificityWeight || 0));
}

export function getStudyAbroadOptions(nodeId: string): RoadmapContinuationOption[] {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) return [];

  // Study Abroad applies to academic choices: DEGREE, SPECIALISATION, FIELD, POSTGRADUATE_PROGRAM
  if (!['DEGREE', 'SPECIALISATION', 'FIELD', 'POSTGRADUATE_PROGRAM'].includes(node.type)) {
    return [];
  }

  return [
    {
      id: `ABROAD_${nodeId}`,
      label: 'Study Abroad (International Universities)',
      nodeType: 'STUDY_ABROAD',
      relationType: 'STUDY_ABROAD',
      phase: 'STUDY_ABROAD',
      source: 'Global University Dataset & University Predictor',
      status: 'ACTIVE',
      confidence: 'HIGH',
      selectable: true,
      specificityWeight: 80,
      provenance: {
        derivedFrom: nodeId,
        sourceType: 'DATABASE',
        relationshipSource: 'University Predictor Dataset (University.json)',
      },
    },
  ];
}

export function isTrueRoadmapEndpoint(nodeId: string): boolean {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) return true;

  // Never declare endpoint for academic stages, fields, degrees, specialisations, domains, or study abroad
  if (['LEVEL', 'STREAM', 'SUBJECT_COMBINATION', 'FIELD', 'DEGREE', 'SPECIALISATION', 'ROUTE', 'CAREER_DOMAIN', 'STUDY_ABROAD'].includes(node.type)) {
    return false;
  }

  // For POSTGRADUATE_PROGRAM: never terminal if it has career domains, further study, or careers
  if (node.type === 'POSTGRADUATE_PROGRAM') {
    const domains = getCareerDomainOptions(nodeId);
    if (domains.length > 0) return false;
    const further = getFurtherStudyOptions(nodeId);
    if (further.length > 0) return false;
    const direct = getOutgoingEdges(nodeId);
    if (direct.length > 0) return false;
    const careers = getCareerOptions(nodeId);
    return careers.length === 0;
  }

  // For CAREER: terminal unless it has sub-prospects or job roles
  if (node.type === 'CAREER') {
    const jobRoles = getJobRoleOptions(nodeId);
    if (jobRoles.length > 0) return false;
    const subProspects = getOutgoingEdges(nodeId).filter(e => e.toType === 'CAREER');
    return subProspects.length === 0;
  }

  // For PROFESSION: terminal unless it has sub-professions
  if (node.type === 'PROFESSION') {
    const subProfs = getOutgoingEdges(nodeId).filter(e => e.toType === 'PROFESSION');
    return subProfs.length === 0;
  }

  const frontier = getRoadmapFrontier(nodeId);
  return frontier.length === 0;
}

export function getRoadmapFrontier(nodeId: string): RoadmapContinuationOption[] {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) return [];

  // 1. If node is a SPECIALISATION (e.g. Computer Science SPEC_009):
  // Rule 10 & 39: Show CAREER DOMAINS FIRST!
  // Plus Further Study and Study Abroad.
  // DO NOT dump generic field-level careers.
  if (node.type === 'SPECIALISATION') {
    const careerDomains = getCareerDomainOptions(nodeId);
    const furtherStudy = getFurtherStudyOptions(nodeId);
    const abroad = getStudyAbroadOptions(nodeId);

    if (careerDomains.length > 0) {
      const frontier: RoadmapContinuationOption[] = [];
      const seen = new Set<string>();
      for (const opt of [...careerDomains, ...furtherStudy, ...abroad]) {
        if (!seen.has(opt.id)) {
          seen.add(opt.id);
          frontier.push(opt);
        }
      }
      return frontier;
    }

    // Fallback if no career domains exist for this specialisation
    const jobRoles = getJobRoleOptions(nodeId);
    const careers = getCareerOptions(nodeId);
    const frontier: RoadmapContinuationOption[] = [];
    const seen = new Set<string>();
    for (const opt of [...jobRoles, ...furtherStudy, ...careers.slice(0, 3), ...abroad]) {
      if (!seen.has(opt.id)) {
        seen.add(opt.id);
        frontier.push(opt);
      }
    }
    return frontier;
  }

  // 2. If node is a CAREER_DOMAIN (e.g. DOMAIN_AIML, DOMAIN_SWE, DOMAIN_DATA, DOMAIN_CYBER):
  // Reveal specialized career tracks and job roles within this domain!
  if (node.type === 'CAREER_DOMAIN') {
    const careers = getCareerOptions(nodeId);
    const jobRoles = getJobRoleOptions(nodeId);
    const furtherStudy = getFurtherStudyOptions(nodeId);
    const frontier: RoadmapContinuationOption[] = [];
    const seen = new Set<string>();

    for (const opt of [...careers, ...jobRoles, ...furtherStudy]) {
      if (!seen.has(opt.id)) {
        seen.add(opt.id);
        frontier.push(opt);
      }
    }
    return frontier;
  }

  // 3. If node is a CAREER (e.g. Machine Learning, AI Engineering, Data Science):
  // Reveal specific job roles! (e.g. Machine Learning Engineer, AI Engineer)
  if (node.type === 'CAREER') {
    const jobRoles = getJobRoleOptions(nodeId);
    const subCareers = getDirectChildren(nodeId).filter(d => d.nodeType === 'CAREER');
    const furtherStudy = getFurtherStudyOptions(nodeId);
    const frontier: RoadmapContinuationOption[] = [];
    const seen = new Set<string>();

    for (const opt of [...jobRoles, ...subCareers, ...furtherStudy]) {
      if (!seen.has(opt.id)) {
        seen.add(opt.id);
        frontier.push(opt);
      }
    }
    return frontier;
  }

  // 4. If node is a POSTGRADUATE_PROGRAM (e.g. M.E. PG_021, M.S. Abroad PG_022, M.Tech. AI):
  // Rule 14 & 15 & 16: Postgraduate programmes must NOT automatically be an endpoint!
  // Reveal specialized domains, doctoral research (Ph.D.), further study, and careers!
  if (node.type === 'POSTGRADUATE_PROGRAM') {
    const careerDomains = getCareerDomainOptions(nodeId);
    const furtherStudy = getFurtherStudyOptions(nodeId);
    const abroad = getStudyAbroadOptions(nodeId);
    const careers = getCareerOptions(nodeId);
    const direct = getDirectChildren(nodeId);
    const frontier: RoadmapContinuationOption[] = [];
    const seen = new Set<string>();

    for (const opt of [...careerDomains, ...furtherStudy, ...abroad, ...careers.slice(0, 3), ...direct]) {
      if (!seen.has(opt.id)) {
        seen.add(opt.id);
        frontier.push(opt);
      }
    }
    return frontier;
  }

  // 5. If node is STUDY_ABROAD (e.g. ABROAD_SPEC_009 or ABROAD_PG_022):
  if (node.type === 'STUDY_ABROAD') {
    const frontier: RoadmapContinuationOption[] = [];
    const msCsNode = getNode('PG_ENR_MS_CS');
    if (msCsNode) {
      frontier.push({
        id: msCsNode.id,
        label: msCsNode.displayName || msCsNode.canonicalName,
        nodeType: 'POSTGRADUATE_PROGRAM',
        relationType: 'INTERNATIONAL_PROGRAMME',
        phase: 'FURTHER_STUDY',
        source: 'International Graduate School Pathway',
        status: 'ACTIVE',
        confidence: 'HIGH',
        selectable: true,
        layer: 'ENRICHMENT',
      });
    }
    return frontier;
  }

  // 6. If node has direct children and is not a specialisation or profession:
  const direct = getDirectChildren(nodeId);
  if (direct.length > 0 && node.type !== 'PROFESSION') {
    if (node.type === 'DEGREE') {
      const abroad = getStudyAbroadOptions(nodeId);
      return [...direct, ...abroad];
    }
    return direct;
  }

  // 7. If node is a PROFESSION:
  if (node.type === 'PROFESSION') {
    return direct.filter(d => d.nodeType === 'PROFESSION');
  }

  // Fallback for any other node
  const furtherStudy = getFurtherStudyOptions(nodeId);
  const careers = getCareerOptions(nodeId);
  const jobRoles = getJobRoleOptions(nodeId);
  const abroad = getStudyAbroadOptions(nodeId);

  return [...jobRoles, ...furtherStudy, ...careers, ...abroad];
}

export function getRoadmapContinuation(nodeId: string): NodeContinuationResult {
  buildIndices();
  const node = getNode(nodeId);
  if (!node) {
    return {
      nodeId,
      isTerminal: true,
      terminalType: 'EXPLORE_ONLY',
      terminalMessage: 'Node not found in dataset.',
      phases: {
        directChildren: [],
        specialisations: [],
        careerDomains: [],
        furtherStudy: [],
        admission: [],
        colleges: [],
        studyAbroad: [],
        careers: [],
        jobRoles: [],
      },
      frontier: [],
    };
  }

  const direct = getDirectChildren(nodeId);
  const specialisations = direct.filter(c => c.phase === 'SPECIALISATION');
  const careerDomains = getCareerDomainOptions(nodeId);
  const furtherStudy = getFurtherStudyOptions(nodeId);
  const admission = getAdmissionOptions(nodeId);
  const colleges = getCollegeOptions(nodeId);
  const studyAbroad = getStudyAbroadOptions(nodeId);
  const careers = getCareerOptions(nodeId);
  const jobRoles = getJobRoleOptions(nodeId);
  const broaderFieldCareers = getBroaderFieldCareers(nodeId);

  const frontier = getRoadmapFrontier(nodeId);
  const isTerminal = isTrueRoadmapEndpoint(nodeId);

  let terminalType: 'CAREER_DESTINATION' | 'JOB_ROLE_DESTINATION' | 'EXPLORE_ONLY' | undefined;
  let terminalMessage: string | undefined;

  if (isTerminal) {
    if (node.type === 'PROFESSION') {
      terminalType = 'JOB_ROLE_DESTINATION';
      terminalMessage = `Your selected roadmap has reached a recorded profession destination: ${node.displayName || node.canonicalName}.`;
    } else if (node.type === 'CAREER') {
      terminalType = 'CAREER_DESTINATION';
      terminalMessage = `Your selected roadmap has reached a recorded career destination: ${node.displayName || node.canonicalName}.`;
    } else {
      terminalType = 'EXPLORE_ONLY';
      terminalMessage = 'Detailed downstream pathways are not currently recorded in the roadmap dataset for this option.';
    }
  }

  return {
    nodeId,
    isTerminal,
    terminalType,
    terminalMessage,
    phases: {
      directChildren: direct,
      specialisations,
      careerDomains,
      furtherStudy,
      admission,
      colleges,
      studyAbroad,
      careers,
      jobRoles,
      broaderFieldCareers,
    },
    frontier,
  };
}

