import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('loads and shows the four sections', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('banner')).toContainText(
      'Participatory processes for strategic energy planning'
    );

    const nav = page.getByRole('navigation', { name: 'Sections' });
    for (const label of [
      'Plan',
      'Why participate',
      'Stakeholders',
      'Engagement tools',
      'Case studies',
      'Resources',
    ]) {
      await expect(nav.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  test('opens each section', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Sections' });

    await nav.getByRole('button', { name: 'Stakeholders' }).click();
    await expect(page.getByRole('heading', { name: 'Stakeholders', level: 1 })).toBeVisible();

    await nav.getByRole('button', { name: 'Engagement tools' }).click();
    await expect(page.getByRole('heading', { name: 'Engagement tools', level: 1 })).toBeVisible();

    await nav.getByRole('button', { name: 'Case studies' }).click();
    await expect(page.getByRole('heading', { name: 'Case studies', level: 1 })).toBeVisible();

    await nav.getByRole('button', { name: 'Why participate' }).click();
    await expect(
      page.getByRole('heading', { name: 'Why participate', level: 1 })
    ).toBeVisible();

    await nav.getByRole('button', { name: 'Resources' }).click();
    await expect(
      page.getByRole('heading', { name: 'Additional material', level: 1 })
    ).toBeVisible();
  });
});
