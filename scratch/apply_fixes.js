const fs = require('fs');
const path = require('path');

// 1. Update Topbar.tsx
const topbarPath = path.resolve('src/components/Layout/Topbar.tsx');
let topbarCode = fs.readFileSync(topbarPath, 'utf8');

topbarCode = topbarCode.replace(
  /className=\{styles\.btnTopbarCta\}/g,
  'className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm transition-all shadow-xs"'
);

topbarCode = topbarCode.replace(
  /<button className=\{styles\.bellBtn\} aria-label="Notifications">[\s\S]*?<\/button>/,
  '{/* Clean mobile header: notifications bell hidden on public pages */}'
);

fs.writeFileSync(topbarPath, topbarCode, 'utf8');
console.log('✓ Topbar.tsx updated');

// 2. Update LandingNavbar.tsx for responsive mobile logo & actions
const navbarPath = path.resolve('src/components/landing/LandingNavbar.tsx');
let navbarCode = fs.readFileSync(navbarPath, 'utf8');

// Ensure logo text doesn't overflow on 320px screens
navbarCode = navbarCode.replace(
  /<div className="text-\[19px\] sm:text-\[23px\] md:text-\[25px\] font-black tracking-\[-0\.03em\] leading-none text-\[#080F1C\]">[\s\S]*?<\/div>[\s\S]*?<div className="hidden xs:flex mt-\[3px\] sm:mt-\[5px\] items-center gap-1\.5 truncate">[\s\S]*?<\/div>/,
  `<div className="text-[17px] xs:text-[20px] sm:text-[23px] md:text-[25px] font-black tracking-[-0.03em] leading-none text-[#080F1C]">
              CLARVO
            </div>
            <div className="hidden xs:flex mt-[3px] sm:mt-[5px] items-center gap-1.5 truncate">
              <span className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] rounded-full bg-[#2563EB] shrink-0" />
              <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] font-bold text-[#64748B] truncate">
                Student Development Platform
              </span>
            </div>`
);

// Add quick "Demo" action pill for mobile next to the menu toggle
navbarCode = navbarCode.replace(
  /{!\/\* Accessible Mobile Menu Button \*\/}/,
  `{/* Mobile quick Book a Demo button */}
          <Link
            href="/book-a-demo"
            className="sm:hidden px-2.5 py-1.5 rounded-lg bg-[#E8F0FF] border border-[#2563EB]/20 text-[#2563EB] text-[11px] font-bold tracking-tight hover:bg-[#2563EB] hover:text-white transition-colors"
          >
            Demo
          </Link>
          {/* Accessible Mobile Menu Button */}`
);

fs.writeFileSync(navbarPath, navbarCode, 'utf8');
console.log('✓ LandingNavbar.tsx updated');

// 3. Update Sample Reports Hub: src/app/(main)/sample-reports/page.tsx
const sampleReportsPath = path.resolve('src/app/(main)/sample-reports/page.tsx');
let sampleReportsCode = fs.readFileSync(sampleReportsPath, 'utf8');

// Replace minmax(340px, 1fr) with responsive fluid grid
sampleReportsCode = sampleReportsCode.replace(
  /gridTemplateColumns: 'repeat\(auto-fit, minmax\(340px, 1fr\)\)'/g,
  "gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))'"
);

// Optimize container padding for mobile
sampleReportsCode = sampleReportsCode.replace(
  /padding: '56px 16px'/g,
  "padding: 'clamp(28px, 5vw, 56px) clamp(12px, 4vw, 24px)'"
);

// Optimize hero heading line height & font size
sampleReportsCode = sampleReportsCode.replace(
  /fontSize: '38px', fontWeight: 800, color: '#080F1C', letterSpacing: '-0.02em', lineHeight: '1.2'/g,
  "fontSize: 'clamp(24px, 6vw, 38px)', fontWeight: 800, color: '#080F1C', letterSpacing: '-0.02em', lineHeight: '1.18'"
);

// Optimize card padding
sampleReportsCode = sampleReportsCode.replace(
  /padding: '36px 32px'/g,
  "padding: 'clamp(20px, 4vw, 36px) clamp(16px, 3.5vw, 32px)'"
);

fs.writeFileSync(sampleReportsPath, sampleReportsCode, 'utf8');
console.log('✓ sample-reports/page.tsx updated');

// 4. Update terms/page.tsx & privacy/page.tsx to remove duplicate header
const termsPath = path.resolve('src/app/(main)/terms/page.tsx');
let termsCode = fs.readFileSync(termsPath, 'utf8');
termsCode = termsCode.replace(
  /\{\/\* HEADER \*\/\}[\s\S]*?<\/header>/,
  '{/* Header provided consistently by AppShell Topbar */}'
);
fs.writeFileSync(termsPath, termsCode, 'utf8');
console.log('✓ terms/page.tsx updated (duplicate header removed)');

const privacyPath = path.resolve('src/app/(main)/privacy/page.tsx');
let privacyCode = fs.readFileSync(privacyPath, 'utf8');
privacyCode = privacyCode.replace(
  /\{\/\* HEADER \*\/\}[\s\S]*?<\/header>/,
  '{/* Header provided consistently by AppShell Topbar */}'
);
fs.writeFileSync(privacyPath, privacyCode, 'utf8');
console.log('✓ privacy/page.tsx updated (duplicate header removed)');

console.log('All baseline fixes applied successfully.');

