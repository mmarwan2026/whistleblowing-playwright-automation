import { Page } from '@playwright/test';

export class InterviewPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async createInterview() { await this.page.getByRole('button', { name: /interview/i }).click(); }
}
