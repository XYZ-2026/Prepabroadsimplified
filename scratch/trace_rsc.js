const fs = require('fs');
const html = fs.readFileSync('scratch/response.html', 'utf-8');

const regex = /["$]26["$:]/g;
let match;
while ((match = regex.exec(html)) !== null) {
  const start = Math.max(0, match.index - 80);
  const end = Math.min(html.length, match.index + 80);
  console.log('--- MATCH AT', match.index, '---');
  console.log(html.slice(start, end));
}
