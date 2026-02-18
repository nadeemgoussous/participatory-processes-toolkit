const fs = require("fs");
const data = JSON.parse(fs.readFileSync("docs/examples/stakeholder_training_data.json", "utf8"));

// Map stakeholder names to IDs
const nameToId = {
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

// Extract structured data from each example
const templates = [];
for (const ex of data) {
  const sys = ex.messages[0].content;
  const user = ex.messages[1].content;
  const response = ex.messages[2].content;

  const sm = sys.match(/You are (.+?)\.\n/);
  const vm = sys.match(/Mode: (.+)/);
  const cm = sys.match(/scenario for (.+?):/);
  const re = sys.match(/RE Share: (\d+)%/);
  const cap = sys.match(/Installed Capacity: ([\d,]+) MW/);
  const gen = sys.match(/Annual Generation: ([\d,]+) GWh/);
  const inv = sys.match(/Total Investment: \$([\d,]+) million/);
  const em = sys.match(/Emissions: ([\d.]+) Mt/);
  const peak = sys.match(/Peak Demand: ([\d,]+) MW/);
  const adds = sys.match(/Capacity Additions: ([\d,]+) MW/);
  const ctx = sys.match(/Context: (.+)/);
  const keyConcerns = sys.match(/Key concerns: (.+)/);

  const posMatch = user.match(/Positive aspects: (.+)/);
  const conMatch = user.match(/Their concerns: (.+)/);

  if (!sm || !vm || !re) continue;

  const stakeholderId = nameToId[sm[1]];
  const variant = vm[1].trim().toLowerCase();
  const reShare = parseInt(re[1]);
  const investment = inv ? parseInt(inv[1].replace(/,/g, "")) : 0;
  const emissions = em ? parseFloat(em[1]) : 0;
  const capacity = cap ? parseInt(cap[1].replace(/,/g, "")) : 0;
  const generation = gen ? parseInt(gen[1].replace(/,/g, "")) : 0;
  const peakDemand = peak ? parseInt(peak[1].replace(/,/g, "")) : 0;
  const capacityAdds = adds ? parseInt(adds[1].replace(/,/g, "")) : 0;

  const positive = posMatch ? posMatch[1] : "";
  const concern = conMatch ? conMatch[1] : "";

  // Create templatized version - replace specific numbers with placeholders
  let templatized = response;
  if (reShare && response.includes(reShare + "%")) {
    templatized = templatized.replace(new RegExp(reShare + "%", "g"), "{reShare}%");
  }
  if (emissions && response.includes(emissions + " Mt")) {
    templatized = templatized.replace(new RegExp(emissions.toString().replace(".", "\\.") + " Mt", "g"), "{emissions} Mt");
  }
  if (investment && response.includes("$" + investment.toLocaleString())) {
    templatized = templatized.replace(new RegExp("\\$" + investment.toLocaleString().replace(/,/g, ",?"), "g"), "${investment}");
  }
  // Also try formatted numbers
  const invFormatted = investment.toLocaleString();
  if (response.includes(invFormatted + "M")) {
    templatized = templatized.replace(invFormatted + "M", "{investment}M");
  }
  if (response.includes("$" + invFormatted + "M")) {
    templatized = templatized.replace("$" + invFormatted + "M", "${investment}M");
  }
  if (capacityAdds && response.includes(capacityAdds.toLocaleString() + " MW")) {
    templatized = templatized.replace(new RegExp(capacityAdds.toLocaleString() + " MW", "g"), "{capacityAdditions} MW");
  }
  if (capacity && response.includes(capacity.toLocaleString() + " MW")) {
    templatized = templatized.replace(new RegExp(capacity.toLocaleString() + " MW", "g"), "{capacity} MW");
  }
  if (peakDemand && response.includes(peakDemand.toLocaleString() + " MW")) {
    templatized = templatized.replace(new RegExp(peakDemand.toLocaleString() + " MW", "g"), "{peakDemand} MW");
  }
  if (generation && response.includes(generation.toLocaleString() + " GWh")) {
    templatized = templatized.replace(new RegExp(generation.toLocaleString() + " GWh", "g"), "{generation} GWh");
  }

  // Check if positive/concern text is echoed in response
  const posWords = positive.toLowerCase().split(/\s+/).filter(w => w.length > 5);
  const conWords = concern.toLowerCase().split(/\s+/).filter(w => w.length > 5);
  const rLower = response.toLowerCase();
  const echosPositive = posWords.length > 0 && posWords.filter(w => rLower.includes(w)).length >= 2;
  const echosConcern = conWords.length > 0 && conWords.filter(w => rLower.includes(w)).length >= 2;

  // Classify RE share band
  let reBand;
  if (reShare <= 45) reBand = "low";
  else if (reShare <= 65) reBand = "medium";
  else if (reShare <= 85) reBand = "high";
  else reBand = "very-high";

  templates.push({
    stakeholderId,
    variant,
    reShare,
    reBand,
    investment,
    emissions,
    capacity,
    capacityAdds,
    peakDemand,
    generation,
    context: ctx ? ctx[1] : "",
    positive,
    concern,
    response,
    templatized,
    hasPlaceholders: templatized !== response,
    echosPositive,
    echosConcern,
  });
}

console.log("Total templates extracted:", templates.length);
console.log("\n=== TEMPLATE COVERAGE ===\n");

// Count by stakeholder × variant × reBand
const coverage = {};
for (const t of templates) {
  const key = `${t.stakeholderId}|${t.variant}|${t.reBand}`;
  if (!coverage[key]) coverage[key] = 0;
  coverage[key]++;
}

// Print coverage matrix
const stakeholders = [...new Set(templates.map(t => t.stakeholderId))].sort();
const variants = ["conservative", "pragmatic", "progressive"];
const bands = ["low", "medium", "high", "very-high"];

for (const s of stakeholders) {
  console.log(`\n${s}:`);
  for (const v of variants) {
    const counts = bands.map(b => coverage[`${s}|${v}|${b}`] || 0);
    console.log(`  ${v}: low=${counts[0]} med=${counts[1]} high=${counts[2]} vhigh=${counts[3]}`);
  }
}

console.log("\n=== TEMPLATIZATION SUCCESS ===\n");
const withPlaceholders = templates.filter(t => t.hasPlaceholders).length;
console.log(`Templates with number placeholders: ${withPlaceholders}/${templates.length} (${Math.round(withPlaceholders/templates.length*100)}%)`);

const withPosEcho = templates.filter(t => t.echosPositive).length;
const withConEcho = templates.filter(t => t.echosConcern).length;
console.log(`Templates echoing positive aspects: ${withPosEcho}/${templates.length} (${Math.round(withPosEcho/templates.length*100)}%)`);
console.log(`Templates echoing concerns: ${withConEcho}/${templates.length} (${Math.round(withConEcho/templates.length*100)}%)`);

// Show examples of templatized vs original
console.log("\n=== TEMPLATIZED EXAMPLES ===\n");
let shown = 0;
for (const t of templates) {
  if (t.hasPlaceholders && shown < 8) {
    console.log(`[${t.stakeholderId}|${t.variant}|RE:${t.reShare}%]`);
    console.log(`  Original: "${t.response}"`);
    console.log(`  Template: "${t.templatized}"`);
    console.log(`  Positive: "${t.positive}"`);
    console.log(`  Concern:  "${t.concern}"`);
    console.log();
    shown++;
  }
}

// Also show responses that DON'T templatize well (no numbers referenced)
console.log("\n=== NON-TEMPLATIZABLE (no number refs) ===\n");
shown = 0;
for (const t of templates) {
  if (!t.hasPlaceholders && shown < 5) {
    console.log(`[${t.stakeholderId}|${t.variant}|RE:${t.reShare}%]`);
    console.log(`  Response: "${t.response}"`);
    console.log();
    shown++;
  }
}
