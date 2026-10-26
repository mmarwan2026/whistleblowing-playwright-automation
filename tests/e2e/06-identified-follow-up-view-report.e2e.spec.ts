import { expect, Page, test } from '@playwright/test';

import {
  FullIdentifiedAnotherChannelReportData,
  FullIdentifiedFirstTimeReportData,
  FullIdentifiedReportData
} from '../../data/e2e/FullIdentifiedReportData';
import { FollowUpFlow } from '../../flows/public/FollowUpFlow';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { submitAndValidate } from '../../helpers/public/submitReportAssertions';

async function submitFullIdentifiedReport(
  page: Page,
  data: typeof FullIdentifiedReportData,
  testId: string
): Promise<{ referenceNumber: string; pin: string }> {
  const submit = new SubmitReportPage(page);
  const notice = new ReportingNoticePage(page);

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

  const result = await submitAndValidate(page, submit, testId);
  expect(result.pin, 'Identified report should generate a follow-up access code').toBeTruthy();
  return { referenceNumber: result.reference, pin: result.pin! };
}

test.describe('Identified Follow-up View Report - E2E', () => {
  const scenarios = [
    { name: 'platform reporting', testId: 'E2E-017', data: FullIdentifiedReportData },
    { name: 'another reporting channel', testId: 'E2E-018', data: FullIdentifiedAnotherChannelReportData },
    { name: 'first-time reporting', testId: 'E2E-019', data: FullIdentifiedFirstTimeReportData }
  ];

  for (const scenario of scenarios) {
    test(
      `${scenario.testId} | Identified follow-up opens View Report for ${scenario.name} @e2e @public @followup`,
      async ({ browser }) => {
        const submitContext = await browser.newContext();
        let credentials: { referenceNumber: string; pin: string };
        try {
          credentials = await submitFullIdentifiedReport(
            await submitContext.newPage(),
            scenario.data,
            scenario.testId
          );
        } finally {
          await submitContext.close();
        }

        const followUpContext = await browser.newContext();
        try {
          const followUp = new FollowUpFlow(await followUpContext.newPage());
          await followUp.accessCase(credentials);
          await followUp.casePage.expectSubmittedReport(scenario.data);
        } finally {
          await followUpContext.close();
        }
      }
    );
  }
});
