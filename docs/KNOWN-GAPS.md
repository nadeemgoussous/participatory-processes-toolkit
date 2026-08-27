# Known gaps and technical debt

Verified on **2026-08-26** against commit `c18b571`, Node 22, clean `npm install`.
Everything here was reproduced, not inferred. Items are ordered by how much they should
influence a large change, not by effort.

Baseline that *does* work: `npm run typecheck` is clean, `npm run build` succeeds
(~75 s, service worker and manifest emitted), `npm run test:quality` runs 189 stakeholder ×
scenario combinations with 0 issues and 1 informational similarity warning.

---

## 1. The Ollama tier only exists on the dev server

`DEFAULT_AI_CONFIG.ollamaUrl` is `/api/ollama`, which is a **Vite dev-server proxy**
(`vite.config.ts`). A production build has no proxy, so in `npm run preview`, a USB copy or
the GitHub Pages deployment the Ollama tier fails every request and the chain falls through
to rule-based. The UI still offers "Ollama" in the backend selector and shows an Ollama
status indicator there.

Fix options: point `ollamaUrl` at `http://localhost:11434` and document
`OLLAMA_ORIGINS=*` for CORS, ship a small local proxy with the packaged build, or hide the
Ollama option when `import.meta.env.PROD`.

## 2. The cloud AI tier is a stub presented as a feature

`enhanceWithCloudAPI()` in `src/utils/stakeholder-ai.ts` logs a debug line and returns
`null`; no request is made, no key is read. README and older docs described it as an
available tier — those claims have been corrected, but the config surface
(`cloudEnabled`, `cloudProvider`, `cloudApiKey`) still implies it works.

If it is ever built: no provider key may live in the client bundle (`VITE_*` is public).
Route it through a proxy the organiser controls, and keep it off by default.

## 3. First load ships a 6.6 MB JavaScript bundle

`import * as webllm from '@mlc-ai/web-llm'` is a static import in `stakeholder-ai.ts`, so
the WebLLM runtime lands in the main chunk: `dist/assets/index-*.js` = **6.6 MB**
(2.3 MB gzipped), precache 26 entries ≈ 6.5 MB. Every participant downloads it, including
those who never enable AI, typically over a shared workshop connection.

Fix: `const webllm = await import('@mlc-ai/web-llm')` inside the WebLLM tier, plus a
`manualChunks` split for Recharts. This is the largest single first-load win available.

## 4. Fonts come from a CDN, which contradicts offline-first

`src/index.css` line 4 imports Inter and Montserrat from `fonts.googleapis.com`. The
`@import` survives into `dist/assets/index-*.css`, and no Workbox `runtimeCaching` rule
covers `fonts.googleapis.com` / `fonts.gstatic.com`. A cold offline load therefore falls
back to `system-ui`, and every online load makes a third-party request.

Fix: self-host both families in `public/fonts/` with `@font-face`, or add a
`CacheFirst` runtime rule for the two font hosts. Self-hosting is the honest fix for an
air-gapped workshop.

## 5. The Playwright suite is substantially stale — including the critical offline specs

**Scale (Chromium, the 36 spec files that exclude the WebLLM/AI ones):** one full run gave
**185 passed, 3 skipped, and at least 59 failed** — roughly a quarter of the suite. The exact
failure count was not captured (the reporter output was truncated, and the re-run that would
have produced a precise per-file breakdown was stopped). To measure it:

```bash
npx playwright test --project=chromium --reporter=json > results.json
```

Failures were observed in at least: `02`, `06`, `07`, `31-export-guidance`,
`33-indexeddb-storage`, `35-tooltips`, `44-stakeholder-enhancements`,
`45-enhanced-ui-integration`, `46-csv-upload`. Treat "the suite is green" as false until
someone re-baselines it.

**Verified in isolation — 17 failures across three files:**

- **`02-offline-functionality.spec.ts` — all 3 fail.**
  - expects the header to read `Offline Mode`; `Header.tsx` renders `Offline`
  - expects the text `Welcome to the Scenario Dialogue Tool`; no component contains it
  - the "PWA cache" test fails with `net::ERR_INTERNET_DISCONNECTED`, because the suite runs
    against `npm run dev` and **vite-plugin-pwa generates no service worker in dev**
    (`devOptions` is not enabled). Offline cold-start is therefore *not covered by any
    passing test* — verify it by hand against `npm run preview` before a workshop.
- **`06-response-generator.spec.ts` (6) and `07-calculations.spec.ts` (8) — fail entirely.**
  Both build fixtures in the removed flat schema (`milestoneYears`, `supply.capacity.<tech>`)
  while the functions under test iterate `scenario.milestones`.

Note that these specs are also **timing-sensitive**: a cold dev server produced a different
failure mode (`Failed to fetch dynamically imported module`) than a warm one. Any
re-baselining should run them twice before trusting a result.

**Structural problems, independent of the failures:**

