const fs = require('fs');
const file = 'src/app/(main)/psychometric-test/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Tighten the Timeline Roadmap container (Senior)
content = content.replace(
  '<div style="display:flex;flex-direction:column;gap:5px;justify-content:flex-start;position:relative">',
  '<div style="display:flex;flex-direction:column;gap:3px;justify-content:flex-start;position:relative">'
);

// Tighten the Timeline Roadmap items (Senior)
content = content.replace(
  /<div style="border:1px solid #E5E7EB;border-radius:6px;padding:6px 8px;background:#fff;display:flex;align-items:flex-start;gap:8px;/g,
  '<div style="border:1px solid #E5E7EB;border-radius:6px;padding:4px 6px;background:#fff;display:flex;align-items:flex-start;gap:6px;'
);

// Further clamp the action lines
content = content.replace(
  /\.slice\(0, 2\)\.map\(\(act: string\) => `• \${esc\(act\)}`\)/g,
  '.slice(0, 1).map((act: string) => `• ${esc(act)}`)' // Only 1 action!
);

fs.writeFileSync(file, content);
console.log('Fixed timeline roadmap sizes.');
