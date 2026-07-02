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

export default function ResultDashboardClient({ resultData, resultId }: { resultData: any, resultId: string }) {
  const [certName, setCertName] = useState('');

  const {
    iqScore,
    percentile,
    tier,
    domains,
    insights,
    careers,
    totalEarned,
    totalMax,
    evaluatedAnswers
  } = resultData;

  const attemptedCount = evaluatedAnswers?.length || 60;
  const correctCount = evaluatedAnswers?.filter((a: any) => a.isCorrect).length || Math.floor((totalEarned/totalMax)*60);
  const incorrectCount = attemptedCount - correctCount;
  const unattemptedCount = 60 - attemptedCount;

  // Format data for Radar Chart
  const radarData = domains.map((d: any) => ({
    subject: d.category.split(' ')[0], // short name
    fullSubject: d.category,
    A: d.percentage,
    fullMark: 100,
  }));

  const handleDownloadCertificate = async () => {
    if (!certName.trim()) {
      alert("Please enter a name for the certificate");
      return;
    }

    // Access jsPDF from the globally loaded script to bypass Turbopack's static analyzer bugs
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
    doc.text(certName, 148, 95, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`has achieved an Advanced IQ Score of ${iqScore}`, 148, 120, { align: 'center' });
    doc.text(`Cognitive Tier: ${tier} | National Percentile: ${percentile}th`, 148, 130, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text(`UUID: ${resultId}`, 148, 180, { align: 'center' });
    doc.text("College Simplified Assessment Matrix", 148, 190, { align: 'center' });

    doc.save(`College-Simplified-IQ-${certName.replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="lazyOnload" />
      
      {/* Top Banner */}
      <div className="w-full bg-black text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#9C1010] rounded-lg flex items-center justify-center">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div>
            <div className="font-bold tracking-widest text-sm uppercase">College Simplified</div>
            <div className="text-xs text-slate-400">Student Portal</div>
          </div>
        </div>
        <Link href="/" className="text-sm font-semibold hover:text-white/80 transition-colors">
          Return to Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        
        {/* Section 1: Cognitive Blueprint */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
            {/* IQ Score Circle */}
            <div className="shrink-0 flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 border-[#9C1010]/10 relative bg-white shadow-xl shadow-red-900/5">
              <div className="absolute inset-2 rounded-full border border-[#9C1010]/20 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">IQ Score</span>
                <span className="text-5xl font-black text-slate-900 leading-none">{iqScore}</span>
                <span className="text-[9px] font-bold text-white bg-[#9C1010] px-3 py-1 rounded-full uppercase tracking-widest mt-2">{tier}</span>
              </div>
            </div>

            {/* Blueprint Details */}
            <div className="flex-1 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                <Activity className="w-3.5 h-3.5" />
                National Percentile: {percentile}th Percentile
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Your Cognitive Blueprint</h1>
              <p className="text-slate-500 mb-8 max-w-2xl">
                Congratulations. You have completed our advance student assessment. Your score places you in the <strong>{tier.toLowerCase()}</strong> tier. A complete analysis of your profile is unlocked below.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attempted</span>
                  <div className="text-2xl font-bold text-slate-800"><span className="text-slate-900">{attemptedCount}</span> <span className="text-sm text-slate-400">/ 60</span></div>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Correct</span>
                  <div className="text-2xl font-bold text-emerald-700">{correctCount}</div>
                </div>
                <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Incorrect</span>
                  <div className="text-2xl font-bold text-red-700">{incorrectCount}</div>
                </div>
                <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-4 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Unattempted</span>
                  <div className="text-2xl font-bold text-slate-700">{unattemptedCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Footprint and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col h-[500px]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Cognitive Footprint</h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#9C1010" strokeWidth={2} fill="#9C1010" fillOpacity={0.1} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Domain Analysis */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 h-[500px] flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Domain Analysis</h3>
            <div className="flex-1 flex flex-col justify-between">
              {domains.map((domain: any) => (
                <div key={domain.category} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-700">{domain.category}</span>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{domain.percentage}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#9C1010] h-full rounded-full transition-all duration-1000 group-hover:bg-black" 
                      style={{ width: `${Math.min(100, domain.percentage)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: AI Diagnostic */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10 mb-8 relative">
          <div className="flex items-center gap-2 mb-6 text-[#9C1010]">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Personalized AI Diagnostic</h3>
          </div>
          <div className="space-y-6 text-sm text-slate-600 leading-relaxed max-w-5xl">
            {insights.split('\n\n').map((paragraph: string, idx: number) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Section 4: Recommended Careers */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10 mb-8">
          <div className="flex items-center gap-2 mb-8 text-[#9C1010]">
            <Target className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Recommended Career Tracts</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">Based on your dominant cognitive traits, our scoring algorithms recommend alignment with the following intellectual domains:</p>
          <div className="flex flex-wrap gap-4">
            {careers.map((career: string, idx: number) => (
              <div key={idx} className="px-6 py-3 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50 shadow-sm hover:shadow-md transition-shadow">
                {career}
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Certificate */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#9C1010]"></div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-[#9C1010]">
              <Award className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Official Validation Diploma</h3>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Certificate of Cognitive Achievement</h2>
            <p className="text-sm text-slate-500 mb-8">Includes verified Certificate UUID, scores, and College Simplified stamp.</p>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-full max-w-sm">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Enter Name for Certificate</label>
                <input 
                  type="text" 
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  placeholder="e.g. Rahul Sharma" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#9C1010]/20 focus:border-[#9C1010] transition-all bg-slate-50 text-sm font-medium"
                />
              </div>
              <button 
                onClick={handleDownloadCertificate}
                className="mt-6 md:mt-6 px-6 py-3 bg-[#9C1010] text-white rounded-xl font-bold text-sm hover:bg-black transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20 shrink-0"
              >
                <Download className="w-4 h-4" />
                Download Certificate PDF
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
