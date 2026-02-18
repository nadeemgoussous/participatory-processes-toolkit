#!/usr/bin/env node
/**
 * build-response-library.cjs
 *
 * Reads stakeholder training data JSON and produces a TypeScript response
 * library file (src/data/response-library.ts) on stdout.
 *
 * Pipeline:
 *   1. Extract & templatize training data
 *   2. Deduplicate identical texts within same bucket
 *   3. Wrap {positive}/{concern} in grammar-safe conditional blocks
 *   4. Inject inline variation markers {~opt1|opt2|opt3}
 *   5. Emit data-only TypeScript (no selectTemplate/interpolateTemplate)
 *
 * Usage:
 *   node scripts/build-response-library.cjs > src/data/response-library.ts
 *
 * The script must be run from the project root directory so that the relative
 * path to the training data file resolves correctly.
 */

"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const TRAINING_DATA_PATH = path.join(
  __dirname,
  "..",
  "docs",
  "examples",
  "stakeholder_training_data.json"
);

/** Map from display name (as it appears in "You are X.") to canonical ID */
const NAME_TO_ID = {
  "Policy Makers & Regulators": "policy-makers",
  "Grid Operators": "grid-operators",
  "Industry & Business": "industry",
  "Public & Communities": "public",
  "CSOs & NGOs": "csos-ngos",
  "Scientific Institutions": "scientific",
  "Financial Institutions": "finance",
  "Regional Bodies": "regional-bodies",
  "Development Partners": "development-partners",
};

/** Map from Mode string (case-insensitive) to canonical variant */
const MODE_TO_VARIANT = {
  conservative: "conservative",
  progressive: "progressive",
  pragmatic: "pragmatic",
};

/**
 * RE share band boundaries (user spec):
 *   low       0-30
 *   medium   31-55
 *   high     56-80
 *   very-high 81-100
 */
function getReBand(reShare) {
  if (reShare <= 30) return "low";
  if (reShare <= 55) return "medium";
  if (reShare <= 80) return "high";
  return "very-high";
}

// ---------------------------------------------------------------------------
// Inline variation substitution table (~20 entries)
// Each entry: [original phrase at sentence start, [alternatives]]
// ---------------------------------------------------------------------------

const VARIATION_TABLE = [
  ["We note", ["We observe", "We recognize"]],
  ["We appreciate", ["We welcome", "We value"]],
  ["We support", ["We endorse", "We back"]],
  ["We see", ["We identify", "We recognize"]],
  ["We welcome", ["We appreciate", "We are encouraged by"]],
  ["We strongly support", ["We firmly endorse", "We wholeheartedly back"]],
  ["We're concerned", ["We are troubled", "We have reservations"]],
  ["We urge", ["We recommend", "We call for"]],
  ["We need", ["We require", "We must have"]],
  ["Our priority is", ["Our primary focus is", "Our main concern is"]],
  ["Our analysis", ["Our assessment", "Our review"]],
  ["The financing gap", ["The funding shortfall", "The capital deficit"]],
  ["This scenario", ["This pathway", "This plan"]],
  ["While we", ["Although we", "Though we"]],
  ["While we appreciate", ["Although we value", "Though we welcome"]],
  ["While we support", ["Although we back", "Though we endorse"]],
  ["While we note", ["Although we observe", "Though we recognize"]],
  ["Scientific rigor", ["Methodological rigor", "Analytical rigor"]],
  ["Evidence-based planning", ["Data-driven planning", "Rigorous planning"]],
  ["System security", ["Grid reliability", "System stability"]],
];

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

/**
 * Extract a named capture group value from a regex match applied to a string.
 * Returns null when the pattern doesn't match.
 */
function extract(text, pattern) {
  const m = text.match(pattern);
  return m ? m[1] : null;
}

/**
 * Parse the system message and return an object with all scalar fields.
 */
