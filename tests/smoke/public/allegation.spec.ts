import { expect, Page, test } from '@playwright/test';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';

async function openReportDetails(page: Page): Promise<SubmitReportPage> {
  const submit = new SubmitReportPage(page);
  const notice = new ReportingNoticePage(page);

  await submit.open();
  await notice.verifyLoaded();
  await notice.next();
  await submit.reporterInfo.fill({ identityType: 'anonymous', reporterCategory: 'Employee' });
  await submit.reporterInfo.next();
  await submit.reportDetails.verifyLoaded();
  return submit;
}

test('TC-017 | Report Details accepts valid data and continues to Person(s) Involved @smoke @public @intake', async ({ page }) => {
  const submit = await openReportDetails(page);

  await submit.reportDetails.fill({
    category: 'Conflict of Interest-Nepotism/Cronyism',
    incidentDescription: 'Synthetic report details smoke scenario.',
    policyReference: 'Synthetic policy reference',
    awarenessMethod: 'Synthetic automation validation.',
    location: 'Synthetic test location',
    incidentDate: '2026-09-13',
    ongoing: 'No'
  });
  await submit.reportDetails.next();
  await submit.personsInvolved.verifyLoaded();
});

test('TC-018 | Report Details requires current mandatory fields @regression @validation @negative @public @intake', async ({ page }) => {
  const submit = await openReportDetails(page);

  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Report Details', level: 2 })).toBeVisible();
  await expect(page.locator('select[name="subcategory"]')).toBeEnabled();
  await expect(page.locator('#incidentdescrip')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#howdidyoubecome')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#incidentdate')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('alert').filter({ hasText: 'This field is required.' }).first()).toBeVisible();
  await submit.reportDetails.verifyLoaded();
});

test('TC-019 | Report Details supports all ongoing values @regression @conditional @public @intake', async ({ page }) => {
  const submit = await openReportDetails(page);

  for (const ongoing of ['Yes', 'No', 'Unknown'] as const) {
    await submit.reportDetails.fill({
      category: 'Financial Fraud-Embezzlement',
      incidentDescription: `Synthetic ongoing value: ${ongoing}.`,
      awarenessMethod: 'Synthetic automation validation.',
      incidentDate: '2026-09-13',
      ongoing
    });
    await expect(page.getByRole('radio', { name: ongoing, exact: true })).toBeChecked();
  }
});

test('TC-020 | Report Details values persist after Back navigation @regression @navigation @public @intake', async ({ page }) => {
  const submit = await openReportDetails(page);
  const description = 'Synthetic persisted Report Details description.';

  await submit.reportDetails.fill({
    category: 'Financial Fraud-Embezzlement',
    incidentDescription: description,
    awarenessMethod: 'Synthetic automation validation.',
    incidentDate: '2026-09-13',
    ongoing: 'Yes'
  });
  await submit.reportDetails.next();
  await submit.personsInvolved.back();

  await expect(page.locator('#incidentdescrip')).toHaveValue(description);
  await expect(page.locator('select[name="subcategory"]')).toHaveValue('Financial Fraud-Embezzlement');
  await expect(page.getByRole('radio', { name: 'Yes', exact: true })).toBeChecked();
});
