'use client';

import React from 'react';
import CinematicHero from './CinematicHero';
import StatsStrip from './StatsStrip';
import AssessmentMatrixSection from './AssessmentMatrixSection';
import StudentJourneySection from './StudentJourneySection';
import AcademicPillarsSection from './AcademicPillarsSection';
import PlatformFeaturesSection from './PlatformFeaturesSection';
import StudentTestimonialsSection from './StudentTestimonialsSection';
import FAQSection from './FAQSection';
import PreFooterCTA from './PreFooterCTA';

export default function CinematicLandingExperience() {
  return (
    <div className="flex flex-col w-full selection:bg-[#2563EB] selection:text-white">
      {/* 1. Cinematic Hero Section */}
      <CinematicHero />

      {/* 2. Micro Stats Strip */}
      <StatsStrip />

      {/* 3. The Assessment Matrix (Directly addresses user prompt & #assessments) */}
      <AssessmentMatrixSection />

      {/* 4. The Student Development Journey */}
      <StudentJourneySection />

      {/* 5. Grade-Specific Pathways & Academic Pillars */}
      <AcademicPillarsSection />

      {/* 6. Platform Capabilities (Bento Grid) */}
      <PlatformFeaturesSection />

      {/* 7. Student Testimonials (Real students from real schools without photos) */}
      <StudentTestimonialsSection />

      {/* 8. Frequently Asked Questions */}
      <FAQSection />

      {/* 9. Pre-Footer High Impact CTA */}
      <PreFooterCTA />
    </div>
  );
}
