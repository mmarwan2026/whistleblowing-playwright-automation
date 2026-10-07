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
  EntitiesInvolvedStep
} from '../../pages/public/submit-report/steps/EntitiesInvolvedStep';

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

        const entitiesInvolved =
          new EntitiesInvolvedStep(page);

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
        // CLASSIFICATION
        // =====================================================

        await submit.classification.verifyLoaded();

        await submit.classification.fill(
          data.classification
        );

        await submit.classification.next();


        // =====================================================
        // STEP 3
        // ALLEGATION
        // =====================================================

        await submit.allegation.verifyLoaded();

        await submit.allegation.fill(
          data.allegation
        );

        await submit.allegation.next();


        // =====================================================
        // STEP 4
        // PERSON(S) INVOLVED
        // =====================================================

        await submit.personsInvolved.verifyLoaded();

        await submit.personsInvolved.fill(
          data.personsInvolved
        );

        await submit.personsInvolved.next();


        // =====================================================
        // STEP 5
        // ENTITIES INVOLVED
        // =====================================================

        await entitiesInvolved.verifyLoaded();

        await entitiesInvolved.fill(
          data.entitiesInvolved
        );

        await entitiesInvolved.next();


        // =====================================================
        // STEP 6
        // WITNESSES
        // =====================================================

        await submit.witnesses.verifyLoaded();

        await submit.witnesses.fill(
          data.witnesses
        );

        await submit.witnesses.next();


        // =====================================================
        // STEP 7
        // PREVIOUS REPORTING
        // =====================================================

        await submit.previousReporting.verifyLoaded();

        await submit.previousReporting.fill(
          data.previousReporting
        );

        await submit.previousReporting.next();


        // =====================================================
        // STEP 8
        // EVIDENCE
        // =====================================================

        await submit.evidence.verifyLoaded();

        await submit.evidence.fill(
          data.evidence
        );

        await submit.evidence.next();


        // =====================================================
        // STEP 9
        // DECLARATION
        // =====================================================

        await submit.declaration.verifyLoaded();

        await submit.declaration
          .acceptAllAcknowledgements();

        await submit.declaration
          .verifyBothAcknowledgementsChecked();


        // =====================================================
        // STEP 10
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