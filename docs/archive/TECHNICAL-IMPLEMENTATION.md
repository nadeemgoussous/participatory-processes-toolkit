# Technical Implementation Guide

Reference implementations for the core algorithms of the Scenario Dialogue Tool.

> **How to read this file:** code blocks marked *reference* are simplified illustrations of
> the approach; the shipped code is the authority. Where the two differ materially, this
> file says so explicitly. Last verified against the code: 2026-08-26.

## Response Generation System

### Architecture: Offline-First

```
┌─────────────────────────────────────────────────────────┐
│                    User Selects Stakeholder              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│           Check: Is scenario data complete?              │
│                         │                                │
│            No ──────────┼──────────► Show validation     │
│                         │            errors              │
│            Yes          ▼                                │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│      PREDICT-BEFORE-REVEAL (Pedagogy Feature)           │
│                                                         │
│  "What do you think [Stakeholder] will say about        │
│   this scenario? Type your prediction below:"           │
│                                                         │
│  [________________________________] (min 20 chars)      │
│                                                         │
│  [Reveal Response]                                      │
└─────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│         Generate Response (Offline-First)                │
│                                                         │
│  1. ALWAYS generate rule-based response first           │
│  2. IF online AND API key configured:                   │
│     - Attempt AI enhancement (3 second timeout)         │
│     - On ANY error: silently use rule-based            │
│  3. Display response with user's prediction visible     │
└─────────────────────────────────────────────────────────┘
```

---

## Rule-Based Response Generator (PRIMARY)

This is the core response generation logic that works 100% offline.

### Main Response Function

```typescript
// src/utils/stakeholder-rules.ts

export function generateRuleBasedResponse(
  scenario: ScenarioInput,
  derivedMetrics: DerivedMetrics,
  stakeholder: StakeholderProfile
): StakeholderResponse {

  const concerns: Concern[] = [];
  const appreciation: string[] = [];

  // Check all concern triggers against data
  for (const trigger of stakeholder.concernTriggers) {
    const value = getMetricValue(scenario, derivedMetrics, trigger.metric);
    if (value !== null) {
      const triggered = trigger.direction === 'above'
        ? value > trigger.threshold
        : value < trigger.threshold;

      if (triggered) {
        concerns.push({
          text: insertValue(trigger.concernText, value),
          explanation: trigger.explanation,
          metric: trigger.metric,
          severity: calculateSeverity(value, trigger.threshold, trigger.direction)
        });
      }
    }
  }

  // Check all positive indicators
  for (const indicator of stakeholder.positiveIndicators) {
    const value = getMetricValue(scenario, derivedMetrics, indicator.metric);
    if (value !== null) {
      const triggered = indicator.direction === 'above'
        ? value > indicator.threshold
        : value < indicator.threshold;

      if (triggered) {
        appreciation.push(insertValue(indicator.praiseText, value));
      }
    }
  }

  // Find matching response template
  const template = findMatchingTemplate(scenario, stakeholder.responseTemplates);

  // Generate initial reaction based on balance
  const initialReaction = generateInitialReaction(
    concerns.length,
    appreciation.length,
    stakeholder,
    template
  );

  // Select relevant questions based on scenario characteristics
  const questions = selectRelevantQuestions(
    stakeholder.typicalQuestions,
    scenario,
    concerns
  );

  // Select engagement advice
  const advice = stakeholder.goodPractices.slice(0, 3);

  return {
    stakeholderId: stakeholder.id,
    stakeholderName: stakeholder.name,
    initialReaction,
    appreciation,
    concerns,
    questions,
    engagementAdvice: advice,
    generatedAt: new Date().toISOString(),
    generationType: 'rule-based'
  };
}
```

### What actually runs: `generateEnhancedResponse`

`generateRuleBasedResponse` above is the base layer. The UI calls
`generateEnhancedResponse(scenario, derivedMetrics, stakeholder, options)`
(`src/utils/stakeholder-rules.ts`), which wraps it with three extra layers from
`src/data/stakeholder-enhancements.ts`:

1. **Development context** — `'ldc' | 'emerging' | 'developed'` shifts thresholds and wording.
2. **Variant** — `'conservative' | 'pragmatic' | 'progressive'` changes the personality.
3. **Multi-metric interaction triggers** — conditions no single threshold can express
   (e.g. high VRE share *and* low storage), which add concerns and appreciation points.

