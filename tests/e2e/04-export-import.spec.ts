import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.describe('Plan export and import', () => {
  test('exports the plan as JSON with ticks and notes', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('textbox', { name: 'Plan name' }).fill('Lesotho consultation');
    await page.getByRole('button', { name: 'Workshops', exact: true }).click();

    const item = page
      .locator('li')
      .filter({ hasText: 'Ensuring confidentiality when necessary is also vital for building trust in the process.' })
      .first();
    await item.getByRole('checkbox').check();
    await item.getByRole('textbox').fill('NDA drafted.');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^lesotho-consultation-\d{4}-\d{2}-\d{2}\.json$/);

    const path = await download.path();
    const plan = JSON.parse(readFileSync(path, 'utf8'));

    expect(plan.version).toBe(1);
    expect(plan.name).toBe('Lesotho consultation');
    expect(plan.setup.tools).toContain('workshops');

    const checked = Object.values(plan.items).filter(
      (i) => (i as { done: boolean }).done
    );
    expect(checked).toHaveLength(1);
    expect(plan.items['workshops-req-9']).toMatchObject({
      done: true,
      note: 'NDA drafted.',
    });
  });

  test('imports a plan and replaces what is on screen', async ({ page }) => {
    await page.goto('/');

    const plan = {
      version: 1,
      name: 'Imported plan',
      country: 'Ghana',
      setup: { phases: [], stakeholders: [], tools: ['surveys'], objectiveId: undefined },
      items: {
        'surveys-req-5': { done: true, note: 'Objectives agreed.', updatedAt: '' },
      },
      createdAt: '',
      updatedAt: '',
    };

    await page.getByRole('button', { name: 'Import' }).click();
    await page.locator('input[type="file"]').setInputFiles({
      name: 'plan.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(plan)),
    });

    await expect(page.getByRole('textbox', { name: 'Plan name' })).toHaveValue('Imported plan');
    await expect(page.getByRole('textbox', { name: 'Country' })).toHaveValue('Ghana');

    const item = page
      .locator('li')
      .filter({ hasText: 'The preparation phase should include defining' })
      .first();
    await expect(item.getByRole('checkbox')).toBeChecked();
    await expect(item.getByRole('textbox')).toHaveValue('Objectives agreed.');
  });

  test('rejects a file that is not a plan', async ({ page }) => {
    await page.goto('/');

    await page.locator('input[type="file"]').setInputFiles({
      name: 'notes.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify({ hello: 'world' })),
    });

    await expect(
      page.getByText('That file could not be read as a participation plan.')
    ).toBeVisible();
  });
});
