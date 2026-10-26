import { expect, Page, test } from '@playwright/test';

import { resolveRoute } from '../../config/urls';

const username = process.env.LEAD_INVESTIGATOR_USERNAME;
const password = process.env.LEAD_INVESTIGATOR_PASSWORD;

const PRIORITY_CRITERIA = [
  'Nature and severity of alleged misconduct',
  'Regulatory, legal and deadline exposure',
  'Subject seniority and governance sensitivity',
  'Operational and business-continuity impact',
  'Reputation and external attention',
  'Financial exposure and ongoing loss',
  'Evidence preservation and concealment risk',
  'Retaliation, witness and immediate safety risk',
  'Pervasiveness and control breakdown',
  'Credibility and corroboration available',
  'Recurrence, prior reports and attempted suppression',
  'Investigation complexity and specialist dependency',
] as const;

const SPECIAL_CIRCUMSTANCES = [
  { label: 'C-Level, CEO or Board', resultingPriority: 'Critical' },
  { label: 'Active regulator / law enforcement', resultingPriority: 'Critical' },
  { label: 'Major public/media impact', resultingPriority: 'Critical' },
  { label: 'Immediate risk of evidence destruction', resultingPriority: 'Critical' },
  { label: 'Sexual harassment', resultingPriority: 'Critical' },
  { label: 'Director to Senior Executive Director', resultingPriority: 'High' },
  { label: 'Retaliation', resultingPriority: 'High' },
  { label: 'Actual Conflict of interest', resultingPriority: 'High' },
  { label: 'Cross-functional/departmental', resultingPriority: 'High' },
] as const;

function assignedTask(page: Page, reportId: string) {
  return page.locator('[data-rfd-droppable-id]:not([data-rfd-droppable-id="done"]) [role="button"]')
    .filter({ hasText: `A new task has been assigned for Case ID: ${reportId} and is awaiting your action.` })
    .filter({ hasNotText: /Completed|Done/i })
    .first();
}

async function openTasks(page: Page): Promise<void> {
  await page.goto(resolveRoute('/pages/todolist/myTasks?view=kanban'));
  await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  await expect(page.getByText('Loading tasks...', { exact: true })).toBeHidden();
}

async function openWorkspaceTask(page: Page, reportId: string): Promise<void> {
  await page.goto(resolveRoute('/pages/dashboard/5393/freeModule'));
  const row = page.getByRole('row').filter({ hasText: reportId });
  await expect(row).toContainText('AAPA Preparation');
  await expect(row, `Completed or Done AAPA task ${reportId} must not be used`).not.toContainText(/Completed|Done/i);
  await row.getByRole('button', { name: 'Open Task' }).click();
  await expect(page.getByText('Update AAPA Preparation', { exact: true })).toBeVisible();
  await expect(page.locator('[data-uda-name="header"]').getByText(reportId, { exact: true }))
    .toBeVisible();
}

async function discoverAapaCaseId(page: Page): Promise<string> {
  await page.goto(resolveRoute('/pages/dashboard/5393/freeModule'));
  await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  await expect(page.getByText('Loading tasks...', { exact: true })).toBeHidden();

  const row = page.getByRole('row')
    .filter({ hasText: 'AAPA Preparation' })
    .filter({ hasText: /REP-\d+/ })
    .filter({ hasNotText: /Completed|Done/i })
    .first();

  await expect(row, 'At least one active AAPA Preparation task should be available')
    .toBeVisible();

  const match = (await row.innerText()).match(/REP-\d+/);
  expect(match, 'The AAPA task row should contain a Case Number').not.toBeNull();
  return match![0];
}

async function openAssignedAapaTask(page: Page, reportId: string): Promise<void> {
  await openTasks(page);

  const awaitingActionCard = assignedTask(page, reportId);
  if (await awaitingActionCard.count() > 0) {
    const actions = awaitingActionCard.getByRole('button', { name: 'Actions' });
    await actions.click();

    const start = actions.locator('..').getByRole('button', { name: 'Start', exact: true });
    if (await start.isVisible()) {
      await start.click();
      const dialog = page.locator('[data-dialog-host="popup"]');
      await expect(dialog.getByText('Start Task', { exact: true })).toBeVisible();
      await dialog.getByRole('button', { name: 'Start', exact: true }).click();
      await expect(dialog).toBeHidden();
    }

    return;
  }

  // The task may already be In Progress and therefore absent from the
  // Awaiting Action cards. Open it directly from My Workspace in that case.
  await openWorkspaceTask(page, reportId);
}

