'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Download, Share2, Sparkles, BrainCircuit, Activity, ChevronLeft, Target } from 'lucide-react';

export default function ResultDashboardClient({ resultData, resultId, userName = '' }: { resultData: any, resultId: string, userName?: string }) {

  const {
    iqScore,
    percentile,
    tier,
    domains,
    insights,
    careers,
    totalEarned,
    totalMax,
    evaluatedAnswers,
    cognitivePersona,
    consistencyScore,
    difficultyBreakdown
  } = resultData;

  const attemptedCount = evaluatedAnswers
    ? evaluatedAnswers.filter((a: any) => a.userAnswer !== null).length
    : 60;
  const correctCount = evaluatedAnswers?.filter((a: any) => a.isCorrect).length || Math.floor((totalEarned/totalMax)*60);
  const incorrectCount = attemptedCount - correctCount;
  const unattemptedCount = 60 - attemptedCount;

  const formatCategory = (str: string) => {
    if (!str) return '';
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Format data for Radar Chart
  const radarData = domains.map((d: any) => ({
    subject: formatCategory(d.category).split(' ')[0], // short name
    fullSubject: formatCategory(d.category),
    A: d.percentage,
    fullMark: 100,
  }));

  const handleDownloadCertificate = async () => {
    const finalName = userName.trim() || 'Student';

    // Access jsPDF from the globally loaded script
    const jsPDF = (window as any).jspdf?.jsPDF;
    if (!jsPDF) {
      alert("PDF engine is still loading, please try again in a few seconds.");
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    
    // Simple Certificate Generation (You can expand this with an image template background later)
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(156, 16, 16);
    doc.setLineWidth(4);
    doc.rect(10, 10, 277, 190);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(156, 16, 16);
    doc.setFontSize(36);
    doc.text("Certificate of Cognitive Achievement", 148, 50, { align: 'center' });
    
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("This certifies that", 148, 70, { align: 'center' });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(28);
    doc.text(finalName, 148, 95, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`has achieved an Advanced IQ Score of ${iqScore}`, 148, 120, { align: 'center' });
    doc.text(`Cognitive Tier: ${tier} | National Percentile: ${percentile}th`, 148, 130, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text(`UUID: ${resultId}`, 148, 180, { align: 'center' });
    doc.text("Abroad Simplified Assessment Matrix", 148, 190, { align: 'center' });

    doc.save(`Abroad-Simplified-IQ-${finalName.replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative overflow-hidden">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="lazyOnload" />
      
      {/* Background accents */}
      <div className="absolute top-0 w-full h-[50vh] bg-gradient-to-b from-slate-200/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#9C1010]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-400/10 blur-[120px] pointer-events-none" />



      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-12 relative z-10 space-y-8">
        
        {/* Section 1: Cognitive Blueprint */}
        <div className="w-full bg-white rounded-[2rem] border border-white/40 p-1 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative backdrop-blur-xl">
          <div className="rounded-[1.75rem] border border-slate-100 bg-white/60 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#9C1010]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              {/* IQ Score Circle */}
              <div className="shrink-0 flex flex-col items-center justify-center w-48 h-48 rounded-full border border-slate-200/50 bg-white shadow-xl relative group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-slate-50 opacity-50" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#9C1010]/20 border-r-[#9C1010]/20 animate-spin-slow" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-3 rounded-full border border-slate-100 bg-white shadow-inner flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">IQ Score</span>
                  <span className="text-6xl font-display font-black text-slate-900 leading-none mb-1">{iqScore}</span>
                  <span className="text-[9px] font-bold text-white bg-[#9C1010] px-3 py-1 rounded-full uppercase tracking-widest mt-1 shadow-sm">{tier}</span>
                </div>
              </div>

              {/* Blueprint Details */}
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                  {cognitivePersona && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                      <Sparkles className="w-3.5 h-3.5" />
                      Persona: {cognitivePersona}
                    </div>
                  )}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#9C1010]/5 text-[#9C1010] rounded-lg text-[10px] font-bold uppercase tracking-wider border border-[#9C1010]/10">
                    <Activity className="w-3.5 h-3.5" />
                    National Percentile: {percentile}th Percentile
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 mb-3 tracking-tight">Your Cognitive Blueprint</h1>
                <p className="text-slate-500 mb-8 max-w-2xl text-sm md:text-base leading-relaxed">
                  Congratulations. You have completed our advanced student assessment. Your score places you in the <strong className="text-slate-800">{tier.toLowerCase()}</strong> tier. A complete analysis of your profile is unlocked below.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:border-slate-300">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Consistency Score</span>
                    <div className="text-2xl font-display font-black text-slate-800">{consistencyScore !== undefined ? consistencyScore : '--'}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:border-slate-300">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attempted</span>
                    <div className="text-2xl font-display font-black text-slate-800"><span className="text-slate-900">{attemptedCount}</span><span className="text-sm text-slate-400 ml-1">/ 60</span></div>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:border-emerald-200">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Correct</span>
                    <div className="text-2xl font-display font-black text-emerald-700">{correctCount}</div>
                  </div>
                  <div className="bg-red-50/50 border border-red-100/60 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:border-red-200">
                    <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest mb-1">Incorrect</span>
                    <div className="text-2xl font-display font-black text-[#9C1010]">{incorrectCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Footprint and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="bg-white rounded-[2rem] border border-white/40 p-1 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl h-[450px]">
             <div className="rounded-[1.75rem] border border-slate-100 bg-white/60 p-8 h-full flex flex-col relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9C1010]/0 via-[#9C1010]/20 to-[#9C1010]/0" />
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Target className="w-3.5 h-3.5 text-[#9C1010]" />
                 Cognitive Footprint
               </h3>
               <div className="flex-1 w-full min-h-0 -ml-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                     <PolarGrid stroke="#f1f5f9" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                     <Radar name="Score" dataKey="A" stroke="#9C1010" strokeWidth={2} fill="#9C1010" fillOpacity={0.15} />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
             </div>
          </div>

          {/* Domain Analysis */}
          <div className="bg-white rounded-[2rem] border border-white/40 p-1 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl h-[450px]">
            <div className="rounded-[1.75rem] border border-slate-100 bg-white/60 p-8 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-50/50 to-transparent pointer-events-none" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Activity className="w-3.5 h-3.5 text-[#9C1010]" />
                 Domain Analysis
              </h3>
              <div className="flex-1 flex flex-col justify-between relative z-10 space-y-4">
                {domains.map((domain: any) => (
                  <div key={domain.category} className="group">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-black transition-colors">{formatCategory(domain.category)}</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">{domain.percentage}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-[#9C1010] to-[#d62828] h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_8px_rgba(156,16,16,0.5)]" 
                        style={{ width: `${Math.min(100, domain.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2.5: Complexity Analysis */}
        {difficultyBreakdown && (
          <div className="bg-white rounded-[2rem] border border-white/40 p-1 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl">
             <div className="rounded-[1.75rem] border border-slate-100 bg-white/60 p-8">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <BrainCircuit className="w-3.5 h-3.5 text-[#9C1010]" />
                 Complexity Analysis
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'Easy', data: difficultyBreakdown.easy, bg: 'bg-emerald-50/50 hover:border-emerald-200 hover:shadow-emerald-900/5 border-slate-100' },
                   { label: 'Medium', data: difficultyBreakdown.medium, bg: 'bg-amber-50/50 hover:border-amber-200 hover:shadow-amber-900/5 border-slate-100' },
                   { label: 'Advanced', data: difficultyBreakdown.advanced, bg: 'bg-red-50/50 hover:border-red-200 hover:shadow-red-900/5 border-slate-100' }
                 ].map((diff) => (
                   <div key={diff.label} className={`p-6 rounded-2xl border transition-all duration-300 ${diff.bg} flex flex-col justify-center items-center text-center shadow-sm`}>
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{diff.label} Questions</span>
                     <div className="text-3xl font-display font-black text-slate-800 mb-1">{diff.data.percentage}%</div>
                     <span className="text-xs font-semibold text-slate-400">{diff.data.earned} / {diff.data.max} Points</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* Section 3: AI Diagnostic */}
        <div className="bg-slate-900 rounded-[2rem] p-1 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] relative text-white">
          <div className="rounded-[1.75rem] bg-slate-900/90 border border-slate-800 p-8 md:p-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#9C1010]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
             
             <div className="flex items-center gap-3 mb-8 text-white relative z-10 border-b border-slate-800 pb-6">
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                 <Sparkles className="w-4 h-4 text-amber-300" />
               </div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Personalized AI Diagnostic</h3>
             </div>
             <div className="space-y-6 text-sm md:text-base text-slate-300 leading-relaxed max-w-4xl relative z-10 font-medium">
               {insights.split('\n\n').map((paragraph: string, idx: number) => (
                 <p key={idx}>{paragraph}</p>
               ))}
             </div>
          </div>
        </div>

        {/* Section 4: Recommended Careers */}
        <div className="bg-white rounded-[2rem] border border-white/40 p-1 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl">
           <div className="rounded-[1.75rem] border border-slate-100 bg-white/60 p-8 md:p-10">
             <div className="flex items-center gap-2 mb-6">
               <Target className="w-4 h-4 text-[#9C1010]" />
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Career Tracts</h3>
             </div>
             <p className="text-sm font-medium text-slate-500 mb-8 max-w-2xl">Based on your dominant cognitive traits, our scoring algorithms recommend alignment with the following intellectual domains:</p>
             <div className="flex flex-wrap gap-3">
               {careers.map((career: string, idx: number) => (
                 <div key={idx} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white shadow-sm hover:shadow-md hover:border-[#9C1010]/30 hover:text-[#9C1010] transition-all cursor-default">
                   {career}
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Section 5: Certificate */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#9C1010]/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#9C1010] to-[#600505]" />
          
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-3 text-[#9C1010]">
              <Award className="w-5 h-5" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">Official Validation Diploma</h3>
            </div>
            <h2 className="text-3xl font-display font-black text-slate-900 mb-3 tracking-tight">Certificate of Cognitive Achievement</h2>
            <p className="text-sm font-medium text-slate-500 mb-10 max-w-xl">Download a verified PDF documenting your cognitive profile. Includes verified Certificate UUID, scores, and the Abroad Simplified official watermark.</p>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <button 
                onClick={handleDownloadCertificate}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#9C1010] to-[#7a0c0c] hover:from-[#7a0c0c] hover:to-[#5c0808] text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 shrink-0 transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Ensure Award icon is imported at top
import { Award } from 'lucide-react';
