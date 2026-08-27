# Known gaps and technical debt

Verified on **2026-08-27** against the `toolkit-pivot` branch, Node 22.

Baseline: `npm run typecheck` clean, `npm run verify:quotes` passes 612 strings,
`npm run build` produces 301 kB (92 kB gzipped), `npm run build:offline` produces a single
322 kB `dist-offline/index.html`, `npm run test:chromium` passes 13 tests in ~50 s.

---

## Open

### 1. Chapters 1, 2, 6 and 7 are not digitised

The app covers chapters 3, 4 and 5. Not yet in the app:

- **Chapter 2** — what participatory processes are and the four objectives they serve.
  This is the "why" a planner would want before the "how".
- **Chapter 6** — Using This Toolkit, the five current challenges, and the key takeaways.
  The challenges are the counterweight to a checklist and are referenced in the plan
  section, but only one of them is quoted there.
- **Chapter 7** — publications, survey and polling platforms, co-creation platforms,
  visualisation tools, and the two frameworks. This is a directory of external tools a
  planner can act on immediately, and it is the cheapest remaining content win.
- **Chapter 1** — how to use the toolkit, as a three-step guide.

### 2. Two stakeholder ids have no profile

`regional-bodies` and `development-partners` are not chapter 3 groups. They were added by an
earlier version of this tool. The ids remain in `StakeholderId` because `case-studies.ts`
references them; there is no profile behind them and they are not listed in the Stakeholders
section. Either the case study mappings should drop them, or the product owner should decide
they are worth carrying as clearly-marked additions.

### 3. Fonts are not self-hosted

`src/index.css` asks for Inter and Montserrat and falls back to the system stack. Neither is
fetched — the CDN import is gone — so an offline load is correct but renders in the system
font on most machines. Self-hosting both families in `public/fonts/` with `@font-face` would
give the intended typography without a network request.

### 4. No linter or formatter

No ESLint or Prettier. TypeScript strict catches type errors; nothing catches unused effects,
missing hook dependencies or inconsistent formatting. `eslint` + `typescript-eslint` +
`eslint-plugin-react-hooks` is the conventional baseline for this stack.

### 5. The service worker is not covered by a test

`tests/e2e/05-file-protocol.spec.ts` covers the offline build running with no server at all,
which is the workshop case that matters. What is still untested is the *service worker* path
in the normal build: the suite runs against `npm run dev`, where vite-plugin-pwa generates no
service worker. Verify by hand with `npm run preview`. A second Playwright project pointed at
the preview server would close this.

Note that the offline build deliberately drops the service worker and the PWA manifest —
neither works from `file://` — so it is not installable. That is the trade for opening by
double-click.

### 6. The plan is not portable between browsers except by file

`localStorage` is per-browser and per-machine. Export and import cover the gap, but a planner
who does not export loses the plan when clearing site data. This is a deliberate trade
against an account system; it should be stated in the interface more clearly than the footer
currently does.

### 7. The suite is sensitive to this machine, not just to the code

Two settings exist because of the environment rather than the product, and both are worth
revisiting on a normal filesystem:

- `workers` is capped at 2. At four, clicks and blob downloads that take three seconds in
  isolation stall past the 30 s test timeout. The repo lives in a synced OneDrive folder.
- `tests/global-setup.ts` loads the app once before the suite. Vite answers the readiness
  probe and *then* pre-bundles dependencies, aborting in-flight requests, which surfaced as
  `net::ERR_ABORTED` in whichever specs started first.

Neither masks a product defect: the same tests pass serially and against a warm server. But a
cold `npm run dev` on this path can take long enough that the first navigation still times
out, so a failed first run is worth re-running before investigating.

### 8. browserslist data is out of date

`npx update-browserslist-db@latest` clears the build warning.

---

## Closed by the 2026-08-27 pivot

Recorded here so the history is legible; see `docs/DECISIONS.md`.

| Was | Now |
|---|---|
| 6.6 MB first-load bundle from a static WebLLM import | 301 kB; React is the only runtime dependency |
| Fonts fetched from the Google CDN, contradicting offline-first | nothing fetched at runtime |
| Ollama tier worked only under the dev server | AI removed entirely |
| Cloud AI tier was a stub presented as a feature | AI removed entirely |
| `dist/index.html` failed from `file://` | `npm run build:offline` emits one self-contained file that does work from `file://`; base is `'./'` so the normal build works from any directory |
| Playwright suite ~59 failures of ~250, 36 minutes | 13 tests, ~50 s, all passing, gating CI |
| CI gated nothing | typecheck, verify:quotes, build and e2e all gate |
| `StakeholderTab.tsx` was 1 239 lines | removed with the simulation layer |
| CSV parser split on commas with no quote handling | removed with the scenario model |
| Console noise in production | removed with the AI tiers |
| Manifest colour did not match the brand blue | corrected |
| `includeAssets` listed a `templates/*.xlsx` that never existed | corrected |

One further problem, found during the pivot and not previously recorded: most of the content
in the app had been paraphrased or authored rather than quoted. `stakeholder-profiles.ts`
condensed the chapter 3 good practices and carried invented simulation content;
`case-studies.ts` reworded chapter 5; `dissemination-strategies.ts`, `dissemination-
templates.ts`, `dissemination-tips.ts` and `glossary.ts` had almost no basis in the
publication and were removed. `npm run verify:quotes` exists so this cannot recur silently.
