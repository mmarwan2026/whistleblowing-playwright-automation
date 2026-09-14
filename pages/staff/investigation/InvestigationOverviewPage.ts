import { Page } from '@playwright/test';

export class InvestigationOverviewPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async expectLoaded() { await this.page.getByText(/investigation/i).first().waitFor(); }
}
