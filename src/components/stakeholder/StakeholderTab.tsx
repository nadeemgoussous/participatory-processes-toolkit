import { useState, useEffect, useRef } from 'react';
import { stakeholderProfiles } from '../../data/stakeholder-profiles';
import type { StakeholderProfile, DevelopmentContext, StakeholderVariant } from '../../types/stakeholder';
import type { StakeholderResponse } from '../../types/response';
import { StakeholderIcon } from './StakeholderIcon';
import PredictionInput from '../prediction/PredictionInput';
import CompareView from '../prediction/CompareView';
import { useScenario } from '../../context/ScenarioContext';
import { generateEnhancedResponse, getContextDescription } from '../../utils/stakeholder-rules';
import { maybeEnhanceWithAI, DEFAULT_AI_CONFIG, checkOllamaAvailability } from '../../utils/stakeholder-ai';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { Tooltip } from '../common/Tooltip';
import { useWebLLM } from '../../hooks/useWebLLM';
import type { WebLLMStatus } from '../../hooks/useWebLLM';
import { ModelLoadingProgress } from '../common/ModelLoadingProgress';

// Collapsible Section Component
function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true,
  accentColor
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 rounded transition-colors"
        aria-expanded={isOpen}
      >
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          {accentColor && (
            <span
              className="w-1 h-5 rounded"
              style={{ backgroundColor: accentColor }}
            />
          )}
          {icon}
          {title}
        </h4>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="pt-2">{children}</div>}
    </div>
  );
}

// Ollama Status Indicator Component
function OllamaStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'available' | 'unavailable' | 'error'>('checking');
  const [modelInfo, setModelInfo] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function checkOllama() {
      try {
        console.log('🔍 Checking Ollama availability...');
        const available = await checkOllamaAvailability(DEFAULT_AI_CONFIG);
        if (!isMounted) return;

        if (available) {
          console.log('✅ Ollama is available with model:', DEFAULT_AI_CONFIG.ollamaModel);
          setStatus('available');
          setModelInfo(DEFAULT_AI_CONFIG.ollamaModel);
        } else {
          console.log('❌ Ollama not available');
          setStatus('unavailable');
        }
      } catch (error) {
        console.error('Error checking Ollama:', error);
        if (isMounted) setStatus('error');
      }
    }

    checkOllama();
    return () => { isMounted = false; };
  }, []);

  if (status === 'checking') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-200">
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="font-medium">Checking Ollama...</span>
      </div>
    );
  }

  if (status === 'available') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg text-sm border border-green-200">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Ollama Ready ({modelInfo})</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <span className="font-medium">Ollama not running</span>
      <a
        href="https://ollama.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-red-600 hover:text-red-800"
      >
        Install Ollama
      </a>
    </div>
  );
}

// System Capability Checker - detects best AI backend for user's system
interface SystemCapabilities {
  // Hardware
  webgpu: boolean;
  webgpuInfo?: string;
  gpuTier: 'discrete' | 'integrated' | 'unknown';
  deviceMemory?: number; // GB
  cpuCores?: number;
  // Browser
  chrome: boolean;
  chromeVersion?: number;
  // AI backends
  ollama: boolean;
  ollamaModel?: string;
  webllmTested: boolean;
  webllmWorks: boolean;
  // Result
  recommendation: 'webllm' | 'ollama' | 'rule-based';
  recommendationReason: string;
}

interface SystemCapabilityCheckerProps {
  onRecommendation?: (backend: 'webllm' | 'ollama' | 'rule-based') => void;
  webllmStatus?: WebLLMStatus;
  webllmError?: { type: string; message: string } | null;
}

