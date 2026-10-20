import { expect, Page, test } from '@playwright/test';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';

async function navigateToDeclaration(page: Page): Promise<SubmitReportPage> {
  const submit = new SubmitReportPage(page);
  const notice = new ReportingNoticePage(page);

  await submit.open();
  await notice.verifyLoaded();
  await notice.next();
  await submit.reporterInfo.fill({ identityType: 'anonymous', reporterCategory: 'Employee' });
  await submit.reporterInfo.next();
  await submit.reportDetails.fill({
    category: 'Conflict of Interest-Nepotism/Cronyism',
    incidentDescription: 'Synthetic declaration smoke scenario.',
    awarenessMethod: 'Synthetic automation validation.',
    incidentDate: '2026-01-01',
    ongoing: 'No'
  });
  await submit.reportDetails.next();
  await submit.personsInvolved.fill({ canIdentify: 'No' });
  await submit.personsInvolved.next();
  await submit.entitiesInvolved.fill({ canIdentify: 'No' });
  await submit.entitiesInvolved.next();
  await submit.previousReporting.fill({ previouslyReported: 'No' });
  await submit.previousReporting.next();
  await submit.evidence.fill({ hasSupportingEvidence: 'No' });
  await submit.evidence.next();
  await submit.declaration.verifyLoaded();
  return submit;
}

test('TC-092 | Declaration displays the current acknowledgement and submit action @smoke @public @intake', async ({ page }) => {
  const submit = await navigateToDeclaration(page);
  await expect(page.getByRole('checkbox')).toHaveCount(1);
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Submit Report', exact: true })).toBeVisible();
  await submit.declaration.verifySubmitEnabled();
});

test('TC-093 | Declaration blocks submission until acknowledgement is accepted @regression @validation @negative @public @intake', async ({ page }) => {
  const submit = await navigateToDeclaration(page);
  await submit.declaration.clickSubmit();
  await expect(page.getByRole('heading', { name: 'Declaration', level: 2 })).toBeVisible();
});

test('TC-096 | User can accept the current declaration acknowledgement @smoke @public @intake', async ({ page }) => {
  const submit = await navigateToDeclaration(page);
  await submit.declaration.acceptAllAcknowledgements();
  await submit.declaration.verifyBothAcknowledgementsChecked();
  await submit.declaration.verifySubmitEnabled();
});

test('TC-097 | User can accept the declaration and submit the report successfully @smoke @public @intake', async ({ page }) => {
  const submit = await navigateToDeclaration(page);
  await submit.declaration.acceptAllAcknowledgements();
  await submit.declaration.submit();
  await expect(page.getByRole('heading', { name: 'Thank You', level: 1 })).toBeVisible();
});
