import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';

test.describe(
  'Anonymous Report Submission - E2E',
  () => {

    test(
      'E2E-001 | Anonymous user can submit minimum valid whistleblowing report successfully @e2e @public @intake',
      async ({ page }) => {

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        // =====================================================
        // STEP 0 - REPORTING NOTICE
        // =====================================================

        await submit.open();

        await notice.verifyLoaded();
        await notice.next();

        // =====================================================
        // STEP 1 - REPORTER INFO
        // =====================================================

        await submit.reporterInfo.verifyLoaded();

        await submit.reporterInfo.fill({
          identityType: 'anonymous',
          reporterCategory: 'Employee'
        });

        await submit.reporterInfo.next();

        // =====================================================
        // STEP 2 - CLASSIFICATION
        // =====================================================

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

        // =====================================================
        // STEP 3 - ALLEGATION
        //
        // Stable valid data confirmed by previous testing.
        // =====================================================

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

        // =====================================================
        // STEP 4 - PERSON(S) INVOLVED
        // =====================================================

        await submit.personsInvolved.verifyLoaded();

        await submit.personsInvolved
          .selectCanIdentify('No');

        await submit.personsInvolved.next();

        // =====================================================
        // STEP 5 - WITNESSES
        // =====================================================

        await submit.witnesses.verifyLoaded();

        await submit.witnesses
          .selectWitnessAnswer('No');

        await submit.witnesses.next();

        // =====================================================
        // STEP 6 - EVIDENCE
        // =====================================================

        await submit.evidence.verifyLoaded();

        await submit.evidence
          .selectEvidenceAnswer('No');

        await submit.evidence.next();

        // =====================================================
        // STEP 7 - PREVIOUS REPORTING
        // =====================================================

        await submit.previousReporting
          .verifyLoaded();

        await submit.previousReporting
          .selectPreviouslyReported('No');

        await submit.previousReporting.next();

        // =====================================================
        // STEP 8 - DECLARATION
        // =====================================================

        await submit.declaration.verifyLoaded();

        await submit.declaration
          .acceptAllAcknowledgements();

        await submit.declaration
          .verifyBothAcknowledgementsChecked();

        // =====================================================
        // CAPTURE SUBMIT API
        //
        // Start waiting BEFORE clicking Submit Report.
        // =====================================================

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

        // =====================================================
        // SUBMIT REPORT
        // =====================================================

        await submit.declaration.submit();

        const response =
          await responsePromise;

        const status =
          response.status();

        // =====================================================
        // API VALIDATION
        // =====================================================

        console.log(
          'E2E-001 Submit Status:',
          status
        );

        expect(
          status,
          `Expected report submission to succeed but received HTTP ${status}`
        ).toBeGreaterThanOrEqual(200);

        expect(
          status,
          `Expected report submission to succeed but received HTTP ${status}`
        ).toBeLessThan(300);

        // =====================================================
        // RESPONSE VALIDATION
        //
        // Do NOT print the response body because it contains PIN.
        // =====================================================

        const responseBody =
          await response.json();

        expect(
          responseBody.ok,
          'Submit API should return ok=true'
        ).toBe(true);

        expect(
          responseBody.data,
          'Submit API should return report data'
        ).toBeTruthy();

        expect(
          responseBody.data.reference,
          'A report reference must be generated'
        ).toBeTruthy();

        expect(
          responseBody.data.reference,
          'Generated reference must follow RSG-YYYY-number format'
        ).toMatch(
          /^RSG-\d{4}-\d+$/
        );

        // =====================================================
        // SECURITY
        //
        // PIN may exist in the API response but must never
        // be written to automation logs.
        // =====================================================

        expect(
          responseBody.data.pin,
          'A PIN should be generated for anonymous reporter'
        ).toBeTruthy();

        // =====================================================
        // UI VALIDATION
        //
        // Successful submission must leave Declaration.
        // =====================================================

        await expect(
          page.getByRole('heading', {
            name: 'Declaration',
            level: 2
          })
        ).toBeHidden({
          timeout: 30000
        });

        await expect(
          page.getByText(
            'We could not save your application. Please try again.',
            {
              exact: true
            }
          )
        ).toBeHidden();

        // =====================================================
        // SAFE TEST LOG
        //
        // Reference is useful for traceability.
        // PIN is intentionally NOT logged.
        // =====================================================

        console.log(
          'E2E-001 Report Reference:',
          responseBody.data.reference
        );
      }
    );
  }
);