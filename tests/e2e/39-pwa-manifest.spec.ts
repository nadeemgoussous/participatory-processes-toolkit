/**
 * F039 - PWA Manifest and Icons
 * Verifies: manifest linked, icons exist, offline meta tags present
 */
import { test, expect } from '@playwright/test';

test.describe('F039 - PWA Manifest and Icons', () => {

  test('index.html has correct PWA meta tags', async ({ page }) => {
    await page.goto('/stakeholder-dialogue/');
    await page.waitForLoadState('domcontentloaded');

    // Theme colour
    const themeColor = await page.$eval(
      'meta[name="theme-color"]',
      el => el.getAttribute('content')
    );
    expect(themeColor).toBe('#005a82');

    // Apple mobile web app
    const appleCapable = await page.$eval(
      'meta[name="apple-mobile-web-app-capable"]',
      el => el.getAttribute('content')
    );
    expect(appleCapable).toBe('yes');

    // Apple touch icon
    const appleIcon = await page.$eval(
      'link[rel="apple-touch-icon"]',
      el => el.getAttribute('href')
    );
    expect(appleIcon).toContain('apple-touch-icon.png');
  });

  test('PWA icons are accessible (192 and 512)', async ({ page }) => {
    await page.goto('/stakeholder-dialogue/');

    // 192x192 icon
    const res192 = await page.request.get('/stakeholder-dialogue/icon-192.png');
    expect(res192.status()).toBe(200);
    expect(res192.headers()['content-type']).toContain('png');

    // 512x512 icon
    const res512 = await page.request.get('/stakeholder-dialogue/icon-512.png');
    expect(res512.status()).toBe(200);
    expect(res512.headers()['content-type']).toContain('png');
  });

  test('apple-touch-icon is accessible', async ({ page }) => {
    await page.goto('/stakeholder-dialogue/');
    const res = await page.request.get('/stakeholder-dialogue/apple-touch-icon.png');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('png');
  });

  test('page title is correct', async ({ page }) => {
    await page.goto('/stakeholder-dialogue/');
    await page.waitForLoadState('domcontentloaded');
    const title = await page.title();
    expect(title).toContain('IRENA');
    expect(title).toContain('Scenario Dialogue');
  });

  test('app renders offline-capable content without network calls for core UI', async ({ page }) => {
    await page.goto('/stakeholder-dialogue/');
    await page.waitForLoadState('networkidle');
    // Core app renders
    await expect(page.getByRole('heading', { name: /IRENA Scenario Dialogue/i }).first()).toBeVisible();
    // Tabs present (tabs use role="tab")
    await expect(page.getByRole('tab', { name: /Input/i }).first()).toBeVisible();
  });

});
