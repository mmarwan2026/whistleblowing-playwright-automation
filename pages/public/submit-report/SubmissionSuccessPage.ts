import { Page, expect } from '@playwright/test';
import { SubmissionResult } from '../../../models/public/SubmissionResult';

export class SubmissionSuccessPage {
  constructor(private readonly page: Page) {}

  async expectSuccess() {
    await expect(this.page.getByText(/success|submitted/i).first()).toBeVisible();
  }

  async getResult(): Promise<SubmissionResult> {
    // TODO: replace these with confirmed test IDs/labels from the real success screen.
    const referenceNumber = await this.page
      .getByTestId('reference-number')
      .innerText();

    const pin = await this.page
      .getByTestId('pin')
      .innerText();

    return {
      referenceNumber: referenceNumber.trim(),
      pin: pin.trim()
    };
  }
}
