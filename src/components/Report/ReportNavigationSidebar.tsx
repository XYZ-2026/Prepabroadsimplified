'use client';

import React, { useState, useEffect, useMemo } from 'react';

/* ────────────────────────────────────────────────────────────
   Navigation Registry — Single Source of Truth
   ──────────────────────────────────────────────────────────── */

export interface NavItem {
  id: string;
  page: number;
  label: string;
  icon?: string;
  quickJumpLabel?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  icon: string;
  items: NavItem[];
}

export const FULL_REPORT_SECTIONS: NavGroup[] = [
  {
    id: 'overview', title: 'Overview & Dashboard', icon: '📊',
    items: [
      { id: 'cover', page: 1, label: 'Cover Page' },
      { id: 'disclaimer', page: 2, label: 'Disclaimer & Legal' },
      { id: 'data_protocol', page: 3, label: 'Data Protocols' },
      { id: 'toc', page: 4, label: 'Table of Contents' },
      { id: 'acknowledgment', page: 5, label: 'Candidate Acknowledgment' },
      { id: 'welcome', page: 6, label: 'Welcome & Orientation' },
      { id: 'about_assessment', page: 7, label: 'About Assessment' },
      { id: 'methodology', page: 8, label: 'Methodology & Normalization' },
      { id: 'diag_snapshot', page: 9, label: 'Diagnostic Snapshot' },
      { id: 'visual_analytics', page: 10, label: 'Visual Analytics I & II' },
      { id: 'visual_analytics_2', page: 11, label: 'Visual Analytics III' },
    ]
  },
  {
    id: 'phase1', title: 'Phase I — Personality Architecture', icon: '🧬',
    items: [
      { id: 'mod1', page: 12, label: 'Module 01: Openness & Curiosity' },
      { id: 'mod2', page: 13, label: 'Module 02: Conscientiousness & Grit' },
      { id: 'mod3', page: 14, label: 'Module 03: Extraversion & Energy' },
      { id: 'mod4', page: 15, label: 'Module 04: Agreeableness & Teamwork' },
      { id: 'mod5', page: 16, label: 'Module 05: Emotional Stability' },
      { id: 'mod6', page: 17, label: 'Module 06: Mindset Orientation' },
      { id: 'mod7', page: 18, label: 'Module 07: Locus of Control' },
      { id: 'mod8', page: 19, label: 'Module 08: Risk Tolerance' },
      { id: 'mod9', page: 20, label: 'Module 09: Self-Efficacy & Ambition' },
      { id: 'mod10', page: 21, label: 'Module 10: Ambiguity & Adaptability' },
    ]
  },
  {
    id: 'phase2', title: 'Phase II — Cognitive Processing', icon: '🧠',
    items: [
      { id: 'mod11', page: 22, label: 'Module 11: Numerical Reasoning' },
      { id: 'mod12', page: 23, label: 'Module 12: Fluid Reasoning & Logic' },
      { id: 'mod13', page: 24, label: 'Module 13: Verbal Comprehension' },
      { id: 'mod14', page: 25, label: 'Module 14: Spatial Visualization' },
      { id: 'mod15', page: 26, label: 'Module 15: Abstract Systemic Logic' },
      { id: 'mod16', page: 27, label: 'Module 16: Working Memory Capacity' },
      { id: 'mod17', page: 28, label: 'Module 17: Processing Speed' },
      { id: 'mod18', page: 29, label: 'Module 18: Analytical Problem Solving' },
      { id: 'mod19', page: 30, label: 'Module 19: Critical Thinking' },
      { id: 'mod20', page: 31, label: 'Module 20: Creative Synthesis' },
    ]
  },
  {
    id: 'phase3', title: 'Phase III — Learning & Execution', icon: '📚',
    items: [
      { id: 'mod21', page: 32, label: 'Module 21: VARK Learning Style' },
      { id: 'mod22', page: 33, label: 'Module 22: Study Habits & Notes' },
      { id: 'mod23', page: 34, label: 'Module 23: Exam Prep & Revision' },
      { id: 'mod24', page: 35, label: 'Module 24: Time Allocation' },
      { id: 'mod25', page: 36, label: 'Module 25: Memory Retention' },
      { id: 'mod26', page: 37, label: 'Module 26: Distraction Resistance' },
      { id: 'mod27', page: 38, label: 'Module 27: Deep Work Capacity' },
      { id: 'mod28', page: 39, label: 'Module 28: Collaborative Execution' },
    ]
  },
  {
    id: 'phase4', title: 'Phase IV — Stream & Career Alignment', icon: '🧭',
    items: [
      { id: 'mod29', page: 40, label: 'Module 29: Holland RIASEC' },
      { id: 'mod30', page: 41, label: 'Module 30: Integrated Fitment' },
      { id: 'profile_synthesis', page: 42, label: 'Executive Profile Synthesis' },
    ]
  },
  {
    id: 'phase5', title: 'Phase V — Family & Career Alignment', icon: '👨‍👩‍👦',
    items: [
      { id: 'family_overview', page: 43, label: 'Student–Parent Alignment Overview', quickJumpLabel: '♟ Family Overview' },
      { id: 'family_comparison', page: 44, label: 'Detailed Comparison (7 Domains)', quickJumpLabel: '♟ Family Alignment' },
      { id: 'family_action', page: 45, label: 'Family Career Action Plan' },
    ]
  },
  {
    id: 'phase6', title: 'Phase VI — Advanced Synthesis', icon: '🎯',
    items: [
      { id: 'fitment_matrix', page: 46, label: 'Fitment × Execution Readiness' },
      { id: 'cross_val', page: 47, label: 'Profile Cross-Validation' },
      { id: 'dev_priorities', page: 48, label: 'Developmental Priorities' },
    ]
  },
  {
    id: 'decision_roadmaps', title: 'Career Decision & Roadmaps', icon: '🗺️',
    items: [
      { id: 'rec_pathways', page: 49, label: 'Recommended Pathways', quickJumpLabel: '★ Recommended Pathways' },
      { id: 'primary_roadmap', page: 50, label: 'Primary Pathway Roadmap', quickJumpLabel: '◈ Primary Roadmap' },
      { id: 'secondary_roadmap', page: 51, label: 'Secondary Pathway Roadmap' },
      { id: 'alt_roadmap', page: 52, label: 'Strategic Alternative Roadmap' },
      { id: 'study_abroad', page: 53, label: 'Personalized Study Abroad', quickJumpLabel: '✈ Study Abroad' },
      { id: 'academic_roadmap', page: 54, label: 'Academic & Profile Roadmap' },
      { id: 'action_plan', page: 55, label: 'Student Action Plan', quickJumpLabel: '✓ Action Plan' },
      { id: 'conclusion', page: 56, label: 'Report Conclusion & Advisory' },
    ]
  },
];

