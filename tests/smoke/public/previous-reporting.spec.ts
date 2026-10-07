import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';

// ============================================================
// COMMON NAVIGATION
//
// CURRENT CONFIRMED WORKFLOW:
//
// Reporter Info
// -> Classification
// -> Allegation
// -> Person(s) Involved
// -> Entities Involved
// -> Witnesses
// -> Previous Reporting
// -> Evidence
// -> Declaration
// ============================================================

async function navigateToPreviousReporting(
  submit: SubmitReportPage,
  notice: ReportingNoticePage
): Promise<void> {

  // ==========================================================
  // OPEN SUBMIT REPORT
  // ==========================================================

  await submit.open();

  // ==========================================================
  // REPORTING & CONFIDENTIALITY NOTICE
  // ==========================================================

  await notice.verifyLoaded();
  await notice.next();

  // ==========================================================
  // STEP 1 - REPORTER INFO
  // ==========================================================

  await submit.reporterInfo.verifyLoaded();

  await submit.reporterInfo.fill({
    identityType: 'anonymous',
    reporterCategory: 'Employee'
  });

  await submit.reporterInfo.next();

  // ==========================================================
  // STEP 2 - CLASSIFICATION
  // ==========================================================

  await submit.classification.verifyLoaded();

  await submit.classification
    .selectInternalAuditAnswer('No');

  await submit.classification
    .selectCategory('Nepotism/Cronyism');

  await submit.classification.next();

  // ==========================================================
  // STEP 3 - ALLEGATION
  // ==========================================================

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

  // ==========================================================
  // STEP 4 - PERSON(S) INVOLVED
  // ==========================================================

  await submit.personsInvolved.verifyLoaded();

  await submit.personsInvolved
    .selectCanIdentify('No');

  await submit.personsInvolved.next();

  // ==========================================================
  // STEP 5 - ENTITIES INVOLVED
  // ==========================================================

  await submit.entitiesInvolved.verifyLoaded();

  await submit.entitiesInvolved
    .selectCanIdentify('No');

  await submit.entitiesInvolved.next();

  // ==========================================================
  // STEP 6 - WITNESSES
  // ==========================================================

  await submit.witnesses.verifyLoaded();

  await submit.witnesses
    .selectWitnessAnswer('No');

  await submit.witnesses.next();

  // ==========================================================
  // STEP 7 - PREVIOUS REPORTING
  // ==========================================================

  await submit.previousReporting.verifyLoaded();
}

// ============================================================
// COMMON ASSERTIONS
// ============================================================

async function verifyPreviousReportingStep(
  submit: SubmitReportPage
): Promise<void> {
  await submit.previousReporting.verifyLoaded();
}

async function verifyEvidenceStep(
  submit: SubmitReportPage
): Promise<void> {
  await submit.evidence.verifyLoaded();
}

// ============================================================
// PREVIOUS REPORTING TEST SUITE
// ============================================================

// ========================================================
// TC-042
// Previously Reported = No
// Expected:
// User can continue directly to Declaration
// ========================================================

