import { Page } from '@playwright/test';

export class FindingsPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async addFinding(text: string) { await this.page.getByRole('button', { name: /add.*finding/i }).click(); await this.page.getByRole('textbox').last().fill(text); }
}
