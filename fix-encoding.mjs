// fix-encoding.mjs
// Run from your project root: node fix-encoding.mjs

import fs from 'fs';
import path from 'path';

const STAFF_DIR = './src/content/staff';

const files = fs.readdirSync(STAFF_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(STAFF_DIR, file);

  // Read as binary (latin1 preserves every byte as-is)
  let content = fs.readFileSync(filePath, 'latin1');
  const original = content;

  // These are UTF-8 smart quote bytes misread as latin1
  content = content
    .replace(/\xc3\xa2\xc2\x80\xc2\x99/g, "'")   // â€™  right single quote / apostrophe
    .replace(/\xc3\xa2\xc2\x80\xc2\x98/g, "'")   // â€˜  left single quote
    .replace(/\xc3\xa2\xc2\x80\xc2\x9c/g, '"')   // â€œ  left double quote
    .replace(/\xc3\xa2\xc2\x80\xc2\x9d/g, '"')   // â€   right double quote
    .replace(/\xc3\xa2\xc2\x80\xc2\x94/g, '—')   // â€"  em dash
    .replace(/\xc3\xa2\xc2\x80\xc2\x93/g, '–')   // â€"  en dash
    .replace(/\xc3\xa2\xc2\x80\xc2\xa6/g, '…')   // â€¦  ellipsis

  if (content !== original) {
    // Write back as utf-8
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed encoding in ${file}`);
  } else {
    console.log(`⏭️  No changes needed in ${file}`);
  }
}

console.log('\nDone!');