test(
  'TC-063 | User can select No for previous reporting and continue to Evidence @smoke @public @intake',
  async ({ page }) => {
    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    // ========================================================
    // Navigate to Previous Reporting
    // ========================================================

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // ========================================================
    // Verify Previous Reporting
    // ========================================================

    await submit.previousReporting
      .verifyLoaded();

    // ========================================================
    // Previously Reported = No
    // ========================================================

    await submit.previousReporting
      .selectPreviouslyReported('No');

    // ========================================================
    // Continue
    // ========================================================

    await submit.previousReporting.next();

    // ========================================================
    // EXPECTED NEXT STEP = EVIDENCE
    // ========================================================

    await submit.evidence.verifyLoaded();
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
  'TC-064 | User can provide previous report system reference and exact reporting date @regression @conditional @public @intake',
  async ({ page }) => {
    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    // ========================================================
    // Navigate to Previous Reporting
    // ========================================================

    await navigateToPreviousReporting(
      submit,
      notice
    );

    await submit.previousReporting
      .verifyLoaded();

    // ========================================================
    // Previously Reported = Yes
    // ========================================================

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // ========================================================
    // Verify System Reference question
    //
    // Confirmed current UI:
    // Yes / No / Forgot It
    // ========================================================

    await submit.previousReporting
      .verifySystemReferenceQuestionVisible();

    // ========================================================
    // System Reference = Yes
    // ========================================================

    await submit.previousReporting
      .selectSystemReferenceAnswer('Yes');

    // ========================================================
    // Reference Number
    // ========================================================

    await submit.previousReporting
      .verifyReferenceNumberVisible();

    await submit.previousReporting
      .fillReferenceNumber(
        'RSG-2026-000001'
      );

    // ========================================================
    // Relevant Info
    // ========================================================

    await submit.previousReporting
      .fillRelevantInfo(
        'The concern was previously reported through the internal reporting system.'
      );

    // ========================================================
    // Outcome
    // ========================================================

    await submit.previousReporting
      .fillOutcome(
        'The previous report was reviewed.'
      );

    // ========================================================
    // Exact Reporting Date = Yes
    // ========================================================

    await submit.previousReporting
      .selectExactDate('Yes');

    // ========================================================
    // Reporting Date
    // ========================================================

    await submit.previousReporting
      .verifyReportingDateVisible();

    await submit.previousReporting
      .fillReportingDate(
        '2026-08-15'
      );

    // ========================================================
    // Continue
    // ========================================================

    await submit.previousReporting.next();

    // ========================================================
    // Expected Next Step = Evidence
    // ========================================================

    await submit.evidence.verifyLoaded();
  }
);

test(
  'TC-065 | User can provide previous reporting recipient details and approximate reporting date @regression @conditional @public @intake',
  async ({ page }) => {
    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    // ========================================================
    // Navigate to Previous Reporting
    // ========================================================

    await navigateToPreviousReporting(
      submit,
      notice
    );

    await submit.previousReporting
      .verifyLoaded();

    // ========================================================
    // Previously Reported = Yes
    // ========================================================

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    await submit.previousReporting
      .verifySystemReferenceQuestionVisible();

    // ========================================================
    // System Reference = No
    // ========================================================

    await submit.previousReporting
      .selectSystemReferenceAnswer('No');

    // ========================================================
    // To Whom?
    // ========================================================

    await submit.previousReporting
      .verifyToWhomVisible();

    // ========================================================
    // Required recipient details
    // ========================================================

    await submit.previousReporting
      .fillFirstName('Ahmed');

    await submit.previousReporting
      .fillLastName('Ali');

    // ========================================================
    // Position / Department
    //
    // No required marker is displayed in current UI.
    // Fill it in this positive-path test.
    // ========================================================

    await submit.previousReporting
      .fillPositionDepartment(
        'Compliance Department'
      );

    // ========================================================
    // Outcome, If Known
    //
    // Confirmed visible for System Reference = No.
    // ========================================================

    await submit.previousReporting
      .fillOutcome(
        'No final outcome was communicated.'
      );

    // ========================================================
    // Exact Date = No
    // ========================================================

    await submit.previousReporting
      .selectExactDate('No');

    // ========================================================
    // Date Description
    // ========================================================

    await submit.previousReporting
      .verifyDateDescriptionVisible();

    await submit.previousReporting
      .fillDateDescription(
        'Approximately August 2026'
      );

    // ========================================================
    // Continue
    // ========================================================

    await submit.previousReporting.next();

    // ========================================================
    // Expected Next Step = Evidence
    // ========================================================

    await submit.evidence.verifyLoaded();
  }
);;

test(
  'TC-066 | User can select Forgot It when system reference number is not remembered @regression @conditional @public @intake',
  async ({ page }) => {
    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    // ========================================================
    // Navigate to Previous Reporting
    // ========================================================

    await navigateToPreviousReporting(
      submit,
      notice
    );

    await submit.previousReporting
      .verifyLoaded();

    // ========================================================
    // Previously Reported = Yes
    // ========================================================

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    await submit.previousReporting
      .verifySystemReferenceQuestionVisible();

    // ========================================================
    // System Reference = Forgot It
    //
    // Existing model value:
    // "I don't remember"
    //
    // Current UI value:
    // "Forgot It"
    //
    // POM performs the mapping.
    // ========================================================

    await submit.previousReporting
      .selectSystemReferenceAnswer(
        "I don't remember"
      );

    // ========================================================
    // Verify Forgot It is actually selected in current UI
    // ========================================================

    const systemReferenceGroup =
      page.getByRole(
        'radiogroup',
        {
          name:
            'Do You Have a System Reference Number?'
        }
      );

    await expect(
      systemReferenceGroup.getByRole(
        'radio',
        {
          name: 'Forgot It',
          exact: true
        }
      )
    ).toBeChecked();

    // ========================================================
    // Outcome, If Known
    //
    // Fill only if this field is part of the Forgot It branch.
    // We do NOT assume that yet.
    // ========================================================

    // ========================================================
    // Exact Date
    // ========================================================

    await submit.previousReporting
      .selectExactDate('No');

    // ========================================================
    // Date Description
    // ========================================================

    await submit.previousReporting
      .verifyDateDescriptionVisible();

    await submit.previousReporting
      .fillDateDescription(
        'Approximately August 2026'
      );

    // ========================================================
    // Continue
    // ========================================================

    await submit.previousReporting.next();

    // ========================================================
    // Expected Next Step = Evidence
    // ========================================================

    await submit.evidence.verifyLoaded();
  }
);

test(
  'TC-067 | Reference Number is mandatory when System Reference is Yes @regression @validation @public @intake',
  async ({ page }) => {
    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // ========================================================
    // Previously Reported = Yes
    // ========================================================

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    await submit.previousReporting
      .verifySystemReferenceQuestionVisible();

    // ========================================================
    // System Reference = Yes
    // ========================================================

    await submit.previousReporting
      .selectSystemReferenceAnswer('Yes');

    // Reference Number must now be displayed.
    await submit.previousReporting
      .verifyReferenceNumberVisible();

    // ========================================================
    // Keep Reference Number EMPTY
    // ========================================================

    // Do not call fillReferenceNumber().

    // ========================================================
    // Attempt to continue
    // ========================================================

    await submit.previousReporting.next();

    // ========================================================
    // Expected:
    // navigation must be blocked
    // ========================================================

    await submit.previousReporting
      .verifyLoaded();

    await expect(
      page.getByRole('heading', {
        name: 'Evidence',
        level: 2
      })
    ).not.toBeVisible();

    // Reference Number should remain visible.
    await submit.previousReporting
      .verifyReferenceNumberVisible();
  }
);

test(
  'TC-068 | First Name is mandatory when System Reference is No @regression @validation @public @intake',
  async ({ page }) => {
    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // ========================================================
    // Previously Reported = Yes
    // ========================================================

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // ========================================================
    // System Reference = No
    // ========================================================

    await submit.previousReporting
      .selectSystemReferenceAnswer('No');

    await submit.previousReporting
      .verifyToWhomVisible();

    // ========================================================
    // First Name = EMPTY
    //
    // Last Name is supplied so that this test isolates
    // First Name validation only.
    // ========================================================

    await submit.previousReporting
      .fillLastName('Ali');

    // ========================================================
    // Exact Date = No
    // ========================================================

    await submit.previousReporting
      .selectExactDate('No');

    // ========================================================
    // Attempt to continue
    // ========================================================

    await submit.previousReporting.next();

    // ========================================================
    // Expected:
    // navigation blocked because First Name is empty
    // ========================================================

    await submit.previousReporting
      .verifyLoaded();

    await expect(
      page.getByRole('heading', {
        name: 'Evidence',
        level: 2
      })
    ).not.toBeVisible();

    // ========================================================
    // To Whom section must still be displayed
    // ========================================================

    await submit.previousReporting
      .verifyToWhomVisible();
  }
);
test(
  'TC-069 | Last Name is mandatory when System Reference is No @regression @validation @public @intake',
  async ({ page }) => {
    const submit =
      new SubmitReportPage(page);

    const notice =
      new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // ========================================================
    // Previously Reported = Yes
    // ========================================================

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // ========================================================
    // System Reference = No
    // ========================================================

    await submit.previousReporting
      .selectSystemReferenceAnswer('No');

    await submit.previousReporting
      .verifyToWhomVisible();

    // ========================================================
    // First Name = VALID
    // Last Name  = EMPTY
    // ========================================================

    await submit.previousReporting
      .fillFirstName('Ahmed');

    // Do NOT fill Last Name.

    // ========================================================
    // Exact Date = No
    // ========================================================

    await submit.previousReporting
      .selectExactDate('No');

    // ========================================================
    // Attempt to continue
    // ========================================================

    await submit.previousReporting.next();

    // ========================================================
    // Expected:
    // navigation must remain on Previous Reporting
    // ========================================================

    await submit.previousReporting
      .verifyLoaded();

    await expect(
      page.getByRole('heading', {
        name: 'Evidence',
        level: 2
      })
    ).not.toBeVisible();

    // ========================================================
    // To Whom remains displayed
    // ========================================================

    await submit.previousReporting
      .verifyToWhomVisible();
  }
);

test(
  'TC-070 | Position / Department is optional when System Reference is No @regression @validation @public @intake',
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
      .selectSystemReferenceAnswer('No');

    await submit.previousReporting
      .verifyToWhomVisible();

    // Required fields
    await submit.previousReporting
      .fillFirstName('Ahmed');

    await submit.previousReporting
      .fillLastName('Ali');

    // Position / Department intentionally left empty.

    await submit.previousReporting
      .selectExactDate('No');

    // Continue without Position / Department.
    await submit.previousReporting.next();

    // Expected: field is optional, therefore Evidence is reached.
    await submit.evidence.verifyLoaded();
  }
);

