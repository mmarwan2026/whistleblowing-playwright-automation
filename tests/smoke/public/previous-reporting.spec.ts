import { expect, Page, test } from '@playwright/test';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';

async function openPreviousReporting(page: Page): Promise<SubmitReportPage> {
  const submit = new SubmitReportPage(page); const notice = new ReportingNoticePage(page);
  await submit.open(); await notice.next();
  await submit.reporterInfo.fill({ identityType: 'anonymous', reporterCategory: 'Employee' }); await submit.reporterInfo.next();
  await submit.reportDetails.fill({ category: 'Conflict of Interest-Nepotism/Cronyism', incidentDescription: 'Synthetic previous reporting smoke scenario.', awarenessMethod: 'Synthetic automation validation.', incidentDate: '2026-01-01', ongoing: 'No' }); await submit.reportDetails.next();
  await submit.personsInvolved.fill({ canIdentify: 'No' }); await submit.personsInvolved.next();
  await submit.entitiesInvolved.fill({ canIdentify: 'No' }); await submit.entitiesInvolved.next();
  await submit.previousReporting.verifyLoaded(); return submit;
}

test.describe('Previous Reporting @public @intake', () => {
  test('TC-063 | Current Previous Reporting step displays its first-time option @smoke @public @intake', async ({ page }) => {
    const submit = await openPreviousReporting(page); await expect(page.getByRole('radio', { name: /first time I am reporting/i })).toBeVisible(); await submit.previousReporting.selectPreviouslyReported('No');
  });
  test('TC-064 | First-time reporting continues to Evidence @smoke @public @intake', async ({ page }) => {
    const submit = await openPreviousReporting(page); await submit.previousReporting.fill({ previouslyReported: 'No' }); await submit.previousReporting.next(); await submit.evidence.verifyLoaded();
  });
  test('TC-067 | Previously reported option exposes current conditional controls @regression @conditional @public @intake', async ({ page }) => {
    const submit = await openPreviousReporting(page); await submit.previousReporting.selectPreviouslyReported('Yes'); await submit.previousReporting.verifySystemReferenceQuestionVisible();
  });
  test('TC-082 | Previous Reporting selection persists after Back navigation @regression @navigation @public @intake', async ({ page }) => {
    const submit = await openPreviousReporting(page); await submit.previousReporting.fill({ previouslyReported: 'No' }); await submit.previousReporting.next(); await submit.evidence.back(); await submit.previousReporting.verifyLoaded(); await expect(page.getByRole('radio', { name: /first time I am reporting/i })).toBeChecked();
  });
});