Its `options` also carry `sessionHistory: number[]`, the template ids already shown this
session, so repeated reveals do not repeat text.

**Template selection** (`src/data/template-selector.ts`) picks the opening reaction:

```
score = 0.6 x gaussianProximity(|scenarioValue - templateValue|, sigma)
      + 0.4 x (1 - recencyDecay(templateId, sessionHistory))
```

with a per-stakeholder `sigma` (finance and policy-makers 10, csos-ngos 20, public 25) and a
Fisher-Yates shuffle bag per stakeholder+variant so a bag is exhausted before it refills.
`interpolateTemplate` then fills values, drops `{?key:text}` blocks whose value is missing,
and expands `{~a|b|c}` inline variations.

`src/data/response-library.ts` (182 templates) is **generated** by
`npm run responses:build`; edit `scripts/build-response-library.cjs` or the training data,
never the output. Validate with `npm run test:quality`, which checks interpolation, grammar
cleanup, duplicate/similar templates and anti-repetition across ~190 combinations.

### Helper Functions

```typescript
function generateInitialReaction(
  concernCount: number,
  appreciationCount: number,
  stakeholder: StakeholderProfile,
  template: ResponseTemplate | null
): string {
  if (template) {
    return template.initialReaction;
  }

  const ratio = appreciationCount / (concernCount + appreciationCount + 1);

  if (ratio > 0.7) {
    return `As a ${stakeholder.name} representative, I see several positive aspects in this scenario that align with our priorities.`;
  } else if (ratio > 0.4) {
    return `This scenario has both strengths and areas that warrant further discussion from our perspective.`;
  } else {
    return `We have some important questions and concerns about this scenario that we would like to discuss.`;
  }
}

function getMetricValue(
  scenario: ScenarioInput,
  derivedMetrics: DerivedMetrics,
  metricPath: string
): number | null {
  // Parse metric path like 'investment.cumulative.2030'
  const parts = metricPath.split('.');
  let value: any = scenario;

  // Try scenario first
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      // Try derived metrics
      value = derivedMetrics;
      for (const derivedPart of parts) {
        if (value && typeof value === 'object' && derivedPart in value) {
          value = value[derivedPart];
        } else {
          return null;
        }
      }
      break;
    }
  }

  return typeof value === 'number' ? value : null;
}

function insertValue(text: string, value: number): string {
  // Replace {value} placeholder with formatted number
  return text.replace('{value}', value.toLocaleString());
}

function calculateSeverity(
  value: number,
  threshold: number,
  direction: 'above' | 'below'
): 'low' | 'medium' | 'high' {
  const ratio = value / threshold;
  const exceedance = direction === 'above'
    ? ratio - 1
    : 1 - ratio;

  if (exceedance > 0.5) return 'high';
  if (exceedance > 0.2) return 'medium';
  return 'low';
}

function findMatchingTemplate(
  scenario: ScenarioInput,
  templates: ResponseTemplate[]
): ResponseTemplate | null {
  // Simple condition matching - can be expanded
  for (const template of templates) {
    if (template.condition === 'highInvestment') {
      const totalInvestment = scenario.supply.investment.cumulative[2050];
      if (totalInvestment > 5000) return template;
    }
    // Add more conditions as needed
  }
  return null;
}

function selectRelevantQuestions(
  allQuestions: string[],
  scenario: ScenarioInput,
  concerns: Concern[]
): string[] {
  // Select 3-5 most relevant questions based on scenario
  // Prioritize questions related to identified concerns
  const selected: string[] = [];

  // Add questions related to concerns
  for (const concern of concerns.slice(0, 2)) {
    const relatedQuestion = findRelatedQuestion(concern.metric, allQuestions);
    if (relatedQuestion && !selected.includes(relatedQuestion)) {
      selected.push(relatedQuestion);
    }
  }

  // Fill remaining slots with general questions
  for (const question of allQuestions) {
    if (selected.length >= 5) break;
    if (!selected.includes(question)) {
      selected.push(question);
    }
  }

  return selected.slice(0, 5);
}

function findRelatedQuestion(metric: string, questions: string[]): string | null {
  // Map metrics to question keywords
  const keywords: Record<string, string[]> = {
    'investment': ['financing', 'investment', 'cost'],
    'emissions': ['emissions', 'climate', 'carbon'],
    'jobs': ['jobs', 'employment', 'workforce'],
    'renewableShare': ['renewable', 'RE', 'VRE'],
    'battery': ['storage', 'battery', 'flexibility']
  };

  for (const [metricKey, relatedKeywords] of Object.entries(keywords)) {
    if (metric.includes(metricKey)) {
      for (const question of questions) {
        for (const keyword of relatedKeywords) {
          if (question.toLowerCase().includes(keyword.toLowerCase())) {
            return question;
          }
        }
      }
    }
  }

  return null;
}
```

