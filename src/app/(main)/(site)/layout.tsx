import React from 'react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

/**
 * Public website pages (About Us, Book a Consultation, confirmation).
 * They use the website navbar and footer — never the dashboard sidebar.
 * Route groups do not change URLs.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F8FAFC] text-[#080F1C] overflow-x-clip font-sans min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-1 w-full">{children}</main>
      <LandingFooter />
    </div>
  );
}
