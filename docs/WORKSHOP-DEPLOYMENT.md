# Workshop Deployment Guide

How to get the tool in front of participants, in order of how much can go wrong.

> Last verified against the code: 2026-08-26. Read `docs/KNOWN-GAPS.md` alongside this —
> several deployment-relevant limitations are recorded there.

---

## The one thing to know first

The build uses a relative base (`base: './'`), so `dist/` works from any directory of any
static server, including a GitHub Pages project site. It does **not** work opened straight
from disk (`file://`): the page's origin is `null` and the browser blocks its module script.

For a copy that opens from a USB drive with no server, use `npm run build:offline`, which
writes a single self-contained `dist-offline/index.html`.

---

## Option 1 — Facilitator laptop, dev server (simplest, and what most sessions use)

```bash
npm install          # first time only, needs internet
npm run dev
# open http://localhost:5173/stakeholder-dialogue/
```

Windows users can double-click `start-local.bat` (macOS/Linux: `./start-local.sh`), which
does the install-if-needed, start, and open-browser steps.

This mode is the only one where the **Ollama** AI tier works, because `/api/ollama` is a
Vite dev-server proxy.

To let participants on the same network use the facilitator's machine:

```bash
npm run dev -- --host
# participants open http://<facilitator-ip>:5173/stakeholder-dialogue/
```

## Option 2 — Built PWA on a local network

```bash
npm run build
npm run preview -- --host
# participants open http://<facilitator-ip>:4173/stakeholder-dialogue/
```

This exercises the real service worker, so it is the mode to use when you want to **verify
offline behaviour** before the workshop: load the page, disconnect the network, reload, and
confirm the app still starts and a stakeholder response can be revealed.

## Option 3 — USB drives / fully air-gapped

```bash
npx vite build --base=./         # relative-base build (see above)
```

Copy `dist/` to the drive together with a static server, because a browser cannot serve the
files itself and `npx http-server` needs internet on the participant machine. Either:

- ship a tiny server binary (e.g. a static-file server executable) on the drive, or
- rely on participants having Node installed, and ship `node_modules/.bin` for a server you
  vendored ahead of time, or
- keep the absolute-base build and place it in a folder named `stakeholder-dialogue`, then
  serve the *parent* folder so the paths line up.

Whichever route you take, **test it on a machine with the network switched off** before the
workshop day. This is the deployment mode with the most failure points.

## Option 4 — Hosted (GitHub Pages)

`.github/workflows/deploy.yml` typechecks, builds and publishes `dist/` on every push to
`main`. The site is at `https://nadeemgoussous.github.io/participatory-processes-toolkit/`
(repo `nadeemgoussous/participatory-processes-toolkit`). Fine for remote participants, useless in a
venue with bad connectivity — always have Option 1 or 3 as a backup.

---

## AI enhancement, realistically

The tool is complete without AI. Rule-based responses are instant, offline and are what the
pedagogy is built around. Treat everything below as optional polish.

| Tier | Who it is for | Reality check |
|---|---|---|
| Rule-based | everyone | Always available, <200 ms, no setup |
| WebLLM | participants | Chrome/Edge 113+ with WebGPU. ~1.8 GB model download on first enable, then cached and offline. 5-15 s per response |
| Ollama | facilitator | `ollama pull smollm2:1.7b`. **Only works under `npm run dev`** — the `/api/ollama` proxy does not exist in a built app |
| Cloud | nobody yet | `enhanceWithCloudAPI()` is a stub that returns nothing |

**On pre-packaging the WebLLM model:** the model is fetched by the WebLLM runtime from its
own CDN and cached in the browser, and the service worker has `CacheFirst` rules for
`huggingface.co` and `raw.githubusercontent.com/mlc-ai`. There is no supported "drop the
model in `public/models/`" path in the current code. The practical approach is to have each
laptop load the model once on a good connection before the session; it stays cached.
If you genuinely need an offline first-load of the model, see `docs/CUSTOM-MODELS.md` and
budget real time for it.

---

## Pre-workshop checklist

- [ ] `npm run typecheck` and `npm run build` both clean
- [ ] Chosen deployment mode rehearsed end to end on a second machine
- [ ] **Offline verified by hand**: `npm run preview`, load, disconnect, reload, reveal a
      response (the automated suite does not cover this — `docs/KNOWN-GAPS.md` §5)
- [ ] Example scenario loads; a real participant CSV imported successfully at least once
- [ ] If AI is in scope: WebLLM model pre-downloaded on each laptop, or Ollama installed on
      the facilitator machine with `smollm2:1.7b` pulled
- [ ] Fallback plan written down: if anything misbehaves, switch the AI backend to
      rule-based and continue — nothing in the workshop depends on AI
- [ ] Backup copies of the build on more than one USB drive

## Workshop-day troubleshooting

| Symptom | First thing to check |
|---|---|
| Page blank, console 404s on `/stakeholder-dialogue/assets/...` | Base-path mismatch — see the top of this guide |
| "Reveal Response" seems stuck | An AI tier is waiting on a timeout; switch the backend selector to rule-based |
| WebLLM never becomes ready | WebGPU unsupported (not Chrome/Edge 113+), or browser storage quota full — rule-based still works |
| Ollama shows unavailable in a built copy | Expected: the proxy is dev-server only |
| Fonts look wrong offline | Google Fonts CDN is unreachable; cosmetic only (`docs/KNOWN-GAPS.md` §4) |
| Imported CSV loses technologies | Unmatched technology names are dropped silently — check the preview against the model output |
| Scenario disappeared | IndexedDB cleared or private browsing; re-import. Auto-save is 500 ms after each change |