---

## AI Enhancement (OPTIONAL, Silent Failover)

AI is a bonus layer on top of an already-complete rule-based response. It is optional,
best-effort, and invisible when it fails.

### The real failover chain — `src/utils/stakeholder-ai.ts`

```typescript
maybeEnhanceWithAI(ruleBasedResponse, stakeholder, scenario, derivedMetrics, config, onChunk?)
```

| Tier | Function | Status | Notes |
|---|---|---|---|
| 1. WebLLM | `enhanceWithWebLLM` | Live | `SmolLM2-1.7B-Instruct-q4f16_1-MLC` over WebGPU, ~1.8 GB cached in the browser, 60 s timeout. Uses the chat API with 2 few-shot examples per stakeholder. |
| 2. Ollama | `enhanceWithOllama` | Live, dev server only | `smollm2:1.7b` via `POST /api/ollama/api/generate`, streams chunks to `onChunk`, 120 s timeout. `/api/ollama` is a **Vite dev proxy**; it does not exist in a production build. |
| 3. Cloud | `enhanceWithCloudAPI` | **Stub** | Returns `null` unconditionally. Nothing is implemented, and no key is read. |
| 4. Rule-based | — | Always | The unmodified response is returned. |

Each tier catches its own errors and returns `null`, so control falls through. Nothing in
this path is allowed to throw into the UI, show an error toast, or block a render.

```typescript
// Shape of every tier
async function enhanceWithX(...): Promise<StakeholderResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.xTimeout);
    // ...call the backend, parse, run echo detection...
    clearTimeout(timeoutId);
    return enhanced;                 // generationType: 'ai-enhanced'
  } catch {
    return null;                     // silent failover to the next tier
  }
}
```

**Echo detection.** Small models frequently repeat the prompt back. Every enhanced response
is checked for echoed prompt fragments and rejected (returning `null`) when detected — this
is why the AI tiers can produce a *worse* result than rule-based and still not degrade the
user's experience. See `docs/WEBLLM-STATUS.md` for the detection rules and test results.

### If you implement the cloud tier

The tool is a static PWA with no backend. **Do not put a provider API key in the client**:
`VITE_*` variables are inlined into the bundle and readable by anyone with the dist folder or
the Pages URL. Route cloud calls through a proxy the workshop organiser controls, keep the
same `Promise<StakeholderResponse | null>` contract, and keep the tier disabled by default so
offline behaviour never regresses. Model ids change often — check current model names in the
provider's docs rather than copying an id out of this file.

### AI System Prompt (With Strict Guardrails)

```typescript
function buildSystemPrompt(stakeholder: StakeholderProfile): string {
  return `You are helping energy planners understand how a ${stakeholder.name} representative would respond to their energy scenario.

## YOUR ROLE
You simulate a realistic, professional perspective - NOT an adversarial one. Stakeholders have legitimate concerns and valuable viewpoints.

## STRICT RULES - VIOLATIONS ARE UNACCEPTABLE

1. TONE: Be professional, constructive, and respectful. Never insulting, accusatory, or inflammatory. You represent a professional stakeholder, not a protester.

2. FACTS ONLY:
   - ONLY reference data that is explicitly provided in the scenario
   - NEVER invent specific policy documents, laws, or agreements that weren't mentioned
   - NEVER claim the scenario violates specific regulations unless named in the input
   - If you need to reference a policy, say "relevant policies" not "the 2023 Renewable Energy Act"

