import { Page, expect } from '@playwright/test';

export class FollowUpStatusPage {
  constructor(private readonly page: Page) {}

  async expectStatus(status: string) {
    await expect(this.page.getByText(status, { exact: false })).toBeVisible();
  }
}
