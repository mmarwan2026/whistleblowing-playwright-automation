import { expect, test } from '@playwright/test';
import { ReportDetailsFactory } from '../../../data/factories/ReportDetailsFactory';
import { openIntakeStep } from './support/openIntakeStep';

test.describe('Report Details @public @intake', () => {
  test('TC-007 | Current category and mandatory fields are displayed @smoke @public @intake', async ({ page }) => {
    const submit = await openIntakeStep(page, 'reportDetails');
    await submit.reportDetails.verifyLoaded();
    await expect(page.locator('select[name="subcategory"]')).toBeVisible();
    await expect(page.locator('#incidentdate')).toBeVisible();
  });

  test('TC-008 | Category is required before continuing @regression @validation @negative @public @intake', async ({ page }) => {
    await openIntakeStep(page, 'reportDetails');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Report Details', level: 2 })).toBeVisible();
    await expect(page.getByRole('alert').filter({ hasText: 'This field is required.' }).first()).toBeVisible();
  });

  test('TC-009 | Current category options can be selected @regression @public @intake', async ({ page }) => {
    await openIntakeStep(page, 'reportDetails');
    const category = page.locator('select[name="subcategory"]');
    await category.selectOption({ label: ReportDetailsFactory.default().category });
    await expect(category).toHaveValue(ReportDetailsFactory.default().category);
  });

  test('TC-010 | Valid Report Details continue to Person(s) Involved @smoke @public @intake', async ({ page }) => {
    const submit = await openIntakeStep(page, 'reportDetails');
    await submit.reportDetails.fill(ReportDetailsFactory.default());
    await submit.reportDetails.next();
    await submit.personsInvolved.verifyLoaded();
  });

  test('TC-011 | Description persists after Back navigation @regression @navigation @public @intake', async ({ page }) => {
    const submit = await openIntakeStep(page, 'reportDetails');
    const details = ReportDetailsFactory.default();
    await submit.reportDetails.fill(details);
    await submit.reportDetails.next();
    await submit.personsInvolved.back();
    await expect(page.locator('#incidentdescrip')).toHaveValue(details.incidentDescription);
  });

  test('TC-017 | Optional policy and location fields accept data @smoke @public @intake', async ({ page }) => {
    const submit = await openIntakeStep(page, 'reportDetails');
    const details = ReportDetailsFactory.default();
    await submit.reportDetails.fill(details);
    await expect(page.locator('#whatrulepolicyo')).toHaveValue(details.policyReference!);
    await expect(page.locator('#incidentlocatio')).toHaveValue(details.location!);
  });

  test('TC-018 | Missing mandatory details block navigation @regression @validation @negative @public @intake', async ({ page }) => {
    await openIntakeStep(page, 'reportDetails');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    for (const id of ['#incidentdescrip', '#howdidyoubecome', '#incidentdate']) {
      await expect(page.locator(id)).toHaveAttribute('aria-invalid', 'true');
    }
    await expect(page.getByRole('heading', { name: 'Report Details', level: 2 })).toBeVisible();
  });

  test('TC-019 | All ongoing values can be selected @regression @conditional @public @intake', async ({ page }) => {
    const submit = await openIntakeStep(page, 'reportDetails');
    for (const ongoing of ['Yes', 'No', 'Unknown'] as const) {
      await submit.reportDetails.fill({ ...ReportDetailsFactory.default(), ongoing });
      await expect(page.getByRole('radio', { name: ongoing, exact: true })).toBeChecked();
    }
  });

  test('TC-020 | Category and ongoing values persist after Back navigation @regression @navigation @public @intake', async ({ page }) => {
    const submit = await openIntakeStep(page, 'reportDetails');
    const details = { ...ReportDetailsFactory.default(), ongoing: 'Yes' as const };
    await submit.reportDetails.fill(details);
    await submit.reportDetails.next();
    await submit.personsInvolved.back();
    await expect(page.locator('select[name="subcategory"]')).toHaveValue(details.category);
    await expect(page.getByRole('radio', { name: 'Yes', exact: true })).toBeChecked();
  });
});
