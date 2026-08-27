# Participatory Processes Toolkit

A digital edition of IRENA (2025), *Participatory processes for strategic energy planning:
A toolkit for national energy planners* (ISBN 978-92-9260-680-0).

National energy planners use it to plan a participatory process: which stakeholder groups to
engage, which engagement tools suit the objective and the planning phase, what other
countries did, and a working checklist to take into the process.

## Sections

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

## Content

Every word shown in the app is quoted from the publication. `npm run verify:quotes` checks
each string against `docs/toolkit/` and fails the build on anything that does not appear
there. It runs in CI.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173/
npm run build      # -> dist/
```

The build uses a relative base path, so `dist/` works from GitHub Pages, from any static
server, and from a folder opened directly off a USB drive. Nothing is fetched at runtime.

Your plan is stored in your browser only. Use Export to keep a copy or pass it on.

## Development

See [CLAUDE.md](CLAUDE.md) for the operating manual and [docs/README.md](docs/README.md) for
the documentation index.
