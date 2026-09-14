import { Locator, Page, expect } from '@playwright/test';

export class Table {
  constructor(
    private readonly page: Page,
    private readonly root: Locator
  ) {}

  rowByText(text: string) {
    return this.root.getByRole('row').filter({ hasText: text });
  }

  async expectRow(text: string) {
    await expect(this.rowByText(text)).toBeVisible();
  }
}
