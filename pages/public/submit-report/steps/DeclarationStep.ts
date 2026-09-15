import { expect, Page } from '@playwright/test';

export class DeclarationStep {
  constructor(
    private readonly page: Page
  ) {}

  // =========================================================
  // LOCATORS
  // =========================================================

  private declarationHeading() {
    return this.page.getByRole(
      'heading',
      {
        name: 'Declaration',
        level: 2
      }
    );
  }

  private firstAcknowledgement() {
    return this.page.getByRole(
      'checkbox',
      {
        name:
          /I confirm that the information provided in this report is complete, accurate, and true/i
      }
    );
  }

  private secondAcknowledgement() {
    return this.page.getByRole(
      'checkbox',
      {
        name:
          /I acknowledge that if I become aware of any inaccuracies, omissions, or additional relevant information/i
      }
    );
  }

  private backButton() {
    return this.page.getByRole(
      'button',
      {
        name: 'Back',
        exact: true
      }
    );
  }

  private submitButton() {
    return this.page.getByRole(
      'button',
      {
        name: 'Submit Report',
        exact: true
      }
    );
  }

  private saveError() {
    return this.page.getByText(
      'We could not save your application. Please try again.',
      {
        exact: true
      }
    );
  }

  // =========================================================
  // VERIFY PAGE
  // =========================================================

  async verifyLoaded() {
    await expect(
      this.declarationHeading()
    ).toBeVisible();

    await expect(
      this.page.getByText(
        /Both acknowledgements are required before submitting your report/i
      )
    ).toBeVisible();

    await expect(
      this.page.getByRole('checkbox')
    ).toHaveCount(2);

    await expect(
      this.firstAcknowledgement()
    ).toBeVisible();

    await expect(
      this.secondAcknowledgement()
    ).toBeVisible();

    await expect(
      this.backButton()
    ).toBeVisible();

    await expect(
      this.submitButton()
    ).toBeVisible();
  }

  // =========================================================
  // FIRST ACKNOWLEDGEMENT
  // =========================================================

  async acceptFirstAcknowledgement() {
    const checkbox =
      this.firstAcknowledgement();

    await expect(
      checkbox
    ).toBeVisible();

    await expect(
      checkbox
    ).toBeEnabled();

    if (!(await checkbox.isChecked())) {
      await checkbox.click();
    }

    await expect(
      checkbox
    ).toBeChecked();
  }

  // =========================================================
  // SECOND ACKNOWLEDGEMENT
  // =========================================================

  async acceptSecondAcknowledgement() {
    const checkbox =
      this.secondAcknowledgement();

    await expect(
      checkbox
    ).toBeVisible();

    await expect(
      checkbox
    ).toBeEnabled();

    if (!(await checkbox.isChecked())) {
      await checkbox.click();
    }

    await expect(
      checkbox
    ).toBeChecked();
  }

  // =========================================================
  // ACCEPT ALL
  // =========================================================

  async acceptAllAcknowledgements() {
    await this.acceptFirstAcknowledgement();

    await this.acceptSecondAcknowledgement();

    await this.verifyBothAcknowledgementsChecked();
  }

  // =========================================================
  // VERIFY FIRST CHECKED
  // =========================================================

  async verifyFirstAcknowledgementChecked() {
    await expect(
      this.firstAcknowledgement()
    ).toBeChecked();
  }

  // =========================================================
  // VERIFY SECOND CHECKED
  // =========================================================

  async verifySecondAcknowledgementChecked() {
    await expect(
      this.secondAcknowledgement()
    ).toBeChecked();
  }

  // =========================================================
  // VERIFY FIRST UNCHECKED
  // =========================================================

  async verifyFirstAcknowledgementUnchecked() {
    await expect(
      this.firstAcknowledgement()
    ).not.toBeChecked();
  }

  // =========================================================
  // VERIFY SECOND UNCHECKED
  // =========================================================

  async verifySecondAcknowledgementUnchecked() {
    await expect(
      this.secondAcknowledgement()
    ).not.toBeChecked();
  }

  // =========================================================
  // VERIFY BOTH CHECKED
  // =========================================================

  async verifyBothAcknowledgementsChecked() {
    await expect(
      this.firstAcknowledgement()
    ).toBeChecked();

    await expect(
      this.secondAcknowledgement()
    ).toBeChecked();
  }

  // =========================================================
  // VERIFY BOTH UNCHECKED
  // =========================================================

  async verifyBothAcknowledgementsUnchecked() {
    await expect(
      this.firstAcknowledgement()
    ).not.toBeChecked();

    await expect(
      this.secondAcknowledgement()
    ).not.toBeChecked();
  }

  // =========================================================
  // VERIFY SAVE ERROR
  // =========================================================

  async verifySaveErrorVisible() {
    await expect(
      this.saveError()
    ).toBeVisible();
  }

  // =========================================================
  // VERIFY SAVE ERROR NOT VISIBLE
  // =========================================================

  async verifySaveErrorHidden() {
    await expect(
      this.saveError()
    ).toBeHidden();
  }

  // =========================================================
  // BACK
  // =========================================================

  async back() {
    const button =
      this.backButton();

    await expect(
      button
    ).toBeVisible();

    await expect(
      button
    ).toBeEnabled();

    await button.click();
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  async submit() {
    const button =
      this.submitButton();

    await expect(
      button
    ).toBeVisible();

    await expect(
      button
    ).toBeEnabled();

    await button.click();
  }
}