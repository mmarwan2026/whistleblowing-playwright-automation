import { Browser, BrowserContext, expect, Page, test } from '@playwright/test';

import { resolveRoute } from '../../config/urls';
import { ReportFactory } from '../../data/factories/ReportFactory';
import { AnonymousReportFlow } from '../../flows/public/AnonymousReportFlow';
import { InitialReviewFlow } from '../../flows/staff/InitialReviewFlow';

function normalizePersonName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function initialReviewMessage(caseId: string): RegExp {
  return new RegExp(`A new report has been submitted with (?:Case )?ID: ${caseId}\\b`);
}

async function logInAndOpenTasks(page: Page, username: string, password: string): Promise<void> {
  await page.goto(resolveRoute('/login'));
  await page.locator('#user').fill(username);
  await page.locator('#pass').fill(password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page.locator('#user')).toHaveCount(0);
  await page.goto(resolveRoute('/pages/todolist/myTasks?view=kanban'));
  await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
}

async function newStaffTaskPage(
  browser: Browser,
  username: string,
  password: string,
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await logInAndOpenTasks(page, username, password);
  await page.locator('[role="button"]')
    .filter({ hasText: /A new report has been submitted with (?:Case )?ID: REP-\d+/ })
    .first().waitFor({ state: 'visible' });
  return { context, page };
}

async function initialReviewCaseIds(page: Page): Promise<string[]> {
  const cards = page.locator('[role="button"]')
    .filter({ hasText: /A new report has been submitted with (?:Case )?ID: REP-\d+/ });
  return (await cards.allInnerTexts()).flatMap(text => text.match(/REP-\d+/g) ?? []);
}

