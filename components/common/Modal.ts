import { Locator, expect } from '@playwright/test';

export class Modal {
  constructor(private readonly root: Locator) {}

  async expectOpen() {
    await expect(this.root).toBeVisible();
  }

  async close() {
    await this.root.getByRole('button', { name: /close|cancel/i }).click();
  }
}