async function openAssessmentSection(page: Page, section: 'Overview' | 'Priority & Risk'): Promise<void> {
  const assessment = page.getByRole('tab', { name: 'Assessment', exact: true });
  await assessment.click();
  await expect(assessment).toHaveAttribute('aria-selected', 'true');
  const tab = page.getByRole('tab', { name: section, exact: true });
  await expect(tab).toBeVisible();
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
}

async function selectDropdownOption(page: Page, fieldName: string, option: string): Promise<void> {
  await page.locator(`[data-uda-name="${fieldName}"] [role="combobox"]:visible`).click();
  const choice = page.locator('.aura-dropdown-option').filter({ hasText: option });
  await expect(choice).toHaveText(option, { timeout: 15_000 });
  await choice.click();
  await expect(page.locator(`[data-uda-name="${fieldName}"] [role="combobox"]:visible`))
    .toHaveText(option);
}

async function fillPriorityCriteria(page: Page, rating: 'Low' | 'Medium' | 'High' | 'Critical'): Promise<void> {
  const updateAapaContainer = page.getByRole('heading', {
    name: 'Update AAPA Preparation',
    exact: true,
  }).locator(
    'xpath=ancestor::*[.//button[normalize-space()="Complete Task"] and .//button[normalize-space()="Save as Draft"]][1]',
  );

  const calculatePriority = updateAapaContainer.getByRole('button', {
    name: 'Calculate Priority',
    exact: true,
  });
  await expect(calculatePriority, 'Calculate Priority should be visible').toBeVisible();
  await calculatePriority.click();

  const matrixControls = updateAapaContainer.locator(
    '[role="checkbox"][aria-label="Low"], [role="checkbox"][aria-label="Medium"], [role="checkbox"][aria-label="High"], [role="checkbox"][aria-label="Critical"]',
  );
  await expect(matrixControls, 'Priority Criteria table should expose 48 rating controls').toHaveCount(48);

  for (const criterion of PRIORITY_CRITERIA) {
    const criterionCell = updateAapaContainer.getByText(criterion, { exact: true });
    await expect(criterionCell, `Criterion should be visible: ${criterion}`).toHaveCount(1);
    const row = criterionCell.locator('xpath=ancestor::tr[1]');
    const ratingCheckbox = row.getByRole('checkbox', { name: rating, exact: true });
    await expect(ratingCheckbox, `${rating} rating should be available for ${criterion}`).toBeVisible();
    await ratingCheckbox.click();
    await expect(ratingCheckbox).toHaveAttribute('aria-checked', 'true');
    await expect(row.locator('[role="checkbox"][aria-checked="true"]')).toHaveCount(1);
  }
}

async function fillSpecialCircumstances(page: Page): Promise<void> {
  const updateAapaContainer = page.getByRole('heading', {
    name: 'Update AAPA Preparation',
    exact: true,
  }).locator(
    'xpath=ancestor::*[.//button[normalize-space()="Complete Task"] and .//button[normalize-space()="Save as Draft"]][1]',
  );

  const controls = updateAapaContainer.getByRole('checkbox', {
    name: 'Select',
    exact: true,
  });
  await expect(controls, 'Special Circumstances table should expose 9 options')
    .toHaveCount(SPECIAL_CIRCUMSTANCES.length);

  for (const circumstance of SPECIAL_CIRCUMSTANCES) {
    const labelCell = updateAapaContainer.getByText(circumstance.label, { exact: true });
    await expect(labelCell, `Special Circumstance should be visible: ${circumstance.label}`)
      .toHaveCount(1);
    const row = labelCell.locator('xpath=ancestor::tr[1]');
    const control = row.getByRole('checkbox', { name: 'Select', exact: true });
    await expect(control, `Select control should be available for ${circumstance.label}`)
      .toBeVisible();
    if ((await control.getAttribute('aria-checked')) !== 'true') {
      await control.click();
    }
    await expect(control).toHaveAttribute('aria-checked', 'true');
    await expect(
      row.getByText(circumstance.resultingPriority, { exact: true }),
      `${circumstance.label} should result in ${circumstance.resultingPriority} priority`,
    ).toBeVisible();
  }

  await expect(
    updateAapaContainer.locator('[role="checkbox"][aria-label="Select"][aria-checked="true"]'),
    'All Special Circumstances options should be selected',
  ).toHaveCount(SPECIAL_CIRCUMSTANCES.length);
}