export const EXECUTIVE_REPORT_SECTIONS: NavGroup[] = [
  {
    id: 'exec_front', title: 'Executive Overview', icon: '⭐',
    items: [
      { id: 'exec_cover', page: 1, label: 'Executive Cover & Snapshot' },
      { id: 'exec_diag', page: 2, label: 'Diagnostic Snapshot' },
      { id: 'exec_synthesis', page: 3, label: 'Profile Synthesis' },
    ]
  },
  {
    id: 'exec_family', title: 'Family Alignment', icon: '👨‍👩‍👦',
    items: [
      { id: 'exec_family_overview', page: 4, label: 'Student–Parent Overview', quickJumpLabel: '♟ Family Alignment' },
      { id: 'exec_family_comparison', page: 5, label: 'Detailed 7-Domain Comparison' },
      { id: 'exec_family_action', page: 6, label: 'Family Career Action Plan' },
    ]
  },
  {
    id: 'exec_analysis', title: 'Advanced Analysis', icon: '🎯',
    items: [
      { id: 'exec_fitment', page: 7, label: 'Fitment × Execution Readiness' },
      { id: 'exec_cross_val', page: 8, label: 'Profile Cross-Validation' },
      { id: 'exec_dev', page: 9, label: 'Developmental Priorities' },
    ]
  },
  {
    id: 'exec_roadmaps', title: 'Career Roadmaps', icon: '🗺️',
    items: [
      { id: 'exec_pathways', page: 10, label: 'Recommended Pathways', quickJumpLabel: '★ Recommended Pathways' },
      { id: 'exec_primary_rm', page: 11, label: 'Primary Pathway Roadmap', quickJumpLabel: '◈ Primary Roadmap' },
      { id: 'exec_secondary_rm', page: 12, label: 'Secondary Pathway Roadmap' },
      { id: 'exec_alt_rm', page: 13, label: 'Strategic Alternative Roadmap' },
      { id: 'exec_study_abroad', page: 14, label: 'Personalized Study Abroad', quickJumpLabel: '✈ Study Abroad' },
      { id: 'exec_action_plan', page: 15, label: 'Academic Roadmap & Action Plan', quickJumpLabel: '✓ Action Plan' },
    ]
  },
];

