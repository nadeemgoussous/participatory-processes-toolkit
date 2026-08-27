import { chromium } from '@playwright/test';
import type { FullConfig } from '@playwright/test';

// Playwright's webServer check only waits for the dev server to answer. Vite
// answers immediately and *then* pre-bundles dependencies, aborting requests
// that are in flight while it does ("optimized deps changed, reloading"). With
// several workers starting at once that surfaces as net::ERR_ABORTED in
// whichever specs happen to run first.
//
// Loading the app once here absorbs that, so the suite starts against a warm
// server.
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL;
  if (!baseURL) return;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        await page.goto(baseURL, { waitUntil: 'load', timeout: 60_000 });
        // Wait for React to mount, not just for the HTML shell.
        await page.locator('#root > *').first().waitFor({ timeout: 60_000 });
        return;
      } catch (error) {
        if (attempt === 3) throw error;
      }
    }
  } finally {
    await browser.close();
  }
}
