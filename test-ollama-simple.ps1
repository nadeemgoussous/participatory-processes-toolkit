# Test Unified Prompts with Ollama
Write-Host "Testing Unified Prompts with Ollama" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$ollamaUrl = "http://localhost:11434/api/generate"
$model = "smollm2:1.7b"
$temperature = 0.5
$numPredict = 600

# Build the prompt using the same structure as WebLLM
$promptText = "You are Policy Makers & Regulators.`n`n"
$promptText += "Example 1: Saudi Arabia plans 60% renewable by 2030. Response: This is a bold step toward diversifying our energy mix.`n`n"
$promptText += "Example 2: Costa Rica maintains 99% renewable. Response: Costa Ricas renewable success is exceptional.`n`n"
$promptText += "---END OF EXAMPLES---`n`n"
$promptText += "Now respond to this NEW scenario for ScenarioLand:`n"
$promptText += "- 82% renewable energy by 2030`n"
$promptText += "- Key concerns: Energy security, Policy coherence`n`n"
$promptText += "IMPORTANT: Do NOT repeat the examples above. Write a NEW, ORIGINAL response.`n"
$promptText += "Write 2-3 sentences. Output ONLY your response.`n`n"
$promptText += "Positive aspects: High renewable penetration supports climate goals`n"
$promptText += "Concerns: Grid stability with 82% variable renewables`n`n"
$promptText += "Write your response now."

Write-Host "PROMPT:" -ForegroundColor Yellow
Write-Host $promptText
Write-Host ""

Write-Host "CONFIG: model=$model, temp=$temperature, tokens=$numPredict" -ForegroundColor Yellow
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

Write-Host "Calling Ollama..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $ollamaUrl -Method Post -Body $body -ContentType "application/json"
    $responseText = $response.response.Trim()

    Write-Host ""
    Write-Host "RESPONSE:" -ForegroundColor Green
    Write-Host "=========" -ForegroundColor Green
    Write-Host $responseText
    Write-Host ""

    Write-Host "ANALYSIS:" -ForegroundColor Magenta
    $sentenceCount = ($responseText -split '[.!?]' | Where-Object { $_.Trim() -ne "" }).Count
    Write-Host "  Sentences: $sentenceCount (target: 2-3)" -ForegroundColor Cyan

    if ($responseText -match "Voice:|Examples:|Scenario:|Write your response") {
        Write-Host "  ❌ ECHO DETECTED!" -ForegroundColor Red
    } else {
        Write-Host "  ✅ No echo detected" -ForegroundColor Green
    }

    if ($responseText -match "\bwe\b|\bour\b") {
        Write-Host "  ✅ First-person voice" -ForegroundColor Green
    }

    if ($response.total_duration) {
        $durationSec = [math]::Round($response.total_duration / 1000000000, 1)
        Write-Host "  ⏱️  Time: $durationSec seconds" -ForegroundColor Cyan
    }

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure Ollama is running!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Cyan
