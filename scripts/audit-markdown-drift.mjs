// Reports which quoted strings exist in the publication and which exist only
// in the hand-made markdown transcription.
//
// `npm run verify:quotes` accepts either source, so a string invented by the
// transcription still passes. This separates them.
//
//   node scripts/audit-markdown-drift.mjs src/data/*.ts

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const TOOLKIT_DIR = 'docs/toolkit';
const PUBLICATION = 'publication-text.txt';

function normalise(s) {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/-[ \t]*\r?\n[ \t]*/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function load(predicate) {
  return normalise(
    readdirSync(TOOLKIT_DIR)
      .filter(predicate)
      .map((f) => readFileSync(join(TOOLKIT_DIR, f), 'utf8'))
      .join('\n')
      .replace(/\*\*/g, '')
      .replace(/\|/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  );
}

const publication = load((f) => f === PUBLICATION);
const markdown = load((f) => f.endsWith('.md'));

const NOT_CONTENT = new Set(['source', 'icon', 'color', 'id', 'toolkitSection']);

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
      const keyed = /(\w+)\s*:\s*$/.exec(code.slice(Math.max(0, start - 60), start));
      found.push({ text, key: keyed ? keyed[1] : null });
      continue;
    }
    i += 1;
  }
  return found;
}

const files = process.argv.slice(2);
const invented = [];
let inPublication = 0;
let neither = 0;

for (const file of files) {
  for (const { text, key } of stringLiterals(readFileSync(file, 'utf8'))) {
    if (key && NOT_CONTENT.has(key)) continue;
    if (text.split(/\s+/).filter(Boolean).length < 5) continue;
    const n = normalise(text);
    if (publication.includes(n)) {
      inPublication += 1;
    } else if (markdown.includes(n)) {
      invented.push({ file, text });
    } else {
      neither += 1;
    }
  }
}

console.log(`in the publication          : ${inPublication}`);
console.log(`ONLY in the markdown        : ${invented.length}`);
console.log(`in neither (check manually) : ${neither}`);

if (invented.length) {
  console.log('\nStrings the transcription introduced:\n');
  const byFile = new Map();
  for (const { file, text } of invented) {
    if (!byFile.has(file)) byFile.set(file, []);
    byFile.get(file).push(text);
  }
  for (const [file, texts] of byFile) {
    console.log(`  ${file}  (${texts.length})`);
    for (const t of texts.slice(0, 8)) console.log(`    ${t.slice(0, 110)}`);
    if (texts.length > 8) console.log(`    ... and ${texts.length - 8} more`);
    console.log();
  }
}
