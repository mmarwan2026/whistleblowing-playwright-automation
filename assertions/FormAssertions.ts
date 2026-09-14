import { expect, Locator } from '@playwright/test';

export class FormAssertions {
  static async hasValue(locator: Locator, value: string) {
    await expect(locator).toHaveValue(value);
  }

  static async invalid(locator: Locator) {
    await expect(locator).toHaveAttribute('aria-invalid', 'true');
  }
}
