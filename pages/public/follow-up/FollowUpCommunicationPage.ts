import {
  expect,
  Page
} from '@playwright/test';

import {
  FollowUpMessage
} from '../../../models/public/FollowUpMessage';

export class FollowUpCommunicationPage {

  constructor(
    private readonly page: Page
  ) { }

  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  async sendMessage(
    message: FollowUpMessage
  ): Promise<void> {

    const messageInput = this.page
      .frameLocator('#yourmessage iframe')
      .locator('body[contenteditable="true"]');

    await expect(
      messageInput
    ).toBeVisible();

    await messageInput.fill(
      message.text
    );

    // TinyMCE publishes its value to the form when the editor loses focus.
    await messageInput.press('Tab');

    // --------------------------------------------------------
    // OPTIONAL ATTACHMENT
    // --------------------------------------------------------

    if (message.attachmentPath) {

      const fileInput =
        this.page.locator(
          'input[type="file"]'
        );

      await fileInput.setInputFiles(
        message.attachmentPath
      );
    }

    // --------------------------------------------------------
    // SEND
    // --------------------------------------------------------

    const sendButton = this.page.getByRole('button', {
      name: 'Send Message',
      exact: true
    });

    await expect(
      sendButton
    ).toBeVisible();

    await expect(
      sendButton
    ).toBeEnabled();

    await sendButton.click();
  }

  // ==========================================================
  // VERIFY MESSAGE
  // ==========================================================

  async expectMessage(
    text: string
  ): Promise<void> {

    await expect(
      this.page.getByText(text, { exact: true })
    ).toBeVisible();
  }
}
