import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';

// ============================================================
// COMMON NAVIGATION
// Submit Report -> Previous Reporting
// ============================================================

async function navigateToPreviousReporting(
  submit: SubmitReportPage,
  notice: ReportingNoticePage
) {
  // =========================================================
  // OPEN SUBMIT REPORT
  // =========================================================

  await submit.open();

  // =========================================================
  // REPORTING & CONFIDENTIALITY NOTICE
  // =========================================================

  await notice.verifyLoaded();
  await notice.next();

  // =========================================================
  // STEP 1 - REPORTER INFO
  // =========================================================

  await submit.reporterInfo.verifyLoaded();

  await submit.reporterInfo.fill({
    identityType: 'anonymous',
    reporterCategory: 'Employee'
  });

  await submit.reporterInfo.next();

  // =========================================================
  // STEP 2 - CLASSIFICATION
  // =========================================================

  await submit.classification.verifyLoaded();

  await submit.classification
    .selectInternalAuditAnswer('No');

  await submit.classification
    .selectCategory(
      'Conflict of Interest'
    );

  await submit.classification
    .selectSubcategory(
      'Nepotism/Cronyism'
    );

  await submit.classification.next();

  // =========================================================
  // STEP 3 - ALLEGATION
  // =========================================================

  await submit.allegation.verifyLoaded();

  await submit.allegation.fill({
    incidentTitle:
      'Potential conflict of interest',

    whatHappened:
      'An employee may have participated in a decision involving a related party.',

    awarenessMethod:
      'I became aware through internal business communication.',

    knowsExactDate: 'No',

    incidentDateDescription:
      'The incident occurred approximately during September 2026.',

    ongoing: 'No'
  });

  await submit.allegation.next();

  // =========================================================
  // STEP 4 - PERSON(S) INVOLVED
  // =========================================================

  await submit.personsInvolved.verifyLoaded();

  await submit.personsInvolved
    .selectCanIdentify('No');

  await submit.personsInvolved.next();

  // =========================================================
  // STEP 5 - WITNESSES
  // =========================================================

  await submit.witnesses.verifyLoaded();

  await submit.witnesses
    .selectWitnessAnswer('No');

  await submit.witnesses.next();

  // =========================================================
  // STEP 6 - EVIDENCE
  // =========================================================

  await submit.evidence.verifyLoaded();

  /*
   * Previous Reporting tests are not Evidence tests.
   * Use Evidence = No to keep these tests isolated from
   * file-upload behavior.
   */

  await submit.evidence
    .selectEvidenceAnswer('No');

  await submit.evidence.next();

  // =========================================================
  // STEP 7 - PREVIOUS REPORTING
  // =========================================================

  await submit.previousReporting
    .verifyLoaded();
}

// ============================================================
// PREVIOUS REPORTING TEST SUITE
// ============================================================