- Pure-logic tests (`04`, `05`, `07`, …) run in a browser via
  `page.evaluate(() => import('/src/utils/...'))`, so they need a dev server and a browser to
  test a pure function. A unit runner (Vitest) would make these fast, debuggable and
  CI-friendly; Playwright should keep only genuine UI flows.
- `03-typescript-compilation.spec.ts` shells out to `npx tsc --noEmit` from inside a
  Playwright test. That is what `npm run typecheck` is for.
- Several specs assert on UI copy where a `data-testid` already exists.
- The WebLLM specs download ~1.8 GB when run; they are not safe in a default `npm test` and
  are excluded from routine runs by convention only.
- A full Chromium run of the non-AI files takes **~36 minutes**, which is why nobody runs it.

Recommendation before the next big change: get an exact baseline, add Vitest for `utils/`
and `data/` and port the logic specs to it, fix or delete the stale UI assertions, and add a
Playwright project pointed at `npm run preview` for the PWA tests. The suite should be fast
enough and honest enough to gate CI.

## 6. CI does not gate anything

`.github/workflows/deploy.yml` builds and deploys on push to `master`. There is no
typecheck, no test run, no `test:quality`, and no pull-request workflow — a red suite or a
broken schema reaches Pages as long as `vite build` succeeds. (Node in CI has been aligned
to 22 to match local development.)

## 7. No linter or formatter

There is no ESLint or Prettier configuration in the repo. TypeScript strict mode catches
type errors, but nothing catches unused effects, missing hook dependencies, accidental
`any`, or inconsistent formatting. `eslint` + `typescript-eslint` +
`eslint-plugin-react-hooks` is the conventional baseline for this stack, and hook-dependency
lint would be genuinely useful in `StakeholderTab.tsx`.

## 8. `StakeholderTab.tsx` is 1 239 lines

It contains the tab, the system-capability checker, the Ollama status indicator, the backend
selector, settings persistence, response generation and streaming state. It is the file most
likely to be touched by any dialogue-side change and the hardest to touch safely. Extract the
capability/backend logic into a hook (`useAIBackend`) and the indicators into components
before adding to it.

## 9. CSV parsing is naive

`src/utils/csv-parser.ts` splits lines on `,` with no quoted-field handling, so any exported
CSV containing quoted values with commas (common in scenario or country name columns)
mis-parses. Technologies that match no regex are silently dropped — the user only notices in
the preview. A small parser or a dependency such as PapaParse would remove a class of
workshop-day surprises.

## 10. The build cannot be opened from disk

`base: '/stakeholder-dialogue/'` in `vite.config.ts` makes every asset reference absolute, so
`dist/index.html` fails from `file://` and from the root of a static server — the exact two
things someone hands a USB drive will try. A relative-base build
(`npx vite build --base=./`) works, but nothing in the repo produces one and older
documentation told participants to "open dist/index.html".

Fix: add a `build:offline` script for the relative-base build, and treat it as the artefact
for USB distribution. `docs/WORKSHOP-DEPLOYMENT.md` now documents the workaround.

## 11. Console noise in production

`stakeholder-ai.ts`, `useWebLLM.ts` and `StakeholderTab.tsx` log emoji-prefixed diagnostics
unconditionally, including on the happy path. Gate them behind
`import.meta.env.DEV` or a debug flag.

## 12. Smaller items

- **Manifest colour**: `theme_color` / `background_color` are `#005a82`; the brand blue is
  `#0078a7` (`vite.config.ts`, `index.html`).
- **Dead asset glob**: `includeAssets` lists `templates/*.xlsx`, but `public/templates/`
  does not exist (the Excel template, F013/F014, was never built).
- **Stale tracker**: `feature_list.json` marked F040 (README) as deferred although
  `README.md` has existed for a long time. Corrected; check the other deferred entries
  (F013, F014, F034, F041, F042) still reflect intent.
- **No public remote**: the only git remote is `v1`, a local folder. `README.md` pointed at
  `github.com/IRENA/stakeholder-dialogue-tool`, which is not configured here — wording
  softened, but the deploy workflow assumes a GitHub repo with Pages enabled.
- **`npm run build` is slow** (~75 s) largely because of the single huge chunk; fixing #3
  helps here too.
- **browserslist data is 8 months old** — `npx update-browserslist-db@latest` clears the
  build warning.

---

## What is genuinely solid

Worth knowing before a rewrite, so it is not thrown away:

- The rule-based response engine — 182 deduplicated templates, Gaussian + recency scoring,
  shuffle bags, conditional interpolation and grammar cleanup — is the most valuable and
  best-tested part of the codebase, and it is the part that guarantees the offline promise.
- `npm run test:quality` is a fast, browser-free quality gate over ~190 combinations.
- The milestone-based, unit-tagged scenario schema handles messy model output well and is
  the right abstraction to build on.
- Soft-metric discipline is real: there is no LCOE, tariff or reliability calculation
  anywhere in `src/`.
