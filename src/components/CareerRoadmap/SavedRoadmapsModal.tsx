'use client';

import React from 'react';

export interface SavedRoadmapItem {
  roadmapId: string;
  title: string;
  startNodeId: string;
  selectedPathNodeIds: string[];
  updatedAt: string;
  notes?: string;
}

interface SavedRoadmapsModalProps {
  roadmaps: SavedRoadmapItem[];
  loading?: boolean;
  onSelectRoadmap: (item: SavedRoadmapItem) => void;
  onDeleteRoadmap: (roadmapId: string) => void;
  onDownloadPDF?: (item: SavedRoadmapItem) => void;
  onClose: () => void;
}

export function SavedRoadmapsModal({
  roadmaps,
  loading = false,
  onSelectRoadmap,
  onDeleteRoadmap,
  onDownloadPDF,
  onClose,
}: SavedRoadmapsModalProps) {
  return (
    <div className="roadmapModalOverlay" onClick={onClose}>
      <div className="roadmapModal" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">Saved Career Roadmaps</h2>
            <span style={{ fontSize: '12px', color: 'var(--roadmap-slate-500)' }}>
              Revisit and continue previously explored pathway plans
            </span>
          </div>
          <button className="modalCloseBtn" onClick={onClose}>✕</button>
        </div>

        <div className="modalBody">
          {loading ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--roadmap-slate-500)' }}>
              <div className="loadingSpinner" style={{ margin: '0 auto 12px auto' }} />
              <span>Loading saved roadmaps...</span>
            </div>
          ) : roadmaps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--roadmap-slate-500)' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--roadmap-slate-700)', margin: '0 0 6px 0' }}>
                No saved roadmaps yet
              </p>
              <p style={{ fontSize: '12.5px', margin: 0, lineHeight: 1.5 }}>
                Navigate any pathway from Class 10th or 12th and click <strong>"Save Roadmap"</strong> in the top toolbar to store your personalized plan.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {roadmaps.map(r => (
                <div
                  key={r.roadmapId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'var(--roadmap-slate-50)',
                    border: '1px solid var(--roadmap-slate-200)',
                    borderRadius: '10px',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                    onClick={() => onSelectRoadmap(r)}
                  >
                    <h3
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: 'var(--roadmap-slate-900)',
                        margin: '0 0 3px 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {r.title}
                    </h3>
                    <div style={{ fontSize: '11px', color: 'var(--roadmap-slate-500)' }}>
                      {r.selectedPathNodeIds?.length || 0} Stages · Last saved {new Date(r.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="btnStudioPrimary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => onSelectRoadmap(r)}
                    >
                      Open
                    </button>
                    {onDownloadPDF && (
                      <button
                        className="btnStudioSecondary"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => onDownloadPDF(r)}
                        title="Download PDF report"
                      >
                        PDF
                      </button>
                    )}
                    <button
                      style={{
                        padding: '6px 10px',
                        background: 'none',
                        border: '1px solid var(--roadmap-slate-200)',
                        color: '#EF4444',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                      onClick={() => onDeleteRoadmap(r.roadmapId)}
                      title="Delete roadmap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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
