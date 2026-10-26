import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/staff/LoginPage';

test('Lead investigator can login @smoke @staff',
  async ({ page }) => {
    test.setTimeout(90_000);
    test.skip(
      !process.env.LEAD_INVESTIGATOR_USERNAME || !process.env.LEAD_INVESTIGATOR_PASSWORD,
      'Lead investigator credentials are not configured.'
    );

    const login = new LoginPage(page);
    await login.open();
    await login.login(
      process.env.LEAD_INVESTIGATOR_USERNAME!,
      process.env.LEAD_INVESTIGATOR_PASSWORD!
    );

    await expect(page).not.toHaveURL(/\/login(?:[/?#]|$)/i, { timeout: 60_000 });
  });
