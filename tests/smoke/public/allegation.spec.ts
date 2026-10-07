import {
  test,
  expect
} from '@playwright/test';

import {
  SubmitReportPage
} from '../../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../../pages/public/ReportingNoticePage';


// ============================================================
// SHARED SETUP
// ============================================================

async function navigateToAllegation(
  submit: SubmitReportPage,
  notice: ReportingNoticePage
): Promise<void> {

  await submit.open();

  await notice.verifyLoaded();
  await notice.next();

  // Reporter Info
  await submit.reporterInfo.verifyLoaded();

  await submit.reporterInfo.fill({
    identityType: 'anonymous',
    reporterCategory: 'Employee'
  });

  await submit.reporterInfo.next();

  // Classification
  await submit.classification.verifyLoaded();

  await submit.classification.selectInternalAuditAnswer(
    'No'
  );

  await submit.classification.selectCategory(
    'Nepotism/Cronyism'
  );

  await submit.classification.next();

  // Allegation
  await submit.allegation.verifyLoaded();
}


// ============================================================
// TC-017
// Happy Path - Exact Date = Yes
// ============================================================

test(
  'TC-017 | User can complete Allegation and continue to Person(s) Involved @smoke @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fill({
      incidentTitle:
        'Potential conflict of interest',

      whatHappened:
        'An employee may have participated in a decision involving a related party.',

      rulePolicyLaw:
        'Conflict of Interest Policy',

      awarenessMethod:
        'I became aware through internal business communication.',

      incidentLocation:
        'Riyadh Office',

      knowsExactDate:
        'Yes',

      incidentDate:
        '2026-09-13',

      ongoing:
        'No'
    });

    await submit.allegation.next();

    await submit.personsInvolved.verifyLoaded();
  }
);


// ============================================================
// TC-018
// Mandatory Fields Validation
// ============================================================

test(
  'TC-018 | Allegation mandatory fields validation @regression @validation @negative @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    // Do not fill mandatory fields
    await submit.allegation.next();

    // Must remain on Allegation
    await expect(
      page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    // Incident Title
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Title',
        exact: true
      })
    ).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // What Happened
    await expect(
      page.getByRole('textbox', {
        name: 'What Happened?',
        exact: true
      })
    ).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // Awareness Method
    await expect(
      page.getByRole('textbox', {
        name: 'How Did You Become Aware of the Issue?',
        exact: true
      })
    ).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  }
);


// ============================================================
// TC-019
// Exact Date = No
// Incident Date Description appears
// ============================================================

test(
  'TC-019 | Incident Date Description appears when Exact Date is No @regression @conditional @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fill({
      incidentTitle:
        'Potential conflict of interest',

      whatHappened:
        'An employee may have participated in a decision involving a related party.',

      awarenessMethod:
        'I became aware through internal business communication.',

      incidentLocation:
        'Riyadh Office',

      knowsExactDate:
        'No',

      incidentDateDescription:
        'The incident occurred approximately during September 2026.',

      ongoing:
        'No'
    });

    // Incident Date hidden
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Date',
        exact: true
      })
    ).toBeHidden();

    // Description visible
    const dateDescription =
      page.getByRole('textbox', {
        name: 'Incident Date Description',
        exact: true
      });

    await expect(
      dateDescription
    ).toBeVisible();

    await expect(
      dateDescription
    ).toHaveValue(
      'The incident occurred approximately during September 2026.'
    );

    await submit.allegation.next();

    await submit.personsInvolved.verifyLoaded();
  }
);


// ============================================================
// TC-020
// Ongoing values
// Yes / No / Unknown
// ============================================================

const ongoingOptions = [
  'Yes',
  'No',
  "Unknown"
] as const;


for (const ongoing of ongoingOptions) {

  test(
    `TC-020 | User can select "${ongoing}" for Issue Still Ongoing @regression @conditional @public @intake`,
    async ({ page }) => {

      const submit =
        new SubmitReportPage(page);

      const notice =
        new ReportingNoticePage(page);

      await navigateToAllegation(
        submit,
        notice
      );

      await submit.allegation.fill({
        incidentTitle:
          'Potential conflict of interest',

        whatHappened:
          'An employee may have participated in a decision involving a related party.',

        awarenessMethod:
          'I became aware through internal business communication.',

        knowsExactDate:
          'No',

        incidentDateDescription:
          'The incident occurred approximately during September 2026.',

        ongoing
      });

      // Verify Incident Date Description
      await expect(
        page.getByRole('textbox', {
          name: 'Incident Date Description',
          exact: true
        })
      ).toHaveValue(
        'The incident occurred approximately during September 2026.'
      );

      // Verify ongoing option
      const ongoingGroup =
        page.getByRole(
          'radiogroup',
          {
            name: 'Is Incident Ongoing?'
          }
        );

      await expect(
        ongoingGroup.getByRole('radio', {
          name: ongoing,
          exact: true
        })
      ).toBeChecked();

      await submit.allegation.next();

      await submit.personsInvolved.verifyLoaded();
    }
  );
}


