// Checks that the text in the toolkit data files appears in docs/toolkit/.
//
// Run: node scripts/verify-toolkit-quotes.mjs
// Exits non-zero if any string cannot be found in the source chapters.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const TOOLKIT_DIR = 'docs/toolkit';

// Strings that are structural rather than quoted: ids, labels we compose, and
// headings we render in sentence case. Each needs a reason.
const ALLOWED = new Set([
  // section headings rendered in sentence case
  'Surveys and public consultations',
  'Inter-institutional steering committees, task forces and working groups',
  'Public presentations and reports',
  'Visualisation tools, games and simulations',
  'Knowledge dissemination',
  'Knowledge gathering',
  'Co-creation',
  'Policy framing',
  'Scenario development',
  'Validation',
  'Communication',
  'Workshops',
  'Interviews',
  'Networks/Hubs',
  // box and list labels rendered in sentence case
  'Box 1: Ideas for interactive workshops',
  'Box 2: Examples of survey formats',
  'Box 3: Types of interviews',
  'Box 4: Possible activities and outputs',
  'Box 5: Tools for publicly presenting and discussing scenarios',
  'Box 6: Tools for visualising and gamifying energy scenarios',
  'Format considerations',
  'Possible participants in a working group',
  'Types of presentations',
  'Methods for effective communication',
]);

function normalise(s) {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    // The layout uses non-breaking and figure hyphens inside words
    // ("Co‑ordinate") and en dashes in ranges.
    .replace(/[‐-―−]/g, '-')
    // A hyphen at a line break belongs to the word: the publication sets
    // "long-\nterm", which has to match "long-term" in the data.
    .replace(/-[ \t]*\r?\n[ \t]*/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Both the markdown transcription and the publication's own extracted text.
// The markdown is lossy — it drops Table 1's Resource requirements column and
// every figure caption — so text quoted straight from the PDF has to verify
// against the PDF.
const source = normalise(
  readdirSync(TOOLKIT_DIR)
    .filter((f) => f.endsWith('.md') || f === 'publication-text.txt')
    .map((f) => readFileSync(join(TOOLKIT_DIR, f), 'utf8'))
    .join('\n')
    // the source uses markdown emphasis and table pipes around the text we quote
    .replace(/\*\*/g, '')
    .replace(/\|/g, ' ')
    // cross-references are written as links; we quote the visible text only
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
);

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('usage: node scripts/verify-toolkit-quotes.mjs <file...>');
  process.exit(2);
}

let checked = 0;
const missing = [];

// Values of these keys are references and presentation values, not quotations.
const NOT_CONTENT = new Set(['source', 'icon', 'color', 'id', 'toolkitSection']);

/**
 * Every string literal in a source file, with the object key it is assigned to.
 *
 * This is a character scanner rather than a regular expression. Stripping
 * comments with /\/\*[\s\S]*?\*\//  silently destroyed files containing a glob
 * pattern: the `/*` inside '../assets/process-flows/*.png' reads as the start
 * of a block comment and swallows everything up to the next `*​/`.
 */
function stringLiterals(code) {
  const found = [];
  let i = 0;

  while (i < code.length) {
    const c = code[i];
    const next = code[i + 1];

    if (c === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') i += 1;
      continue;
    }
    if (c === '/' && next === '*') {
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      const start = i;
      let text = '';
      i += 1;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\') {
          text += code[i + 1];
          i += 2;
        } else {
          text += code[i];
          i += 1;
        }
      }
      i += 1;
      // Look back from the opening quote for `key:`, so reference fields can be
      // skipped. Escapes make the literal shorter than its source, so the start
      // index has to be remembered rather than derived from the text length.
      const keyed = /(\w+)\s*:\s*$/.exec(code.slice(Math.max(0, start - 60), start));
      found.push({ text, key: keyed ? keyed[1] : null });
      continue;
    }
    i += 1;
  }
  return found;
}

for (const file of targets) {
  const code = readFileSync(file, 'utf8');

  for (const { text, key } of stringLiterals(code)) {
    if (key && NOT_CONTENT.has(key)) continue;
    if (text.split(/\s+/).filter(Boolean).length < 5) continue;
    if (ALLOWED.has(text)) continue;

    checked += 1;
    if (!source.includes(normalise(text))) {
      missing.push({ file, text });
    }
  }
}

if (missing.length > 0) {
  console.error(`\nNot found in ${TOOLKIT_DIR}:\n`);
  for (const m of missing) {
    console.error(`  ${m.file}`);
    console.error(`    ${m.text}\n`);
  }
  console.error(`${missing.length} of ${checked} strings unverified.`);
  process.exit(1);
}

console.log(`${checked} strings verified against ${TOOLKIT_DIR}.`);
