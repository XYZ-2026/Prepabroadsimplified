'use client';

import React from 'react';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import HeroThePath from '../redesign/HeroThePath';
import TopSchoolsTicker from './TopSchoolsTicker';
import SupportBento from '../redesign/SupportBento';
import StatsStripCountup from '../redesign/StatsStripCountup';
import PinnedAssessmentStory from '../redesign/PinnedAssessmentStory';
import Class10Pillars from '../redesign/Class10Pillars';
import DeskReportDossier from '../redesign/DeskReportDossier';
import GlobalJourneyStepper from '../redesign/GlobalJourneyStepper';
import GradePillarsSegmented from '../redesign/GradePillarsSegmented';
import TestimonialGrid from '../redesign/TestimonialGrid';
import ConsultationBanner from '../redesign/ConsultationBanner';
import AccordionFAQ from '../redesign/AccordionFAQ';

export default function CinematicLandingExperience() {
  return (
    <SmoothScrollProvider>
      <div className="flex flex-col w-full selection:bg-[#1258DE] selection:text-white">
        {/* Section 2: Hero "The Path" (DESIGN.md Section 2) */}
        <HeroThePath />

        {/* Section 3: Top Schools Marquee Ticker (LOCKED: code, speed, direction, content untouched) */}
        <div className="relative z-20">
          <TopSchoolsTicker />
        </div>

        {/* Section 4: Support for Every Stage (Bento Grid) */}
        <SupportBento />

        {/* Section 5: Midnight Stats Strip (Single Count-Up on First View) */}
        <StatsStripCountup />

        {/* Section 6: Assessment Matrix (Pinned, Scroll-Scrubbed Story on Midnight) */}
        <PinnedAssessmentStory />

        {/* Section 7: Class 10 Strategic Value (Three Pillars) */}
        <Class10Pillars />

        {/* Section 8: Report Dossier Flipbook (Physical Report-on-a-Desk) */}
        <DeskReportDossier />

        {/* Section 9: Self-Discovery to Global Admissions (5-Step Numbered Stepper) */}
        <GlobalJourneyStepper />

        {/* Section 10: Grade-Specific Pathways & Academic Pillars (Segmented Control) */}
        <GradePillarsSegmented />

        {/* Section 11: Student & Parent Testimonials (Static Grid, Verified Chips, No Marquee) */}
        <TestimonialGrid />

        {/* Section 12: Consultation CTA (Solid Clarvo-Blue Panel with Breakout Cutout) */}
        <ConsultationBanner />

        {/* Section 13: Frequently Asked Questions (Accessible 250ms Accordion) */}
        <AccordionFAQ />
      </div>
    </SmoothScrollProvider>
  );
}
