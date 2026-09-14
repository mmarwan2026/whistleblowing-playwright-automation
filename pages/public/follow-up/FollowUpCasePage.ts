import { Page, expect } from '@playwright/test';

export class FollowUpCasePage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByText(/case|report status/i).first()).toBeVisible();
  }
}
