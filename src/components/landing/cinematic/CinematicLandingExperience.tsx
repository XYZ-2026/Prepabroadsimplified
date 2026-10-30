'use client';

import React from 'react';
import CinematicHero from './CinematicHero';
import TopSchoolsTicker from './TopSchoolsTicker';
import ServicesSection from './ServicesSection';
import StatsStrip from './StatsStrip';
import AssessmentMatrixSection from './AssessmentMatrixSection';
import InteractiveReportDossier from './InteractiveReportDossier';
import StudentJourneySection from './StudentJourneySection';
import AcademicPillarsSection from './AcademicPillarsSection';
import StudentTestimonialsSection from './StudentTestimonialsSection';
import FAQSection from './FAQSection';
import PreFooterCTA from './PreFooterCTA';

export default function CinematicLandingExperience() {
  return (
    <div className="flex flex-col w-full selection:bg-[#2563EB] selection:text-white">
      {/* 1. Cinematic Hero Section */}
      <CinematicHero />

      {/* 2. Top Schools Marquee Ticker (Directly below Hero section) */}
      <TopSchoolsTicker />

      {/* 3. Dedicated Core Services Section (Immediately following ticker) */}
      <ServicesSection />

      {/* 3. Micro Stats Strip */}
      <StatsStrip />

      {/* 4. The Assessment Matrix (Directly addresses user prompt & #assessments) */}
      <AssessmentMatrixSection />

      {/* 5. The Evidence Engine: Interactive Sample Report Dossier */}
      <InteractiveReportDossier />

      {/* 6. The Student Development Journey */}
      <StudentJourneySection />

      {/* 5. Grade-Specific Pathways & Academic Pillars */}
      <AcademicPillarsSection />

      {/* 6. Student Testimonials (Real students from real schools without photos) */}
      <StudentTestimonialsSection />

      {/* 8. Frequently Asked Questions */}
      <FAQSection />

      {/* 9. Pre-Footer High Impact CTA */}
      <PreFooterCTA />
    </div>
  );
}
