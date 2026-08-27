# Data Schemas and Reference Data

> **Source of truth:** `src/types/*.ts` and `src/data/technology-factors.ts`.
> This document explains and annotates them. If they disagree, the code wins — and the
> change that caused the drift should have updated this file too (see CLAUDE.md §5).
> Last verified against the code: 2026-08-26.

## Scenario Data Schema

### ScenarioInput (`src/types/scenario.ts`)

The schema is **milestone-based** and **unit-tagged**. Every value carries its unit, so a
user can enter GW or MW, TWh or GWh, and the tool normalises internally
(`src/utils/unit-conversions.ts`).

```typescript
interface ScenarioInput {
  metadata: {
    country: string;
    scenarioName: string;
    modelVersion: string;    // "SPLAT" | "MESSAGE" | "OSeMOSYS" | "LEAP" | "Quick Entry"
    dateCreated: string;     // ISO 8601
    sourceFile?: string;     // original filename, if uploaded
  };

  milestones: MilestoneData[];   // 2-10 milestone years, ascending

  // Optional granular data, preserved from the model when available.
  // When present, calculations use it instead of the estimated technology mix.
  detailedTech?: {
    [year: number]: {
      hydro?: number; solarPV?: number; solarCSP?: number; wind?: number;
      geothermal?: number; biomass?: number; coal?: number; gas?: number;
      diesel?: number; hfo?: number; nuclear?: number; battery?: number;
      pumpStorage?: number; interconnector?: number;   // MW
    };
  };
}

interface TechnologyMix {
  renewables: number;   // hydro + solar + wind + geothermal + biomass
  fossil: number;       // coal + gas + diesel + HFO
  storage?: number;     // batteries + pumped storage
  other?: number;       // nuclear + interconnectors
}

interface MilestoneData {
  year: number;

  // --- required: the 6 core indicators ---
  capacity:   { total: TechnologyMix;  unit: PowerUnit };
  generation: { output: TechnologyMix; unit: EnergyUnit };
  reShare:    number;                                    // %, 0-100 (see calculateREShare)
  investment: { cumulative: number;    unit: MoneyUnit };
  emissions:  { total: number;         unit: EmissionsUnit };
  peakDemand: { value: number;         unit: PowerUnit };

  // --- optional advanced indicators ---
  capacityAdditions?: { additions: TechnologyMix; unit: PowerUnit };
  annualOMCosts?:     { value: number; unit: MoneyUnit };
  curtailment?:       { value: number; unit: EnergyUnit };   // wasted RE
  imports?:           { value: number; unit: EnergyUnit };   // interconnector imports
}
```

**Units** (`src/utils/unit-conversions.ts`):

```typescript
type PowerUnit     = 'MW' | 'GW' | 'kW';
type EnergyUnit    = 'GWh' | 'TWh' | 'MWh';
type MoneyUnit     = 'm$' | 'B$' | 'k$' | 'USD';
type EmissionsUnit = 'Mt CO2' | 'kt CO2' | 't CO2';
```

**Helpers exported alongside the types:** `calculateREShare(generation)`,
`getMilestoneYears(scenario)`, `getMilestoneData(scenario, year)`, `hasAdvancedData(scenario)`.

> **Removed schema — do not reintroduce.** An earlier flat shape used
> `milestoneYears: number[]` with `supply.capacity.<technology>: Record<year, number>` and a
> `demand` block. It no longer exists anywhere in `src/`. Some older Playwright specs still
> build objects in that shape and fail at runtime (see `docs/KNOWN-GAPS.md`).

### QuickScenarioInput (quick-entry form)

What `src/components/input/QuickEntryForm.tsx` collects before it is expanded into a
`ScenarioInput`. Each milestone is 7-10 fields, and every quantity has its own unit selector:

```typescript
interface QuickScenarioInput {
  country: string;
  scenarioName: string;
  milestones: {
    year: number;

    renewablesCapacity: number;  fossilCapacity: number;  storageCapacity?: number;
    capacityUnit: PowerUnit;

    renewablesGeneration: number; fossilGeneration: number;
    generationUnit: EnergyUnit;

    cumulativeInvestment: number; investmentUnit: MoneyUnit; annualOMCost?: number;

    emissions: number;  emissionsUnit: EmissionsUnit;
    peakDemand: number; peakDemandUnit: PowerUnit;

    renewablesAdditions?: number; fossilAdditions?: number;
    curtailment?: number;         imports?: number;
  }[];
}
```

---
## Derived Metrics Schema

Metrics calculated from scenario input:

