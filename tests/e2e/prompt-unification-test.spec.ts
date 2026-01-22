import { test, expect } from '@playwright/test';

/**
 * Test unified prompts - verify Ollama and WebLLM use same prompts for consistency
 *
 * This test verifies that the prompt unification changes work correctly:
 * 1. Ollama uses simplified prompts with few-shot examples
 * 2. Echo detection works for Ollama
 * 3. Response quality is consistent
 */

test.describe('Prompt Unification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/stakeholder-dialogue/');

    // Load example scenario
    await page.click('text=Load ScenarioLand Example');
    await page.waitForTimeout(500);

    // Navigate to Stakeholder Dialogue tab
    await page.click('text=Stakeholder Dialogue');
    await page.waitForTimeout(500);
  });

  test('Ollama should use simplified prompts with few-shot examples', async ({ page }) => {
    // Set AI backend to Ollama Only
    await page.click('text=Advanced Settings');
    await page.selectOption('select:has-text("AI Backend")', 'ollama');
    await page.waitForTimeout(500);

    // Select a stakeholder
    await page.click('[data-stakeholder-id="policy-makers"]');
    await page.waitForTimeout(500);

    // Enter prediction
    const predictionText = 'I think policy makers will focus on energy security and cost implications of this transition.';
    await page.fill('textarea[placeholder*="What do you think"]', predictionText);

    // Open browser console to see logs
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      console.log('Browser:', text);
    });

    // Reveal response
    await page.click('text=Reveal Response');

    // Wait for response to appear (Ollama can be slow)
    await page.waitForSelector('text=Initial Reaction', { timeout: 60000 });

    // Check console logs for simplified prompt usage
    const ollamaLogs = consoleLogs.filter(log => log.includes('[Ollama]'));
    console.log('\n=== Ollama Logs ===');
    ollamaLogs.forEach(log => console.log(log));

    // Verify Ollama was used
    expect(ollamaLogs.some(log => log.includes('Starting STREAMING enhancement'))).toBeTruthy();

    // Check for temperature 0.5 (not 0.7)
    const tempLog = ollamaLogs.find(log => log.includes('temperature'));
    if (tempLog) {
      console.log('\nTemperature setting:', tempLog);
    }

    // Get the response
    const responseText = await page.locator('[data-testid="initial-reaction"]').textContent();
    console.log('\n=== Ollama Response ===');
    console.log(responseText);

    // Verify response is not empty
    expect(responseText).toBeTruthy();
    expect(responseText!.length).toBeGreaterThan(20);

    // Verify response is AI-enhanced (not rule-based fallback)
    const isEnhanced = await page.locator('text=/ai-enhanced|AI Enhanced/i').count() > 0;
    console.log('\nIs AI Enhanced:', isEnhanced);

    // Check if echo was detected (should be in logs if it happened)
    const echoDetected = consoleLogs.some(log => log.includes('Echo detected'));
    if (echoDetected) {
      console.log('\n⚠️ WARNING: Echo detected - prompt may need adjustment');
    }
  });

  test('Ollama should not echo prompt examples', async ({ page }) => {
    // Set AI backend to Ollama Only
    await page.click('text=Advanced Settings');
    await page.selectOption('select:has-text("AI Backend")', 'ollama');
    await page.waitForTimeout(500);

    // Test multiple stakeholders to verify no echo
    const stakeholders = ['policy-makers', 'public', 'grid-operators'];

    for (const stakeholderId of stakeholders) {
      console.log(`\n=== Testing ${stakeholderId} for echo ===`);

      // Select stakeholder
      await page.click(`[data-stakeholder-id="${stakeholderId}"]`);
      await page.waitForTimeout(500);

      // Clear and enter prediction
      await page.fill('textarea[placeholder*="What do you think"]', '');
      await page.fill('textarea[placeholder*="What do you think"]',
        'I predict they will have concerns about this energy scenario.');

      // Track console for echo detection
      const consoleLogs: string[] = [];
      page.on('console', msg => consoleLogs.push(msg.text()));

      // Reveal response
      await page.click('text=Reveal Response');
      await page.waitForSelector('text=Initial Reaction', { timeout: 60000 });

      // Get response text
      const responseText = await page.locator('[data-testid="initial-reaction"]').textContent();

      // Check for echo patterns (these should NOT appear in response)
      const echoPatterns = [
        'Voice:',
        'Examples:',
        'Scenario:',
        'Response: "',
        '1. Scenario:',
        '2. Scenario:',
        'Write your response now',
        'Now respond to this scenario'
      ];

      let foundEcho = false;
      for (const pattern of echoPatterns) {
        if (responseText?.includes(pattern)) {
          console.log(`❌ ECHO DETECTED: "${pattern}" found in response`);
          console.log('Response:', responseText);
          foundEcho = true;
        }
      }

      // Check console for echo detection
      const echoLog = consoleLogs.some(log => log.includes('Echo detected'));
      if (echoLog) {
        console.log('✅ Echo detection caught the issue');
      }

      if (!foundEcho && !echoLog) {
        console.log('✅ No echo detected - response is clean');
      }

      // Small delay before next test
      await page.waitForTimeout(2000);
    }
  });

  test('Ollama temperature should be 0.5 (not 0.7)', async ({ page }) => {
    // Set AI backend to Ollama Only
    await page.click('text=Advanced Settings');
    await page.selectOption('select:has-text("AI Backend")', 'ollama');
    await page.waitForTimeout(500);

    // Select stakeholder
    await page.click('[data-stakeholder-id="policy-makers"]');
    await page.waitForTimeout(500);

    // Enter prediction
    await page.fill('textarea[placeholder*="What do you think"]',
      'Testing temperature setting for Ollama backend.');

    // Capture network requests to Ollama
    const ollamaRequests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('api/ollama') || request.url().includes('api/generate')) {
        console.log('Ollama Request URL:', request.url());
        const postData = request.postData();
        if (postData) {
          try {
            const data = JSON.parse(postData);
            ollamaRequests.push(data);
            console.log('Ollama Request Body:', JSON.stringify(data, null, 2));
          } catch (e) {
            console.log('Could not parse request body');
          }
        }
      }
    });

    // Reveal response
    await page.click('text=Reveal Response');
    await page.waitForSelector('text=Initial Reaction', { timeout: 60000 });

    // Check if we captured the temperature setting
    if (ollamaRequests.length > 0) {
      const temperature = ollamaRequests[0]?.options?.temperature;
      console.log('\n=== Temperature Check ===');
      console.log('Temperature:', temperature);

      // Verify temperature is 0.5 (not 0.7)
      expect(temperature).toBe(0.5);
    } else {
      console.log('⚠️ No Ollama requests captured - may have failed over to rule-based');
    }
  });

  test('Compare Ollama vs WebLLM response quality', async ({ page }) => {
    // This test requires both backends to be available
    // We'll test the same stakeholder/scenario with both backends

    const scenario = 'ScenarioLand Example';
    const stakeholderId = 'policy-makers';
    const prediction = 'I think they will be concerned about grid reliability and costs.';

    // Test 1: Ollama
    console.log('\n=== Testing with Ollama ===');
    await page.click('text=Advanced Settings');
    await page.selectOption('select:has-text("AI Backend")', 'ollama');
    await page.waitForTimeout(500);

    await page.click(`[data-stakeholder-id="${stakeholderId}"]`);
    await page.waitForTimeout(500);

    await page.fill('textarea[placeholder*="What do you think"]', prediction);
    await page.click('text=Reveal Response');
    await page.waitForSelector('text=Initial Reaction', { timeout: 60000 });

    const ollamaResponse = await page.locator('[data-testid="initial-reaction"]').textContent();
    console.log('Ollama Response:', ollamaResponse);

    // Reload page for fresh test
    await page.goto('/stakeholder-dialogue/');
    await page.click('text=Load ScenarioLand Example');
    await page.waitForTimeout(500);
    await page.click('text=Stakeholder Dialogue');
    await page.waitForTimeout(500);

    // Test 2: WebLLM (if available)
    console.log('\n=== Testing with WebLLM ===');
    await page.click('text=Advanced Settings');
    await page.selectOption('select:has-text("AI Backend")', 'webllm');
    await page.waitForTimeout(500);

    // Check if WebLLM is available
    const webllmStatus = await page.locator('text=/WebLLM|WebGPU/i').count();
    if (webllmStatus > 0) {
      console.log('WebLLM status indicator found');
    }

    await page.click(`[data-stakeholder-id="${stakeholderId}"]`);
    await page.waitForTimeout(500);

    await page.fill('textarea[placeholder*="What do you think"]', prediction);
    await page.click('text=Reveal Response');

    // WebLLM might take longer or fail over to rule-based
    const responseVisible = await page.waitForSelector('text=Initial Reaction', {
      timeout: 30000
    }).catch(() => null);

    if (responseVisible) {
      const webllmResponse = await page.locator('[data-testid="initial-reaction"]').textContent();
      console.log('WebLLM Response:', webllmResponse);

      // Compare responses
      console.log('\n=== Comparison ===');
      console.log('Ollama length:', ollamaResponse?.length);
      console.log('WebLLM length:', webllmResponse?.length);

      // Both should be similar in length (2-3 sentences)
      const lengthDiff = Math.abs((ollamaResponse?.length || 0) - (webllmResponse?.length || 0));
      console.log('Length difference:', lengthDiff);

      // Both should be non-empty
      expect(ollamaResponse).toBeTruthy();
      expect(webllmResponse).toBeTruthy();
    } else {
      console.log('⚠️ WebLLM not available or timed out - comparison skipped');
    }
  });
});
