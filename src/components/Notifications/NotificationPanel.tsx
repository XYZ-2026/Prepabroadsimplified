'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  ExternalLink, 
  Clock, 
  Tag, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  Archive,
  Filter
} from 'lucide-react';

export interface AcademicUpdate {
  id: string;
  category: 'Admissions' | 'Visa & Policy' | 'Scholarship' | 'Testing';
  region: string;
  headline: string;
  summary: string;
  updateDate: string; // Explicit verification date (no fake "2 hours ago")
  status: 'Active' | 'Upcoming' | 'Archived';
  sourceLabel: string;
  sourceUrl: string;
}

const ACADEMIC_UPDATES: AcademicUpdate[] = [
  {
    id: 'upd-us-fall27',
    category: 'Admissions',
    region: 'USA & Canada',
    headline: 'Fall 2027 Admissions Calendar — US & Canadian University Cycles',
    summary: 'Early Action and Early Decision deadlines for top North American universities open November 1 via the Common Application. Standard Decision rounds proceed through January 2027.',
    updateDate: 'October 2026',
    status: 'Active',
    sourceLabel: 'Common Application Guidelines',
    sourceUrl: 'https://www.commonapp.org',
  },
  {
    id: 'upd-uk-visa-guide',
    category: 'Visa & Policy',
    region: 'United Kingdom',
    headline: 'UK Student Visa (Student Route) Official Processing Standards',
    summary: 'UK Visas and Immigration (UKVI) maintains 3-week standard processing for overseas student applications from India. Confirmation of Acceptance for Studies (CAS) requires verified unconditional status.',
    updateDate: 'October 2026',
    status: 'Active',
    sourceLabel: 'UKVI Government Portal',
    sourceUrl: 'https://www.gov.uk/student-visa',
  },
  {
    id: 'upd-daad-germany-27',
    category: 'Scholarship',
    region: 'Germany & EU',
    headline: 'DAAD Scholarships 2027–2028 Cycle Guidelines Announced',
    summary: 'The German Academic Exchange Service has published eligibility requirements for postgraduate research and degree grants beginning in Fall 2027. Application portal opens late Autumn 2026.',
    updateDate: 'September 2026',
    status: 'Upcoming',
    sourceLabel: 'DAAD International Scholarships',
    sourceUrl: 'https://www.daad.de',
  },
  {
    id: 'upd-sat-calendar-2627',
    category: 'Testing',
    region: 'International',
    headline: 'Digital SAT 2026–2027 International Administration Schedule',
    summary: 'College Board confirmed the upcoming international digital test administrations for November and December 2026. Deadlines for regular registration close 3 weeks prior to each test date.',
    updateDate: 'September 2026',
    status: 'Active',
    sourceLabel: 'College Board SAT Suite',
    sourceUrl: 'https://satsuite.collegeboard.org/digital',
  },
  {
    id: 'upd-aus-gs-req',
    category: 'Visa & Policy',
    region: 'Australia',
    headline: 'Australia Genuine Student (GS) Assessment Criteria for Subclass 500',
    summary: 'The Australian Department of Home Affairs continues implementation of the Genuine Student requirement, emphasizing academic progression, course fit, and career alignment for Indian applicants.',
    updateDate: 'August 2026',
    status: 'Active',
    sourceLabel: 'Department of Home Affairs',
    sourceUrl: 'https://immi.homeaffairs.gov.au',
  },
  {
    id: 'upd-daad-2026-closed',
    category: 'Scholarship',
    region: 'Germany',
    headline: 'DAAD 2026 Study Grants (Application Cycle Concluded)',
    summary: 'The application window for the 2025–2026 academic entry concluded in March 2026. Applicants awaiting final outcomes should check the official DAAD portal for award notices.',
    updateDate: 'March 2026',
    status: 'Archived',
    sourceLabel: 'DAAD Archives',
    sourceUrl: 'https://www.daad.de',
  },
];

export default function NotificationPanel() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Active' | 'Admissions' | 'Scholarship' | 'Visa & Policy'>('All');
  const [visibleCount, setVisibleCount] = useState(4);

  const filtered = useMemo(() => {
    if (selectedFilter === 'All') return ACADEMIC_UPDATES;
    if (selectedFilter === 'Active') return ACADEMIC_UPDATES.filter(u => u.status === 'Active');
    return ACADEMIC_UPDATES.filter(u => u.category === selectedFilter);
  }, [selectedFilter]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Admissions &amp; Policy Registry</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#080F1C] tracking-tight">
            Curated Academic &amp; Scholarship Updates
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verified timelines from official educational bodies. Updated regularly with explicit publication dates.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
          {(['All', 'Active', 'Admissions', 'Scholarship', 'Visa & Policy'] as const).map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  setVisibleCount(4);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Update Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {displayed.map((item) => {
          const isArchived = item.status === 'Archived';
          const isUpcoming = item.status === 'Upcoming';

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                isArchived
                  ? 'bg-slate-50/80 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div>
                {/* Meta Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#2563EB] border border-blue-100">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600 bg-slate-100">
                      {item.region}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isArchived
                        ? 'bg-slate-200/80 text-slate-600'
                        : isUpcoming
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isArchived ? (
                      <Archive className="w-3 h-3 text-slate-500" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-current" />
                    )}
                    {item.status}
                  </span>
                </div>

                {/* Headline */}
                <h4 className="text-[15px] sm:text-[16px] font-bold text-[#080F1C] leading-snug mb-2">
                  {item.headline}
                </h4>

                {/* Summary */}
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                  {item.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recorded: {item.updateDate}</span>
                </span>

                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-[#2563EB] hover:text-blue-800 transition-colors"
                >
                  <span>{item.sourceLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {displayed.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No updates found in this category. Select another filter above.
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 2)}
            className="px-6 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer"
          >
            Show Additional Updates ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
