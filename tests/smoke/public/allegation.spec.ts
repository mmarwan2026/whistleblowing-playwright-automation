import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';


// ============================================================
// TC-014
// Happy Path - Exact Date = Yes
// ============================================================

test(
  'TC-014 | User can complete Allegation and continue to Person(s) Involved @smoke @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    // Reporting Notice
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

    await submit.classification.selectInternalAuditAnswer('No');

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
    await submit.allegation.verifyLoaded();

    await submit.allegation.fill({
      incidentTitle: 'Potential conflict of interest',

      whatHappened:
        'An employee may have participated in a decision involving a related party.',

      rulePolicyLaw:
        'Conflict of Interest Policy',

      awarenessMethod:
        'I became aware through internal business communication.',

      incidentLocation:
        'Riyadh Office',

      knowsExactDate: 'Yes',

      incidentDate: '2026-09-13',

      ongoing: 'No'
    });

    await submit.allegation.next();

    // Person(s) Involved
   await submit.personsInvolved.verifyLoaded();
  }
);


// ============================================================
// TC-015
// Mandatory Fields Validation
// ============================================================

test(
  'TC-015 | Allegation mandatory fields validation @negative @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.selectInternalAuditAnswer('No');

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
    await submit.allegation.verifyLoaded();

    // Do not fill mandatory fields
    await submit.allegation.next();

    // Must remain on Allegation
    await expect(
      page.getByRole('heading', {
        name: 'Allegation',
        level: 2
      })
    ).toBeVisible();

    // Required Fields
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Title',
        exact: true
      })
    ).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    await expect(
      page.getByRole('textbox', {
        name: 'What Happened?',
        exact: true
      })
    ).toHaveAttribute(
      'aria-invalid',
      'true'
    );

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
// TC-016
// Exact Date = No
// Incident Date Description appears
// ============================================================

test(
  'TC-016 | Incident Date Description appears when Exact Date is No @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

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

    await submit.classification.selectInternalAuditAnswer('No');

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
    await submit.allegation.verifyLoaded();

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
// TC-017
// Ongoing values
// Yes / No / I don't know
// ============================================================

const ongoingOptions = [
  'Yes',
  'No',
  "I don't know"
] as const;

for (const ongoing of ongoingOptions) {

  test(
    `TC-017 | User can select "${ongoing}" for Issue Still Ongoing @public @intake`,
    async ({ page }) => {

      const submit = new SubmitReportPage(page);
      const notice = new ReportingNoticePage(page);

      await submit.open();

      await notice.verifyLoaded();
      await notice.next();

      // Reporter Info
      await submit.reporterInfo.fill({
        identityType: 'anonymous',
        reporterCategory: 'Employee'
      });

      await submit.reporterInfo.next();

      // Classification
      await submit.classification.selectInternalAuditAnswer(
        'No'
      );

      await submit.classification.selectCategory(
        'Conflict of Interest'
      );

      await submit.classification.selectSubcategory(
        'Nepotism/Cronyism'
      );

      await submit.classification.next();

      // Allegation
      await submit.allegation.verifyLoaded();

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
// TC-018
// Incident Date required when Exact Date = Yes
// ============================================================

test(
  'TC-018 | Incident Date is required when Exact Date is Yes @negative @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.selectInternalAuditAnswer(
      'No'
    );

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
    await submit.allegation.verifyLoaded();

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

    // Do not enter Incident Date
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
// TC-019
// Data Persistence
// Allegation -> Back -> Classification -> Next -> Allegation
// ============================================================

test(
  'TC-019 | Allegation data is preserved after Back and returning to Allegation @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

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
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
    await submit.allegation.verifyLoaded();

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

    // Classification persistence
    await expect(
      page.getByRole('radio', {
        name: 'No',
        exact: true
      }).first()
    ).toBeChecked();

    await expect(
      page.getByRole('combobox', {
        name: 'Category',
        exact: true
      })
    ).toHaveValue(
      'Conflict of Interest'
    );

    await expect(
      page.getByRole('combobox', {
        name: 'Subcategory',
        exact: true
      })
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

    // Date
    await expect(
      page.getByRole('textbox', {
        name: 'Incident Date',
        exact: true
      })
    ).toHaveValue(
      '2026-09-13'
    );

    // Description hidden
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
// TC-020
// Change Exact Date Yes -> No
// ============================================================

test(
  'TC-020 | Changing Exact Date from Yes to No hides Incident Date and shows Date Description @public @intake',
  async ({ page }) => {

    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();

    // Reporter Info
    await submit.reporterInfo.fill({
      identityType: 'anonymous',
      reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();

    // Classification
    await submit.classification.selectInternalAuditAnswer(
      'No'
    );

    await submit.classification.selectCategory(
      'Conflict of Interest'
    );

    await submit.classification.selectSubcategory(
      'Nepotism/Cronyism'
    );

    await submit.classification.next();

    // Allegation
    await submit.allegation.verifyLoaded();

    await submit.allegation.fillIncidentTitle(
      'Potential conflict of interest'
    );

    await submit.allegation.fillWhatHappened(
      'An employee may have participated in a decision involving a related party.'
    );

    await submit.allegation.fillAwarenessMethod(
      'I became aware through internal business communication.'
    );

    // =======================================================
    // Exact Date = Yes
    // =======================================================

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

    // Enter exact date
    await submit.allegation.fillIncidentDate(
      '2026-09-13'
    );

    await expect(
      incidentDate
    ).toHaveValue(
      '2026-09-13'
    );

    // =======================================================
    // Change Yes -> No
    // =======================================================

    await submit.allegation.selectExactDate(
      'No'
    );

    // Incident Date disappears
    await expect(
      incidentDate
    ).toBeHidden();

    // Description appears
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

    // Ongoing
    await submit.allegation.selectOngoing(
      'No'
    );

    // Continue
    await submit.allegation.next();

    await submit.personsInvolved.verifyLoaded();
  }
);