```typescript
interface DerivedMetrics {
  renewableShare: Record<number, number>;      // % by year
  fossilShare: Record<number, number>;         // % by year

  jobs: {
    construction: Record<number, number>;      // Job-years by year
    operations: Record<number, number>;        // Permanent jobs by year
    total: Record<number, number>;             // Combined by year
  };

  landUse: {
    totalNewLand: Record<number, number>;      // Hectares by year
    byTechnology: {
      solarPV: Record<number, number>;
      wind: Record<number, number>;
      battery: Record<number, number>;
    };
  };

  emissions: {
    absolute: Record<number, number>;          // Mt CO2 by year
    reductionPercent: Record<number, number>;  // % reduction vs baseline
  };

  capacity: {
    totalInstalled: Record<number, number>;    // MW by year
    variableRenewableShare: Record<number, number>;  // % (solar + wind)
  };

  investment: {
    totalCumulative: Record<number, number>;   // USD millions by year
    annualPeak: number;                        // Highest annual investment
    averageAnnual: number;                     // Average across period
  };
}
```

---

## Reference Data: Technology Factors

### Job Factors

Based on IRENA renewable energy job factor studies:

```typescript
const JOB_FACTORS = {
  // Jobs per MW installed (construction phase, job-years)
  construction: {
    solarPV: 10,      // High labor intensity for installation
    wind: 8,          // Manufacturing + installation
    hydro: 12,        // Civil works intensive
    battery: 3,       // Lower labor intensity
    geothermal: 6,    // Drilling + installation
    biomass: 8,       // Plant construction
    coal: 4,          // Conventional plant
    naturalGas: 4,    // Conventional plant
    gas: 4,           // Alias for naturalGas
    diesel: 3,        // Simple cycle
    hfo: 3,           // Heavy fuel oil plants
    nuclear: 10,      // Complex construction
    interconnector: 5 // Transmission lines
  },

  // Permanent jobs per MW (operations and maintenance)
  operations: {
    solarPV: 0.3,     // Minimal O&M staff
    wind: 0.4,        // Regular maintenance
    hydro: 0.5,       // Dam operation + maintenance
    battery: 0.1,     // Limited O&M
    geothermal: 0.6,  // Continuous monitoring
    biomass: 1.0,     // Fuel handling + operation
    coal: 0.8,        // Plant operation
    naturalGas: 0.8,  // Plant operation
    gas: 0.8,         // Alias for naturalGas
    diesel: 0.5,      // Simple operation
    hfo: 0.5,         // Simple operation
    nuclear: 0.7,     // Continuous staffing
    interconnector: 0.05 // Minimal maintenance
  }
};
```

**How the factors are applied** (`src/utils/calculations.ts`): if `detailedTech` is present
for a year, factors are applied per technology. Otherwise the aggregated `TechnologyMix` is
split with fixed default shares — renewables 40% hydro / 30% solar PV / 20% wind / 5%
geothermal / 5% biomass, fossil 20% coal / 50% gas / 15% diesel / 15% HFO; `storage` is
treated as battery and `other` as nuclear. Changing these defaults changes every jobs and
land-use number in the tool, so change them deliberately.

**Notes:**
- Construction jobs are temporary (job-years over project duration)
- Operations jobs are permanent positions
- Factors are approximations for planning discussion, not precise employment forecasts
- Local content and supply chain maturity significantly affect actual job creation

### Land Use Factors

Approximate land requirements:

```typescript
const LAND_FACTORS = {
  solarPV: 2.0,       // Hectares per MW (utility-scale ground mount)
  wind: 0.3,          // Hectares per MW (direct footprint only, not total area)
  battery: 0.1,       // Hectares per MW (containerized systems)
  // Other technologies: site-specific, not generalized
};
```

**Notes:**
- Solar: Assumes typical utility-scale fixed-tilt installations
- Wind: Direct turbine footprint only (total project area 10-100x larger)
- Battery: Assumes containerized/modular systems
- Hydro, geothermal, thermal plants: too site-specific to generalize

### Emission Factors

For fossil fuel combustion only:

```typescript
const EMISSION_FACTORS = {  // tCO2 per GWh generated
  coal: 900,          // High carbon intensity
  naturalGas: 400,    // Lower than coal
  gas: 400,           // Alias for naturalGas
  diesel: 700,        // Medium-high intensity
  hfo: 650,           // Heavy fuel oil
  // Renewables: 0 (lifecycle emissions not included in this tool)
};
```

**Notes:**
- Factors represent **combustion emissions only**
- Does not include lifecycle/embodied emissions
- For illustrative scenario comparison, not carbon accounting
- Actual emissions should come from the optimization model