test.describe(
  'Previous Reporting',
  () => {

    // ========================================================
    // TC-042
    // Previously Reported = No
    // Expected:
    // User can continue directly to Declaration
    // ========================================================

    test(
      'TC-042 | User can select No for previous reporting and continue to Declaration @smoke @public @intake',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        // ----------------------------------------------------
        // Navigate to Previous Reporting
        // ----------------------------------------------------

        await navigateToPreviousReporting(
          submit,
          notice
        );

        // ----------------------------------------------------
        // Verify Step 7
        // ----------------------------------------------------

        await submit.previousReporting
          .verifyLoaded();

        // ----------------------------------------------------
        // Previously Reported = No
        // ----------------------------------------------------

        await submit.previousReporting
          .selectPreviouslyReported('No');

        // ----------------------------------------------------
        // Continue
        // ----------------------------------------------------

        await submit.previousReporting.next();

        // ----------------------------------------------------
        // Verify Declaration
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'heading',
            {
              name: 'Declaration',
              level: 2
            }
          )
        ).toBeVisible();
      }
    );

    // ========================================================
    // TC-043
    // Previously Reported = Yes
    // System Reference = Yes
    // Exact Date = Yes
    //
    // Expected:
    // User can provide previous report details and continue
    // to Declaration.
    // ========================================================

    test(
      'TC-043 | User can provide previous report system reference and exact reporting date @public @intake',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        // ----------------------------------------------------
        // Navigate to Previous Reporting
        // ----------------------------------------------------

        await navigateToPreviousReporting(
          submit,
          notice
        );

        // ----------------------------------------------------
        // Previously Reported = Yes
        // ----------------------------------------------------

        await submit.previousReporting
          .selectPreviouslyReported('Yes');

        // ----------------------------------------------------
        // Verify System Reference question appears
        // ----------------------------------------------------

        await submit.previousReporting
          .verifySystemReferenceQuestionVisible();

        // ----------------------------------------------------
        // System Reference Number = Yes
        // ----------------------------------------------------

        await submit.previousReporting
          .selectSystemReferenceAnswer('Yes');

        // ----------------------------------------------------
        // Verify Reference Number field
        // ----------------------------------------------------

        await submit.previousReporting
          .verifyReferenceNumberVisible();

        // ----------------------------------------------------
        // Reference Number
        // ----------------------------------------------------

        await submit.previousReporting
          .fillReferenceNumber(
            'RSG-2026-000001'
          );

        // ----------------------------------------------------
        // Relevant Info
        // ----------------------------------------------------

        await submit.previousReporting
          .fillRelevantInfo(
            'The concern was previously reported through the internal reporting system.'
          );

        // ----------------------------------------------------
        // Outcome
        // ----------------------------------------------------

        await submit.previousReporting
          .fillOutcome(
            'The previous report was reviewed.'
          );

        // ----------------------------------------------------
        // Exact Previous Reporting Date = Yes
        // ----------------------------------------------------

        await submit.previousReporting
          .selectExactDate('Yes');

        // ----------------------------------------------------
        // Verify Date field
        // ----------------------------------------------------

        await submit.previousReporting
          .verifyReportingDateVisible();

        // ----------------------------------------------------
        // Fill native date
        // YYYY-MM-DD
        // ----------------------------------------------------

        await submit.previousReporting
          .fillReportingDate(
            '2026-09-01'
          );

        // ----------------------------------------------------
        // Continue
        // ----------------------------------------------------

        await submit.previousReporting.next();

        // ----------------------------------------------------
        // Verify Step 8 - Declaration
        // ----------------------------------------------------

        await expect(
          page.getByRole(
            'heading',
            {
              name: 'Declaration',
              level: 2
            }
          )
        ).toBeVisible();
      }
    );
  }
);
test(
  'TC-044 | User can provide previous reporting recipient details when no system reference is available @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // Previously Reported = Yes
    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // System Reference = No
    await submit.previousReporting
      .selectSystemReferenceAnswer('No');

    // Verify To Whom section
    await submit.previousReporting
      .verifyToWhomVisible();

    // Required recipient information
    await submit.previousReporting
      .fillFirstName('Ahmed');

    await submit.previousReporting
      .fillLastName('Mohamed');

    // Optional
    await submit.previousReporting
      .fillPositionDepartment(
        'Internal Audit'
      );

    // Optional outcome
    await submit.previousReporting
      .fillOutcome(
        'The concern was previously reviewed.'
      );

    // Previous reporting date is not exact
    await submit.previousReporting
      .selectExactDate('No');

    await submit.previousReporting
      .verifyDateDescriptionVisible();

    await submit.previousReporting
      .fillDateDescription(
        'The concern was reported approximately in August 2026.'
      );

    // Continue to Declaration
    await submit.previousReporting.next();

    await expect(
      page.getByRole('heading', {
        name: 'Declaration',
        level: 2
      })
    ).toBeVisible();
  }
);
test(
  "TC-045 | User can continue when previous report system reference is not remembered @public @intake",
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // Previously Reported = Yes
    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // System Reference = I don't remember
    await submit.previousReporting
      .selectSystemReferenceAnswer(
        "I don't remember"
      );

    // Relevant information
    await submit.previousReporting
      .fillRelevantInfo(
        'The concern was previously reported, but the system reference number is not available.'
      );

    // Outcome
    await submit.previousReporting
      .fillOutcome(
        'The previous report was reviewed.'
      );

    // Exact Date = No
    await submit.previousReporting
      .selectExactDate('No');

    await submit.previousReporting
      .verifyDateDescriptionVisible();

    await submit.previousReporting
      .fillDateDescription(
        'The concern was reported approximately in August 2026.'
      );

    // Continue
    await submit.previousReporting.next();

    // Step 8
    await expect(
      page.getByRole('heading', {
        name: 'Declaration',
        level: 2
      })
    ).toBeVisible();
  }
);
test(
  'TC-046 | Exact Date Yes displays Date of Reporting and accepts a valid date @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    await submit.previousReporting
      .selectSystemReferenceAnswer(
        "I don't remember"
      );

    // Exact Date = Yes
    await submit.previousReporting
      .selectExactDate('Yes');

    // Date of Reporting must appear
    await submit.previousReporting
      .verifyReportingDateVisible();

    await submit.previousReporting
      .fillReportingDate('2026-08-15');

    // Continue
    await submit.previousReporting.next();

    // Verify Declaration
    await expect(
      page.getByRole('heading', {
        name: 'Declaration',
        level: 2
      })
    ).toBeVisible();
  }
);
test(
  'TC-047 | Exact Date No displays Date Description and accepts approximate reporting date @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // Previously Reported = Yes
    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // Reference number is not remembered
    await submit.previousReporting
      .selectSystemReferenceAnswer(
        "I don't remember"
      );

    // Exact Date = No
    await submit.previousReporting
      .selectExactDate('No');

    // Date Description should appear
    await submit.previousReporting
      .verifyDateDescriptionVisible();

    // Enter approximate date information
    await submit.previousReporting
      .fillDateDescription(
        'The concern was reported approximately in August 2026.'
      );

    // Continue
    await submit.previousReporting.next();

    // Verify Step 8 - Declaration
    await expect(
      page.getByRole('heading', {
        name: 'Declaration',
        level: 2
      })
    ).toBeVisible();
  }
);
test(
  'TC-048 | System Reference Number is mandatory when System Reference is Yes @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    await submit.previousReporting
      .selectSystemReferenceAnswer('Yes');

    await submit.previousReporting
      .verifyReferenceNumberVisible();

    // Leave Reference Number empty
    await submit.previousReporting.next();

    // User must remain on Previous Reporting
    await expect(
      page.getByRole('heading', {
        name: 'Previous Reporting',
        level: 2
      })
    ).toBeVisible();

    // General validation summary
    await expect(
      page.getByText(
        'Please complete all mandatory fields',
        { exact: true }
      )
    ).toBeVisible();
  }
);
test(
  'TC-049 | First Name and Last Name are mandatory when System Reference is No @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // Previously Reported = Yes
    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // System Reference = No
    await submit.previousReporting
      .selectSystemReferenceAnswer('No');

    // Verify To Whom fields are displayed
    await submit.previousReporting
      .verifyToWhomVisible();

    // Intentionally leave:
    // First Name = empty
    // Last Name  = empty

    await submit.previousReporting.next();

    // User must remain on Previous Reporting
    await expect(
      page.getByRole('heading', {
        name: 'Previous Reporting',
        level: 2
      })
    ).toBeVisible();

    // General mandatory validation
    await expect(
      page.getByText(
        'Please complete all mandatory fields',
        { exact: true }
      )
    ).toBeVisible();
  }
);
test(
  'TC-050 | Date of Reporting is mandatory when Exact Date is Yes @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // Previously Reported = Yes
    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // Avoid Reference Number mandatory validation
    await submit.previousReporting
      .selectSystemReferenceAnswer(
        "I don't remember"
      );

    // Exact Date = Yes
    await submit.previousReporting
      .selectExactDate('Yes');

    // Date of Reporting should appear
    await submit.previousReporting
      .verifyReportingDateVisible();

    // Intentionally leave Date of Reporting empty
    await submit.previousReporting.next();

    // Must remain on Previous Reporting
    await expect(
      page.getByRole('heading', {
        name: 'Previous Reporting',
        level: 2
      })
    ).toBeVisible();

    // General mandatory validation
    await expect(
      page.getByText(
        'Please complete all mandatory fields',
        { exact: true }
      )
    ).toBeVisible();
  }
);
test(
  'TC-051 | Changing System Reference from Yes to No hides previous reference fields and displays To Whom fields @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // Previously Reported = Yes
    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // ========================================================
    // First path: System Reference = Yes
    // ========================================================

    await submit.previousReporting
      .selectSystemReferenceAnswer('Yes');

    await submit.previousReporting
      .verifyReferenceNumberVisible();

    await submit.previousReporting
      .fillReferenceNumber(
        'RSG-2026-000001'
      );

    await submit.previousReporting
      .fillRelevantInfo(
        'Previously reported information.'
      );

    // ========================================================
    // Change path: Yes -> No
    // ========================================================

    await submit.previousReporting
      .selectSystemReferenceAnswer('No');

    // ========================================================
    // Old Yes-path fields should disappear
    // ========================================================

    await expect(
      page.getByRole('textbox', {
        name:
          /Previously Reported Incident Reference Number/i
      })
    ).toBeHidden();

    await expect(
      page.getByRole('textbox', {
        name: 'Relevant Info',
        exact: true
      })
    ).toBeHidden();

    // ========================================================
    // No-path fields should appear
    // ========================================================

    await submit.previousReporting
      .verifyToWhomVisible();
  }
);
test(
  'TC-052 | Changing Exact Date from Yes to No hides Date of Reporting and displays Date Description @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // Previously Reported = Yes
    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // Avoid reference-specific mandatory fields
    await submit.previousReporting
      .selectSystemReferenceAnswer(
        "I don't remember"
      );

    // ========================================================
    // Exact Date = Yes
    // ========================================================

    await submit.previousReporting
      .selectExactDate('Yes');

    await submit.previousReporting
      .verifyReportingDateVisible();

    await submit.previousReporting
      .fillReportingDate('2026-08-15');

    // ========================================================
    // Change Exact Date: Yes -> No
    // ========================================================

    await submit.previousReporting
      .selectExactDate('No');

    // Date of Reporting should disappear
    await expect(
      page.getByLabel(/Date of Reporting/i)
    ).toBeHidden();

    // Date Description should appear
    await submit.previousReporting
      .verifyDateDescriptionVisible();

    await submit.previousReporting
      .fillDateDescription(
        'The previous report was submitted approximately in August 2026.'
      );
  }
);
test(
  'TC-053 | Previous Reporting data persists after Back navigation and returning to the step @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // ========================================================
    // Enter Previous Reporting data
    // ========================================================

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    await submit.previousReporting
      .selectSystemReferenceAnswer('Yes');

    await submit.previousReporting
      .fillReferenceNumber(
        'RSG-2026-000001'
      );

    await submit.previousReporting
      .fillRelevantInfo(
        'Previous reporting persistence test.'
      );

    await submit.previousReporting
      .fillOutcome(
        'The previous report was reviewed.'
      );

    await submit.previousReporting
      .selectExactDate('Yes');

    await submit.previousReporting
      .fillReportingDate(
        '2026-08-15'
      );

    // ========================================================
    // Back -> Evidence
    // ========================================================

    await submit.previousReporting.back();

    await submit.evidence.verifyLoaded();

    // ========================================================
    // Evidence -> Previous Reporting
    // ========================================================

    await submit.evidence.next();

    await submit.previousReporting
      .verifyLoaded();

    // ========================================================
    // Verify selected answers persisted
    // ========================================================

    const previousReportingGroup =
      page.getByRole('radiogroup', {
        name:
          'Have You Previously Reported This Concern?'
      });

    await expect(
      previousReportingGroup.getByRole(
        'radio',
        {
          name: 'Yes',
          exact: true
        }
      )
    ).toBeChecked();

    // System Reference group has no accessible name
    // in the current application DOM.
    const systemReferenceGroup =
      page.getByRole('radiogroup').nth(1);

    await expect(
      systemReferenceGroup.getByRole(
        'radio',
        {
          name: 'Yes',
          exact: true
        }
      )
    ).toBeChecked();

    // ========================================================
    // Verify text data persisted
    // ========================================================

    await expect(
      page.getByRole('textbox', {
        name:
          /Previously Reported Incident Reference Number/i
      })
    ).toHaveValue(
      'RSG-2026-000001'
    );

    await expect(
      page.getByRole('textbox', {
        name: 'Relevant Info',
        exact: true
      })
    ).toHaveValue(
      'Previous reporting persistence test.'
    );

    await expect(
      page.getByRole('textbox', {
        name: /Outcome, If Known/i
      })
    ).toHaveValue(
      'The previous report was reviewed.'
    );

    // ========================================================
    // Verify Exact Date persisted
    // ========================================================

    const exactDateGroup =
      page.getByRole('radiogroup').last();

    await expect(
      exactDateGroup.getByRole(
        'radio',
        {
          name: 'Yes',
          exact: true
        }
      )
    ).toBeChecked();

    await expect(
      page.getByLabel(/Date of Reporting/i)
    ).toHaveValue(
      '2026-08-15'
    );
  }
);
// ============================================================
// ADDITIONAL PREVIOUS REPORTING COVERAGE
// TC-054 -> TC-067
// ============================================================

