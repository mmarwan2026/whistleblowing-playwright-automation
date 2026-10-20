import { expect, Page, test } from '@playwright/test';
import path from 'path';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';

async function openEvidence(page: Page): Promise<SubmitReportPage> {
  const submit = new SubmitReportPage(page); const notice = new ReportingNoticePage(page);
  await submit.open(); await notice.next();
  await submit.reporterInfo.fill({ identityType: 'anonymous', reporterCategory: 'Employee' }); await submit.reporterInfo.next();
  await submit.reportDetails.fill({ category: 'Conflict of Interest-Nepotism/Cronyism', incidentDescription: 'Synthetic evidence smoke scenario.', awarenessMethod: 'Synthetic automation validation.', incidentDate: '2026-01-01', ongoing: 'No' }); await submit.reportDetails.next();
  await submit.personsInvolved.fill({ canIdentify: 'No' }); await submit.personsInvolved.next();
  await submit.entitiesInvolved.fill({ canIdentify: 'No' }); await submit.entitiesInvolved.next();
  await submit.previousReporting.fill({ previouslyReported: 'No' }); await submit.previousReporting.next();
  await submit.evidence.verifyLoaded(); return submit;
}

const pdf = path.resolve(process.cwd(), 'test-data', 'files', 'validevidence.pdf');

test.describe('Evidence @public @intake', () => {
  test('TC-055 | User can continue without supporting evidence @smoke @public @intake', async ({ page }) => {
    const submit = await openEvidence(page); await submit.evidence.fill({ hasSupportingEvidence: 'No' }); await submit.evidence.next(); await submit.declaration.verifyLoaded();
  });
  test('TC-057 | User can upload one supported PDF evidence file @smoke @public @intake', async ({ page }) => {
    const submit = await openEvidence(page); await submit.evidence.fill({ hasSupportingEvidence: 'Yes', filePaths: [pdf], fileDescriptions: ['Synthetic evidence upload.'] }); await submit.evidence.verifyFileUploaded('validevidence.pdf'); await expect(page.locator('textarea[placeholder*="Please clearly indicate"]')).toHaveValue('Synthetic evidence upload.');
  });
  test('TC-060 | User can remove uploaded evidence before submission @regression @public @intake', async ({ page }) => {
    const submit = await openEvidence(page); await submit.evidence.fill({ hasSupportingEvidence: 'Yes', filePaths: [pdf] }); await submit.evidence.verifyFileUploaded('validevidence.pdf'); await submit.evidence.removeFile('validevidence.pdf'); await submit.evidence.verifyFileNotPresent('validevidence.pdf');
  });
  test('TC-062 | Evidence choice persists after Back navigation @regression @navigation @public @intake', async ({ page }) => {
    const submit = await openEvidence(page); await submit.evidence.fill({ hasSupportingEvidence: 'No' }); await submit.evidence.next(); await submit.declaration.back(); await expect(page.getByRole('heading', { name: 'Evidence', level: 2 })).toBeVisible(); await expect(page.getByRole('checkbox', { name: "I don't have any documents to upload" })).toBeChecked();
  });
});