3. NO TECHNICAL CALCULATIONS:
   - Do not calculate LCOE, reserve margins, or system reliability
   - Do not claim specific percentages unless they are in the input data
   - Say "this may require additional grid investment" NOT "this will cost $500 million in grid upgrades"

4. RESPECTFUL CRITICISM:
   - Frame concerns as questions, not accusations
   - "We would want to understand the financing strategy" NOT "This plan is fiscally irresponsible"
   - "This raises questions about community consultation" NOT "Communities were ignored"

5. BALANCED VIEW:
   - Always acknowledge positive aspects before concerns
   - End with constructive suggestions, not demands

## OUTPUT FORMAT
Enhance the rule-based response provided, making it more natural and specific to the scenario data. Keep the same structure:
- Initial Reaction (2-3 sentences)
- What They Would Appreciate (2-4 bullet points with specific numbers from data)
- Key Concerns (2-4 bullet points, professionally worded)
- Questions They Would Ask (3-5 specific questions)
- Advice for Engagement (2-3 suggestions)`;
}

function buildUserPrompt(
  scenario: ScenarioInput,
  stakeholder: StakeholderProfile,
  ruleBasedResponse: StakeholderResponse
): string {
  return `Scenario Summary:
- Country: ${scenario.metadata.country}
- Scenario: ${scenario.metadata.scenarioName}

Key Metrics:
- Renewable capacity 2040: ${scenario.supply.capacity.solarPV[2040] + scenario.supply.capacity.wind[2040]} MW
- Total investment: $${scenario.supply.investment.cumulative[2050]} million
- Emissions 2050: ${scenario.supply.emissions[2050]} Mt CO2

Stakeholder: ${stakeholder.name}

Rule-based response (enhance this):
${JSON.stringify(ruleBasedResponse, null, 2)}

Enhance this response to be more natural and conversational while maintaining professional tone.`;
}

function parseAIResponse(
  aiText: string,
  fallback: StakeholderResponse
): StakeholderResponse {
  // Parse AI response - if parsing fails, return fallback
  try {
    // Simple parsing - could be more sophisticated
    const enhanced = { ...fallback };

    // Extract sections using regex or simple string matching
    // This is a simplified example
    const sections = aiText.split('##');

    for (const section of sections) {
      if (section.includes('Initial Reaction')) {
        enhanced.initialReaction = section.replace('Initial Reaction', '').trim();
      }
      // Parse other sections similarly
    }

    return enhanced;
  } catch (error) {
    return fallback;
  }
}
```

---

## Adjustment Calculator (Soft Metrics Only)

### Purpose

Help users explore how changes to scenario parameters might affect stakeholder sentiment. **NOT for technical analysis.**

### Calculation Logic

