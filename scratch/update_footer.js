const fs = require('fs');
const path = require('path');

const footerPath = path.resolve('src/components/landing/LandingFooter.tsx');
let code = fs.readFileSync(footerPath, 'utf8');

code = code.replace(
  'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14',
  'grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14'
);

code = code.replace(
  'col-span-2 sm:col-span-2 lg:col-span-1 max-w-[320px]',
  'col-span-1 xs:col-span-2 lg:col-span-1 max-w-[360px]'
);

fs.writeFileSync(footerPath, code, 'utf8');
console.log('✓ LandingFooter.tsx updated for fluid mobile grid');