function SystemCapabilityChecker({ onRecommendation, webllmStatus, webllmError }: SystemCapabilityCheckerProps) {
  const [checking, setChecking] = useState(false);
  const [capabilities, setCapabilities] = useState<SystemCapabilities | null>(null);

  const checkCapabilities = async () => {
    setChecking(true);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔍 SYSTEM CAPABILITY CHECK - Starting comprehensive analysis');
    console.log('═══════════════════════════════════════════════════════════');

    const caps: SystemCapabilities = {
      webgpu: false,
      gpuTier: 'unknown',
      chrome: false,
      ollama: false,
      webllmTested: false,
      webllmWorks: false,
      recommendation: 'rule-based',
      recommendationReason: '',
    };

    // 0. Gather system info first
    console.log('\n📊 STEP 1: Gathering System Info');
    console.log('─────────────────────────────────');
    try {
      // Device memory (in GB) - not all browsers support this
      caps.deviceMemory = (navigator as any).deviceMemory;
      console.log('  💾 Device Memory:', caps.deviceMemory ? `${caps.deviceMemory} GB` : 'unknown (API not supported)');

      // CPU cores
      caps.cpuCores = navigator.hardwareConcurrency;
      console.log('  🖥️ CPU Cores:', caps.cpuCores || 'unknown');

      // Platform
      console.log('  💻 Platform:', navigator.platform);

      // Check user agent for additional hints
      const ua = navigator.userAgent;
      console.log('  📱 User Agent:', ua);

      // Parse useful info from UA
      const isWindows = ua.includes('Windows');
      const isMac = ua.includes('Macintosh') || ua.includes('Mac OS');
      const isLinux = ua.includes('Linux') && !ua.includes('Android');
      console.log('  🏷️ OS Detection:', { isWindows, isMac, isLinux });
    } catch (e) {
      console.log('  ❌ Error gathering system info:', e);
    }

    // 1. Check if WebLLM has already been tested
    console.log('\n🤖 STEP 2: Checking WebLLM Status');
    console.log('─────────────────────────────────');
    console.log('  Current WebLLM status:', webllmStatus);
    console.log('  WebLLM error:', webllmError || 'none');

    if (webllmStatus === 'error' && webllmError) {
      caps.webllmTested = true;
      caps.webllmWorks = false;
      caps.webgpu = false;
      caps.webgpuInfo = `WebLLM failed: ${webllmError.message}`;
      console.log('  ❌ WebLLM previously FAILED');
      console.log('  Error type:', webllmError.type);
      console.log('  Error message:', webllmError.message);
    } else if (webllmStatus === 'ready') {
      caps.webllmTested = true;
      caps.webllmWorks = true;
      caps.webgpu = true;
      caps.gpuTier = 'discrete';
      caps.webgpuInfo = 'WebLLM working - GPU verified';
      console.log('  ✅ WebLLM is READY and working');
    } else {
      console.log('  ⏳ WebLLM not yet tested, checking GPU capabilities...');
      // 2. Check WebGPU and try to identify GPU type
      console.log('\n🎮 STEP 3: Checking WebGPU & GPU');
      console.log('─────────────────────────────────');
      try {
        const hasWebGPU = 'gpu' in navigator;
        console.log('  WebGPU in navigator:', hasWebGPU);

        if (hasWebGPU) {
          const gpu = (navigator as any).gpu;
          console.log('  GPU object exists:', !!gpu);

          if (gpu) {
            console.log('  Requesting WebGPU adapter...');
            const adapter = await gpu.requestAdapter();
            console.log('  Adapter received:', !!adapter);

            if (adapter) {
              const info = await adapter.requestAdapterInfo?.();
              console.log('  📋 Raw Adapter Info:');
              console.log('    - vendor:', info?.vendor || '(empty)');
              console.log('    - description:', info?.description || '(empty)');
              console.log('    - device:', info?.device || '(empty)');
              console.log('    - architecture:', info?.architecture || '(empty)');

              const desc = (info?.description || '').toLowerCase();
              const vendor = (info?.vendor || '').toLowerCase();
              const device = (info?.device || '').toLowerCase();
              const arch = (info?.architecture || '').toLowerCase();

              const fullInfo = `${info?.vendor || ''} ${info?.description || ''} ${info?.device || ''}`.trim() || 'Unknown GPU';
              console.log('  Combined info string:', fullInfo);

              // Detect GPU tier based on all available info
              const allInfo = `${desc} ${vendor} ${device} ${arch}`;

              // Known integrated GPU patterns (typically DON'T work with WebLLM)
              const integratedPatterns = [
                'intel', 'uhd', 'iris', 'hd graphics',  // Intel integrated
                'vega', 'radeon graphics',               // AMD APU (not RX)
                'mali', 'adreno', 'powervr',            // Mobile GPUs
                'integrated', 'igpu'
              ];

              // Known discrete GPU patterns (likely to work well)
              const discretePatterns = [
                'geforce', 'gtx', 'rtx', 'quadro',      // NVIDIA
                'radeon rx', 'radeon pro',              // AMD discrete
                'arc a',                                 // Intel Arc (discrete)
              ];

              // Apple Silicon patterns - these WORK with WebLLM despite being "integrated"
              const appleSiliconPatterns = [
                'apple', 'm1', 'm2', 'm3', 'm4',        // Apple Silicon chips
                'metal',                                 // macOS graphics API
              ];

              console.log('\n  🔎 Pattern Matching:');
              console.log('    All info (lowercase):', allInfo);

              let isIntegrated = integratedPatterns.some(p => allInfo.includes(p));
              let isDiscrete = discretePatterns.some(p => allInfo.includes(p));
              let isAppleSilicon = appleSiliconPatterns.some(p => allInfo.includes(p));

              // Log which patterns matched
              const matchedIntegrated = integratedPatterns.filter(p => allInfo.includes(p));
              const matchedDiscrete = discretePatterns.filter(p => allInfo.includes(p));
              const matchedApple = appleSiliconPatterns.filter(p => allInfo.includes(p));

              console.log('    Integrated patterns matched:', matchedIntegrated.length > 0 ? matchedIntegrated : 'none');
              console.log('    Discrete patterns matched:', matchedDiscrete.length > 0 ? matchedDiscrete : 'none');
              console.log('    Apple Silicon patterns matched:', matchedApple.length > 0 ? matchedApple : 'none');

              console.log('    Initial detection:');
              console.log('      isIntegrated:', isIntegrated);
              console.log('      isDiscrete:', isDiscrete);
              console.log('      isAppleSilicon:', isAppleSilicon);

              // Also check user agent for macOS (backup detection)
              const ua = navigator.userAgent.toLowerCase();
              const isMacOS = ua.includes('macintosh') || ua.includes('mac os');
              console.log('    macOS from User Agent:', isMacOS);

              if (!isAppleSilicon && isMacOS) {
                // On a Mac but GPU not identified as Apple - could still be M-series
                console.log('    🍎 macOS detected but no Apple pattern in GPU - assuming Apple Silicon');
                isAppleSilicon = true; // Assume Apple Silicon on modern Macs
              }

              console.log('    Final detection:');
              console.log('      isIntegrated:', isIntegrated);
              console.log('      isDiscrete:', isDiscrete);
              console.log('      isAppleSilicon:', isAppleSilicon);

              console.log('\n  🎯 GPU Classification Decision:');
              if (isDiscrete) {
                caps.gpuTier = 'discrete';
                caps.webgpu = true;
                caps.webgpuInfo = fullInfo;
                console.log('    ✅ Result: DISCRETE GPU - WebLLM should work well');
              } else if (isAppleSilicon) {
                caps.gpuTier = 'discrete'; // Apple Silicon works like discrete for WebLLM
                caps.webgpu = true;
                caps.webgpuInfo = `${fullInfo || 'Apple Silicon'} - WebLLM works great on M-series Macs`;
                console.log('    ✅ Result: APPLE SILICON - WebLLM should work great!');
              } else if (isIntegrated) {
                caps.gpuTier = 'integrated';
                caps.webgpu = false;
                caps.webgpuInfo = `${fullInfo} (integrated GPU - WebLLM unlikely to work)`;
                console.log('    ⚠️ Result: INTEGRATED GPU - WebLLM unlikely to work');
              } else if (fullInfo === 'Unknown GPU' || allInfo.trim() === '') {
                // Can't identify GPU - check other system specs
                caps.gpuTier = 'unknown';

                // If low memory or few cores, probably a weak system
                const lowSpecs = (caps.deviceMemory && caps.deviceMemory < 8) ||
                                 (caps.cpuCores && caps.cpuCores < 4);
                console.log('    Checking system specs for unknown GPU...');
                console.log('    Low specs?', lowSpecs, `(RAM: ${caps.deviceMemory || '?'}GB, Cores: ${caps.cpuCores || '?'})`);

                if (lowSpecs) {
                  caps.webgpu = false;
                  caps.webgpuInfo = `Unknown GPU + limited system resources (${caps.deviceMemory || '?'}GB RAM, ${caps.cpuCores || '?'} cores) - WebLLM risky`;
                  console.log('    ⚠️ Result: UNKNOWN GPU + LOW SPECS - WebLLM risky');
                } else {
                  caps.webgpu = false; // Conservative - don't recommend WebLLM for unknown GPUs
                  caps.webgpuInfo = `Unknown GPU - cannot verify WebLLM compatibility`;
                  console.log('    ⚠️ Result: UNKNOWN GPU - cannot verify compatibility');
                }
              } else {
                // Unknown GPU type but has some info
                caps.gpuTier = 'unknown';
                caps.webgpu = false;
                caps.webgpuInfo = `${fullInfo} - unrecognised GPU, WebLLM may not work`;
                console.log('    ⚠️ Result: UNRECOGNISED GPU -', fullInfo);
              }

              console.log('    Final GPU tier:', caps.gpuTier);
              console.log('    WebGPU recommended:', caps.webgpu);
            } else {
              caps.webgpuInfo = 'No compatible GPU adapter found';
              console.log('❌ WebGPU: No adapter found');
            }
          }
        } else {
          caps.webgpuInfo = 'WebGPU not supported by browser';
          console.log('❌ WebGPU: Not in navigator');
        }
      } catch (error) {
        caps.webgpuInfo = `Error: ${error instanceof Error ? error.message : 'Unknown'}`;
        console.log('❌ WebGPU error:', error);
      }
    }

    // 2. Check Chrome version
    console.log('\n🌐 STEP 4: Checking Browser');
    console.log('─────────────────────────────────');
    try {
      const userAgent = navigator.userAgent;
      const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
      const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
      const safariMatch = userAgent.match(/Version\/(\d+).*Safari/);
      const edgeMatch = userAgent.match(/Edg\/(\d+)/);

      console.log('  Browser detection:');
      if (edgeMatch) {
        console.log('    Edge version:', edgeMatch[1]);
        caps.chromeVersion = parseInt(edgeMatch[1], 10); // Edge uses same version as Chromium
        caps.chrome = caps.chromeVersion >= 113;
      } else if (chromeMatch) {
        console.log('    Chrome version:', chromeMatch[1]);
        caps.chromeVersion = parseInt(chromeMatch[1], 10);
        caps.chrome = caps.chromeVersion >= 113;
      } else if (firefoxMatch) {
        console.log('    Firefox version:', firefoxMatch[1], '(WebGPU support varies)');
      } else if (safariMatch) {
        console.log('    Safari version:', safariMatch[1], '(WebGPU supported in Safari 17+)');
      }
      console.log('  WebGPU-capable browser:', caps.chrome);
      console.log('  Version requirement: 113+ for Chrome/Edge');
    } catch (error) {
      console.log('  ❌ Could not detect browser version:', error);
    }

    // 3. Check Ollama availability
    console.log('\n🦙 STEP 5: Checking Ollama');
    console.log('─────────────────────────────────');
    console.log('  Ollama URL:', DEFAULT_AI_CONFIG.ollamaUrl);
    console.log('  Expected model:', DEFAULT_AI_CONFIG.ollamaModel);
    try {
      caps.ollama = await checkOllamaAvailability(DEFAULT_AI_CONFIG);
      if (caps.ollama) {
        caps.ollamaModel = DEFAULT_AI_CONFIG.ollamaModel;
        console.log('  ✅ Ollama is AVAILABLE');
        console.log('  Model ready:', caps.ollamaModel);
      } else {
        console.log('  ❌ Ollama NOT available');
        console.log('  Possible reasons: Ollama not running, model not pulled, or server unreachable');
      }
    } catch (error) {
      console.log('  ❌ Ollama check FAILED:', error);
    }

    // 4. Determine recommendation based on all factors
    console.log('\n✨ STEP 6: Determining Recommendation');
    console.log('─────────────────────────────────');
    console.log('  Factors:');
    console.log('    - WebLLM already working:', caps.webllmWorks);
    console.log('    - WebGPU available:', caps.webgpu);
    console.log('    - Browser compatible:', caps.chrome);
    console.log('    - GPU tier:', caps.gpuTier);
    console.log('    - Ollama available:', caps.ollama);

    if (caps.webllmWorks) {
      // WebLLM is already confirmed working
      caps.recommendation = 'webllm';
      caps.recommendationReason = 'WebLLM is already loaded and working. Best for offline AI.';
      console.log('  Decision: WebLLM (already working)');
    } else if (caps.webgpu && caps.chrome && caps.gpuTier === 'discrete') {
      // Discrete GPU with WebGPU - WebLLM should work great
      caps.recommendation = 'webllm';
      caps.recommendationReason = `Discrete GPU detected (${caps.webgpuInfo}). WebLLM should work well.`;
      console.log('  Decision: WebLLM (discrete GPU + WebGPU)');
    } else if (caps.ollama) {
      // Ollama is available - recommend it for integrated/unknown GPUs
      caps.recommendation = 'ollama';
      if (caps.gpuTier === 'integrated') {
        caps.recommendationReason = `Integrated GPU detected. Ollama (${caps.ollamaModel}) is better for your hardware.`;
        console.log('  Decision: Ollama (integrated GPU detected)');
      } else if (caps.gpuTier === 'unknown') {
        caps.recommendationReason = `GPU type unknown. Ollama (${caps.ollamaModel}) is the safer choice.`;
        console.log('  Decision: Ollama (unknown GPU, safer choice)');
      } else {
        caps.recommendationReason = `Ollama running with ${caps.ollamaModel}. Local server AI recommended.`;
        console.log('  Decision: Ollama (available and ready)');
      }
    } else if (caps.webgpu && caps.chrome) {
      // WebGPU available but GPU is integrated/unknown - risky but possible
      caps.recommendation = 'webllm';
      caps.recommendationReason = `WebGPU available but ${caps.gpuTier} GPU. WebLLM may be slow or fail. Consider installing Ollama.`;
      console.log('  Decision: WebLLM (risky - no Ollama fallback)');
    } else {
      // No AI backend available
      caps.recommendation = 'rule-based';
      const reasons = [];
      if (!caps.webgpu) reasons.push(caps.webgpuInfo || 'WebGPU unavailable');
      if (!caps.chrome) reasons.push(`Chrome ${caps.chromeVersion || 'unknown'} (need 113+)`);
      if (!caps.ollama) reasons.push('Ollama not running');
      caps.recommendationReason = `${reasons.join('. ')}. Using fast rule-based responses.`;
      console.log('  Decision: Rule-based (no AI backend available)');
    }

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📋 FINAL RESULT');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  Recommendation:', caps.recommendation.toUpperCase());
    console.log('  Reason:', caps.recommendationReason);
    console.log('  Full capabilities:', caps);
    console.log('═══════════════════════════════════════════════════════════\n');

    setCapabilities(caps);
    setChecking(false);

    if (onRecommendation) {
      onRecommendation(caps.recommendation);
    }
  };

  if (checking) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 text-blue-700">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium">Checking system capabilities...</span>
        </div>
      </div>
    );
  }

  if (capabilities) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          System Capabilities
        </h4>

        {/* System Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
          {/* GPU Status */}
          <div className={`flex flex-col px-3 py-2 rounded ${
            capabilities.webgpu ? 'bg-green-100 text-green-800' :
            capabilities.gpuTier === 'integrated' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-center gap-1 font-medium">
              {capabilities.webgpu ? '✓' : capabilities.gpuTier === 'integrated' ? '⚠' : '✗'} GPU
            </div>
            <span className="text-xs opacity-75 truncate" title={capabilities.webgpuInfo}>
              {capabilities.gpuTier !== 'unknown' ? capabilities.gpuTier : 'unknown'}
            </span>
          </div>

          {/* Chrome Status */}
          <div className={`flex flex-col px-3 py-2 rounded ${capabilities.chrome ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <div className="flex items-center gap-1 font-medium">
              {capabilities.chrome ? '✓' : '⚠'} Browser
            </div>
            <span className="text-xs opacity-75">Chrome {capabilities.chromeVersion || 'N/A'}</span>
          </div>

          {/* Memory */}
          <div className={`flex flex-col px-3 py-2 rounded ${
            capabilities.deviceMemory && capabilities.deviceMemory >= 8 ? 'bg-green-100 text-green-800' :
            capabilities.deviceMemory && capabilities.deviceMemory >= 4 ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-600'
          }`}>
            <div className="flex items-center gap-1 font-medium">
              {capabilities.deviceMemory && capabilities.deviceMemory >= 8 ? '✓' :
               capabilities.deviceMemory && capabilities.deviceMemory >= 4 ? '⚠' : '—'} RAM
            </div>
            <span className="text-xs opacity-75">
              {capabilities.deviceMemory ? `${capabilities.deviceMemory} GB` : 'unknown'}
            </span>
          </div>

          {/* CPU */}
          <div className={`flex flex-col px-3 py-2 rounded ${
            capabilities.cpuCores && capabilities.cpuCores >= 8 ? 'bg-green-100 text-green-800' :
            capabilities.cpuCores && capabilities.cpuCores >= 4 ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-600'
          }`}>
            <div className="flex items-center gap-1 font-medium">
              {capabilities.cpuCores && capabilities.cpuCores >= 8 ? '✓' :
               capabilities.cpuCores && capabilities.cpuCores >= 4 ? '⚠' : '—'} CPU
            </div>
            <span className="text-xs opacity-75">
              {capabilities.cpuCores ? `${capabilities.cpuCores} cores` : 'unknown'}
            </span>
          </div>
        </div>

        {/* AI Backend Status */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          {/* Ollama Status */}
          <div className={`flex flex-col px-3 py-2 rounded ${capabilities.ollama ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            <div className="flex items-center gap-1 font-medium">
              {capabilities.ollama ? '✓' : '—'} Ollama
            </div>
            <span className="text-xs opacity-75">{capabilities.ollamaModel || 'not running'}</span>
          </div>

          {/* WebLLM Status */}
          <div className={`flex flex-col px-3 py-2 rounded ${
            capabilities.webllmWorks ? 'bg-green-100 text-green-800' :
            capabilities.webgpu ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-600'
          }`}>
            <div className="flex items-center gap-1 font-medium">
              {capabilities.webllmWorks ? '✓' : capabilities.webgpu ? '?' : '—'} WebLLM
            </div>
            <span className="text-xs opacity-75">
              {capabilities.webllmWorks ? 'ready' : capabilities.webgpu ? 'untested' : 'unavailable'}
            </span>
          </div>
        </div>

        {/* GPU Details (expandable) */}
        {capabilities.webgpuInfo && (
          <details className="text-xs text-gray-600 mb-3">
            <summary className="cursor-pointer hover:text-gray-800">GPU Details</summary>
            <p className="mt-1 p-2 bg-gray-100 rounded">{capabilities.webgpuInfo}</p>
          </details>
        )}

        {/* Recommendation */}
        <div className={`p-3 rounded-lg ${
          capabilities.recommendation === 'webllm' ? 'bg-blue-100 border border-blue-300' :
          capabilities.recommendation === 'ollama' ? 'bg-purple-100 border border-purple-300' :
          'bg-gray-100 border border-gray-300'
        }`}>
          <p className="font-medium text-sm">
            ✨ Recommended: <strong className="uppercase">{capabilities.recommendation}</strong>
          </p>
          <p className="text-xs text-gray-600 mt-1">{capabilities.recommendationReason}</p>
        </div>

        <button
          onClick={checkCapabilities}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Re-check
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={checkCapabilities}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Check system capabilities
    </button>
  );
}

interface StakeholderTabProps {
  onStakeholderSelected?: (stakeholder: StakeholderProfile) => void;
  onNavigateToExplore?: () => void;
}

// localStorage keys for persisting preferences
const STORAGE_KEYS = {
  settingsExpanded: 'stakeholder-settings-expanded',
  developmentContext: 'stakeholder-development-context',
  stakeholderVariant: 'stakeholder-variant',
  aiBackend: 'stakeholder-ai-backend',
};

export default function StakeholderTab({ onStakeholderSelected, onNavigateToExplore }: StakeholderTabProps) {
  const { scenario, derivedMetrics } = useScenario();
  const isOnline = useOnlineStatus();

  // WebLLM AI enhancement hook
  const webllm = useWebLLM();

  // Track template IDs for anti-repetition across stakeholder interactions
  const templateHistoryRef = useRef<number[]>([]);

  const [selectedStakeholder, setSelectedStakeholder] = useState<StakeholderProfile | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [userPrediction, setUserPrediction] = useState<string>('');
  const [stakeholderResponse, setStakeholderResponse] = useState<StakeholderResponse | null>(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [streamingText, setStreamingText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Response Settings collapsed state - defaults to collapsed after first use
  const [settingsExpanded, setSettingsExpanded] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.settingsExpanded);
    return saved === null ? true : saved === 'true'; // Default open on first visit
  });

  // Enhanced framework controls with localStorage persistence
  const [developmentContext, setDevelopmentContext] = useState<DevelopmentContext>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.developmentContext);
    return (saved as DevelopmentContext) || 'emerging';
  });
  const [stakeholderVariant, setStakeholderVariant] = useState<StakeholderVariant>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.stakeholderVariant);
    return (saved as StakeholderVariant) || 'pragmatic';
  });

  // AI Backend preference
  type AIBackend = 'auto' | 'webllm' | 'ollama' | 'rule-based';
  const [aiBackend, setAIBackend] = useState<AIBackend>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.aiBackend);
    return (saved as AIBackend) || 'auto';
  });

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settingsExpanded, String(settingsExpanded));
  }, [settingsExpanded]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.developmentContext, developmentContext);
  }, [developmentContext]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.stakeholderVariant, stakeholderVariant);
  }, [stakeholderVariant]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.aiBackend, aiBackend);
  }, [aiBackend]);

  const handleStakeholderClick = (stakeholder: StakeholderProfile) => {
    setSelectedStakeholder(stakeholder);
    setShowPrediction(false);
    setUserPrediction('');
    setStakeholderResponse(null);
    onStakeholderSelected?.(stakeholder);
  };

  const handleProceedToPrediction = () => {
    setShowPrediction(true);
  };

  const handleRevealResponse = async (prediction: string) => {
    setUserPrediction(prediction);
    setIsGeneratingResponse(true); // Show loading state
    setStreamingText(''); // Clear previous streaming text
    setIsStreaming(false); // Reset streaming state

    try {
      // Generate stakeholder response with enhanced framework
      if (scenario && derivedMetrics && selectedStakeholder) {
        console.log('🔄 Generating response for:', selectedStakeholder.name);
        console.log('Context:', developmentContext, 'Variant:', stakeholderVariant);
        console.log('AI Backend:', aiBackend);
        console.log('WebLLM status:', webllm.status);

        // Generate enhanced response with context and variant
        const enhancedResponse = generateEnhancedResponse(
          scenario,
          derivedMetrics,
          selectedStakeholder,
          {
            context: developmentContext,
            variant: stakeholderVariant,
            includeInteractionTriggers: true,
            sessionHistory: templateHistoryRef.current
          }
        );

        // Configure AI backend based on user preference
        let finalResponse: StakeholderResponse;

        if (aiBackend === 'rule-based') {
          // Skip AI enhancement entirely
          console.log('ℹ️ Using rule-based only (user preference)');
          finalResponse = enhancedResponse;
        } else {
          // Try to enhance with AI based on user's backend preference
          // Create custom config based on user preference
          const customConfig = { ...DEFAULT_AI_CONFIG };

          if (aiBackend === 'ollama') {
            // Ollama only - disable WebLLM and cloud
            customConfig.webLLMEnabled = false;
            customConfig.ollamaEnabled = true;
            customConfig.cloudEnabled = false;
            console.log('🔧 Configured for Ollama only');
          } else if (aiBackend === 'webllm') {
            // WebLLM only - disable Ollama and cloud
            customConfig.webLLMEnabled = true;
            customConfig.ollamaEnabled = false;
            customConfig.cloudEnabled = false;
            console.log('🔧 Configured for WebLLM only');
          } else {
            // Auto mode - keep defaults (WebLLM → Ollama → Cloud → Rule-based)
            console.log('🔧 Configured for auto failover');
          }

          // Set up streaming callback for Ollama
          const handleChunk = (text: string) => {
            console.log('📥 [Streaming] Received chunk, length:', text.length);
            setStreamingText(text);
            setIsStreaming(true);
          };

          finalResponse = await maybeEnhanceWithAI(
            enhancedResponse,
            selectedStakeholder,
            scenario,
            derivedMetrics,
            customConfig,
            handleChunk
          );
        }

        console.log('✅ Response generated:', finalResponse.generationType);
        console.log('Interaction triggers:', finalResponse.metadata?.interactionTriggersCount || 0);

        // Track template ID for anti-repetition
        if (finalResponse.lastTemplateId !== undefined) {
          templateHistoryRef.current.push(finalResponse.lastTemplateId);
        }

        setIsStreaming(false); // Streaming complete
        setStakeholderResponse(finalResponse);
      } else {
        console.error('❌ Missing data for response generation:');
        console.error('- Scenario:', !!scenario);
        console.error('- Derived metrics:', !!derivedMetrics);
        console.error('- Selected stakeholder:', !!selectedStakeholder);
      }
    } finally {
      setIsGeneratingResponse(false); // Hide loading state
    }
  };

  const handleBackToSelection = () => {
    setShowPrediction(false);
    setUserPrediction('');
    setStakeholderResponse(null);
  };

  const handleTryAnother = () => {
    setSelectedStakeholder(null);
    setShowPrediction(false);
    setUserPrediction('');
    setStakeholderResponse(null);
  };

  // If showing compare view (after response generation), render that
  if (stakeholderResponse && selectedStakeholder && userPrediction) {
    return (
      <CompareView
        stakeholder={selectedStakeholder}
        userPrediction={userPrediction}
        stakeholderResponse={stakeholderResponse}
        streamingText={streamingText}
        isStreaming={isStreaming}
        onTryAnother={handleTryAnother}
        onExplore={onNavigateToExplore}
      />
    );
  }

  // If showing prediction input, render that instead
  if (showPrediction && selectedStakeholder) {
    return (
      <PredictionInput
        stakeholder={selectedStakeholder}
        onRevealResponse={handleRevealResponse}
        onBack={handleBackToSelection}
        isLoading={isGeneratingResponse}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-irena-blue)' }}>
          Stakeholder Dialogue
        </h2>
        <p className="text-gray-600 text-lg">
          Select a stakeholder group to explore their perspective on your scenario
        </p>

        {/* WebLLM Status and Enable Button */}
        <div className="mt-4 flex flex-col items-center gap-3">
          {/* Show Enable WebLLM button only for Auto or WebLLM backends */}
          {webllm.isSupported && webllm.status === 'not-loaded' && (aiBackend === 'auto' || aiBackend === 'webllm') && (
            <button
              onClick={() => {
                console.log('🖱️ Enable AI Enhancement button clicked!');
                console.log('WebLLM current status:', webllm.status);
                console.log('WebLLM isSupported:', webllm.isSupported);
                webllm.initializeModel();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Download AI model (optional)
            </button>
          )}

          {/* Show loading indicator when WebLLM initializing (only for Auto/WebLLM backends) */}
          {webllm.status === 'loading' && (aiBackend === 'auto' || aiBackend === 'webllm') && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm border border-blue-200">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">
                Downloading AI Model... {webllm.progress ? `${Math.round(webllm.progress.progress * 100)}%` : ''}
              </span>
            </div>
          )}

          {/* Show WebLLM Ready indicator (only for Auto/WebLLM backends) */}
          {webllm.status === 'ready' && (aiBackend === 'auto' || aiBackend === 'webllm') && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg text-sm border border-green-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">✨ WebLLM AI Ready</span>
            </div>
          )}

          {/* Show Ollama status for Ollama backend */}
          {aiBackend === 'ollama' && (
            <OllamaStatusIndicator />
          )}

          {/* Show Rule-based mode indicator */}
          {aiBackend === 'rule-based' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Using Fast Rule-based Responses</span>
            </div>
          )}

          {/* Offline indicator - subtle, not alarming */}
          {!isOnline && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Working offline - responses use rule-based generation</span>
            </div>
          )}
        </div>
      </div>

      {/* WebLLM Model Loading Progress */}
      {(webllm.status === 'loading' || webllm.status === 'error') && (
        <ModelLoadingProgress
          progress={webllm.progress}
          isLoading={webllm.status === 'loading'}
          error={webllm.error}
          onSkip={() => {
            // User chose to skip - they can enable later
            console.log('User skipped WebLLM initialization');
          }}
          onComplete={() => {
            console.log('WebLLM model loaded successfully');
          }}
          onRetry={() => {
            console.log('User requested retry');
            webllm.initializeModel();
          }}
        />
      )}

      {/* Stakeholder Icon Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Select stakeholder group
        </h3>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {stakeholderProfiles.map((stakeholder) => (
            <button
              key={stakeholder.id}
              onClick={() => handleStakeholderClick(stakeholder)}
              data-stakeholder-id={stakeholder.id}
              className={`
                stakeholder-button
                flex flex-col items-center
                pt-4 pb-3 px-2 rounded-lg border-2 transition-all
                hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  selectedStakeholder?.id === stakeholder.id
                    ? 'border-current bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }
              `}
              style={{
                color: selectedStakeholder?.id === stakeholder.id ? stakeholder.color : '#6b7280',
                borderColor: selectedStakeholder?.id === stakeholder.id ? stakeholder.color : undefined,
              }}
              aria-pressed={selectedStakeholder?.id === stakeholder.id}
              aria-label={`Select ${stakeholder.name}`}
            >
              {/* Icon — fixed-height zone so all icons sit at the same vertical position */}
              <div className="h-16 w-16 flex items-center justify-center flex-shrink-0 mb-2">
                <StakeholderIcon stakeholder={stakeholder} size="medium" />
              </div>

              {/* Stakeholder Name — min-height so short names don't compress the card */}
              <span className="text-xs text-center font-medium leading-tight min-h-[2.5rem] flex items-start justify-center w-full">
                {stakeholder.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Stakeholder Details */}
      {selectedStakeholder && (
        <div
          style={{ borderLeftColor: selectedStakeholder.color, borderLeftWidth: '4px', paddingLeft: '1.5rem' }}
        >
          <div className="flex items-start gap-4 mb-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <StakeholderIcon stakeholder={selectedStakeholder} size="large" />
            </div>

            {/* Header */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 text-gray-800">
                {selectedStakeholder.name}
              </h3>
              <p className="text-gray-700">
                {selectedStakeholder.description}
              </p>
            </div>
          </div>

          {/* Key Priorities - Always visible */}
          <CollapsibleSection
            title="Key priorities"
            accentColor={selectedStakeholder.color}
            defaultOpen={true}
          >
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedStakeholder.priorities.map((priority, idx) => {
                // Map priority text to glossary keys
                const priorityKey = priority.toLowerCase()
                  .replace(/\s+/g, '_')
                  .replace(/[&/]/g, '')
                  .replace(/__+/g, '_');

                return (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-gray-400 mt-1">•</span>
                    <Tooltip content={priorityKey} isGlossaryKey={true}>
                      <span className="cursor-help">{priority}</span>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </CollapsibleSection>

          {/* Typical Questions - Open by default to help users formulate predictions */}
          <CollapsibleSection
            title="Questions they typically ask"
            accentColor={selectedStakeholder.color}
            defaultOpen={true}
          >
            <ul className="space-y-2">
              {selectedStakeholder.typicalQuestions.map((question, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-gray-400">–</span>
                  <span className="italic">{question}</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {/* Why Engage - Collapsed by default */}
          <CollapsibleSection
            title="Why engage this group"
            accentColor={selectedStakeholder.color}
            defaultOpen={false}
          >
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-800 mb-1">Why engage this group?</p>
              <p className="text-gray-700 mb-3">{selectedStakeholder.whyEngage}</p>

              <p className="text-sm font-medium text-gray-800 mb-1">What's in it for them?</p>
              <p className="text-gray-700">{selectedStakeholder.benefitForThem}</p>
            </div>
          </CollapsibleSection>

          {/* Next Step Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              className="btn-primary px-8 py-3 text-lg"
              style={{ backgroundColor: selectedStakeholder.color }}
              onClick={handleProceedToPrediction}
            >
              Predict their response →
            </button>
          </div>
        </div>
      )}

      {/* Instruction Text (when no stakeholder selected) */}
      {!selectedStakeholder && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg">
            Click on a stakeholder group above to see their perspective and priorities
          </p>
        </div>
      )}

      {/* Advanced Settings - Moved to bottom to not distract from main workflow */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <button
          onClick={() => setSettingsExpanded(!settingsExpanded)}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={settingsExpanded}
        >
          <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"/>
            </svg>
            Advanced settings
            <span className="text-xs font-normal text-gray-400">(Optional)</span>
            {!settingsExpanded && (
              <span className="text-xs font-normal text-gray-400 ml-1">
                - {developmentContext === 'least-developed' ? 'LDC' : developmentContext === 'developed' ? 'Developed' : 'Emerging'} / {stakeholderVariant} / {aiBackend === 'auto' ? 'Auto AI' : aiBackend === 'ollama' ? 'Ollama' : aiBackend === 'webllm' ? 'WebLLM' : 'Rule-based'}
              </span>
            )}
          </h3>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${settingsExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {settingsExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-gray-200">
          {/* Development Context Selector */}
          <div>
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
              Country development context
            </label>
            <select
              id="context"
              value={developmentContext}
              onChange={(e) => setDevelopmentContext(e.target.value as DevelopmentContext)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="least-developed">Least-Developed Countries</option>
              <option value="emerging">Emerging Economies</option>
              <option value="developed">Developed Countries</option>
            </select>
            <p className="mt-2 text-xs text-gray-600">
              {getContextDescription(developmentContext)}
            </p>
          </div>

          {/* Stakeholder Variant Selector */}
          <div>
            <label htmlFor="variant" className="block text-sm font-medium text-gray-700 mb-2">
              Stakeholder perspective
            </label>
            <select
              id="variant"
              value={stakeholderVariant}
              onChange={(e) => setStakeholderVariant(e.target.value as StakeholderVariant)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="conservative">Conservative - Cautious on change, risk-averse</option>
              <option value="pragmatic">Pragmatic - Balanced, seeks feasible solutions</option>
              <option value="progressive">Progressive - Ambitious, embracing transition</option>
            </select>
            <p className="mt-2 text-xs text-gray-600">
              {stakeholderVariant === 'conservative' && 'Prioritizes security and stability, cautious on rapid transitions'}
              {stakeholderVariant === 'pragmatic' && 'Balances multiple objectives, focuses on practical implementation'}
              {stakeholderVariant === 'progressive' && 'Champions ambitious goals, willing to accept managed risk'}
            </p>
          </div>

          {/* AI Backend Selector */}
          <div>
            <label htmlFor="ai-backend" className="block text-sm font-medium text-gray-700 mb-2">
              AI enhancement
            </label>
            <select
              id="ai-backend"
              value={aiBackend}
              onChange={(e) => setAIBackend(e.target.value as AIBackend)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="auto">Auto (Try WebLLM → Ollama → Rule-based)</option>
              <option value="webllm">WebLLM Only (Browser AI - needs WebGPU)</option>
              <option value="ollama">Ollama Only (Local AI server)</option>
              <option value="rule-based">Rule-based Only (Fastest, offline)</option>
            </select>
            <p className="mt-2 text-xs text-gray-600">
              {aiBackend === 'auto' && 'Automatically tries WebLLM first, falls back to Ollama, then rule-based'}
              {aiBackend === 'webllm' && 'Uses browser-based AI (requires WebGPU support - Chrome 113+)'}
              {aiBackend === 'ollama' && 'Uses Ollama local server (requires Ollama installed and running)'}
              {aiBackend === 'rule-based' && 'Fast, deterministic responses - always works offline'}
            </p>
          </div>

          {/* System Capability Checker - spans all columns */}
          <div className="col-span-1 md:col-span-3 mt-2">
            <SystemCapabilityChecker
              webllmStatus={webllm.status}
              webllmError={webllm.error}
              onRecommendation={(backend) => {
                console.log('System recommends:', backend);
                // User can click to apply recommendation
              }}
            />
          </div>

          {/* Info box spans all columns */}
          <div className="col-span-1 md:col-span-3 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>
                These settings adjust stakeholder response thresholds and tone to better reflect your country's development stage and the personality of the stakeholder representative.
              </span>
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
