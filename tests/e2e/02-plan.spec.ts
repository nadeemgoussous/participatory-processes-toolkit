import { test, expect } from '@playwright/test';

test.describe('Participation plan', () => {
  test('builds a checklist from the selected tools', async ({ page }) => {
    await page.goto('/');

    // The six decision framework items apply to every plan.
    await expect(page.getByText('Define your planning objective and phase')).toBeVisible();

    await page.getByRole('button', { name: 'Workshops', exact: true }).click();

    // Workshops contribute eleven requirement sentences, on top of the six
    // decision framework items.
    await expect(page.getByText(/In all cases, it is important to map the required stakeholders/)).toBeVisible();
    await expect(page.getByText('items checked')).toBeVisible();
  });

  test('keeps ticks and notes across a reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Workshops', exact: true }).click();

    const item = page
      .locator('li')
      .filter({ hasText: 'Ensuring confidentiality when necessary is also vital for building trust in the process.' })
      .first();

    await item.getByRole('checkbox').check();
    await item.getByRole('textbox').fill('Non-disclosure agreement drafted with the ministry.');

    await page.reload();

    const reloaded = page
      .locator('li')
      .filter({ hasText: 'Ensuring confidentiality when necessary is also vital for building trust in the process.' })
      .first();

    await expect(reloaded.getByRole('checkbox')).toBeChecked();
    await expect(reloaded.getByRole('textbox')).toHaveValue(
      'Non-disclosure agreement drafted with the ministry.'
    );
  });

  test('selecting an objective suggests its tools', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Build consensus on policy priorities' }).click();

    // Step 4 maps this objective to workshops and steering committees.
    await expect(page.getByText(/In all cases, it is important to map the required stakeholders/)).toBeVisible();
    await expect(
      page.getByText('Participants should commit to the process for its duration.')
    ).toBeVisible();
  });
});
