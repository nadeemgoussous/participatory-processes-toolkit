/**
 * template-selector.ts — Hand-written module for template selection and interpolation.
 *
 * Features:
 *   - Gaussian weighted scoring (smooth proximity + recency decay)
 *   - Shuffle bags (Valve/Hades pattern) for anti-repetition
 *   - Conditional block interpolation {?key:text}
 *   - Inline variation expansion {~opt1|opt2|opt3}
 *   - Enhanced cleanup for grammar artifacts
 */

import type { ResponseTemplate } from './response-library';
import { getTemplates } from './response-library';

// ---------------------------------------------------------------------------
// Gaussian proximity scoring
// ---------------------------------------------------------------------------

/** Per-stakeholder sigma overrides for Gaussian proximity */
const SIGMA_OVERRIDES: Record<string, number> = {
  'finance': 10,
  'policy-makers': 10,
  'csos-ngos': 20,
  'public': 25,
  'scientific': 15,
};
const DEFAULT_SIGMA = 15;

/** Recency decay rate (higher = faster decay of penalty) */
const RECENCY_LAMBDA = 0.5;

/** Weight split: proximity vs recency */
const W_PROXIMITY = 0.6;
const W_RECENCY = 0.4;

function gaussianProximity(diff: number, sigma: number): number {
  return Math.exp(-(diff * diff) / (2 * sigma * sigma));
}

function recencyScore(templateId: number, sessionHistory: number[]): number {
  if (sessionHistory.length === 0) return 1;
  const lastIdx = sessionHistory.lastIndexOf(templateId);
  if (lastIdx === -1) return 1; // Never used — no penalty
  const stepsAgo = sessionHistory.length - lastIdx;
  return 1 - Math.exp(-RECENCY_LAMBDA * stepsAgo);
}

// ---------------------------------------------------------------------------
// Shuffle bags (Valve / Hades pattern)
// ---------------------------------------------------------------------------

/** Module-scoped shuffle bags keyed by "stakeholder::variant" */
const shuffleBags = new Map<string, number[]>();

/** Last picked template ID per bag (anti-repeat across refills) */
const lastPicked = new Map<string, number>();

