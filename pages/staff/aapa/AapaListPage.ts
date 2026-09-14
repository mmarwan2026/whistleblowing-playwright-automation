import { Page } from '@playwright/test';

export class AapaListPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async openCase(reference: string) { await this.page.getByText(reference, { exact: false }).click(); }
}