/* ────────────────────────────────────────────────────────────
   Brand Colors (inline — no Tailwind dependency)
   ──────────────────────────────────────────────────────────── */
const C = {
  maroon: '#690B1B',
  maroonDark: '#4A0E17',
  maroonLight: 'rgba(105, 11, 27, 0.08)',
  maroonTint: 'rgba(105, 11, 27, 0.12)',
  gold: '#C9A55D',
  goldLight: '#D4AF37',
  goldTint: 'rgba(201, 165, 93, 0.15)',
  cream: '#FAF8F5',
  white: '#ffffff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate900: '#0f172a',
};

/* ────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────── */

interface ReportNavigationSidebarProps {
  mode: 'full' | 'executive';
  viewerRole?: 'student' | 'counsellor' | 'admin';
  studentName?: string;
  studentGrade?: string;
  reportId?: string;
  activePage?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSelectPage: (pageNumber: number) => void;
  onSwitchMode?: (mode: 'full' | 'executive') => void;
}

export default function ReportNavigationSidebar({
  mode,
  viewerRole = 'counsellor',
  studentName = 'Candidate',
  studentGrade = 'Class 10',
  reportId = 'AS-10-EXECUTIVE',
  activePage = 1,
  isCollapsed = false,
  onToggleCollapse,
  onSelectPage,
}: ReportNavigationSidebarProps) {
  const isFull = mode === 'full';
  const totalPages = isFull ? 56 : 15;
  const groups = isFull ? FULL_REPORT_SECTIONS : EXECUTIVE_REPORT_SECTIONS;

  // ── Auto-expand the group containing the active page ──
  const activeGroupId = useMemo(() => {
    for (const g of groups) {
      if (g.items.some(item => item.page === activePage)) return g.id;
    }
    return groups[0]?.id || '';
  }, [groups, activePage]);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // When active group changes, auto-expand it
  useEffect(() => {
    setExpandedGroups(prev => {
      const next = { ...prev };
      // Collapse all, expand active
      for (const g of groups) {
        next[g.id] = g.id === activeGroupId;
      }
      return next;
    });
  }, [activeGroupId, groups]);

  // When mode changes, reset
  useEffect(() => {
    const init: Record<string, boolean> = {};
    groups.forEach(g => { init[g.id] = false; });
    if (groups[0]) init[groups[0].id] = true;
    setExpandedGroups(init);
  }, [mode]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleGroupClick = (group: NavGroup) => {
    toggleGroup(group.id);
    if (group.items.length > 0) {
      onSelectPage(group.items[0].page);
    }
  };

  const progressPercent = Math.min(100, Math.max(0, Math.round((activePage / totalPages) * 100)));

  // Extract quick jump items
  const quickJumpItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [];
    groups.forEach(g => {
      g.items.forEach(item => {
        if (item.quickJumpLabel) items.push(item);
      });
    });
    return items;
  }, [groups]);

  if (isCollapsed) {
    return (
      <div style={{
        width: '64px', height: '100%', display: 'flex', flexDirection: 'column',
        background: C.white, overflow: 'hidden',
      }}>
        {/* Collapse toggle */}
        <div style={{
          padding: '12px 0', display: 'flex', justifyContent: 'center',
          borderBottom: `1px solid ${C.slate200}`,
        }}>
          <button
            onClick={onToggleCollapse}
            title="Expand Navigation"
            style={{
              width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${C.slate200}`,
              background: C.slate50, cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '14px', color: C.slate500,
              transition: 'all 0.2s',
            }}
          >
            ▶
          </button>
        </div>
        {/* Collapsed group icons */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {groups.map(g => {
            const hasActiveChild = g.items.some(item => item.page === activePage);
            return (
              <div
                key={g.id}
                title={g.title}
                onClick={() => {
                  const firstPage = g.items[0]?.page;
                  if (firstPage) onSelectPage(firstPage);
                }}
                style={{
                  width: '40px', height: '40px', margin: '2px auto', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', cursor: 'pointer', transition: 'all 0.15s',
                  background: hasActiveChild ? C.maroonLight : 'transparent',
                  border: hasActiveChild ? `1.5px solid ${C.maroon}` : '1.5px solid transparent',
                }}
              >
                {g.icon}
              </div>
            );
          })}
        </div>
        {/* Collapsed page indicator */}
        <div style={{
          padding: '8px', borderTop: `1px solid ${C.slate200}`,
          textAlign: 'center', fontSize: '9px', fontWeight: 700, color: C.maroon,
          fontFamily: 'monospace',
        }}>
          {activePage}/{totalPages}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '280px', height: '100%', display: 'flex', flexDirection: 'column',
      background: C.white, overflow: 'hidden', fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* ── TOP HEADER ── */}
      <div style={{
        padding: '14px 16px 12px', borderBottom: `1px solid ${C.slate200}`,
        background: `linear-gradient(180deg, ${C.cream} 0%, ${C.white} 100%)`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ overflow: 'hidden' }}>
            {viewerRole !== 'student' && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '2px 7px', borderRadius: '4px', background: C.maroon,
                color: C.white, fontSize: '8.5px', fontWeight: 800, letterSpacing: '0.6px',
                textTransform: 'uppercase', marginBottom: '4px',
              }}>
                🛡️ COUNSELLOR VIEW
              </div>
            )}
            <span style={{
              fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' as const,
              letterSpacing: '1px', color: C.gold, display: 'block',
            }}>
              {isFull ? 'FULL DIAGNOSTIC REPORT' : 'EXECUTIVE CAREER EDITION'}
            </span>
            <h3 style={{
              fontSize: '14px', fontWeight: 800, color: C.slate900, margin: '2px 0 0',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
            }}>
              {studentName}
            </h3>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px',
              color: C.slate500, fontWeight: 500, marginTop: '2px',
            }}>
              <span>{studentGrade}</span>
              <span>•</span>
              <span style={{ fontFamily: 'monospace', fontSize: '9px' }}>{reportId}</span>
            </div>
          </div>
          <button
            onClick={onToggleCollapse}
            title="Collapse Sidebar"
            style={{
              width: '28px', height: '28px', borderRadius: '6px', border: `1px solid ${C.slate200}`,
              background: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '11px', color: C.slate500, flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            ◀
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '10px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: '9px', fontWeight: 700, marginBottom: '4px',
          }}>
            <span style={{ color: C.slate400, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
              Reading Progress
            </span>
            <span style={{ fontFamily: 'monospace', color: C.maroon }}>
              Page {activePage} / {totalPages} ({progressPercent}%)
            </span>
          </div>
          <div style={{
            width: '100%', height: '5px', borderRadius: '10px', overflow: 'hidden',
            background: C.slate100, border: `1px solid ${C.slate200}`,
          }}>
            <div style={{
              height: '100%', borderRadius: '10px', transition: 'width 0.3s ease',
              background: `linear-gradient(90deg, ${C.maroon}, ${C.gold})`,
              width: `${progressPercent}%`,
            }} />
          </div>
        </div>
      </div>

      {/* ── NAVIGATION TREE (scrollable) ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '10px 8px',
      }}>
        {groups.map(group => {
          const isExpanded = expandedGroups[group.id] ?? false;
          const hasActiveChild = group.items.some(item => item.page === activePage);

          return (
            <div key={group.id} style={{ marginBottom: '4px' }}>
              {/* Group Header */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleGroupClick(group); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '6px 10px',
                  borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 700, transition: 'all 0.15s',
                  background: hasActiveChild ? C.maroonLight : 'transparent',
                  color: hasActiveChild ? C.maroon : C.slate700,
                  borderLeft: hasActiveChild ? `3px solid ${C.maroon}` : '3px solid transparent',
                }}
              >
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                }}>
                  <span style={{ fontSize: '13px', flexShrink: 0 }}>{group.icon}</span>
                  <span>{group.title}</span>
                </span>
                <span style={{
                  fontSize: '9px', color: C.slate400, flexShrink: 0,
                  transform: isExpanded ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.15s',
                }}>
                  ▶
                </span>
              </button>

              {/* Group Items */}
              {isExpanded && (
                <div style={{
                  marginLeft: '18px', borderLeft: `2px solid ${C.slate100}`,
                  paddingLeft: '0', marginTop: '2px',
                }}>
                  {group.items.map(item => {
                    const isActive = item.page === activePage;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelectPage(item.page); }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between', padding: '4px 10px',
                          borderRadius: '6px', border: 'none', cursor: 'pointer',
                          fontSize: '10.5px', fontWeight: isActive ? 800 : 500,
                          transition: 'all 0.15s', textAlign: 'left' as const,
                          background: isActive ? C.maroonTint : 'transparent',
                          color: isActive ? C.maroon : C.slate600,
                          borderLeft: isActive ? `2px solid ${C.maroon}` : '2px solid transparent',
                          marginLeft: '-2px',
                        }}
                      >
                        <span style={{
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap' as const, flex: 1,
                        }}>
                          {item.label}
                        </span>
                        <span style={{
                          fontSize: '9px', fontFamily: 'monospace', marginLeft: '8px',
                          color: isActive ? C.maroon : C.slate400, fontWeight: isActive ? 700 : 400,
                          flexShrink: 0,
                        }}>
                          {String(item.page).padStart(2, '0')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── QUICK JUMP BAR ── */}
      <div style={{
        padding: '10px 12px', borderTop: `1px solid ${C.slate200}`,
        background: C.slate50, flexShrink: 0,
      }}>
        <span style={{
          fontSize: '9px', fontWeight: 800, color: C.maroon,
          textTransform: 'uppercase' as const, letterSpacing: '0.8px',
          display: 'block', paddingBottom: '6px', borderBottom: `1px solid ${C.slate200}`,
          marginBottom: '6px',
        }}>
          ⚡ Counsellor Quick Jump
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {quickJumpItems.map(item => {
            const isActive = activePage === item.page;
            return (
              <button
                type="button"
                key={`qj-${item.id}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelectPage(item.page); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '4px 8px', borderRadius: '5px', cursor: 'pointer',
                  fontSize: '10px', fontWeight: 700, textAlign: 'left' as const,
                  transition: 'all 0.15s',
                  background: isActive ? C.maroon : C.white,
                  color: isActive ? C.white : C.slate700,
                  boxShadow: isActive ? '0 1px 3px rgba(105,11,27,0.3)' : 'none',
                  border: isActive ? `1px solid ${C.maroon}` : `1px solid ${C.slate200}`,
                }}
              >
                <span>{item.quickJumpLabel}</span>
                <span style={{
                  fontFamily: 'monospace', fontSize: '8.5px',
                  opacity: 0.8,
                }}>
                  P.{item.page}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