test('E2E-013 | Lead investigator saves, resumes, and completes AAPA Preparation @e2e @staff @aapa @slow', async ({ page }) => {
  test.setTimeout(300_000);
  await page.setViewportSize({ width: 1680, height: 2400 });
  if (!username || !password) {
    throw new Error('Lead investigator credentials are required.');
  }

  await page.goto(resolveRoute('/login'));
  await page.locator('#user').fill(username);
  await page.locator('#pass').fill(password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page.locator('#user')).toHaveCount(0);
  const caseId = await discoverAapaCaseId(page);
  const incidentTitle = `Synthetic QA assessment for ${caseId}`;
  const priorityReason = 'Synthetic QA: medium priority pending corroboration of the reported concern.';

  await test.step('Open the assigned AAPA Preparation task', async () => {
    await openAssignedAapaTask(page, caseId);
  });

  await test.step('Complete Assessment and Priority & Risk fields, then save an AAPA draft', async () => {
    await openWorkspaceTask(page, caseId);
    await openAssessmentSection(page, 'Overview');
    await page.locator('[data-uda-name="revisedincidenttitle"] input').fill(incidentTitle);
    await selectDropdownOption(page, 'revisedsubcateg', 'Nepotism/Cronyism');
    await openAssessmentSection(page, 'Priority & Risk');
    await fillPriorityCriteria(page, 'Medium');
    await fillSpecialCircumstances(page);

    const calculatePriority = page.getByRole('button', {
      name: 'Calculate Priority',
      exact: true,
    });
    await expect(calculatePriority, 'Calculate Priority should be enabled after filling both tables')
      .toBeEnabled();
    await calculatePriority.click();

    await expect(
      page.locator('[data-uda-name="assessedpriority"] [role="combobox"]:visible'),
      'Priority control should be visible'
    ).toBeVisible();

    await selectDropdownOption(page, 'assessedpriority', 'Medium');
    await expect(page.locator('[data-uda-name="prioritychangereason"] textarea'))
      .toBeVisible();
    const priorityReasonInput = page.locator('[data-uda-name="prioritychangereason"] textarea');
    await priorityReasonInput.fill(priorityReason);
    await expect(
      page.locator('[data-uda-name="assessedpriority"] [role="combobox"]:visible'),
      'Selected priority should be Medium before saving',
    ).toHaveText('Medium');
    await expect(
      priorityReasonInput,
      'Priority Change Reason should be populated before saving',
    ).toHaveValue(priorityReason);
    await page.getByRole('button', { name: 'Save as Draft' }).last().click();
    await expect(page.getByText('Update AAPA Preparation', { exact: true })).toBeHidden();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  });

  await test.step('Reopen the task, verify Assessment persistence, and submit AAPA', async () => {
    await openWorkspaceTask(page, caseId);
    await openAssessmentSection(page, 'Overview');
    await expect(page.locator('[data-uda-name="revisedincidenttitle"] input')).toHaveValue(incidentTitle);
    await expect(page.locator('[data-uda-name="revisedsubcateg"] [role="combobox"]:visible'))
      .toHaveText('Nepotism/Cronyism');
    await openAssessmentSection(page, 'Priority & Risk');
    await expect(page.locator('[data-uda-name="assessedpriority"] [role="combobox"]:visible'))
      .toHaveText('Medium');
    await expect(page.locator('[data-uda-name="prioritychangereason"] textarea'))
      .toHaveValue(priorityReason);
    await page.getByRole('button', { name: 'Complete Task' }).last().click();
    const submission = page.getByRole('heading', { name: 'AAPA Preparation Submission' });
    await expect(submission).toBeVisible();
    await page.getByRole('combobox', { name: /Submission Action/ })
      .selectOption({ label: 'Submit AAPA' });
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(submission).toBeHidden();
  });

  await test.step('Confirm AAPA Preparation moved to Done', async () => {
    await expect.poll(async () => {
      await openTasks(page);
      const count = await page.locator('[data-rfd-droppable-id="done"]')
        .getByText(`A new task has been assigned for Case ID: ${caseId} and is awaiting your action.`)
        .count();
      return count > 0;
    }, { timeout: 120_000, intervals: [5_000, 10_000] }).toBe(true);
  });
});
