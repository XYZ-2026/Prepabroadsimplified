'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Download, Sparkles, BrainCircuit, ChevronLeft, Award, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';
import { IQ_ASSESSMENT_CONFIG } from '@/config/iq-assessment.config';

export default function ResultDashboardClient({ 
  resultData, 
  resultId, 
  userName = '' 
}: { 
  resultData: any; 
  resultId: string; 
  userName?: string; 
}) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const {
    estimatedIQ = resultData.iqScore || 100,
    percentile = resultData.percentile || 50,
    cognitiveBand = resultData.tier || 'Average Cognitive Ability',
    rawScore = resultData.rawScore || 0,
    totalQuestions = 45,
    sectionScores = resultData.domains || [],
    strongestDomain = resultData.strength || 'Visual Pattern & Matrix Reasoning',
    developmentalDomain = resultData.weakness || 'Abstract Reasoning',
    cognitivePersona = resultData.cognitivePersona || 'The Strategic Thinker',
    insightsNarrative = resultData.insights || '',
    certificateId = resultData.certificateId || `SIMP-IQ-${resultId.toUpperCase().slice(0, 8)}`,
    completedAt = resultData.createdAt || new Date().toISOString()
  } = resultData;

  const candidateName = userName || resultData.userName || 'Candidate';

  const formatCategory = (str: string) => {
    if (!str) return '';
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Radar Chart Data
  const radarData = sectionScores.map((s: any) => ({
    subject: s.sectionName ? s.sectionName.split(' ')[0] : formatCategory(s.category).split(' ')[0],
    fullSubject: s.sectionName || formatCategory(s.category),
    A: s.percentage || 0,
    fullMark: 100,
  }));

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Programmatic direct PDF download route
      const downloadUrl = `/api/iq-test/pdf?resultId=${resultId}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${candidateName.replace(/[^a-zA-Z0-9]/g, '_')}_IQ_Assessment_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('[PDF Download Error]:', err);
      alert('Failed to download certificate. Please retry.');
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6fb] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link
            href="/iq-test"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#690b1b] bg-white px-3.5 py-2 rounded-xl border border-purple-100 shadow-sm w-fit"
          >
            <ChevronLeft className="w-4 h-4" /> Back to IQ Test Home
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/iq-test/instructions')}
              className="px-4 py-2.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className="w-4 h-4 text-purple-600" /> Retake Assessment
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-5 py-2.5 rounded-xl bg-[#690b1b] hover:bg-[#830e22] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#690b1b]/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Generating PDF...' : 'Download Certificate'}
            </button>
          </div>
        </div>

        {/* Hero Score Box */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 md:p-10 shadow-xl shadow-purple-900/5 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#690b1b]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left: Overall Score Card */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-purple-100 pb-6 lg:pb-0 lg:pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-[10px] font-extrabold text-[#690b1b] tracking-wider uppercase mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> 45-Item Cognitive Assessment
              </div>
              
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated IQ Score</span>
              <div className="text-6xl md:text-7xl font-display font-extrabold text-[#690b1b] tracking-tight mb-2">
                {estimatedIQ}
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-4">
                <Award className="w-4 h-4 text-amber-600" /> {cognitiveBand}
              </div>

              <p className="text-xs font-semibold text-slate-500 max-w-sm">
                Candidate: <strong className="text-slate-800 font-bold">{candidateName}</strong>
                <br />
                Performance Rank: <strong className="text-[#690b1b] font-bold">{percentile}th Percentile</strong>
              </p>
            </div>

            {/* Right: Key Domain Insights & Persona */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block mb-1">Cognitive Persona</span>
                  <span className="text-base font-display font-bold text-slate-900 block">{cognitivePersona}</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">Strongest Domain</span>
                  <span className="text-sm font-bold text-slate-900 block">{strongestDomain}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">Assessment Interpretation</span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                  {insightsNarrative}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Radar & Section Performance Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Radar Chart */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-purple-100 p-6 shadow-lg shadow-purple-900/5 flex flex-col justify-between">
            <h3 className="text-sm font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#690b1b]" /> Domain Balance Profile
            </h3>
            
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                  <Radar name="Cognitive Profile" dataKey="A" stroke="#690b1b" fill="#690b1b" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section Score Cards */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-purple-100 p-6 shadow-lg shadow-purple-900/5 flex flex-col justify-between">
            <h3 className="text-sm font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#690b1b]" /> 5-Domain Section Breakdown
            </h3>

            <div className="space-y-4">
              {sectionScores.map((sec: any, idx: number) => {
                const secName = sec.sectionName || formatCategory(sec.category);
                const pct = sec.percentage || 0;
                return (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{secName}</span>
                      <span className="font-extrabold text-[#690b1b]">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#690b1b] to-purple-600 rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Download Certificate Footer Banner */}
        <div className="bg-gradient-to-r from-[#690b1b] to-purple-950 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-purple-300 block mb-1">Official Document</span>
            <h4 className="text-2xl font-display font-extrabold mb-1">Cognitive Assessment Certificate</h4>
            <p className="text-xs text-purple-200 font-medium">Verification ID: {certificateId} • Issued by {IQ_ASSESSMENT_CONFIG.issuingOrganization}</p>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-6 py-3.5 rounded-2xl bg-white text-[#690b1b] hover:bg-slate-50 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-[#690b1b]" />
            {downloading ? 'Downloading...' : 'Download PDF Certificate'}
          </button>
        </div>

      </div>
    </div>
  );
}