---

## Stakeholder Response Schema

### Response Structure

```typescript
interface StakeholderResponse {
  stakeholderId: string;
  stakeholderName: string;

  initialReaction: string;              // 2-3 sentence overview

  appreciation: string[];               // Positive aspects (2-4 points)

  concerns: Concern[];                  // Concerns raised (2-4 points)

  questions: string[];                  // Questions they would ask (3-5)

  engagementAdvice: string[];           // Tips for engaging this stakeholder (2-3)

  generatedAt: string;                  // ISO 8601 timestamp
  generationType: 'rule-based' | 'ai-enhanced' | 'enhanced-rule-based';

  lastTemplateId?: number;              // library template used, for anti-repetition tracking

  metadata?: {
    context?: string;                   // 'ldc' | 'emerging' | 'developed'
    variant?: string;                   // 'conservative' | 'pragmatic' | 'progressive'
    interactionTriggersCount?: number;  // multi-metric triggers activated
    [key: string]: any;
  };
}

interface Concern {
  text: string;                         // The concern statement
  explanation: string;                  // Why this matters to them
  metric: string;                       // Which metric triggered it
  severity: 'low' | 'medium' | 'high';  // How significant
}
```

---

## Adjustment Calculator Schema

### Adjustable Parameters

```typescript
interface AdjustableParameters {
  // Only high-level, non-technical adjustments
  renewableShareTarget2030: number;    // % (slider 0-100)
  renewableShareTarget2040: number;    // % (slider 0-100)

  // Approximate investment level (qualitative only)
  investmentLevel: 'low' | 'base' | 'high';

  // Timeline adjustments
  coalPhaseoutYear: number | null;     // Year or null for no phase-out
}
```

### Directional Impacts

```typescript
interface DirectionalImpacts {
  jobs: DirectionalChange;
  landUse: DirectionalChange;
  emissions: DirectionalChange;
  stakeholderSentiment: Record<string, SentimentChange>;
}

interface DirectionalChange {
  direction: 'increase' | 'decrease' | 'unchanged';
  magnitude: 'negligible' | 'moderate' | 'significant';
  explanation: string;
}

interface SentimentChange {
  direction: 'more_positive' | 'more_negative' | 'unchanged';
  positiveFactors: string[];
  negativeFactors: string[];
}
```

---

## Validation Rules

Implemented as `validateScenario(scenario)` in `src/types/scenario.ts`; called by
`CSVUploader` before a scenario is accepted.

```typescript
function validateScenario(scenario: ScenarioInput): { valid: boolean; errors: string[] }
```

Checks performed:

| Check | Rule |
|---|---|
| Metadata | `country` and `scenarioName` are non-empty |
| Milestones | at least one; years between 2020 and 2100; strictly ascending |
| Capacity / generation | renewables and fossil are non-negative |
| RE share | 0-100 |
| Investment / emissions | non-negative |

There is no warning tier and no upper-bound range check — a typo of 10x in capacity passes
validation. If you add stricter validation, add it here so CSV, quick entry and JSON all
benefit.

---

## File Import/Export Formats

### JSON Export Format

The tool imports plain `ScenarioInput` JSON (the same shape as the sample-data files).
There is no wrapper envelope, and **no session export exists yet** — exporting the scenario
together with predictions and responses is still open (feature F034).

`ScenarioPreview` can export the charts as JPG (SVG serialised to canvas, no dependencies).

### CSV Import Format

Handled by `src/utils/csv-parser.ts`. The parser auto-detects the format, maps technology
names to the four aggregate categories, and aggregates rows to the milestone years the user
selects.

**SPLAT / long format** (the primary path) — one row per technology, parameter and year.
Detected when the header contains `Technology`, `Par/Var`, `Year` and `Value`:

```csv
Scenario,PowerPool,Country,Technology,Par/Var,Year,Value,Unit
BAU,SAPP,Lesotho,LSSO01,Capacity,2030,120,MW
BAU,SAPP,Lesotho,LSSO01,Generation,2030,240,GWh
BAU,SAPP,Lesotho,LSCL01,Capacity,2030,60,MW
```

Technology codes are matched by regex (`LSHY*` hydro, `LSSO*` solar, `LSWD*` wind,
`LSCL*` coal, `LSNG*` gas, `LSDS*` diesel, `LSNU*` nuclear, plus plain-language names such
as `solar`, `wind`, `coal`, `battery`). Unmatched technologies are dropped — check the
preview before accepting an import.