test('E2E-012 | Public report is assigned to its lead investigator @e2e @public @staff @aapa @slow', async ({ browser }) => {
  test.setTimeout(720_000);

  const staffUsername = process.env.STAFF_USERNAME;
  const staffPassword = process.env.STAFF_PASSWORD;
  const investigatorUsername = process.env.LEAD_INVESTIGATOR_USERNAME;
  const investigatorPassword = process.env.LEAD_INVESTIGATOR_PASSWORD;
  if (!staffUsername || !staffPassword || !investigatorUsername || !investigatorPassword) {
    throw new Error('Staff and lead investigator credentials are required for E2E-012.');
  }

  let staff: { context: BrowserContext; page: Page } | undefined;
  let investigatorContext: BrowserContext | undefined;

  try {
    staff = await newStaffTaskPage(browser, staffUsername, staffPassword);
    investigatorContext = await browser.newContext();
    const investigatorProfilePage = await investigatorContext.newPage();
    await logInAndOpenTasks(investigatorProfilePage, investigatorUsername, investigatorPassword);
    const investigatorDisplayName = (await investigatorProfilePage
      .locator('button.topbar-select-trigger--profile span.text-sm.font-semibold.leading-tight')
      .innerText()).trim();
    expect(investigatorDisplayName, 'Lead investigator profile name must be visible').not.toBe('');
    await investigatorContext.close();
    investigatorContext = undefined;

    let matchedCaseId = process.env.E2E_RESUME_CASE_ID;
    if (matchedCaseId) {
      expect(matchedCaseId, 'E2E_RESUME_CASE_ID must be a staff case ID').toMatch(/^REP-\d+$/);
      const card = staff.page.locator('[role="button"]')
        .filter({ hasText: initialReviewMessage(matchedCaseId) }).first();
      await expect(card).toBeVisible();
      await card.getByRole('button', { name: 'Actions' }).click();
      await staff.page.getByRole('button', { name: 'Edit', exact: true }).click();
    } else {
      const existingCaseIds = new Set(await initialReviewCaseIds(staff.page));

      const report = ReportFactory.anonymous();
      const marker = `Synthetic lead-assignment QA ${Date.now()}`;
      report.reportDetails = { ...report.reportDetails!, incidentDescription: marker };
      report.personsInvolved = {
        canIdentify: 'Yes',
        persons: [{
          fullName: 'Synthetic QA Person',
          position: 'Synthetic Specialist',
          company: 'Synthetic Test Company',
          roleInIncident: 'Witness',
        }],
      };
      report.evidence = {
        hasSupportingEvidence: 'Yes',
        filePaths: ['test-data/files/validevidence.pdf'],
        fileDescriptions: ['Synthetic supporting document for lead-assignment QA.'],
      };

      const submissionContext = await browser.newContext();
      let referenceNumber: string;
      try {
        const submissionPage = await submissionContext.newPage();
        referenceNumber = (await new AnonymousReportFlow(submissionPage).submit(report, 'E2E-012')).referenceNumber;
      } finally {
        await submissionContext.close();
      }

      const inspectedCaseIds = new Set<string>();
      await test.step('Correlate the new report with its staff Initial Review task', async () => {
        await expect.poll(async () => {
          await staff!.context.close();
          staff = await newStaffTaskPage(browser, staffUsername, staffPassword);
          const flow = new InitialReviewFlow(staff.page);
          const candidates = [...new Set(await initialReviewCaseIds(staff.page))]
            .filter(id => !existingCaseIds.has(id) && !inspectedCaseIds.has(id))
            .sort((a, b) => Number(b.slice(4)) - Number(a.slice(4)));

          for (const caseId of candidates) {
            const card = staff.page.locator('[role="button"]')
              .filter({ hasText: initialReviewMessage(caseId) }).first();
            await card.getByRole('button', { name: 'Actions' }).click();
            await staff.page.getByRole('button', { name: 'Edit', exact: true }).click();
            await expect(flow.initialReview.taskContainer).toContainText('Incident Description');
            if ((await flow.initialReview.taskContainer.innerText()).includes(marker)) {
              matchedCaseId = caseId;
              return true;
            }
            await flow.initialReview.close();
            inspectedCaseIds.add(caseId);
          }
          return false;
        }, {
          timeout: 420_000,
          intervals: [10_000, 15_000],
          message: `No Initial Review task matched public reference ${referenceNumber}`,
        }).toBe(true);
      });
    }

    const caseId = matchedCaseId!;
    await test.step('Submit assignment to the configured lead investigator', async () => {
      const flow = new InitialReviewFlow(staff!.page);
      await flow.initialReview.verifyLoaded(caseId);
      await flow.initialReview.completeTask();
      const submission = flow.initialReviewSubmission;
      await submission.verifyLoaded(caseId);
      await submission.selectSubmissionAction('Assign Lead Investigator');
      await submission.verifyLeadInvestigatorRequired();
      await expect.poll(async () => (await submission.getLeadInvestigatorOptions()).length)
        .toBeGreaterThan(1);

      const matchingNames = (await submission.getLeadInvestigatorOptions())
        .filter(name => normalizePersonName(name) === normalizePersonName(investigatorDisplayName));
      expect(matchingNames, 'Configured investigator must match exactly one available member')
        .toHaveLength(1);
      await submission.selectLeadInvestigator(matchingNames[0]);
      await submission.verifySelectedLeadInvestigator(matchingNames[0]);
      await submission.verifySubmitEnabled();
      await submission.submit();
      await expect(submission.taskContainer).toBeHidden();
    });

    await test.step('Confirm staff Initial Review moved to Done', async () => {
      await expect.poll(async () => {
        await staff!.context.close();
        staff = await newStaffTaskPage(browser, staffUsername, staffPassword);
        const column = staff.page.locator('[data-rfd-droppable-id]')
          .filter({ hasText: initialReviewMessage(caseId) }).locator('xpath=..');
        return await column.count() > 0 && (await column.innerText()).includes('Done');
      }, {
        timeout: 120_000,
        intervals: [10_000, 15_000],
        message: `Initial Review for ${caseId} did not move to Done after submission`,
      }).toBe(true);
    });

    await test.step('Confirm the lead investigator received a task for the case', async () => {
      await expect.poll(async () => {
        await investigatorContext?.close();
        investigatorContext = await browser.newContext();
        const investigatorPage = await investigatorContext.newPage();
        await logInAndOpenTasks(investigatorPage, investigatorUsername, investigatorPassword);
        await expect(investigatorPage.getByText('Loading tasks...', { exact: true })).toBeHidden();
        return (await investigatorPage.locator('body').innerText()).includes(caseId);
      }, {
        timeout: 120_000,
        intervals: [10_000, 15_000],
        message: `Lead investigator has no visible task for assigned case ${caseId}`,
      }).toBe(true);
    });
    console.log('E2E-012 Staff Case ID:', caseId);
  } finally {
    await investigatorContext?.close();
    await staff?.context.close();
  }
});
