import React from 'react';
import { Users, TrendingUp, AlertCircle, CheckCircle2, Info, BookOpen } from 'lucide-react';

interface FamilyInsightsProps {
  comparison: {
    areas?: any[];
    overallAlignment?: number;
    overallIndicator?: string;
    parentAspiration?: string;
    parentFinancial?: string;
    aiInterpretation?: string;
  };
}

export default function FamilyInsights({ comparison }: FamilyInsightsProps) {
  const [aiText, setAiText] = React.useState<string | null>(comparison?.aiInterpretation || null);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  if (!comparison) return null;

  const areas = Array.isArray(comparison.areas) ? comparison.areas : [];
  
  // Calculate or extract numeric overall alignment
  let overallAlignment = 75;
  if (typeof comparison.overallAlignment === 'number') {
    overallAlignment = comparison.overallAlignment;
  } else if (comparison.overallIndicator) {
    if (comparison.overallIndicator.includes('Strong')) overallAlignment = 85;
    else if (comparison.overallIndicator.includes('Significant')) overallAlignment = 45;
    else overallAlignment = 65;
  }

  // Determine alignment label & color
  let alignmentLabel = "Strong Alignment";
  let alignmentColor = "#10b981"; // green
  if (overallAlignment < 50) {
    alignmentLabel = "Significant Discussion Recommended";
    alignmentColor = "#ef4444"; // red
  } else if (overallAlignment < 75) {
    alignmentLabel = "Moderate Alignment";
    alignmentColor = "#f59e0b"; // orange
  }

  // Safely extract financial and aspiration text
  const financialArea = areas.find((a: any) => a.id === 'financial_feasibility' || a.area === 'financial');
  const parentFinancial = comparison.parentFinancial || financialArea?.parentSide || financialArea?.explanation || "Standard financial planning recommended.";

  const aspirationArea = areas.find((a: any) => a.id === 'career_direction' || a.area === 'aspiration');
  const parentAspiration = comparison.parentAspiration || aspirationArea?.parentSide || aspirationArea?.explanation || "Open to exploring paths.";

  // Extract or build deterministic consensus narrative
  const consensusNarrative = comparison?.aiInterpretation || 
    `Based on the diagnostic evaluation, the student and parent demonstrate an overall alignment of ${Math.round(overallAlignment)}% (${alignmentLabel}). Both parties share core educational aspirations, while specific planning discussions around financial expectations and career pathways will help harmonize future decisions. Open communication around Class 11 stream choices and long-term career milestones is highly recommended to maintain positive momentum.`;

  const hasLoanConstraint = (parentFinancial || '').toLowerCase().includes('loan') || (parentFinancial || '').toLowerCase().includes('scholarship');

  return (
    <div className="as-section no-break" style={{ marginBottom: '2rem' }}>
      <div className="as-section-header">
        <Users className="as-section-icon" style={{ color: '#8b5cf6' }} />
        <h2 className="as-section-title">Family Insights & Alignment</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Alignment Score Card */}
        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: alignmentColor, lineHeight: 1 }}>
            {Math.round(overallAlignment)}%
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', marginTop: '0.5rem' }}>
            {alignmentLabel}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Overall agreement between student profile and parent expectations
          </p>
        </div>

        {/* Key Dimensions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {areas.slice(0, 4).map((area: any, i: number) => {
            const areaName = area.name || area.area || 'Dimension';
            const scoreVal = typeof area.alignmentScore === 'number' 
              ? `${Math.round(area.alignmentScore)}% Match` 
              : (area.level ? area.level.replace('_', ' ') : 'Aligned');
            const isHighMatch = area.alignmentScore > 70 || area.level === 'high_alignment' || area.level === 'aligned';
            const isLowMatch = area.alignmentScore < 40 || area.level === 'significant_gap' || area.level === 'constraint';
            
            return (
              <div key={i} style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                    {areaName}
                  </span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    background: isHighMatch ? '#dcfce7' : isLowMatch ? '#fee2e2' : '#fef3c7',
                    color: isHighMatch ? '#166534' : isLowMatch ? '#991b1b' : '#92400e',
                    textTransform: 'capitalize'
                  }}>
                    {scoreVal}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  {area.explanation || area.interpretation || area.discussionTopic || ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured Planning Gaps */}
      <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertCircle size={20} style={{ color: '#f59e0b' }} />
        Planning Discussions
      </h3>
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        
        {/* Financial */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
              <TrendingUp size={20} style={{ color: '#475569' }} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#334155' }}>Financial Preparedness</h4>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                Parent Observation: <strong>{parentFinancial}</strong>. 
                {hasLoanConstraint ? " Explore education loans and scholarships." : " Financial planning aligns with preferred educational pathways."}
              </p>
            </div>
          </div>
        </div>

        {/* Aspiration */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
              <BookOpen size={20} style={{ color: '#475569' }} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#334155' }}>Educational & Career Aspirations</h4>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                Parent Observation: <strong>{parentAspiration}</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* AI Consensus Narrative */}
      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          AI Family Consensus & Advisory
        </h3>
        <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {consensusNarrative}
        </p>
      </div>

    </div>
  );
}
