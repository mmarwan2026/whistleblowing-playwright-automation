import { Page } from '@playwright/test';

export class BackgroundCheckPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async requestCheck() { await this.page.getByRole('button', { name: /background/i }).click(); }
}
