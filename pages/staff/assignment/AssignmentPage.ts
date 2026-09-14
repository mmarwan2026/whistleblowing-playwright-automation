import { Page } from '@playwright/test';

export class AssignmentPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async assignTo(name: string) { await this.page.getByLabel(/assignee|investigator/i).fill(name); await this.page.getByRole('button', { name: /assign/i }).click(); }
}
