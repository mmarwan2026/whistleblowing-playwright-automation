import { Page } from '@playwright/test';

export class GTMCPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async approve() { await this.page.getByRole('button', { name: /approve/i }).click(); }
}
