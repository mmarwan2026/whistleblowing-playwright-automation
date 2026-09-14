import { expect, Page } from '@playwright/test';

export class Toast {
  constructor(private readonly page: Page) {}

  async expectMessage(message: string | RegExp) {
    const toast = this.page
      .getByRole('alert')
      .or(this.page.locator('[role="status"]'))
      .filter({ hasText: message });

    await expect(toast.first()).toBeVisible();
  }
}
