import {
  test
} from '@playwright/test';

import {
  SubmitReportPage
} from '../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../pages/public/ReportingNoticePage';

import {
  MinimumAnonymousReportData
} from '../../data/e2e/MinimumAnonymousReportData';

import {
  submitAndValidate
} from '../../helpers/public/submitReportAssertions';


test.describe(
  'Anonymous Report Submission - E2E',
  () => {

    test(
      'E2E-001 | Anonymous user can submit minimum valid whistleblowing report successfully @e2e @public @intake',

      async ({ page }) => {

        // =====================================================
        // SETUP
        // =====================================================

        const submit =
          new SubmitReportPage(page);

        const notice =
          new ReportingNoticePage(page);

        const data =
          MinimumAnonymousReportData;


        // =====================================================
        // STEP 0
        // REPORTING NOTICE
        // =====================================================

        await submit.open();

        await notice.verifyLoaded();

        await notice.next();


        // =====================================================
        // STEP 1
        // REPORTER INFO
        // =====================================================

        await submit.reporterInfo.verifyLoaded();

        await submit.reporterInfo.fill(
          data.reporter
        );

        await submit.reporterInfo.next();


        // =====================================================
        // STEP 2
        // REPORT DETAILS
        // =====================================================

        await submit.reportDetails.verifyLoaded();
        await submit.reportDetails.fill(data.reportDetails!);
        await submit.reportDetails.next();


        // =====================================================
        // STEP 3
        // PERSON(S) INVOLVED
        // =====================================================

        await submit.personsInvolved.verifyLoaded();

        await submit.personsInvolved.fill(
          data.personsInvolved
        );

        await submit.personsInvolved.next();


        // =====================================================
        // STEP 4
        // ENTITIES INVOLVED
        // =====================================================

        await submit.entitiesInvolved.verifyLoaded();

        await submit.entitiesInvolved.fill(
          data.entitiesInvolved
        );

        await submit.entitiesInvolved.next();


        // =====================================================
        // STEP 5
        // PREVIOUS REPORTING
        // =====================================================

        await submit.previousReporting.verifyLoaded();

        await submit.previousReporting.fill(
          data.previousReporting
        );

        await submit.previousReporting.next();


        // =====================================================
        // STEP 6
        // EVIDENCE
        // =====================================================

        await submit.evidence.verifyLoaded();

        await submit.evidence.fill(
          data.evidence
        );

        await submit.evidence.next();


        // =====================================================
        // FINAL ACKNOWLEDGEMENT
        // DECLARATION
        // =====================================================

        await submit.declaration.verifyLoaded();

        await submit.declaration
          .acceptAcknowledgement();

        await submit.declaration
          .verifyAcknowledgementChecked();


        // =====================================================
        // SUBMISSION
        // SUBMIT + VALIDATE
        // =====================================================

        await submitAndValidate(
          page,
          submit,
          'E2E-001'
        );
      }
    );
  }
);
