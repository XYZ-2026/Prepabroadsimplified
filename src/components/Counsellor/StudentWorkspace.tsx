'use client';

import React, { useState } from 'react';
import StudentProfileView, { StudentProfileData } from '@/components/Profile/StudentProfileView';
import OverrideLockButton from './OverrideLockButton';
import ReportViewerShell from '@/components/Report/ReportViewerShell';
import { buildClass10ExecutiveHTMLReport } from '@/app/(main)/psychometric-test/class10_html_report_builder';
import { buildClass10ExecutiveSummaryHTMLReport } from '@/app/(main)/psychometric-test/class10_executive_summary_builder';
import type { EditorialStudent, EditorialScores } from '@/app/(main)/psychometric-test/class10_editorial_engine';

export interface StudentData extends StudentProfileData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  studentType: string;
  state: string;
  city: string;
  createdAtStr: string;
}

export interface IQResult {
  id: string;
  userId: string;
  iqScore: number;
  percentile: number;
  tier: string;
  strength: string;
  cognitivePersona: string;
  domains: { category: string; correct: number; total: number; percentage: number }[];
  createdAt: string;
  type: 'iq';
}

export interface PsychometricResult {
  id: string;
  userId: string;
  testName: string;
  scores: any;
  createdAt: string;
  workflowState?: string;
  type: 'psychometric';
}

interface StudentWorkspaceProps {
  student: StudentData;
  iqResults: IQResult[];
  psychoResults: PsychometricResult[];
  onBack: () => void;
}

