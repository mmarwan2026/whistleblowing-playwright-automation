import { Page } from '@playwright/test';

export class MemoPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async createMemo() { await this.page.getByRole('button', { name: /memo/i }).click(); }
}
