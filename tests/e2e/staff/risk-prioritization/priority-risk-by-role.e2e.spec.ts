import { expect, test, type Browser, type Page } from '@playwright/test';

import { resolveRoute } from '../../../../config/urls';
import { LoginFlow } from '../../../../flows/staff/LoginFlow';

type BusinessRole = {
  name: string;
  usernameKey: string;
  passwordKey: string;
  canEditPriorityRisk: boolean;
};

/**
 * Role assumptions derived from the current UI workflow:
 * - The lead investigator owns the assigned AAPA Preparation task and can edit it.
 * - Other configured business roles may not receive the task or may open it read-only.
 *
 * If product permissions change, update this matrix from the approved requirements.
 */
const BUSINESS_ROLES: BusinessRole[] = [
  {
    name: 'Lead Investigator',
    usernameKey: 'LEAD_INVESTIGATOR_USERNAME',
    passwordKey: 'LEAD_INVESTIGATOR_PASSWORD',
    canEditPriorityRisk: true,
  },
  {
    name: 'Investigator',
    usernameKey: 'INVESTIGATOR_EMAIL',
    passwordKey: 'INVESTIGATOR_PASSWORD',
    canEditPriorityRisk: false,
  },
  {
    name: 'Head of Department',
    usernameKey: 'HOD_EMAIL',
    passwordKey: 'HOD_PASSWORD',
    canEditPriorityRisk: false,
  },
  {
    name: 'GCIAO',
    usernameKey: 'GCIAO_EMAIL',
    passwordKey: 'GCIAO_PASSWORD',
    canEditPriorityRisk: false,
  },
];

async function loginAsRole(page: Page, role: BusinessRole): Promise<void> {
  const username = process.env[role.usernameKey];
  const password = process.env[role.passwordKey];

  test.skip(!username || !password, `${role.name} credentials are not configured`);
  await new LoginFlow(page).login(username!, password!);
  await expect(
    page.locator('#user'),
    `${role.name} login should complete before navigating to My Workspace`,
  ).toHaveCount(0, { timeout: 20_000 });
}

async function findActiveAapaTask(page: Page) {
  await page.goto(resolveRoute('/pages/dashboard/5393/freeModule'));
  await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  await expect(page.getByText('Loading tasks...', { exact: true })).toBeHidden();

  return page.getByRole('row')
    .filter({ hasText: 'AAPA Preparation' })
    .filter({ hasText: /REP-\d+/ })
    .filter({ hasNotText: /Completed|Done/i })
    .first();
}

async function verifyPriorityRiskAccess(page: Page, role: BusinessRole): Promise<void> {
  const row = await findActiveAapaTask(page);

  if (await row.count() === 0) {
    expect(
      role.canEditPriorityRisk,
      `${role.name} should have an active AAPA task for Priority & Risk coverage`,
    ).toBe(false);
    return;
  }

  await row.getByRole('button', { name: 'Open Task' }).click();

  if (!role.canEditPriorityRisk) {
    await expect(
      page.getByRole('button', { name: 'Save as Draft', exact: true }),
      `${role.name} must not edit the AAPA task`,
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: 'Complete Task', exact: true }),
      `${role.name} must not complete the AAPA task`,
    ).toHaveCount(0);
    return;
  }

  await expect(page.getByText('Update AAPA Preparation', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save as Draft', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Complete Task', exact: true })).toBeVisible();

  const assessment = page.getByRole('tab', { name: 'Assessment', exact: true });
  await assessment.click();
  await expect(assessment).toHaveAttribute('aria-selected', 'true');

  const priorityRisk = page.getByRole('tab', { name: 'Priority & Risk', exact: true });
  await priorityRisk.click();
  await expect(priorityRisk).toHaveAttribute('aria-selected', 'true');

  await expect(
    page.getByRole('button', { name: 'Calculate Priority', exact: true }),
    'Lead Investigator should access Calculate Priority',
  ).toBeVisible();
  await expect(
    page.getByText('Does This Case Meet Any of the Following Special Circumstances?', { exact: true }),
    'Lead Investigator should access Special Circumstances',
  ).toBeVisible();
}

test.describe('Priority & Risk access by business role @e2e @staff @risk-prioritization', () => {
  test.setTimeout(120_000);

  for (const role of BUSINESS_ROLES) {
    test(`${role.name} can access Priority & Risk according to the role matrix`, async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        await loginAsRole(page, role);
        await verifyPriorityRiskAccess(page, role);
      } finally {
        await context.close();
      }
    });
  }
});