test(
  'TC-054 | Previously Reported is mandatory @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.next();

    await expect(page.getByRole('heading', { name: 'Previous Reporting', level: 2 })).toBeVisible();
    await expect(page.getByText('Please complete all mandatory fields', { exact: true })).toBeVisible();
  }
);

test(
  'TC-055 | System Reference answer is mandatory when Previously Reported is Yes @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.verifySystemReferenceQuestionVisible();
    await submit.previousReporting.next();

    await expect(page.getByRole('heading', { name: 'Previous Reporting', level: 2 })).toBeVisible();
    await expect(page.getByText('Please complete all mandatory fields', { exact: true })).toBeVisible();
  }
);

test(
  'TC-056 | Exact Date answer is mandatory when Previously Reported is Yes @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer("I don't remember");
    await submit.previousReporting.next();

    await expect(page.getByRole('heading', { name: 'Previous Reporting', level: 2 })).toBeVisible();
    await expect(page.getByText('Please complete all mandatory fields', { exact: true })).toBeVisible();
  }
);

test(
  'TC-057 | Date Description is mandatory when Exact Date is No @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer("I don't remember");
    await submit.previousReporting.selectExactDate('No');
    await submit.previousReporting.verifyDateDescriptionVisible();
    await submit.previousReporting.next();

    await expect(page.getByRole('heading', { name: 'Previous Reporting', level: 2 })).toBeVisible();
    await expect(page.getByText('Please complete all mandatory fields', { exact: true })).toBeVisible();
  }
);

