import { expect, test } from '@playwright/test';

import {
  FullIdentifiedAnotherChannelReportData,
  FullIdentifiedFirstTimeReportData,
  FullIdentifiedReportData
} from '../../data/e2e/FullIdentifiedReportData';
import { FollowUpFlow } from '../../flows/public/FollowUpFlow';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { submitAndValidate } from '../../helpers/public/submitReportAssertions';

test.describe('Identified Full Report Submission - E2E', () => {
  const scenarios = [
    { name: 'platform reporting', testId: 'E2E-008', data: FullIdentifiedReportData },
    { name: 'another reporting channel', testId: 'E2E-009', data: FullIdentifiedAnotherChannelReportData },
    { name: 'first-time reporting', testId: 'E2E-011', data: FullIdentifiedFirstTimeReportData }
  ];

  for (const scenario of scenarios) {
    test(`${scenario.testId} | Identified reporter submits full report with ${scenario.name} @e2e @public @intake`, async ({ page, browser }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    const data = scenario.data;
  
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
    await submit.declaration.acceptAcknowledgement();
    await submit.declaration.verifyAcknowledgementChecked();
  
    const result = await submitAndValidate(page, submit, scenario.testId);
    expect(result.pin, 'Identified report should generate a follow-up access code').toBeTruthy();

    const followUpContext = await browser.newContext();
    try {
      const followUpPage = await followUpContext.newPage();
      const followUp = new FollowUpFlow(followUpPage);

      await followUp.accessCase({
        referenceNumber: result.reference,
        pin: result.pin
      });
      await followUp.casePage.expectSubmittedReport(data);
    } finally {
      await followUpContext.close();
    }
    });
  }
});
