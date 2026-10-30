const fs = require('fs');
const path = require('path');

const p = path.resolve('src/app/(main)/demo-confirmation/page.tsx');
let code = fs.readFileSync(p, 'utf8');
code = code.replace(
  "padding: '48px 16px'",
  "padding: 'clamp(24px, 5vw, 48px) clamp(12px, 3.5vw, 20px)'"
);
code = code.replace(
  "padding: '48px 36px'",
  "padding: 'clamp(28px, 5vw, 48px) clamp(18px, 4vw, 36px)'"
);
fs.writeFileSync(p, code, 'utf8');
console.log('✓ demo-confirmation updated');

