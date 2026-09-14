import { Locator } from '@playwright/test';

export class Pagination {
  constructor(
    private readonly nextButton: Locator,
    private readonly previousButton: Locator
  ) {}

  async next() {
    await this.nextButton.click();
  }

  async previous() {
    await this.previousButton.click();
  }
}
