import { Page } from '@playwright/test';

export class ClosurePage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async closeCase() { await this.page.getByRole('button', { name: /close.*case/i }).click(); }
}
