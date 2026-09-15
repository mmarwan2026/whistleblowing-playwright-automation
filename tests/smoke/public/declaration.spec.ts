import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../../pages/public/ReportingNoticePage';

// ============================================================
// COMMON NAVIGATION
// Submit Report -> Declaration
//
// Purpose:
// Keep Declaration tests focused only on Declaration behavior.
// All previous wizard steps use the simplest valid data.
//
// IMPORTANT:
// "September 2026" is the stable valid approximate-date value.
// The longer approximate-date value that returns HTTP 502
// should be covered separately as a bug/regression scenario.
// ============================================================

async function navigateToDeclaration(
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
      'September 2026',

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
  //
  // Declaration tests are not Evidence tests.
  // Use the simplest valid path.
  // =========================================================

  await submit.evidence.verifyLoaded();

  await submit.evidence
    .selectEvidenceAnswer('No');

  await submit.evidence.next();

  // =========================================================
  // STEP 7 - PREVIOUS REPORTING
  //
  // Declaration tests are not Previous Reporting tests.
  // Use the simplest valid path.
  // =========================================================

  await submit.previousReporting
    .verifyLoaded();

  await submit.previousReporting
    .selectPreviouslyReported('No');

  await submit.previousReporting.next();

  // =========================================================
  // STEP 8 - DECLARATION
  // =========================================================

  await submit.declaration.verifyLoaded();
}

// ============================================================
// DECLARATION TEST SUITE
// TC-054 -> TC-059
// ============================================================

