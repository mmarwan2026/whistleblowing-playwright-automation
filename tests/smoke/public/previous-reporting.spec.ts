import { expect, Page, test } from '@playwright/test';
import { openIntakeStep } from './support/openIntakeStep';

async function openPreviousReporting(page: Page) {
  return openIntakeStep(page, 'previousReporting');
}

test.describe('Previous Reporting @public @intake', () => {
  test('TC-063 | Current Previous Reporting step displays its first-time option @smoke @public @intake', async ({ page }) => {
    const submit = await openPreviousReporting(page); await expect(page.getByRole('radio', { name: /first time I am reporting/i })).toBeVisible(); await submit.previousReporting.selectPreviouslyReported('No');
  });
  test('TC-064 | First-time reporting continues to Evidence @smoke @public @intake', async ({ page }) => {
    const submit = await openPreviousReporting(page); await submit.previousReporting.fill({ previouslyReported: 'No' }); await submit.previousReporting.next(); await submit.evidence.verifyLoaded();
  });
  test('TC-067 | Previously reported option exposes current conditional controls @regression @conditional @public @intake', async ({ page }) => {
    const submit = await openPreviousReporting(page); await submit.previousReporting.selectPreviouslyReported('Yes'); await submit.previousReporting.verifySystemReferenceQuestionVisible();
  });
  test('TC-068 | Another reporting channel can be selected @smoke @conditional @public @intake', async ({ page }) => {
    const submit = await openPreviousReporting(page); await submit.previousReporting.selectReportingOption('anotherChannel');
  });
  test('TC-082 | Previous Reporting selection persists after Back navigation @regression @navigation @public @intake', async ({ page }) => {
    const submit = await openPreviousReporting(page); await submit.previousReporting.fill({ previouslyReported: 'No' }); await submit.previousReporting.next(); await submit.evidence.back(); await submit.previousReporting.verifyLoaded(); await expect(page.getByRole('radio', { name: /first time I am reporting/i })).toBeChecked();
  });
});
