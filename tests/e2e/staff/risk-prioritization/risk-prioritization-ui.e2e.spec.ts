import { expect, Locator, Page, test } from '@playwright/test';

import { resolveRoute } from '../../../../config/urls';
import { LoginFlow } from '../../../../flows/staff/LoginFlow';

const CRITERIA_RATING_COUNT = 12 * 4;
const SPECIAL_CIRCUMSTANCE_COUNT = 9;
const CRITERIA = [
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
  'C-Level, CEO or Board',
  'Active regulator / law enforcement',
  'Major public/media impact',
  'Immediate risk of evidence destruction',
  'Sexual harassment',
  'Director to Senior Executive Director',
  'Retaliation',
  'Actual Conflict of interest',
  'Cross-functional/departmental',
] as const;

async function openActiveAapaPriorityRisk(page: Page): Promise<void> {
  const username = process.env.LEAD_INVESTIGATOR_USERNAME;
  const password = process.env.LEAD_INVESTIGATOR_PASSWORD;

  expect(username, 'LEAD_INVESTIGATOR_USERNAME must be configured').toBeTruthy();
  expect(password, 'LEAD_INVESTIGATOR_PASSWORD must be configured').toBeTruthy();

  await new LoginFlow(page).login(username!, password!);
  await expect(page.locator('#user'), 'Lead Investigator login should complete').toHaveCount(0, {
    timeout: 20_000,
  });

  await page.goto(resolveRoute('/pages/dashboard/5393/freeModule'));
  await expect(page.getByRole('heading', { name: 'My Tasks' })).toBeVisible();
  await expect(page.getByText('Loading tasks...', { exact: true })).toBeHidden();

  const row = page.getByRole('row')
    .filter({ hasText: 'AAPA Preparation' })
    .filter({ hasText: /REP-\d+/ })
    .filter({ hasNotText: /Completed|Done/i })
    .first();

  await expect(
    row,
    'An active AAPA task must be assigned before running Priority & Risk UI tests',
  ).toBeVisible();
  await row.getByRole('button', { name: 'Open Task' }).click();

  await expect(page.getByText('Update AAPA Preparation', { exact: true })).toBeVisible();

  const assessment = page.getByRole('tab', { name: 'Assessment', exact: true });
  await assessment.click();
  await expect(assessment).toHaveAttribute('aria-selected', 'true');

  const priorityRisk = page.getByRole('tab', { name: 'Priority & Risk', exact: true });
  await priorityRisk.click();
  await expect(priorityRisk).toHaveAttribute('aria-selected', 'true');
}

async function setAllCriteriaRating(
  page: Page,
  rating: 'Low' | 'Medium' | 'High' | 'Critical',
): Promise<void> {
  for (const criterion of CRITERIA) {
    const row = page.getByText(criterion, { exact: true }).locator('xpath=ancestor::tr[1]');
    const control = row.getByRole('checkbox', { name: rating, exact: true });

    if (await control.getAttribute('aria-checked') !== 'true') {
      await control.click();
    }

    await expect(control).toHaveAttribute('aria-checked', 'true');
  }
}

async function clearSpecialCircumstances(page: Page): Promise<void> {
  const selections = page.getByRole('checkbox', { name: 'Select', exact: true });
  await expect(selections).toHaveCount(SPECIAL_CIRCUMSTANCE_COUNT);

  for (let index = 0; index < await selections.count(); index += 1) {
    const selection = selections.nth(index);
    if (await selection.getAttribute('aria-checked') === 'true') {
      await selection.click();
    }
    await expect(selection).toHaveAttribute('aria-checked', 'false');
  }
}

async function clearExistingPriority(page: Page): Promise<void> {
  const priority = page.locator('[data-uda-name="assessedpriority"] [role="combobox"]:visible');
  const clearSelection = priority.getByRole('button', { name: 'Clear selection', exact: true });

  if (await clearSelection.count() > 0 && await clearSelection.isVisible()) {
    await clearSelection.click();
  }
}

