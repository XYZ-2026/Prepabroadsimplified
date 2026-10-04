'use client';

import React, { useState, useEffect } from 'react';
import { NodeIcon } from '@/components/CareerRoadmap/RoadmapIcons';
import { formatNodeTypeBadge } from '@/lib/career-roadmap-formatter';

export interface StartOptionItem {
  nextNodeId: string;
  nextNodeType: string;
  nextNodeName: string;
  edgeType?: string;
  condition?: string;
}

interface StartScreenProps {
  startOptions: StartOptionItem[];
  userGrade?: string | null;
  onSelectNode: (id: string, label?: string, type?: string) => void;
}

export function StartScreen({ startOptions, userGrade, onSelectNode }: StartScreenProps) {
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('career_roadmap_tip_dismissed');
      if (dismissed === 'true') {
        setShowTip(false);
      }
    } catch {}
  }, []);

  const handleDismissTip = () => {
    setShowTip(false);
    try {
      localStorage.setItem('career_roadmap_tip_dismissed', 'true');
    } catch {}
  };

  // Grade-based intelligent recommendation
  const normalizedGrade = (userGrade || '').trim().toLowerCase();
  const isSenior = normalizedGrade.includes('11') || normalizedGrade.includes('12') || normalizedGrade.includes('senior');
  const recommendedNodeId = isSenior ? 'LEVEL_002' : 'LEVEL_001';

  // Categorize the 19 start options from the production dataset
  // Academic Streams from 10th
  const academicStreamIds = new Set(['STREAM_001', 'STREAM_002', 'STREAM_003', 'LEVEL_002']);
  // Alternative & Vocational routes
  const alternativeRouteIds = new Set([
    'ROUTE_004', // Engineering Diploma
    'ROUTE_009', // ITI
    'ROUTE_007', // Fine Art / Commercial Art
    'ROUTE_008', // Art Teacher Diploma
    'ROUTE_010', // Dance / Music
    'ROUTE_011', // Building Supervisor
    'ROUTE_012', // Farm Management
    'ROUTE_013', // Medical Lab Technician (MLT)
    'ROUTE_014', // Various Diploma Courses
    'ROUTE_020', // MS-CIT Course
  ]);
  // Direct & Competitive exam routes
  const directCompetitiveIds = new Set([
    'REXAM_003', // Defence (Army/Navy/Air Force/Police)
    'REXAM_004', // Railway (T.C./Commercial Clerk)
    'REXAM_005', // Bank / Insurance Clerical
    'REXAM_006', // Govt Clerical Grade
    'CAREER_002', // L.I.C. Agent
  ]);

  const academicOptions = startOptions.filter(o => academicStreamIds.has(o.nextNodeId));
  const alternativeOptions = startOptions.filter(o => alternativeRouteIds.has(o.nextNodeId));
  const competitiveOptions = startOptions.filter(o => directCompetitiveIds.has(o.nextNodeId));

  // Catch any remaining start options so nothing in the dataset is ever omitted
  const otherOptions = startOptions.filter(
    o =>
      !academicStreamIds.has(o.nextNodeId) &&
      !alternativeRouteIds.has(o.nextNodeId) &&
      !directCompetitiveIds.has(o.nextNodeId)
  );

  return (
    <div className="startScreenContainer">
      {/* ── First-Use Help Tip Banner ── */}
      {showTip && (
        <div className="firstUseTipBanner" style={{ borderRadius: '10px', marginBottom: '24px' }}>
          <div className="firstUseTipContent">
            <span style={{ fontSize: '16px' }}>💡</span>
            <span>
              <strong>How Roadmap Studio works:</strong> Choose your current stage or target stream to begin. Every step opens the next verified academic degrees, competitive exams, colleges, and career destinations.
            </span>
          </div>
          <button className="firstUseTipClose" onClick={handleDismissTip} title="Dismiss tip">
            ✕ Got it
          </button>
        </div>
      )}

      {/* ── Hero Section ── */}
      <div className="startHero">
        <span className="startHeroBadge">Interactive Career Map</span>
        <h1 className="startHeroTitle">Build your career path step by step</h1>
        <p className="startHeroSubtitle">
          Explore structured pathways from secondary school to professional degrees, competitive exams, and long-term career destinations.
        </p>
      </div>

      {/* ── Primary Level Selection (10th vs 12th) ── */}
      <div className="primaryStageSection">
        <div className="primaryStageHeader">
          <h2 className="primaryStageTitle">Where are you starting from?</h2>
          {userGrade && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--roadmap-primary)' }}>
              Based on your profile ({userGrade})
            </span>
          )}
        </div>

        <div className="primaryStageGrid">
          {/* Class 10th Card */}
          <div
            className={`primaryStageCard ${recommendedNodeId === 'LEVEL_001' ? 'primaryStageCardRecommended' : ''}`}
            onClick={() => onSelectNode('LEVEL_001', '10th (Secondary School)', 'LEVEL')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div className="stageCardIconWrapper">
                  <NodeIcon type="LEVEL" size={20} className="text-crimson" />
                </div>
                {recommendedNodeId === 'LEVEL_001' && (
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'var(--roadmap-primary-light)', color: 'var(--roadmap-primary)' }}>
                    RECOMMENDED
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--roadmap-slate-900)', margin: '0 0 6px 0' }}>
                Class 10th (Secondary)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--roadmap-slate-600)', margin: 0, lineHeight: 1.5 }}>
                Start from 10th board completion. Explore Science, Commerce, Arts, 3-year Engineering Diplomas, ITI trades, or direct government recruitment.
              </p>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--roadmap-slate-500)' }}>
                19 Initial Pathways
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--roadmap-primary)' }}>
                Start from 10th →
              </span>
            </div>
          </div>

          {/* Class 12th Card */}
          <div
            className={`primaryStageCard ${recommendedNodeId === 'LEVEL_002' ? 'primaryStageCardRecommended' : ''}`}
            onClick={() => onSelectNode('LEVEL_002', '12th (Senior Secondary)', 'LEVEL')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div className="stageCardIconWrapper">
                  <NodeIcon type="LEVEL" size={20} className="text-crimson" />
                </div>
                {recommendedNodeId === 'LEVEL_002' && (
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'var(--roadmap-primary-light)', color: 'var(--roadmap-primary)' }}>
                    RECOMMENDED
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--roadmap-slate-900)', margin: '0 0 6px 0' }}>
                Class 12th (Senior Secondary)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--roadmap-slate-600)', margin: 0, lineHeight: 1.5 }}>
                Start from 12th / H.S.C. completion. Explore university undergraduate degrees, entrance examinations, professional certifications, and higher studies.
              </p>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--roadmap-slate-500)' }}>
                Degrees & Entrance Exams
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--roadmap-primary)' }}>
                Start from 12th →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category 1: Academic Streams (Direct Jump) ── */}
      <div className="startCategorySection" style={{ marginBottom: '32px' }}>
        <h2 className="startCategoryTitle">Academic Pathways</h2>
        <p className="startCategorySubtitle">
          Select an academic discipline to immediately inspect required subject combinations, degrees, and career outcomes.
        </p>

        <div className="startCategoryGrid">
          {academicOptions.map(opt => (
            <div
              key={opt.nextNodeId}
              className="startOptionCard"
              onClick={() => onSelectNode(opt.nextNodeId, opt.nextNodeName, opt.nextNodeType)}
            >
              <div className="startOptionCardIcon">
                <NodeIcon type={opt.nextNodeType} size={18} />
              </div>
              <div className="startOptionCardContent">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <h3 className="startOptionCardTitle">{opt.nextNodeName}</h3>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--roadmap-slate-400)', textTransform: 'uppercase' }}>
                    {formatNodeTypeBadge(opt.nextNodeType)}
                  </span>
                </div>
                <p className="startOptionCardDesc">
                  {opt.nextNodeName.includes('Science')
                    ? 'PCM, PCB, PCMB tracks leading to Engineering, Medicine, Research, and Computing.'
                    : opt.nextNodeName.includes('Commerce')
                    ? 'Accountancy, Finance, Economics, Business Management, CA, and Corporate Law.'
                    : opt.nextNodeName.includes('Arts')
                    ? 'Humanities, Psychology, Design, Journalism, Law, Public Policy, and Civil Services.'
                    : 'Senior secondary educational stream with undergraduate pathways.'}
                </p>
                <span className="startOptionCardAction">Explore stream →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category 2: Alternative & Vocational Routes ── */}
      <div className="startCategorySection" style={{ marginBottom: '32px' }}>
        <h2 className="startCategoryTitle">Alternative & Vocational Routes</h2>
        <p className="startCategorySubtitle">
          Polytechnic diplomas, industrial trade apprenticeships, applied design, and technical certifications.
        </p>

        <div className="startCategoryGrid">
          {alternativeOptions.map(opt => (
            <div
              key={opt.nextNodeId}
              className="startOptionCard"
              onClick={() => onSelectNode(opt.nextNodeId, opt.nextNodeName, opt.nextNodeType)}
            >
              <div className="startOptionCardIcon">
                <NodeIcon type={opt.nextNodeType} size={18} />
              </div>
              <div className="startOptionCardContent">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <h3 className="startOptionCardTitle">{opt.nextNodeName}</h3>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--roadmap-slate-400)', textTransform: 'uppercase' }}>
                    {formatNodeTypeBadge(opt.nextNodeType)}
                  </span>
                </div>
                <p className="startOptionCardDesc">
                  {opt.condition || 'Specialized diploma or technical training pathway with direct industry entry.'}
                </p>
                <span className="startOptionCardAction">Explore route →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category 3: Direct & Competitive Routes ── */}
      <div className="startCategorySection">
        <h2 className="startCategoryTitle">Direct & Competitive Entry Routes</h2>
        <p className="startCategorySubtitle">
          Government service recruitment examinations, armed forces entry, and specialized financial agency certifications.
        </p>

        <div className="startCategoryGrid">
          {competitiveOptions.map(opt => (
            <div
              key={opt.nextNodeId}
              className="startOptionCard"
              onClick={() => onSelectNode(opt.nextNodeId, opt.nextNodeName, opt.nextNodeType)}
            >
              <div className="startOptionCardIcon">
                <NodeIcon type={opt.nextNodeType} size={18} />
              </div>
              <div className="startOptionCardContent">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <h3 className="startOptionCardTitle">{opt.nextNodeName}</h3>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--roadmap-slate-400)', textTransform: 'uppercase' }}>
                    {formatNodeTypeBadge(opt.nextNodeType)}
                  </span>
                </div>
                <p className="startOptionCardDesc">
                  {opt.condition || 'Direct recruitment examination or public service agency route.'}
                </p>
                <span className="startOptionCardAction">Explore entry →</span>
              </div>
            </div>
          ))}

          {otherOptions.map(opt => (
            <div
              key={opt.nextNodeId}
              className="startOptionCard"
              onClick={() => onSelectNode(opt.nextNodeId, opt.nextNodeName, opt.nextNodeType)}
            >
              <div className="startOptionCardIcon">
                <NodeIcon type={opt.nextNodeType} size={18} />
              </div>
              <div className="startOptionCardContent">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <h3 className="startOptionCardTitle">{opt.nextNodeName}</h3>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--roadmap-slate-400)', textTransform: 'uppercase' }}>
                    {formatNodeTypeBadge(opt.nextNodeType)}
                  </span>
                </div>
                <p className="startOptionCardDesc">
                  {opt.condition || 'Recognized career route in master roadmap.'}
                </p>
                <span className="startOptionCardAction">Explore option →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
