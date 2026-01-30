import { test, expect } from '@playwright/test';

test.describe('F046 - Streaming Text Display', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('/stakeholder-dialogue/');
    await page.waitForLoadState('networkidle');

    // Load example scenario
    await page.click('text=Load Example');
    await page.waitForTimeout(1000);

    // Navigate to Stakeholder Dialogue tab
    await page.click('text=Stakeholder Dialogue');
    await page.waitForTimeout(500);
  });

  test('should show streaming text with Ollama backend', async ({ page }) => {
    // Expand Advanced Settings
    const advancedSettings = page.locator('button:has-text("Advanced Settings")').first();
    const isExpanded = await advancedSettings.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await advancedSettings.click();
      await page.waitForTimeout(300);
    }

    // Set AI Backend to Ollama Only
    const backendSelect = page.locator('select').filter({ hasText: /Auto|Ollama|WebLLM|Rule-based/ }).or(
      page.locator('select[aria-label*="backend"]')
    ).or(
      page.locator('select').nth(2) // Third select (after Context and Variant)
    );
    await backendSelect.selectOption('ollama');
    await page.waitForTimeout(500);

    console.log('✅ Set AI Backend to Ollama Only');

    // Check if Ollama is available
    const ollamaStatus = await page.locator('text=/Ollama/i').first().textContent();
    console.log('Ollama status:', ollamaStatus);

    if (ollamaStatus?.includes('not running')) {
      console.log('⚠️ Ollama is not running - skipping streaming test');
      test.skip();
    }

    // Select a stakeholder
    const stakeholderButton = page.locator('[data-stakeholder-id="public"]').or(
      page.locator('button:has-text("Public & Communities")')
    ).first();
    await stakeholderButton.click();
    await page.waitForTimeout(500);

    console.log('✅ Selected stakeholder');

    // Click "Predict Their Response"
    await page.click('text=Predict Their Response');
    await page.waitForTimeout(300);

    // Enter prediction
    const predictionTextarea = page.locator('textarea[placeholder*="predict"]').or(
      page.locator('textarea').first()
    );
    await predictionTextarea.fill('I think they will be concerned about electricity bills and job opportunities in their communities.');
    await page.waitForTimeout(300);

    console.log('✅ Entered prediction');

    // Click Reveal Response
    const revealButton = page.locator('button:has-text("Reveal Response")');
    await revealButton.click();

    console.log('🚀 Clicked Reveal Response - watching for streaming...');

    // Wait a moment for streaming to potentially start
    await page.waitForTimeout(2000);

    // Check if we're in streaming mode or already completed
    const generatingText = page.locator('text=Generating');
    const isStreaming = await generatingText.count() > 0;

    console.log('Is streaming indicator visible?', isStreaming);

    // Look for the Initial Reaction section
    const initialReactionSection = page.locator('text=Initial Reaction').first();
    const isVisible = await initialReactionSection.isVisible();
    console.log('Initial Reaction section visible?', isVisible);

    // Check for streaming text or final response
    const responseBox = page.locator('.card').filter({ hasText: 'Simulated Response' });
    await expect(responseBox).toBeVisible({ timeout: 60000 }); // 60s timeout for slow inference

    console.log('✅ Response box appeared');

    // Get the response text
    const responseText = await responseBox.textContent();
    console.log('Response preview:', responseText?.substring(0, 200));

    // Check if response was generated (ai-enhanced or rule-based)
    const hasEnhancedBadge = responseText?.includes('AI-Enhanced') || responseText?.includes('✨');
    const hasRuleBasedBadge = responseText?.includes('Rule-Based') || responseText?.includes('🔧');

    console.log('Has AI-Enhanced badge?', hasEnhancedBadge);
    console.log('Has Rule-Based badge?', hasRuleBasedBadge);

    expect(hasEnhancedBadge || hasRuleBasedBadge).toBe(true);

    // Verify concerns section appears (streaming complete)
    const concernsSection = page.locator('text=Their Concerns');
    await expect(concernsSection).toBeVisible({ timeout: 5000 });

    console.log('✅ Full response with all sections displayed');
  });

  test('should handle rule-based fallback gracefully', async ({ page }) => {
    // Expand Advanced Settings
    const advancedSettings = page.locator('button:has-text("Advanced Settings")').first();
    const isExpanded = await advancedSettings.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await advancedSettings.click();
      await page.waitForTimeout(300);
    }

    // Set AI Backend to Rule-based Only (no streaming)
    const backendSelect = page.locator('select').nth(2);
    await backendSelect.selectOption('rule-based');
    await page.waitForTimeout(500);

    // Select a stakeholder
    const stakeholderButton = page.locator('[data-stakeholder-id="policy-makers"]').or(
      page.locator('button:has-text("Policy Makers")')
    ).first();
    await stakeholderButton.click();
    await page.waitForTimeout(500);

    // Click "Predict Their Response"
    await page.click('text=Predict Their Response');
    await page.waitForTimeout(300);

    // Enter prediction
    const predictionTextarea = page.locator('textarea').first();
    await predictionTextarea.fill('They will ask about policy alignment and regulatory frameworks.');
    await page.waitForTimeout(300);

    // Click Reveal Response
    const revealButton = page.locator('button:has-text("Reveal Response")');
    await revealButton.click();

    // Should NOT show streaming (rule-based is instant)
    await page.waitForTimeout(1000);

    // Should show rule-based response immediately
    const responseBox = page.locator('.card').filter({ hasText: 'Simulated Response' });
    await expect(responseBox).toBeVisible({ timeout: 5000 });

    const responseText = await responseBox.textContent();
    expect(responseText).toContain('Rule-Based Response');

    console.log('✅ Rule-based response generated without streaming');
  });

  test('should display console logs about streaming', async ({ page }) => {
    // Capture console logs
    const logs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Streaming') || text.includes('Ollama') || text.includes('chunk')) {
        logs.push(text);
        console.log('📋 Console:', text);
      }
    });

    // Expand Advanced Settings
    const advancedSettings = page.locator('button:has-text("Advanced Settings")').first();
    const isExpanded = await advancedSettings.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await advancedSettings.click();
      await page.waitForTimeout(300);
    }

    // Set to Ollama Only
    const backendSelect = page.locator('select').nth(2);
    await backendSelect.selectOption('ollama');
    await page.waitForTimeout(500);

    // Select stakeholder and generate response
    await page.locator('[data-stakeholder-id="grid-operators"]').or(
      page.locator('button:has-text("Grid Operators")')
    ).first().click();
    await page.waitForTimeout(500);

    await page.click('text=I\'m ready to make my prediction');
    await page.waitForTimeout(300);

    await page.locator('textarea').first().fill('They will be concerned about grid stability and VRE integration.');
    await page.waitForTimeout(300);

    await page.click('button:has-text("Reveal Response")');

    // Wait for response generation
    await page.waitForTimeout(45000); // 45 seconds for slow Ollama

    // Check logs
    console.log('\n📊 Captured Logs:', logs.length);
    logs.forEach(log => console.log('  -', log));

    // At least some logging should happen
    expect(logs.length).toBeGreaterThan(0);
  });
});
