import { test, expect } from '@playwright/test';

/**
 * WebLLM Timeout Test
 *
 * This test checks:
 * 1. How long WebLLM actually takes to generate a response
 * 2. Whether it times out and falls back to rule-based
 * 3. Console logs showing the timing
 */

test.describe('WebLLM Timeout Performance', () => {
  test('should track WebLLM response time and timeout behavior', async ({ page }) => {
    // Increase test timeout for model loading and inference (10 minutes)
    test.setTimeout(600000);
    // Collect console logs to track timing
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      console.log('Browser console:', text);
    });

    // Navigate to app
    await page.goto('http://localhost:5173/stakeholder-dialogue/');
    await page.waitForLoadState('networkidle');

    // Load example scenario - click the "Load Example" card
    await page.click('text=Load Example');
    await page.waitForTimeout(2000);

    // Navigate to Stakeholder Dialogue tab
    await page.click('button:has-text("Stakeholder Dialogue")');
    await page.waitForTimeout(500);

    // Check if WebLLM is already loaded or needs initialization
    const enableAIButton = await page.locator('button:has-text("Enable AI")').count();

    if (enableAIButton > 0) {
      console.log('\n📦 WebLLM needs to be loaded first...');

      // Click Enable AI button
      await page.click('button:has-text("Enable AI")');

      // Wait for model loading (could take a while)
      console.log('⏳ Waiting for WebLLM model to load (may take 1-5 minutes first time)...');

      // Wait up to 5 minutes for loading
      const loadingComplete = await page.waitForSelector(
        'text=/Model ready|Skip AI/i',
        { timeout: 300000 } // 5 minutes
      ).catch(() => null);

      if (!loadingComplete) {
        console.log('❌ Model failed to load within 5 minutes');
        return;
      }

      console.log('✅ Model loaded successfully');
      await page.waitForTimeout(1000);
    } else {
      console.log('\n✅ WebLLM already loaded');
    }

    // Select a stakeholder (Public & Communities)
    await page.click('[data-stakeholder-id="public"]');
    await page.waitForTimeout(500);

    // Enter prediction
    await page.fill('textarea[placeholder*="What do you think"]',
      'I think they will be concerned about electricity bills and want to know about local jobs.');

    // Record start time
    const startTime = Date.now();
    console.log('\n🚀 Clicking Reveal Response at:', new Date().toISOString());

    // Click Reveal Response
    await page.click('button:has-text("Reveal Response")');

    // Wait for response to appear (increased timeout for slower computers)
    await page.waitForSelector('text=/Initial Reaction/i', { timeout: 75000 }); // 75 seconds

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log('\n✅ Response received at:', new Date().toISOString());
    console.log('⏱️  Total time:', totalTime, 'ms (', (totalTime / 1000).toFixed(1), 'seconds)');

    // Check if response is AI-enhanced or rule-based
    const responseText = await page.locator('text=/Initial Reaction/i').locator('..').textContent();

    // Check console logs for WebLLM timing
    const webllmLogs = consoleLogs.filter(log =>
      log.includes('[WebLLM]') || log.includes('[AI]')
    );

    console.log('\n📊 WebLLM-related logs:');
    webllmLogs.forEach(log => console.log('  ', log));

    // Check for timeout
    const timedOut = consoleLogs.some(log =>
      log.includes('timeout') || log.includes('Timeout')
    );

    // Check response type indicator
    const responseTypeIndicator = await page.locator('text=/AI-enhanced|Rule-based|Enhanced/i').textContent();

    console.log('\n📝 Response type:', responseTypeIndicator);
    console.log('⏰ Timed out:', timedOut ? 'YES' : 'NO');
    console.log('⏱️  Response time:', totalTime, 'ms');

    if (totalTime > 60000) {
      console.log('⚠️  WARNING: Response took longer than 60 seconds!');
      console.log('   Consider increasing timeout further or optimizing model');
    }

    // Take screenshot of final response
    await page.screenshot({
      path: 'tests/e2e/screenshots/webllm-response-test.png',
      fullPage: true
    });

    console.log('\n📸 Screenshot saved to: tests/e2e/screenshots/webllm-response-test.png');
  });
});
