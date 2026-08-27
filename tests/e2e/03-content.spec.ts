import { test, expect } from '@playwright/test';

test.describe('Toolkit content', () => {
  test('a tool shows every dimension the toolkit describes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Sections' })
      .getByRole('button', { name: 'Engagement tools' }).click();

    await page.getByRole('button', { name: 'By category' }).click();
    await page.getByRole('button', { name: 'Workshops', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Workshops', level: 1 })).toBeVisible();
    for (const heading of [
      'Implementation stage',
      'Resource requirements',
      'Prerequisites',
      'Practical considerations',
      'Implementation evidence',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
    await expect(page.getByText('Source: IRENA (2025)')).toBeVisible();
  });

  test('a stakeholder shows the chapter 3 sections', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Sections' })
      .getByRole('button', { name: 'Stakeholders' }).click();
    await page.getByRole('button', { name: /Policy Makers/ }).click();

    for (const heading of [
      'Who are they?',
      'Why engage them?',
      'What is the benefit for them?',
      'Challenges in engaging',
      'Good practices',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
  });

  test('all thirteen case studies are listed', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Sections' })
      .getByRole('button', { name: 'Case studies' }).click();

    await expect(page.locator('tbody tr')).toHaveCount(13);

    await page.getByRole('button', { name: 'Belgium' }).click();
    await expect(page.getByRole('heading', { name: 'Belgium', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Lessons learnt' })).toBeVisible();
  });
});
