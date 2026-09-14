import { Page } from '@playwright/test';

export class CommunicationPage {
  constructor(private readonly page: Page) {}

  // TODO: confirm exact staff UI locators for this module.
  async send(text: string) { await this.page.getByRole('textbox').last().fill(text); await this.page.getByRole('button', { name: /send/i }).click(); }
}