async function calculatePriority(page: Page): Promise<Locator> {
  const calculatePriority = page.getByRole('button', {
    name: 'Calculate Priority',
    exact: true,
  });

  await expect(calculatePriority).toBeEnabled();
  await calculatePriority.click();

  return page.locator('[data-uda-name="assessedpriority"] [role="combobox"]:visible');
}

test.describe('Priority & Risk UI coverage @e2e @staff @risk-prioritization @ui', () => {
  test('RISK-UI-001 | Active lead investigator task exposes Priority & Risk controls', async ({ page }) => {
    await openActiveAapaPriorityRisk(page);

    await expect(
      page.getByRole('button', { name: 'Calculate Priority', exact: true }),
      'Calculate Priority should be available',
    ).toBeVisible();

    const ratingControls = page.locator(
      '[role="checkbox"][aria-label="Low"], [role="checkbox"][aria-label="Medium"], [role="checkbox"][aria-label="High"], [role="checkbox"][aria-label="Critical"]',
    );
    await expect(ratingControls, 'All 12 criteria should expose four rating choices').toHaveCount(
      CRITERIA_RATING_COUNT,
    );

    const specialCircumstances = page.getByRole('checkbox', {
      name: 'Select',
      exact: true,
    });
    await expect(
      specialCircumstances,
      'All Special Circumstances rows should be visible',
    ).toHaveCount(SPECIAL_CIRCUMSTANCE_COUNT);
  });

  test('RISK-UI-002 | Calculate Priority action is available before rating input', async ({ page }) => {
    await openActiveAapaPriorityRisk(page);

    const calculatePriority = page.getByRole('button', {
      name: 'Calculate Priority',
      exact: true,
    });
    await expect(calculatePriority).toBeVisible();
    await expect(calculatePriority).toBeEnabled();
  });

  test('RISK-UI-003 | Criteria and Special Circumstances calculate Critical priority', async ({ page }) => {
    await openActiveAapaPriorityRisk(page);

    const ratingControls = page.locator(
      '[role="checkbox"][aria-label="Low"], [role="checkbox"][aria-label="Medium"], [role="checkbox"][aria-label="High"], [role="checkbox"][aria-label="Critical"]',
    );
    await expect(ratingControls).toHaveCount(CRITERIA_RATING_COUNT);

    await setAllCriteriaRating(page, 'Medium');

    for (const circumstance of SPECIAL_CIRCUMSTANCES) {
      const row = page.getByText(circumstance, { exact: true }).locator('xpath=ancestor::tr[1]');
      const select = row.getByRole('checkbox', { name: 'Select', exact: true });
      await select.click();
      await expect(select).toHaveAttribute('aria-checked', 'true');
    }

    const assessedPriority = await calculatePriority(page);
    await expect(
      assessedPriority,
      'Critical Special Circumstances should set the resulting priority to Critical',
    ).toHaveText('Critical');
  });

  test('RISK-UI-004 | All Low ratings calculate Low priority', async ({ page }) => {
    await openActiveAapaPriorityRisk(page);
    await clearExistingPriority(page);
    await clearSpecialCircumstances(page);
    await setAllCriteriaRating(page, 'Low');

    await expect(await calculatePriority(page)).toHaveText('Low');
  });

  test('RISK-UI-005 | All Medium ratings calculate Medium priority', async ({ page }) => {
    await openActiveAapaPriorityRisk(page);
    await clearExistingPriority(page);
    await clearSpecialCircumstances(page);
    await setAllCriteriaRating(page, 'Medium');

    await expect(await calculatePriority(page)).toHaveText('Medium');
  });

  test('RISK-UI-006 | All High ratings calculate High priority', async ({ page }) => {
    await openActiveAapaPriorityRisk(page);
    await clearExistingPriority(page);
    await clearSpecialCircumstances(page);
    await setAllCriteriaRating(page, 'High');

    await expect(await calculatePriority(page)).toHaveText('High');
  });

  test('RISK-UI-007 | All Critical ratings calculate Critical priority', async ({ page }) => {
    await openActiveAapaPriorityRisk(page);
    await clearExistingPriority(page);
    await clearSpecialCircumstances(page);
    await setAllCriteriaRating(page, 'Critical');

    await expect(await calculatePriority(page)).toHaveText('Critical');
  });
});
