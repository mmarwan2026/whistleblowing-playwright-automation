import { Page } from '@playwright/test';

export class ArchivePage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async archive() { await this.page.getByRole('button', { name: /archive/i }).click(); }
}
