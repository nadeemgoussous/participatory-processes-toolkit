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
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const source = normalise(
  readdirSync(TOOLKIT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => readFileSync(join(TOOLKIT_DIR, f), 'utf8'))
    .join('\n')
    // the source uses markdown emphasis and table pipes around the text we quote
    .replace(/\*\*/g, '')
    .replace(/\|/g, ' ')
);

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('usage: node scripts/verify-toolkit-quotes.mjs <file...>');
  process.exit(2);
}

let checked = 0;
const missing = [];

for (const file of targets) {
  const code = readFileSync(file, 'utf8');
  // Strip comments so annotations are not treated as content.
  const body = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  // Values of these keys are references and presentation values, not quotations.
  const NOT_CONTENT = new Set(['source', 'icon', 'color', 'id', 'toolkitSection']);

  // Single- and double-quoted literals of five words or more, with the key they
  // are assigned to when there is one. Shorter strings are ids, keys and labels,
  // which the ALLOWED list covers explicitly.
  const literals =
    body.match(/(?:(\w+)\s*:\s*)?(['"])(?:(?!\2)[^\\]|\\.)*\2/g) ?? [];

  for (const match of literals) {
    const keyed = /^(\w+)\s*:\s*(.*)$/s.exec(match);
    const key = keyed ? keyed[1] : null;
    const raw = keyed ? keyed[2] : match;

    if (key && NOT_CONTENT.has(key)) continue;

    const text = raw
      .slice(1, -1)
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"');

    if (text.split(/\s+/).length < 5) continue;
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
