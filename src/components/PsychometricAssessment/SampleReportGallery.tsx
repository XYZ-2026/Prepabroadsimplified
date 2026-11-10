'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, Download, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import SampleReportModal from '@/components/Report/SampleReportModal';

interface SampleReportItem {
  id: string;
  gradeBadge: string;
  gradeTitle: string;
  subtitle: string;
  pages: string;
  focus: string;
  desc: string;
  keyInsights: string[];
  pdfUrl: string;
  coverUrl: string;
  browserUrl: string;
}

const SAMPLE_REPORTS: SampleReportItem[] = [
  {
    id: 'junior',
    gradeBadge: 'Grades 7–9',
    gradeTitle: 'Junior Diagnostic Report',
    subtitle: 'Foundation & Learning Agility',
    pages: '50+ Pages',
    focus: 'Learning style calibration & curiosity drivers',
    desc: 'Analyzes sensory learning modalities (VARK), abstract pattern logic, and foundational persistence habits to help students build academic stamina before high-stakes board years.',
    keyInsights: [
      'Visual vs. Kinesthetic learning modality ratio',
      'Abstract pattern reasoning & problem agility',
      'Curiosity vectors & initial subject affinities',
      'Parental guidance for early study habit architecture',
    ],
    pdfUrl: '/sample-reports/sample-report-grades-7-9.pdf',
    coverUrl: '/sample-reports/cover-grades-7-9.png',
    browserUrl: '/sample-report?type=junior',
  },
  {
    id: 'grade10',
    gradeBadge: 'Grade 10',
    gradeTitle: 'Secondary Stream Selection Report',
    subtitle: 'Stream Alignment & Subject Choices',
    pages: '56 Pages',
    focus: 'PCM vs. PCB vs. Commerce vs. Humanities validation',
    desc: 'Our flagship 30-module evaluation calibrating cognitive aptitude, RIASEC vocational interests, and emotional stability to eliminate guesswork in Class 11 stream selection.',
    keyInsights: [
      'Empirical % fit for all 4 academic streams',
      'Quantitative ceiling & numerical aptitude percentile',
      'Detailed subject combinations (Maths vs. Applied Maths)',
      '3-year high school roadmap towards university admission',
    ],
    pdfUrl: '/sample-reports/sample-report-grade-10.pdf',
    coverUrl: '/sample-reports/cover-grade-10.png',
    browserUrl: '/sample-report?type=grade10',
  },
  {
    id: 'senior',
    gradeBadge: 'Grades 11–12',
    gradeTitle: 'Senior University & Career Fitment Report',
    subtitle: 'Degree Fit & Global Admissions',
    pages: '50+ Pages',
    focus: 'University majors, SAT strategy & industry clusters',
    desc: 'Synthesizes specialized academic strengths, leadership EQ, and career convergence to guide international and domestic university applications, internships, and research papers.',
    keyInsights: [
      'Holland RIASEC vocational code synthesis',
      'Top 5 aligned career clusters with industry projections',
      'Standardized testing suitability (SAT / ACT / Competitive)',
      'Academic research & extracurricular spike roadmap',
    ],
    pdfUrl: '/sample-reports/sample-report-grades-11-12.pdf',
    coverUrl: '/sample-reports/cover-grades-11-12.png',
    browserUrl: '/sample-report?type=grade12',
  },
];

