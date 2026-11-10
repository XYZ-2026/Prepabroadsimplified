import React from 'react';
import { ShieldCheck, HeartHandshake, Compass, Lock } from 'lucide-react';

export default function ParentReassurance() {
  return (
    <section
      aria-label="Parent and Counsellor Reassurance"
      className="w-full py-16 sm:py-20 bg-paper border-t border-line"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Mission statement */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[13px] font-bold text-clarvo-blue bg-sky px-3 py-1 rounded-full font-dmsans">
              Educational guidance, not clinical labels
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-dmsans text-ink tracking-tight leading-tight">
              A supportive foundation for constructive family decisions.
            </h2>
            <p className="text-[17px] sm:text-[18px] text-muted font-dmsans leading-relaxed">
              Academic decisions often trigger unnecessary tension between students and parents. Our assessment does not box a student into a predetermined destiny—it reveals their natural strengths, study preferences, and working environments so families can plan with mutual respect.
            </p>
          </div>

          {/* Right Column: 4 Core Pillars — Token palette (No green/yellow/purple tiles per spec) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-xl bg-white border border-line shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center text-clarvo-blue">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-ink font-dmsans">
                Standardized Frameworks
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Anchored in globally respected psychometric foundations including Big Five Personality, Holland RIASEC vocational codes, and VARK learning models.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-line shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center text-clarvo-blue">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-ink font-dmsans">
                Constructive Family Dialogue
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Transforms disagreements into constructive discussions grounded in learning patterns, reasoning strengths, and interest alignments.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-line shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center text-clarvo-blue">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-ink font-dmsans">
                Educational Boundaries
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Explicitly intended for academic planning, stream selection, and career exploration—never as a medical diagnosis or intellectual ceiling.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-line shadow-2xs space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center text-clarvo-blue">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-ink font-dmsans">
                Data Privacy
              </h3>
              <p className="text-[13px] text-muted leading-relaxed">
                Candidate reports and test answers remain strictly confidential to the student and their family. Data is never shared or sold to outside parties.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

