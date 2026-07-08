import Link from 'next/link';
import { BookOpen, GraduationCap, Globe } from 'lucide-react';

export default function PremiumToolsCards({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Ad 1: SAT */}
      <div className="group flex flex-col justify-between p-6 rounded-2xl border border-gray-100 bg-gradient-to-b from-blue-50/50 to-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-700 bg-blue-100 rounded-full">
            TEST PREP
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Digital SAT Mastery</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            Comprehensive practice tests, personalized study plans, and expert guidance to help you ace your SAT and secure your spot at top universities.
          </p>
        </div>
        <Link 
          href="#"
          onClick={onLinkClick}
          className="w-full inline-flex justify-center items-center text-center px-6 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white rounded-xl transition-colors duration-300"
        >
          Start SAT Prep →
        </Link>
      </div>

      {/* Ad 2: Research Site */}
      <div className="group flex flex-col justify-between p-6 rounded-2xl border border-gray-100 bg-gradient-to-b from-red-50/50 to-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-[#65151E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-red-700 bg-red-100 rounded-full">
            ACADEMIC PUBLISHING
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Publish Research</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            An elite academic ecosystem helping ambitious students transform ideas into globally recognized research publications — from first concept to indexed journal.
          </p>
        </div>
        <Link 
          href="https://research.abroadsimplified.com/" 
          target="_blank"
          onClick={onLinkClick}
          className="relative z-10 w-full inline-flex justify-center items-center text-center px-6 py-2.5 text-sm font-semibold text-white bg-[#65151E] hover:bg-[#4d1017] rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          Start Your Research →
        </Link>
      </div>

      {/* Ad 3: Abroad Simplified */}
      <div className="group flex flex-col justify-between p-6 rounded-2xl border border-gray-100 bg-gradient-to-b from-emerald-50/50 to-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Globe className="w-7 h-7" />
          </div>
          <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-emerald-700 bg-emerald-100 rounded-full">
            PLATFORM TOOLS
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Abroad Simplified</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            Search 500+ global universities, find matching scholarships, take advanced psychometric tests, and get expert visa guidance all in one place.
          </p>
        </div>
        <Link 
          href="/university-finder"
          onClick={onLinkClick}
          className="w-full inline-flex justify-center items-center text-center px-6 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors duration-300"
        >
          Explore Platform →
        </Link>
      </div>
    </div>
  );
}
