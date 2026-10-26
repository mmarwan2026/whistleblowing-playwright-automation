import { expect, test } from '@playwright/test';

import { LoginFlow } from '../../../../flows/staff/LoginFlow';

test.describe('AAPA task state coverage @e2e @staff @aapa @ui', () => {
  test('AAPA-UI-031 | Starting a dynamic AAPA task opens the editable form', async ({ page }) => {
    test.setTimeout(90_000);

    const username = process.env.LEAD_INVESTIGATOR_USERNAME;
    const password = process.env.LEAD_INVESTIGATOR_PASSWORD;
    expect(username, 'LEAD_INVESTIGATOR_USERNAME must be configured').toBeTruthy();
    expect(password, 'LEAD_INVESTIGATOR_PASSWORD must be configured').toBeTruthy();

    await new LoginFlow(page).login(username!, password!);
    await page.getByText('Tasks', { exact: true }).click();
    await expect(page).toHaveURL(/\/pages\/todolist\/myTasks/, { timeout: 20_000 });

    const assignment = page.locator(
      '[data-rfd-droppable-id]:not([data-rfd-droppable-id="done"])',
    ).getByText(
      /A new task has been assigned for Case ID: REP-\d+ and is awaiting your action\./,
    ).filter({ hasNotText: /Completed|Done/i }).first();
    await expect(assignment, 'A dynamic AAPA assignment should be available').toBeVisible({
      timeout: 20_000,
    });

    const caseNumber = (await assignment.innerText()).match(/REP-\d+/)?.[0];
    expect(caseNumber, 'The assignment should contain a Case Number').toMatch(/^REP-\d+$/);

    let taskCard = assignment.locator('xpath=ancestor::div[.//button][1]');
    let actions = taskCard.getByRole('button', { name: 'Actions' });
    await actions.click();

    const start = actions.locator('..').getByRole('button', { name: 'Start', exact: true });
    if (await start.isVisible()) {
      await start.click();
      const dialog = page.locator('[data-dialog-host="popup"]');
      await expect(dialog.getByText('Start Task', { exact: true })).toBeVisible();
      await dialog.getByRole('button', { name: 'Start', exact: true }).click();
      await expect(dialog).toBeHidden();

      await page.reload();
      await expect(page).toHaveURL(/\/pages\/todolist\/myTasks/, { timeout: 20_000 });
      const refreshedAssignment = page.locator(
        '[data-rfd-droppable-id]:not([data-rfd-droppable-id="done"])',
      ).getByText(new RegExp(`Case ID: ${caseNumber}`))
        .filter({ hasNotText: /Completed|Done/i })
        .first();
      await expect(refreshedAssignment).toBeVisible({ timeout: 20_000 });
      taskCard = refreshedAssignment.locator('xpath=ancestor::div[.//button][1]');
      actions = taskCard.getByRole('button', { name: 'Actions' });
      await actions.click();
    }

    const edit = actions.locator('..').getByRole('button', { name: 'Edit', exact: true });
    await expect(edit, `Edit should be available for ${caseNumber}`).toBeVisible();
    await edit.click();

    await expect(
      page.getByRole('heading', { name: 'Update AAPA Preparation', exact: true }),
      'Edit should open the editable Update AAPA Preparation form',
    ).toBeVisible();
  });
});
