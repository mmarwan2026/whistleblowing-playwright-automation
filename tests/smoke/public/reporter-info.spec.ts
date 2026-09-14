import { test, expect } from '@playwright/test';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';

test('Anonymous reporter can continue to Classification @smoke @public @intake',
async ({ page }) => {
  const submit = new SubmitReportPage(page);

  await submit.open();
  await submit.reporterInfo.verifyLoaded();
  await submit.reporterInfo.fill({
    identityType: 'anonymous',
    reporterCategory: 'Employee'
  });
  await submit.reporterInfo.next();

  await expect(
    page.getByText('Classification', { exact: true })
  ).toBeVisible();
});
