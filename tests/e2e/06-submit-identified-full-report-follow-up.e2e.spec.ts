import { expect, Page, test } from '@playwright/test';

import { FullIdentifiedReportData } from '../../data/e2e/FullIdentifiedReportData';
import { FollowUpFlow } from '../../flows/public/FollowUpFlow';
import { ReportData } from '../../models/public/ReportData';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { submitAndValidate } from '../../helpers/public/submitReportAssertions';

async function submitFullIdentifiedReport(page: Page): Promise<{
  referenceNumber: string;
  pin: string;
}> {
  const submit = new SubmitReportPage(page);
  const notice = new ReportingNoticePage(page);
  const data = FullIdentifiedReportData;

  await submit.open();
  await notice.verifyLoaded();
  await notice.next();

  await submit.reporterInfo.verifyLoaded();
  await submit.reporterInfo.fill(data.reporter);
  await submit.reporterInfo.next();

  await submit.reportDetails.verifyLoaded();
  await submit.reportDetails.fill(data.reportDetails!);
  await submit.reportDetails.next();

  await submit.personsInvolved.verifyLoaded();
  await submit.personsInvolved.fill(data.personsInvolved);
  await expect(page.getByRole('textbox', { name: 'Full Name 1', exact: true }))
    .toHaveValue('Synthetic Involved Person');
  await submit.personsInvolved.next();

  await submit.entitiesInvolved.verifyLoaded();
  await submit.entitiesInvolved.fill(data.entitiesInvolved);
  await submit.entitiesInvolved.next();

  await submit.previousReporting.verifyLoaded();
  await submit.previousReporting.fill(data.previousReporting);
  await submit.previousReporting.next();

  await submit.evidence.verifyLoaded();
  await submit.evidence.fill(data.evidence);
  await submit.evidence.verifyFileUploaded('validevidence.pdf');
  await expect(page.locator('textarea[placeholder*="Please clearly indicate"]'))
    .toHaveValue('Synthetic supporting document for evidence-flow validation.');
  await submit.evidence.next();

  await submit.declaration.verifyLoaded();
  await submit.declaration.acceptAllAcknowledgements();
  await submit.declaration.verifyBothAcknowledgementsChecked();

  const result = await submitAndValidate(page, submit, 'E2E-006');
  expect(result.pin, 'Identified report should generate a follow-up access code').toBeTruthy();

  return { referenceNumber: result.reference, pin: result.pin! };
}

test.describe('Identified Report Lifecycle - E2E', () => {
  test('E2E-006 | Identified reporter submits full report and accesses it through follow-up @e2e @public @followup', async ({ browser }) => {
    const submitContext = await browser.newContext();
    const submitPage = await submitContext.newPage();
    const credentials = await submitFullIdentifiedReport(submitPage);
    await submitContext.close();

    const followUpContext = await browser.newContext();
    const followUpPage = await followUpContext.newPage();

    try {
      await new FollowUpFlow(followUpPage).accessCase(credentials);
    } finally {
      await followUpContext.close();
    }
  });

  test('E2E-007 | Identified report supports multiple evidence files with descriptions @e2e @public @intake', async ({ page }) => {
    const data: ReportData = {
      ...FullIdentifiedReportData,
      evidence: {
        hasSupportingEvidence: 'Yes',
        filePaths: [
          'test-data/files/validevidence.pdf',
          'test-data/files/sample-evidence.txt'
        ],
        fileDescriptions: [
          'Synthetic PDF supporting document.',
          'Synthetic text supporting document.'
        ]
      }
    };

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();
    await notice.verifyLoaded();
    await notice.next();
    await submit.reporterInfo.fill(data.reporter);
    await submit.reporterInfo.next();
    await submit.reportDetails.fill(data.reportDetails!);
    await submit.reportDetails.next();
    await submit.personsInvolved.fill(data.personsInvolved);
    await submit.personsInvolved.next();
    await submit.entitiesInvolved.fill(data.entitiesInvolved);
    await submit.entitiesInvolved.next();
    await submit.previousReporting.fill(data.previousReporting);
    await submit.previousReporting.next();
    await submit.evidence.fill(data.evidence);

    await submit.evidence.verifyFileUploaded('validevidence.pdf');
    await submit.evidence.verifyFileUploaded('sampleevidence.txt');
    await expect(page.locator('textarea[placeholder*="Please clearly indicate"]')).toHaveCount(2);
    await expect(page.locator('textarea[placeholder*="Please clearly indicate"]').nth(0))
      .toHaveValue('Synthetic PDF supporting document.');
    await expect(page.locator('textarea[placeholder*="Please clearly indicate"]').nth(1))
      .toHaveValue('Synthetic text supporting document.');
  });
});
