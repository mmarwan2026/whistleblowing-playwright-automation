import { expect, Page, test } from '@playwright/test';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';

async function openEntities(page: Page): Promise<SubmitReportPage> {
  const submit = new SubmitReportPage(page);
  const notice = new ReportingNoticePage(page);
  await submit.open(); await notice.next();
  await submit.reporterInfo.fill({ identityType: 'anonymous', reporterCategory: 'Employee' });
  await submit.reporterInfo.next();
  await submit.reportDetails.fill({ category: 'Conflict of Interest-Nepotism/Cronyism', incidentDescription: 'Synthetic entities smoke scenario.', awarenessMethod: 'Synthetic automation validation.', incidentDate: '2026-01-01', ongoing: 'No' });
  await submit.reportDetails.next();
  await submit.personsInvolved.fill({ canIdentify: 'No' }); await submit.personsInvolved.next();
  await submit.entitiesInvolved.verifyLoaded();
  return submit;
}

test.describe('Entities Involved @public @intake', () => {
  test('TC-043 | User can continue when entity details are unknown @smoke @public @intake', async ({ page }) => {
    const submit = await openEntities(page);
    await submit.entitiesInvolved.fill({ canIdentify: 'No' }); await submit.entitiesInvolved.next();
    await submit.previousReporting.verifyLoaded();
  });

  test('TC-044 | User can identify an entity and enter its current name @smoke @public @intake', async ({ page }) => {
    const submit = await openEntities(page); await submit.entitiesInvolved.selectCanIdentify('Yes');
    expect(await submit.entitiesInvolved.getEntityCount()).toBe(1);
    const name = page.getByRole('textbox', { name: 'Entity Name 1', exact: true });
    await name.fill('Synthetic Test Supplier'); await expect(name).toHaveValue('Synthetic Test Supplier');
  });

  test('TC-045 | Entity details remain on the current step when no entity name is entered @regression @validation @public @intake', async ({ page }) => {
    const submit = await openEntities(page); await submit.entitiesInvolved.selectCanIdentify('Yes'); await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Entities Involved', level: 2 })).toBeVisible();
  });

  test('TC-046 | User can add multiple current entity rows @regression @public @intake', async ({ page }) => {
    const submit = await openEntities(page); await submit.entitiesInvolved.selectCanIdentify('Yes');
    await page.getByRole('textbox', { name: 'Entity Name 1', exact: true }).fill('Synthetic Test Supplier');
    await submit.entitiesInvolved.addEntity();
    const second = page.getByRole('textbox', { name: 'Entity Name 2', exact: true });
    await expect(second).toBeVisible(); await second.fill('Synthetic Test Contractor');
    expect(await submit.entitiesInvolved.getEntityCount()).toBe(2);
  });

  test('TC-048 | Entity selection persists after Back navigation @regression @navigation @public @intake', async ({ page }) => {
    const submit = await openEntities(page); await submit.entitiesInvolved.selectCanIdentify('Yes');
    const name = page.getByRole('textbox', { name: 'Entity Name 1', exact: true }); await name.fill('Synthetic Persisted Entity');
    await submit.entitiesInvolved.next(); await submit.previousReporting.back();
    await expect(page.getByRole('heading', { name: 'Entities Involved', level: 2 })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: "I'm not aware of the entity(s) involved details" })).not.toBeChecked();
    await expect(page.getByRole('textbox', { name: 'Entity Name 1', exact: true })).toHaveValue('Synthetic Persisted Entity');
  });
});
