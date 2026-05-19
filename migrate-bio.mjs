// migrate-bio.mjs
// Run from your project root: node migrate-bio.mjs

import fs from 'fs';
import path from 'path';

const STAFF_DIR = './src/content/staff';

const files = fs.readdirSync(STAFF_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(STAFF_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');

  // Grab everything between the --- delimiters
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    console.log(`⚠️  Skipping ${file} — couldn't find frontmatter`);
    continue;
  }

  const frontmatterBlock = match[1];
  const lines = frontmatterBlock.split('\n');

  const frontmatterLines = [];
  const bioLines = [];

  for (const line of lines) {
    const isYamlKey = /^\w[\w\s]*:/.test(line);
    const isEmpty = line.trim() === '';

    if (isYamlKey) {
      frontmatterLines.push(line);
    } else if (isEmpty && bioLines.length === 0) {
      // skip blank lines before bio starts
    } else if (!isEmpty) {
      bioLines.push(line.trim());
    } else {
      // blank line within bio
      bioLines.push('');
    }
  }

  // Clean up bio: collapse multiple blank lines, trim
  const bio = bioLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!bio) {
    console.log(`⏭️  Skipping ${file} — no bio content found`);
    continue;
  }

  const newFrontmatter = frontmatterLines.join('\n').trim();
  const newContent = `---\n${newFrontmatter}\n---\n\n${bio}\n`;

  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`✅ Migrated ${file}`);
}

console.log('\nDone! Restart your dev server.');
