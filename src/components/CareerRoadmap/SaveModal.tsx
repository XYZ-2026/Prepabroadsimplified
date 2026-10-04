'use client';

import React from 'react';

interface BreadcrumbItem {
  id: string;
  label: string;
  type: string;
}

interface SaveModalProps {
  title: string;
  notes: string;
  breadcrumbs: BreadcrumbItem[];
  saving: boolean;
  onTitleChange: (val: string) => void;
  onNotesChange: (val: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function SaveModal({
  title,
  notes,
  breadcrumbs,
  saving,
  onTitleChange,
  onNotesChange,
  onConfirm,
  onClose,
}: SaveModalProps) {
  return (
    <div className="roadmapModalOverlay" onClick={onClose}>
      <div className="roadmapModal" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">Save Career Roadmap</h2>
            <span style={{ fontSize: '12px', color: 'var(--roadmap-slate-500)' }}>
              Save this personalized pathway to your student dashboard
            </span>
          </div>
          <button className="modalCloseBtn" onClick={onClose}>✕</button>
        </div>

        <div className="modalBody">
          <p style={{ fontSize: '13px', color: 'var(--roadmap-slate-600)', margin: '0 0 16px 0', lineHeight: 1.5 }}>
            Saving this roadmap allows you and your allotted counsellor to track your decision trajectory, revisit target entrance exams, and export personalized planning reports.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--roadmap-slate-700)', marginBottom: '6px' }}>
              Roadmap Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => onTitleChange(e.target.value)}
              placeholder="e.g. My Computer Science Engineering Path"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--roadmap-slate-300)',
                fontSize: '13.5px',
                color: 'var(--roadmap-slate-900)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--roadmap-slate-700)', marginBottom: '6px' }}>
              Personal Notes & Goals (Optional)
            </label>
            <textarea
              value={notes}
              onChange={e => onNotesChange(e.target.value)}
              placeholder="Target colleges, exam preparation timeline, questions for career counsellor..."
              rows={3}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--roadmap-slate-300)',
                fontSize: '13px',
                color: 'var(--roadmap-slate-900)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--roadmap-slate-700)', marginBottom: '6px' }}>
              Mapped Path ({breadcrumbs.length} Stages)
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 12px',
                background: 'var(--roadmap-slate-50)',
                borderRadius: '8px',
                border: '1px solid var(--roadmap-slate-200)',
              }}
            >
              {breadcrumbs.map((b, i) => (
                <React.Fragment key={b.id}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--roadmap-slate-800)' }}>
                    {b.label}
                  </span>
                  {i < breadcrumbs.length - 1 && (
                    <span style={{ color: 'var(--roadmap-slate-400)', fontSize: '11px' }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="modalFooter">
          <button className="btnStudioSecondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btnStudioPrimary" onClick={onConfirm} disabled={saving}>
            {saving ? 'Saving...' : 'Save Roadmap'}
          </button>
        </div>
      </div>
    </div>
  );
}
