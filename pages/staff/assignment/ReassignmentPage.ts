import { Page } from '@playwright/test';

export class ReassignmentPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async reassignTo(name: string) { await this.page.getByRole('button', { name: /reassign/i }).click(); await this.page.getByLabel(/assignee|investigator/i).fill(name); }
}
