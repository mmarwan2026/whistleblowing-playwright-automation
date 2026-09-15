import { test, expect } from '@playwright/test';

import {
  SubmitReportPage
} from '../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../pages/public/ReportingNoticePage';

test.describe(
   'Identified Report Submission - E2E',
  () => {

    test(
      'E2E-002 | Identified reporter submits minimum valid whistleblowing report successfully @e2e @public @intake',
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
          identityType: 'identified',

          firstName: 'Ahmed',
          lastName: 'Ali',

          company: 'Red Sea Global',
          department: 'Quality Assurance',
          position: 'QA Engineer',

          mobile: '0500000000',
          email: 'qa.automation@example.com'
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

          // Stable value confirmed by previous submit testing.
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

        await submit.previousReporting.verifyLoaded();

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
        // WAIT FOR SUBMIT API
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
        // SUBMIT
        // =====================================================

        await submit.declaration.submit();

        const response =
          await responsePromise;

        const status =
          response.status();

        console.log(
          'E2E-002 Submit Status:',
          status
        );

        // =====================================================
        // HTTP VALIDATION
        // =====================================================

        expect(
          status,
          `Expected identified report submission to succeed but received HTTP ${status}`
        ).toBeGreaterThanOrEqual(200);

        expect(
          status,
          `Expected identified report submission to succeed but received HTTP ${status}`
        ).toBeLessThan(300);

        // =====================================================
        // RESPONSE VALIDATION
        //
        // Never log the complete response.
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
          'Generated reference should follow RSG-YYYY-number format'
        ).toMatch(
          /^RSG-\d{4}-\d+$/
        );

        // =====================================================
        // UI SUCCESS VALIDATION
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
        // SAFE LOGGING
        //
        // Reference can be logged for test traceability.
        // Never log response body / PIN.
        // =====================================================

        console.log(
          'E2E-002 Report Reference:',
          responseBody.data.reference
        );
      }
    );
  }
);