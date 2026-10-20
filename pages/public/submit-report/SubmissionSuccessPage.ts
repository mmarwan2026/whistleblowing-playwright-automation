import { Page, expect } from '@playwright/test';
import { SubmissionResult } from '../../../models/public/SubmissionResult';

export class SubmissionSuccessPage {
  constructor(private readonly page: Page) {}

  async expectSuccess(): Promise<void> {
    await expect(
      this.page.getByRole('heading', {
        name: 'Thank You',
        level: 1
      })
    ).toBeVisible();

    await expect(
      this.page.getByText('Your report has been submitted successfully.', {
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', {
        name: 'Download Reference Number and Access Code',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', {
        name: 'Copy Reference & Access Code',
        exact: true
      })
    ).toBeVisible();
  }

  async getResult(): Promise<SubmissionResult> {
    const referenceNumber = await this.page
      .getByText(/^[A-Za-z0-9]{4}(?:-[A-Za-z0-9]{4}){2}$/)
      .innerText();

    const pin = await this.page
      .getByText(/^\d{6}$/)
      .innerText();

    return {
      referenceNumber: referenceNumber.trim(),
      pin: pin.trim()
    };
  }
}