function parseSystemMessage(sys) {
  // Stakeholder name: "You are CSOs & NGOs.\n" – stop at the first period
  const stakeholderName = extract(sys, /^You are ([^\n.]+?)\.?\n/m);
  const modeName = extract(sys, /^Mode:\s*(.+)/m);
  const country = extract(sys, /scenario for (.+?):/);

  // Core indicators (numbers may include commas)
  const reShareStr = extract(sys, /RE Share:\s*(\d+)%/);
  const capacityStr = extract(sys, /Installed Capacity:\s*([\d,]+)\s*MW/);
  const generationStr = extract(sys, /Annual Generation:\s*([\d,]+)\s*GWh/);
  // Investment: "$65,000 million"
  const investmentStr = extract(sys, /Total Investment:\s*\$([\d,]+)\s*million/);
  const emissionsStr = extract(sys, /Emissions:\s*([\d.]+)\s*Mt/);
  const peakDemandStr = extract(sys, /Peak Demand:\s*([\d,]+)\s*MW/);
  const capacityAdditionsStr = extract(sys, /Capacity Additions:\s*([\d,]+)\s*MW/);

  return {
    stakeholderName: stakeholderName ? stakeholderName.trim() : null,
    modeName: modeName ? modeName.trim() : null,
    country: country ? country.trim() : null,
    reShareStr: reShareStr || null,
    capacityStr: capacityStr || null,
    generationStr: generationStr || null,
    investmentStr: investmentStr || null,
    emissionsStr: emissionsStr || null,
    peakDemandStr: peakDemandStr || null,
    capacityAdditionsStr: capacityAdditionsStr || null,
  };
}

/**
 * Parse the user message and return positive and concern strings.
 */
function parseUserMessage(user) {
  const positive = extract(user, /^Positive aspects:\s*(.+)/m) || "";
  const concern = extract(user, /^Their concerns:\s*(.+)/m) || "";
  return { positive: positive.trim(), concern: concern.trim() };
}

/**
 * Strip commas from a numeric string and convert to integer.
 * Returns 0 if null/undefined/unparseable.
 */
function toInt(str) {
  if (!str) return 0;
  return parseInt(str.replace(/,/g, ""), 10) || 0;
}

/**
 * Strip commas from a numeric string and convert to float.
 * Returns 0 if null/undefined/unparseable.
 */
function toFloat(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/,/g, "")) || 0;
}

// ---------------------------------------------------------------------------
// Templatization helpers
// ---------------------------------------------------------------------------

/**
 * Escape a string so it can be used safely inside a RegExp.
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build a regex that matches a numeric value with optional comma thousands
 * separators, e.g. "22,500" or "22500".
 *
 * @param {string} rawStr - the raw string from the system prompt (may contain commas)
 */
function buildNumberRegex(rawStr) {
  // Remove commas so we have the plain digits/dots
  const plain = rawStr.replace(/,/g, "");
  // Build a pattern that tolerates optional commas between digit groups
  // e.g. 22500 → 22,?500 or 22500
  // We rebuild with optional commas every 3 digits from the right
  let pattern = "";
  for (let i = 0; i < plain.length; i++) {
    if (i > 0 && (plain.length - i) % 3 === 0 && /\d/.test(plain[i - 1])) {
      pattern += ",?";
    }
    pattern += escapeRegExp(plain[i]);
  }
  return pattern;
}

/**
 * Replace all occurrences of a number (with or without commas) in a text
 * with a placeholder.  Returns the modified text.
 *
 * @param {string} text        - the text to modify
 * @param {string} rawStr      - the raw number string (may have commas)
 * @param {string} placeholder - replacement placeholder, e.g. "{reShare}"
 * @param {string} [suffix]    - optional suffix that must follow the number, e.g. "%"
 */
function replaceNumber(text, rawStr, placeholder, suffix) {
  if (!rawStr) return text;
  const numPattern = buildNumberRegex(rawStr);
  const sfx = suffix ? escapeRegExp(suffix) : "";
  const re = new RegExp(numPattern + sfx, "g");
  return text.replace(re, placeholder + (suffix || ""));
}

/**
 * Templatize a response by substituting known metric values with placeholders.
 *
 * Strategy:
 *  1. Replace metric numbers (RE%, emissions Mt, investment $, capacity MW,
 *     capacity-additions MW, peak-demand MW, generation GWh).
 *  2. Replace positive/concern phrases if they appear verbatim in the response.
 *
 * We perform replacements from most-specific to least-specific to avoid
 * partial overlaps (e.g. replace capacity-additions before capacity).
 */
