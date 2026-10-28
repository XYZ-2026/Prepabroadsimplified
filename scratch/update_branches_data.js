const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/career-library/branches_data.js');
let content = fs.readFileSync(targetPath, 'utf-8');

// 1. Update CLUSTERS to include 'aviation-maritime'
if (!content.includes("'aviation-maritime'")) {
  const clusterSearch = "'pure-science':{name:'Pure & Applied Sciences',icon:'🔭',max:2,stream:'science-health'}\n};";
  const clusterReplace = "'pure-science':{name:'Pure & Applied Sciences',icon:'🔭',max:2,stream:'science-health'},\n  // — added in v4: aviation, maritime & transport (PCM pathway) —\n  'aviation-maritime':{name:'Aviation, Maritime & Transport',icon:'✈️',max:1,stream:'engineering'}\n};";
  
  if (content.includes(clusterSearch)) {
    content = content.replace(clusterSearch, clusterReplace);
  } else {
    // try with \r\n
    const clusterSearchCRLF = "'pure-science':{name:'Pure & Applied Sciences',icon:'🔭',max:2,stream:'science-health'}\r\n};";
    const clusterReplaceCRLF = "'pure-science':{name:'Pure & Applied Sciences',icon:'🔭',max:2,stream:'science-health'},\r\n  // — added in v4: aviation, maritime & transport (PCM pathway) —\r\n  'aviation-maritime':{name:'Aviation, Maritime & Transport',icon:'✈️',max:1,stream:'engineering'}\r\n};";
    content = content.replace(clusterSearchCRLF, clusterReplaceCRLF);
  }
  console.log('Updated CLUSTERS with aviation-maritime');
}

console.log('CLURSTERS verified');