test(
  'TC-058 | First Name is individually mandatory when System Reference is No @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');
    await submit.previousReporting.fillLastName('Mohamed');
    await submit.previousReporting.selectExactDate('No');
    await submit.previousReporting.fillDateDescription('Approximately August 2026.');
    await submit.previousReporting.next();

    await expect(page.getByRole('heading', { name: 'Previous Reporting', level: 2 })).toBeVisible();
    await expect(page.getByText('Please complete all mandatory fields', { exact: true })).toBeVisible();
  }
);

test(
  'TC-059 | Last Name is individually mandatory when System Reference is No @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');
    await submit.previousReporting.fillFirstName('Ahmed');
    await submit.previousReporting.selectExactDate('No');
    await submit.previousReporting.fillDateDescription('Approximately August 2026.');
    await submit.previousReporting.next();

    await expect(page.getByRole('heading', { name: 'Previous Reporting', level: 2 })).toBeVisible();
    await expect(page.getByText('Please complete all mandatory fields', { exact: true })).toBeVisible();
  }
);

test(
  'TC-060 | Mandatory recipient fields reject whitespace-only values @public @intake @validation',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');
    await submit.previousReporting.fillFirstName('   ');
    await submit.previousReporting.fillLastName('   ');
    await submit.previousReporting.selectExactDate('No');
    await submit.previousReporting.fillDateDescription('Approximately August 2026.');
    await submit.previousReporting.next();

    await expect(page.getByRole('heading', { name: 'Previous Reporting', level: 2 })).toBeVisible();
    await expect(page.getByText('Please complete all mandatory fields', { exact: true })).toBeVisible();
  }
);