function templatize(response, metrics, positive, concern) {
  let text = response;

  // --- Metric replacements ------------------------------------------------

  // RE Share  e.g. "98%" → "{reShare}%"
  if (metrics.reShareStr) {
    text = replaceNumber(text, metrics.reShareStr, "{reShare}", "%");
  }

  // Emissions  e.g. "0.3 Mt" → "{emissions} Mt"
  if (metrics.emissionsStr) {
    text = replaceNumber(text, metrics.emissionsStr, "{emissions}", " Mt");
    // Also handle "0.3Mt" (no space) - rare but possible
    text = replaceNumber(text, metrics.emissionsStr, "{emissions}", "Mt");
  }

  // Investment: may appear as "$65,000 million", "$65,000M", "$65,000m"
  // In the system prompt the raw value is e.g. "65,000" (before "million")
  if (metrics.investmentStr) {
    // "$65,000 million"
    text = replaceNumber(text, metrics.investmentStr, "${investment}", " million");
    // "$65,000M"
    text = replaceNumber(text, metrics.investmentStr, "${investment}", "M");
    // "$65,000m"
    text = replaceNumber(text, metrics.investmentStr, "${investment}", "m");
    // Just "$65,000" (with or without trailing space/unit)
    // Use a lookahead to avoid double-replacement
    const numPattern = buildNumberRegex(metrics.investmentStr);
    const plainRe = new RegExp("\\$" + numPattern + "(?!\\s*million|M|m)", "g");
    text = text.replace(plainRe, "${investment}");
  }

  // Capacity Additions must be replaced BEFORE Installed Capacity to avoid
  // partial matches (capacity additions value is usually smaller than total).
  if (metrics.capacityAdditionsStr) {
    text = replaceNumber(text, metrics.capacityAdditionsStr, "{capacityAdditions}", " MW");
    text = replaceNumber(text, metrics.capacityAdditionsStr, "{capacityAdditions}", "MW");
  }

  // Installed Capacity
  if (metrics.capacityStr) {
    text = replaceNumber(text, metrics.capacityStr, "{capacity}", " MW");
    text = replaceNumber(text, metrics.capacityStr, "{capacity}", "MW");
  }

  // Peak Demand
  if (metrics.peakDemandStr) {
    text = replaceNumber(text, metrics.peakDemandStr, "{peakDemand}", " MW");
    text = replaceNumber(text, metrics.peakDemandStr, "{peakDemand}", "MW");
  }

  // Annual Generation
  if (metrics.generationStr) {
    text = replaceNumber(text, metrics.generationStr, "{generation}", " GWh");
    text = replaceNumber(text, metrics.generationStr, "{generation}", "GWh");
  }

  // --- Positive/concern phrase replacements --------------------------------

  // Only replace when the phrase appears substantially (at least 4 consecutive
  // words from the phrase appear in order in the response, case-insensitive).
  if (positive && positive.length > 3) {
    const posRe = new RegExp(escapeRegExp(positive), "gi");
    if (posRe.test(text)) {
      text = text.replace(posRe, "{positive}");
    }
  }

  if (concern && concern.length > 3) {
    const conRe = new RegExp(escapeRegExp(concern), "gi");
    if (conRe.test(text)) {
      text = text.replace(conRe, "{concern}");
    }
  }

  return text;
}

// ---------------------------------------------------------------------------
// Post-processing passes
// ---------------------------------------------------------------------------

/**
 * Pass A: Deduplicate templates with identical text within the same bucket.
 * Keeps the one closest to the bucket's centroid reShare.
 * Returns { templates, dedupCount }.
 */
function deduplicateTemplates(templates) {
  // Group by stakeholder+variant
  const buckets = {};
  for (const t of templates) {
    const key = `${t.stakeholderId}::${t.variant}`;
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(t);
  }

  const result = [];
  let dedupCount = 0;

  for (const [key, bucket] of Object.entries(buckets)) {
    // Compute centroid reShare for the bucket
    const centroid = bucket.reduce((sum, t) => sum + t.reShare, 0) / bucket.length;

    // Group by normalized text
    const textGroups = {};
    for (const t of bucket) {
      const norm = t.text.trim().toLowerCase();
      if (!textGroups[norm]) textGroups[norm] = [];
      textGroups[norm].push(t);
    }

    for (const [, group] of Object.entries(textGroups)) {
      if (group.length === 1) {
        result.push(group[0]);
      } else {
        // Keep the one closest to centroid
        group.sort((a, b) => Math.abs(a.reShare - centroid) - Math.abs(b.reShare - centroid));
        result.push(group[0]);
        dedupCount += group.length - 1;
      }
    }
  }

  return { templates: result, dedupCount };
}

