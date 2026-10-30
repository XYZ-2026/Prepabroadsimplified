const fs = require('fs');
const path = require('path');

const discoverPath = path.resolve('src/app/(main)/discover/page.tsx');
let code = fs.readFileSync(discoverPath, 'utf8');

// 1. Heading typography clamp
code = code.replace(
  'text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-[1.08] text-slate-900 mb-6',
  'text-[28px] xs:text-[34px] sm:text-[46px] md:text-[56px] font-display font-extrabold tracking-tight leading-[1.1] text-slate-900 mb-4 sm:mb-6'
);

// 2. Hero padding
code = code.replace(
  'pt-10 pb-20 px-4 md:px-8 relative overflow-hidden',
  'pt-6 sm:pt-12 pb-10 sm:pb-18 px-3.5 sm:px-6 md:px-8 relative overflow-hidden'
);

// 3. Make sure CTAs stack nicely
code = code.replace(
  'className="flex flex-col sm:flex-row items-center gap-4 mb-8"',
  'className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 w-full sm:w-auto"'
);

fs.writeFileSync(discoverPath, code, 'utf8');
console.log('✓ discover/page.tsx updated with responsive typography & padding');

