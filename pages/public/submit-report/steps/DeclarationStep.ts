import {
  expect,
  Locator,
  Page
} from '@playwright/test';

export class DeclarationStep {

  constructor(
    private readonly page: Page
  ) { }

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

  async verifyLoaded(): Promise<void> {

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

  async acceptFirstAcknowledgement(): Promise<void> {

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
      await checkbox.check();
    }

    await expect(
      checkbox
    ).toBeChecked();
  }

  // ==========================================================
  // SECOND ACKNOWLEDGEMENT
  // ==========================================================

  async acceptSecondAcknowledgement(): Promise<void> {
    const checkbox = this.getSecondAcknowledgement();

    await expect(
      checkbox,
      'Second acknowledgement should be visible'
    ).toBeVisible();

    await expect(
      checkbox,
      'Second acknowledgement should be enabled'
    ).toBeEnabled();

    if (!(await checkbox.isChecked())) {
      await checkbox.click();
    }

    await expect(
      checkbox,
      'Second acknowledgement should become checked after user click'
    ).toBeChecked();
  }
  // ==========================================================
  // REMOVE FIRST ACKNOWLEDGEMENT
  // ==========================================================

  async uncheckFirstAcknowledgement(): Promise<void> {

    const checkbox =
      this.getFirstAcknowledgement();

    await expect(
      checkbox
    ).toBeVisible();

    if (
      await checkbox.isChecked()
    ) {
      await checkbox.uncheck();
    }

    await expect(
      checkbox
    ).not.toBeChecked();
  }

  // ==========================================================
  // REMOVE SECOND ACKNOWLEDGEMENT
  // ==========================================================

  async uncheckSecondAcknowledgement(): Promise<void> {

    const checkbox =
      this.getSecondAcknowledgement();

    await expect(
      checkbox
    ).toBeVisible();

    if (
      await checkbox.isChecked()
    ) {
      await checkbox.uncheck();
    }

    await expect(
      checkbox
    ).not.toBeChecked();
  }

  // ==========================================================
  // ACCEPT ALL ACKNOWLEDGEMENTS
  // ==========================================================

  async acceptAllAcknowledgements(): Promise<void> {

    await this.acceptFirstAcknowledgement();

    await this.acceptSecondAcknowledgement();

    await this.verifyBothAcknowledgementsChecked();
  }

  // ==========================================================
  // VERIFY BOTH CHECKED
  // ==========================================================

  async verifyBothAcknowledgementsChecked(): Promise<void> {

    await expect(
      this.getFirstAcknowledgement()
    ).toBeChecked();

    await expect(
      this.getSecondAcknowledgement()
    ).toBeChecked();
  }

  // ==========================================================
  // VERIFY SUBMIT BUTTON ENABLED
  // ==========================================================

  async verifySubmitEnabled(): Promise<void> {

    await expect(
      this.getSubmitButton()
    ).toBeEnabled();
  }

  // ==========================================================
  // VERIFY SUBMIT BUTTON DISABLED
  // ==========================================================

  async verifySubmitDisabled(): Promise<void> {

    await expect(
      this.getSubmitButton()
    ).toBeDisabled();
  }

  // ==========================================================
  // CLICK SUBMIT
  //
  // Raw UI action for negative/validation tests.
  // Does NOT require acknowledgements to be checked.
  // ==========================================================

  async clickSubmit(): Promise<void> {

    const submitButton =
      this.getSubmitButton();

    await expect(
      submitButton
    ).toBeVisible();

    await submitButton.click();
  }

  // ==========================================================
  // SUBMIT VALID REPORT
  //
  // Positive/E2E submission path.
  // ==========================================================

  async submit(): Promise<void> {

    /*
     * Verify browser/DOM state immediately
     * before submission.
     */
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
    // KNOWN APPLICATION-STATE DEFECT DETECTION
    //
    // The application has been observed showing:
    //
    // "I acknowledge is required"
    //
    // even though Playwright and the accessibility tree
    // report the second acknowledgement as checked.
    //
    // Do NOT retry, double-click, or add a fixed wait.
    // If this occurs, fail immediately with the actual reason.
    // --------------------------------------------------------

    const acknowledgementError =
      this.getAcknowledgementValidationError();

    const validationAppeared =
      await acknowledgementError
        .isVisible({
          timeout: 1500
        })
        .catch(() => false);

    if (
      validationAppeared
    ) {

      const secondCheckbox =
        this.getSecondAcknowledgement();

      const secondCheckboxChecked =
        await secondCheckbox
          .isChecked()
          .catch(() => false);

      if (
        secondCheckboxChecked
      ) {
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

  async back(): Promise<void> {

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