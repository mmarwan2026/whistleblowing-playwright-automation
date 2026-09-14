import { Page } from '@playwright/test';

export class SapPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async createObjective(text: string) { await this.page.getByLabel(/objective/i).fill(text); }
}
