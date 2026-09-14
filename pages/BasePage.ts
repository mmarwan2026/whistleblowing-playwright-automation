import { expect, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async expectUrl(pathOrPattern: string | RegExp) {
    await expect(this.page).toHaveURL(pathOrPattern);
  }

  async expectText(text: string) {
    await expect(this.page.getByText(text, { exact: false })).toBeVisible();
  }
}
