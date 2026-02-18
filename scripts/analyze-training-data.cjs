const fs = require("fs");
const data = JSON.parse(fs.readFileSync("docs/examples/stakeholder_training_data.json", "utf8"));

const grouped = {};
for (const ex of data) {
  const sys = ex.messages[0].content;
  const sm = sys.match(/You are (.+?)\./);
  const vm = sys.match(/Mode: (.+)/);
  const cm = sys.match(/scenario for (.+?):/);
  const response = ex.messages[2].content;
  const user = ex.messages[1].content;
  const re = sys.match(/RE Share: (\d+)%/);
  const cap = sys.match(/Installed Capacity: ([\d,]+) MW/);
  const inv = sys.match(/Total Investment: \$([\d,]+) million/);
  const em = sys.match(/Emissions: ([\d.]+) Mt/);
  const context = sys.match(/Context: (.+)/);
  const concerns = sys.match(/Key concerns: (.+)/);
  const posAspects = user.match(/Positive aspects: (.+)/);
  const theirConcerns = user.match(/Their concerns: (.+)/);

  const key = sm[1] + " | " + vm[1].trim();
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push({
    country: cm ? cm[1] : "?",
    re: re ? re[1] + "%" : "?",
    capacity: cap ? cap[1] : "?",
    investment: inv ? inv[1] : "?",
    emissions: em ? em[1] : "?",
    context: context ? context[1] : "?",
    keyConcerns: concerns ? concerns[1] : "?",
    positives: posAspects ? posAspects[1] : "",
    theirConcerns: theirConcerns ? theirConcerns[1] : "",
    response: response,
  });
}

// Show 3 examples per group
for (const [key, examples] of Object.entries(grouped).sort()) {
  console.log("\n=== " + key + " (" + examples.length + " examples) ===");
  for (const ex of examples.slice(0, 3)) {
    console.log(`  [${ex.country}, RE:${ex.re}, ctx:${ex.context}]`);
    console.log(`    Positives: ${ex.positives}`);
    console.log(`    Concerns: ${ex.theirConcerns}`);
    console.log(`    Response: "${ex.response}"`);
    console.log();
  }
}

// Analyze response patterns
console.log("\n\n========== RESPONSE PATTERN ANALYSIS ==========\n");

// Average response length
let totalLen = 0;
let totalWords = 0;
for (const ex of data) {
  const r = ex.messages[2].content;
  totalLen += r.length;
  totalWords += r.split(/\s+/).length;
}
console.log(`Avg response length: ${Math.round(totalLen / data.length)} chars, ${Math.round(totalWords / data.length)} words`);

// Check how many responses reference specific numbers from scenario
let refsNumbers = 0;
for (const ex of data) {
  const r = ex.messages[2].content;
  if (r.match(/\d+%/) || r.match(/\$[\d,]+/) || r.match(/[\d,]+ MW/)) {
    refsNumbers++;
  }
}
console.log(`Responses referencing scenario numbers: ${refsNumbers}/${data.length} (${Math.round(refsNumbers/data.length*100)}%)`);

// Check how many reference the positive aspects from user prompt
let refsPos = 0;
for (const ex of data) {
  const user = ex.messages[1].content;
  const posMatch = user.match(/Positive aspects: (.+)/);
  if (posMatch) {
    const pos = posMatch[1].toLowerCase();
    const r = ex.messages[2].content.toLowerCase();
    // Check if any significant words from positive aspects appear in response
    const words = pos.split(/\s+/).filter(w => w.length > 4);
    if (words.some(w => r.includes(w))) {
      refsPos++;
    }
  }
}
console.log(`Responses echoing positive aspects: ${refsPos}/${data.length} (${Math.round(refsPos/data.length*100)}%)`);

// Check first-person usage
let firstPerson = 0;
for (const ex of data) {
  const r = ex.messages[2].content;
  if (r.match(/\b(we |our |we're|we've)\b/i)) {
    firstPerson++;
  }
}
console.log(`Uses first-person (we/our): ${firstPerson}/${data.length} (${Math.round(firstPerson/data.length*100)}%)`);

// Extract unique response openings (first 5 words)
const openings = {};
for (const ex of data) {
  const r = ex.messages[2].content;
  const opening = r.split(/\s+/).slice(0, 4).join(" ");
  openings[opening] = (openings[opening] || 0) + 1;
}
console.log("\nMost common openings:");
const sorted = Object.entries(openings).sort((a, b) => b[1] - a[1]).slice(0, 15);
for (const [opening, count] of sorted) {
  console.log(`  ${count}x "${opening}..."`);
}
