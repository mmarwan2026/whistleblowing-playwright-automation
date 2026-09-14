import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByText(/dashboard/i).first()).toBeVisible();
  }

  async openCase(referenceNumber: string) {
    const search = this.page.getByPlaceholder(/search/i)
      .or(this.page.getByRole('textbox', { name: /search/i }));

    await search.fill(referenceNumber);
    await this.page.getByText(referenceNumber, { exact: false }).click();
  }
}
