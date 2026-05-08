import fs from "fs";
import path from "path";

/**
 * CONFIG
 */
const INPUT_CSV = "data/staff.csv";
const OUTPUT_DIR = "src/content/staff";
const OVERWRITE_EXISTING = false;

/**
 * Default flags (CMS-friendly)
 */
const DEFAULT_DRAFT = false;
const DEFAULT_ACTIVE = true;

/**
 * Ensure output directory exists
 */
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Robust CSV parser:
 * - Quoted fields
 * - Commas inside quotes
 * - Newlines inside quotes
 */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
    } else if (char === "\n" && !inQuotes) {
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  if (current.length || row.length) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

/**
 * Normalize bio text:
 * - Convert </br> and <br> to Markdown paragraphs
 * - Trim whitespace
 */
function normalizeBio(bio = "") {
  return bio
    .replace(/<\/br\s*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n\n")
    .trim();
}

/**
 * Read CSV
 */
const rawCSV = fs.readFileSync(INPUT_CSV, "utf-8");
const [headerRow, ...dataRows] = parseCSV(rawCSV);

const headers = headerRow.map((h) => h.trim());

/**
 * Process rows
 */
for (const row of dataRows) {
  if (!row.length || !row[0]) continue;

  const record = Object.fromEntries(
    headers.map((h, i) => [h, (row[i] || "").trim()]),
  );

  const { slug, name, title, bio, photo, order } = record;

  if (!slug || !name || !title) {
    console.warn("⚠️ Skipping invalid row:", record);
    continue;
  }

  const outputPath = path.join(OUTPUT_DIR, `${slug}.md`);

  if (fs.existsSync(outputPath) && !OVERWRITE_EXISTING) {
    console.log(`⏭️  Skipping existing file: ${slug}.md`);
    continue;
  }

  const normalizedBio = normalizeBio(bio);

  const frontmatter = `---
name: "${name}"
title: "${title}"
photo: "${photo}"
order: ${Number(order) || 0}
draft: ${DEFAULT_DRAFT}
active: ${DEFAULT_ACTIVE}
${normalizedBio ? `bio: |-\n  ${normalizedBio.replace(/\n/g, "\n  ")}` : ""}
---
`;

  fs.writeFileSync(outputPath, frontmatter.trim() + "\n");

  console.log(`✅ Seeded staff: ${slug}`);
}

console.log("🎉 Staff seeding complete.");
