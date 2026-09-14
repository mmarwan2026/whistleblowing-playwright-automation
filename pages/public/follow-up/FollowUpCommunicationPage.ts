import { Page, expect } from '@playwright/test';
import { FollowUpMessage } from '../../../models/public/FollowUpMessage';

export class FollowUpCommunicationPage {
  constructor(private readonly page: Page) {}

  async sendMessage(message: FollowUpMessage) {
    await this.page.getByRole('textbox').last().fill(message.text);

    if (message.attachmentPath) {
      await this.page.locator('input[type="file"]').setInputFiles(message.attachmentPath);
    }

    await this.page.getByRole('button', { name: /send/i }).click();
  }

  async expectMessage(text: string) {
    await expect(this.page.getByText(text, { exact: false })).toBeVisible();
  }
}