// ============================================================
// TC-021
// Incident Date required when Exact Date = Yes
// ============================================================

test(
  'TC-021 | Incident Date is required when Exact Date is Yes @regression @validation @negative @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    // Exact Date = Yes
    await submit.allegation.selectExactDate(
      'Yes'
    );

    // Incident Date intentionally EMPTY

    await submit.allegation.selectOngoing(
      'No'
    );

    await submit.allegation.next();

    // Must remain on Allegation
    await expect(
      page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    const incidentDate =
      page.getByRole(
        'textbox',
        {
          name: 'Incident Date',
          exact: true
        }
      );

    await expect(
      incidentDate
    ).toBeVisible();

    await expect(
      incidentDate
    ).toHaveValue('');
  }
);


// ============================================================
// TC-022
// Data Persistence
// Allegation -> Back -> Classification -> Next -> Allegation
// ============================================================

test(
  'TC-022 | Allegation data is preserved after Back and returning to Allegation @regression @navigation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fill({
      incidentTitle:
        'Potential conflict of interest',

      whatHappened:
        'An employee may have participated in a decision involving a related party.',

      rulePolicyLaw:
        'Conflict of Interest Policy',

      awarenessMethod:
        'I became aware through internal business communication.',

      incidentLocation:
        'Riyadh Office',

      knowsExactDate:
        'Yes',

      incidentDate:
        '2026-09-13',

      ongoing:
        'No'
    });

    // Back -> Classification
    await submit.allegation.back();

    await submit.classification.verifyLoaded();

    // Internal Audit answer persistence
    await expect(
      page.getByRole('radio', {
        name: 'No',
        exact: true
      }).first()
    ).toBeChecked();

    /*
      Current UI has one Category dropdown only.

      The DOM currently uses a misleading internal
      id/name, therefore identify the select using
      its "Select Category" option.
    */

    const category =
      page
        .locator('select')
        .filter({
          has: page.locator(
            'option',
            {
              hasText: 'Select Category'
            }
          )
        });

    await expect(
      category
    ).toBeVisible();

    await expect(
      category
    ).toHaveValue(
      'Nepotism/Cronyism'
    );

    // Return to Allegation
    await submit.classification.next();

    await submit.allegation.verifyLoaded();

    // Incident Title
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Title',
        exact: true
      })
    ).toHaveValue(
      'Potential conflict of interest'
    );

    // What Happened
    await expect(
      page.getByRole('textbox', {
        name: 'What Happened?',
        exact: true
      })
    ).toHaveValue(
      'An employee may have participated in a decision involving a related party.'
    );

    // Rule / Policy / Law
    await expect(
      page.getByRole('textbox', {
        name:
          'What Rule, Policy, or Law May Have Been Violated?',
        exact: true
      })
    ).toHaveValue(
      'Conflict of Interest Policy'
    );

    // Awareness
    await expect(
      page.getByRole('textbox', {
        name:
          'How Did You Become Aware of the Issue?',
        exact: true
      })
    ).toHaveValue(
      'I became aware through internal business communication.'
    );

    // Location
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Location',
        exact: true
      })
    ).toHaveValue(
      'Riyadh Office'
    );

    // Exact Date = Yes
    const exactDateGroup =
      page
        .getByRole('radiogroup')
        .first();

    await expect(
      exactDateGroup.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeChecked();

    // Incident Date
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Date',
        exact: true
      })
    ).toHaveValue(
      '2026-09-13'
    );

    // Date Description hidden
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Date Description',
        exact: true
      })
    ).toBeHidden();

    // Ongoing = No
    await expect(
      page
        .getByRole(
          'radiogroup',
          {
            name: 'Is Incident Ongoing?'
          }
        )
        .getByRole('radio', {
          name: 'No',
          exact: true
        })
    ).toBeChecked();
  }
);


