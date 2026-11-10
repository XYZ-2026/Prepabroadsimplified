'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { PSYCHOMETRIC_CONTENT } from '@/content/psychometricContent';
import { usePointerFine } from '@/hooks/usePointerFine';
import {
  FileText,
  Target,
  BarChart3,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Calendar,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function ReportExplorerSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const previewCardRef = useRef<HTMLDivElement>(null);

  const isPointerFine = usePointerFine();
  const content = PSYCHOMETRIC_CONTENT.whatFamilyReceives;
  const items = content.items;
  const activeItem = items[selectedIndex] || items[0];

  // Icons corresponding to the 6 report sections
  const icons = [
    <Target key="0" className="w-5 h-5 text-clarvo-blue shrink-0" />,
    <BarChart3 key="1" className="w-5 h-5 text-clarvo-blue shrink-0" />,
    <BookOpen key="2" className="w-5 h-5 text-clarvo-blue shrink-0" />,
    <Sparkles key="3" className="w-5 h-5 text-clarvo-blue shrink-0" />,
    <ShieldCheck key="4" className="w-5 h-5 text-clarvo-blue shrink-0" />,
    <Calendar key="5" className="w-5 h-5 text-clarvo-blue shrink-0" />,
  ];

  // 3D Tilt calculation (fine pointers only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPointerFine || !previewCardRef.current) return;
    const rect = previewCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Max 8deg tilt
    const rotateX = ((centerY - y) / centerY) * 7;
    const rotateY = ((x - centerX) / centerX) * 7;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      aria-label="What the Family Receives — Report Explorer"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-line text-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky border border-line text-[13px] font-bold text-clarvo-blue font-dmsans">
            <FileText className="w-3.5 h-3.5" />
            <span>{content.sectionChip}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-dmsans text-ink tracking-tight leading-[1.15]">
            {content.sectionHeadline}
          </h2>

          <p className="text-[17px] sm:text-[18px] text-muted font-dmsans leading-relaxed">
            {content.sectionSubcopy}
          </p>
        </div>

        {/* ── REPORT EXPLORER: LEFT PREVIEW + RIGHT 6 ITEMS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* LEFT: LARGE REPORT PAGE PREVIEW WITH 3D TILT */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              ref={previewCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-[480px] rounded-3xl p-4 sm:p-6 bg-paper border border-line shadow-xl transition-transform duration-200 ease-out"
              style={{
                transform:
                  isPointerFine && (tilt.x !== 0 || tilt.y !== 0)
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
              }}
            >
              {/* Top Banner Notice */}
              <div className="flex items-center justify-between gap-3 mb-4 px-2">
                <span className="text-[12px] font-bold text-clarvo-blue bg-sky px-2.5 py-0.5 rounded-full">
                  {content.placeholderNotice}
                </span>
                <span className="text-[12px] font-semibold text-muted">
                  Section {selectedIndex + 1} of 6
                </span>
              </div>

              {/* Large Document Mockup Frame with 300ms cross-fade */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-line/80 shadow-md">
                <Image
                  key={activeItem.id}
                  src={activeItem.imagePreview}
                  alt={`${activeItem.title} preview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top transition-opacity duration-300 animate-in fade-in select-none"
                  priority
                />

                {/* Document overlay card with current active title */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-midnight/90 via-midnight/60 to-transparent text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-sky bg-clarvo-blue px-2.5 py-0.5 rounded-md">
                      Report dimension
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold font-dmsans text-white">
                    {activeItem.title}
                  </h4>
                  <p className="text-[13px] text-white/80 line-clamp-2 leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>
              </div>

              {/* Footer Indicator */}
              <div className="mt-4 px-2 flex items-center justify-between text-[12px] text-muted">
                <span>Class 10 Executive Report</span>
                <span className="text-clarvo-blue font-semibold flex items-center gap-1">
                  Hover items on right to inspect <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: LIST OF SIX ITEMS */}
          <div className="lg:col-span-6 space-y-3">
            {items.map((item, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={item.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onFocus={() => setSelectedIndex(idx)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-clarvo-blue ${
                    isSelected
                      ? 'bg-sky/50 border-clarvo-blue shadow-sm translate-x-1.5'
                      : 'bg-paper/70 border-line hover:border-clarvo-blue/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-clarvo-blue text-white' : 'bg-white border border-line text-clarvo-blue'
                      }`}
                    >
                      {React.cloneElement(icons[idx], {
                        className: `w-5 h-5 ${isSelected ? 'text-white' : 'text-clarvo-blue'}`,
                      })}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[16px] sm:text-[17px] font-bold font-dmsans text-ink">
                          {item.title}
                        </h3>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'text-clarvo-blue translate-x-1' : 'text-muted/40'
                          }`}
                        />
                      </div>
                      <p className="text-[14px] text-muted leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