test(
  'TC-061 | System Reference No to Yes updates conditional fields correctly @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');
    await submit.previousReporting.verifyToWhomVisible();

    await submit.previousReporting.selectSystemReferenceAnswer('Yes');
    await submit.previousReporting.verifyReferenceNumberVisible();

    await expect(page.getByRole('textbox', { name: /^First Name/i })).toBeHidden();
    await expect(page.getByRole('textbox', { name: /^Last Name/i })).toBeHidden();
  }
);

test(
  "TC-062 | System Reference Yes to I don't remember updates conditional fields correctly @public @intake",
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('Yes');
    await submit.previousReporting.verifyReferenceNumberVisible();

    await submit.previousReporting.selectSystemReferenceAnswer("I don't remember");

    await expect(page.getByRole('textbox', { name: /Previously Reported Incident Reference Number/i })).toBeHidden();
    await expect(page.getByRole('textbox', { name: 'Relevant Info', exact: true })).toBeVisible();
  }
);

test(
  'TC-063 | Exact Date No to Yes hides Date Description and displays Date of Reporting @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer("I don't remember");
    await submit.previousReporting.selectExactDate('No');
    await submit.previousReporting.verifyDateDescriptionVisible();

    await submit.previousReporting.selectExactDate('Yes');
    await submit.previousReporting.verifyReportingDateVisible();
    await expect(page.getByRole('textbox', { name: /Date Description/i })).toBeHidden();
  }
);

