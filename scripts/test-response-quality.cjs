#!/usr/bin/env node
/**
 * Standalone quality test for the response template library.
 * No Playwright or browser needed — exercises template selection + interpolation
 * across a matrix of scenarios × stakeholders × variants.
 *
 * Usage:  node scripts/test-response-quality.cjs
 *         node scripts/test-response-quality.cjs --verbose
 *         node scripts/test-response-quality.cjs --stakeholder=policy-makers
 *         node scripts/test-response-quality.cjs --variant=conservative
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// 1. Load the generated response library (data only) by stripping TS syntax
// ---------------------------------------------------------------------------
const libPath = path.join(__dirname, '..', 'src', 'data', 'response-library.ts');
let libSrc = fs.readFileSync(libPath, 'utf-8');

// Strip TypeScript syntax so we can eval as JS
libSrc = libSrc
  // Remove interface blocks (export interface ... { ... })
  .replace(/export interface [\s\S]*?^}/gm, '')
  // Remove type alias lines
  .replace(/export type [^;]+;/g, '')
  // Remove export keywords
  .replace(/^export /gm, '')
  // Remove JSDoc comments
  .replace(/\/\*\*[\s\S]*?\*\//g, '')
  // Remove return type annotations on functions: ): Type {  or ): Type | null {
  .replace(/\):\s*[A-Za-z\[\]|<>, ]+\s*\{/g, ') {')
  // Remove parameter type annotations: (name: Type, name: Type)
  .replace(/(\w+)\s*:\s*(?:string|number|boolean|Record<[^>]+>|ResponseTemplate(?:\[\])?)\s*(,|\))/g, '$1$2')
  // Remove optional param markers: name?: Type
  .replace(/(\w+)\?\s*:\s*(?:string|number|boolean)\s*(,|\))/g, '$1$2')
  // Remove const type annotations: const x: Type =
  .replace(/:\s*TemplateLibrary\s*=/g, ' =')
  ;

// Wrap in a module
const libModule = {};
const libFn = new Function('module', 'exports', libSrc + `
  module.exports = {
    RESPONSE_TEMPLATES,
    getTemplates,
  };
`);
libFn(libModule, libModule.exports = {});
const { RESPONSE_TEMPLATES, getTemplates } = libModule.exports;

// ---------------------------------------------------------------------------
// 1b. Load the template-selector module
// ---------------------------------------------------------------------------
const selectorPath = path.join(__dirname, '..', 'src', 'data', 'template-selector.ts');
let selSrc = fs.readFileSync(selectorPath, 'utf-8');

// Strip TypeScript syntax
selSrc = selSrc
  // Remove import statements
  .replace(/^import .*;\s*$/gm, '')
  // Remove export keywords
  .replace(/^export /gm, '')
  // Remove JSDoc comments
  .replace(/\/\*\*[\s\S]*?\*\//g, '')
  // Remove generic type parameters from new Map/Set: new Map<...>() → new Map()
  .replace(/new\s+(Map|Set)<[^>]+>\(\)/g, 'new $1()')
  // Remove type annotations on const: const x: Record<...> = ...
  .replace(/:\s*Record<[^>]+>\s*=/g, ' =')
  // Remove Map type annotations: const x: Map<...> (without =, just declarations)
  .replace(/:\s*Map<[^>]+>/g, '')
  // Remove return type annotations on functions: ): Type { or ): { text: ... } {
  .replace(/\):\s*(?:\{[^}]*\}|[A-Za-z\[\]|<>{}, ]+)\s*\{/g, ') {')
  // Remove parameter type annotations (common types)
  .replace(/(\w+)\s*:\s*(?:string|number|boolean|number\[\]|ResponseTemplate(?:\[\])?|Record<[^>]+>)\s*(,|\))/g, '$1$2')
  // Remove optional parameter type annotations
  .replace(/(\w+)\?\s*:\s*(?:string|number|boolean|number\[\])\s*(,|\))/g, '$1$2')
  // Remove 'as string' type assertions
  .replace(/\s+as\s+string/g, '')
  ;

// Inject the getTemplates dependency
const selModule = {};
const selFn = new Function('module', 'exports', 'getTemplates', selSrc + `
  module.exports = {
    selectTemplate,
    interpolateTemplate,
    resetShuffleBags,
  };
`);
selFn(selModule, selModule.exports = {}, getTemplates);
const { selectTemplate, interpolateTemplate, resetShuffleBags } = selModule.exports;

// ---------------------------------------------------------------------------
// 2. Define test scenarios covering the full RE spectrum
// ---------------------------------------------------------------------------
const SCENARIOS = [
  {
    name: 'Low RE – Fossil Heavy',
    country: 'Petrolia',
    reShare: 15,
    emissions: 42.0,
    investment: 8500,
    capacity: { renewables: 2000, fossil: 12000, storage: 100 },
    generation: { renewables: 5000, fossil: 55000 },
    peakDemand: 11000,
    capacityAdditions: { renewables: 400, fossil: 1200, storage: 50 },
  },
  {
    name: 'Low-Medium RE – Transitioning',
    country: 'Transitia',
    reShare: 35,
    emissions: 25.0,
    investment: 14000,
    capacity: { renewables: 6000, fossil: 10000, storage: 500 },
    generation: { renewables: 18000, fossil: 33000 },
    peakDemand: 12500,
    capacityAdditions: { renewables: 2000, fossil: 500, storage: 300 },
  },
  {
    name: 'Medium RE – Balanced',
    country: 'Mediania',
    reShare: 50,
    emissions: 16.5,
    investment: 18000,
    capacity: { renewables: 10000, fossil: 8500, storage: 1200 },
    generation: { renewables: 38000, fossil: 38000 },
    peakDemand: 14000,
    capacityAdditions: { renewables: 3500, fossil: 200, storage: 800 },
  },
  {
    name: 'High RE – Ambitious',
    country: 'Morocco',
    reShare: 70,
    emissions: 9.2,
    investment: 22500,
    capacity: { renewables: 15000, fossil: 5000, storage: 2500 },
    generation: { renewables: 55000, fossil: 23000 },
    peakDemand: 13800,
    capacityAdditions: { renewables: 5000, fossil: 0, storage: 1500 },
  },
  {
    name: 'High RE – Kenya Style',
    country: 'Kenya',
    reShare: 80,
    emissions: 5.2,
    investment: 32500,
    capacity: { renewables: 22000, fossil: 4000, storage: 3000 },
    generation: { renewables: 78000, fossil: 20000 },
    peakDemand: 17200,
    capacityAdditions: { renewables: 8000, fossil: 0, storage: 2500 },
  },
  {
    name: 'Very High RE – Near Decarbonized',
    country: 'Costa Rica',
    reShare: 98,
    emissions: 0.3,
    investment: 65000,
    capacity: { renewables: 45000, fossil: 1000, storage: 5000 },
    generation: { renewables: 162000, fossil: 3000 },
    peakDemand: 28500,
    capacityAdditions: { renewables: 20000, fossil: 0, storage: 4000 },
  },
  {
    name: 'Small Island – Limited Scale',
    country: 'Fiji',
    reShare: 60,
    emissions: 0.8,
    investment: 1200,
    capacity: { renewables: 300, fossil: 180, storage: 80 },
    generation: { renewables: 900, fossil: 600 },
    peakDemand: 220,
    capacityAdditions: { renewables: 100, fossil: 0, storage: 40 },
  },
];

const STAKEHOLDERS = [
  'policy-makers',
  'grid-operators',
  'industry',
  'public',
  'csos-ngos',
  'scientific',
  'finance',
  'regional-bodies',
  'development-partners',
];

const VARIANTS = ['conservative', 'pragmatic', 'progressive'];

// Sample concern/appreciation texts (simulating what the rule engine would produce)
const SAMPLE_POSITIVES = [
  'Strong renewable energy commitments',
  'Job creation potential in clean energy sector',
  'Debt sustainability considerations addressed',
  'Environmental safeguards proposed',
  'Universal access progress planned',
  'Reserve sharing agreements considered',
  'Transparency in the planning process',
];

const SAMPLE_CONCERNS = [
  'Investment costs may strain fiscal capacity',
  'Grid integration challenges with high VRE penetration',
  'Local content requirements may increase costs',
  'Community consultation process unclear',
  'Accountability mechanisms weak',
  'Regional master plan alignment unclear',
  'Capacity building needs underestimated',
];

// ---------------------------------------------------------------------------
// 3. Structure checks (pre-pass on library)
// ---------------------------------------------------------------------------

function checkLibraryStructure() {
  const structureIssues = [];

  // For each stakeholder/variant bucket, check for issues
  for (const stakeholderId of STAKEHOLDERS) {
    for (const variant of VARIANTS) {
      const templates = getTemplates(stakeholderId, variant);

      if (templates.length === 0) {
        structureIssues.push(`[EMPTY] ${stakeholderId}/${variant}: no templates`);
        continue;
      }

      // Check for exact duplicates within bucket
      const texts = templates.map(t => t.text.trim().toLowerCase());
      const uniqueTexts = new Set(texts);
      if (uniqueTexts.size < texts.length) {
        const dupeCount = texts.length - uniqueTexts.size;
        structureIssues.push(`[DUPE] ${stakeholderId}/${variant}: ${dupeCount} duplicate text(s)`);
      }

      // Check sentence-start diversity (first 4 words)
      const starts = templates.map(t => {
        // Strip conditional and variation markers for start analysis
        const clean = t.text
          .replace(/\{\?[a-zA-Z]+:/g, '')
          .replace(/\{~[^}]+\}/g, (m) => m.split('|')[0].replace('{~', ''))
          .replace(/\}/g, '')
          .trim();
        return clean.split(/\s+/).slice(0, 4).join(' ').toLowerCase();
      });
      const uniqueStarts = new Set(starts);
      const startDiversity = uniqueStarts.size / starts.length;
      if (startDiversity < 0.3 && templates.length > 3) {
        structureIssues.push(`[LOW_DIVERSITY] ${stakeholderId}/${variant}: only ${uniqueStarts.size}/${starts.length} unique starts (${(startDiversity * 100).toFixed(0)}%)`);
      }

      // Check cross-template similarity (Jaccard > 85%)
      for (let i = 0; i < templates.length; i++) {
        for (let j = i + 1; j < templates.length; j++) {
          const wordsA = new Set(templates[i].text.toLowerCase().split(/\s+/));
          const wordsB = new Set(templates[j].text.toLowerCase().split(/\s+/));
          const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));
          const union = new Set([...wordsA, ...wordsB]);
          const jaccard = intersection.size / union.size;
          if (jaccard > 0.85) {
            structureIssues.push(`[SIMILAR] ${stakeholderId}/${variant}: templates ${templates[i].id} & ${templates[j].id} are ${(jaccard * 100).toFixed(0)}% similar`);
          }
        }
      }
    }
  }

  return structureIssues;
}

// ---------------------------------------------------------------------------
// 4. Quality checks (per-output)
// ---------------------------------------------------------------------------

function checkQuality(text, context) {
  const issues = [];

  // Empty or too short
  if (!text || text.trim().length === 0) {
    issues.push('EMPTY response');
  } else if (text.length < 20) {
    issues.push(`TOO SHORT (${text.length} chars)`);
  }

  // Unreplaced placeholders (but NOT conditional blocks {?...} or variations {~...})
  const placeholders = text.match(/\$?\{(?![?~])[a-zA-Z]+\}/g);
  if (placeholders) {
    issues.push(`UNREPLACED PLACEHOLDERS: ${placeholders.join(', ')}`);
  }

  // Unreplaced conditional blocks
  const conditionals = text.match(/\{\?[a-zA-Z]+:[^}]*\}/g);
  if (conditionals) {
    issues.push(`UNREPLACED CONDITIONALS: ${conditionals.length}`);
  }

  // Unreplaced variation markers
  const variations = text.match(/\{~[^}]+\}/g);
  if (variations) {
    issues.push(`UNREPLACED VARIATIONS: ${variations.length}`);
  }

  // Doubled periods or commas
  if (/\.\./.test(text)) issues.push('DOUBLE PERIOD');
  if (/,,/.test(text)) issues.push('DOUBLE COMMA');

  // Starts with lowercase (not "we", "our" etc)
  if (/^[a-z]/.test(text) && !/^(we |our |the |this |a |an )/.test(text.toLowerCase())) {
    issues.push('STARTS LOWERCASE');
  }

  // Contains JS artifacts "undefined" or "NaN" (skip "the undefined X" which is valid English)
  if (/\bNaN\b/.test(text)) {
    issues.push('CONTAINS NaN');
  }
  if (/\bundefined\b/.test(text) && !/\bthe undefined\b/i.test(text)) {
    issues.push('CONTAINS undefined');
  }

  // Awkward double spaces
  if (/  /.test(text)) {
    issues.push('DOUBLE SPACE');
  }

  // Very long (> 500 chars — initial reaction should be 2-3 sentences)
  if (text.length > 500) {
    issues.push(`VERY LONG (${text.length} chars)`);
  }

  // Lone connector at start: starts with "but", "yet", "however" etc
  if (/^(?:but|yet|however|though|while|and|or)\s/i.test(text)) {
    issues.push('LONE CONNECTOR AT START');
  }

  // Dangling connector at end: ends with "but", "yet" etc
  if (/(?:but|yet|however|though|while|and|or)\s*\.?\s*$/i.test(text) && text.length > 30) {
    issues.push('DANGLING CONNECTOR AT END');
  }

  // Very long average sentence (>40 words per sentence)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 0) {
    const totalWords = text.split(/\s+/).length;
    const avgWordsPerSentence = totalWords / sentences.length;
    if (avgWordsPerSentence > 40) {
      issues.push(`VERY LONG SENTENCES (avg ${avgWordsPerSentence.toFixed(0)} words)`);
    }
  }

  // Check for number references (good sign)
  const hasNumbers = /\d/.test(text);

  // Check for first-person voice
  const hasFirstPerson = /\b(we|our|us)\b/i.test(text);

  return { issues, hasNumbers, hasFirstPerson };
}

// ---------------------------------------------------------------------------
// 5. Run the matrix
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const verbose = args.includes('--verbose') || args.includes('-v');
const filterStakeholder = args.find(a => a.startsWith('--stakeholder='))?.split('=')[1];
const filterVariant = args.find(a => a.startsWith('--variant='))?.split('=')[1];
const filterScenario = args.find(a => a.startsWith('--scenario='))?.split('=')[1];

// --- Structure checks first ---
console.log('='.repeat(80));
console.log('  LIBRARY STRUCTURE CHECKS');
console.log('='.repeat(80));

const structureIssues = checkLibraryStructure();
if (structureIssues.length === 0) {
  console.log('\n  ✅ All structure checks passed!\n');
} else {
  console.log(`\n  ⚠️  ${structureIssues.length} structure issue(s):\n`);
  for (const issue of structureIssues) {
    console.log(`    ${issue}`);
  }
  console.log('');
}

// --- Template count summary ---
let totalTemplateCount = 0;
for (const s of STAKEHOLDERS) {
  for (const v of VARIANTS) {
    totalTemplateCount += getTemplates(s, v).length;
  }
}
console.log(`  Total templates in library: ${totalTemplateCount}`);
console.log('');

// --- Main quality test ---
let totalTests = 0;
let totalIssues = 0;
let totalWithNumbers = 0;
let totalFirstPerson = 0;
let nullTemplates = 0;
const issuesByType = {};
const issueDetails = [];

// Per-stakeholder stats
const stakeholderStats = {};

const stakeholders = filterStakeholder ? [filterStakeholder] : STAKEHOLDERS;
const variants = filterVariant ? [filterVariant] : VARIANTS;
const scenarios = filterScenario
  ? SCENARIOS.filter(s => s.name.toLowerCase().includes(filterScenario.toLowerCase()))
  : SCENARIOS;

console.log('='.repeat(80));
console.log('  RESPONSE TEMPLATE QUALITY TEST');
console.log(`  ${scenarios.length} scenarios × ${stakeholders.length} stakeholders × ${variants.length} variants = ${scenarios.length * stakeholders.length * variants.length} combinations`);
console.log('='.repeat(80));
console.log('');

// Reset shuffle bags before testing
resetShuffleBags();

for (const scenario of scenarios) {
  if (verbose) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`  SCENARIO: ${scenario.name} (${scenario.country}, RE ${scenario.reShare}%)`);
    console.log(`${'─'.repeat(70)}`);
  }

  for (const stakeholderId of stakeholders) {
    for (const variant of variants) {
      totalTests++;

      // Select a template
      const template = selectTemplate(stakeholderId, variant, scenario.reShare);

      if (!template) {
        nullTemplates++;
        if (verbose) {
          console.log(`  [NULL] ${stakeholderId}/${variant} — no template found`);
        }
        continue;
      }

      // Build metrics
      const totalCap = scenario.capacity.renewables + scenario.capacity.fossil + (scenario.capacity.storage || 0);
      const totalGen = scenario.generation.renewables + scenario.generation.fossil;
      const totalAdds = scenario.capacityAdditions
        ? scenario.capacityAdditions.renewables + scenario.capacityAdditions.fossil + (scenario.capacityAdditions.storage || 0)
        : 0;

      const metrics = {
        reShare: Math.round(scenario.reShare).toLocaleString(),
        emissions: scenario.emissions.toLocaleString(),
        investment: scenario.investment.toLocaleString(),
        capacity: totalCap.toLocaleString(),
        generation: totalGen.toLocaleString(),
        peakDemand: scenario.peakDemand.toLocaleString(),
        capacityAdditions: totalAdds.toLocaleString(),
      };

      // Pick random positive/concern
      const positive = SAMPLE_POSITIVES[Math.floor(Math.random() * SAMPLE_POSITIVES.length)];
      const concern = SAMPLE_CONCERNS[Math.floor(Math.random() * SAMPLE_CONCERNS.length)];

      const result = interpolateTemplate(template, metrics, positive, concern);

      const quality = checkQuality(result, { stakeholderId, variant, scenario: scenario.name });

      // Track stats
      if (!stakeholderStats[stakeholderId]) {
        stakeholderStats[stakeholderId] = { total: 0, issues: 0, numbers: 0, firstPerson: 0 };
      }
      stakeholderStats[stakeholderId].total++;
      if (quality.hasNumbers) { totalWithNumbers++; stakeholderStats[stakeholderId].numbers++; }
      if (quality.hasFirstPerson) { totalFirstPerson++; stakeholderStats[stakeholderId].firstPerson++; }

      if (quality.issues.length > 0) {
        totalIssues++;
        stakeholderStats[stakeholderId].issues++;
        for (const issue of quality.issues) {
          const type = issue.split('(')[0].split(':')[0].trim();
          issuesByType[type] = (issuesByType[type] || 0) + 1;
          issueDetails.push({
            stakeholder: stakeholderId,
            variant,
            scenario: scenario.name,
            issue,
            text: result.slice(0, 100),
          });
        }
      }

      if (verbose) {
        const tag = quality.issues.length > 0
          ? `  [ISSUE] ${quality.issues.join(', ')}`
          : '  [OK]';
        const numTag = quality.hasNumbers ? '📊' : '  ';
        const voiceTag = quality.hasFirstPerson ? '👤' : '  ';
        console.log(`${tag} ${numTag}${voiceTag} ${stakeholderId}/${variant}`);
        console.log(`         "${result.slice(0, 120)}${result.length > 120 ? '...' : ''}"`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Anti-repetition test
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(80));
console.log('  ANTI-REPETITION TEST');
console.log('='.repeat(80));

resetShuffleBags();
let antiRepeatPasses = 0;
let antiRepeatFails = 0;

for (const stakeholderId of ['policy-makers', 'csos-ngos', 'finance']) {
  for (const variant of ['pragmatic']) {
    const history = [];
    const selectedIds = [];
    for (let i = 0; i < 10; i++) {
      const t = selectTemplate(stakeholderId, variant, 70, history);
      if (t) {
        selectedIds.push(t.id);
        history.push(t.id);
      }
    }

    // Check for consecutive repeats
    let hasConsecutiveRepeat = false;
    for (let i = 1; i < selectedIds.length; i++) {
      if (selectedIds[i] === selectedIds[i - 1]) {
        hasConsecutiveRepeat = true;
        break;
      }
    }

    const uniqueCount = new Set(selectedIds).size;
    const status = hasConsecutiveRepeat ? 'FAIL' : 'PASS';
    if (hasConsecutiveRepeat) antiRepeatFails++;
    else antiRepeatPasses++;

    console.log(`  [${status}] ${stakeholderId}/${variant}: ${uniqueCount} unique in 10 picks, IDs: [${selectedIds.join(',')}]`);
  }
}

console.log(`\n  Anti-repeat: ${antiRepeatPasses} passed, ${antiRepeatFails} failed`);

// ---------------------------------------------------------------------------
// 7. Summary report
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(80));
console.log('  QUALITY TEST SUMMARY');
console.log('='.repeat(80));

const tested = totalTests - nullTemplates;
console.log(`\n  Total combinations tested:  ${totalTests}`);
console.log(`  Templates found:           ${tested} (${((tested) / totalTests * 100).toFixed(1)}%)`);
console.log(`  Null templates:            ${nullTemplates}`);
console.log(`  Quality issues found:      ${totalIssues}`);
console.log(`  Contains numbers:          ${totalWithNumbers} (${(totalWithNumbers / tested * 100).toFixed(1)}%)`);
console.log(`  Uses first-person voice:   ${totalFirstPerson} (${(totalFirstPerson / tested * 100).toFixed(1)}%)`);

if (Object.keys(issuesByType).length > 0) {
  console.log('\n  Issues by type:');
  for (const [type, count] of Object.entries(issuesByType).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${type}: ${count}`);
  }
}

console.log('\n  Per-stakeholder breakdown:');
console.log('  ' + '-'.repeat(76));
console.log(`  ${'Stakeholder'.padEnd(24)} ${'Total'.padStart(6)} ${'Issues'.padStart(7)} ${'Numbers'.padStart(8)} ${'1st-Person'.padStart(11)}`);
console.log('  ' + '-'.repeat(76));
for (const [id, stats] of Object.entries(stakeholderStats)) {
  const pctNum = ((stats.numbers / stats.total) * 100).toFixed(0);
  const pctVoice = ((stats.firstPerson / stats.total) * 100).toFixed(0);
  console.log(`  ${id.padEnd(24)} ${String(stats.total).padStart(6)} ${String(stats.issues).padStart(7)} ${(stats.numbers + ' (' + pctNum + '%)').padStart(8+4)} ${(stats.firstPerson + ' (' + pctVoice + '%)').padStart(11+4)}`);
}

// Show first few issue details
if (issueDetails.length > 0) {
  console.log('\n  First 10 issues:');
  for (const d of issueDetails.slice(0, 10)) {
    console.log(`    [${d.issue}] ${d.stakeholder}/${d.variant} (${d.scenario})`);
    console.log(`      "${d.text}..."`);
  }
}

// Show sample outputs (one per stakeholder)
console.log('\n' + '='.repeat(80));
console.log('  SAMPLE OUTPUTS (one per stakeholder, "High RE – Ambitious" scenario)');
console.log('='.repeat(80));

resetShuffleBags();
const sampleScenario = SCENARIOS.find(s => s.name.includes('Ambitious')) || SCENARIOS[3];
for (const stakeholderId of STAKEHOLDERS) {
  for (const variant of ['pragmatic']) {
    const template = selectTemplate(stakeholderId, variant, sampleScenario.reShare);
    if (!template) {
      console.log(`\n  ${stakeholderId} (${variant}): [NO TEMPLATE]`);
      continue;
    }
    const totalCap = sampleScenario.capacity.renewables + sampleScenario.capacity.fossil + (sampleScenario.capacity.storage || 0);
    const totalGen = sampleScenario.generation.renewables + sampleScenario.generation.fossil;
    const totalAdds = sampleScenario.capacityAdditions
      ? sampleScenario.capacityAdditions.renewables + sampleScenario.capacityAdditions.fossil + (sampleScenario.capacityAdditions.storage || 0)
      : 0;
    const metrics = {
      reShare: '70',
      emissions: '9.2',
      investment: '22,500',
      capacity: totalCap.toLocaleString(),
      generation: totalGen.toLocaleString(),
      peakDemand: '13,800',
      capacityAdditions: totalAdds.toLocaleString(),
    };
    const result = interpolateTemplate(template, metrics, 'Strong renewable energy commitments', 'Grid integration challenges with high VRE penetration');
    console.log(`\n  ${stakeholderId} (${variant}):`);
    console.log(`    "${result}"`);
  }
}

// Exit code
const hasIssues = totalIssues > 0 || structureIssues.length > 0 || antiRepeatFails > 0;
if (totalIssues > 0) {
  console.log(`\n⚠️  ${totalIssues} quality issues detected. Review above.`);
}
if (structureIssues.length > 0) {
  console.log(`⚠️  ${structureIssues.length} structure issues detected.`);
}
if (antiRepeatFails > 0) {
  console.log(`⚠️  ${antiRepeatFails} anti-repeat failures.`);
}
if (nullTemplates > 0) {
  console.log(`⚠️  ${nullTemplates} combinations had no template (will use fallback).`);
}
if (!hasIssues && nullTemplates === 0) {
  console.log('\n✅ All checks passed!');
}

process.exit(hasIssues ? 1 : 0);
