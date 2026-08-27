# UI Design Specifications

> **Source of truth:** `src/index.css`. The project uses **Tailwind CSS v4**, which is
> CSS-first — tokens are declared in an `@theme` block, and there is **no
> `tailwind.config.js`**. Do not create one.
> Last verified against the code: 2026-08-26.

## Design System

### Tokens (`src/index.css`)

```css
@import "tailwindcss";

@theme {
  /* IRENA brand */
  --color-irena-blue:        #0078a7;
  --color-irena-blue-dark:   #005373;
  --color-irena-blue-light:  #4da6ca;
  --color-irena-orange:      #f7941d;
  --color-irena-orange-dark: #d67a10;

  /* Stakeholder colours (from the IRENA toolkit) */
  --color-stakeholder-policy:      #c94f4f;
  --color-stakeholder-grid:        #4a90a4;
  --color-stakeholder-industry:    #7b8a3e;
  --color-stakeholder-public:      #e8a54b;
  --color-stakeholder-csos:        #6b4c9a;
  --color-stakeholder-science:     #3d7ea6;
  --color-stakeholder-finance:     #2e5a3a;
  --color-stakeholder-regional:    #1a5276;
  --color-stakeholder-development: #117a65;

  --font-sans:    'Inter', system-ui, -apple-system, sans-serif;
  --font-heading: 'Montserrat', system-ui, -apple-system, sans-serif;
}
```

Each token is usable both as a Tailwind utility (`bg-irena-blue`, `text-stakeholder-finance`)
and as a CSS variable (`var(--color-irena-blue)`), which is how inline `style` props in
`Header.tsx` and the chart components reference it.

Greys, spacing, radii, shadows and transitions come from **Tailwind's defaults** — use
`text-gray-700`, `p-6`, `rounded-lg`, `shadow-md` rather than inventing a parallel scale.

> **Font note:** `Inter` and `Montserrat` are pulled from the Google Fonts CDN by an
> `@import` at the top of `src/index.css`. That request is not covered by the service worker,
> so a genuinely offline first load falls back to `system-ui`. Self-hosting the two families
> is the open fix — see `docs/KNOWN-GAPS.md`.
>
> **Brand colour note:** the PWA `theme_color` / `background_color` in `vite.config.ts` and
> `index.html` is `#005a82`, which is not the brand blue `#0078a7`. Align them when you next
> touch the manifest.

### Component classes

Defined once in `src/index.css`, used across the app instead of repeating utility strings:

| Class | Use |
|---|---|
| `.btn-primary` | Filled IRENA-blue action button (has a visible focus outline) |
| `.btn-secondary` | Neutral bordered button |
| `.btn-outline` | IRENA-blue outlined button, fills on hover |
| `.card` | White surface, rounded, soft shadow, `1.5rem` padding |
| `.disclaimer` | Small grey italic note — the standard illustrative-estimates wording |
| `.section-divider` | Top rule with consistent vertical rhythm |
| `.metric-row` | Blue left rule + `.metric-label` / `.metric-value` / `.metric-sub` stack |
| `.offline-indicator` | Slow pulse animation for the connectivity dot |
| `.slider-thumb-irena` | Branded range-slider thumb (WebKit + Firefox) |

### Typography

`Inter` for body text, `Montserrat` for headings (applied to `h1`-`h6` in the base layer).
Sizes come from Tailwind's scale; the app leans on `text-2xl` for the page title,
`text-lg`/`font-semibold` for section headings and `text-sm` for supporting copy.

### Accessibility

Target is WCAG 2.1 AA. What the code already relies on: `role="banner"` / `role="status"`
with `aria-live="polite"` in the header, `aria-expanded` on collapsible sections, visible
focus outlines on `.btn-primary`, and `data-testid` hooks where text is ambiguous. Keep
those when restyling — several are load-bearing for the Playwright suite.

---

## Application Layout

### Four-Tab Structure

1. **Input** - Data import (5 minutes max)
2. **Stakeholder Dialogue** - Predict-before-reveal learning
3. **Explore Impacts** - Directional sensitivity (soft metrics only)
4. **Communicate** - Audience-specific outputs

### Main App Shell