```typescript
// src/utils/calculator.ts

export function calculateDirectionalImpacts(
  baseScenario: ScenarioInput,
  baseDerivedMetrics: DerivedMetrics,
  adjustments: AdjustableParameters
): DirectionalImpacts {

  const reShareChange2040 = adjustments.renewableShareTarget2040 -
    calculateBaseREShare(baseScenario, 2040);

  return {
    jobs: {
      direction: reShareChange2040 > 0 ? 'increase' : reShareChange2040 < 0 ? 'decrease' : 'unchanged',
      magnitude: Math.abs(reShareChange2040) > 20 ? 'significant' : 'moderate',
      explanation: 'Solar and wind have higher job factors per MW than fossil fuels'
    },

    landUse: {
      direction: reShareChange2040 > 0 ? 'increase' : 'decrease',
      magnitude: Math.abs(reShareChange2040) > 20 ? 'significant' : 'moderate',
      explanation: 'Solar PV requires approximately 2 hectares per MW'
    },

    emissions: {
      direction: reShareChange2040 > 0 ? 'decrease' : 'increase',
      magnitude: Math.abs(reShareChange2040) > 20 ? 'significant' : 'moderate',
      explanation: 'Replacing fossil generation reduces CO2 emissions'
    },

    stakeholderSentiment: calculateSentimentChanges(
      baseScenario,
      adjustments,
      stakeholderProfiles
    )
  };
}

function calculateBaseREShare(scenario: ScenarioInput, year: number): number {
  const renewable = (scenario.supply.capacity.solarPV[year] || 0) +
                    (scenario.supply.capacity.wind[year] || 0) +
                    (scenario.supply.capacity.hydro[year] || 0) +
                    (scenario.supply.capacity.geothermal[year] || 0) +
                    (scenario.supply.capacity.biomass[year] || 0);

  const total = renewable +
                (scenario.supply.capacity.gas[year] || 0) +
                (scenario.supply.capacity.coal[year] || 0) +
                (scenario.supply.capacity.diesel[year] || 0) +
                (scenario.supply.capacity.hfo[year] || 0);

  return total > 0 ? (renewable / total) * 100 : 0;
}

// Sentiment calculation
function calculateSentimentChanges(
  baseScenario: ScenarioInput,
  adjustments: AdjustableParameters,
  stakeholders: StakeholderProfile[]
): Record<string, SentimentChange> {

  const changes: Record<string, SentimentChange> = {};

  for (const stakeholder of stakeholders) {
    const positiveFactors: string[] = [];
    const negativeFactors: string[] = [];

    // CSOs like higher RE
    if (stakeholder.id === 'csos-ngos') {
      if (adjustments.renewableShareTarget2040 > 70) {
        positiveFactors.push('Ambitious renewable target');
      }
      if (adjustments.coalPhaseoutYear && adjustments.coalPhaseoutYear < 2040) {
        positiveFactors.push('Early coal phase-out');
      }
    }

    // Finance cautious about higher investment
    if (stakeholder.id === 'finance') {
      if (adjustments.investmentLevel === 'high') {
        negativeFactors.push('Higher investment requirements');
      }
    }

    // Communities concerned about land
    if (stakeholder.id === 'public') {
      if (adjustments.renewableShareTarget2040 > 60) {
        negativeFactors.push('Increased land requirements');
        positiveFactors.push('More local jobs');
      }
    }

    // Determine overall sentiment
    const net = positiveFactors.length - negativeFactors.length;
    changes[stakeholder.id] = {
      direction: net > 0 ? 'more_positive' : net < 0 ? 'more_negative' : 'unchanged',
      positiveFactors,
      negativeFactors
    };
  }

  return changes;
}
```

### Required Disclaimer

```typescript
const CALCULATOR_DISCLAIMER = `
⚠️ DIRECTIONAL INDICATORS ONLY

This calculator shows how changes might affect stakeholder sentiment.
It does NOT:
• Calculate technical feasibility
• Replace optimization model outputs
• Provide cost estimates

ALWAYS verify scenario changes in the full model before presenting to stakeholders.
`;
```

---

## Soft Metrics Calculations

Reference implementations for job, land use, and emission calculations.

```typescript
// src/utils/calculations.ts

export function calculateJobs(scenario: ScenarioInput): JobMetrics {
  const constructionJobs: Record<number, number> = {};
  const operationsJobs: Record<number, number> = {};

  for (const year of scenario.milestoneYears) {
    let construction = 0;
    let operations = 0;

    for (const [tech, capacity] of Object.entries(scenario.supply.capacity)) {
      const capacityMW = capacity[year] || 0;
      const prevCapacityMW = capacity[year - 5] || 0;
      const newCapacityMW = Math.max(0, capacityMW - prevCapacityMW);

      construction += newCapacityMW * (JOB_FACTORS.construction[tech] || 0);
      operations += capacityMW * (JOB_FACTORS.operations[tech] || 0);
    }

    constructionJobs[year] = Math.round(construction);
    operationsJobs[year] = Math.round(operations);
  }

  return { construction: constructionJobs, operations: operationsJobs };
}

export function calculateLandUse(scenario: ScenarioInput): LandUseMetrics {
  const landUse: Record<number, number> = {};

  for (const year of scenario.milestoneYears) {
    let totalHectares = 0;

    // Only calculate for technologies with significant land footprint
    const solarMW = scenario.supply.capacity.solarPV[year] || 0;
    const windMW = scenario.supply.capacity.wind[year] || 0;
    const batteryMW = scenario.supply.capacity.battery[year] || 0;

    totalHectares += solarMW * LAND_FACTORS.solarPV;
    totalHectares += windMW * LAND_FACTORS.wind;
    totalHectares += batteryMW * LAND_FACTORS.battery;

    landUse[year] = Math.round(totalHectares);
  }

  return { totalLandUse: landUse };
}

export function calculateEmissions(scenario: ScenarioInput): EmissionMetrics {
  // Emissions are typically provided by the optimization model
  // This function validates and formats them

  const emissions = scenario.supply.emissions;
  const baselineYear = Math.min(...scenario.milestoneYears);
  const baseline = emissions[baselineYear] || 0;

  const reductionPercent: Record<number, number> = {};
  for (const year of scenario.milestoneYears) {
    const currentEmissions = emissions[year] || 0;
    reductionPercent[year] = baseline > 0
      ? ((baseline - currentEmissions) / baseline) * 100
      : 0;
  }

  return {
    absolute: emissions,
    reductionPercent
  };
}
```

