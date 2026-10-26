import { expect, Page, test } from '@playwright/test';
import { openIntakeStep } from './support/openIntakeStep';

async function openPersons(page: Page) {
  return openIntakeStep(page, 'personsInvolved');
}

test.describe('Person(s) Involved @public @intake', () => {
  test('TC-029 | User can continue when person details are unknown @smoke @public @intake', async ({ page }) => {
    const submit = await openPersons(page); await submit.personsInvolved.fill({ canIdentify: 'No' }); await submit.personsInvolved.next(); await submit.entitiesInvolved.verifyLoaded();
  });
  test('TC-030 | User can add a witness through Person(s) Involved @smoke @public @intake', async ({ page }) => {
    const submit = await openPersons(page);
    await submit.personsInvolved.fill({ canIdentify: 'Yes', persons: [{ fullName: 'Synthetic Witness', position: 'Synthetic Specialist', company: 'Synthetic Test Company', roleInIncident: 'Witness' }] });
    await expect(page.getByRole('textbox', { name: 'Full Name 1', exact: true })).toHaveValue('Synthetic Witness'); await expect(page.getByRole('combobox', { name: 'Role In Incident 1', exact: true })).toHaveValue('Witness');
    expect(await submit.personsInvolved.getPersonCount()).toBe(1);
    await submit.personsInvolved.next();
    await submit.entitiesInvolved.verifyLoaded();
  });
  test('TC-039 | User can add multiple current involved people @regression @public @intake', async ({ page }) => {
    const submit = await openPersons(page);
    await submit.personsInvolved.fill({ canIdentify: 'Yes', persons: [{ fullName: 'Synthetic Accused Person', position: 'Synthetic Manager', company: 'Synthetic Test Company', roleInIncident: 'Alleged Perpetrator' }, { fullName: 'Synthetic Witness', position: 'Synthetic Specialist', company: 'Synthetic Test Company', roleInIncident: 'Witness' }] });
    expect(await submit.personsInvolved.getPersonCount()).toBe(2); await expect(page.getByRole('textbox', { name: 'Full Name 2', exact: true })).toHaveValue('Synthetic Witness');
  });
  test('TC-041 | Person selection persists after Back navigation @regression @navigation @public @intake', async ({ page }) => {
    const submit = await openPersons(page);
    await submit.personsInvolved.fill({ canIdentify: 'Yes', persons: [{ fullName: 'Synthetic Persisted Witness', position: 'Synthetic Specialist', company: 'Synthetic Test Company', roleInIncident: 'Witness' }] });
    await submit.personsInvolved.next(); await submit.entitiesInvolved.back();
    await expect(page.getByRole('textbox', { name: 'Full Name 1', exact: true })).toHaveValue('Synthetic Persisted Witness'); await expect(page.getByRole('combobox', { name: 'Role In Incident 1', exact: true })).toHaveValue('Witness');
  });
});