test(
  'TC-071 | Exact Date answer is mandatory when System Reference is No @regression @validation @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(
      submit,
      notice
    );

    // Previously Reported
    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    // System Reference
    await submit.previousReporting
      .selectSystemReferenceAnswer('No');

    await submit.previousReporting
      .verifyToWhomVisible();

    // Required recipient information
    await submit.previousReporting
      .fillFirstName('Ahmed');

    await submit.previousReporting
      .fillLastName('Ali');

    // Position / Department intentionally empty.
    // Already confirmed optional.

    // IMPORTANT:
    // Do NOT select Exact Date Yes/No.

    await submit.previousReporting.next();

    // Navigation must be blocked.
    await submit.previousReporting
      .verifyLoaded();

    await expect(
      page.getByRole('heading', {
        name: 'Evidence',
        level: 2
      })
    ).not.toBeVisible();
  }
);
// ============================================================
// TC-072 -> TC-087
// REMAINING PREVIOUS REPORTING COVERAGE
// ============================================================

test(
  'TC-072 | Date of Reporting is mandatory when Exact Date is Yes @regression @validation @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');

    await submit.previousReporting.fillFirstName('Ahmed');
    await submit.previousReporting.fillLastName('Ali');

    await submit.previousReporting.selectExactDate('Yes');
    await submit.previousReporting.verifyReportingDateVisible();

    // Date of Reporting intentionally empty.
    await submit.previousReporting.next();

    await submit.previousReporting.verifyLoaded();

    await expect(
      page.getByRole('heading', {
        name: 'Evidence',
        level: 2
      })
    ).not.toBeVisible();

    await submit.previousReporting.verifyReportingDateVisible();
  }
);

