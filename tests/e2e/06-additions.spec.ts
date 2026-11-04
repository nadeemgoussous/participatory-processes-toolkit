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
});
