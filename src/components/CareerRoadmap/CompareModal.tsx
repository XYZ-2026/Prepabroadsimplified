'use client';

import React from 'react';
import { NodeIcon } from '@/components/CareerRoadmap/RoadmapIcons';
import { formatNodeTypeBadge, formatVerificationStatus } from '@/lib/career-roadmap-formatter';
import { NodeDetailData } from './DetailPanel';

interface CompareModalProps {
  details: NodeDetailData[];
  loading?: boolean;
  onClose: () => void;
  onRemoveItem: (nodeId: string) => void;
}

export function CompareModal({ details, loading = false, onClose, onRemoveItem }: CompareModalProps) {
  const clean = (val?: string) => {
    if (!val || val === 'NOT_IN_SOURCE' || val === 'DESCRIPTION_NOT_IN_SOURCE' || val === 'NOT_STATED_IN_SOURCE') {
      return null;
    }
    return val.trim();
  };

  return (
    <div className="roadmapModalOverlay" onClick={onClose}>
      <div className="roadmapModal roadmapModalWide" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>⚖️</span>
            <div>
              <h2 className="modalTitle">Pathway Side-by-Side Comparison</h2>
              <span style={{ fontSize: '12px', color: 'var(--roadmap-slate-500)' }}>
                Comparing {details.length} options across duration, eligibility, entrance exams, and career outcomes
              </span>
            </div>
          </div>
          <button className="modalCloseBtn" onClick={onClose}>✕</button>
        </div>

        <div className="modalBody" style={{ padding: '0 24px 24px 24px' }}>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--roadmap-slate-500)' }}>
              <div className="loadingSpinner" style={{ margin: '0 auto 12px auto' }} />
              <span>Assembling comparative metrics...</span>
            </div>
          ) : details.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--roadmap-slate-500)' }}>
              No pathways selected for comparison. Click "+ Add to Compare" on any card or detail panel.
            </div>
          ) : (
            <div className="compareTableContainer" style={{ marginTop: '16px' }}>
              <table className="compareTable">
                <thead>
                  <tr>
                    <th style={{ width: '180px' }}>Attribute</th>
                    {details.map(d => (
                      <th key={d.node.id}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ color: 'var(--roadmap-primary)' }}>
                              <NodeIcon type={d.node.type} size={18} />
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--roadmap-slate-900)' }}>
                              {d.node.displayName || d.node.canonicalName}
                            </span>
                          </div>
                          <button
                            onClick={() => onRemoveItem(d.node.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--roadmap-slate-400)', cursor: 'pointer', padding: '2px 4px' }}
                            title="Remove from compare"
                          >
                            ✕
                          </button>
                        </div>
                        <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'var(--roadmap-slate-100)', color: 'var(--roadmap-slate-600)' }}>
                          {formatNodeTypeBadge(d.node.type)}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Overview</th>
                    {details.map(d => (
                      <td key={d.node.id}>
                        {clean(d.node.whatIsIt) || clean(d.node.description) || (
                          <span className="notAvailableBadge">Standard academic pathway</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>Duration</th>
                    {details.map(d => (
                      <td key={d.node.id}>
                        {clean(d.node.duration) || <span className="notAvailableBadge">Course-specific</span>}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>Eligibility</th>
                    {details.map(d => (
                      <td key={d.node.id}>
                        {clean(d.node.eligibility) || <span className="notAvailableBadge">General admission criteria</span>}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>Entry Route</th>
                    {details.map(d => (
                      <td key={d.node.id}>
                        {clean(d.node.typicalEntryRoute) || <span className="notAvailableBadge">Merit or direct counselling</span>}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>What You Study</th>
                    {details.map(d => (
                      <td key={d.node.id}>
                        {clean(d.node.whatYouStudy) || <span className="notAvailableBadge">Domain curriculum</span>}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>Further Study</th>
                    {details.map(d => (
                      <td key={d.node.id}>
                        {clean(d.node.furtherStudy) || <span className="notAvailableBadge">Postgraduate / Professional entry</span>}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>Career Destinations</th>
                    {details.map(d => (
                      <td key={d.node.id}>
                        {d.relatedCareers.length > 0 ? (
                          d.relatedCareers.map(c => c.name).join(', ')
                        ) : clean(d.node.careerOptions) ? (
                          d.node.careerOptions
                        ) : (
                          <span className="notAvailableBadge">Various industry roles</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>Entrance Exams</th>
                    {details.map(d => (
                      <td key={d.node.id}>
                        {d.relatedExams.length > 0 ? (
                          d.relatedExams.map(e => e.examName).join(', ')
                        ) : (
                          <span className="notAvailableBadge">Direct or university merit</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>Mapped Colleges</th>
                    {details.map(d => (
                      <td key={d.node.id}>
                        {d.relatedColleges.length > 0 ? (
                          `${d.relatedColleges.length} recognized institutions mapped`
                        ) : (
                          <span className="notAvailableBadge">Broad institutional availability</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <th>Source Verification</th>
                    {details.map(d => {
                      const ver = formatVerificationStatus(d.node.canonicalStatus || d.node.status);
                      return (
                        <td key={d.node.id}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--roadmap-slate-700)' }}>
                            {ver.label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modalFooter">
          <button className="btnStudioSecondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
