const fs = require('fs');
const path = require('path');

const demoPath = path.resolve('src/app/(main)/book-a-demo/page.tsx');
let code = fs.readFileSync(demoPath, 'utf8');

// 1. Refine the step labels in progress bar to be hidden on extra small screens (< sm) so they don't awkwardly truncate into 3 letters
code = code.replace(
  'span className={`text-[10px] sm:text-[11px] font-semibold text-center truncate',
  'span className={`hidden sm:block text-[11px] font-semibold text-center truncate'
);

// 2. Adjust card padding on mobile: p-5 sm:p-8 md:p-10 -> p-4 sm:p-8 md:p-10
code = code.replace(
  'className="p-5 sm:p-8 md:p-10"',
  'className="p-3.5 sm:p-8 md:p-10"'
);

// 3. Make actions footer padding responsive: px-5 sm:px-8 py-4 -> px-3.5 sm:px-8 py-3.5 sm:py-4
code = code.replace(
  'className="bg-[#FAFBFD] border-t border-[#E2E8F0] px-5 sm:px-8 py-4 flex items-center justify-between gap-4"',
  'className="bg-[#FAFBFD] border-t border-[#E2E8F0] px-3.5 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-2.5 sm:gap-4"'
);

fs.writeFileSync(demoPath, code, 'utf8');
console.log('✓ book-a-demo/page.tsx updated with mobile ergonomics');

