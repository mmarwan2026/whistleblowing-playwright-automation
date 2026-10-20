import { expect, Locator, Page } from '@playwright/test';

const ACK = 'I have read and agree with the above and wish to submit my report.';

export class DeclarationStep {
  constructor(private readonly page: Page) {}
  private acknowledgement(): Locator { return this.page.getByRole('checkbox', { name: ACK }); }
  private submitButton(): Locator { return this.page.getByRole('button', { name: 'Submit Report', exact: true }); }

  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Declaration', level: 2 })).toBeVisible();
    await expect(this.acknowledgement()).toBeVisible();
    await expect(this.submitButton()).toBeVisible();
  }

  async acceptFirstAcknowledgement(): Promise<void> {
    const checkbox = this.acknowledgement();
    if (!(await checkbox.isChecked())) await checkbox.click();
    await expect(checkbox).toBeChecked();
  }

  async acceptSecondAcknowledgement(): Promise<void> { await this.acceptFirstAcknowledgement(); }
  async uncheckFirstAcknowledgement(): Promise<void> { await this.acknowledgement().uncheck(); }
  async uncheckSecondAcknowledgement(): Promise<void> { await this.acknowledgement().uncheck(); }
  async acceptAllAcknowledgements(): Promise<void> { await this.acceptFirstAcknowledgement(); }

  async verifyBothAcknowledgementsChecked(): Promise<void> {
    await expect(this.acknowledgement()).toBeChecked();
  }

  async verifySubmitEnabled(): Promise<void> { await expect(this.submitButton()).toBeEnabled(); }
  async verifySubmitDisabled(): Promise<void> { await expect(this.submitButton()).toBeDisabled(); }
  async clickSubmit(): Promise<void> { await this.submitButton().click(); }

  async submit(): Promise<void> {
    await this.verifyBothAcknowledgementsChecked();
    await this.submitButton().click();
  }

  async back(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back', exact: true }).click();
  }
}
