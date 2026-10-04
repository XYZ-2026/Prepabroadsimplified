/**
 * Career Roadmap — TypeScript Type Definitions
 * ──────────────────────────────────────────────
 * Canonical types matching the ingested career-roadmap.json structure.
 * These types are the contract between the data layer and UI components.
 */

// ── Node Types ───────────────────────────────────────────────
export type NodeType =
  | 'LEVEL'
  | 'STREAM'
  | 'SUBJECT_COMBINATION'
  | 'FIELD'
  | 'DEGREE'
  | 'ROUTE'
  | 'CERTIFICATION'
  | 'CAREER'
  | 'RECRUITMENT_EXAM'
  | 'POSTGRADUATE_PROGRAM'
  | 'SPECIALISATION'
  | 'PROFESSION'
  | 'ENTRANCE_EXAM'
  | 'COLLEGE'
  | 'COLLEGE_GROUP'
  | 'STUDY_ABROAD'
  | 'CAREER_DOMAIN';

export type NodeStatus = 'ACTIVE' | 'PENDING' | 'DEPRECATED' | 'UNKNOWN';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | '';

export interface RoadmapNode {
  id: string;
  type: NodeType;
  canonicalName: string;
  displayName: string;
  shortName: string;
  description: string;
  descriptionStatus: string;
  parentDomain: string;
  aliases: string[];
  applicationStage: string;
  status: NodeStatus;
  canonicalStatus: string;
  canonicalConfidence: string;
  whatIsIt: string;
  whatYouStudy: string;
  duration: string;
  eligibility: string;
  skills: string;
  typicalEntryRoute: string;
  furtherStudy: string;
  careerOptions: string;
  sourceName: string;
  sourcePage: string;
  sourceSection: string;
  sourceType: string;
  confidence: string;
  sourceUrl: string;
  sourceDate: string;
  enrichmentFlag: string;
}

// ── Edge Types ───────────────────────────────────────────────
export type EdgeType =
  | 'PROGRESSES_TO'
  | 'LEADS_TO'
  | 'QUALIFIES_FOR'
  | 'OFFERS'
  | 'REQUIRES'
  | 'CAN_LEAD_TO'
  | 'SPECIALISES_IN'
  | 'PREPARES_FOR'
  | 'ADMITTED_VIA'
  | 'PART_OF'
  | 'AFFILIATED_TO'
  | 'MAPS_TO'
  | string; // Allow unknown edge types from data

export interface RoadmapEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromType: string;
  toType: string;
  fromName: string;
  toName: string;
  edgeType: string;
  edgeRole: string;
  condition: string;
  durationText: string;
  status: NodeStatus;
  canonicalStatus: string;
  confidence: string;
  sourceType: string;
  sourceReference: string;
  sourcePage: string;
}

// ── Programme Types ──────────────────────────────────────────
export interface Programme {
  id: string;
  canonicalName: string;
  fullName: string;
  degreeType: string;
  durationYears: string;
  durationAcademicYears: string;
  durationInternshipYears: string;
  durationStatus: string;
  currentCanonicalDuration: string;
  eligibilityStatus: string;
  eligibility: string;
  eligibleSubjectCombinations: string;
  fieldIds: string[];
  fieldNames: string[];
  sourcePage: string;
  sourceReference: string;
  confidence: string;
  notes: string;
}

export interface CollegeProgramme {
  id: string;
  collegeId: string;
  collegeName: string;
  degreeId: string;
  programmeId: string;
  specialisationId: string;
  fieldId: string;
  programmeName: string;
  campus: string;
  eligibility: string;
  entranceExamId: string;
  source: string;
  confidence: string;
  status: string;
  relationshipLevel: string;
  admissionBasis: string;
  listName: string;
}

export interface ExamProgramme {
  id: string;
  examId: string;
  examName: string;
  programmeId: string;
  programmeName: string;
  degreeId: string;
  degreeName: string;
  institutionId: string;
  eligibilityContext: string;
  source: string;
  confidence: string;
  status: string;
  timeSensitive: string;
}

// ── Career Types ─────────────────────────────────────────────
export interface Career {
  id: string;
  nodeType: string;
  canonicalName: string;
  careerCategory: string;
  description: string;
  fieldIds: string[];
  entryDegreeIds: string[];
  parentNodeIds: string[];
  specialisationIds: string[];
  skillArea: string;
  furtherStudyOptions: string;
  sourcePage: string;
  sourceReference: string;
}