```
┌─────────────────────────────────────────────────────────────┐
│  [IRENA Logo]    Scenario Dialogue Tool        [Settings ⚙] │
├─────────────────────────────────────────────────────────────┤
│  [Input] [Stakeholder Dialogue] [Explore] [Communicate]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│                    Tab Content Area                          │
│                                                              │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Status: ScenarioLand High RE Scenario | Offline Mode ✓           │
└─────────────────────────────────────────────────────────────┘
```

---

## Tab 1: Data Input

### Input Options Screen

```
┌─────────────────────────────────────────────────────────────┐
│  DATA INPUT                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Choose how to input your scenario data:                     │
│                                                              │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │   📊 FROM FILE     │  │   ✏️ QUICK ENTRY  │            │
│  │                    │  │                    │            │
│  │  Import from JSON  │  │  Enter key metrics │            │
│  │  or paste from     │  │  manually (10 min) │            │
│  │  Excel template    │  │                    │            │
│  │                    │  │                    │            │
│  │  [Upload/Paste]    │  │  [Start Entry]     │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                              │
│  ┌────────────────────┐                                     │
│  │   🔍 LOAD EXAMPLE  │                                     │
│  │                    │                                     │
│  │  Try the tool with │                                     │
│  │  sample scenario   │                                     │
│  │                    │                                     │
│  │  [Load Sample]     │                                     │
│  └────────────────────┘                                     │
│                                                              │
│  ℹ️  Download Excel template: [SPLAT-OUTPUT-IMPORTER.xlsx] │
└─────────────────────────────────────────────────────────────┘
```

### Quick Entry Form

```
┌─────────────────────────────────────────────────────────────┐
│  QUICK ENTRY FORM                              Progress: 40% │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SCENARIO METADATA                                           │
│  Country/Region:    [________________]                       │
│  Scenario Name:     [________________]                       │
│                                                              │
│  CAPACITY (MW)                                               │
│                           2030         2040                  │
│  Renewable capacity:     [____]        [____]                │
│  Fossil capacity:        [____]        [____]                │
│  Battery storage:        [____]        [____]                │
│                                                              │
│  INVESTMENT (USD millions)                                   │
│  Total to 2030:          [________]                          │
│  Total to 2050:          [________]                          │
│                                                              │
│  EMISSIONS (Mt CO2)                                          │
│                     2025    2030    2040    2050             │
│  Emissions:        [___]   [___]   [___]   [___]            │
│                                                              │
│  [< Back]                          [Continue >]             │
└─────────────────────────────────────────────────────────────┘
```

---

## Tab 2: Stakeholder Dialogue

### Predict-Before-Reveal Interface

```
┌─────────────────────────────────────────────────────────────┐
│  STAKEHOLDER DIALOGUE                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SELECT STAKEHOLDER:                                         │
│                                                              │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐            │
│  │🏛️│ │⚡│ │🏭│ │👥│ │🌿│ │🔬│ │💰│ │🌍│ │🤝│            │
│  └──┘ └▲─┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘            │
│       Grid                                                   │
│    Operators                                                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  YOUR PREDICTION                                      │   │
│  │  ──────────────────────────────────────────────────   │   │
│  │  What do you think Grid Operators will say about     │   │
│  │  this scenario?                                       │   │
│  │                                                       │   │
│  │  Consider their priorities:                           │   │
│  │  • System reliability and security of supply          │   │
│  │  • Manageable renewable integration pace              │   │
│  │  • Transmission infrastructure planning               │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ I think they will be concerned about the high  │  │   │
│  │  │ renewable share and will want to know about    │  │   │
│  │  │ battery storage and grid upgrades needed...    │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                        [78/20 chars] │   │
│  │                                                       │   │
│  │                      [Reveal Response]                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Response Comparison View

```
┌─────────────────────────────────────────────────────────────┐
│  COMPARE YOUR PREDICTION                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  YOUR PREDICTION:                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ I think they will be concerned about the high        │   │
│  │ renewable share and will want to know about battery  │   │
│  │ storage and grid upgrades needed...                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  SIMULATED GRID OPERATOR RESPONSE:            [Rule-based]  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ## Initial Reaction                                  │   │
│  │  This scenario shows ambition but raises important    │   │
│  │  questions about implementation pace and flexibility  │   │
│  │  resources to maintain system reliability.            │   │
│  │                                                       │   │
│  │  ## What They Would Appreciate                        │   │
│  │  ✓ Interconnector expansion of 500 MW by 2040        │   │
│  │    enables regional power balancing                   │   │
│  │  ✓ Battery storage deployment of 500 MW by 2040      │   │
│  │    provides essential system flexibility              │   │
│  │                                                       │   │
│  │  ## Key Concerns                                      │   │
│  │  ⚠ Variable renewable share of 70% by 2040 requires  │   │
│  │    significant transmission infrastructure upgrades   │   │
│  │  ⚠ Limited battery storage before 2035 may           │   │
│  │    constrain renewable integration pace               │   │
│  │                                                       │   │
│  │  ## Questions They Would Ask                          │   │
│  │  ? What transmission upgrades are assumed?            │   │
│  │  ? What flexibility resources support high RE shares? │   │
│  │  ? How are interconnector flows coordinated?          │   │
│  │                                                       │   │
│  │  ## Advice for Engaging Grid Operators               │   │
│  │  → Engage early to incorporate existing plans        │   │
│  │  → Include distribution-level operators               │   │
│  │  → Prioritize cost-efficient solutions                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  💭 REFLECTION: How did your prediction compare?            │
│                                                              │
│  [Try Another Stakeholder]  [Export Brief]  [Explore >]     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tab 3: Explore Impacts

