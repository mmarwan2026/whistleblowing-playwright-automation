import { expect, Page } from '@playwright/test';

export class ReportingNoticePage {
  constructor(private readonly page: Page) {}

  async verifyLoaded() {
    await expect(
      this.page.getByRole('heading', {
        name: 'Reporting & Confidentiality Notice',
        level: 1
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', { name: 'Next' })
    ).toBeVisible();

    await expect(
      this.page.getByRole('link', { name: 'Cancel' })
    ).toBeVisible();
  }

  async next() {
    await this.page
      .getByRole('button', { name: 'Next' })
      .click();
  }

  async cancel() {
    await this.page
      .getByRole('link', { name: 'Cancel' })
      .click();
  }
}