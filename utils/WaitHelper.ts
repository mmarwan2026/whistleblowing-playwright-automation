import { expect, Locator } from '@playwright/test';

export class WaitHelper {
  static async untilVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }
}
