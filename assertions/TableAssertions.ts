import { expect, Locator } from '@playwright/test';

export class TableAssertions {
  static async rowCount(root: Locator, count: number) {
    await expect(root.getByRole('row')).toHaveCount(count);
  }
}
