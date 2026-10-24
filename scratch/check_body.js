const fs = require('fs');
const html = fs.readFileSync('scratch/response.html', 'utf-8');

// Print the visible HTML elements
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (bodyMatch) {
  // strip scripts
  let body = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '');
  console.log('Cleaned HTML body:\n', body);
} else {
  console.log('No body tag found');
}
