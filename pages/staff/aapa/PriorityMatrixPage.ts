import { Page } from '@playwright/test';

export class PriorityMatrixPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async choosePriority(priority: string) { await this.page.getByText(priority, { exact: true }).click(); }
}