test(
  'TC-064 | Previous Reporting No to Yes displays previous reporting detail questions @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('No');
    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.verifySystemReferenceQuestionVisible();
  }
);

test(
  'TC-065 | Previous Reporting accepts Arabic Unicode recipient data @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');
    await submit.previousReporting.fillFirstName('أحمد');
    await submit.previousReporting.fillLastName('محمد');
    await submit.previousReporting.fillPositionDepartment('إدارة المراجعة الداخلية');
    await submit.previousReporting.selectExactDate('No');
    await submit.previousReporting.fillDateDescription('تم الإبلاغ تقريباً خلال أغسطس 2026.');
    await submit.previousReporting.next();

    await expect(page.getByRole('heading', { name: 'Declaration', level: 2 })).toBeVisible();
  }
);

test(
  'TC-066 | Previous Reporting accepts supported punctuation in free-text fields @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);
    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer("I don't remember");
    await submit.previousReporting.fillRelevantInfo("Reported via email / hotline - follow-up #1 (internal).");
    await submit.previousReporting.fillOutcome('Reviewed; status: pending/follow-up.');
    await submit.previousReporting.selectExactDate('No');
    await submit.previousReporting.fillDateDescription('Approx. Aug/Sep 2026 (exact date unknown).');
    await submit.previousReporting.next();

    await expect(page.getByRole('heading', { name: 'Declaration', level: 2 })).toBeVisible();
  }
);

// Boundary/max-length behavior must be based on an approved field-length rule.
// Keep this visible in the suite without inventing an unsupported requirement.
test.skip(
  'TC-067 | Previous Reporting field max-length boundary validation @public @intake @validation',
  async () => {
    // TODO: Enable after the approved max lengths for Reference Number,
    // Relevant Info, Outcome, recipient fields, and Date Description are confirmed.
  }
);