/**
 * Pass B: Wrap {positive} and {concern} placeholders in grammar-safe
 * conditional blocks.
 *
 * Patterns handled:
 *   "We appreciate {positive}, but..."   → "{?positive:We appreciate {positive}, }but..."
 *   "yet {concern} needs..."             → "{?concern:yet {concern} needs...}"
 *   "{positive} is positive"             → "{?positive:{positive} is positive}"
 *   ", but {concern} must..."            → "{?concern:, but {concern} must...}"
 *
 * The conditional block {?key:...} is dropped entirely when the key is absent,
 * preventing dangling grammar like "We appreciate , but...".
 */
function wrapConditionalBlocks(text) {
  // Handle {positive} in context
  text = wrapPlaceholderContext(text, 'positive');
  // Handle {concern} in context
  text = wrapPlaceholderContext(text, 'concern');
  return text;
}

function wrapPlaceholderContext(text, placeholder) {
  const ph = `{${placeholder}}`;
  if (!text.includes(ph)) return text;

  // Split into sentences at period+space boundaries (preserve the period)
  // We'll work clause-by-clause using comma/semicolon splits
  // Strategy: find the clause containing {placeholder} and wrap it

  // Pattern 1: placeholder at start of a clause
  // e.g. "{positive} is positive, but..."
  // Wrap from start to the next comma/period/end
  // Pattern 2: connector + placeholder in middle
  // e.g. "We appreciate {positive}, but..."
  // Wrap the connector phrase + placeholder + trailing connector

  // Use regex to find the clause containing the placeholder
  // Match: optional leading connector + text up to and including {placeholder} + text up to next sentence boundary
  const escapedPh = escapeRegExp(ph);

  // Try to match a clause containing the placeholder
  // Look for: [start-of-text or , or ;] ... {placeholder} ... [, or ; or . or end]
  const clauseRe = new RegExp(
    // Leading part: from start of string or after a comma/semicolon + space
    '(?:^|(?<=(?:,|;)\\s*))' +
    // The clause text containing the placeholder
    '([^,;.]*?' + escapedPh + '[^,;.]*?)' +
    // Trailing: comma+space, semicolon+space, period, or end
    '(?=(?:,\\s|;\\s|\\.|$))',
    'g'
  );

  // Simpler approach: wrap the placeholder and its immediate grammatical context
  // Find patterns like "We appreciate {positive}" or "{positive} is" or "but {concern} needs"
  // and wrap the whole sub-clause

  // Pattern: words before placeholder (up to sentence/clause boundary) + placeholder + words after (up to boundary)
  const simpleRe = new RegExp(
    // Capture leading connector words (up to 6 words before placeholder)
    '((?:(?:,\\s*|;\\s*)?(?:\\w+\\s+){0,6})?)' +
    // The placeholder itself
    escapedPh +
    // Capture trailing words (up to next clause boundary)
    '((?:\\s+\\w+){0,4}(?:,\\s*)?)',
    'g'
  );

  // Simplified: just wrap the immediate phrase around the placeholder
  // Find: [optional leading words]{placeholder}[optional trailing words before comma/period]
  return text.replace(
    new RegExp(
      // Look for the phrase containing placeholder:
      // - Optional leading text from clause start (after comma/start)
      '(' +
        // From clause start or comma
        '(?:(?<=^)|(?<=\\.\\s)|(?<=,\\s)|(?<=;\\s))' +
        // Up to 8 words before placeholder
        '(?:[A-Za-z\'"]+\\s+){0,8}' +
      ')?' +
      // The placeholder
      escapedPh +
      // Optional trailing text to clause end
      '(' +
        '(?:\\s+[A-Za-z\'"]+){0,6}' +
        // Optional trailing comma
        '(?:,\\s*)?' +
      ')?',
      'g'
    ),
    (match, before, after) => {
      // If the match is essentially the whole text, don't wrap
      if (match.trim() === text.trim()) return text;
      const content = (before || '') + ph + (after || '');
      return `{?${placeholder}:${content}}`;
    }
  );
}

