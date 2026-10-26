import { expect, test } from '@playwright/test';

import { ReportFactory } from '../../data/factories/ReportFactory';
import { AnonymousReportFlow } from '../../flows/public/AnonymousReportFlow';
import { FollowUpFlow } from '../../flows/public/FollowUpFlow';

test('E2E-010 | Anonymous reporter can send and retrieve a secure follow-up message @e2e @public @followup', async ({ browser }) => {
  test.setTimeout(120_000);

  const submissionContext = await browser.newContext();
  let credentials: { referenceNumber: string; pin: string };

  try {
    const submissionPage = await submissionContext.newPage();
    credentials = await new AnonymousReportFlow(submissionPage)
      .submit(ReportFactory.anonymous(), 'E2E-010');
  } finally {
    await submissionContext.close();
  }

  const message = `Synthetic QA follow-up message ${Date.now()}`;
  const messageContext = await browser.newContext();

  try {
    const messagePage = await messageContext.newPage();
    const followUp = new FollowUpFlow(messagePage);

    await followUp.accessCase(credentials);
    await messagePage.getByRole('button', { name: 'Mailbox', exact: true }).click();

    const messageResponse = messagePage.waitForResponse(
      response => response.url().endsWith('/portal/v1/case/message'),
      { timeout: 30_000 },
    );

    await followUp.communicationPage.sendMessage({ text: message });

    const response = await messageResponse;
    expect(
      response.ok(),
      `Follow-up message API returned ${response.status()} ${response.statusText()}`,
    ).toBeTruthy();

    await followUp.communicationPage.expectMessage(message);
  } finally {
    await messageContext.close();
  }

  const revisitContext = await browser.newContext();

  try {
    const revisitPage = await revisitContext.newPage();
    const followUp = new FollowUpFlow(revisitPage);

    await followUp.accessCase(credentials);
    await revisitPage.getByRole('button', { name: 'Mailbox', exact: true }).click();
    await followUp.communicationPage.expectMessage(message);
    await expect(revisitPage.getByText(credentials.referenceNumber, { exact: true }))
      .toBeVisible();
  } finally {
    await revisitContext.close();
  }
});
