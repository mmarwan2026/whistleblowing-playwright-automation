import { Page } from '@playwright/test';

export class EmailReviewPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async addKeyword(keyword: string) { await this.page.getByLabel(/keyword/i).fill(keyword); }
}
