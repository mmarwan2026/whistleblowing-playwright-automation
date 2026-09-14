import { Page } from '@playwright/test';

export class ReportPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async createReport() { await this.page.getByRole('button', { name: /report/i }).click(); }
}
