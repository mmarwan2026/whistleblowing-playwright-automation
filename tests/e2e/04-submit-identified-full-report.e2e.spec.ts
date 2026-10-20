import { expect, test } from '@playwright/test';

import { FullIdentifiedReportData } from '../../data/e2e/FullIdentifiedReportData';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { submitAndValidate } from '../../helpers/public/submitReportAssertions';

test.describe('Identified Full Report Submission - E2E', () => {
  test('E2E-008 | Identified reporter submits full report with persons, entities, previous reporting and evidence @e2e @public @intake', async ({ page }) => {
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
  
    const result = await submitAndValidate(page, submit, 'E2E-008');
    expect(result.pin, 'Identified report should generate a follow-up access code').toBeTruthy();
  });
});