test(
  'TC-073 | Date Description is optional when Exact Date is No @regression @validation @public @intake',
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
      .selectSystemReferenceAnswer('No');

    // Required recipient fields
    await submit.previousReporting
      .fillFirstName('Ahmed');

    await submit.previousReporting
      .fillLastName('Ali');

    // Position / Department = Optional
    // Intentionally left empty.

    await submit.previousReporting
      .selectExactDate('No');

    await submit.previousReporting
      .verifyDateDescriptionVisible();

    // Date Description = Optional
    // Intentionally left empty.

    await submit.previousReporting.next();

    // User must be allowed to continue.
    await submit.evidence.verifyLoaded();
  }
);

test(
  'TC-074 | Valid Date of Reporting allows navigation to Evidence @regression @conditional @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');

    await submit.previousReporting.fillFirstName('Ahmed');
    await submit.previousReporting.fillLastName('Ali');

    await submit.previousReporting.selectExactDate('Yes');
    await submit.previousReporting.verifyReportingDateVisible();

    await submit.previousReporting.fillReportingDate(
      '2026-08-15'
    );

    await submit.previousReporting.next();

    await submit.evidence.verifyLoaded();
  }
);

test(
  'TC-075 | Valid Date Description allows navigation to Evidence @regression @conditional @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');

    await submit.previousReporting.fillFirstName('Ahmed');
    await submit.previousReporting.fillLastName('Ali');

    await submit.previousReporting.selectExactDate('No');
    await submit.previousReporting.verifyDateDescriptionVisible();

    await submit.previousReporting.fillDateDescription(
      'Approximately August 2026'
    );

    await submit.previousReporting.next();

    await submit.evidence.verifyLoaded();
  }
);

