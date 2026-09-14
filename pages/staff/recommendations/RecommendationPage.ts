import { Page } from '@playwright/test';

export class RecommendationPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async add(text: string) { await this.page.getByRole('button', { name: /add.*recommendation/i }).click(); await this.page.getByRole('textbox').last().fill(text); }
}
