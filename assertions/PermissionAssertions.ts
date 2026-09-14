import { expect, Locator } from '@playwright/test';

export class PermissionAssertions {
  static async denied(locator: Locator) {
    await expect(locator).toBeHidden();
  }

  static async allowed(locator: Locator) {
    await expect(locator).toBeVisible();
  }
}
