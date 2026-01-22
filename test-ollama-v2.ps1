# Test Unified Prompts v2 - Better format for Ollama generate endpoint
Write-Host "Testing Unified Prompts v2 with Ollama" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$ollamaUrl = "http://localhost:11434/api/generate"
$model = "smollm2:1.7b"
$temperature = 0.5
$numPredict = 200  # Shorter for focused 2-3 sentence response

# Better prompt structure for Ollama's generate endpoint
# More explicit about generating vs echoing
$promptText = @"
You are a Policy Maker reviewing an energy scenario.

EXAMPLES OF YOUR VOICE:
- "This represents a significant policy shift that requires careful coordination across ministries."
- "We need detailed implementation roadmaps to ensure this aligns with our national energy strategy."

YOUR TASK:
Scenario: ScenarioLand plans 82% renewable energy by 2030.
Key concerns: Energy security, Policy coherence
Positive: Supports climate goals, creates jobs
Concerns: Grid stability with high variable renewables

IMPORTANT: Generate a FIRST-PERSON response (use 'we', 'our') from the policy maker's perspective.
Do NOT repeat the examples. Do NOT echo the scenario details.
Write 2-3 original sentences expressing the policy maker's view.

YOUR RESPONSE:
"@

Write-Host "PROMPT:" -ForegroundColor Yellow
Write-Host $promptText
Write-Host ""

$body = @{
    model = $model
    prompt = $promptText
    stream = $false
    options = @{
        temperature = $temperature
        num_predict = $numPredict
    }
} | ConvertTo-Json -Depth 10

Write-Host "Calling Ollama (temp=$temperature, tokens=$numPredict)..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $ollamaUrl -Method Post -Body $body -ContentType "application/json"
    $responseText = $response.response.Trim()

    Write-Host ""
    Write-Host "RESPONSE:" -ForegroundColor Green
    Write-Host "=========" -ForegroundColor Green
    Write-Host $responseText
    Write-Host ""

    Write-Host "ANALYSIS:" -ForegroundColor Magenta

    # Check for echo (repeating scenario details)
    if ($responseText -match "82%|ScenarioLand|Grid stability|variable renewables") {
        Write-Host "  ❌ ECHO: Response contains scenario details!" -ForegroundColor Red
    } else {
        Write-Host "  ✅ No echo of scenario details" -ForegroundColor Green
    }

    # Check for prompt artifacts
    if ($responseText -match "Voice:|Examples:|YOUR RESPONSE|IMPORTANT") {
        Write-Host "  ❌ ECHO: Response contains prompt text!" -ForegroundColor Red
    } else {
        Write-Host "  ✅ No prompt artifacts" -ForegroundColor Green
    }

    # Check first-person voice
    if ($responseText -match "\bwe\b|\bour\b|\bus\b") {
        Write-Host "  ✅ First-person voice (we/our/us)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  May be missing first-person voice" -ForegroundColor Yellow
    }

    # Check length
    $words = ($responseText -split '\s+').Count
    Write-Host "  📏 Words: $words (target: 40-80 for 2-3 sentences)" -ForegroundColor Cyan

    if ($response.total_duration) {
        $durationSec = [math]::Round($response.total_duration / 1000000000, 1)
        Write-Host "  ⏱️  Time: $durationSec seconds" -ForegroundColor Cyan
    }

    Write-Host ""
    if ($responseText -notmatch "82%|ScenarioLand" -and $responseText -match "\bwe\b|\bour\b") {
        Write-Host "VERDICT: ✅ GOOD - Response is original and in first-person" -ForegroundColor Green
    } else {
        Write-Host "VERDICT: ❌ NEEDS WORK - Response has echo or voice issues" -ForegroundColor Red
    }

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan
