import {
  expect,
  Locator,
  Page
} from '@playwright/test';

import {
  PreviousReportingData
} from '../../../../models/public/PreviousReportingData';

export class PreviousReportingStep {

  constructor(
    private readonly page: Page
  ) { }

  // =========================================================
  // CORE LOCATORS
  // =========================================================

  private heading(): Locator {
    return this.page.getByRole(
      'heading',
      {
        name: 'Previous Reporting',
        level: 2
      }
    );
  }

  private previouslyReportedHeading(): Locator {
    return this.page.getByRole(
      'heading',
      {
        name:
          'Have You Previously Reported This Concern?',
        level: 3
      }
    );
  }

  private previouslyReportedGroup(): Locator {
    return this.page.getByRole(
      'radiogroup',
      {
        name:
          'Have You Previously Reported This Concern?'
      }
    );
  }

  private systemReferenceHeading(): Locator {
    return this.page.getByRole(
      'heading',
      {
        name:
          'Do You Have a System Reference Number?',
        level: 3
      }
    );
  }

  private systemReferenceGroup(): Locator {
    return this.page.getByRole(
      'radiogroup',
      {
        name:
          'Do You Have a System Reference Number?'
      }
    );
  }

  private referenceNumberField(): Locator {
    return this.page.getByRole(
      'textbox',
      {
        name:
          /Previously Reported Incident Reference Number/i
      }
    );
  }

  private relevantInfoField(): Locator {
    return this.page.getByRole(
      'textbox',
      {
        name: 'Relevant Info',
        exact: true
      }
    );
  }

  private outcomeField(): Locator {
    return this.page.getByRole(
      'textbox',
      {
        name: /Outcome, If Known/i
      }
    );
  }

  private firstNameField(): Locator {
    return this.page.getByRole(
      'textbox',
      {
        name: /First Name/i
      }
    );
  }

  private lastNameField(): Locator {
    return this.page.getByRole(
      'textbox',
      {
        name: /Last Name/i
      }
    );
  }

  private positionDepartmentField(): Locator {
    return this.page.getByRole(
      'textbox',
      {
        name:
          /Position\s*\/\s*Department/i
      }
    );
  }

  private exactDateHeading(): Locator {
    return this.page.getByRole(
      'heading',
      {
        name:
          /Do You Know the Previous Report's Exact Date\?/i,
        level: 3
      }
    );
  }

  private reportingDateField(): Locator {
    return this.page.getByLabel(
      /Date of Reporting/i
    );
  }

  private dateDescriptionField(): Locator {
    return this.page.getByRole(
      'textbox',
      {
        name: /Date Description/i
      }
    );
  }

  private nextButton(): Locator {
    return this.page.getByRole(
      'button',
      {
        name: 'Next',
        exact: true
      }
    );
  }

  private backButton(): Locator {
    return this.page.getByRole(
      'button',
      {
        name: 'Back',
        exact: true
      }
    );
  }

  // =========================================================
  // VERIFY PAGE
  // =========================================================

  async verifyLoaded(): Promise<void> {

    await expect(
      this.heading()
    ).toBeVisible();

    await expect(
      this.previouslyReportedHeading()
    ).toBeVisible();

    const group =
      this.previouslyReportedGroup();

    await expect(
      group
    ).toBeVisible();

    await expect(
      group.getByRole(
        'radio',
        {
          name: 'Yes',
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      group.getByRole(
        'radio',
        {
          name: 'No',
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      this.nextButton()
    ).toBeVisible();

    await expect(
      this.backButton()
    ).toBeVisible();
  }

  // =========================================================
  // PREVIOUSLY REPORTED
  // =========================================================

  async selectPreviouslyReported(
    answer:
      PreviousReportingData['previouslyReported']
  ): Promise<void> {

    const group =
      this.previouslyReportedGroup();

    await expect(
      group
    ).toBeVisible();

    const radio =
      group.getByRole(
        'radio',
        {
          name: answer,
          exact: true
        }
      );

    await expect(
      radio
    ).toBeVisible();

    await expect(
      radio
    ).toBeEnabled();

    await radio.check();

    await expect(
      radio
    ).toBeChecked();
  }

  // =========================================================
  // SYSTEM REFERENCE QUESTION
  //
  // Current confirmed UI:
  //
  // Do You Have a System Reference Number?
  // - Yes
  // - No
  // - Forgot It
  // =========================================================

  async verifySystemReferenceQuestionVisible():
    Promise<void> {

    await expect(
      this.systemReferenceHeading()
    ).toBeVisible();

    const group =
      this.systemReferenceGroup();

    await expect(
      group
    ).toBeVisible();

    await expect(
      group.getByRole(
        'radio',
        {
          name: 'Yes',
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      group.getByRole(
        'radio',
        {
          name: 'No',
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      group.getByRole(
        'radio',
        {
          name: 'Forgot It',
          exact: true
        }
      )
    ).toBeVisible();
  }

  // =========================================================
  // SYSTEM REFERENCE
  //
  // MODEL MAY STILL USE:
  // "I don't remember"
  //
  // UI CURRENTLY USES:
  // "Forgot It"
  //
  // Mapping is handled here so existing test data does not
  // need to be changed immediately.
  // =========================================================

  async selectSystemReferenceAnswer(
    answer:
      PreviousReportingData['hasSystemReference']
  ): Promise<void> {

    if (!answer) {
      return;
    }

    const group =
      this.systemReferenceGroup();

    await expect(
      group
    ).toBeVisible();

    let uiAnswer: string;

    if (
      answer === "I don't remember"
    ) {
      uiAnswer = 'Forgot It';
    } else {
      uiAnswer = answer;
    }

    const radio =
      group.getByRole(
        'radio',
        {
          name: uiAnswer,
          exact: true
        }
      );

    await expect(
      radio
    ).toBeVisible();

    await expect(
      radio
    ).toBeEnabled();

    await radio.check();

    await expect(
      radio
    ).toBeChecked();
  }

  // =========================================================
  // REFERENCE NUMBER
  // =========================================================

  async verifyReferenceNumberVisible():
    Promise<void> {

    await expect(
      this.referenceNumberField()
    ).toBeVisible();
  }

  async fillReferenceNumber(
    referenceNumber: string
  ): Promise<void> {

    const field =
      this.referenceNumberField();

    await expect(
      field
    ).toBeVisible();

    await field.fill(
      referenceNumber
    );

    await expect(
      field
    ).toHaveValue(
      referenceNumber
    );
  }

  // =========================================================
  // RELEVANT INFO
  // =========================================================

  async fillRelevantInfo(
    relevantInfo: string
  ): Promise<void> {

    const field =
      this.relevantInfoField();

    await expect(
      field
    ).toBeVisible();

    await field.fill(
      relevantInfo
    );

    await expect(
      field
    ).toHaveValue(
      relevantInfo
    );
  }

  // =========================================================
  // OUTCOME
  // =========================================================

  async fillOutcome(
    outcome: string
  ): Promise<void> {

    const field =
      this.outcomeField();

    await expect(
      field
    ).toBeVisible();

    await field.fill(
      outcome
    );

    await expect(
      field
    ).toHaveValue(
      outcome
    );
  }

  // =========================================================
  // TO WHOM - FIRST NAME
  // =========================================================

  async fillFirstName(
    firstName: string
  ): Promise<void> {

    const field =
      this.firstNameField();

    await expect(
      field
    ).toBeVisible();

    await field.fill(
      firstName
    );

    await expect(
      field
    ).toHaveValue(
      firstName
    );
  }

  // =========================================================
  // TO WHOM - LAST NAME
  // =========================================================

  async fillLastName(
    lastName: string
  ): Promise<void> {

    const field =
      this.lastNameField();

    await expect(
      field
    ).toBeVisible();

    await field.fill(
      lastName
    );

    await expect(
      field
    ).toHaveValue(
      lastName
    );
  }

  // =========================================================
  // POSITION / DEPARTMENT
  // =========================================================

  async fillPositionDepartment(
    positionDepartment: string
  ): Promise<void> {

    const field =
      this.positionDepartmentField();

    await expect(
      field
    ).toBeVisible();

    await field.fill(
      positionDepartment
    );

    await expect(
      field
    ).toHaveValue(
      positionDepartment
    );
  }

  // =========================================================
  // VERIFY TO WHOM
  // =========================================================

  async verifyToWhomVisible():
    Promise<void> {

    await expect(
      this.page.getByText(
        'To Whom?',
        {
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      this.firstNameField()
    ).toBeVisible();

    await expect(
      this.lastNameField()
    ).toBeVisible();
  }

  // =========================================================
  // EXACT DATE
  //
  // Exact-date radiogroup has not yet been independently
  // discovered. We keep the existing last() strategy here
  // temporarily instead of inventing an accessible name.
  // =========================================================

  async selectExactDate(
    answer:
      PreviousReportingData['knowsExactDate']
  ): Promise<void> {

    if (!answer) {
      return;
    }

    await expect(
      this.exactDateHeading()
    ).toBeVisible();

    const groups =
      this.page.getByRole(
        'radiogroup'
      );

    const group =
      groups.last();

    await expect(
      group
    ).toBeVisible();

    const radio =
      group.getByRole(
        'radio',
        {
          name: answer,
          exact: true
        }
      );

    await expect(
      radio
    ).toBeVisible();

    await expect(
      radio
    ).toBeEnabled();

    await radio.check();

    await expect(
      radio
    ).toBeChecked();
  }

  // =========================================================
  // REPORTING DATE
  // =========================================================

  async verifyReportingDateVisible():
    Promise<void> {

    await expect(
      this.reportingDateField()
    ).toBeVisible();
  }

  async fillReportingDate(
    date: string
  ): Promise<void> {

    const field =
      this.reportingDateField();

    await expect(
      field
    ).toBeVisible();

    await field.fill(
      date
    );

    await expect(
      field
    ).toHaveValue(
      date
    );
  }

  // =========================================================
  // DATE DESCRIPTION
  // =========================================================

  async verifyDateDescriptionVisible():
    Promise<void> {

    await expect(
      this.dateDescriptionField()
    ).toBeVisible();
  }

  async fillDateDescription(
    description: string
  ): Promise<void> {

    const field =
      this.dateDescriptionField();

    await expect(
      field
    ).toBeVisible();

    await field.fill(
      description
    );

    await expect(
      field
    ).toHaveValue(
      description
    );
  }

  // =========================================================
  // FILL COMPLETE STEP
  // =========================================================

  async fill(
    data: PreviousReportingData
  ): Promise<void> {

    await this.selectPreviouslyReported(
      data.previouslyReported
    );

    // ---------------------------------------------------------
    // Previously Reported = No
    // ---------------------------------------------------------

    if (
      data.previouslyReported === 'No'
    ) {
      return;
    }

    // ---------------------------------------------------------
    // SYSTEM REFERENCE
    // ---------------------------------------------------------

    if (
      data.hasSystemReference
    ) {

      await this.selectSystemReferenceAnswer(
        data.hasSystemReference
      );

      // -------------------------------------------------------
      // SYSTEM REFERENCE = YES
      // -------------------------------------------------------

      if (
        data.hasSystemReference === 'Yes'
      ) {

        if (
          data.referenceNumber
        ) {
          await this.fillReferenceNumber(
            data.referenceNumber
          );
        }

        // Relevant Info is currently displayed
        // only for System Reference = Yes.
        if (
          data.relevantInfo
        ) {
          await this.fillRelevantInfo(
            data.relevantInfo
          );
        }
      }
      // -------------------------------------------------------
      // SYSTEM REFERENCE = NO
      // -------------------------------------------------------

      if (
        data.hasSystemReference === 'No'
      ) {

        if (
          data.firstName
        ) {
          await this.fillFirstName(
            data.firstName
          );
        }

        if (
          data.lastName
        ) {
          await this.fillLastName(
            data.lastName
          );
        }

        if (
          data.positionDepartment
        ) {
          await this.fillPositionDepartment(
            data.positionDepartment
          );
        }
      }

      // -------------------------------------------------------
      // MODEL "I don't remember"
      // -> CURRENT UI "Forgot It"
      //
      // No reference number or To Whom data is filled.
      // -------------------------------------------------------
    }



    // ---------------------------------------------------------
    // OUTCOME
    // ---------------------------------------------------------

    if (
      data.outcomeIfKnown
    ) {

      await this.fillOutcome(
        data.outcomeIfKnown
      );
    }

    // ---------------------------------------------------------
    // EXACT DATE
    // ---------------------------------------------------------

    if (
      data.knowsExactDate
    ) {

      await this.selectExactDate(
        data.knowsExactDate
      );

      if (
        data.knowsExactDate === 'Yes' &&
        data.reportingDate
      ) {

        await this.fillReportingDate(
          data.reportingDate
        );
      }

      if (
        data.knowsExactDate === 'No' &&
        data.dateDescription
      ) {

        await this.fillDateDescription(
          data.dateDescription
        );
      }
    }
  }

  // =========================================================
  // NEXT
  // =========================================================

  async next(): Promise<void> {

    const button =
      this.nextButton();

    await expect(
      button
    ).toBeVisible();

    await expect(
      button
    ).toBeEnabled();

    await button.click();
  }

  // =========================================================
  // BACK
  // =========================================================

  async back(): Promise<void> {

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
}