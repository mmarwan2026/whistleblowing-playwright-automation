import { test, expect } from '@playwright/test';

import {
  FullAnonymousAnotherChannelReportData,
  FullAnonymousFirstTimeReportData,
  FullAnonymousReportData
} from '../../data/e2e/FullAnonymousReportData';
import { AnonymousReportFlow } from '../../flows/public/AnonymousReportFlow';
import { FollowUpFlow } from '../../flows/public/FollowUpFlow';

test.describe('Anonymous Follow-up View Report - E2E', () => {
  const scenarios = [
    { name: 'platform reporting', testId: 'E2E-014', data: FullAnonymousReportData },
    { name: 'another reporting channel', testId: 'E2E-015', data: FullAnonymousAnotherChannelReportData },
    { name: 'first-time reporting', testId: 'E2E-016', data: FullAnonymousFirstTimeReportData }
  ];

  for (const scenario of scenarios) {
    test(
      `${scenario.testId} | Anonymous follow-up opens View Report for ${scenario.name} @e2e @public @followup`,
      async ({ browser }) => {
        const report = scenario.data;
        const submitContext = await browser.newContext();
        let credentials: { referenceNumber: string; pin: string };

        try {
          const result = await new AnonymousReportFlow(await submitContext.newPage())
            .submit(report, scenario.testId);
          expect(result.pin, 'Anonymous report should generate a PIN').toBeTruthy();
          credentials = { referenceNumber: result.referenceNumber, pin: result.pin };
        } finally {
          await submitContext.close();
        }

        const followUpContext = await browser.newContext();
        try {
          const followUp = new FollowUpFlow(await followUpContext.newPage());
          await followUp.accessCase(credentials);
          await followUp.casePage.expectSubmittedReport(report);
        } finally {
          await followUpContext.close();
        }
      }
    );
  }
});
