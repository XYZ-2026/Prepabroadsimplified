'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import PremiumToolsCards from '@/components/PremiumToolsCards';

export default function ResearchPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show on the homepage
    if (pathname !== '/') return;

    // Add a slight delay before showing the popup so it feels more natural
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isOpen || pathname !== '/') return null;

  return (
    <div className="research-popup-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white rounded-3xl shadow-2xl flex flex-col p-4 md:p-6 animate-in fade-in zoom-in duration-300">
        
        {/* Close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close popup"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6 mt-12 md:mt-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Accelerate Your <span className="text-[#65151E]">Study Abroad</span> Journey
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Explore our premium platforms designed to help ambitious students build their legacy and reach top global universities.
          </p>
        </div>
        
        <PremiumToolsCards onLinkClick={() => setIsOpen(false)} />
        
      </div>
    </div>
  );
}
