import {
  expect,
  Locator,
  Page
} from '@playwright/test';

export class DeclarationStep {

  constructor(
    private readonly page: Page
  ) {}

  // ==========================================================
  // LOCATORS
  // ==========================================================

  private getFirstAcknowledgement(): Locator {

    return this.page.getByRole(
      'checkbox',
      {
        name:
          /I confirm that the information provided/i
      }
    );
  }

  private getSecondAcknowledgement(): Locator {

    return this.page.getByRole(
      'checkbox',
      {
        name:
          /I acknowledge that if I become aware/i
      }
    );
  }

  private getSubmitButton(): Locator {

    return this.page.getByRole(
      'button',
      {
        name: 'Submit Report',
        exact: true
      }
    );
  }

  private getAcknowledgementValidationError(): Locator {

    return this.page.getByText(
      'I acknowledge is required',
      {
        exact: true
      }
    );
  }

  // ==========================================================
  // VERIFY DECLARATION STEP
  // ==========================================================

  async verifyLoaded() {

    await expect(
      this.page.getByRole(
        'heading',
        {
          name: 'Declaration',
          level: 2
        }
      )
    ).toBeVisible();

    await expect(
      this.getFirstAcknowledgement()
    ).toBeVisible();

    await expect(
      this.getSecondAcknowledgement()
    ).toBeVisible();

    await expect(
      this.getSubmitButton()
    ).toBeVisible();
  }

  // ==========================================================
  // FIRST ACKNOWLEDGEMENT
  // ==========================================================

  async acceptFirstAcknowledgement() {

    const checkbox =
      this.getFirstAcknowledgement();

    await expect(
      checkbox
    ).toBeVisible();

    await expect(
      checkbox
    ).toBeEnabled();

    if (
      !(await checkbox.isChecked())
    ) {

      await checkbox.click();
    }

    await expect(
      checkbox
    ).toBeChecked();
  }

  // ==========================================================
  // SECOND ACKNOWLEDGEMENT
  // ==========================================================

  async acceptSecondAcknowledgement() {

    const checkbox =
      this.getSecondAcknowledgement();

    await expect(
      checkbox
    ).toBeVisible();

    await expect(
      checkbox
    ).toBeEnabled();

    if (
      !(await checkbox.isChecked())
    ) {

      await checkbox.click();
    }

    await expect(
      checkbox
    ).toBeChecked();
  }

  // ==========================================================
  // ACCEPT ALL ACKNOWLEDGEMENTS
  // ==========================================================

  async acceptAllAcknowledgements() {

    await this.acceptFirstAcknowledgement();

    await this.acceptSecondAcknowledgement();

    await this.verifyBothAcknowledgementsChecked();
  }

  // ==========================================================
  // VERIFY BOTH CHECKED
  // ==========================================================

  async verifyBothAcknowledgementsChecked() {

    await expect(
      this.getFirstAcknowledgement()
    ).toBeChecked();

    await expect(
      this.getSecondAcknowledgement()
    ).toBeChecked();
  }

  // ==========================================================
  // SUBMIT REPORT
  // ==========================================================

  async submit() {

    // Verify browser/DOM state immediately before submission.
    await this.verifyBothAcknowledgementsChecked();

    const submitButton =
      this.getSubmitButton();

    await expect(
      submitButton
    ).toBeVisible();

    await expect(
      submitButton
    ).toBeEnabled();

    await submitButton.click();

    // --------------------------------------------------------
    // Known application-state defect detection
    //
    // The application has been observed showing:
    //
    // "I acknowledge is required"
    //
    // even though Playwright and the accessibility tree report
    // the second acknowledgement as checked.
    //
    // Do NOT retry, double-click or wait artificially here.
    // If this happens, fail immediately with the real reason.
    // --------------------------------------------------------

    const acknowledgementError =
      this.getAcknowledgementValidationError();

    const validationAppeared =
      await acknowledgementError
        .isVisible({
          timeout: 1500
        })
        .catch(() => false);

    if (validationAppeared) {

      const secondCheckbox =
        this.getSecondAcknowledgement();

      const secondCheckboxChecked =
        await secondCheckbox
          .isChecked()
          .catch(() => false);

      if (secondCheckboxChecked) {

        throw new Error(
          'Declaration validation defect: the second acknowledgement is checked in the UI/DOM, but the application still reports "I acknowledge is required" and blocks report submission.'
        );
      }

      throw new Error(
        'Declaration validation failed: the application reports "I acknowledge is required".'
      );
    }
  }

  // ==========================================================
  // BACK
  // ==========================================================

  async back() {

    await this.page
      .getByRole(
        'button',
        {
          name: 'Back',
          exact: true
        }
      )
      .click();
  }
}