test(
  'TC-076 | Whitespace-only recipient names are rejected @regression @validation @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');

    await submit.previousReporting.fillFirstName('   ');
    await submit.previousReporting.fillLastName('   ');

    await submit.previousReporting.selectExactDate('No');

    await submit.previousReporting.fillDateDescription(
      'Approximately August 2026'
    );

    await submit.previousReporting.next();

    await submit.previousReporting.verifyLoaded();

    await expect(
      page.getByRole('heading', {
        name: 'Evidence',
        level: 2
      })
    ).not.toBeVisible();
  }
);

test(
  'TC-077 | Changing System Reference from Yes to No hides Reference Number and displays To Whom @regression @conditional @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');

    await submit.previousReporting.selectSystemReferenceAnswer('Yes');
    await submit.previousReporting.verifyReferenceNumberVisible();

    await submit.previousReporting.fillReferenceNumber(
      'RSG-2026-000001'
    );

    // Change Yes -> No
    await submit.previousReporting.selectSystemReferenceAnswer('No');

    await submit.previousReporting.verifyToWhomVisible();

    await expect(
      page.getByRole('textbox', {
        name: /Reference Number/i
      })
    ).toBeHidden();
  }
);

test(
  'TC-078 | Changing System Reference from No to Yes hides To Whom and displays Reference Number @regression @conditional @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');

    await submit.previousReporting.selectSystemReferenceAnswer('No');
    await submit.previousReporting.verifyToWhomVisible();

    await submit.previousReporting.fillFirstName('Ahmed');
    await submit.previousReporting.fillLastName('Ali');

    // Change No -> Yes
    await submit.previousReporting.selectSystemReferenceAnswer('Yes');

    await submit.previousReporting.verifyReferenceNumberVisible();

    await expect(
      page.getByRole('textbox', {
        name: /^First Name/i
      })
    ).toBeHidden();

    await expect(
      page.getByRole('textbox', {
        name: /^Last Name/i
      })
    ).toBeHidden();
  }
);

test(
  'TC-079 | Changing Exact Date from Yes to No hides Date of Reporting and displays Date Description @regression @conditional @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');

    await submit.previousReporting.fillFirstName('Ahmed');
    await submit.previousReporting.fillLastName('Ali');

    await submit.previousReporting.selectExactDate('Yes');
    await submit.previousReporting.verifyReportingDateVisible();

    await submit.previousReporting.fillReportingDate(
      '2026-08-15'
    );

    // Change Yes -> No
    await submit.previousReporting.selectExactDate('No');

    await expect(
      page.getByLabel(/Date of Reporting/i)
    ).toBeHidden();

    await submit.previousReporting.verifyDateDescriptionVisible();
  }
);

test(
  'TC-080 | Changing Exact Date from No to Yes hides Date Description and displays Date of Reporting @regression @conditional @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');

    await submit.previousReporting.fillFirstName('Ahmed');
    await submit.previousReporting.fillLastName('Ali');

    await submit.previousReporting.selectExactDate('No');
    await submit.previousReporting.verifyDateDescriptionVisible();

    await submit.previousReporting.fillDateDescription(
      'Approximately August 2026'
    );

    // Change No -> Yes
    await submit.previousReporting.selectExactDate('Yes');

    await submit.previousReporting.verifyReportingDateVisible();

    await expect(
      page.getByRole('textbox', {
        name: /Date Description/i
      })
    ).toBeHidden();
  }
);

test(
  'TC-081 | Changing Previously Reported from No to Yes displays System Reference question @regression @conditional @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('No');

    await submit.previousReporting.selectPreviouslyReported('Yes');

    await submit.previousReporting
      .verifySystemReferenceQuestionVisible();
  }
);

