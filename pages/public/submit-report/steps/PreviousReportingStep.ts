import { expect, Page } from '@playwright/test';

export class PreviousReportingStep {
  constructor(private readonly page: Page) {}

  // =========================================================
  // VERIFY PAGE
  // =========================================================

  async verifyLoaded() {
    await expect(
      this.page.getByRole('heading', {
        name: 'Previous Reporting',
        level: 2
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('heading', {
        name: 'Have You Previously Reported This Concern?',
        level: 3
      })
    ).toBeVisible();

    const previousReportingGroup =
      this.page.getByRole('radiogroup', {
        name: 'Have You Previously Reported This Concern?'
      });

    await expect(
      previousReportingGroup
    ).toBeVisible();

    await expect(
      previousReportingGroup.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeVisible();

    await expect(
      previousReportingGroup.getByRole('radio', {
        name: 'No',
        exact: true
      })
    ).toBeVisible();
  }

  // =========================================================
  // PREVIOUSLY REPORTED
  // Yes / No
  // =========================================================

  async selectPreviouslyReported(
    answer: 'Yes' | 'No'
  ) {
    const group =
      this.page.getByRole('radiogroup', {
        name: 'Have You Previously Reported This Concern?'
      });

    await expect(group).toBeVisible();

    const radio = group.getByRole('radio', {
      name: answer,
      exact: true
    });

    await expect(radio).toBeVisible();

    await radio.check();

    await expect(radio).toBeChecked();
  }

  // =========================================================
  // SYSTEM REFERENCE QUESTION
  // =========================================================

  async verifySystemReferenceQuestionVisible() {
    await expect(
      this.page.getByRole('heading', {
        name: 'Do You Have a System Reference Number?',
        level: 3
      })
    ).toBeVisible();

    /*
     * Current application accessibility structure:
     *
     * radiogroup #1
     * = Have You Previously Reported This Concern?
     *
     * radiogroup #2
     * = Do You Have a System Reference Number?
     *
     * The second radiogroup currently has NO accessible name.
     */

    const group = this.page
      .getByRole('radiogroup')
      .nth(1);

    await expect(group).toBeVisible();

    await expect(
      group.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeVisible();

    await expect(
      group.getByRole('radio', {
        name: 'No',
        exact: true
      })
    ).toBeVisible();

    await expect(
      group.getByRole('radio', {
        name: "I don't remember",
        exact: true
      })
    ).toBeVisible();
  }

  // =========================================================
  // SYSTEM REFERENCE
  // Yes / No / I don't remember
  // =========================================================

  async selectSystemReferenceAnswer(
    answer: 'Yes' | 'No' | "I don't remember"
  ) {
    /*
     * Do NOT use:
     *
     * getByRole('radiogroup', {
     *   name: 'Do You Have a System Reference Number?'
     * })
     *
     * The current DOM does not expose an accessible name
     * for this radiogroup.
     */

    const group = this.page
      .getByRole('radiogroup')
      .nth(1);

    await expect(group).toBeVisible();

    const radio = group.getByRole('radio', {
      name: answer,
      exact: true
    });

    await expect(radio).toBeVisible();

    await radio.check();

    await expect(radio).toBeChecked();
  }

  // =========================================================
  // REFERENCE NUMBER
  // Required when System Reference = Yes
  // =========================================================

  async verifyReferenceNumberVisible() {
    const field = this.page.getByRole('textbox', {
      name: /Previously Reported Incident Reference Number/i
    });

    await expect(field).toBeVisible();
  }

  async fillReferenceNumber(
    referenceNumber: string
  ) {
    const field = this.page.getByRole('textbox', {
      name: /Previously Reported Incident Reference Number/i
    });

    await expect(field).toBeVisible();

    await field.fill(referenceNumber);

    await expect(
      field
    ).toHaveValue(referenceNumber);
  }

  // =========================================================
  // RELEVANT INFO
  // =========================================================

  async fillRelevantInfo(
    relevantInfo: string
  ) {
    const field = this.page.getByRole('textbox', {
      name: 'Relevant Info',
      exact: true
    });

    await expect(field).toBeVisible();

    await field.fill(relevantInfo);

    await expect(
      field
    ).toHaveValue(relevantInfo);
  }

  // =========================================================
  // OUTCOME, IF KNOWN
  // =========================================================

  async fillOutcome(
    outcome: string
  ) {
    const field = this.page.getByRole('textbox', {
      name: /Outcome, If Known/i
    });

    await expect(field).toBeVisible();

    await field.fill(outcome);

    await expect(
      field
    ).toHaveValue(outcome);
  }

  // =========================================================
  // TO WHOM - FIRST NAME
  // System Reference = No
  // =========================================================

  async fillFirstName(
    firstName: string
  ) {
    const field = this.page.getByRole('textbox', {
      name: /First Name/i
    });

    await expect(field).toBeVisible();

    await field.fill(firstName);

    await expect(
      field
    ).toHaveValue(firstName);
  }

  // =========================================================
  // TO WHOM - LAST NAME
  // System Reference = No
  // =========================================================

  async fillLastName(
    lastName: string
  ) {
    const field = this.page.getByRole('textbox', {
      name: /Last Name/i
    });

    await expect(field).toBeVisible();

    await field.fill(lastName);

    await expect(
      field
    ).toHaveValue(lastName);
  }

  // =========================================================
  // POSITION / DEPARTMENT
  // =========================================================

  async fillPositionDepartment(
    positionDepartment: string
  ) {
    const field = this.page.getByRole('textbox', {
      name: /Position\s*\/\s*Department/i
    });

    await expect(field).toBeVisible();

    await field.fill(positionDepartment);

    await expect(
      field
    ).toHaveValue(positionDepartment);
  }

  // =========================================================
  // VERIFY TO WHOM SECTION
  // =========================================================

  async verifyToWhomVisible() {
    await expect(
      this.page.getByText(
        'To Whom?',
        {
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      this.page.getByRole('textbox', {
        name: /First Name/i
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('textbox', {
        name: /Last Name/i
      })
    ).toBeVisible();
  }

  // =========================================================
  // EXACT DATE
  // Yes / No
  // =========================================================

  async selectExactDate(
    answer: 'Yes' | 'No'
  ) {
    const heading = this.page.getByRole('heading', {
      name: /Do You Know the Previous Report's Exact Date\?/i,
      level: 3
    });

    await expect(heading).toBeVisible();

    /*
     * We will keep this locator separate because the
     * accessibility snapshot for the Exact Date radiogroup
     * must be confirmed after the System Reference path
     * is working.
     */

    const groups =
      this.page.getByRole('radiogroup');

    const group = groups.last();

    await expect(group).toBeVisible();

    const radio = group.getByRole('radio', {
      name: answer,
      exact: true
    });

    await expect(radio).toBeVisible();

    await radio.check();

    await expect(radio).toBeChecked();
  }

  // =========================================================
  // DATE OF REPORTING
  // Exact Date = Yes
  // =========================================================

  async verifyReportingDateVisible() {
    const field = this.page.getByLabel(
      /Date of Reporting/i
    );

    await expect(field).toBeVisible();
  }

  async fillReportingDate(
    date: string
  ) {
    const field = this.page.getByLabel(
      /Date of Reporting/i
    );

    await expect(field).toBeVisible();

    // Native date input:
    // YYYY-MM-DD
    await field.fill(date);

    await expect(
      field
    ).toHaveValue(date);
  }

  // =========================================================
  // DATE DESCRIPTION
  // Exact Date = No
  // =========================================================

  async verifyDateDescriptionVisible() {
    const field = this.page.getByRole('textbox', {
      name: /Date Description/i
    });

    await expect(field).toBeVisible();
  }

  async fillDateDescription(
    description: string
  ) {
    const field = this.page.getByRole('textbox', {
      name: /Date Description/i
    });

    await expect(field).toBeVisible();

    await field.fill(description);

    await expect(
      field
    ).toHaveValue(description);
  }

  // =========================================================
  // NEXT
  // =========================================================

  async next() {
    const nextButton = this.page.getByRole(
      'button',
      {
        name: 'Next',
        exact: true
      }
    );

    await expect(
      nextButton
    ).toBeVisible();

    await expect(
      nextButton
    ).toBeEnabled();

    await nextButton.click();
  }

  // =========================================================
  // BACK
  // =========================================================

  async back() {
    const backButton = this.page.getByRole(
      'button',
      {
        name: 'Back',
        exact: true
      }
    );

    await expect(
      backButton
    ).toBeVisible();

    await expect(
      backButton
    ).toBeEnabled();

    await backButton.click();
  }
}