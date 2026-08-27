# Scenario Dialogue Tool

<div align="center">

**Interactive stakeholder engagement tool for energy scenario planning**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8.svg)](https://web.dev/progressive-web-apps/)

*Part of IRENA's Participatory Processes for Strategic Energy Planning toolkit*

</div>

---

## 📋 Overview

The Scenario Dialogue Tool helps energy planners bridge the gap between technical modelling and stakeholder engagement. It simulates how different stakeholder groups would respond to energy scenarios, helping planners:

- **Anticipate concerns** before engaging real stakeholders
- **Visualize co-benefits** using metrics that matter to different audiences
- **Practice communication** through predict-before-reveal pedagogy
- **Generate materials** tailored to specific stakeholder groups

### Key Principle: Complement, Don't Contradict

This tool **complements** energy system optimization models (MESSAGE, OSeMOSYS, LEAP, SPLAT) - it does not replace them. It shows directional impacts for discussion purposes using soft metrics (jobs, land use, emissions) while always deferring to full models for technical feasibility.

---

## ✨ Key Features

### 🎯 **Offline-First Design**
- Works 100% offline after initial load (PWA)
- No internet dependency for workshops in remote venues
- Silent failover between AI and rule-based responses

### 👥 **Nine Stakeholder Perspectives**
Simulates responses from:
- Policy Makers & Regulators
- Grid Operators
- Industry & Business
- Public & Communities
- CSOs & NGOs
- Scientific Institutions
- Financial Institutions
- Regional Bodies (power pools)
- Development Partners

### 📊 **Flexible Data Import**
- **CSV Upload**: Import real model outputs (SPLAT, MESSAGE, OSeMOSYS, LEAP)
- **Quick Entry**: Simplified form for key metrics
- **JSON**: Direct JSON import/export
- **Excel Template**: Pre-formatted template (planned, not yet available)

### 🤖 **Multi-Tier AI Enhancement**
1. **WebLLM** (browser-based, zero installation, WebGPU)
2. **Ollama** (local server for facilitators — currently works under `npm run dev` only)
3. **Cloud API** (not implemented; the hook exists and returns nothing)
4. **Rule-based** (always works, no AI required — this is the default experience)

AI only ever *replaces* an already-generated rule-based response, and every tier fails
silently to the next.

### 🧠 **Predict-Before-Reveal Pedagogy**
Interactive learning workflow:
1. User predicts stakeholder response
2. Tool reveals simulated response
3. User reflects on differences
4. Builds stakeholder empathy and anticipation skills

### 🎨 **Context-Aware Responses**
- **Development Context**: Adjusts for LDC/Emerging/Developed country stage
- **Stakeholder Variants**: Conservative, Pragmatic, or Progressive perspectives
- **Multi-Metric Triggers**: Detects complex scenario patterns (e.g., high RE + low storage)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ and npm
- **Modern browser** (Chrome 113+, Edge 113+, Firefox 115+, Safari 16+)
- **Optional**: Ollama for local AI enhancement

### Installation

```bash
# From a clone of this repository
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173/stakeholder-dialogue/** — the app is served under that base
path (it is configured for GitHub Pages), so plain `localhost:5173` will not load it.

On Windows you can double-click `start-local.bat` (macOS/Linux: `./start-local.sh`); it
installs dependencies if needed, starts the server and opens the browser.

### Building for Production

```bash
# Build PWA
npm run build

# Preview production build
npm run preview
```

The `dist/` folder contains the production-ready PWA that can be:
- Hosted on any static web server
- Distributed on USB drives for offline workshops
- Deployed to GitHub Pages, Netlify, Vercel, etc.

---

## 📖 Usage

### 1. Import Scenario Data

Choose one of the available import methods:

#### Option A: CSV Upload (Recommended for Model Outputs)
1. Click **"Upload CSV File"**
2. Select your model output CSV (SPLAT, MESSAGE, OSeMOSYS, etc.)
3. Configure column mappings
4. Preview and load scenario

#### Option B: Excel Template (Planned)
The pre-formatted `SCENARIO-INPUT-TEMPLATE.xlsx` is not yet available (tracked as F013/F014). Until then, use CSV upload, Quick Entry, or JSON paste.

#### Option C: Quick Entry Form
1. Click **"Quick Entry Form"**
2. Enter basic scenario metrics (7-10 fields per milestone)
3. Add/remove milestone years as needed
4. Load scenario

#### Option D: Load Example
- Click **"Load Example"** to explore with sample data (ScenarioLand baseline scenario)

### 2. Explore Stakeholder Responses

1. Select a stakeholder group (e.g., "Grid Operators")
2. **Predict**: Write what you think they'll say
3. **Reveal**: See the simulated response
4. **Compare**: Reflect on differences
5. Adjust **Response Settings**:
   - Development Context (LDC/Emerging/Developed)
   - Stakeholder Variant (Conservative/Pragmatic/Progressive)

### 3. Explore Impacts (Optional)

- Adjust scenario parameters (RE share, coal phaseout, etc.)
- See directional impacts on:
  - Jobs (construction + operations)
  - Land use (hectares)
  - Emissions (Mt CO₂)
  - Stakeholder sentiment

### 4. Generate Communications

- Select a target audience (stakeholder group)
- Get recommended dissemination formats, key messages, and what to avoid
- Use format templates (policy briefs, infographics, investment briefings)
- Browse 13 real-world IRENA toolkit case studies with filtering
- Review dissemination best practices (Quick Tips, Toolkit Principles, Case Studies)

---

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PWA**: vite-plugin-pwa + Workbox
- **Storage**: IndexedDB (Dexie.js)
- **Testing**: Playwright
- **AI**: WebLLM (browser), Ollama (local), Anthropic API (cloud)

### Project Structure

```
stakeholder_dialogue/
├── src/
│   ├── components/       # React components
│   │   ├── input/        # Data import components
│   │   ├── stakeholder/  # Stakeholder dialogue UI
│   │   ├── calculator/   # Soft metrics calculations
│   │   └── output/       # Communication outputs
│   ├── data/             # Stakeholder profiles & factors
│   ├── utils/            # Response generation & calculations
│   ├── types/            # TypeScript interfaces
│   └── App.tsx           # Main app component
├── docs/                 # Extended documentation
├── public/
│   ├── icons/            # Stakeholder icons
│   └── sample-data/      # Example scenarios
├── scripts/              # Maintenance tools (response library, quality tests, icons)
├── tests/e2e/            # Playwright tests
└── archive/              # Source materials and the historical session log
```

### Key Documentation

- **[CLAUDE.md](CLAUDE.md)** - Full project specification and agent instructions
- **[docs/STAKEHOLDER-PROFILES.md](docs/STAKEHOLDER-PROFILES.md)** - Detailed stakeholder definitions
- **[docs/DATA-SCHEMAS.md](docs/DATA-SCHEMAS.md)** - TypeScript interfaces and data structures
- **[docs/TECHNICAL-IMPLEMENTATION.md](docs/TECHNICAL-IMPLEMENTATION.md)** - Implementation guides
- **[docs/UI-DESIGN.md](docs/UI-DESIGN.md)** - Design system and components
- **[docs/README.md](docs/README.md)** - Documentation index (Current / Reference / Archived)
- **[docs/KNOWN-GAPS.md](docs/KNOWN-GAPS.md)** - Verified defects and technical debt
- **[docs/DECISIONS.md](docs/DECISIONS.md)** - Architectural decision log
- **[docs/OLLAMA-SETUP.md](docs/OLLAMA-SETUP.md)** - Local AI setup guide
- **[docs/WORKSHOP-DEPLOYMENT.md](docs/WORKSHOP-DEPLOYMENT.md)** - Workshop deployment guide

---

## 🧪 Testing

```bash
npm run typecheck      # TypeScript, fast — run before every commit
npm run test:quality   # rule-based response library QA, no browser needed
npm run test:chromium  # Playwright, Chromium only (use while iterating)
npm test               # Playwright, all four browser projects
npm run test:report    # open the last HTML report
```

> **Note:** part of the Playwright suite is currently stale — some specs assert on old UI
> copy or build fixtures in a schema that no longer exists, and offline cold-start is not
> covered by a passing test. See [docs/KNOWN-GAPS.md](docs/KNOWN-GAPS.md) before trusting a
> red or green run.

---

## 🌍 Workshop Deployment

### Pre-Workshop Checklist

- [ ] Build production PWA (`npm run build`)
- [ ] Test offline functionality (DevTools offline mode)
- [ ] Prepare import files (the Excel template is not built yet — use CSV or quick entry)
- [ ] Load sample scenarios for target region
- [ ] Copy `dist/` folder to USB drives (for offline distribution)
- [ ] Optional: Set up Ollama on facilitator laptop
- [ ] Print facilitator guide

### Offline Distribution

The tool can run from a USB drive, with one caveat: the default build uses the absolute base
path `/stakeholder-dialogue/`, so `dist/index.html` will **not** open correctly from
`file://` or from the root of a static server.

1. Build a relative-path copy: `npx vite build --base=./`
2. Copy `dist/` to the USB drive along with a static file server
3. Serve the folder locally on the participant machine (a browser cannot serve it itself)
4. Verify offline on a disconnected machine before the workshop

See [docs/WORKSHOP-DEPLOYMENT.md](docs/WORKSHOP-DEPLOYMENT.md) for detailed instructions.

---

## 🤝 Contributing

Contributions are welcome! This tool is designed to be adaptable to different regional contexts.

### Areas for Contribution

- **Regional Adaptations**: Customize stakeholder profiles for specific regions
- **Model Compatibility**: Add parsers for additional energy models
- **Translations**: Add UI translations (currently English)
- **Stakeholder Groups**: Add region-specific stakeholder types
- **Example Scenarios**: Contribute sample scenarios from different contexts

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Commit Convention

We use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation updates
- `test:` - Test updates

---

## 📊 Soft Metrics Methodology

### What We Calculate

- ✅ **Jobs**: Construction (job-years) + operations (permanent positions)
  - Based on IRENA job factor studies
  - Technology-specific multipliers

- ✅ **Land Use**: Hectares required for renewable energy installations
  - Solar PV, wind, battery storage
  - Other technologies too site-specific to estimate

- ✅ **Emissions**: CO₂ from fossil fuel combustion
  - Annual emissions trajectory
  - Percent reduction from baseline

### What We DO NOT Calculate

- ❌ LCOE (levelized cost of electricity)
- ❌ Tariff implications
- ❌ System reliability metrics
- ❌ Reserve margin adequacy
- ❌ Dispatch feasibility
- ❌ Transmission constraints

**All pages showing calculations display a prominent disclaimer:**

> ⚠️ **ILLUSTRATIVE ESTIMATES ONLY**
> These figures show directional impacts for discussion purposes.
> They do NOT replace energy system optimization model analysis.
> Always verify feasibility in the full model.

---

## 🔧 Configuration

### AI Enhancement (Optional)

#### Ollama (Local)

```bash
# Install Ollama
# Visit https://ollama.ai/download

# Pull recommended model (same model used by WebLLM for consistency)
ollama pull smollm2:1.7b

# Start Ollama (runs on http://localhost:11434)
ollama serve
```

Select **Ollama** in the AI backend selector on the Stakeholder Dialogue tab.

> Ollama is reached through a Vite dev-server proxy (`/api/ollama`), so it currently works
> under `npm run dev` and not in a built/deployed copy. See
> [docs/KNOWN-GAPS.md](docs/KNOWN-GAPS.md).

#### Cloud API

Not implemented. `enhanceWithCloudAPI()` is a stub that returns nothing, and the config
fields are inert. If you add it, do not put a provider key in the client bundle — a static
PWA cannot keep one secret. Route it through a proxy you control.

#### WebLLM (Browser)

Zero installation, runs in browser using WebGPU.
- Model: SmolLM2-1.7B-Instruct (~1.8GB)
- Downloads once, cached in browser
- Works offline after initial load

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

This tool was developed as part of IRENA's capacity building program for energy planning. It builds on:

- **IRENA's Participatory Processes Toolkit** - Stakeholder engagement framework
- **IRENA Job Factor Studies** - Employment multipliers for renewable energy
- **Energy Planning Community** - Insights from MESSAGE, OSeMOSYS, LEAP, and SPLAT users
- **Workshop Participants** - Feedback from energy planning professionals worldwide

---

## 📧 Contact

For questions, suggestions, or support:

- **Email**: [capacity-building@irena.org](mailto:capacity-building@irena.org)
- **IRENA Website**: [www.irena.org](https://www.irena.org)

If this repository has been published, issues and pull requests are the best route; the
GitHub Pages deployment workflow in `.github/workflows/` assumes a repository with Pages
enabled.

---

## 🗺️ Roadmap

### Current Status (v1.0)

- ✅ Offline-first PWA architecture
- ✅ CSV import with flexible schema
- ✅ Nine stakeholder profiles with context-aware responses
- ✅ Rule-based response generation (always works)
- ✅ WebLLM browser-based AI (zero installation)
- ✅ Ollama integration (local AI, dev server only)
- ✅ Predict-before-reveal pedagogy
- ✅ Soft metrics calculations (jobs, land, emissions)
- ✅ Communication tab (dissemination strategies, templates, case studies)

### Upcoming

- 🔜 Excel template with VBA macros (F013/F014)
- 🔜 JSON paste for Excel template output (F013)
- 🔜 Workshop facilitator guide (F041)
- 🔜 Multi-scenario comparison
- 🔜 Translations (French, Spanish, Arabic)

### Future Enhancements

- Multi-user collaboration features
- Additional stakeholder groups (labor unions, indigenous communities)
- Integration with online model APIs
- Mobile app version
- Sector expansion (water, transport, industry)

---

<div align="center">

**Built with ❤️ by the IRENA Capacity Building Team**

[Website](https://www.irena.org) • [Documentation](docs/README.md)

</div>
