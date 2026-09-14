import { test, expect } from '@playwright/test';
import { FollowUpAccessPage } from '../../pages/public/follow-up/FollowUpAccessPage';

test('Reference + PIN does not reveal a case for invalid credentials @security',
async ({ page }) => {
  const access = new FollowUpAccessPage(page);

  await access.open();
  await access.access({
    referenceNumber: `QA-${Date.now()}`,
    pin: '999999'
  });

  await expect(
    page.getByText(/invalid|not found|incorrect|unable/i).first()
  ).toBeVisible();
});
