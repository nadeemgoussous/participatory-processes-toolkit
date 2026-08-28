import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// `npm run build:offline` produces a single self-contained index.html that a
// browser runs straight off the filesystem. The normal build cannot do this:
// a file:// page has origin 'null', so its module script and stylesheet are
// blocked by CORS and nothing renders. This test is what keeps that build
// honest.

const offlineIndex = resolve('dist-offline/index.html');

test.describe('Opening the offline build from the filesystem', () => {
  test.skip(!existsSync(offlineIndex), 'run npm run build:offline first');

  test('renders, styles and navigates with no server', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

    await page.goto(pathToFileURL(offlineIndex).href);

    await expect(page.getByRole('banner')).toContainText(
      'Participatory processes for strategic energy planning'
    );
    await expect(
      page.getByRole('heading', { name: 'Participation plan', level: 1 })
    ).toBeVisible();

    // The stylesheet has to have applied, not just the markup rendered.
    const background = await page
      .getByRole('banner')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(background).toBe('rgb(0, 120, 167)');

    const nav = page.getByRole('navigation', { name: 'Sections' });
    await nav.getByRole('button', { name: 'Engagement tools' }).click();
    await page.getByRole('button', { name: 'By category' }).click();
    await page.getByRole('button', { name: 'Workshops', exact: true }).click();
    await expect(
      page.getByText(/In all cases, it is important to map the required stakeholders/)
    ).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('keeps a plan across a reload with no server', async ({ page }) => {
    await page.goto(pathToFileURL(offlineIndex).href);

    await page
      .getByRole('button', { name: 'Surveys and public consultations', exact: true })
      .click();

    const item = page
      .locator('li')
      .filter({ hasText: 'The preparation phase should include defining' })
      .first();
    await item.getByRole('checkbox').check();
    await item.getByRole('textbox').fill('Agreed with the planning team.');

    await page.reload();

    const reloaded = page
      .locator('li')
      .filter({ hasText: 'The preparation phase should include defining' })
      .first();
    await expect(reloaded.getByRole('checkbox')).toBeChecked();
    await expect(reloaded.getByRole('textbox')).toHaveValue('Agreed with the planning team.');
  });
});
