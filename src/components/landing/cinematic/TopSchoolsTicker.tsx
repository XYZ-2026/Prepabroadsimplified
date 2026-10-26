'use client';

import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

export interface SchoolLogoItem {
  id: string;
  name: string;
  location: string;
  logo: string;
}

export const PREMIER_INDIAN_SCHOOLS: SchoolLogoItem[] = [
  {
    id: 'doon',
    name: 'The Doon School',
    location: 'Dehradun',
    logo: '/images/schools/doon_school.png',
  },
  {
    id: 'dps',
    name: 'Delhi Public School (DPS)',
    location: 'R.K. Puram & Society',
    logo: '/images/schools/dps.png',
  },
  {
    id: 'modern',
    name: 'Modern School',
    location: 'Barakhamba Road, New Delhi',
    logo: '/images/schools/modern_school.png',
  },
  {
    id: 'tsrs',
    name: 'The Shri Ram School (TSRS)',
    location: 'Delhi NCR',
    logo: '/images/schools/tsrs.png',
  },
  {
    id: 'cathedral',
    name: 'The Cathedral & John Connon School',
    location: 'Mumbai',
    logo: '/images/schools/cathedral_connon.png',
  },
  {
    id: 'scottish',
    name: 'Bombay Scottish School',
    location: 'Mumbai',
    logo: '/images/schools/bombay_scottish.png',
  },
  {
    id: 'dais',
    name: 'Dhirubhai Ambani International School (DAIS)',
    location: 'Mumbai',
    logo: '/images/schools/dais.png',
  },
  {
    id: 'mayo',
    name: 'Mayo College',
    location: 'Ajmer',
    logo: '/images/schools/mayo_college.png',
  },
  {
    id: 'scindia',
    name: 'The Scindia School',
    location: 'Gwalior',
    logo: '/images/schools/scindia.png',
  },
  {
    id: 'sanskriti',
    name: 'Sanskriti School',
    location: 'Chanakyapuri, New Delhi',
    logo: '/images/schools/sanskriti.png',
  },
  {
    id: 'welham',
    name: "Welham Girls' School",
    location: 'Dehradun',
    logo: '/images/schools/welham_girls.png',
  },
  {
    id: 'vasant_valley',
    name: 'Vasant Valley School',
    location: 'Vasant Kunj, New Delhi',
    logo: '/images/schools/vasant_valley.png',
  },
  {
    id: 'bishop_cotton',
    name: "Bishop Cotton Boys' School",
    location: 'Bengaluru',
    logo: '/images/schools/bishop_cotton.png',
  },
  {
    id: 'columbas',
    name: "St. Columba's School",
    location: 'Ashok Place, New Delhi',
    logo: '/images/schools/st_columbas.png',
  },
  {
    id: 'campion',
    name: 'Campion School',
    location: 'Fort, Mumbai',
    logo: '/images/schools/campion_mumbai.png',
  },
  {
    id: 'woodstock',
    name: 'Woodstock School',
    location: 'Mussoorie',
    logo: '/images/schools/woodstock.png',
  },
];

export default function TopSchoolsTicker() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Seamless duplicated array for endless mathematical loop
  const marqueeList = [...PREMIER_INDIAN_SCHOOLS, ...PREMIER_INDIAN_SCHOOLS];

  return (
    <section 
      aria-label="Counselled students from India's top schools"
      className="w-full bg-gradient-to-r from-[#F8FAFC] via-[#FFFFFF] to-[#F8FAFC] border-b border-[#E2E8F0] py-3.5 sm:py-4.5 relative overflow-hidden select-none shadow-[0_2px_8px_rgba(8,15,28,0.02)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-3.5 lg:gap-8">
        
        {/* ── Left Anchor Text Lockup (Compact 2-line Clarvo branded lockup) ── */}
        <div className="shrink-0 flex items-center justify-center lg:justify-start z-20 bg-transparent lg:pr-7 lg:border-r border-[#E2E8F0]">
          <div className="flex flex-col text-center lg:text-left max-w-[270px]">
            <div className="inline-flex items-center justify-center lg:justify-start gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse shrink-0" />
              <span className="text-[10px] sm:text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#2563EB]">
                PROVEN STUDENT SUCCESS
              </span>
            </div>
            <h2 className="text-[15px] sm:text-[17px] font-black tracking-[-0.02em] text-[#080F1C] leading-[1.25]">
              Counselled <span className="text-[#2563EB]">10,000+ Students</span><br className="hidden sm:inline" />
              <span className="text-[#475467] font-semibold text-[13px] sm:text-[14px]"> of India&apos;s top schools</span>
            </h2>
          </div>
        </div>

        {/* ── Seamless Right-to-Left Continuous Logo Loop ── */}
        <div className="relative flex-1 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
          <div 
            className={`flex items-center gap-8 sm:gap-12 w-max py-1 ${
              mounted && !shouldReduceMotion 
                ? 'animate-school-marquee group hover:[animation-play-state:paused]' 
                : 'overflow-x-auto'
            }`}
            style={{ willChange: 'transform' }}
          >
            {marqueeList.map((school, idx) => (
              <div
                key={`${school.id}-${idx}`}
                title={`${school.name} · ${school.location}`}
                className="group/logo relative flex items-center justify-center shrink-0 h-12 sm:h-14 w-20 sm:w-24 px-1.5 py-1 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={school.logo}
                  alt={school.name}
                  width={88}
                  height={52}
                  className="max-h-10 sm:max-h-12 w-auto max-w-[74px] sm:max-w-[88px] object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)] opacity-85 group-hover/logo:opacity-100 group-hover/logo:scale-110 transition-all duration-300"
                  loading={idx < 8 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Global CSS for the infinite marquee animation */}
      <style jsx>{`
        @keyframes schoolMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-school-marquee {
          animation: schoolMarquee 36s linear infinite;
        }

        @media (max-width: 640px) {
          .animate-school-marquee {
            animation-duration: 26s;
          }
        }
      `}</style>
    </section>
  );
}
