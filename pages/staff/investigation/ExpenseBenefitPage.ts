import { Page } from '@playwright/test';

export class ExpenseBenefitPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async open() { await this.page.getByText(/expense|benefit/i).first().click(); }
}
