/**
 * DEBUG FILE: Ollama AI Enhancement for Stakeholder Responses
 *
 * This file contains all relevant code for debugging the Ollama integration.
 * The issue: Ollama times out and falls back to rule-based responses despite
 * a 45s timeout (measured inference time was 38.7s on slower hardware).
 *
 * To test manually with curl:
 * curl -X POST http://localhost:11434/api/generate -d '{"model":"smollm2:1.7b","prompt":"Hello","stream":false}'
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface AIConfig {
  webLLMEnabled: boolean;
  webLLMModel: string;
  webLLMTimeout: number;

  ollamaEnabled: boolean;
  ollamaUrl: string;
  ollamaModel: string;
  ollamaTimeout: number;

  cloudEnabled: boolean;
  cloudProvider?: 'anthropic' | 'openai';
  cloudApiKey?: string;
  cloudTimeout: number;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  webLLMEnabled: true,
  webLLMModel: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
  webLLMTimeout: 60000,

  ollamaEnabled: true,
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'smollm2:1.7b',
  ollamaTimeout: 45000, // Increased to 45s for slower hardware (was 3s)

  cloudEnabled: false,
  cloudTimeout: 3000,
};

// Simplified stakeholder types for debugging
interface StakeholderProfile {
  id: string;
  name: string;
  priorities: string[];
  typicalQuestions: string[];
}

interface Concern {
  id: string;
  text: string;
  severity: 'low' | 'medium' | 'high';
}

interface StakeholderResponse {
  stakeholderId: string;
  stakeholderName: string;
  initialReaction: string;
  appreciation: string[];
  concerns: Concern[];
  questions: string[];
  engagementTips: string[];
  generationType: 'rule-based' | 'enhanced-rule-based' | 'ai-enhanced';
  metadata?: {
    interactionTriggersCount?: number;
  };
}

interface ScenarioInput {
  metadata?: {
    country?: string;
    scenarioName?: string;
  };
  milestones?: Array<{
    year: number;
    reShare?: number;
  }>;
  capacity?: {
    byYear?: Record<number, Record<string, number>>;
  };
}

interface DerivedMetrics {
  jobs?: {
    byYear?: Record<number, { total?: number }>;
  };
  emissions?: {
    percentReduction?: number;
  };
}

// ============================================================================
// FEW-SHOT EXAMPLES
// ============================================================================

interface FewShotExample {
  scenario: string;
  response: string;
}

interface StakeholderFewShot {
  stakeholderId: string;
  voiceDescription: string;
  examples: FewShotExample[];
}

const STAKEHOLDER_FEWSHOTS: Record<string, StakeholderFewShot> = {
  'policy-makers': {
    stakeholderId: 'policy-makers',
    voiceDescription: 'Formal, balanced, focused on policy coherence and political feasibility',
    examples: [
      {
        scenario: '70% renewables by 2030, high upfront costs',
        response: 'This aligns with our national commitments, but we need to ensure the investment timeline matches our fiscal planning cycle. How will this integrate with existing power sector reforms?'
      },
      {
        scenario: '50% renewables, gradual coal phase-out by 2045',
        response: 'A measured approach that balances energy security with decarbonization. We must ensure this transition plan has cross-party support to survive election cycles.'
      }
    ]
  },
  'grid-operators': {
    stakeholderId: 'grid-operators',
    voiceDescription: 'Technical, risk-focused, concerned with system stability and reliability',
    examples: [
      {
        scenario: '80% renewables, 400 MWh battery storage',
        response: 'The 400 MWh storage is insufficient for this VRE penetration level. We need detailed frequency response studies and at minimum 1,500 MWh to maintain N-1 contingency standards.'
      },
      {
        scenario: '55% renewables with new interconnector',
        response: 'The interconnector improves our reserve margin situation. However, we require clarity on the ramping requirements during evening solar drop-off periods.'
      }
    ]
  },
  'industry': {
    stakeholderId: 'industry',
    voiceDescription: 'Business-oriented, focused on costs, competitiveness, and supply chain',
    examples: [
      {
        scenario: 'Aggressive renewable transition, carbon pricing',
        response: 'We support decarbonization but need transition support. A sudden carbon price shock could push energy-intensive operations offshore. What trade protection measures are planned?'
      },
      {
        scenario: 'Solar manufacturing incentives included',
        response: 'The local content requirements create real opportunities. We can pivot our manufacturing capacity if there are long-term offtake guarantees for domestic panels.'
      }
    ]
  },
  'public': {
    stakeholderId: 'public',
    voiceDescription: 'Accessible language, focused on bills, jobs, health, and local impacts',
    examples: [
      {
        scenario: 'Large solar farm near rural community',
        response: 'We want to know: will our electricity bills go down? How many local jobs will there be during construction and after? What about the farmland being used?'
      },
      {
        scenario: 'Coal plant closure with retraining program',
        response: 'Our families have worked at the plant for generations. The retraining program sounds good on paper, but will there actually be jobs paying similar wages nearby?'
      }
    ]
  },
  'csos-ngos': {
    stakeholderId: 'csos-ngos',
    voiceDescription: 'Advocacy-focused, emphasizing climate ambition, justice, and transparency',
    examples: [
      {
        scenario: '65% renewables by 2035',
        response: 'This falls short of Paris-aligned pathways. The science demands at least 80% by 2035. Why are we still leaving room for fossil fuel expansion in 2030?'
      },
      {
        scenario: 'High ambition with community benefit sharing',
        response: 'Finally, a plan that recognizes frontline communities deserve direct benefits! We support this but will monitor implementation closely to ensure promises are kept.'
      }
    ]
  },
  'scientific': {
    stakeholderId: 'scientific',
    voiceDescription: 'Evidence-based, methodological, focused on data quality and validation',
    examples: [
      {
        scenario: 'Optimistic solar cost projections',
        response: 'The assumed 40% cost reduction by 2030 needs validation against peer-reviewed literature. What sensitivity analysis has been conducted on these assumptions?'
      },
      {
        scenario: 'Comprehensive scenario with multiple pathways',
        response: 'The multi-pathway approach is methodologically sound. We recommend publishing the full model documentation for academic peer review before policy adoption.'
      }
    ]
  },
  'financial': {
    stakeholderId: 'financial',
    voiceDescription: 'Investment-focused, emphasizing bankability, risk, and returns',
    examples: [
      {
        scenario: 'Large renewable portfolio, unclear PPA structure',
        response: 'The project pipeline is attractive, but bankability depends on PPA creditworthiness. Who are the offtakers and what sovereign guarantees are available?'
      },
      {
        scenario: 'Green bond issuance with clear taxonomy',
        response: 'This qualifies for our green finance framework. With the EU taxonomy alignment, we can offer concessional rates. Lets discuss blended finance structures.'
      }
    ]
  },
  'regional-bodies': {
    stakeholderId: 'regional-bodies',
    voiceDescription: 'Regional perspective, focused on cross-border trade and harmonization',
    examples: [
      {
        scenario: 'High renewable surplus potential',
        response: 'This positions the country as a potential regional clean energy exporter. Have you coordinated with neighboring countries on transmission interconnection planning?'
      },
      {
        scenario: 'Isolated grid development',
        response: 'We encourage considering regional integration benefits. Pooled reserves could reduce the storage requirements significantly while improving system resilience.'
      }
    ]
  },
  'development-partners': {
    stakeholderId: 'development-partners',
    voiceDescription: 'Development-focused, balancing ambition with debt sustainability',
    examples: [
      {
        scenario: '$5 billion investment requirement',
        response: 'We can mobilize climate finance for this, but the debt sustainability analysis is critical. What is the grant-to-loan ratio assumption in your financing plan?'
      },
      {
        scenario: 'Just transition elements included',
        response: 'The inclusion of just transition components strengthens the case for concessional financing. We can bring this to our climate investment committee as a priority project.'
      }
    ]
  }
};

function buildFewShotSection(stakeholderId: string): string {
  const fewshot = STAKEHOLDER_FEWSHOTS[stakeholderId];
  if (!fewshot) return '';

  let section = `Voice: ${fewshot.voiceDescription}\n\nExamples:\n`;
  fewshot.examples.forEach((ex, i) => {
    section += `\n${i + 1}. Scenario: ${ex.scenario}\nResponse: "${ex.response}"\n`;
  });
  return section;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateREShare(scenario: ScenarioInput, year: number): number {
  if (scenario.milestones) {
    const milestone = scenario.milestones.find(m => m.year === year);
    if (milestone?.reShare !== undefined) {
      return milestone.reShare;
    }
  }
  if (!scenario.capacity?.byYear) return 0;
  const capacityData = scenario.capacity.byYear[year];
  if (!capacityData) return 0;

  const renewable = (capacityData.solarPV || 0) +
                   (capacityData.windOnshore || 0) +
                   (capacityData.windOffshore || 0) +
                   (capacityData.hydro || 0);
  const total = renewable +
                (capacityData.coal || 0) +
                (capacityData.gas || 0) +
                (capacityData.diesel || 0);
  return total > 0 ? (renewable / total) * 100 : 0;
}

// ============================================================================
// OLLAMA CHECK AVAILABILITY
// ============================================================================

export async function checkOllamaAvailability(config: AIConfig): Promise<boolean> {
  if (!config.ollamaEnabled) return false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const response = await fetch(`${config.ollamaUrl}/api/tags`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return false;

    const data = await response.json();
    const models = data.models || [];
    return models.some((m: any) => m.name.includes(config.ollamaModel.split(':')[0]));
  } catch (error) {
    return false;
  }
}

// ============================================================================
// BUILD SYSTEM PROMPT (for Ollama)
// ============================================================================

function buildSystemPrompt(
  stakeholder: StakeholderProfile,
  scenario: ScenarioInput,
  derivedMetrics: DerivedMetrics
): string {
  const reShare2030 = calculateREShare(scenario, 2030).toFixed(1);
  const reShare2040 = calculateREShare(scenario, 2040).toFixed(1);
  const jobs2030 = derivedMetrics.jobs?.byYear?.[2030]?.total?.toLocaleString() || 'N/A';
  const emissionsReduction = derivedMetrics.emissions?.percentReduction?.toFixed(1) || 'N/A';

  return `You are simulating the perspective of a ${stakeholder.name} stakeholder reviewing an energy scenario.

STAKEHOLDER PROFILE:
- Name: ${stakeholder.name}
- Primary Concerns: ${stakeholder.priorities.join(', ')}
- Questions They Typically Ask: ${stakeholder.typicalQuestions.join('; ')}

SCENARIO CONTEXT:
- Country: ${scenario.metadata?.country || 'N/A'}
- Scenario: ${scenario.metadata?.scenarioName || 'N/A'}
- Renewable Share 2030: ${reShare2030}%
- Renewable Share 2040: ${reShare2040}%
- Estimated Jobs (2030): ${jobs2030}
- Emissions Reduction: ${emissionsReduction}%

TASK:
Enhance the following stakeholder response by making it more natural and conversational while preserving all key points.

CRITICAL RULES:
1. You MUST keep the same structure (Initial Reaction, Appreciation, Concerns, Questions, Engagement)
2. You MUST preserve all specific concerns and appreciations
3. You MUST NOT add new technical claims or calculations
4. You MUST NOT contradict the rule-based response
5. Make language more natural and stakeholder-appropriate
6. Keep tone professional but accessible
7. Maximum 200 words total

BASE RESPONSE TO ENHANCE:`;
}

// ============================================================================
// ENHANCE WITH OLLAMA - THE MAIN FUNCTION TO DEBUG
// ============================================================================

async function enhanceWithOllama(
  ruleBasedResponse: StakeholderResponse,
  stakeholder: StakeholderProfile,
  scenario: ScenarioInput,
  derivedMetrics: DerivedMetrics,
  config: AIConfig
): Promise<StakeholderResponse | null> {
  const startTime = Date.now();
  console.log('🦙 [Ollama] Starting enhancement for:', stakeholder.name);
  console.log('🦙 [Ollama] Config:', {
    url: config.ollamaUrl,
    model: config.ollamaModel,
    timeout: config.ollamaTimeout,
  });

  try {
    const systemPrompt = buildSystemPrompt(stakeholder, scenario, derivedMetrics);
    const baseResponseText = JSON.stringify(ruleBasedResponse, null, 2);

    const controller = new AbortController();
    console.log(`🦙 [Ollama] Setting timeout: ${config.ollamaTimeout}ms (${config.ollamaTimeout / 1000}s)`);

    const timeoutId = setTimeout(() => {
      console.log(`🦙 [Ollama] ⏰ TIMEOUT TRIGGERED after ${config.ollamaTimeout}ms`);
      controller.abort();
    }, config.ollamaTimeout);

    console.log('🦙 [Ollama] Sending request to:', `${config.ollamaUrl}/api/generate`);
    const fetchStartTime = Date.now();

    const response = await fetch(`${config.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.ollamaModel,
        prompt: `${systemPrompt}\n\n${baseResponseText}\n\nENHANCED VERSION (preserve structure, make more natural):`,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 400, // ~200 words
        }
      }),
      signal: controller.signal,
    });

    const fetchDuration = Date.now() - fetchStartTime;
    console.log(`🦙 [Ollama] Response received in ${fetchDuration}ms (${(fetchDuration / 1000).toFixed(1)}s)`);
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log(`🦙 [Ollama] ❌ Response not OK: ${response.status} ${response.statusText}`);
      return null;
    }

    console.log('🦙 [Ollama] Parsing response JSON...');
    const data = await response.json();
    const enhancedText = data.response;
    console.log('🦙 [Ollama] Response length:', enhancedText?.length || 0, 'characters');
    console.log('🦙 [Ollama] Response preview:', enhancedText?.substring(0, 100) + '...');

    // Try to parse as JSON (if LLM returned structured data)
    try {
      const parsed = JSON.parse(enhancedText);
      console.log('🦙 [Ollama] ✅ Parsed as JSON, using structured response');
      return {
        ...ruleBasedResponse,
        ...parsed,
        generationType: 'ai-enhanced' as const,
      };
    } catch {
      // LLM returned plain text - use it to enhance initialReaction only
      console.log('🦙 [Ollama] ✅ Using plain text for initialReaction');
      const totalDuration = Date.now() - startTime;
      console.log(`🦙 [Ollama] Total enhancement time: ${totalDuration}ms (${(totalDuration / 1000).toFixed(1)}s)`);
      return {
        ...ruleBasedResponse,
        initialReaction: enhancedText.trim().substring(0, 300), // Limit length
        generationType: 'ai-enhanced' as const,
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'Unknown';

    console.log('🦙 [Ollama] ❌ Enhancement FAILED');
    console.log('🦙 [Ollama] Error type:', errorName);
    console.log('🦙 [Ollama] Error message:', errorMessage);
    console.log('🦙 [Ollama] Failed after:', `${duration}ms (${(duration / 1000).toFixed(1)}s)`);

    if (errorName === 'AbortError') {
      console.log('🦙 [Ollama] ⏰ This was a TIMEOUT - request took too long');
      console.log('🦙 [Ollama] Timeout was set to:', `${config.ollamaTimeout}ms`);
    }

    return null;
  }
}

// ============================================================================
// MAIN ENTRY POINT: maybeEnhanceWithAI
// ============================================================================

export async function maybeEnhanceWithAI(
  ruleBasedResponse: StakeholderResponse,
  stakeholder: StakeholderProfile,
  scenario: ScenarioInput,
  derivedMetrics: DerivedMetrics,
  config: AIConfig = DEFAULT_AI_CONFIG
): Promise<StakeholderResponse> {

  // Skip WebLLM for this debug - focus on Ollama
  console.log('🔍 [AI] Skipping WebLLM, testing Ollama...');

  // Try Ollama
  if (config.ollamaEnabled) {
    console.log('🔍 [AI] Attempting Ollama enhancement...');
    console.log('🔍 [AI] Ollama config:', {
      enabled: config.ollamaEnabled,
      url: config.ollamaUrl,
      model: config.ollamaModel,
      timeout: `${config.ollamaTimeout}ms (${config.ollamaTimeout / 1000}s)`,
    });

    const ollamaResult = await enhanceWithOllama(
      ruleBasedResponse,
      stakeholder,
      scenario,
      derivedMetrics,
      config
    );

    if (ollamaResult) {
      console.log('✅ [AI] Response enhanced with Ollama successfully!');
      return ollamaResult;
    } else {
      console.log('⚠️ [AI] Ollama enhancement returned null, falling back to rule-based...');
    }
  } else {
    console.log('ℹ️ [AI] Ollama disabled in config, skipping...');
  }

  // Fallback to rule-based
  console.debug('ℹ️ Using rule-based response (AI enhancement unavailable)');
  return ruleBasedResponse;
}

// ============================================================================
// TEST HARNESS - Run this to debug
// ============================================================================

// Sample test data
const TEST_STAKEHOLDER: StakeholderProfile = {
  id: 'policy-makers',
  name: 'Policy Makers & Regulators',
  priorities: ['Policy coherence', 'Energy security', 'Affordability', 'Political feasibility'],
  typicalQuestions: [
    'How does this align with our NDC commitments?',
    'What are the fiscal implications?',
    'How will this affect energy prices for voters?'
  ]
};

const TEST_SCENARIO: ScenarioInput = {
  metadata: {
    country: 'ScenarioLand',
    scenarioName: 'High Renewable Transition'
  },
  milestones: [
    { year: 2030, reShare: 65 },
    { year: 2040, reShare: 85 }
  ]
};

const TEST_DERIVED_METRICS: DerivedMetrics = {
  jobs: {
    byYear: {
      2030: { total: 45000 }
    }
  },
  emissions: {
    percentReduction: 42
  }
};

const TEST_RULE_BASED_RESPONSE: StakeholderResponse = {
  stakeholderId: 'policy-makers',
  stakeholderName: 'Policy Makers & Regulators',
  initialReaction: 'This scenario presents an ambitious but achievable pathway. We see both opportunities and challenges that need careful consideration.',
  appreciation: [
    'Strong alignment with national climate commitments',
    'Job creation potential supports economic diversification goals',
    'Emissions reduction trajectory is politically defensible'
  ],
  concerns: [
    { id: 'fiscal', text: 'High upfront investment may strain fiscal capacity', severity: 'medium' },
    { id: 'affordability', text: 'Transition costs could affect electricity affordability', severity: 'medium' }
  ],
  questions: [
    'How will the financing be structured across public and private sectors?',
    'What social protection measures are planned for affected workers?'
  ],
  engagementTips: [
    'Frame around NDC commitments and international credibility',
    'Emphasize job creation and economic co-benefits'
  ],
  generationType: 'rule-based'
};

// ============================================================================
// RUN TEST
// ============================================================================

async function runTest() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🧪 OLLAMA DEBUG TEST');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('Config:');
  console.log('  - Ollama URL:', DEFAULT_AI_CONFIG.ollamaUrl);
  console.log('  - Model:', DEFAULT_AI_CONFIG.ollamaModel);
  console.log('  - Timeout:', DEFAULT_AI_CONFIG.ollamaTimeout, 'ms');
  console.log('');

  // First check availability
  console.log('Step 1: Checking Ollama availability...');
  const available = await checkOllamaAvailability(DEFAULT_AI_CONFIG);
  console.log('  Ollama available:', available);

  if (!available) {
    console.log('');
    console.log('❌ Ollama not available. Make sure:');
    console.log('  1. Ollama is installed (https://ollama.ai)');
    console.log('  2. Ollama is running (ollama serve)');
    console.log('  3. Model is pulled (ollama pull smollm2:1.7b)');
    return;
  }

  console.log('');
  console.log('Step 2: Running enhancement test...');
  console.log('');

  const startTime = Date.now();
  const result = await maybeEnhanceWithAI(
    TEST_RULE_BASED_RESPONSE,
    TEST_STAKEHOLDER,
    TEST_SCENARIO,
    TEST_DERIVED_METRICS,
    DEFAULT_AI_CONFIG
  );
  const totalTime = Date.now() - startTime;

  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 RESULTS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('Generation type:', result.generationType);
  console.log('Total time:', totalTime, 'ms', `(${(totalTime / 1000).toFixed(1)}s)`);
  console.log('');
  console.log('Initial Reaction:');
  console.log('─────────────────');
  console.log(result.initialReaction);
  console.log('');

  if (result.generationType === 'ai-enhanced') {
    console.log('✅ SUCCESS! Ollama enhancement worked!');
  } else {
    console.log('❌ FAILED: Fell back to rule-based response');
    console.log('');
    console.log('DEBUG HINTS:');
    console.log('  - Check console logs above for error details');
    console.log('  - If timeout, try increasing ollamaTimeout');
    console.log('  - Current timeout:', DEFAULT_AI_CONFIG.ollamaTimeout, 'ms');
    console.log('  - Try testing with curl:');
    console.log('    curl -X POST http://localhost:11434/api/generate \\');
    console.log('      -d \'{"model":"smollm2:1.7b","prompt":"Hello","stream":false}\'');
  }
}

// Export for Node.js usage
// Run with: npx tsx DEBUG-OLLAMA-AI.ts
if (typeof window === 'undefined') {
  runTest().catch(console.error);
}

export { runTest, enhanceWithOllama, buildSystemPrompt, TEST_STAKEHOLDER, TEST_SCENARIO, TEST_DERIVED_METRICS, TEST_RULE_BASED_RESPONSE };
