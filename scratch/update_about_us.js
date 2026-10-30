const fs = require('fs');
const path = require('path');

const aboutPath = path.resolve('src/app/(main)/about-us/page.tsx');
let code = fs.readFileSync(aboutPath, 'utf8');

// 1. Replace repetitive static py-20 with responsive padding
code = code.replace(/className="([^"]*?)py-20([^"]*?)"/g, (match, p1, p2) => {
  return `className="${p1}py-10 sm:py-16 md:py-20${p2}"`;
});

// 2. Adjust hero section padding: pt-16 md:pt-24 pb-20 -> pt-8 sm:pt-14 md:pt-20 pb-10 sm:pb-16
code = code.replace(
  'pt-16 md:pt-24 pb-20 px-4 md:px-8',
  'pt-8 sm:pt-14 md:pt-20 pb-10 sm:pb-16 px-3.5 sm:px-6 md:px-8'
);

// 3. Make hero title clamp on mobile
code = code.replace(
  'text-4xl sm:text-6xl font-extrabold tracking-tight text-[#080F1C] leading-[1.15] mb-6',
  'text-[28px] xs:text-[34px] sm:text-[46px] md:text-[54px] font-extrabold tracking-tight text-[#080F1C] leading-[1.12] mb-4 sm:mb-6'
);

// 4. Optimize corporate block padding: p-8 md:p-12 -> p-5 sm:p-8 md:p-12
code = code.replace(
  'p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl',
  'p-4 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl'
);

code = code.replace(
  'p-8 md:p-12 rounded-3xl border border-[#E4E7EC] shadow-sm mb-12',
  'p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-[#E4E7EC] shadow-sm mb-8 sm:mb-12'
);

fs.writeFileSync(aboutPath, code, 'utf8');
console.log('✓ about-us/page.tsx updated with responsive padding & typography');

