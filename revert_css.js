const fs = require('fs');
const file = 'src/app/(main)/psychometric-test/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/zoom: 1\.35;/gi, 'transform: scale(1.35);\ntransform-origin: top left;\nmargin-bottom: 76.792mm;\nmargin-right: 54.444mm;');

content = content.replace(/\.as-nv-career-item, \.as-nv-score-desc-box, \.as-nv-resp-table tr, \.as-timeline-card \{\s*\}/gi, '.as-nv-career-item, .as-nv-score-desc-box, .as-nv-resp-table tr, .as-timeline-card { page-break-inside: avoid; break-inside: avoid; }');

content = content.replace(/border:1px solid #690B1B20;border-radius:10px;padding:12px;background:#FFFDFD;/gi, 'border:1px solid #690B1B20;border-radius:10px;padding:12px;background:#FFFDFD;page-break-inside:avoid;break-inside:avoid;');

fs.writeFileSync(file, content);
console.log('Reverted zoom to transform and restored page-breaks.');