See `docs/SPLAT-CSV-ANALYSIS.md` for the full column analysis and
`docs/examples/20250108_lesotho_tes_cplex_test.csv` for a real file.

> Known limitation: the parser splits on commas without quoted-field handling, so a CSV with
> quoted values containing commas will mis-parse. Tracked in `docs/KNOWN-GAPS.md`.

---

## Example Data: Sample Scenario

Two ready-made scenarios ship with the app and are the canonical examples of the current
schema:

- `public/sample-data/scenarioland-baseline.json` — fictional country, loaded by the
  **Load Example** button
- `public/sample-data/rwanda-baseline.json` — real-world shaped example

Shape of one milestone (abridged from `scenarioland-baseline.json`):

```json
{
  "metadata": {
    "country": "ScenarioLand",
    "scenarioName": "High Renewable Transition",
    "modelVersion": "SPLAT-MESSAGE",
    "dateCreated": "2025-01-15"
  },
  "milestones": [
    {
      "year": 2025,
      "capacity":   { "total":  { "renewables": 420, "fossil": 380, "storage": 25, "other": 45 }, "unit": "MW" },
      "generation": { "output": { "renewables": 1780, "fossil": 2520, "other": 320 }, "unit": "GWh" },
      "reShare": 38.5,
      "investment": { "cumulative": 850, "unit": "m$" },
      "emissions":  { "total": 2.1, "unit": "Mt CO2" },
      "peakDemand": { "value": 610, "unit": "MW" }
    }
  ]
}
```

When you need a fixture in a test, import one of these files rather than hand-writing a
scenario object — hand-written fixtures are how the old schema survived in the test suite.

---

## Constants and Configuration

### Disclaimer Text

```typescript
const DISCLAIMERS = {
  calculations: `⚠️ ILLUSTRATIVE ESTIMATES ONLY
These figures show directional impacts for discussion purposes.
They do NOT replace optimization model technical analysis.
Always verify feasibility in the full model.`,

  calculator: `⚠️ DIRECTIONAL INDICATORS ONLY
This calculator shows how changes might affect stakeholder sentiment.
It does NOT calculate technical feasibility, replace optimization outputs, or provide cost estimates.
ALWAYS verify scenario changes in the full model before presenting to stakeholders.`,

  aiEnhanced: `This response was enhanced by AI to make it more natural.
All underlying analysis is based on your scenario data.`
};
```

### Default Configuration

The real defaults live in code; these are the ones that matter:

```typescript
// src/utils/stakeholder-ai.ts — DEFAULT_AI_CONFIG
{
  webLLMEnabled: true,
  webLLMModel:   'SmolLM2-1.7B-Instruct-q4f16_1-MLC',  // ~1.8 GB, downloaded on first use
  webLLMTimeout: 60000,

  ollamaEnabled: true,
  ollamaUrl:     '/api/ollama',    // Vite dev-server proxy -> http://localhost:11434
  ollamaModel:   'smollm2:1.7b',
  ollamaTimeout: 120000,

  cloudEnabled:  false,            // enhanceWithCloudAPI() is a stub and returns null
  cloudTimeout:  3000,
}
```

Other fixed behaviours: predictions require **20 characters** minimum
(`src/components/prediction/PredictionInput.tsx`); the scenario auto-saves to IndexedDB
**500 ms** after the last change (`src/context/ScenarioContext.tsx`); the emissions baseline
is the **first milestone year**, not a hard-coded 2025 (`src/utils/calculations.ts`).

---

## Type Utilities

Helpful TypeScript utilities:

```typescript
// Extract year values from scenario
type YearValue = number;
type YearRecord = Record<YearValue, number>;

// Technology types
type RenewableTech = 'hydro' | 'solarPV' | 'wind' | 'geothermal' | 'biomass';
type FossilTech = 'coal' | 'naturalGas' | 'diesel' | 'hfo';
type StorageTech = 'battery' | 'pumpStorage';
type AllTech = RenewableTech | FossilTech | StorageTech | 'nuclear' | 'interconnector';

// Stakeholder IDs
type StakeholderId =
  | 'policy-makers'
  | 'grid-operators'
  | 'industry'
  | 'public'
  | 'csos-ngos'
  | 'scientific'
  | 'finance'
  | 'regional-bodies'
  | 'development-partners';

// Metric paths (for concern triggers)
type MetricPath =
  | `investment.cumulative.${number}`
  | `jobs.total.${number}`
  | `emissions.reductionPercent${number}`
  | `renewableShare.${number}`
  | `capacity.totalInstalled.${number}`;
```