/**
 * Simpler conditional wrapping: identify common patterns around {positive}/{concern}
 * and wrap them in conditional blocks.
 */
function applyConditionalWrapping(text) {
  // Pattern 1: "We appreciate {positive}, but..." / "We acknowledge {positive}, yet..."
  // → "{?positive:We appreciate {positive}, }but..."
  text = text.replace(
    /(\b(?:We appreciate|We acknowledge|We note|We welcome|We value|We see|We recognize)\s+)\{positive\}(,?\s*)/g,
    '{?positive:$1{positive}$2}'
  );

  // Pattern 2: "yet {concern} undermines..." / "but {concern} needs..." / ", but {concern}"
  // → "{?concern:yet {concern} undermines...}"  — wrap connector + concern to end of clause
  text = text.replace(
    /(,?\s*(?:yet|but|though|however|while)\s+)\{concern\}(\s+[^.]*)/g,
    '{?concern:$1{concern}$2}'
  );

  // Pattern 2b: standalone "but" or "yet" before a {?concern:...} block
  // Fix cases where connector words are outside the conditional
  text = text.replace(
    /(,?\s*)(but|yet|however|though|while)\s+(\{\?concern:)/g,
    '$3$1$2 '
  );

  // Pattern 2c: {?concern:, }but {?concern:...{concern}...} — merge into single block
  // This handles cases where comma and connector got split across blocks
  // Note: inner content may contain {concern} which has }, so we match more broadly
  text = text.replace(
    /\{\?concern:\s*,\s*\}\s*(but|yet|however|though|while)\s+\{\?concern:([\s\S]*?)\}/g,
    '{?concern:, $1 $2}'
  );

  // Pattern 3: "{positive} is positive" / "{positive} positions us" / "{positive} demonstrate..."
  // → "{?positive:{positive} is positive}"
  text = text.replace(
    /\{positive\}(\s+(?:is|are|was|were|has|have|had|demonstrate|position|signal|show|create|support|enable|provide)[^,;.]*(?:,\s*)?)/g,
    '{?positive:{positive}$1}'
  );

  // Pattern 4: "{concern} creates..." / "{concern} must be..."
  text = text.replace(
    /\{concern\}(\s+(?:is|are|was|were|has|have|had|creates?|must|needs?|affects?|limits?|remains?|could|threatens?|undermines?|poses?)[^,;.]*(?:,\s*)?)/g,
    '{?concern:{concern}$1}'
  );

  // Pattern 5: "about {concern}" / "addressing {concern}" / "that {concern}"
  text = text.replace(
    /((?:about|addressing|that|regarding|despite|through|for)\s+)\{concern\}([^{]*?)(?=\.|,\s*(?:we|but|yet|the|and|however)|$)/gi,
    '{?concern:$1{concern}$2}'
  );

  // Pattern 6: "about {positive}" (less common)
  text = text.replace(
    /((?:about|regarding|that|despite)\s+)\{positive\}([^{]*?)(?=\.|,\s*(?:we|but|yet|the|and|however)|$)/gi,
    '{?positive:$1{positive}$2}'
  );

  // Pattern 7: "despite {concern}"
  text = text.replace(
    /(despite\s+)\{concern\}/gi,
    '{?concern:$1{concern}}'
  );

  // Pattern 8: trailing ", and {concern}" or ", and {positive}"
  text = text.replace(
    /(,?\s*and\s+)\{concern\}([^{]*?)(?=\.|$)/gi,
    '{?concern:$1{concern}$2}'
  );

  // Clean up: avoid double-wrapping (nested {? blocks)
  // If we see {?key:...{?key:...}...}, flatten to single wrap
  text = text.replace(/\{\?positive:[^}]*\{\?positive:([^}]*)\}[^}]*\}/g, '{?positive:$1}');
  text = text.replace(/\{\?concern:[^}]*\{\?concern:([^}]*)\}[^}]*\}/g, '{?concern:$1}');

  return text;
}