export default function StudentWorkspace({
  student,
  iqResults,
  psychoResults,
  onBack,
}: StudentWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'reports' | 'iq' | 'notes' | 'workflow'>('reports');
  const [previewMode, setPreviewMode] = useState<'full' | 'executive' | null>(null);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<'full' | 'executive' | null>(null);

  // Counsellor Notes State
  const [noteText, setNoteText] = useState('');
  const [noteStatus, setNoteStatus] = useState('');

  // Workflow State
  const [streamDecision, setStreamDecision] = useState('Not Discussed');
  const [careerDirection, setCareerDirection] = useState('Exploration');
  const [familyDiscussion, setFamilyDiscussion] = useState('Pending');
  const [nextAction, setNextAction] = useState('');

  const studentPsycho = psychoResults.filter(r => r.userId === student.id);
  const studentIQ = iqResults.filter(r => r.userId === student.id);
  const latestPsycho = studentPsycho[0] || null;

  // Handle PDF Download directly via POST API
  const handleDownloadPDF = async (reportType: 'full' | 'executive', resultId?: string) => {
    const targetResultId = resultId || latestPsycho?.id || '';
    if (!targetResultId) {
      alert('No assessment result found to generate PDF');
      return;
    }
    setIsDownloading(reportType);
    try {
      const res = await fetch('/api/psychometric-test/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId: targetResultId,
          reportType: reportType,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = reportType === 'executive'
        ? `${student.name.replace(/\s+/g, '_')}_Class10_Executive_Career_Summary.pdf`
        : `${student.name.replace(/\s+/g, '_')}_Class10_Full_Psychometric_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Download error:', e);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(null);
    }
  };

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setNoteStatus('Saving...');
    try {
      const res = await fetch('/api/counsellor/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, note: noteText }),
      });
      if (res.ok) {
        setNoteStatus('Note saved!');
        setNoteText('');
        setTimeout(() => setNoteStatus(''), 2500);
      } else {
        setNoteStatus('Failed to save');
      }
    } catch {
      setNoteStatus('Error saving note');
    }
  };

  // If in Preview Mode, render full ReportViewerShell
  if (previewMode && latestPsycho) {
    const editorialStudent: EditorialStudent = {
      name: student.name || 'Candidate',
      grade: 'Class 10',
      age: '15',
      school: student.currentSchool || '',
      city: student.city || 'India',
      stream: '',
      email: student.email || '',
      date: student.createdAtStr || new Date().toLocaleDateString(),
      reportId: `AS-10-${(latestPsycho.id || '100000').substring(0, 6).toUpperCase()}`,
      parentName: '',
    };

    const scores: EditorialScores = {
      aptitude: {
        verbal: latestPsycho.scores?.aptitude?.verbal || 75,
        numerical: latestPsycho.scores?.aptitude?.numerical || 78,
        reasoning: latestPsycho.scores?.aptitude?.reasoning || 80,
        spatial: latestPsycho.scores?.aptitude?.spatial || 74,
        overall: latestPsycho.scores?.aptitude?.overall || 77,
      },
      personality: {
        openness: latestPsycho.scores?.personality?.openness || 75,
        conscientiousness: latestPsycho.scores?.personality?.conscientiousness || 76,
        extraversion: latestPsycho.scores?.personality?.extraversion || 68,
        agreeableness: latestPsycho.scores?.personality?.agreeableness || 74,
        emotionalStability: latestPsycho.scores?.personality?.emotionalStability || 70,
      },
      topRiasec: latestPsycho.scores?.topRiasec || ['Investigative', 'Realistic', 'Artistic'],
      riasec: latestPsycho.scores?.riasec || {},
      topVark: latestPsycho.scores?.topVark || 'V',
      vark: latestPsycho.scores?.vark || {},
      topValues: ['Autonomy', 'Mastery', 'Purpose'],
      careerFitment: latestPsycho.scores?.careerFitment || [
        { name: 'STEM & Engineering Pathway', score: 95 },
        { name: 'Data Science & Analytical Computing', score: 92 },
      ],
    };

    const personalization = {
      executiveSummary: '',
      strengths: [],
      growthAreas: [],
    };

    const currentReportHtml = previewMode === 'executive'
      ? buildClass10ExecutiveSummaryHTMLReport(editorialStudent, scores, personalization, null, null)
      : buildClass10ExecutiveHTMLReport(editorialStudent, scores, personalization, null, null);

    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: '#fff' }}>
        <ReportViewerShell
          reportHtml={currentReportHtml}
          mode={previewMode}
          studentName={student.name}
          studentGrade="Class 10"
          reportId={editorialStudent.reportId}
          onSwitchMode={(newMode) => setPreviewMode(newMode)}
          onDownloadFull={() => handleDownloadPDF('full')}
          onDownloadSummary={() => handleDownloadPDF('executive')}
          backHref="#"
          backLabel="Back to Student Workspace"
        />
        {/* Close Button Floating Override */}
        <button
          onClick={() => setPreviewMode(null)}
          style={{
            position: 'fixed',
            top: '12px',
            left: '20px',
            zIndex: 101,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '10px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            color: '#334155',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          ← Exit Preview
        </button>
      </div>
    );
  }

  const isParentCompleted = latestPsycho?.workflowState === 'report_unlocked';

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Navigation Topbar */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            color: '#690b1b',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Allotted Students
        </button>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Counsellor Workspace · <strong>{student.name}</strong>
        </span>
      </div>

      {/* Hero Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #690B1B 0%, #4A0E17 100%)',
        color: '#ffffff',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '28px',
        boxShadow: '0 8px 30px rgba(105, 11, 27, 0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          zIndex: 10,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>{student.name}</h1>
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(201, 165, 93, 0.25)',
                color: '#FFEAA7',
                border: '1px solid rgba(201, 165, 93, 0.4)',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
                {student.studentType || 'Class 10 Student'}
              </span>
            </div>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px', lineHeight: 1.6 }}>
              ✉ {student.email} &nbsp;·&nbsp; 📞 {student.mobile || 'No phone'} &nbsp;·&nbsp; 📍 {student.city}{student.city && student.state ? ', ' : ''}{student.state}
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '14px', fontSize: '12.5px', opacity: 0.85 }}>
              <span>Assigned Counsellor: <strong>{student.counsellorName || 'Assigned Staff'}</strong></span>
              <span>Joined: {student.createdAtStr}</span>
            </div>
          </div>

          {/* Report Quick Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
            {latestPsycho && (
              <>
                <button
                  onClick={() => setPreviewMode('full')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px 18px', borderRadius: '10px', background: '#ffffff',
                    color: '#690B1B', fontWeight: 800, fontSize: '12px', border: 'none',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  👁 Preview Full Report (56P)
                </button>
                <button
                  onClick={() => setPreviewMode('executive')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px 18px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #FAF8F5 0%, #FFFFFF 100%)',
                    color: '#690B1B', fontWeight: 800, fontSize: '12px',
                    border: '1.5px solid #C9A55D', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(201,165,93,0.2)',
                  }}
                >
                  ⭐ Preview Executive Summary (15P)
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => handleDownloadPDF('full')}
                    disabled={isDownloading === 'full'}
                    style={{
                      padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)',
                      color: '#ffffff', fontWeight: 700, fontSize: '11px', border: '1px solid rgba(255,255,255,0.3)',
                      cursor: 'pointer', textAlign: 'center',
                    }}
                  >
                    {isDownloading === 'full' ? 'Generating...' : '📥 Full PDF'}
                  </button>
                  <button
                    onClick={() => handleDownloadPDF('executive')}
                    disabled={isDownloading === 'executive'}
                    style={{
                      padding: '8px 12px', borderRadius: '8px', background: 'rgba(201, 165, 93, 0.25)',
                      color: '#FFEAA7', fontWeight: 700, fontSize: '11px', border: '1px solid rgba(201, 165, 93, 0.4)',
                      cursor: 'pointer', textAlign: 'center',
                    }}
                  >
                    {isDownloading === 'executive' ? 'Generating...' : '📥 Summary PDF'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Psychometric Assessment</span>
          <div style={{ fontSize: '15px', fontWeight: 800, color: latestPsycho ? '#059669' : '#d97706', marginTop: '4px' }}>
            {latestPsycho ? '✓ Completed' : '⌛ Pending'}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Parent Assessment</span>
          <div style={{ fontSize: '15px', fontWeight: 800, color: isParentCompleted ? '#059669' : '#d97706', marginTop: '4px' }}>
            {isParentCompleted ? '✓ Completed & Aligned' : '⏳ Pending Input'}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>IQ Assessment</span>
          <div style={{ fontSize: '15px', fontWeight: 800, color: studentIQ.length > 0 ? '#2563eb' : '#64748b', marginTop: '4px' }}>
            {studentIQ.length > 0 ? `✓ Attempted (${studentIQ[0].iqScore} IQ)` : 'Not Taken'}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Report Snapshot Status</span>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#690B1B', marginTop: '4px' }}>
            Saved Snapshot (0 Groq)
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{
        display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0',
        marginBottom: '24px', background: '#fff', padding: '8px 16px 0',
        borderRadius: '14px 14px 0 0', overflowX: 'auto',
      }}>
        {[
          { key: 'reports', label: '🧭 Assessment & Reports' },
          { key: 'workflow', label: '🎯 Counsellor Workflow' },
          { key: 'notes', label: '📝 Private Notes' },
          { key: 'profile', label: '📋 Profile & Background' },
          { key: 'iq', label: '🧠 IQ History' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            style={{
              padding: '12px 20px', border: 'none', background: 'none',
              cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === t.key ? 800 : 600,
              color: activeTab === t.key ? '#690B1B' : '#64748b',
              borderBottom: activeTab === t.key ? '3px solid #690B1B' : '3px solid transparent',
              transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'reports' && (
          <div>
            {!latestPsycho ? (
              <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                No psychometric assessment has been submitted yet by this student.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <div style={{ padding: '28px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Class 10 Psychometric Assessment</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Submitted snapshot · 56-Page Diagnostic & 15-Page Executive Edition ready</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => setPreviewMode('full')}
                        style={{
                          padding: '10px 18px', background: '#690B1B', color: '#fff',
                          borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '13px',
                          cursor: 'pointer', boxShadow: '0 2px 6px rgba(105,11,27,0.25)',
                        }}
                      >
                        Launch Interactive Report Viewer ↗
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '20px' }}>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Aptitude Overall</span>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#690B1B', marginTop: '4px' }}>
                        {latestPsycho.scores?.aptitude?.overall || 77}%
                      </div>
                    </div>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Primary RIASEC</span>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                        {Array.isArray(latestPsycho.scores?.topRiasec) ? latestPsycho.scores.topRiasec.join('-') : 'Investigative'}
                      </div>
                    </div>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Learning Style</span>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                        {latestPsycho.scores?.topVark || 'Visual'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workflow' && (
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Counselling Decision &amp; Workflow Tracker</h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '24px' }}>Track student progress through counselling stages. (Note: Workflow states do NOT mutate psychometric assessment data).</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>Class 11 Stream Decision</label>
                <select
                  value={streamDecision}
                  onChange={(e) => setStreamDecision(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#f8fafc' }}
                >
                  <option value="Not Discussed">Not Discussed</option>
                  <option value="Exploration">In Exploration</option>
                  <option value="Shortlisting">Shortlisted Tracks</option>
                  <option value="Finalized">Finalized (PCM / PCB / Commerce / Humanities)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>Career Direction Status</label>
                <select
                  value={careerDirection}
                  onChange={(e) => setCareerDirection(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#f8fafc' }}
                >
                  <option value="Exploration">Broad Exploration</option>
                  <option value="Validation">Domain Validation</option>
                  <option value="Decision Ready">Decision Ready</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>Parent Discussion Status</label>
                <select
                  value={familyDiscussion}
                  onChange={(e) => setFamilyDiscussion(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#f8fafc' }}
                >
                  <option value="Pending">Pending Discussion</option>
                  <option value="Scheduled">Meeting Scheduled</option>
                  <option value="Completed">Completed &amp; Aligned</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>Agreed Next Action Items</label>
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="e.g. Schedule family follow-up call on Tuesday; review JEE/NEET foundational coaching options..."
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#f8fafc' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Counsellor Private Observations</h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '20px' }}>Private notes strictly for counsellors and staff. Does not modify student report data.</p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Record observation notes, parent conversation highlights, student aspirations..."
              style={{
                width: '100%', minHeight: '180px', padding: '20px', borderRadius: '12px',
                border: '1px solid #cbd5e1', fontSize: '14.5px', lineHeight: 1.6, fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 600, color: noteStatus === 'Note saved!' ? '#059669' : '#64748b' }}>{noteStatus}</span>
              <button
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                style={{
                  padding: '12px 28px', borderRadius: '10px', border: 'none',
                  background: noteText.trim() ? '#690B1B' : '#cbd5e1', color: '#fff',
                  fontWeight: 700, cursor: noteText.trim() ? 'pointer' : 'default', fontSize: '14px',
                }}
              >
                Save Counsellor Note
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <StudentProfileView student={student} hideHeaderTitle={true} />
        )}

        {activeTab === 'iq' && (
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            {studentIQ.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No IQ test attempts recorded for this student.</div>
            ) : (
              studentIQ.map((res, i) => (
                <div key={res.id} style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>IQ Attempt #{i + 1}</h4>
                    <span style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb' }}>{res.iqScore} IQ</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
