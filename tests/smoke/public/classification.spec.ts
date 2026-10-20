import { test, expect, Page } from '@playwright/test';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';

async function openReportDetails(page: Page) {
  const submit = new SubmitReportPage(page);
  const notice = new ReportingNoticePage(page);
  await submit.open();
  await notice.next();
  await submit.reporterInfo.fill({ identityType: 'anonymous', reporterCategory: 'Employee' });
  await submit.reporterInfo.next();
  await submit.classification.verifyLoaded();
  return submit;
}

test('TC-007 | Report Details displays current category and mandatory fields @smoke @public @intake', async ({ page }) => {
  await openReportDetails(page);
  await expect(page.locator('select[name="subcategory"]')).toBeVisible();
  await expect(page.locator('#incidentdescrip')).toBeVisible();
  await expect(page.locator('#howdidyoubecome')).toBeVisible();
  await expect(page.locator('#incidentdate')).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Yes', exact: true })).toBeVisible();
});

test('TC-008 | Report Details requires a category and mandatory details @regression @validation @negative @public @intake', async ({ page }) => {
  const submit = await openReportDetails(page);
  await submit.allegation.next();
  await expect(page.getByRole('heading', { name: 'Report Details', level: 2 })).toBeVisible();
});

test('TC-009 | Current category options are available @regression @public @intake', async ({ page }) => {
  await openReportDetails(page);
  const category = page.locator('select[name="subcategory"]');
  await expect(category.locator('option')).toHaveCount(28);
  await category.selectOption({ label: 'Conflict of Interest-Nepotism/Cronyism' });
  await expect(category).toHaveValue('Conflict of Interest-Nepotism/Cronyism');
});

test('TC-010 | Report Details accepts valid current fields and continues @smoke @public @intake', async ({ page }) => {
  const submit = await openReportDetails(page);
  await submit.classification.selectCategory('Financial Fraud-Embezzlement');
  await submit.allegation.fill({
    incidentTitle: 'Ignored by current UI',
    whatHappened: 'Test automation description only',
    awarenessMethod: 'Observed directly during testing',
    incidentDate: '2026-01-15',
    ongoing: 'No'
  });
  await submit.allegation.next();
  await expect(page.getByRole('heading', { name: 'Person(s) Involved', level: 2 })).toBeVisible();
});

test('TC-011 | Report Details values persist after Back navigation @regression @navigation @public @intake', async ({ page }) => {
  const submit = await openReportDetails(page);
  await submit.classification.selectCategory('Financial Fraud-Embezzlement');
  await submit.allegation.fill({
    incidentTitle: 'Ignored by current UI',
    whatHappened: 'Persisted description',
    awarenessMethod: 'Observed directly during testing',
    incidentDate: '2026-01-15',
    ongoing: 'Yes'
  });
  await submit.allegation.next();
  await submit.personsInvolved.back();
  await expect(page.locator('#incidentdescrip')).toHaveValue('Persisted description');
});
