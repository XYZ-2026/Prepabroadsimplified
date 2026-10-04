'use client';

import React from 'react';
import Link from 'next/link';
import { NodeIcon, GlobeIcon } from '@/components/CareerRoadmap/RoadmapIcons';
import {
  formatNodeType,
  formatNodeTypeBadge,
  formatAcademicStage,
  formatVerificationStatus,
} from '@/lib/career-roadmap-formatter';
import type { NodeContinuationResult, RoadmapContinuationOption } from '@/lib/career-roadmap-types';

export interface NodeDetailData {
  node: {
    id: string;
    type: string;
    canonicalName: string;
    displayName: string;
    description: string;
    status: string;
    canonicalStatus: string;
    confidence: string;
    applicationStage: string;
    parentDomain: string;
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
  };
  connections: {
    incoming: Array<{
      id: string;
      fromNodeId: string;
      fromName: string;
      fromType: string;
      edgeType: string;
      condition: string;
      durationText: string;
    }>;
    outgoing: Array<{
      id: string;
      toNodeId: string;
      toName: string;
      toType: string;
      edgeType: string;
      condition: string;
      durationText: string;
    }>;
  };
  relatedProgrammes: Array<{
    id: string;
    name: string;
    degreeType: string;
    duration: string;
    eligibility: string;
    fieldNames: string[];
  }>;
  relatedCareers: Array<{
    id: string;
    name: string;
    category: string;
    skillArea: string;
  }>;
  relatedColleges: Array<{
    id: string;
    collegeName: string;
    programmeName: string;
    confidence: string;
    status: string;
  }>;
  relatedExams: Array<{
    id: string;
    examName: string;
    programmeName: string;
    eligibilityContext: string;
  }>;
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

interface DetailPanelProps {
  detail: NodeDetailData;
  stepNumber?: number;
  totalSteps?: number;
  inspectorMode?: boolean;
  isCompared: boolean;
  onToggleCompare: () => void;
  onClose: () => void;
  onSelectFrontierNode?: (id: string, label: string, type: string) => void;
  onSaveRoadmap?: () => void;
  onDownloadPDF?: () => void;
  onStartOver?: () => void;
}

export function DetailPanel({
  detail,
  stepNumber = 1,
  totalSteps = 1,
  inspectorMode = false,
  isCompared,
  onToggleCompare,
  onClose,
  onSelectFrontierNode,
  onSaveRoadmap,
  onDownloadPDF,
  onStartOver,
}: DetailPanelProps) {
  const { node, connections, relatedProgrammes, relatedCareers, relatedColleges, relatedExams, continuation, enrichment } = detail;

  const cleanText = (val?: string) => {
    if (!val || val === 'NOT_IN_SOURCE' || val === 'DESCRIPTION_NOT_IN_SOURCE' || val === 'NOT_STATED_IN_SOURCE') {
      return '';
    }
    return val.trim();
  };

  const verification = formatVerificationStatus(node.canonicalStatus || node.status);
  const formattedStage = formatAcademicStage(node.applicationStage);

  // Short summary text from available fields
  const summaryText = cleanText(node.whatIsIt) || cleanText(node.description);

  // Semantic continuation resolution
  const isTerminal = continuation ? continuation.isTerminal : (connections.outgoing.length === 0);
  const terminalType = continuation?.terminalType;
  const terminalMessage = continuation?.terminalMessage;

  const phases = continuation?.phases;
  const careerDomains = phases?.careerDomains || [];
  const jobRoles = phases?.jobRoles || [];
  const furtherStudyOptions = phases?.furtherStudy || [];
  const careerOptions = phases?.careers || [];
  const studyAbroadOptions = phases?.studyAbroad || [];
  const broaderFieldCareers = phases?.broaderFieldCareers || [];
  const directChildren = phases?.directChildren || connections.outgoing.map(e => ({
    id: e.toNodeId,
    label: e.toName,
    nodeType: e.toType,
    relationType: e.edgeType,
    phase: 'ACADEMIC' as any,
    source: 'Direct Edge',
    status: 'ACTIVE',
    confidence: 'HIGH',
    selectable: true,
  }));

  const hasContinuationOptions = !isTerminal && (
    careerDomains.length > 0 ||
    jobRoles.length > 0 ||
    furtherStudyOptions.length > 0 ||
    careerOptions.length > 0 ||
    studyAbroadOptions.length > 0 ||
    directChildren.length > 0 ||
    broaderFieldCareers.length > 0
  );

  const isStudyAbroadNode = node.type === 'STUDY_ABROAD';

  return (
    <>
      {/* ── Sticky Header: Current Focus Indicator ── */}
      <div className="detailHeaderSticky">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--roadmap-primary)' }}>
            CURRENT FOCUS · STEP {stepNumber} OF {totalSteps}
          </span>
          <button className="detailCloseBtn" onClick={onClose} title="Close detail panel">
            ✕
          </button>
        </div>

        <div className="detailTitleRow" style={{ marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <div style={{ color: 'var(--roadmap-primary)', flexShrink: 0 }}>
              <NodeIcon type={node.type} size={20} />
            </div>
            <h2 className="detailTitle" title={node.displayName || node.canonicalName}>
              {node.displayName || node.canonicalName}
            </h2>
          </div>
        </div>

        <div className="detailBadgesRow" style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '2px 7px',
              borderRadius: '4px',
              background: 'var(--roadmap-slate-100)',
              color: 'var(--roadmap-slate-700)',
            }}
          >
            {formatNodeTypeBadge(node.type)}
          </span>

          {formattedStage && (
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: 'var(--roadmap-slate-600)',
                background: 'var(--roadmap-slate-100)',
                padding: '2px 7px',
                borderRadius: '4px',
              }}
            >
              {formattedStage}
            </span>
          )}

          {node.parentDomain && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--roadmap-slate-500)',
                background: 'var(--roadmap-slate-50)',
                border: '1px solid var(--roadmap-slate-200)',
                padding: '1px 6px',
                borderRadius: '4px',
                maxWidth: '180px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={node.parentDomain}
            >
              {node.parentDomain}
            </span>
          )}

          {inspectorMode && (
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'monospace',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#FEF3C7',
                color: '#92400E',
                fontWeight: 700,
              }}
            >
              {node.id}
            </span>
          )}
        </div>

        {/* Action Row */}
        <div className="detailSecondaryRow" style={{ marginTop: 0 }}>
          <button
            className={`detailSecondaryBtn ${isCompared ? 'detailSecondaryBtnActive' : ''}`}
            onClick={onToggleCompare}
          >
            {isCompared ? '✓ Added to Compare' : '+ Add to Compare'}
          </button>
        </div>
      </div>

      {/* ── Scrollable Body: Explanations First ── */}
      <div className="detailScrollBody">
        {/* ── 4. AT A GLANCE (Compact Data Block Immediately Above the Fold) ── */}
        {(formattedStage || cleanText(node.duration) || cleanText(node.eligibility) || cleanText(node.typicalEntryRoute)) && (
          <div className="atAGlanceSection">
            <h3 className="atAGlanceTitle">At a Glance</h3>
            <div className="atAGlanceGrid">
              {formattedStage && (
                <div className="atAGlanceItem">
                  <span className="atAGlanceLabel">Stage</span>
                  <span className="atAGlanceValue">{formattedStage}</span>
                </div>
              )}
              {cleanText(node.duration) && (
                <div className="atAGlanceItem">
                  <span className="atAGlanceLabel">Duration</span>
                  <span className="atAGlanceValue">{node.duration}</span>
                </div>
              )}
              {cleanText(node.eligibility) && (
                <div className="atAGlanceItem" style={{ gridColumn: 'span 2' }}>
                  <span className="atAGlanceLabel">Eligibility</span>
                  <span className="atAGlanceValue">{node.eligibility}</span>
                </div>
              )}
              {cleanText(node.typicalEntryRoute) && (
                <div className="atAGlanceItem" style={{ gridColumn: 'span 2' }}>
                  <span className="atAGlanceLabel">Entry Route</span>
                  <span className="atAGlanceValue">{node.typicalEntryRoute}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 5. WHAT IS THIS? (Concise Explanation) ── */}
        {summaryText && (
          <div className="detailSection">
            <h3 className="detailSectionTitle">What is {node.displayName || node.canonicalName}?</h3>
            <p className="detailText">{summaryText}</p>
          </div>
        )}

        {/* ── 6. WHAT YOU STUDY / WHAT YOU DO ── */}
        {cleanText(node.whatYouStudy) && (
          <div className="detailSection">
            <h3 className="detailSectionTitle">What You Study / Practice</h3>
            <p className="detailText">{node.whatYouStudy}</p>
          </div>
        )}

        {/* ── CORE SKILLS ── */}
        {cleanText(node.skills) && (
          <div className="detailSection">
            <h3 className="detailSectionTitle">Skills Acquired</h3>
            <p className="detailText">{node.skills}</p>
          </div>
        )}

        {/* ── 7. CONTINUE YOUR ROADMAP (Semantic Continuation Surface) ── */}
        <div className="continueRoadmapSection">
          <div className="continueRoadmapHeader">
            <h3 className="continueRoadmapTitle">Continue Your Roadmap</h3>
            {hasContinuationOptions && (
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--roadmap-slate-500)' }}>
                Click to expand path
              </span>
            )}
          </div>

          {/* CASE A: Terminal Endpoints */}
          {isTerminal ? (
            terminalType === 'JOB_ROLE_DESTINATION' ? (
              <div className="careerDestinationCard">
                <span className="careerDestinationBadge">PROFESSION DESTINATION</span>
                <h4 className="careerDestinationTitle">{node.displayName || node.canonicalName}</h4>
                <p className="careerDestinationText">
                  {terminalMessage || `Your selected roadmap has reached a recorded profession destination: ${node.displayName || node.canonicalName}.`}
                </p>
                <div className="careerDestinationActions">
                  {onSaveRoadmap && (
                    <button className="btnStudioPrimary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onSaveRoadmap}>
                      Save Roadmap
                    </button>
                  )}
                  {onDownloadPDF && (
                    <button className="btnStudioSecondary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onDownloadPDF}>
                      Download PDF
                    </button>
                  )}
                  {onStartOver && (
                    <button className="btnStudioSecondary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onStartOver}>
                      Explore Another Branch
                    </button>
                  )}
                </div>
              </div>
            ) : terminalType === 'CAREER_DESTINATION' ? (
              <div className="careerDestinationCard">
                <span className="careerDestinationBadge">CAREER DESTINATION</span>
                <h4 className="careerDestinationTitle">{node.displayName || node.canonicalName}</h4>
                <p className="careerDestinationText">
                  {terminalMessage || `Your selected roadmap has reached a recorded career destination: ${node.displayName || node.canonicalName}.`}
                </p>
                <div className="careerDestinationActions">
                  {onSaveRoadmap && (
                    <button className="btnStudioPrimary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onSaveRoadmap}>
                      Save Roadmap
                    </button>
                  )}
                  {onDownloadPDF && (
                    <button className="btnStudioSecondary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onDownloadPDF}>
                      Download PDF
                    </button>
                  )}
                  {onStartOver && (
                    <button className="btnStudioSecondary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onStartOver}>
                      Explore Another Branch
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="exploreOnlyCard">
                <span className="exploreOnlyTitle">Exploration Boundary Reached</span>
                <p className="exploreOnlyText">
                  Detailed downstream pathways are not currently recorded in the roadmap dataset for this specific option. You can save your journey, export a PDF report, or click an earlier branch on the map to explore another pathway.
                </p>
                <div className="careerDestinationActions">
                  {onSaveRoadmap && (
                    <button className="btnStudioPrimary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onSaveRoadmap}>
                      Save Roadmap
                    </button>
                  )}
                  {onDownloadPDF && (
                    <button className="btnStudioSecondary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onDownloadPDF}>
                      Download PDF
                    </button>
                  )}
                  {onStartOver && (
                    <button className="btnStudioSecondary" style={{ padding: '6px 12px', fontSize: '11.5px' }} onClick={onStartOver}>
                      Explore Another Branch
                    </button>
                  )}
                </div>
              </div>
            )
          ) : (
            /* CASE B: Active Continuation Branches */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* 0. Career Domains (Prominent for Specialisations & Degrees) */}
              {careerDomains.length > 0 && (
                <div>
                  <div className="continuationCategoryTitle" style={{ color: '#0369a1' }}>
                    <NodeIcon type="CAREER_DOMAIN" size={13} />
                    <span>Explore Career Domains ({careerDomains.length})</span>
                  </div>
                  {careerDomains.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className="continuationItemBtn"
                      style={{ borderColor: '#bae6fd', background: '#f0f9ff' }}
                      onClick={() => onSelectFrontierNode && onSelectFrontierNode(opt.id, opt.label, opt.nodeType)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                        <div style={{ color: '#0284c7', flexShrink: 0 }}>
                          <NodeIcon type="CAREER_DOMAIN" size={13} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#0c4a6e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {opt.label}
                        </span>
                      </div>
                      <span style={{ color: '#0284c7', fontSize: '11.5px', fontWeight: 600, flexShrink: 0 }}>
                        Explore Domain →
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 1. Job Roles / Professions */}
              {jobRoles.length > 0 && (
                <div>
                  <div className="continuationCategoryTitle">
                    <NodeIcon type="PROFESSION" size={13} />
                    <span>Job Roles / Professions ({jobRoles.length})</span>
                  </div>
                  {jobRoles.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className="continuationItemBtn"
                      onClick={() => onSelectFrontierNode && onSelectFrontierNode(opt.id, opt.label, opt.nodeType)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                        <div style={{ color: 'var(--roadmap-primary)', flexShrink: 0 }}>
                          <NodeIcon type={opt.nodeType} size={13} />
                        </div>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {opt.label}
                        </span>
                      </div>
                      <span style={{ color: 'var(--roadmap-primary)', fontSize: '11.5px', flexShrink: 0 }}>
                        Explore →
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 2. Further Study */}
              {furtherStudyOptions.length > 0 && (
                <div>
                  <div className="continuationCategoryTitle">
                    <NodeIcon type="POSTGRADUATE_PROGRAM" size={13} />
                    <span>Further Study ({furtherStudyOptions.length})</span>
                  </div>
                  {furtherStudyOptions.slice(0, 4).map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className="continuationItemBtn"
                      onClick={() => onSelectFrontierNode && onSelectFrontierNode(opt.id, opt.label, opt.nodeType)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                        <div style={{ color: '#6366F1', flexShrink: 0 }}>
                          <NodeIcon type={opt.nodeType} size={13} />
                        </div>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {opt.label}
                        </span>
                      </div>
                      <span style={{ color: 'var(--roadmap-primary)', fontSize: '11.5px', flexShrink: 0 }}>
                        Explore →
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 3. Career Directions */}
              {careerOptions.length > 0 && (
                <div>
                  <div className="continuationCategoryTitle">
                    <NodeIcon type="CAREER" size={13} />
                    <span>Career Directions ({careerOptions.length})</span>
                  </div>
                  {careerOptions.slice(0, 3).map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className="continuationItemBtn"
                      onClick={() => onSelectFrontierNode && onSelectFrontierNode(opt.id, opt.label, opt.nodeType)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                        <div style={{ color: '#059669', flexShrink: 0 }}>
                          <NodeIcon type={opt.nodeType} size={13} />
                        </div>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {opt.label}
                        </span>
                      </div>
                      <span style={{ color: 'var(--roadmap-primary)', fontSize: '11.5px', flexShrink: 0 }}>
                        Explore →
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 4. Study Abroad Option */}
              {studyAbroadOptions.length > 0 && (
                <div>
                  <div className="continuationCategoryTitle">
                    <GlobeIcon size={13} />
                    <span>Study Abroad Pathway</span>
                  </div>
                  {studyAbroadOptions.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className="continuationItemBtn"
                      style={{ borderColor: '#BFDBFE', background: '#F8FAFF' }}
                      onClick={() => onSelectFrontierNode && onSelectFrontierNode(opt.id, opt.label, opt.nodeType)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                        <div style={{ color: '#1D4ED8', flexShrink: 0 }}>
                          <GlobeIcon size={13} />
                        </div>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#1E3A8A' }}>
                          {opt.label}
                        </span>
                      </div>
                      <span style={{ color: '#1D4ED8', fontSize: '11.5px', flexShrink: 0 }}>
                        Explore Branch →
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 5. Direct Children (if not specialisations or already covered) */}
              {directChildren.length > 0 && jobRoles.length === 0 && careerDomains.length === 0 && (
                <div>
                  <div className="continuationCategoryTitle">
                    <NodeIcon type={directChildren[0].nodeType} size={13} />
                    <span>Next Decisions ({directChildren.length})</span>
                  </div>
                  {directChildren.slice(0, 5).map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className="continuationItemBtn"
                      onClick={() => onSelectFrontierNode && onSelectFrontierNode(opt.id, opt.label, opt.nodeType)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                        <div style={{ color: 'var(--roadmap-primary)', flexShrink: 0 }}>
                          <NodeIcon type={opt.nodeType} size={13} />
                        </div>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {opt.label}
                        </span>
                      </div>
                      <span style={{ color: 'var(--roadmap-primary)', fontSize: '11.5px', flexShrink: 0 }}>
                        Explore →
                      </span>
                    </button>
                  ))}
                  {directChildren.length > 5 && (
                    <span style={{ fontSize: '11px', color: 'var(--roadmap-slate-500)', display: 'block', marginTop: '4px' }}>
                      +{directChildren.length - 5} more options available on the roadmap canvas
                    </span>
                  )}
                </div>
              )}

              {/* 6. Broader Field Opportunities (Preserving field-level data without masquerading as specialisation outcomes) */}
              {broaderFieldCareers.length > 0 && (
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--roadmap-slate-200)' }}>
                  <div className="continuationCategoryTitle" style={{ color: 'var(--roadmap-slate-500)' }}>
                    <span>Broader career options in this field ({broaderFieldCareers.length})</span>
                  </div>
                  {broaderFieldCareers.slice(0, 3).map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className="continuationItemBtn"
                      style={{ opacity: 0.85, background: 'var(--roadmap-slate-50)' }}
                      onClick={() => onSelectFrontierNode && onSelectFrontierNode(opt.id, opt.label, opt.nodeType)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                        <div style={{ color: 'var(--roadmap-slate-400)', flexShrink: 0 }}>
                          <NodeIcon type={opt.nodeType} size={13} />
                        </div>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--roadmap-slate-600)', fontSize: '12px' }}>
                          {opt.label}
                        </span>
                      </div>
                      <span style={{ color: 'var(--roadmap-slate-400)', fontSize: '11px', flexShrink: 0 }}>
                        Broader field →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── 8. FURTHER STUDY (Detailed Informational Block) ── */}
        {cleanText(node.furtherStudy) && (
          <div className="detailSection">
            <h3 className="detailSectionTitle">Further Study Options</h3>
            <p className="detailText">{node.furtherStudy}</p>
          </div>
        )}

        {/* ── 9. CAREER OUTCOMES & JOB ROLES ── */}
        {(cleanText(node.careerOptions) || relatedCareers.length > 0) && (
          <div className="detailSection">
            <h3 className="detailSectionTitle">Career Outcomes</h3>
            {cleanText(node.careerOptions) && (
              <p className="detailText" style={{ marginBottom: '8px' }}>{node.careerOptions}</p>
            )}

            {relatedCareers.length > 0 && (
              <div className="navigatorList" style={{ marginTop: '6px' }}>
                {relatedCareers.slice(0, 6).map(c => (
                  <div key={c.id} className="navigatorItem" style={{ cursor: 'default', padding: '6px 10px' }}>
                    <div style={{ color: 'var(--roadmap-slate-500)', flexShrink: 0 }}>
                      <NodeIcon type="CAREER" size={14} />
                    </div>
                    <span className="navigatorItemName" style={{ fontSize: '12px' }}>{c.name}</span>
                    {c.skillArea && (
                      <span className="navigatorItemType">{c.skillArea}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 10. STUDY ABROAD INTEGRATION ── */}
        {(isStudyAbroadNode || studyAbroadOptions.length > 0) && (
          <div className="studyAbroadCard">
            <div className="studyAbroadHeader">
              <span className="studyAbroadBadge">GLOBAL STUDY OPPORTUNITIES</span>
              <GlobeIcon size={16} className="text-blue-600" />
            </div>
            <h4 className="studyAbroadTitle">Study Abroad & International Universities</h4>
            <p className="studyAbroadText">
              Expand your career horizon by exploring verified undergraduate, master’s, and research programmes worldwide matching this discipline.
            </p>
            <div className="studyAbroadDestList">
              <span className="studyAbroadDestPill">🇺🇸 United States</span>
              <span className="studyAbroadDestPill">🇬🇧 United Kingdom</span>
              <span className="studyAbroadDestPill">🇦🇺 Australia</span>
              <span className="studyAbroadDestPill">🇩🇪 Germany</span>
              <span className="studyAbroadDestPill">🇨🇦 Canada</span>
              <span className="studyAbroadDestPill">🇸🇬 Singapore</span>
            </div>
            <Link
              href="/university-finder"
              className="btnStudyAbroadTool"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Explore in University Finder Tool ↗</span>
            </Link>
          </div>
        )}

        {/* ── 11. ADMISSION & ENTRANCE EXAMS ── */}
        {relatedExams.length > 0 && (
          <div className="detailSection">
            <h3 className="detailSectionTitle">Admission & Entrance Exams ({relatedExams.length})</h3>
            <div className="navigatorList">
              {relatedExams.map(e => (
                <div key={e.id} className="navigatorItem" style={{ cursor: 'default' }}>
                  <div style={{ color: 'var(--roadmap-slate-500)', flexShrink: 0 }}>
                    <NodeIcon type="ENTRANCE_EXAM" size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="navigatorItemName" style={{ fontSize: '12px' }}>{e.examName}</div>
                    {e.eligibilityContext && (
                      <span style={{ fontSize: '10.5px', color: 'var(--roadmap-slate-400)', display: 'block' }}>
                        {e.eligibilityContext}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SAMPLE RECOGNIZED INSTITUTIONS ── */}
        {relatedColleges.length > 0 && (
          <div className="detailSection">
            <h3 className="detailSectionTitle">Sample Recognized Institutions ({relatedColleges.length})</h3>
            <div className="navigatorList">
              {relatedColleges.slice(0, 8).map(col => (
                <div key={col.id} className="navigatorItem" style={{ cursor: 'default' }}>
                  <div style={{ color: 'var(--roadmap-slate-500)', flexShrink: 0 }}>
                    <NodeIcon type="COLLEGE" size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="navigatorItemName" style={{ fontSize: '12px' }}>{col.collegeName}</div>
                    {col.programmeName && (
                      <span style={{ fontSize: '10.5px', color: 'var(--roadmap-slate-400)', display: 'block' }}>
                        {col.programmeName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 12. SOURCE ATTRIBUTION & DATA TRANSPARENCY ── */}
        <div className="detailSection" style={{ marginTop: '20px' }}>
          <h3 className="detailSectionTitle">Source Verification</h3>
          <div className="sourceBox">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong>Source: {enrichment?.enrichmentSource || node.sourceName || 'Career Handbook'}</strong>
              {node.sourcePage && <span>Ref: {node.sourcePage}</span>}
            </div>
            {enrichment?.isEnriched && (
              <div style={{ marginTop: '5px', fontSize: '11px', color: '#0369a1', fontWeight: 600 }}>
                Layer B Modern Career Enrichment Graph (Verified Industry Standard)
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: verification.tone === 'verified' ? '#10B981' : verification.tone === 'provisional' ? '#3B82F6' : '#F59E0B',
                }}
              />
              <span>{enrichment?.verificationStatus ? (enrichment.verificationStatus === 'VERIFIED' ? 'Verified (ACM/IEEE / AICTE Standards)' : enrichment.verificationStatus) : verification.label}</span>
            </div>
            {inspectorMode && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--roadmap-slate-200)', fontSize: '10px', fontFamily: 'monospace' }}>
                <div>Node ID: {node.id}</div>
                <div>Graph Layer: {enrichment?.sourceGraph || 'Layer A Source Graph'}</div>
                <div>Status: {node.canonicalStatus || node.status}</div>
                <div>Confidence: {enrichment?.confidence || node.confidence || 'HIGH'}</div>
                <div>Incoming Edges: {connections.incoming.length}</div>
                <div>Outgoing Edges: {connections.outgoing.length}</div>
                <div>Is Terminal: {isTerminal ? 'YES' : 'NO'}</div>
                {terminalType && <div>Terminal Type: {terminalType}</div>}
                {enrichment?.notes && <div>Notes: {enrichment.notes}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
