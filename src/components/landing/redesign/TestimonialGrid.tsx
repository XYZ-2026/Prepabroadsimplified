'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Brain, 
  Compass, 
  Award, 
  Rocket, 
  Globe, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';
import { Container, SectionHeading } from './primitives';
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference';
import { 
  TESTIMONIAL_CATEGORIES, 
  ALL_TESTIMONIALS, 
  TestimonialCategory, 
  TestimonialItem 
} from '@/data/testimonials-data';

// Helper to render matching icon per category
function getCategoryIcon(iconName: string, className = 'w-4 h-4') {
  switch (iconName) {
    case 'Brain':
      return <Brain className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Rocket':
      return <Rocket className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Sparkles':
    default:
      return <Sparkles className={className} />;
  }
}

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;

export default function TestimonialGrid() {
  const [activeCategory, setActiveCategory] = useState<TestimonialCategory>('all');
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotionPreference();

  // Filter testimonials based on selected category
  const filteredTestimonials = useMemo(() => {
    if (activeCategory === 'all') {
      return ALL_TESTIMONIALS;
    }
    return ALL_TESTIMONIALS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const visibleTestimonials = useMemo(() => {
    return filteredTestimonials.slice(0, visibleCount);
  }, [filteredTestimonials, visibleCount]);

  const remainingCount = Math.max(0, filteredTestimonials.length - visibleCount);

  // Reset visible count when switching categories
  const handleCategoryChange = (catId: TestimonialCategory) => {
    if (catId === activeCategory) return;
    setActiveCategory(catId);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, filteredTestimonials.length));
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    // Smooth scroll back to category bar on collapse
    const section = document.getElementById('stories');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // GSAP animation on category switch or load more on fine pointers
  useEffect(() => {
    if (prefersReducedMotion || !gridContainerRef.current) return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const cards = gridContainerRef.current.querySelectorAll('.review-card');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );
    }
  }, [activeCategory, visibleCount, prefersReducedMotion]);

  const activeCategoryDef = TESTIMONIAL_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <section 
      id="stories"
      aria-label="Student and Parent Stories"
      className="scroll-mt-20 py-16 sm:py-20 lg:py-24 bg-[#F5F7FB] border-b border-[#DDE3F0] relative"
    >
      {/* Anchor for navbar and external links */}
      <div id="testimonials" className="absolute -top-20 pointer-events-none" />

      <Container>
        {/* ── Section Heading & Overall Rating Trust Badge ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-3xl">
            <SectionHeading
              title="Evidence-backed clarity for students and families"
              subtitle="Real, verified stories from over 15,000 ambitious secondary school families across CBSE, ICSE, IB, and Cambridge curricula who replaced guesswork with scientific data."
            />
          </div>

          {/* Social Proof & Rating Summary Strip */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-auto">
            {/* Overall Rating Pill */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#DDE3F0] shadow-2xs">
              <div className="flex items-center gap-0.5 text-[#F59E0B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                ))}
              </div>
              <span className="text-xs font-dmsans font-bold text-[#12131C]">
                4.96 / 5.0
              </span>
              <span className="text-[11px] font-dmsans text-[#767E94] hidden sm:inline">
                (130+ Verified Reviews)
              </span>
            </div>

            {/* 100% Verified Outcomes */}
            <div className="flex items-center gap-2 text-xs font-dmsans font-bold text-[#1258DE] bg-[#E6EDFF] px-3.5 py-2 rounded-full border border-[#C8D8FF]">
              <ShieldCheck className="w-4 h-4 text-[#1258DE]" />
              <span>100% verified outcomes</span>
            </div>
          </div>
        </div>

        {/* ── Category Tabs Switcher (Scrollable on Mobile/Tablet, Flex on Desktop) ── */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2.5 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none sm:flex-wrap">
            {TESTIMONIAL_CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  type="button"
                  className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-dmsans font-bold transition-all duration-200 shrink-0 select-none cursor-pointer ${
                    isActive
                      ? 'bg-[#1258DE] text-white shadow-sm shadow-[#1258DE]/25 ring-2 ring-[#1258DE]/20'
                      : 'bg-white text-[#5B6275] border border-[#DDE3F0] hover:border-[#1258DE] hover:text-[#12131C] shadow-2xs'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className={isActive ? 'text-white' : 'text-[#1258DE]'}>
                    {getCategoryIcon(cat.iconName, 'w-3.5 h-3.5 sm:w-4 sm:h-4')}
                  </span>
                  <span>{cat.label}</span>
                  <span
                    className={`ml-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F0F3FA] text-[#5B6275]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Description Banner */}
          {activeCategoryDef && activeCategoryDef.description && (
            <div className="mt-3 text-[12.5px] sm:text-[13.5px] font-dmsans text-[#5B6275] bg-white/70 backdrop-blur-xs rounded-xl px-4 py-2.5 border border-[#E2E8F0] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1258DE] shrink-0" />
              <span>{activeCategoryDef.description}</span>
            </div>
          )}
        </div>

        {/* ── Testimonials Grid: 3 cols on Desktop, 2 on Tablet, 1 on Mobile ── */}
        <div 
          ref={gridContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {visibleTestimonials.map((t: TestimonialItem) => (
            <div
              key={t.id}
              className="review-card bg-white rounded-[24px] border border-[#DDE3F0] p-6 sm:p-7 flex flex-col justify-between hover:border-[#1258DE] transition-all duration-200 shadow-2xs hover:shadow-clarvo-elevated group"
            >
              <div>
                {/* Top Header: Rating Stars & Badges */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  {/* 5 Stars */}
                  <div className="flex items-center gap-0.5 text-[#F59E0B]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                    ))}
                  </div>

                  {/* Year / Cohort Tag */}
                  <span className="text-[10px] font-dmsans font-semibold text-[#8D96AA] bg-[#F5F7FB] px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                    Cohort ’{t.year.slice(-2)}
                  </span>
                </div>

                {/* Outcome Badges Row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-dmsans font-bold text-[#0E7A3D] bg-[#E8F8EE] px-2.5 py-0.5 rounded-full border border-[#B6EAD0]">
                    <CheckCircle2 className="w-3 h-3 text-[#0E7A3D]" />
                    <span>Verified</span>
                  </span>

                  <span className="text-[11px] font-dmsans font-semibold text-[#1258DE] bg-[#E6EDFF] px-2.5 py-0.5 rounded-full border border-[#C8D8FF]">
                    {t.outcomeBadge}
                  </span>
                </div>

                {/* Outcome Metric Callout */}
                <div className="mb-4 pb-3 border-b border-[#F0F3FA]">
                  <span className="text-[13.5px] sm:text-[14px] font-dmsans font-bold text-[#12131C] block leading-snug">
                    {t.outcomeMetric}
                  </span>
                  <span className="text-[11.5px] font-dmsans text-[#767E94] block mt-1">
                    {t.focusArea}
                  </span>
                </div>

                {/* Review Quote Body */}
                <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#5B6275] font-dmsans mb-6">
                  “{t.quote}”
                </p>
              </div>

              {/* Author Footer: Avatar, Name, Role, School, City */}
              <div className="pt-4 border-t border-[#F0F3FA] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#171822] text-white flex items-center justify-center font-dmsans font-bold text-xs shrink-0 shadow-2xs">
                  {t.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[13.5px] font-dmsans font-bold text-[#12131C] truncate leading-tight">
                      {t.name}
                    </h4>
                    {t.role === 'Parent' ? (
                      <span className="text-[9.5px] font-dmsans font-bold text-[#1258DE] bg-[#E6EDFF] px-1.5 py-0.2 rounded-sm shrink-0">
                        Parent
                      </span>
                    ) : (
                      <span className="text-[9.5px] font-dmsans font-bold text-[#0E7A3D] bg-[#E8F8EE] px-1.5 py-0.2 rounded-sm shrink-0">
                        Student
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] font-dmsans text-[#767E94] truncate leading-tight mt-1">
                    {t.grade} ({t.board}) · {t.school}, {t.city}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ── Controls: Load More / Show Less Button ── */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center gap-3">
          {remainingCount > 0 ? (
            <button
              onClick={handleLoadMore}
              type="button"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F5F7FB] text-[#1258DE] hover:text-[#0D4ABF] border border-[#C8D8FF] hover:border-[#1258DE] px-6 py-3 rounded-full text-xs sm:text-sm font-dmsans font-bold shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span>Load more stories ({remainingCount} remaining in this category)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          ) : (
            visibleTestimonials.length > INITIAL_VISIBLE_COUNT && (
              <button
                onClick={handleShowLess}
                type="button"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F5F7FB] text-[#5B6275] hover:text-[#12131C] border border-[#DDE3F0] px-5 py-2.5 rounded-full text-xs sm:text-sm font-dmsans font-semibold shadow-2xs transition-all duration-200 cursor-pointer"
              >
                <span>Show less</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            )
          )}

          {/* Category counter indicator */}
          <p className="text-[11.5px] font-dmsans text-[#8D96AA]">
            Showing {visibleTestimonials.length} of {filteredTestimonials.length} stories in{' '}
            <span className="font-bold text-[#12131C]">{activeCategoryDef?.label}</span>
          </p>
        </div>

      </Container>
    </section>
  );
}
