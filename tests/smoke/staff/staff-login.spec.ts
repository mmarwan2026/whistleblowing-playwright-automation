import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/staff/LoginPage';

test('Investigator can login @smoke @staff',
async ({ page }) => {
  test.skip(
    !process.env.INVESTIGATOR_EMAIL || !process.env.INVESTIGATOR_PASSWORD,
    'Investigator credentials are not configured.'
  );

  const login = new LoginPage(page);
  await login.open();
  await login.login(
    process.env.INVESTIGATOR_EMAIL!,
    process.env.INVESTIGATOR_PASSWORD!
  );

  await expect(page.getByText(/dashboard/i).first()).toBeVisible();
});