test.describe(
  'Declaration',
  () => {

    // ========================================================
    // TC-054
    // Verify Declaration page structure and initial state.
    // ========================================================

    test(
      'TC-054 | Declaration step displays two required acknowledgements and report actions @smoke @public @intake',
      async ({ page }) => {
        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        await navigateToDeclaration(
          submit,
          notice
        );

        await submit.declaration
          .verifyLoaded();

        // ----------------------------------------------------
        // Heading
        // ----------------------------------------------------

        await expect(
          page.getByRole('heading', {
            name: 'Declaration',
            level: 2
          })
        ).toBeVisible();

        // ----------------------------------------------------
        // Guidance
        // ----------------------------------------------------

        await expect(
          page.getByText(
            /Both acknowledgements are required before submitting your report/i
          )
        ).toBeVisible();

        // ----------------------------------------------------
        // Acknowledgements
        // ----------------------------------------------------

        const acknowledgements =
          page.getByRole('checkbox');

        await expect(
          acknowledgements
        ).toHaveCount(2);

        await expect(
          acknowledgements.nth(0)
        ).not.toBeChecked();

        await expect(
          acknowledgements.nth(1)
        ).not.toBeChecked();

        // ----------------------------------------------------
        // Navigation / Action buttons
        // ----------------------------------------------------

        await expect(
          page.getByRole('button', {
            name: 'Back',
            exact: true
          })
        ).toBeVisible();

        await expect(
          page.getByRole('button', {
            name: 'Submit Report',
            exact: true
          })
        ).toBeVisible();
      }
    );

    // ========================================================
    // TC-055
    // Neither declaration accepted.
    // Submission must be blocked.
    // ========================================================

    test(
      'TC-055 | Report cannot be submitted without accepting both declarations @public @intake @validation',
      async ({ page }) => {
        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        await navigateToDeclaration(
          submit,
          notice
        );

        await submit.declaration
          .verifyLoaded();

        const acknowledgements =
          page.getByRole('checkbox');

        await expect(
          acknowledgements
        ).toHaveCount(2);

        await expect(
          acknowledgements.nth(0)
        ).not.toBeChecked();

        await expect(
          acknowledgements.nth(1)
        ).not.toBeChecked();

        // ----------------------------------------------------
        // Attempt submission
        // ----------------------------------------------------

        await submit.declaration.submit();

        // ----------------------------------------------------
        // User must remain on Declaration.
        // ----------------------------------------------------

        await expect(
          page.getByRole('heading', {
            name: 'Declaration',
            level: 2
          })
        ).toBeVisible();

        // ----------------------------------------------------
        // State must remain unchanged.
        // ----------------------------------------------------

        await expect(
          acknowledgements.nth(0)
        ).not.toBeChecked();

        await expect(
          acknowledgements.nth(1)
        ).not.toBeChecked();
      }
    );

    // ========================================================
    // TC-056
    // First declaration only.
    // Submission must be blocked.
    // ========================================================

    test(
      'TC-056 | Report cannot be submitted when only the first declaration is accepted @public @intake @validation',
      async ({ page }) => {
        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        await navigateToDeclaration(
          submit,
          notice
        );

        await submit.declaration
          .verifyLoaded();

        const acknowledgements =
          page.getByRole('checkbox');

        await expect(
          acknowledgements
        ).toHaveCount(2);

        // ----------------------------------------------------
        // Accept first acknowledgement only.
        // ----------------------------------------------------

        await acknowledgements
          .nth(0)
          .click();

        await expect(
          acknowledgements.nth(0)
        ).toBeChecked();

        await expect(
          acknowledgements.nth(1)
        ).not.toBeChecked();

        // ----------------------------------------------------
        // Attempt submission
        // ----------------------------------------------------

        await submit.declaration.submit();

        // ----------------------------------------------------
        // Submission must remain blocked.
        // ----------------------------------------------------

        await expect(
          page.getByRole('heading', {
            name: 'Declaration',
            level: 2
          })
        ).toBeVisible();

        await expect(
          acknowledgements.nth(0)
        ).toBeChecked();

        await expect(
          acknowledgements.nth(1)
        ).not.toBeChecked();
      }
    );

    // ========================================================
    // TC-057
    // Second declaration only.
    // Submission must be blocked.
    // ========================================================

    test(
      'TC-057 | Report cannot be submitted when only the second declaration is accepted @public @intake @validation',
      async ({ page }) => {
        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        await navigateToDeclaration(
          submit,
          notice
        );

        await submit.declaration
          .verifyLoaded();

        const acknowledgements =
          page.getByRole('checkbox');

        await expect(
          acknowledgements
        ).toHaveCount(2);

        // ----------------------------------------------------
        // First remains unchecked.
        // ----------------------------------------------------

        await expect(
          acknowledgements.nth(0)
        ).not.toBeChecked();

        // ----------------------------------------------------
        // Accept second acknowledgement only.
        // ----------------------------------------------------

        await acknowledgements
          .nth(1)
          .click();

        await expect(
          acknowledgements.nth(1)
        ).toBeChecked();

        // ----------------------------------------------------
        // Attempt submission
        // ----------------------------------------------------

        await submit.declaration.submit();

        // ----------------------------------------------------
        // Submission must remain blocked.
        // ----------------------------------------------------

        await expect(
          page.getByRole('heading', {
            name: 'Declaration',
            level: 2
          })
        ).toBeVisible();

        await expect(
          acknowledgements.nth(0)
        ).not.toBeChecked();

        await expect(
          acknowledgements.nth(1)
        ).toBeChecked();
      }
    );

    // ========================================================
    // TC-058
    // Both declarations can be accepted.
    //
    // This test validates Declaration checkbox behavior only.
    // It intentionally does NOT submit the report.
    // ========================================================

    test(
      'TC-058 | User can accept both required declarations @smoke @public @intake',
      async ({ page }) => {
        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        await navigateToDeclaration(
          submit,
          notice
        );

        await submit.declaration
          .verifyLoaded();

        // ----------------------------------------------------
        // Accept both using Declaration POM.
        // ----------------------------------------------------

        await submit.declaration
          .acceptAllAcknowledgements();

        // ----------------------------------------------------
        // Verify both are selected.
        // ----------------------------------------------------

        await submit.declaration
          .verifyBothAcknowledgementsChecked();

        // ----------------------------------------------------
        // Submit action remains available.
        // ----------------------------------------------------

        await expect(
          page.getByRole('button', {
            name: 'Submit Report',
            exact: true
          })
        ).toBeVisible();
      }
    );

    // ========================================================
    // TC-059
    // Happy Path:
    // Both declarations accepted + successful report submit.
    //
    // Stable valid baseline:
    // Exact Date = No
    // Incident Date Description = September 2026
    // ========================================================

    test(
      'TC-059 | User can accept both declarations and submit the report successfully @smoke @public @intake',
      async ({ page }) => {
        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        await navigateToDeclaration(
          submit,
          notice
        );

        await submit.declaration
          .verifyLoaded();

        // ----------------------------------------------------
        // Accept both declarations.
        // ----------------------------------------------------

        await submit.declaration
          .acceptAllAcknowledgements();

        await submit.declaration
          .verifyBothAcknowledgementsChecked();

        // ----------------------------------------------------
        // Prepare exact Submit API wait BEFORE clicking Submit.
        // ----------------------------------------------------

        const responsePromise =
          page.waitForResponse(
            response =>
              response.request().method() === 'POST' &&
              response.url().includes(
                '/portal/v1/registration/submit'
              ),
            {
              timeout: 30000
            }
          );

        // ----------------------------------------------------
        // Submit report.
        // ----------------------------------------------------

        await submit.declaration.submit();

        const response =
          await responsePromise;

        const status =
          response.status();

        // ----------------------------------------------------
        // Useful but safe diagnostic.
        //
        // Do not print response body because successful
        // response may contain report reference / PIN.
        // ----------------------------------------------------

        console.log(
          'TC-059 Submit API:',
          response.request().method(),
          response.url(),
          status
        );

        // ----------------------------------------------------
        // API must return successful 2xx.
        // ----------------------------------------------------

        expect(
          status,
          `Expected successful report submission but received HTTP ${status}`
        ).toBeGreaterThanOrEqual(200);

        expect(
          status,
          `Expected successful report submission but received HTTP ${status}`
        ).toBeLessThan(300);

        // ----------------------------------------------------
        // Save error must not be displayed.
        // ----------------------------------------------------

        await expect(
          page.getByText(
            'We could not save your application. Please try again.',
            {
              exact: true
            }
          )
        ).toBeHidden();

        // ----------------------------------------------------
        // Successful submission should leave Declaration.
        // ----------------------------------------------------

        await expect(
          page.getByRole('heading', {
            name: 'Declaration',
            level: 2
          })
        ).toBeHidden({
          timeout: 30000
        });
      }
    );
  }
);