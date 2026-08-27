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

test.describe('Guidance from chapters 1 and 6', () => {
  test('the plan page carries the how-to guide and the challenges', async ({ page }) => {
    await page.goto('/');

    // Both panels are collapsed until asked for, so the checklist stays first.
    const guide = page.getByText('Step 1: Identify Approaches That Match Your Planning Context');
    await expect(guide).toBeHidden();

    await page.getByText('how to use this toolkit').click();
    await expect(guide).toBeVisible();
    await expect(page.getByText('Identifying Relevant Case Studies')).toBeVisible();

    await page.getByText('the challenges a checklist does not solve').click();
    await expect(
      page.getByRole('cell', { name: '"Box-ticking" exercises' })
    ).toBeVisible();
    await expect(
      page.getByText('Or are novel methods and frameworks needed?')
    ).toBeVisible();
  });

  test('the why page carries the background and key takeaways', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Sections' })
      .getByRole('button', { name: 'Why participate' })
      .click();

    await expect(
      page.getByRole('heading', { name: 'The expanding stakeholder landscape' })
    ).toBeVisible();
    await expect(
      page.getByText('Participatory processes are essential for a clean and just energy transition')
    ).toBeVisible();

    const about = page.getByText('This toolkit has been developed on the basis of collective');
    await expect(about).toBeHidden();
    await page.getByText('about this toolkit and how it was developed').click();
    await expect(about).toBeVisible();
  });
});

test.describe('Figures from the publication', () => {
  test('figures render and decode, with the caption as alt text', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Sections' })
      .getByRole('button', { name: 'Why participate' })
      .click();

    const mentalModel = page.getByRole('img', {
      name: 'Figure 2. Mental model of a stakeholder-led energy planning process',
    });
    await expect(mentalModel).toBeVisible();

    // Visible in the DOM is not the same as decoded; a broken source still
    // renders an <img> box.
    await expect
      .poll(() => mentalModel.evaluate((i: HTMLImageElement) => i.naturalWidth))
      .toBeGreaterThan(0);

    await expect(
      page.getByRole('img', {
        name: 'Figure 3. Allocation of energy planning capacity in the national context',
      })
    ).toBeVisible();
  });

  test('the tool categories figure appears on the category route', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Sections' })
      .getByRole('button', { name: 'Engagement tools' })
      .click();
    await page.getByRole('button', { name: 'By category' }).click();

    const figure = page.getByRole('img', {
      name: 'Figure 4. Categorisation of engagement tools and activities',
    });
    await expect(figure).toBeVisible();
    await expect
      .poll(() => figure.evaluate((i: HTMLImageElement) => i.naturalWidth))
      .toBeGreaterThan(0);
  });
});
