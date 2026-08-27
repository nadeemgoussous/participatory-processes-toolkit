// Folds the offline build into a single self-contained index.html.
//
// Run after `vite build --mode offline`. That build emits one classic IIFE
// bundle and one stylesheet; this inlines both, so the result is a file a
// browser opens directly from disk with no server and no network.
//
// Run: node scripts/build-offline.mjs

import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'dist-offline';
const html = join(DIR, 'index.html');

let doc = readFileSync(html, 'utf8');

const js = readFileSync(join(DIR, 'app.js'), 'utf8');
const css = readFileSync(join(DIR, 'app.css'), 'utf8');

// A module script cannot run from file://; the bundle is already IIFE, so it
// is inlined as a classic script. Vite emits the tag in <head>, where a module
// would be deferred — a classic script is not, and would run before #root
// exists, so it moves to the end of <body>.
doc = doc.replace(/\s*<script[^>]*src="\.\/app\.js"[^>]*><\/script>/, '');
doc = doc.replace(
  '</body>',
  // The bundle can contain the literal characters "</script>" inside a string,
  // which would close the tag early. Splitting the sequence avoids that.
  () => `  <script>\n${js.replace(/<\/script>/gi, '<\\/script>')}\n  </script>\n  </body>`
);

doc = doc.replace(
  /<link[^>]*rel="stylesheet"[^>]*href="\.\/app\.css"[^>]*>/,
  () => `<style>\n${css}\n</style>`
);

// The icons and manifest are separate files that file:// cannot fetch either.
doc = doc
  .replace(/\s*<link[^>]*rel="icon"[^>]*>/g, '')
  .replace(/\s*<link[^>]*rel="apple-touch-icon"[^>]*>/g, '')
  .replace(/\s*<link[^>]*rel="manifest"[^>]*>/g, '');

if (doc.includes('./app.js') || doc.includes('./app.css')) {
  console.error('Inlining failed: index.html still references an external asset.');
  process.exit(1);
}

writeFileSync(html, doc);

// Everything else in the directory is now dead weight.
for (const entry of readdirSync(DIR)) {
  if (entry !== 'index.html') rmSync(join(DIR, entry), { recursive: true, force: true });
}

const kb = (Buffer.byteLength(doc) / 1024).toFixed(0);
console.log(`${DIR}/index.html is self-contained (${kb} kB). Open it directly in a browser.`);
