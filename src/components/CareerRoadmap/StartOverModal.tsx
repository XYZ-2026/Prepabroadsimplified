'use client';

import React from 'react';

interface StartOverModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export function StartOverModal({ onConfirm, onClose }: StartOverModalProps) {
  return (
    <div className="roadmapModalOverlay" onClick={onClose}>
      <div className="roadmapModal" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modalHeader">
          <h2 className="modalTitle">Start a new roadmap?</h2>
          <button className="modalCloseBtn" onClick={onClose}>✕</button>
        </div>

        <div className="modalBody">
          <p style={{ fontSize: '13.5px', color: 'var(--roadmap-slate-600)', margin: 0, lineHeight: 1.5 }}>
            Your current unsaved path and active viewport will be cleared, returning you to the primary starting screen. Any previously saved roadmaps in your profile will remain safe.
          </p>
        </div>

        <div className="modalFooter">
          <button className="btnStudioSecondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btnStudioPrimary"
            style={{ background: '#DC2626', borderColor: '#DC2626' }}
            onClick={onConfirm}
          >
            Start New Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
