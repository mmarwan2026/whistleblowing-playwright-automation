import { Page } from '@playwright/test';

export class WorkingPaperPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async saveObjective(text: string) { await this.page.getByLabel(/objective/i).fill(text); }
}
