// Puts the single-file offline build beside the hosted site, so a facilitator
// can download it from the footer link. Run after `build` and `build:offline`.
//
// The copy is made after vite has written the service worker, so it is not in
// the precache and costs nothing until someone downloads it.

import { copyFileSync, existsSync } from 'node:fs';

const from = 'dist-offline/index.html';
const to = 'dist/participatory-processes-toolkit-offline.html';

for (const f of [from, 'dist/index.html']) {
  if (!existsSync(f)) throw new Error(`${f} is missing: run build and build:offline first.`);
}
copyFileSync(from, to);
console.log(`Copied ${from} to ${to}`);
