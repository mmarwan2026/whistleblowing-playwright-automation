import { expect, Page, test } from '@playwright/test';

import { resolveRoute } from '../../config/urls';
import { ReportFactory } from '../../data/factories/ReportFactory';
import { AnonymousReportFlow } from '../../flows/public/AnonymousReportFlow';
import { InitialReviewFlow } from '../../flows/staff/InitialReviewFlow';

async function initialReviewCaseIds(page: Page): Promise<string[]> {
  const cards = page.locator('[role="button"]')
    .filter({ hasText: /A new report has been submitted with Case ID: REP-\d+/ });
  const texts = await cards.allInnerTexts();
  return texts.flatMap(text => text.match(/REP-\d+/g) ?? []);
}

async function openStaffTasks(page: Page, username: string, password: string): Promise<void> {
  await page.goto(resolveRoute('/login'));
  await page.locator('#user').fill(username);
  await page.locator('#pass').fill(password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page.locator('#user')).toHaveCount(0);
  await page.goto(resolveRoute('/pages/todolist/myTasks?view=kanban'));
  await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  await page.locator('[role="button"]')
    .filter({ hasText: /A new report has been submitted with Case ID: REP-\d+/ })
    .first().waitFor({ state: 'visible' });
}

test('E2E-011 | Newly submitted report reaches staff initial review @e2e @public @staff @aapa @slow', async ({ browser }) => {
  test.setTimeout(540_000);

  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;
  if (!username || !password) {
    throw new Error('STAFF_USERNAME and STAFF_PASSWORD are required for this cross-role E2E.');
  }

  let staffContext = await browser.newContext();

  try {
    let staffPage = await staffContext.newPage();
    let flow = new InitialReviewFlow(staffPage);

    await test.step('Log in and capture existing Initial Review cases', async () => {
      await openStaffTasks(staffPage, username, password);
    });

    const existingCaseIds = new Set(await initialReviewCaseIds(staffPage));
    const report = ReportFactory.anonymous();
    const marker = `Synthetic cross-role QA ${Date.now()}`;
    report.reportDetails = { ...report.reportDetails!, incidentDescription: marker };

    const submissionContext = await browser.newContext();
    let referenceNumber: string;

    try {
      const submissionPage = await submissionContext.newPage();
      const result = await new AnonymousReportFlow(submissionPage)
        .submit(report, 'E2E-011');
      referenceNumber = result.referenceNumber;
    } finally {
      await submissionContext.close();
    }

    let matchedCaseId: string | undefined;
    const inspectedCaseIds = new Set<string>();

    await test.step('Wait for and correlate the exact staff task', async () => {
      await expect.poll(async () => {
        // Aura can retain an old task list across tabs in the same session.
        await staffContext.close();
        staffContext = await browser.newContext();
        staffPage = await staffContext.newPage();
        flow = new InitialReviewFlow(staffPage);
        await openStaffTasks(staffPage, username, password);

        const candidates = [...new Set(await initialReviewCaseIds(staffPage))]
          .filter(id => !existingCaseIds.has(id) && !inspectedCaseIds.has(id))
          .sort((a, b) => Number(b.slice(4)) - Number(a.slice(4)));

        for (const caseId of candidates) {
          const taskMessage = `A new report has been submitted with Case ID: ${caseId} and is awaiting your review.`;
          const card = staffPage.getByText(taskMessage, { exact: true })
            .locator('xpath=ancestor::*[@role="button"][1]');
          await card.getByRole('button', { name: 'Actions' }).click();
          await staffPage.getByRole('button', { name: 'Edit', exact: true }).click();
          await expect(flow.initialReview.taskContainer).toBeVisible();
          await expect(flow.initialReview.taskContainer).toContainText(caseId);
          await expect(flow.initialReview.taskContainer).toContainText('Incident Description');

          if ((await flow.initialReview.taskContainer.innerText()).includes(marker)) {
            matchedCaseId = caseId;
            return true;
          }

          await flow.initialReview.close();
          await expect(flow.initialReview.taskContainer).toBeHidden();
          inspectedCaseIds.add(caseId);
        }

        return false;
      }, {
        timeout: 420_000,
        intervals: [10_000, 15_000],
        message: `No staff Initial Review task matched the submitted report ${referenceNumber}`
      }).toBe(true);
    });

    await test.step('Complete the matched Initial Review task', async () => {
      await flow.initialReview.verifyLoaded(matchedCaseId!);
      await flow.initialReview.completeTask();
      await flow.initialReviewSubmission.verifyLoaded(matchedCaseId!);
      await flow.initialReviewSubmission.verifyAvailableActions();
    });
  } finally {
    await staffContext.close();
  }
});
