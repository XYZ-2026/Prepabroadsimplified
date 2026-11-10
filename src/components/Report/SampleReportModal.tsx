'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, ExternalLink, Download, FileText, CheckCircle2, BookOpen } from 'lucide-react';

interface SampleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GradeOption {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  pages: string;
  desc: string;
  browserUrl: string;
  pdfUrl: string;
  isPopular?: boolean;
}

const GRADE_OPTIONS: GradeOption[] = [
  {
    id: 'junior',
    badge: 'Grades 7–9',
    title: 'Junior Diagnostic Report',
    subtitle: 'Foundation & Learning Modalities',
    pages: '50+ Pages',
    desc: 'Focuses on VARK sensory modalities, abstract logic agility, and foundational study stamina.',
    browserUrl: '/sample-report?type=junior',
    pdfUrl: '/sample-reports/sample-report-grades-7-9.pdf',
  },
  {
    id: 'grade10',
    badge: 'Grade 10',
    title: 'Secondary Stream Selection Report',
    subtitle: 'PCM vs PCB vs Commerce vs Arts',
    pages: '56 Pages',
    desc: 'Our flagship 30-module evaluation validating Class 11 stream fitment, quantitative ceiling, and subject choices.',
    browserUrl: '/sample-report?type=grade10',
    pdfUrl: '/sample-reports/sample-report-grade-10.pdf',
    isPopular: true,
  },
  {
    id: 'senior',
    badge: 'Grades 11–12',
    title: 'Senior University & Career Fitment',
    subtitle: 'Degree Alignment & Career Clusters',
    pages: '50+ Pages',
    desc: 'Synthesizes specialized aptitude, Holland RIASEC vocational codes, and premier university admissions roadmaps.',
    browserUrl: '/sample-report?type=grade12',
    pdfUrl: '/sample-reports/sample-report-grades-11-12.pdf',
  },
];

export default function SampleReportModal({ isOpen, onClose }: SampleReportModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sample-report-modal-title"
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm p-3.5 sm:p-6 flex justify-center items-start pt-10 sm:pt-16 pb-12 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E2E8F0] p-5 sm:p-8 space-y-6 text-left my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold font-dmsans text-[#1258DE] bg-[#E8F0FF] px-2.5 py-0.5 rounded-full">
              <FileText className="w-3.5 h-3.5" />
              <span>Interactive Sample Reports</span>
            </div>
            <h2
              id="sample-report-modal-title"
              className="text-xl sm:text-2xl font-bold font-dmsans text-[#080F1C] tracking-tight"
            >
              Choose a Grade to View Sample Report
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              View our complete 50+ page executive reports directly in your browser. No download required.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] flex items-center justify-center text-[#475569] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Grade Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GRADE_OPTIONS.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                item.isPopular
                  ? 'border-[#2563EB] bg-[#F8FAFC] ring-2 ring-[#2563EB]/15'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#1258DE] bg-[#E8F0FF] px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-medium text-[#64748B]">
                    {item.pages}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#080F1C] font-dmsans leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-[#1258DE] mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-[#EDF2F7] space-y-2">
                {/* Primary: View in Browser */}
                <Link
                  href={item.browserUrl}
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#1258DE] hover:bg-[#0F47B8] shadow-xs transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View in Browser</span>
                </Link>

                {/* Secondary: PDF file */}
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-[#475569] hover:text-[#080F1C] bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <span>
            Looking for full details? Explore our{' '}
            <Link
              href="/psychometric-assessment"
              onClick={onClose}
              className="text-[#1258DE] font-bold hover:underline"
            >
              Psychometric Assessment Overview
            </Link>
          </span>

          <Link
            href="/psychometric-test"
            onClick={onClose}
            className="inline-flex items-center gap-1 font-bold text-[#1258DE] hover:text-[#0F47B8]"
          >
            <span>Start Free Diagnostic Assessment →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