### Adjustment Calculator

```
┌─────────────────────────────────────────────────────────────┐
│  EXPLORE IMPACTS                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ⚠️ DIRECTIONAL INDICATORS ONLY - NOT TECHNICAL ANALYSIS   │
│                                                              │
│  ADJUST SCENARIO PARAMETERS:                                 │
│                                                              │
│  Renewable Share Target 2040:  [||||||||----] 65%           │
│                                                              │
│  Investment Level:  ○ Low  ● Base  ○ High                   │
│                                                              │
│  Coal Phase-out Year:  [2035 ▼]                             │
│                                                              │
│  ─────────────────────────────────────────────────────       │
│                                                              │
│  DIRECTIONAL IMPACTS:                                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Jobs         │  │ Land Use     │  │ Emissions    │      │
│  │   ↑ +15%     │  │   ↑ +20%     │  │   ↓ -25%     │      │
│  │ Significant  │  │ Significant  │  │ Significant  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  STAKEHOLDER SENTIMENT CHANGES:                              │
│                                                              │
│  CSOs & NGOs:            ↗ More positive                    │
│    + Ambitious renewable target                              │
│    + Early coal phase-out                                    │
│                                                              │
│  Public & Communities:   → Mixed                            │
│    + More local jobs                                         │
│    - Increased land requirements                             │
│                                                              │
│  Financial Institutions: ↘ More cautious                    │
│    - Higher investment requirements                          │
│                                                              │
│  [Reset to Base]                    [Generate New Dialogue] │
└─────────────────────────────────────────────────────────────┘
```

---

## Tab 4: Communicate

### Output Generation

```
┌─────────────────────────────────────────────────────────────┐
│  COMMUNICATE RESULTS                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Generate stakeholder-specific briefs and presentations:     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SELECT STAKEHOLDERS:                                 │   │
│  │  ☑ Policy Makers & Regulators                         │   │
│  │  ☑ Grid Operators                                     │   │
│  │  ☐ Industry & Business                                │   │
│  │  ☑ Public & Communities                               │   │
│  │  ☐ CSOs & NGOs                                        │   │
│  │  ☐ Scientific Institutions                            │   │
│  │  ☐ Financial Institutions                             │   │
│  │  ☐ Regional Bodies                                    │   │
│  │  ☐ Development Partners                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  OUTPUT FORMAT:                                              │
│  ○ PDF Brief (summary + key messages)                       │
│  ○ PowerPoint Slides (presentation-ready)                   │
│  ○ Word Document (detailed report)                          │
│  ○ JSON Data (for further analysis)                         │
│                                                              │
│  INCLUDE:                                                    │
│  ☑ Scenario overview                                        │
│  ☑ Anticipated responses                                    │
│  ☑ Engagement advice                                        │
│  ☑ Key metrics & visualizations                             │
│  ☐ Your predictions (comparison)                            │
│                                                              │
│  [Preview]                              [Generate & Export] │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Design Patterns

### Stakeholder Icon Button

```jsx
<button className={`
  relative w-16 h-16 rounded-lg
  border-2 transition-all
  ${selected
    ? 'border-stakeholder-grid bg-stakeholder-grid/10 scale-105'
    : 'border-gray-200 hover:border-stakeholder-grid/50'
  }
`}>
  <img src="/icons/grid-operators.svg" alt="Grid Operators" />
  {selected && (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2
                    text-xs font-medium text-stakeholder-grid">
      Selected
    </div>
  )}
