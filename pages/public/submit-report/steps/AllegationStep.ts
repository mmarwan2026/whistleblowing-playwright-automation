import {
  expect,
  Page
} from '@playwright/test';

import {
  AllegationData
} from '../../../../models/public/AllegationData';

export class AllegationStep {

  constructor(
    private readonly page: Page
  ) { }

  // ==========================================================
  // VERIFY PAGE
  // ==========================================================

  async verifyLoaded(): Promise<void> {

    await expect(
      this.page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('textbox', {
        name: 'Incident Title',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('textbox', {
        name: 'What Happened?',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('textbox', {
        name: 'How Did You Become Aware of the Issue?',
        exact: true
      })
    ).toBeVisible();
  }

  // ==========================================================
  // INCIDENT TITLE
  // ==========================================================

  async fillIncidentTitle(
    value: string
  ): Promise<void> {

    const field =
      this.page.getByRole('textbox', {
        name: 'Incident Title',
        exact: true
      });

    await expect(field).toBeVisible();

    await field.fill(value);

    await expect(
      field
    ).toHaveValue(value);
  }

  // ==========================================================
  // WHAT HAPPENED
  // ==========================================================

  async fillWhatHappened(
    value: string
  ): Promise<void> {

    const field =
      this.page.getByRole('textbox', {
        name: 'What Happened?',
        exact: true
      });

    await expect(field).toBeVisible();

    await field.fill(value);

    await expect(
      field
    ).toHaveValue(value);
  }

  // ==========================================================
  // RULE / POLICY / LAW
  // ==========================================================

  async fillRulePolicyLaw(
    value: string
  ): Promise<void> {

    const field =
      this.page.getByRole('textbox', {
        name:
          'What Rule, Policy, or Law May Have Been Violated?',
        exact: true
      });

    await expect(field).toBeVisible();

    await field.fill(value);

    await expect(
      field
    ).toHaveValue(value);
  }

  // ==========================================================
  // AWARENESS METHOD
  // ==========================================================

  async fillAwarenessMethod(
    value: string
  ): Promise<void> {

    const field =
      this.page.getByRole('textbox', {
        name:
          'How Did You Become Aware of the Issue?',
        exact: true
      });

    await expect(field).toBeVisible();

    await field.fill(value);

    await expect(
      field
    ).toHaveValue(value);
  }

  // ==========================================================
  // INCIDENT LOCATION
  // ==========================================================

  async fillIncidentLocation(
    value: string
  ): Promise<void> {

    const field =
      this.page.getByRole('textbox', {
        name: 'Incident Location',
        exact: true
      });

    await expect(field).toBeVisible();

    await field.fill(value);

    await expect(
      field
    ).toHaveValue(value);
  }

  // ==========================================================
  // EXACT DATE
  // ==========================================================

  async selectExactDate(
    answer: 'Yes' | 'No'
  ): Promise<void> {

    const exactDateGroup =
      this.page
        .getByRole('radiogroup')
        .first();

    const radio =
      exactDateGroup.getByRole(
        'radio',
        {
          name: answer,
          exact: true
        }
      );

    await expect(
      radio
    ).toBeVisible();

    await radio.check();

    await expect(
      radio
    ).toBeChecked();

    // --------------------------------------------------------
    // YES -> Incident Date appears
    // --------------------------------------------------------

    if (answer === 'Yes') {

      const incidentDate =
        this.page.getByRole(
          'textbox',
          {
            name: 'Incident Date',
            exact: true
          }
        );

      const dateDescription =
        this.page.getByRole(
          'textbox',
          {
            name:
              'Incident Date Description',
            exact: true
          }
        );

      await expect(
        incidentDate
      ).toBeVisible();

      await expect(
        dateDescription
      ).toBeHidden();

      return;
    }

    // --------------------------------------------------------
    // NO -> Incident Date Description appears
    // --------------------------------------------------------

    const incidentDate =
      this.page.getByRole(
        'textbox',
        {
          name: 'Incident Date',
          exact: true
        }
      );

    const dateDescription =
      this.page.getByRole(
        'textbox',
        {
          name:
            'Incident Date Description',
          exact: true
        }
      );

    await expect(
      incidentDate
    ).toBeHidden();

    await expect(
      dateDescription
    ).toBeVisible();
  }

  // ==========================================================
  // INCIDENT DATE
  //
  // input type="date"
  // Expected format: YYYY-MM-DD
  // ==========================================================

  async fillIncidentDate(
    value: string
  ): Promise<void> {

    const field =
      this.page.getByRole(
        'textbox',
        {
          name: 'Incident Date',
          exact: true
        }
      );

    await expect(
      field
    ).toBeVisible();

    await field.fill(value);

    await expect(
      field
    ).toHaveValue(value);
  }

  // ==========================================================
  // INCIDENT DATE DESCRIPTION
  //
  // Visible when Exact Date = No
  // ==========================================================

  async fillIncidentDateDescription(
    value: string
  ): Promise<void> {

    const field =
      this.page.getByRole(
        'textbox',
        {
          name:
            'Incident Date Description',
          exact: true
        }
      );

    await expect(
      field
    ).toBeVisible();

    await field.fill(value);

    await expect(
      field
    ).toHaveValue(value);
  }

  // ==========================================================
  // ISSUE STILL ONGOING
  // ==========================================================

  async selectOngoing(
    answer:
      | 'Yes'
      | 'No'
      | "Unknown"
  ): Promise<void> {

    const group =
      this.page.getByRole(
        'radiogroup',
        {
          name: 'Is Incident Ongoing?'
        }
      );

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

    await radio.check();

    await expect(
      radio
    ).toBeChecked();
  }

  // ==========================================================
  // FILL COMPLETE ALLEGATION
  // ==========================================================

  async fill(
    data: AllegationData
  ): Promise<void> {

    // --------------------------------------------------------
    // REQUIRED
    // --------------------------------------------------------

    await this.fillIncidentTitle(
      data.incidentTitle
    );

    await this.fillWhatHappened(
      data.whatHappened
    );

    await this.fillAwarenessMethod(
      data.awarenessMethod
    );

    // --------------------------------------------------------
    // OPTIONAL
    // --------------------------------------------------------

    if (data.rulePolicyLaw) {
      await this.fillRulePolicyLaw(
        data.rulePolicyLaw
      );
    }

    if (data.incidentLocation) {
      await this.fillIncidentLocation(
        data.incidentLocation
      );
    }

    // --------------------------------------------------------
    // EXACT DATE
    // --------------------------------------------------------

    if (data.knowsExactDate) {

      await this.selectExactDate(
        data.knowsExactDate
      );

      if (
        data.knowsExactDate === 'Yes' &&
        data.incidentDate
      ) {
        await this.fillIncidentDate(
          data.incidentDate
        );
      }

      if (
        data.knowsExactDate === 'No' &&
        data.incidentDateDescription
      ) {
        await this.fillIncidentDateDescription(
          data.incidentDateDescription
        );
      }
    }

    // --------------------------------------------------------
    // ONGOING
    // --------------------------------------------------------

    if (data.ongoing) {
      await this.selectOngoing(
        data.ongoing
      );
    }
  }

  // ==========================================================
  // NEXT
  // ==========================================================

  async next(): Promise<void> {

    await this.page
      .getByRole(
        'button',
        {
          name: 'Next',
          exact: true
        }
      )
      .click();
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