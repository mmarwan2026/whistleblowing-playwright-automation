import { expect, Locator, Page } from '@playwright/test';
import { DeclarationData, isDeclarationAccepted } from '../../../../models/public/DeclarationData';

const ACK = 'I have read and agree with the above and wish to submit my report.';
const DECLARATION_HEADING = 'Declaration';
const SUBMIT_REPORT = 'Submit Report';

export class DeclarationStep {
  constructor(private readonly page: Page) {}
  private acknowledgement(): Locator { return this.page.getByRole('checkbox', { name: ACK }); }
  private submitButton(): Locator { return this.page.getByRole('button', { name: SUBMIT_REPORT, exact: true }); }

  async verifyLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: DECLARATION_HEADING, level: 2 })).toBeVisible();
    await expect(this.acknowledgement()).toBeVisible();
    await expect(this.submitButton()).toBeVisible();
  }

  async acceptAcknowledgement(): Promise<void> {
    const checkbox = this.acknowledgement();
    if (!(await checkbox.isChecked())) await checkbox.click();
    await expect(checkbox).toBeChecked();
  }

  async uncheckAcknowledgement(): Promise<void> { await this.acknowledgement().uncheck(); }

  async verifyAcknowledgementUnchecked(): Promise<void> {
    await expect(this.acknowledgement()).not.toBeChecked();
  }

  async verifyAcknowledgementChecked(): Promise<void> {
    await expect(this.acknowledgement()).toBeChecked();
  }

  async verifySubmitEnabled(): Promise<void> { await expect(this.submitButton()).toBeEnabled(); }
  async verifySubmitDisabled(): Promise<void> { await expect(this.submitButton()).toBeDisabled(); }
  async clickSubmit(): Promise<void> { await this.submitButton().click(); }

  async verifySubmissionBlockedWithoutAcknowledgement(): Promise<void> {
    await this.verifyAcknowledgementUnchecked();
    await this.clickSubmit();
    await expect(this.page.getByRole('heading', { name: DECLARATION_HEADING, level: 2 })).toBeVisible();
  }

  async fill(data: DeclarationData): Promise<void> {
    if (!isDeclarationAccepted(data)) {
      await this.uncheckAcknowledgement();
      throw new Error('Declaration acknowledgement must be accepted before submission.');
    }

    await this.acceptAcknowledgement();
  }

  async submit(): Promise<void> {
    await this.verifyAcknowledgementChecked();
    await this.verifySubmitEnabled();
    await this.submitButton().click();
  }

  async back(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back', exact: true }).click();
  }
}