// ============================================================
// TC-023
// Change Exact Date Yes -> No
// ============================================================

test(
  'TC-023 | Changing Exact Date from Yes to No hides Incident Date and shows Date Description @regression @conditional @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    // Exact Date = Yes
    await submit.allegation.selectExactDate(
      'Yes'
    );

    const incidentDate =
      page.getByRole(
        'textbox',
        {
          name: 'Incident Date',
          exact: true
        }
      );

    const dateDescription =
      page.getByRole(
        'textbox',
        {
          name: 'Incident Date Description',
          exact: true
        }
      );

    await expect(
      incidentDate
    ).toBeVisible();

    await expect(
      dateDescription
    ).toBeHidden();

    await submit.allegation.fillIncidentDate(
      '2026-09-13'
    );

    await expect(
      incidentDate
    ).toHaveValue(
      '2026-09-13'
    );

    // Change Yes -> No
    await submit.allegation.selectExactDate(
      'No'
    );

    await expect(
      incidentDate
    ).toBeHidden();

    await expect(
      dateDescription
    ).toBeVisible();

    await submit.allegation.fillIncidentDateDescription(
      'The exact date is unknown, but the incident occurred approximately during September 2026.'
    );

    await expect(
      dateDescription
    ).toHaveValue(
      'The exact date is unknown, but the incident occurred approximately during September 2026.'
    );

    await submit.allegation.selectOngoing(
      'No'
    );

    await submit.allegation.next();

    await submit.personsInvolved.verifyLoaded();
  }
);


// ============================================================
// TC-024
// Exact Date selection mandatory
// ============================================================

test(
  'TC-024 | Exact Date selection is mandatory @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    // Exact Date intentionally NOT selected

    await submit.allegation.selectOngoing(
      'No'
    );

    await submit.allegation.next();

    // Must remain on Allegation
    await expect(
      page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    await expect(
      page.getByRole('alert').filter({
        hasText:
          'Please complete all mandatory fields'
      })
    ).toBeVisible();
  }
);


// ============================================================
// TC-025
// Issue Still Ongoing selection mandatory
// ============================================================

test(
  'TC-025 | Issue Still Ongoing selection is mandatory @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    await submit.allegation.selectExactDate(
      'No'
    );

    await submit.allegation.fillIncidentDateDescription(
      'The incident occurred approximately during September 2026.'
    );

    // Issue Still Ongoing intentionally NOT selected

    await submit.allegation.next();

    // Must remain on Allegation
    await expect(
      page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    await expect(
      page.getByRole('alert').filter({
        hasText:
          'Please complete all mandatory fields'
      })
    ).toBeVisible();
  }
);


// ============================================================
// TC-026
// Incident Date Description required when Exact Date = No
// ============================================================

test(
  'TC-026 | Incident Date Description is required when Exact Date is No @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    // Exact Date = No
    await submit.allegation.selectExactDate(
      'No'
    );

    // Incident Date Description intentionally EMPTY

    await submit.allegation.selectOngoing(
      'No'
    );

    await submit.allegation.next();

    // Must remain on Allegation
    await expect(
      page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    const dateDescription =
      page.getByRole('textbox', {
        name: 'Incident Date Description',
        exact: true
      });

    await expect(
      dateDescription
    ).toBeVisible();

    await expect(
      dateDescription
    ).toHaveValue('');

    await expect(
      dateDescription
    ).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  }
);


// ============================================================
// TC-027
// Rule / Policy / Law optional
// ============================================================

test(
  'TC-027 | Rule Policy or Law is optional @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    // Rule / Policy / Law intentionally EMPTY

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    await submit.allegation.selectExactDate(
      'Yes'
    );

    await submit.allegation.fillIncidentDate(
      '2026-09-13'
    );

    await submit.allegation.selectOngoing(
      'No'
    );

    await submit.allegation.next();

    await submit.personsInvolved.verifyLoaded();
  }
);


// ============================================================
// TC-028
// Incident Location optional
// ============================================================

test(
  'TC-028 | Incident Location is optional @regression @validation @public @intake',
  async ({ page }) => {

    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToAllegation(
      submit,
      notice
    );

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    // Incident Location intentionally EMPTY

    await submit.allegation.selectExactDate(
      'Yes'
    );

    await submit.allegation.fillIncidentDate(
      '2026-09-13'
    );

    await submit.allegation.selectOngoing(
      'No'
    );

    await submit.allegation.next();

    await submit.personsInvolved.verifyLoaded();
  }
);