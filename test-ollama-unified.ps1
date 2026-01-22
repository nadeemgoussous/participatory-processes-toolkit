# Test Unified Prompts with Ollama
# This script tests that Ollama now uses the same simplified prompts as WebLLM

Write-Host "Testing Unified Prompts with Ollama" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Test configuration
$ollamaUrl = "http://localhost:11434/api/generate"
$model = "smollm2:1.7b"
$temperature = 0.5  # NEW: Lowered from 0.7
$numPredict = 600   # NEW: Increased from 400

# Few-shot example for Policy Makers (simplified)
$fewShotExample = @'
**Example 1:**
Scenario: Saudi Arabia plans 60% renewable energy by 2030.
Response: "This is a bold step toward diversifying our energy mix. We'll need clear implementation timelines and mechanisms to ensure grid reliability as we scale up intermittent renewables."

**Example 2:**
Scenario: Costa Rica maintains 99% renewable electricity through 2030.
Response: "Costa Rica's renewable success is exceptional. The key question is whether this model can scale to larger economies with different resource profiles and industrial demands."
'@

# Simplified system prompt (SAME AS WEBLLM)
$systemPrompt = @"
You are Policy Makers & Regulators.

$fewShotExample
---END OF EXAMPLES---

Now respond to this NEW scenario for ScenarioLand:
- 82.0% renewable energy by 2030
- Key concerns: Energy security, Policy coherence

IMPORTANT: Do NOT repeat the examples above. Write a NEW, ORIGINAL response.
Write 2-3 sentences as Policy Makers & Regulators. Match the voice and style but create NEW content.
Output ONLY your response - no labels, no 'Voice:', no 'Examples:'.
"@

# User prompt (context from rule-based response)
$userPrompt = @"
Positive aspects: High renewable penetration supports climate goals; Significant job creation expected
Their concerns: Grid stability with 82% variable renewables; Transmission infrastructure adequacy

Write your response now.
"@

# Combined prompt
$fullPrompt = "$systemPrompt`n`n$userPrompt"

Write-Host "SYSTEM PROMPT:" -ForegroundColor Yellow
Write-Host $systemPrompt
Write-Host ""
Write-Host "USER PROMPT:" -ForegroundColor Yellow
Write-Host $userPrompt
Write-Host ""
Write-Host "CONFIGURATION:" -ForegroundColor Yellow
Write-Host "  Model: $model"
Write-Host "  Temperature: $temperature (was 0.7 before unification)"
Write-Host "  Max Tokens: $numPredict (was 400 before unification)"
Write-Host ""

# Create request body
$body = @{
    model = $model
    prompt = $fullPrompt
    stream = $false  # Non-streaming for easier testing
    options = @{
        temperature = $temperature
        num_predict = $numPredict
    }
} | ConvertTo-Json -Depth 10

Write-Host "Calling Ollama API..." -ForegroundColor Cyan
Write-Host ""

try {
    # Make request
    $response = Invoke-RestMethod -Uri $ollamaUrl -Method Post -Body $body -ContentType "application/json"

    $responseText = $response.response.Trim()

    Write-Host "RESPONSE:" -ForegroundColor Green
    Write-Host "=========" -ForegroundColor Green
    Write-Host $responseText
    Write-Host ""

    Write-Host "ANALYSIS:" -ForegroundColor Magenta
    Write-Host "=========" -ForegroundColor Magenta

    # Check for echo patterns (should NOT be present)
    $echoPatterns = @(
        "Voice:",
        "Examples:",
        "Scenario:",
        "Response: `"",
        "1. Scenario:",
        "2. Scenario:",
        "Write your response now",
        "Now respond to this scenario"
    )

    $foundEcho = $false
    foreach ($pattern in $echoPatterns) {
        if ($responseText -like "*$pattern*") {
            Write-Host "  ❌ ECHO DETECTED: '$pattern' found in response!" -ForegroundColor Red
            $foundEcho = $true
        }
    }

    if (-not $foundEcho) {
        Write-Host "  ✅ No echo detected - response is clean" -ForegroundColor Green
    }

    # Check response length
    $sentenceCount = ($responseText -split '[.!?]' | Where-Object { $_.Trim() -ne "" }).Count
    Write-Host "  📏 Sentence count: $sentenceCount (target: 2-3)" -ForegroundColor Cyan

    if ($sentenceCount -ge 2 -and $sentenceCount -le 4) {
        Write-Host "  ✅ Length is appropriate" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Length may need adjustment" -ForegroundColor Yellow
    }

    # Check for first-person voice (should be "we", not "they")
    if ($responseText -like "*we *" -or $responseText -like "*our *") {
        Write-Host "  ✅ Uses first-person voice (correct)" -ForegroundColor Green
    } elseif ($responseText -like "*they *" -or $responseText -like "*their *") {
        Write-Host "  ❌ Uses third-person voice (incorrect)" -ForegroundColor Red
    }

    # Check inference timing
    if ($response.total_duration) {
        $durationSec = [math]::Round($response.total_duration / 1000000000, 1)
        Write-Host "  ⏱️  Inference time: $durationSec seconds" -ForegroundColor Cyan
    }

    Write-Host ""
    Write-Host "VERDICT:" -ForegroundColor Yellow
    Write-Host "========" -ForegroundColor Yellow

    if (-not $foundEcho -and $sentenceCount -ge 2 -and $sentenceCount -le 4) {
        Write-Host "  ✅ PASS: Response quality is good!" -ForegroundColor Green
        Write-Host "  Unified prompts are working correctly." -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  NEEDS REVIEW: Response may need adjustment" -ForegroundColor Yellow
    }

} catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "Make sure Ollama is running: ollama serve" -ForegroundColor Yellow
    Write-Host "Make sure smollm2:1.7b is pulled: ollama pull smollm2:1.7b" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Cyan