/**
 * Pass C: Inject inline variation markers at safe sentence-start positions.
 * Max 1 injection per template.
 * Returns { text, injected: boolean }.
 */
function injectVariations(text) {
  // Only inject one variation per template
  for (const [original, alternatives] of VARIATION_TABLE) {
    // Only match at sentence start (beginning of text or after ". ")
    const escaped = escapeRegExp(original);
    const re = new RegExp(`(^|(?<=\\.\\s))${escaped}\\b`, '');
    const match = text.match(re);

    if (match) {
      const allOptions = [original, ...alternatives];
      const marker = `{~${allOptions.join('|')}}`;
      // Replace only first occurrence
      text = text.replace(
        new RegExp(`(^|(?<=\\.\\s))${escaped}\\b`),
        marker
      );
      return { text, injected: true };
    }
  }

  return { text, injected: false };
}

// ---------------------------------------------------------------------------
// Main extraction logic
// ---------------------------------------------------------------------------

function extractTemplates(data) {
  const templates = [];
  let id = 1;

  for (const entry of data) {
    const messages = entry.messages;
    if (!messages || messages.length < 3) continue;

    const sysMsg = messages.find((m) => m.role === "system");
    const userMsg = messages.find((m) => m.role === "user");
    const assistantMsg = messages.find((m) => m.role === "assistant");

    if (!sysMsg || !userMsg || !assistantMsg) continue;

    const sys = sysMsg.content;
    const user = userMsg.content;
    const response = assistantMsg.content;

    if (!sys || !user || !response) continue;

    // Parse fields
    const parsed = parseSystemMessage(sys);
    const { positive, concern } = parseUserMessage(user);

    // Validate required fields
    if (!parsed.stakeholderName || !parsed.modeName || !parsed.reShareStr) {
      process.stderr.write(
        `[WARN] Skipping entry ${id}: missing required fields ` +
          `(stakeholder=${parsed.stakeholderName}, mode=${parsed.modeName}, re=${parsed.reShareStr})\n`
      );
      continue;
    }

    const stakeholderId = NAME_TO_ID[parsed.stakeholderName];
    if (!stakeholderId) {
      process.stderr.write(
        `[WARN] Unknown stakeholder name: "${parsed.stakeholderName}" – skipping\n`
      );
      continue;
    }

    const variant = MODE_TO_VARIANT[parsed.modeName.toLowerCase()];
    if (!variant) {
      process.stderr.write(
        `[WARN] Unknown mode: "${parsed.modeName}" – skipping\n`
      );
      continue;
    }

    const reShare = parseInt(parsed.reShareStr, 10);
    const reBand = getReBand(reShare);

    // Numeric metrics (for templatization comparisons)
    const metrics = {
      reShareStr: parsed.reShareStr,
      emissionsStr: parsed.emissionsStr,
      investmentStr: parsed.investmentStr,
      capacityStr: parsed.capacityStr,
      capacityAdditionsStr: parsed.capacityAdditionsStr,
      peakDemandStr: parsed.peakDemandStr,
      generationStr: parsed.generationStr,
    };

    // Templatize the response
    const templateText = templatize(response, metrics, positive, concern);

    // Determine whether the template actually contains placeholders
    const hasPositive = templateText.includes("{positive}");
    const hasConcern = templateText.includes("{concern}");

    templates.push({
      id: id++,
      stakeholderId,
      variant,
      reShare,
      reBand,
      text: templateText,
      hasPositive,
      hasConcern,
      // Raw metric numbers stored for selectTemplate distance calculation
      _reShare: reShare,
    });
  }

  return templates;
}

// ---------------------------------------------------------------------------
// Group templates into the nested structure for the TS export
// ---------------------------------------------------------------------------

function groupTemplates(templates) {
  /** @type {Record<string, Record<string, object[]>>} */
  const library = {};

  for (const t of templates) {
    const { stakeholderId, variant } = t;
    if (!library[stakeholderId]) library[stakeholderId] = {};
    if (!library[stakeholderId][variant]) library[stakeholderId][variant] = [];
    library[stakeholderId][variant].push({
      id: t.id,
      text: t.text,
      reBand: t.reBand,
      reShare: t.reShare,
      hasPositive: t.hasPositive,
      hasConcern: t.hasConcern,
    });
  }

  return library;
}