</button>
```

### Concern Card

```jsx
<div className="border-l-4 border-warning bg-warning-light p-4 rounded-r-md">
  <div className="flex items-start gap-3">
    <span className="text-2xl">⚠</span>
    <div>
      <p className="font-medium text-gray-900">
        Variable renewable share of 70% by 2040 requires significant
        transmission infrastructure upgrades
      </p>
      <p className="text-sm text-gray-600 mt-1">
        Grid operators need time and investment for infrastructure adaptation.
      </p>
      <div className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500">
        <span className="px-2 py-1 bg-warning/20 rounded">Medium severity</span>
        <span>Metric: renewableShare.2040</span>
      </div>
    </div>
  </div>
</div>
```

### Appreciation Card

```jsx
<div className="border-l-4 border-success bg-success-light p-4 rounded-r-md">
  <div className="flex items-start gap-3">
    <span className="text-2xl">✓</span>
    <div>
      <p className="font-medium text-gray-900">
        Interconnector expansion of 500 MW by 2040 enables regional
        power balancing
      </p>
    </div>
  </div>
</div>
```

### Disclaimer Alert

```jsx
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  <div className="flex gap-3">
    <span className="text-yellow-600 text-xl shrink-0">⚠️</span>
    <div>
      <h3 className="font-semibold text-yellow-900 mb-1">
        ILLUSTRATIVE ESTIMATES ONLY
      </h3>
      <p className="text-sm text-yellow-800">
        These figures show directional impacts for discussion purposes.
        They do NOT replace optimization model technical analysis.
        Always verify feasibility in the full model.
      </p>
    </div>
  </div>
</div>
```

---

## Responsive Design

### Breakpoints

```typescript
const breakpoints = {
  mobile: '320px',      // Mobile phones
  tablet: '768px',      // Tablets
  desktop: '1024px',    // Desktop
  wide: '1280px',       // Wide desktop
};
```

### Mobile Adaptations

- Stack stakeholder icons vertically on mobile
- Single-column layout for response view
- Collapsible sections for long content
- Bottom navigation for tabs
- Larger touch targets (min 44x44px)

### Tablet Optimizations

- Two-column layout for stakeholder selection
- Side-by-side prediction/response comparison
- Persistent tab navigation

### Desktop Experience

- Full multi-column layouts
- Persistent sidebar navigation
- Hover states and tooltips
- Keyboard shortcuts

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast

All text meets WCAG AA contrast ratios:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

### Keyboard Navigation

- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts (with tooltips)

### Screen Reader Support

- Semantic HTML structure
- ARIA labels for icon buttons
- ARIA live regions for dynamic content
- Alt text for all images

### Other Considerations

- No flashing content
- Sufficient text spacing
- Resizable text (up to 200%)
- Clear error messages

---

## Offline Mode Indicators

### Online Status

```jsx
<div className="flex items-center gap-2 text-sm">
  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
  <span className="text-gray-600">Online - AI enhancement available</span>
</div>
```

### Offline Status

```jsx
<div className="flex items-center gap-2 text-sm">
  <div className="w-2 h-2 bg-gray-400 rounded-full" />
  <span className="text-gray-600">Offline - Using rule-based responses</span>
</div>
```

---

## Animation Guidelines

### Principles

- Use animations to guide attention, not distract
- Keep durations short (150-350ms)
- Respect `prefers-reduced-motion`

### Common Animations

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## Print Styles

For PDF export and printing:

```css
@media print {
  /* Hide navigation and interactive elements */
  nav, button, .no-print {
    display: none !important;
  }

  /* Ensure proper page breaks */
  .stakeholder-response {
    page-break-inside: avoid;
  }

  /* Optimize colors for printing */
  .bg-primary {
    background-color: #0078a7 !important;
    -webkit-print-color-adjust: exact;
  }
}
```
