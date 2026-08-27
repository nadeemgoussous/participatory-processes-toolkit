# Known gaps and technical debt

Verified on **2026-08-27** against the `toolkit-pivot` branch, Node 22.

Baseline: `npm run typecheck` clean, `npm run verify:quotes` passes 612 strings,
`npm run build` succeeds in ~15 s producing 301 kB (92 kB gzipped), `npm run test:chromium`
passes 8 tests in ~22 s.

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

### 5. Offline cold start is not covered by a test

The Playwright suite runs against `npm run dev`, where vite-plugin-pwa generates no service
worker. Verify by hand with `npm run preview` before a workshop. A second Playwright project
pointed at the preview server would close this.

### 6. The plan is not portable between browsers except by file

`localStorage` is per-browser and per-machine. Export and import cover the gap, but a planner
who does not export loses the plan when clearing site data. This is a deliberate trade
against an account system; it should be stated in the interface more clearly than the footer
currently does.

### 7. browserslist data is out of date

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
| `dist/index.html` failed from `file://` because base was absolute | base is `'./'` |
| Playwright suite ~59 failures of ~250, 36 minutes | 8 tests, 22 seconds, all passing, gating CI |
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
