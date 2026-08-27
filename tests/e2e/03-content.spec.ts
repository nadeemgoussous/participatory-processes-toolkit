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

test.describe('Reference chapters', () => {
  test('chapter 2 shows the four objectives and the benefits summary', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Sections' })
      .getByRole('button', { name: 'Why participate' })
      .click();

    for (const heading of [
      'Objective 1: Building Consensus, Trust and Stakeholder Ownership',
      'Objective 2: Gathering Diverse Inputs and Identifying Planning Blind Spots',
      'Objective 3: Developing More Implementable and Context-Appropriate Scenarios',
      'Objective 4: Enhancing Energy Literacy and System Understanding',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }

    // The three models table from 2.2.
    await expect(page.getByText('50/50 (Hybrid)')).toBeVisible();
    await expect(page.getByText('Legitimacy, trust and stakeholder buy-in')).toBeVisible();
  });

  test('chapter 7 lists the publications, platforms and frameworks', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Sections' })
      .getByRole('button', { name: 'Resources' })
      .click();

    await expect(
      page.getByRole('heading', { name: "Participatory Methods Toolkit: A Practitioner's Manual" })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'World Energy Trilemma Index' })).toBeVisible();

    // Links are present and point outward, but nothing is fetched by the page.
    const link = page.getByRole('link', { name: /facilitator\.school/ });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);

    // Mentimeter appears in the polling list and again in the quick reference
    // table, as it does in the publication.
    await expect(page.getByText('Mentimeter', { exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Mentimeter, Slido, Kahoot' })).toBeVisible();
  });
});
