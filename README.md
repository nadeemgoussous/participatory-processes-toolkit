# Participatory Processes Toolkit

A digital edition of IRENA (2025), *Participatory processes for strategic energy planning:
A toolkit for national energy planners* (ISBN 978-92-9260-680-0).

National energy planners use it to plan a participatory process: which stakeholder groups to
engage, which engagement tools suit the objective and the planning phase, what other
countries did, and a working checklist to take into the process.

## Sections

- **Why participate** — chapter 2: what participatory processes are, who is responsible for
  energy planning, and the four objectives participation serves.
- **Plan** — a checklist assembled from the toolkit's prerequisites, resource requirements
  and good practices. Choose your planning phases, stakeholder groups and tools and the
  checklist narrows to what applies. Each item carries its section reference and a note
  field. Export as JSON or print.
- **Stakeholders** — the seven groups in chapter 3: who they are, why to engage them, what
  they gain, the challenges, and the good practices.
- **Engagement tools** — the seven tools in chapter 4, reachable by objective, by planning
  phase or by category, each with its implementation stages, requirements, prerequisites and
  practical considerations.
- **Case studies** — the thirteen processes in chapter 5.
- **Resources** — chapter 7: publications, repositories, survey and polling platforms,
  co-creation and visualisation tools, and the two assessment frameworks.

## Content

Every word shown in the app is quoted from the publication. `npm run verify:quotes` checks
each string against `docs/toolkit/` and fails the build on anything that does not appear
there. It runs in CI.

## Running it

```bash
npm install
npm run dev            # http://localhost:5173/
npm run build          # -> dist/            for GitHub Pages or any static server
npm run build:offline  # -> dist-offline/index.html   one self-contained file
```

Nothing is fetched at runtime in either build — no fonts, no analytics, no API.

**Sharing it.** `npm run build:offline` produces a single 322 kB `index.html` with the
stylesheet and script inlined. Copy it to a USB drive, email it, or open it by double-click;
it needs no server and no network. Use `npm run build` for a hosted deployment — that one is
a normal ES-module site and has to be served over http, not opened from disk.

External links in Resources open in a new tab when clicked. Nothing is fetched by the page
itself, so the app still works with the network off.

Your plan is stored in your browser only. Use Export to keep a copy or pass it on.

## Development

See [CLAUDE.md](CLAUDE.md) for the operating manual and [docs/README.md](docs/README.md) for
the documentation index.
