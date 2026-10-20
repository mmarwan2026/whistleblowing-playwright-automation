import { expect, Page, test } from '@playwright/test';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';

async function openPersonsInvolved(page: Page): Promise<SubmitReportPage> {
  const submit = new SubmitReportPage(page);
  const notice = new ReportingNoticePage(page);

  await submit.open();
  await notice.verifyLoaded();
  await notice.next();
  await submit.reporterInfo.fill({ identityType: 'anonymous', reporterCategory: 'Employee' });
  await submit.reporterInfo.next();
  await submit.reportDetails.fill({
    category: 'Conflict of Interest-Nepotism/Cronyism',
    incidentDescription: 'Synthetic person involvement smoke scenario.',
    awarenessMethod: 'Synthetic automation validation.',
    incidentDate: '2026-01-01',
    ongoing: 'No'
  });
  await submit.reportDetails.next();
  await submit.personsInvolved.verifyLoaded();
  return submit;
}

test('TC-043 | User can continue when person details are unknown @smoke @public @intake', async ({ page }) => {
  const submit = await openPersonsInvolved(page);
  await submit.personsInvolved.fill({ canIdentify: 'No' });
  await submit.personsInvolved.next();
  await submit.entitiesInvolved.verifyLoaded();
});

test('TC-045 | User can add a witness through Person(s) Involved @smoke @public @intake', async ({ page }) => {
  const submit = await openPersonsInvolved(page);
  await submit.personsInvolved.fill({
    canIdentify: 'Yes',
    persons: [{
      fullName: 'Synthetic Witness',
      position: 'Synthetic Safety Specialist',
      company: 'Synthetic Test Company',
      department: 'Synthetic Health and Safety',
      roleInIncident: 'Witness'
    }]
  });

  await expect(page.getByRole('textbox', { name: 'Full Name 1', exact: true })).toHaveValue('Synthetic Witness');
  await expect(page.getByRole('combobox', { name: 'Role In Incident 1', exact: true })).toHaveValue('Witness');
  expect(await submit.personsInvolved.getPersonCount()).toBe(1);
  await submit.personsInvolved.next();
  await submit.entitiesInvolved.verifyLoaded();
});

test('TC-046 | User can add multiple involved people including a witness @regression @public @intake', async ({ page }) => {
  const submit = await openPersonsInvolved(page);
  await submit.personsInvolved.fill({
    canIdentify: 'Yes',
    persons: [
      {
        fullName: 'Synthetic Accused Person',
        position: 'Synthetic Manager',
        company: 'Synthetic Test Company',
        roleInIncident: 'Alleged Perpetrator'
      },
      {
        fullName: 'Synthetic Witness',
        position: 'Synthetic Specialist',
        company: 'Synthetic Test Company',
        roleInIncident: 'Witness'
      }
    ]
  });

  expect(await submit.personsInvolved.getPersonCount()).toBe(2);
  await expect(page.getByRole('textbox', { name: 'Full Name 2', exact: true })).toHaveValue('Synthetic Witness');
  await expect(page.getByRole('combobox', { name: 'Role In Incident 2', exact: true })).toHaveValue('Witness');
});

test('TC-047 | Person(s) Involved data persists after Back navigation @regression @navigation @public @intake', async ({ page }) => {
  const submit = await openPersonsInvolved(page);
  await submit.personsInvolved.fill({
    canIdentify: 'Yes',
    persons: [{
      fullName: 'Synthetic Persisted Witness',
      position: 'Synthetic Specialist',
      company: 'Synthetic Test Company',
      roleInIncident: 'Witness'
    }]
  });
  await submit.personsInvolved.next();
  await submit.entitiesInvolved.back();

  await expect(page.getByRole('textbox', { name: 'Full Name 1', exact: true })).toHaveValue('Synthetic Persisted Witness');
  await expect(page.getByRole('combobox', { name: 'Role In Incident 1', exact: true })).toHaveValue('Witness');
});