export default function SampleReportGallery() {
  const [showGradeModal, setShowGradeModal] = useState<boolean>(false);

  return (
    <section
      id="sample-reports"
      aria-label="Psychometric Assessment Sample Reports"
      className="w-full py-16 sm:py-24 bg-[#F8FAFC] border-y border-[#E4E7EC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0FF] border border-[#BFDBFE] text-xs font-bold text-[#1258DE] font-dmsans">
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive Sample Reports</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-dmsans text-[#080F1C] tracking-tight">
            See exactly what families receive before you begin.
          </h2>
          <p className="text-base text-[#64748B] font-dmsans leading-relaxed">
            Every CLARVO assessment generates a comprehensive 50+ page executive dossier. View our real, unedited reports directly in your browser or download the static PDF.
          </p>
        </div>

        {/* 3-Column Sample Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {SAMPLE_REPORTS.map((report) => {
            const isFeatured = report.id === 'grade10';
            return (
              <div
                key={report.id}
                className={`flex flex-col justify-between rounded-2xl bg-white border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-lg ${
                  isFeatured
                    ? 'border-[#2563EB] ring-2 ring-[#2563EB]/15'
                    : 'border-[#E4E7EC] hover:border-[#CBD5E1]'
                }`}
              >
                {/* Card Top: Cover Preview Area (Click opens browser view) */}
                <Link
                  href={report.browserUrl}
                  className="group relative w-full aspect-[4/3] bg-gradient-to-b from-[#F0F5FF] to-[#E2E8F0] overflow-hidden border-b border-[#E4E7EC] flex items-center justify-center p-4 cursor-pointer"
                  title={`Click to view ${report.gradeTitle} in browser`}
                >
                  {/* Real Cover Thumbnail Image with fallback */}
                  <div className="relative w-[150px] sm:w-[170px] aspect-[1/1.414] rounded-md shadow-lg overflow-hidden border border-[#CBD5E1] bg-white transform group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={report.coverUrl}
                      alt={`Cover preview for CLARVO ${report.gradeTitle}`}
                      fill
                      sizes="200px"
                      className="object-cover object-top"
                    />
                    {/* Hover overlay hint */}
                    <div className="absolute inset-0 bg-[#080F1C]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-bold text-white bg-[#1258DE] px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>View in Browser</span>
                      </span>
                    </div>
                  </div>

                  {/* Badges on top of preview */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold text-[#1258DE] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#DDE3F0] shadow-xs">
                      {report.gradeBadge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-medium text-[#475569] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#DDE3F0] shadow-xs">
                      {report.pages}
                    </span>
                  </div>
                </Link>

                {/* Card Middle: Content & Highlights */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#1258DE]">
                        {report.subtitle}
                      </div>
                      <h3 className="text-xl font-bold font-dmsans text-[#080F1C] mt-0.5">
                        {report.gradeTitle}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {report.desc}
                    </p>

                    <div className="pt-2 border-t border-[#F1F5F9]">
                      <div className="text-xs font-bold text-[#080F1C] mb-2 font-dmsans">
                        Included in this report:
                      </div>
                      <ul className="space-y-1.5">
                        {report.keyInsights.map((insight, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-[#475569]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom: Both Browser View & PDF Download Options */}
                  <div className="space-y-2 pt-4 border-t border-[#E4E7EC]">
                    {/* Primary Action: View in Browser */}
                    <Link
                      href={report.browserUrl}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1258DE] hover:bg-[#0F47B8] transition-colors shadow-xs"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>View in Browser</span>
                    </Link>

                    {/* Secondary Action: Download Static PDF */}
                    <a
                      href={report.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#475569] hover:text-[#080F1C] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors border border-[#E2E8F0]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Sample PDF</span>
                    </a>

                    {/* Tertiary: Take Test */}
                    <Link
                      href="/psychometric-test"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1 px-4 text-xs font-semibold text-[#1258DE] hover:underline"
                    >
                      <span>Take {report.gradeBadge} Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Reassurance Footer Banner with Modal Trigger */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-[#E4E7EC] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="text-sm font-bold text-[#080F1C] font-dmsans">
              Fictional Synthetic Sample Data
            </div>
            <p className="text-xs text-[#64748B]">
              All sample reports feature synthetic student data strictly for demonstration. Real assessments are 100% confidential and individual.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowGradeModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#1258DE] bg-[#E8F0FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Select Grade in Modal</span>
            </button>
            <Link
              href="/psychometric-test"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#080F1C] hover:bg-[#1E293B] transition-colors"
            >
              <span>Start Free Diagnostic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Grade Selector Modal */}
        <SampleReportModal
          isOpen={showGradeModal}
          onClose={() => setShowGradeModal(false)}
        />

      </div>
    </section>
  );
}
