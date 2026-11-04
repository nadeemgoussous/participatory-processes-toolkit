import { test, expect } from '@playwright/test';

// Planner additions must never pass for publication text: each one carries the
// marker, each section opens with the notice, and both survive a reload.
const MARKER = 'Your addition · not part of the IRENA toolkit';

test.describe('Planner additions', () => {
  test('a custom stakeholder group is marked and persists', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Stakeholders', exact: true }).click();

    const section = page.locator('section', { has: page.locator('#custom-groups') });
    await expect(section.getByRole('note')).toContainText('Not part of the IRENA toolkit.');

    await section.getByLabel('Group name').fill('Electricity regulator');
    await section.getByRole('button', { name: 'Add group' }).click();

    const card = section.locator('li', { hasText: 'Electricity regulator' });
    await expect(card).toContainText(MARKER);

    await page.reload();
    await page.getByRole('button', { name: 'Stakeholders', exact: true }).click();
    await expect(page.locator('li', { hasText: 'Electricity regulator' })).toContainText(MARKER);
  });

  test('a custom checklist item is marked, sits apart, and can be ticked', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section', { has: page.locator('#own-items') });
    await expect(section.getByRole('note')).toContainText('Not part of the IRENA toolkit.');

    await section.getByLabel('Item').fill('Book the venue for the validation workshop');
    // Phase buttons sit inside the form; choosing one must not submit it.
    await section.getByRole('button', { name: 'Validation' }).click();
    await section.getByLabel('Stakeholder group (optional)').selectOption({ label: 'General Public and Local Communities' });
    await section.getByRole('button', { name: 'Add item' }).click();

    const item = section.locator('li', { hasText: 'Book the venue for the validation workshop' });
    await expect(item).toContainText(MARKER);
    await expect(item).toContainText('Validation');
    await expect(item).toContainText('General Public and Local Communities');
    await item.getByRole('checkbox').check();

    await page.reload();
    const reloaded = page
      .locator('section', { has: page.locator('#own-items') })
      .locator('li', { hasText: 'Book the venue for the validation workshop' });
    await expect(reloaded.getByRole('checkbox')).toBeChecked();

    await reloaded.getByRole('button', { name: 'Remove' }).click();
    await expect(page.getByText('Book the venue for the validation workshop')).toHaveCount(0);
  });

  test('a custom tool is marked, linkable from an item, and its removal keeps the item', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Engagement tools', exact: true }).click();

    const tools = page.locator('section', { has: page.locator('#custom-tools') });
    await expect(tools.getByRole('note')).toContainText('Not part of the IRENA toolkit.');
    await tools.getByLabel('Tool or activity').fill('Community radio phone-in');
    await tools.getByRole('button', { name: 'Communication' }).click();
    await tools.getByRole('button', { name: 'Add tool' }).click();

    const card = tools.locator('li', { hasText: 'Community radio phone-in' });
    await expect(card).toContainText(MARKER);
    await expect(card).toContainText('Communication');

    await page.getByRole('button', { name: 'Plan', exact: true }).click();
    const items = page.locator('section', { has: page.locator('#own-items') });
    await items.getByLabel('Item').fill('Agree the call-in schedule with the station');
    await items
      .getByLabel('Engagement tool (optional)')
      .selectOption({ label: 'Community radio phone-in (your tool)' });
    await items.getByRole('button', { name: 'Add item' }).click();
    const item = items.locator('li', { hasText: 'Agree the call-in schedule' });
    await expect(item).toContainText('Community radio phone-in');

    await page.getByRole('button', { name: 'Engagement tools', exact: true }).click();
    await page.getByRole('button', { name: 'Remove Community radio phone-in' }).click();

    await page.getByRole('button', { name: 'Plan', exact: true }).click();
    const orphan = page
      .locator('section', { has: page.locator('#own-items') })
      .locator('li', { hasText: 'Agree the call-in schedule' });
    await expect(orphan).toBeVisible();
    await expect(orphan).not.toContainText('Community radio phone-in');
  });

  test('a custom case study is marked and kept out of the chapter 5 table', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Case studies', exact: true }).click();

    const cases = page.locator('section', { has: page.locator('#custom-cases') });
    await expect(cases.getByRole('note')).toContainText('Not part of the IRENA toolkit.');
    await cases.getByLabel('Country or institution').fill('Ruritania 2024 NDC update');
    await cases.getByLabel(/Methods used/).fill('Regional town halls');
    await cases.getByRole('button', { name: 'Add case study' }).click();

    const card = cases.locator('li', { hasText: 'Ruritania 2024 NDC update' });
    await expect(card).toContainText(MARKER);
    await expect(card).toContainText('Regional town halls');
    await expect(page.locator('table')).not.toContainText('Ruritania');
  });
});