---

## Testing Guidelines

Three layers, cheapest first:

| Layer | Command | Covers |
|---|---|---|
| Types | `npm run typecheck` | every schema and signature change |
| Response quality | `npm run test:quality` | template selection, interpolation, grammar, anti-repetition (no browser) |
| End-to-end | `npm run test:chromium`, then `npm test` before a commit | UI flows, storage, PWA |

### Stable selectors

Prefer the `data-testid` hooks that already exist over text matching — most of the currently
failing specs broke because UI copy changed:

`load-example-button`, `quick-entry-button`, `paste-json-button`, `csv-upload-button`,
`csv-file-input`, `csv-parse-button`, `csv-load-button`, `csv-country-input`,
`csv-scenario-name-input`, `scenario-preview`, `preview-emissions`, `preview-investment`,
`capacity-mix-chart`, `export-image-btn`, `proceed-button`, `load-different-button`,
`loading-indicator`, `error-message`, `save-status`.

When a test needs an element that has no hook, add one rather than asserting on a sentence.

### Testing offline behaviour

The Playwright `webServer` runs `npm run dev`, and **vite-plugin-pwa does not generate a
service worker in dev** (`devOptions` is not enabled). So `context.setOffline(true)` in the
current suite proves only that the already-loaded page keeps working — it cannot prove the
precache serves a cold load.

To test the real thing:

```bash
npm run build && npm run preview     # serves dist/ with the generated sw.js
```

then point Playwright at the preview URL, load the page once, go offline, and reload. Either
add a dedicated Playwright project with that `baseURL`, or enable
`VitePWA({ devOptions: { enabled: true } })` for dev runs. Until one of those exists, treat
"works offline" as **unverified by CI** and check it by hand before a workshop.

### Testing AI failover

The cloud tier is a stub, so aborting `api.anthropic.com` proves nothing. What is worth
testing: with WebGPU unavailable and no Ollama running, a reveal still produces a response
with `generationType` of `rule-based` or `enhanced-rule-based`, within a couple of seconds.
Avoid running the WebLLM specs casually — they download ~1.8 GB.

---

## Performance Optimization

### Response Generation Performance

Target: < 200ms for rule-based responses

```typescript
// Optimization techniques:

// 1. Pre-calculate derived metrics once
const derivedMetrics = useMemo(() =>
  calculateDerivedMetrics(scenario),
  [scenario]
);

// 2. Memoize stakeholder responses
const response = useMemo(() =>
  generateRuleBasedResponse(scenario, derivedMetrics, stakeholder),
  [scenario, derivedMetrics, stakeholder.id]
);

// 3. Lazy load stakeholder profiles
const stakeholderProfiles = lazy(() => import('./data/stakeholder-profiles'));
```

### Bundle Size Optimization

**Current state (measured 2026-08-26):** one chunk, `dist/assets/index-*.js`, **6.6 MB**
(2.3 MB gzipped); the service worker precaches 26 entries totalling ~6.5 MB. The cause is a
static `import * as webllm from '@mlc-ai/web-llm'` at the top of `src/utils/stakeholder-ai.ts`,
which every user downloads even when AI is switched off.

The fix is a dynamic import inside the WebLLM tier, so the runtime is fetched only when a
user actually enables browser AI:

```typescript
async function enhanceWithWebLLM(...) {
  const webllm = await import('@mlc-ai/web-llm');   // pulled out of the main chunk
  // ...
}
```

Recharts is the other large dependency and is a good candidate for a `manualChunks` split.
Keep the first-load payload small: participants often install the PWA over a workshop
hotspot.

