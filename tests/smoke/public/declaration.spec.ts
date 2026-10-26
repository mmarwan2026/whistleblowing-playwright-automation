import { expect, test } from '@playwright/test';
import { submitAndValidate } from '../../../helpers/public/submitReportAssertions';
import { openIntakeStep } from './support/openIntakeStep';

test('TC-092 | Declaration displays the current acknowledgement and submit action @smoke @public @intake', async ({ page }) => {
  const submit = await openIntakeStep(page, 'declaration');
  await expect(page.getByRole('checkbox')).toHaveCount(1);
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Submit Report', exact: true })).toBeVisible();
  await submit.declaration.verifySubmitEnabled();
});

test('TC-093 | Declaration blocks submission until acknowledgement is accepted @regression @validation @negative @public @intake', async ({ page }) => {
  const submit = await openIntakeStep(page, 'declaration');
  await submit.declaration.clickSubmit();
  await expect(page.getByRole('heading', { name: 'Declaration', level: 2 })).toBeVisible();
});

test('TC-096 | User can accept the current declaration acknowledgement @smoke @public @intake', async ({ page }) => {
  const submit = await openIntakeStep(page, 'declaration');
  await submit.declaration.acceptAcknowledgement();
  await submit.declaration.verifyAcknowledgementChecked();
  await submit.declaration.verifySubmitEnabled();
});

test('TC-097 | User can accept the declaration and submit the report successfully @smoke @public @intake', async ({ page }) => {
  const submit = await openIntakeStep(page, 'declaration');
  await submit.declaration.acceptAcknowledgement();
  const result = await submitAndValidate(page, submit, 'TC-097');
  expect(result.reference).toBeTruthy();
});
