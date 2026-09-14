import { test, expect } from '@playwright/test';
import { FollowUpAccessPage } from '../../../../pages/public/follow-up/FollowUpAccessPage';

test('Invalid PIN is rejected @regression @followup @negative',
async ({ page }) => {
  const access = new FollowUpAccessPage(page);

  await access.open();
  await access.access({
    referenceNumber: 'INVALID-REFERENCE',
    pin: '0000'
  });

  await expect(
    page.getByText(/invalid|not found|incorrect/i).first()
  ).toBeVisible();
});
