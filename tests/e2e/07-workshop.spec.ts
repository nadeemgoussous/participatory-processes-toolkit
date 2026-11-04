import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

const MARKER = 'Your addition · not part of the IRENA toolkit';

function planFile(overrides: Record<string, unknown>) {
  return {
    version: 1,
    name: '',
    country: '',
    setup: { phases: [], stakeholders: [], tools: [] },
    items: {},
    additions: { stakeholders: [], items: [], tools: [], caseStudies: [] },
    createdAt: '',
    updatedAt: '',
    ...overrides,
  };
}

async function load(page: Page, button: 'Import' | 'Merge', plan: object) {
  await page.getByRole('button', { name: button, exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles({
    name: 'plan.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(plan)),
  });
}

test.describe('Workshop features', () => {
  test('merging a plan keeps both sets of ticks, notes and additions', async ({ page }) => {
    await page.goto('/');

    await load(
      page,
      'Import',
      planFile({
        name: 'Table 1',
        setup: { phases: [], stakeholders: [], tools: ['surveys'] },
        items: { 'surveys-req-5': { done: false, note: 'Table 1 note.', updatedAt: '' } },
        additions: {
          stakeholders: [{ id: 'custom-a', name: 'Regulator', description: '' }],
          items: [],
          tools: [],
          caseStudies: [],
        },
      })
    );
    await expect(page.getByRole('textbox', { name: 'Plan name' })).toHaveValue('Table 1');

    await load(
      page,
      'Merge',
      planFile({
        name: 'Table 2',
        setup: { phases: [], stakeholders: [], tools: ['surveys', 'workshops'] },
        items: { 'surveys-req-5': { done: true, note: 'Table 2 note.', updatedAt: '' } },
        additions: {
          stakeholders: [
            { id: 'custom-a', name: 'Regulator', description: '' },
            { id: 'custom-b', name: 'Youth council', description: '' },
          ],
          items: [],
          tools: [],
          caseStudies: [],
        },
      })
    );

    // The plan on screen keeps its name; the incoming selections are added.
    await expect(page.getByRole('textbox', { name: 'Plan name' })).toHaveValue('Table 1');
    await expect(
      page.getByText(/In all cases, it is important to map the required stakeholders/)
    ).toBeVisible();

    const item = page
      .locator('li')
      .filter({ hasText: 'The preparation phase should include defining' })
      .first();
    await expect(item.getByRole('checkbox')).toBeChecked();
    await expect(item.getByRole('textbox')).toHaveValue('Table 1 note.\n\nTable 2 note.');

    // Additions are combined, without duplicating one exported by both tables.
    const chips = page.locator('fieldset', { hasText: 'Which stakeholder groups' });
    await expect(chips).toContainText(MARKER);
    await expect(chips.getByText('Regulator', { exact: true })).toHaveCount(1);
    await expect(chips.getByText('Youth council', { exact: true })).toHaveCount(1);
  });

  test('the printed plan restates the selection and includes every addition', async ({ page }) => {
    await page.goto('/');
    await load(
      page,
      'Import',
      planFile({
        name: 'Validation round',
        setup: { phases: ['validation'], stakeholders: ['grid-operators'], tools: [] },
        additions: {
          stakeholders: [],
          items: [],
          tools: [{ id: 'custom-t', name: 'Community radio phone-in', description: '', phases: [] }],
          caseStudies: [
            {
              id: 'custom-c',
              name: 'Ruritania 2024 NDC update',
              planningContext: '',
              primaryObjectives: '',
              methodsUsed: 'Regional town halls',
              resourceRequirements: '',
              transferableElements: '',
            },
          ],
        },
      })
    );

    const printed = page.locator('.print\\:block');
    await expect(printed.first()).toBeHidden();

    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('dd', { hasText: 'Grid Operators' })).toBeVisible();
    await expect(page.getByText('Validation round · ').or(page.getByText('Validation round', { exact: true }))).toBeVisible();
    const tools = page.locator('section', { has: page.locator('#print-tools') });
    await expect(tools).toBeVisible();
    await expect(tools).toContainText('Community radio phone-in');
    await expect(tools).toContainText(MARKER);
    const cases = page.locator('section', { has: page.locator('#print-cases') });
    await expect(cases).toContainText('Regional town halls');
    await expect(cases.getByRole('note')).toContainText('Not part of the IRENA toolkit.');
  });

  test('case studies filter by engagement tool and stakeholder group', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Case studies', exact: true }).click();

    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(13);

    await page.getByLabel('Engagement tool').selectOption({ label: 'Surveys and public consultations' });
    const withTool = await rows.count();
    expect(withTool).toBeGreaterThan(0);
    expect(withTool).toBeLessThan(13);

    await page.getByLabel('Stakeholder group').selectOption({ index: 1 });
    expect(await rows.count()).toBeLessThanOrEqual(withTool);

    await page.getByLabel('Engagement tool').selectOption({ label: 'All' });
    await page.getByLabel('Stakeholder group').selectOption({ label: 'All' });
    await expect(rows).toHaveCount(13);
  });
});