/** Fisher-Yates shuffle (in-place) */
function fisherYatesShuffle(arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getBag(stakeholderId: string, variant: string, pool: ResponseTemplate[]): number[] {
  const key = `${stakeholderId}::${variant}`;
  let bag = shuffleBags.get(key);

  if (!bag || bag.length === 0) {
    // Refill: create shuffled array of template indices
    const indices = pool.map((_, i) => i);
    fisherYatesShuffle(indices);

    // Anti-repeat: if first item of new cycle === last item of previous cycle, swap
    const prev = lastPicked.get(key);
    if (prev !== undefined && indices.length > 1 && indices[0] === prev) {
      // Swap first with a random other position
      const swapIdx = 1 + Math.floor(Math.random() * (indices.length - 1));
      [indices[0], indices[swapIdx]] = [indices[swapIdx], indices[0]];
    }

    bag = indices;
    shuffleBags.set(key, bag);
  }

  return bag;
}

/** Reset all shuffle bags (call on session reset) */
export function resetShuffleBags(): void {
  shuffleBags.clear();
  lastPicked.clear();
}

// ---------------------------------------------------------------------------
// selectTemplate — Gaussian scoring + shuffle bags
// ---------------------------------------------------------------------------

/**
 * Select the best template for a stakeholder/variant/reShare combination.
 *
 * Algorithm:
 *   1. Get or create shuffle bag for stakeholder/variant
 *   2. Score remaining templates by Gaussian proximity + recency
 *   3. Pick highest-scoring template
 *   4. Remove from bag, record as last-picked
 *
 * @param sessionHistory - Array of previously selected template IDs (for recency)
 */
export function selectTemplate(
  stakeholderId: string,
  variant: string,
  reShare: number,
  sessionHistory?: number[]
): ResponseTemplate | null {
  const pool = getTemplates(stakeholderId, variant);
  if (pool.length === 0) return null;

  const sigma = SIGMA_OVERRIDES[stakeholderId] ?? DEFAULT_SIGMA;
  const history = sessionHistory ?? [];

  const bag = getBag(stakeholderId, variant, pool);

  // Score all remaining templates in bag
  let bestScore = -Infinity;
  let bestBagIdx = 0;

  for (let i = 0; i < bag.length; i++) {
    const poolIdx = bag[i];
    const t = pool[poolIdx];
    const diff = Math.abs(t.reShare - reShare);
    const proximity = gaussianProximity(diff, sigma);
    const recency = recencyScore(t.id, history);
    const score = W_PROXIMITY * proximity + W_RECENCY * recency;

    if (score > bestScore) {
      bestScore = score;
      bestBagIdx = i;
    }
  }

  // Pick and remove from bag
  const pickedPoolIdx = bag[bestBagIdx];
  bag.splice(bestBagIdx, 1);

  const key = `${stakeholderId}::${variant}`;
  lastPicked.set(key, pickedPoolIdx);

  return pool[pickedPoolIdx];
}

// ---------------------------------------------------------------------------
// interpolateTemplate — conditional blocks, inline variations, metrics
// ---------------------------------------------------------------------------

/**
 * Replace placeholders in a template's text with real values.
 *
 * Processing order:
 *   1. Conditional blocks:  {?positive:We appreciate {positive}, } → dropped if absent
 *   2. Inline variations:   {~opt1|opt2|opt3} → random pick
 *   3. Standard metric substitution
 *   4. Positive/concern substitution
 *   5. Cleanup unreplaced placeholders
 *   6. Enhanced grammar cleanup
 */
export function interpolateTemplate(
  template: ResponseTemplate,
  metrics: Record<string, string>,
  positive?: string,
  concern?: string
): string {
  let text = template.text;

  // --- 1. Conditional blocks -----------------------------------------------
  // {?positive:We appreciate {positive}, } → entire block dropped if positive absent
  // {?concern:yet {concern} needs attention} → entire block dropped if concern absent
  text = text.replace(
    /\{\?positive:([^}]*(?:\{positive\})[^}]*)\}/g,
    positive ? '$1' : ''
  );
  text = text.replace(
    /\{\?concern:([^}]*(?:\{concern\})[^}]*)\}/g,
    concern ? '$1' : ''
  );

  // --- 2. Inline variations ------------------------------------------------
  // {~opt1|opt2|opt3} → random pick
  text = text.replace(
    /\{~([^}]+)\}/g,
    (_match, options: string) => {
      const opts = options.split('|');
      return opts[Math.floor(Math.random() * opts.length)];
    }
  );

  // --- 3. Metric substitutions ---------------------------------------------
  const metricKeys = [
    'reShare',
    'emissions',
    'investment',
    'capacity',
    'capacityAdditions',
    'peakDemand',
    'generation',
  ];

  for (const key of metricKeys) {
    const value = metrics[key];
    if (value !== undefined && value !== null && value !== '') {
      // Template uses {key} or ${key} (investment uses $ prefix)
      text = text.replace(
        new RegExp(`\\$\\{${key}\\}|\\{${key}\\}`, 'g'),
        value
      );
    }
  }

  // --- 4. Positive / concern substitutions ---------------------------------
  if (positive) {
    text = text.replace(/\{positive\}/g, positive);
  }
  if (concern) {
    text = text.replace(/\{concern\}/g, concern);
  }

  // --- 5. Clean up unreplaced placeholders ---------------------------------
  // Remove any remaining {?key:...} blocks (in case of nested/missed)
  text = text.replace(/\{\?[a-zA-Z]+:[^}]*\}/g, '');
  // Remove bare {placeholder} and ${placeholder}
  text = text.replace(/\$?\{[a-zA-Z]+\}/g, '');

  // --- 6. Enhanced grammar cleanup -----------------------------------------
  // Collapse multiple spaces
  text = text.replace(/ {2,}/g, ' ');
  // Fix ', ,' and '. ,' artifacts
  text = text.replace(/,\s*,/g, ',');
  text = text.replace(/\.\s*,/g, '.');
  // Fix lone connectors at start: "but ...", "yet ...", ", but ..."
  text = text.replace(/^(?:,\s*)?(?:but|yet|however|though|while|and|or)\s+/i, '');
  // Fix mid-text dangling connector: "positive, but. We" or "positive, but . We"
  text = text.replace(/,\s*(?:but|yet|however|though|while)\s*\.\s*/gi, '. ');
  // Fix dangling connector at end: "... but" or "... , but"
  text = text.replace(/(?:,\s*)?(?:but|yet|however|though|while|and|or)\s*\.?\s*$/i, '.');
  // Fix sentence starting with lowercase after cleanup
  text = text.replace(/^\s*([a-z])/, (_m, c: string) => c.toUpperCase());
  // Fix double periods
  text = text.replace(/\.{2,}/g, '.');
  // Fix " ." (space before period)
  text = text.replace(/\s+\./g, '.');
  // Fix "., " at start
  text = text.replace(/^[,.\s]+/, '');
  // Trim
  text = text.trim();

  return text;
}
