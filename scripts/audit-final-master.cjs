#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const ROOT = path.resolve(__dirname, '..');
const filePath = path.join(ROOT, 'Career_Roadmap_SIMPLE_MASTER_FINAL.xlsx');

const EXPECTED_COLUMNS = [
  'Stream Category',
  'Subject Combination',
  'Degree / Course Title',
  'Typical Duration',
  'Core Focus Areas',
  'Eligibility',
  'Entrance Exam',
  'Admission Route',
  'Specialisation',
  'Career Domain',
  'Career Options',
  'Job Roles',
  'Further Study',
  'Study Abroad / University',
  'Source',
  'Verification Status',
];

async function runAudit() {
  console.log('🔍 Auditing Career_Roadmap_SIMPLE_MASTER_FINAL.xlsx...\n');

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const stats = fs.statSync(filePath);
  console.log(`📁 File Size: ${(stats.size / 1024).toFixed(2)} KB`);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);

  // 1. Sheet checks
  console.log(`📑 Worksheet Count: ${wb.worksheets.length}`);
  const sheetNames = wb.worksheets.map(w => w.name);
  console.log(`📑 Worksheet Names: ${JSON.stringify(sheetNames)}`);

  if (wb.worksheets.length !== 1 || sheetNames[0] !== 'ROADMAP_DATA') {
    throw new Error(`Invalid worksheets! Expected exactly 1 sheet named "ROADMAP_DATA" but got: ${JSON.stringify(sheetNames)}`);
  }

  const ws = wb.getWorksheet('ROADMAP_DATA');
  console.log(`📊 Total Rows (including header): ${ws.rowCount}`);

  // 2. Header / Column checks
  const headerRow = ws.getRow(1);
  const actualHeaders = [];
  headerRow.eachCell((cell, colNum) => {
    actualHeaders.push(String(cell.value || '').trim());
  });

  console.log(`\n📋 Header Columns Count: ${actualHeaders.length}`);
  let headersMatch = true;
  EXPECTED_COLUMNS.forEach((exp, idx) => {
    const act = actualHeaders[idx];
    if (act !== exp) {
      console.error(`❌ Column mismatch at index ${idx}: expected "${exp}", got "${act}"`);
      headersMatch = false;
    }
  });

  if (!headersMatch || actualHeaders.length !== EXPECTED_COLUMNS.length) {
    throw new Error('Column schema does not match 16 required columns in exact order!');
  }
  console.log('✅ Exactly 16 columns matching specified schema in exact order!');

  // 3. Scan data cells for issues
  let rowCount = 0;
  let count22 = 0;
  let countNotInSource = 0;
  let countLinkRows = 0;
  let countTechIds = 0;

  const distinctSets = {};
  EXPECTED_COLUMNS.forEach(c => { distinctSets[c] = new Set(); });

  const streamRows = {};

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    rowCount++;

    const rowObj = {};
    EXPECTED_COLUMNS.forEach((col, idx) => {
      const cellVal = row.getCell(idx + 1).value;
      const strVal = cellVal !== null && cellVal !== undefined ? String(cellVal).trim() : '';
      rowObj[col] = strVal;

      if (strVal === '22') count22++;
      if (strVal === 'NOT_IN_SOURCE') countNotInSource++;
      if (strVal.startsWith('LINK:')) countLinkRows++;
      if (/^(prog_|spec_|career_|prof_|exam_|edge_|field_)/i.test(strVal)) countTechIds++;

      if (strVal) distinctSets[col].add(strVal);
    });

    const cat = rowObj['Stream Category'] || 'Uncategorized';
    if (!streamRows[cat]) streamRows[cat] = [];
    streamRows[cat].push(rowObj);
  }

  console.log(`\n📈 Data Rows: ${rowCount}`);
  console.log(`🚫 "22" Placeholder Occurrences: ${count22}`);
  console.log(`🚫 "NOT_IN_SOURCE" Occurrences: ${countNotInSource}`);
  console.log(`🚫 "LINK:" Edge Rows: ${countLinkRows}`);
  console.log(`🚫 Technical ID Occurrences: ${countTechIds}`);

  if (count22 > 0 || countNotInSource > 0 || countLinkRows > 0 || countTechIds > 0) {
    throw new Error('Data quality check failed!');
  }
  console.log('✅ Clean data quality: Zero placeholders, zero technical links, zero database IDs!');

  // 4. Breakdown by Stream Category
  console.log('\n📊 Stream Category Breakdown:');
  Object.keys(streamRows).sort().forEach(cat => {
    console.log(`  - ${cat}: ${streamRows[cat].length} rows`);
  });

  // 5. Distinct statistics
  console.log('\n📈 Distinct Element Counts:');
  EXPECTED_COLUMNS.forEach(col => {
    console.log(`  - ${col}: ${distinctSets[col].size} distinct values`);
  });

  // 6. Inspect sample rows from each category
  console.log('\n🔍 Sample Data Rows Across Categories:');
  Object.keys(streamRows).sort().forEach(cat => {
    const sample = streamRows[cat][0];
    console.log(`\n📌 [${cat}] Sample Row:`);
    console.log(`   Degree: ${sample['Degree / Course Title']}`);
    console.log(`   Subject: ${sample['Subject Combination']}`);
    console.log(`   Duration: ${sample['Typical Duration']}`);
    console.log(`   Focus: ${sample['Core Focus Areas']}`);
    console.log(`   Specialisation: ${sample['Specialisation']}`);
    console.log(`   Domain: ${sample['Career Domain']}`);
    console.log(`   Career: ${sample['Career Options']}`);
    console.log(`   Job Roles: ${sample['Job Roles']}`);
    console.log(`   Entrance Exam: ${sample['Entrance Exam']}`);
  });

  console.log('\n🎉 AUDIT COMPLETED SUCCESSFULLY! ALL REQUIREMENTS PASSED!');
}

runAudit().catch(err => {
  console.error('\n❌ Audit Failed:', err.message);
  process.exit(1);
});
