const fs = require('fs');
const file = 'src/app/(main)/psychometric-test/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The AI-generated paragraphs have this specific styling pattern:
content = content.replace(/<p style="font-size:9px;color:#4B5563;line-height:(1\.5|1\.55);text-align:justify;margin-bottom:6px">/g, 
  '<p style="font-size:9px;color:#4B5563;line-height:$1;text-align:justify;margin-bottom:6px;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:6">'
);

content = content.replace(/<p style="font-size:9px;color:#4B5563;line-height:(1\.5|1\.55);text-align:justify;margin-bottom:12px">/g, 
  '<p style="font-size:9px;color:#4B5563;line-height:$1;text-align:justify;margin-bottom:12px;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:8">'
);

fs.writeFileSync(file, content);
console.log('Replaced paragraph styles.');