// ---------------------------------------------------------------------------
// TypeScript code generation (DATA ONLY — no functions)
// ---------------------------------------------------------------------------

/**
 * Escape a string for use as a TypeScript string literal value.
 * We use backtick strings to avoid issues with quotes inside response text.
 */
function escapeForTS(str) {
  // Escape backticks and template literal ${ sequences that are NOT our own
  // placeholders.  Our placeholders look like {word} or ${word}; the latter
  // collides with TS template literal interpolation so we must escape the $.
  return str
    .replace(/\\/g, "\\\\")           // escape existing backslashes first
    .replace(/`/g, "\\`")             // escape backticks
    .replace(/\$\{/g, "\\${");        // escape template literal starts
}

/**
 * Serialize the library object to TypeScript source (data only).
 */
function generateTypeScript(library) {
  const lines = [];

  // ---- File header --------------------------------------------------------
  lines.push("// AUTO-GENERATED by scripts/build-response-library.cjs");
  lines.push("// Do not edit manually – regenerate with:");
  lines.push("//   node scripts/build-response-library.cjs > src/data/response-library.ts");
  lines.push("//");
  lines.push("// For selectTemplate / interpolateTemplate, see template-selector.ts");
  lines.push("");

  // ---- Interfaces ---------------------------------------------------------
  lines.push("export interface ResponseTemplate {");
  lines.push("  /** Unique numeric identifier within the library */");
  lines.push("  id: number;");
  lines.push("  /** Templatized response text with {placeholder} markers */");
  lines.push("  text: string;");
  lines.push("  /** RE share band this template was derived from */");
  lines.push("  reBand: 'low' | 'medium' | 'high' | 'very-high';");
  lines.push("  /** Exact RE share percentage from training data */");
  lines.push("  reShare: number;");
  lines.push("  /** True when the template contains a {positive} placeholder */");
  lines.push("  hasPositive: boolean;");
  lines.push("  /** True when the template contains a {concern} placeholder */");
  lines.push("  hasConcern: boolean;");
  lines.push("}");
  lines.push("");
  lines.push("/**");
  lines.push(" * Nested map: stakeholderId → variant → ResponseTemplate[]");
  lines.push(" * Keys: stakeholderId is one of the nine canonical IDs;");
  lines.push(" *        variant is 'conservative' | 'pragmatic' | 'progressive'");
  lines.push(" */");
  lines.push("export type TemplateLibrary = Record<string, Record<string, ResponseTemplate[]>>;");
  lines.push("");

  // ---- Data constant -------------------------------------------------------
  lines.push("export const RESPONSE_TEMPLATES: TemplateLibrary = {");

  const stakeholderKeys = Object.keys(library).sort();
  for (let si = 0; si < stakeholderKeys.length; si++) {
    const sKey = stakeholderKeys[si];
    const variantMap = library[sKey];
    const isLastStakeholder = si === stakeholderKeys.length - 1;

    lines.push(`  '${sKey}': {`);

    const variantKeys = Object.keys(variantMap).sort();
    for (let vi = 0; vi < variantKeys.length; vi++) {
      const vKey = variantKeys[vi];
      const templates = variantMap[vKey];
      const isLastVariant = vi === variantKeys.length - 1;

      lines.push(`    '${vKey}': [`);

      for (let ti = 0; ti < templates.length; ti++) {
        const t = templates[ti];
        const isLast = ti === templates.length - 1;
        const escaped = escapeForTS(t.text);
        lines.push("      {");
        lines.push(`        id: ${t.id},`);
        lines.push(`        text: \`${escaped}\`,`);
        lines.push(`        reBand: '${t.reBand}',`);
        lines.push(`        reShare: ${t.reShare},`);
        lines.push(`        hasPositive: ${t.hasPositive},`);
        lines.push(`        hasConcern: ${t.hasConcern},`);
        lines.push("      }" + (isLast ? "" : ","));
      }

      lines.push("    ]" + (isLastVariant ? "" : ","));
    }

    lines.push("  }" + (isLastStakeholder ? "" : ","));
  }

  lines.push("};");
  lines.push("");

  // ---- Helper: getTemplates (data accessor, stays in data file) -----------
  lines.push("// ---------------------------------------------------------------------------");
  lines.push("// Data accessor");
  lines.push("// ---------------------------------------------------------------------------");
  lines.push("");
  lines.push("/**");
  lines.push(" * Return all templates for a given stakeholder / variant combination.");
  lines.push(" * Returns an empty array when the combination doesn't exist.");
  lines.push(" */");
  lines.push("export function getTemplates(");
  lines.push("  stakeholderId: string,");
  lines.push("  variant: string");
  lines.push("): ResponseTemplate[] {");
  lines.push("  return RESPONSE_TEMPLATES[stakeholderId]?.[variant] ?? [];");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main() {
  // Read training data
  if (!fs.existsSync(TRAINING_DATA_PATH)) {
    process.stderr.write(
      `[ERROR] Training data not found at: ${TRAINING_DATA_PATH}\n`
    );
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(TRAINING_DATA_PATH, "utf8"));
  } catch (err) {
    process.stderr.write(`[ERROR] Failed to parse training data JSON: ${err.message}\n`);
    process.exit(1);
  }

  if (!Array.isArray(data)) {
    process.stderr.write("[ERROR] Training data root must be a JSON array\n");
    process.exit(1);
  }

  process.stderr.write(`[INFO] Read ${data.length} training examples\n`);

  // Extract and templatize
  let templates = extractTemplates(data);
  process.stderr.write(`[INFO] Extracted ${templates.length} valid templates\n`);

  // Pass A: Deduplication
  const { templates: dedupedTemplates, dedupCount } = deduplicateTemplates(templates);
  templates = dedupedTemplates;
  process.stderr.write(`[INFO] Deduplicated: removed ${dedupCount} duplicates, ${templates.length} remaining\n`);

  // Pass B: Grammar-safe conditional wrapping
  let wrappedCount = 0;
  for (const t of templates) {
    const before = t.text;
    t.text = applyConditionalWrapping(t.text);
    if (t.text !== before) wrappedCount++;
  }
  process.stderr.write(`[INFO] Conditional wrapping: ${wrappedCount} templates modified\n`);

  // Pass C: Inline variation injection
  let injectedCount = 0;
  for (const t of templates) {
    const { text, injected } = injectVariations(t.text);
    t.text = text;
    if (injected) injectedCount++;
  }
  process.stderr.write(`[INFO] Variation injection: ${injectedCount} templates enhanced\n`);

  // Reassign IDs after dedup (contiguous)
  templates.sort((a, b) => {
    if (a.stakeholderId < b.stakeholderId) return -1;
    if (a.stakeholderId > b.stakeholderId) return 1;
    if (a.variant < b.variant) return -1;
    if (a.variant > b.variant) return 1;
    return a.reShare - b.reShare;
  });
  for (let i = 0; i < templates.length; i++) {
    templates[i].id = i + 1;
  }

  // Update hasPositive/hasConcern after wrapping (conditional blocks still contain placeholders)
  for (const t of templates) {
    t.hasPositive = t.text.includes('{positive}');
    t.hasConcern = t.text.includes('{concern}');
  }

  // Print coverage summary to stderr
  const coverageMap = {};
  for (const t of templates) {
    const key = `${t.stakeholderId}|${t.variant}|${t.reBand}`;
    coverageMap[key] = (coverageMap[key] || 0) + 1;
  }
  process.stderr.write("\n[INFO] Coverage summary (stakeholder | variant | band = count):\n");
  for (const [key, count] of Object.entries(coverageMap).sort()) {
    process.stderr.write(`       ${key} = ${count}\n`);
  }

  // Count templatization success
  const withPlaceholder = templates.filter(
    (t) => t.text.includes("{") || t.text.includes("${")
  ).length;
  process.stderr.write(
    `\n[INFO] Templates containing at least one placeholder: ${withPlaceholder}/${templates.length}\n`
  );

  // Group into library structure
  const library = groupTemplates(templates);

  // Generate TypeScript
  const tsContent = generateTypeScript(library);

  // Write to stdout
  process.stdout.write(tsContent);

  process.stderr.write("\n[INFO] Done. Pipe stdout to src/data/response-library.ts\n");
}

main();