test(
  'TC-082 | Previous Reporting data persists after Back navigation @regression @navigation @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('Yes');

    await submit.previousReporting.fillReferenceNumber(
      'RSG-2026-000001'
    );

    await submit.previousReporting.fillRelevantInfo(
      'Previous reporting persistence test.'
    );

    await submit.previousReporting.fillOutcome(
      'The previous report was reviewed.'
    );

    await submit.previousReporting.selectExactDate('Yes');

    await submit.previousReporting.fillReportingDate(
      '2026-08-15'
    );

    // Current workflow:
    // Previous Reporting -> Back -> Witnesses
    await submit.previousReporting.back();

    await submit.witnesses.verifyLoaded();

    // Witnesses -> Previous Reporting
    await submit.witnesses.next();

    await submit.previousReporting.verifyLoaded();

    const previousReportingGroup =
      page.getByRole('radiogroup', {
        name: 'Have You Previously Reported This Concern?'
      });

    await expect(
      previousReportingGroup.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeChecked();

    const systemReferenceGroup =
      page.getByRole('radiogroup', {
        name: 'Do You Have a System Reference Number?'
      });

    await expect(
      systemReferenceGroup.getByRole('radio', {
        name: 'Yes',
        exact: true
      })
    ).toBeChecked();

    await expect(
      page.getByRole('textbox', {
        name: /Reference Number/i
      })
    ).toHaveValue('RSG-2026-000001');

    await expect(
      page.getByLabel(/Date of Reporting/i)
    ).toHaveValue('2026-08-15');
  }
);

test(
  'TC-083 | Previous Reporting accepts Arabic Unicode recipient data @regression @data @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('No');

    await submit.previousReporting.fillFirstName('أحمد');
    await submit.previousReporting.fillLastName('محمد');

    await submit.previousReporting.fillPositionDepartment(
      'إدارة المراجعة الداخلية'
    );

    await submit.previousReporting.selectExactDate('No');

    await submit.previousReporting.fillDateDescription(
      'تم الإبلاغ تقريباً خلال أغسطس 2026.'
    );

    await submit.previousReporting.next();

    await submit.evidence.verifyLoaded();
  }
);

test(
  'TC-084 | Previous Reporting accepts supported punctuation in free-text fields @regression @data @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting.selectPreviouslyReported('Yes');
    await submit.previousReporting.selectSystemReferenceAnswer('Yes');

    await submit.previousReporting.fillReferenceNumber(
      'RSG-2026-000001'
    );

    await submit.previousReporting.fillRelevantInfo(
      'Reported via email / hotline - follow-up #1 (internal).'
    );

    await submit.previousReporting.fillOutcome(
      'Reviewed; status: pending/follow-up.'
    );

    await submit.previousReporting.selectExactDate('No');

    await submit.previousReporting.fillDateDescription(
      'Approx. Aug/Sep 2026 (exact date unknown).'
    );

    await submit.previousReporting.next();

    await submit.evidence.verifyLoaded();
  }
);

test(
  'TC-085 | Relevant Info is optional when System Reference is Yes @regression @validation @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    await submit.previousReporting
      .selectSystemReferenceAnswer('Yes');

    await submit.previousReporting
      .fillReferenceNumber('RSG-2026-000001');

    // Relevant Info intentionally empty.

    await submit.previousReporting
      .selectExactDate('Yes');

    await submit.previousReporting
      .fillReportingDate('2026-08-15');

    await submit.previousReporting.next();

    // Relevant Info is optional.
    await submit.evidence.verifyLoaded();
  }
);

test(
  'TC-086 | Outcome is optional when Previously Reported is Yes @regression @validation @public @intake',
  async ({ page }) => {
    const submit = new SubmitReportPage(page);
    const notice = new ReportingNoticePage(page);

    await navigateToPreviousReporting(submit, notice);

    await submit.previousReporting
      .selectPreviouslyReported('Yes');

    await submit.previousReporting
      .selectSystemReferenceAnswer('Yes');

    await submit.previousReporting
      .fillReferenceNumber('RSG-2026-000001');

    // Relevant Info is optional but populate it here
    // so Outcome is isolated.
    await submit.previousReporting
      .fillRelevantInfo(
        'Previous report information.'
      );

    // Outcome intentionally empty.

    await submit.previousReporting
      .selectExactDate('Yes');

    await submit.previousReporting
      .fillReportingDate('2026-08-15');

    await submit.previousReporting.next();

    // Outcome is optional.
    await submit.evidence.verifyLoaded();
  }
);

test.skip(
  'TC-087 | Previous Reporting maximum field lengths @boundary @public @intake',
  async () => {
    // Pending approved business requirements for maximum
    // lengths of Previous Reporting text fields.
    //
    // Do not invent arbitrary max-length requirements.
  }
);
