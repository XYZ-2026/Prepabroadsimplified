'use client';

import React from 'react';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';
import RedesignFooter from '@/components/landing/redesign/RedesignFooter';
import { ExternalLink, Download, FileText, CheckCircle2, Sparkles, BookOpen, GraduationCap, Compass, ArrowRight } from 'lucide-react';

interface ReportCardProps {
  gradeBadge: string;
  gradeBadgeColor: string;
  pages: string;
  title: string;
  subtitle: string;
  description: string;
  focusHighlights: string[];
  browserUrl: string;
  pdfUrl: string;
  isPopular?: boolean;
}

function ReportCard({
  gradeBadge,
  gradeBadgeColor,
  pages,
  title,
  subtitle,
  description,
  focusHighlights,
  browserUrl,
  pdfUrl,
  isPopular,
}: ReportCardProps) {
  return (
    <div className={`relative bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 ${
      isPopular 
        ? 'border-[#2563EB]/40 shadow-xl ring-2 ring-[#2563EB]/10' 
        : 'border-[#E2E8F0] shadow-sm hover:shadow-md'
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-6 sm:left-8 bg-[#2563EB] text-white text-[11px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Flagship Diagnostic</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${gradeBadgeColor}`}>
            {gradeBadge}
          </span>
          <span className="text-xs font-semibold text-[#64748B]">
            {pages}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-dmsans text-[#080F1C] tracking-tight mb-1">
          {title}
        </h2>
        <p className="text-sm font-semibold text-[#1258DE] mb-3">
          {subtitle}
        </p>

        <p className="text-sm text-[#475569] leading-relaxed mb-6">
          {description}
        </p>

        <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#080F1C] mb-2.5">
            Key Diagnostic Focus:
          </div>
          <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#475569]">
            {focusHighlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <Link
          href={browserUrl}
          className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>View in Browser (Interactive)</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </Link>

        <a
          href={pdfUrl}
          download
          className="w-full h-10 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Download Sample PDF</span>
        </a>
      </div>
    </div>
  );
}

export default function SampleReportsHubPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <LandingNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1.5"
          >
            ← Back to CLARVO Home
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 bg-[#E8F0FF] text-[#1258DE] px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Diagnostic Dossier Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-dmsans text-[#080F1C] tracking-tight leading-tight mb-4">
            Explore CLARVO Sample Reports
          </h1>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
            Inspect our complete 50+ page evaluation dossiers across all grade cohorts. Every report synthesizes 30 scientific modules into actionable clarity for students, parents, and counsellors.
          </p>
        </div>

        {/* Three Grade Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {/* Card 1: Grades 7-9 */}
          <ReportCard
            gradeBadge="Grades 7–9"
            gradeBadgeColor="bg-amber-50 text-amber-700 border border-amber-200"
            pages="50+ Pages"
            title="Junior Diagnostic Report"
            subtitle="Foundation & Learning Modalities"
            description="Evaluates cognitive stamina, VARK sensory learning preferences, and early curiosity indicators before high-school specialization."
            focusHighlights={[
              'VARK Sensory Learning Profile',
              'Abstract logic & numerical intuition agility',
              'Self-directed study stamina & focus index',
              'Curiosity vector mapping across emerging subjects',
            ]}
            browserUrl="/sample-report?type=junior"
            pdfUrl="/sample-reports/sample-report-grades-7-9.pdf"
          />

          {/* Card 2: Grade 10 (Flagship) */}
          <ReportCard
            gradeBadge="Grade 10"
            gradeBadgeColor="bg-blue-50 text-blue-700 border border-blue-200"
            pages="56 Pages"
            title="Secondary Stream Selection"
            subtitle="PCM vs PCB vs Commerce vs Arts"
            description="Our flagship 30-module evaluation designed to validate Class 11 stream fitment, quantitative ceiling, and high-stakes subject combinations."
            focusHighlights={[
              'Stream fitment ranking (PCM / PCB / Commerce / Humanities)',
              '30-module item-level percentile breakdown',
              'Psychologist advisory observations & risk mitigation',
              'Target university pathways & subject roadmaps',
            ]}
            browserUrl="/sample-report?type=grade10"
            pdfUrl="/sample-reports/sample-report-grade-10.pdf"
            isPopular
          />

          {/* Card 3: Grades 11-12 */}
          <ReportCard
            gradeBadge="Grades 11–12"
            gradeBadgeColor="bg-purple-50 text-purple-700 border border-purple-200"
            pages="50+ Pages"
            title="Senior Career & University"
            subtitle="Degree Alignment & Career Clusters"
            description="Synthesizes specialized aptitude, Holland RIASEC vocational codes, and premier university admission requirements worldwide."
            focusHighlights={[
              'Undergraduate degree cluster alignment',
              'Holland RIASEC occupational compatibility',
              'India vs Study Abroad admission readiness',
              '4-year higher education timeline & milestone roadmap',
            ]}
            browserUrl="/sample-report?type=grade12"
            pdfUrl="/sample-reports/sample-report-grades-11-12.pdf"
          />
        </div>

        {/* Advisory Consultation Banner */}
        <div className="bg-[#080F1C] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl text-center md:text-left">
            <span className="text-xs font-bold text-[#93C5FD] uppercase tracking-wider block mb-2">
              Individualized Academic Guidance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Want a personalized assessment for your student?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Take the 30-module assessment today, or schedule a consultation with our senior counsellors for a full platform walkthrough.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/psychometric-assessment"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm text-center shadow-md transition-colors"
            >
              Start Free Assessment →
            </Link>
            <Link
              href="/book-a-demo"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm text-center border border-white/20 transition-colors"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </main>

      <RedesignFooter />
    </div>
  );
}