// ── Start Options ────────────────────────────────────────────
export interface StartOption {
  nextNodeId: string;
  nextNodeType: string;
  nextNodeName: string;
  edgeType: string;
  condition: string;
  durationText: string;
  canonicalStatus: string;
  confidence: string;
  sourceReference: string;
  sourcePage: string;
}

// ── Status Legend ────────────────────────────────────────────
export interface StatusLegendEntry {
  status: string;
  interpretation: string;
  frontendRule: string;
}

// ── Metadata ─────────────────────────────────────────────────
export interface DatasetMeta {
  generatedAt: string;
  datasetVersion: string;
  source: string;
  counts: {
    nodes: number;
    edges: number;
    activeEdges: number;
    programmes: number;
    collegeProgrammes: number;
    examProgrammes: number;
    careers: number;
    startOptions: number;
  };
  nodeTypeDistribution: Record<string, number>;
  nodeStatusDistribution: Record<string, number>;
}

// ── Root Dataset ─────────────────────────────────────────────
export interface CareerRoadmapDataset {
  _meta: DatasetMeta;
  statusLegend: StatusLegendEntry[];
  startOptions: StartOption[];
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  programmes: Programme[];
  collegeProgrammes: CollegeProgramme[];
  examProgrammes: ExamProgramme[];
  careers: Career[];
}

// ── UI / Graph Visualization Types ───────────────────────────

/** A node as rendered in the interactive graph */
export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  displayName: string;
  status: NodeStatus;
  confidence: string;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  childCount: number;
  parentCount: number;
  x?: number;
  y?: number;
}

/** An edge as rendered in the interactive graph */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  edgeType: string;
  label: string;
  condition: string;
  durationText: string;
}

/** The detail panel data when a node is selected */
export interface NodeDetail {
  node: RoadmapNode;
  incomingEdges: RoadmapEdge[];
  outgoingEdges: RoadmapEdge[];
  relatedProgrammes: Programme[];
  relatedCareers: Career[];
  relatedColleges: CollegeProgramme[];
  relatedExams: ExamProgramme[];
  continuation?: NodeContinuationResult;
  enrichment?: {
    isEnriched: boolean;
    sourceGraph: string;
    enrichmentSource?: string;
    verificationStatus?: string;
    confidence?: string;
    notes?: string;
  };
}

/** Node type visual configuration */
export interface NodeTypeConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

// ── Roadmap Semantic Phases ──────────────────────────────────
export type RoadmapPhase =
  | 'FOUNDATION'
  | 'ACADEMIC'
  | 'FIELD'
  | 'PROGRAMME'
  | 'SPECIALISATION'
  | 'CAREER_DOMAIN'
  | 'ADMISSION'
  | 'COLLEGE'
  | 'FURTHER_STUDY'
  | 'STUDY_ABROAD'
  | 'CAREER'
  | 'JOB_ROLE';

export interface RoadmapContinuationOption {
  id: string;
  label: string;
  nodeType: string;
  relationType: string;
  phase: RoadmapPhase;
  source: string;
  status: string;
  confidence: string;
  selectable: boolean;
  specificityWeight?: number;
  layer?: 'SOURCE' | 'ENRICHMENT';
  provenance?: {
    derivedFrom: string;
    sourceType: string;
    relationshipSource: string;
    sourceUrl?: string;
    sourceDate?: string;
  };
}

export interface NodeContinuationResult {
  nodeId: string;
  isTerminal: boolean;
  terminalType?: 'CAREER_DESTINATION' | 'JOB_ROLE_DESTINATION' | 'EXPLORE_ONLY';
  terminalMessage?: string;
  phases: {
    directChildren: RoadmapContinuationOption[];
    specialisations: RoadmapContinuationOption[];
    careerDomains: RoadmapContinuationOption[];
    furtherStudy: RoadmapContinuationOption[];
    admission: RoadmapContinuationOption[];
    colleges: RoadmapContinuationOption[];
    studyAbroad: RoadmapContinuationOption[];
    careers: RoadmapContinuationOption[];
    jobRoles: RoadmapContinuationOption[];
    broaderFieldCareers?: RoadmapContinuationOption[];
  };
  frontier: RoadmapContinuationOption[];
}

