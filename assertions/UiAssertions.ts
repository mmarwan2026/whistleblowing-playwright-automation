import { expect, Locator } from '@playwright/test';

export class UiAssertions {
  static async visible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  static async hidden(locator: Locator) {
    await expect(locator).toBeHidden();
  }
}
