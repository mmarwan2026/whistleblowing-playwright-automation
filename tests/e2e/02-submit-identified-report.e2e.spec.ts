import { test } from '@playwright/test';

import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import { EntitiesInvolvedStep } from '../../pages/public/submit-report/steps/EntitiesInvolvedStep';

import { MinimumIdentifiedReportData } from '../../data/e2e/MinimumIdentifiedReportData';

import { submitAndValidate } from '../../helpers/public/submitReportAssertions';


test.describe('Identified Report Submission - E2E', () => {

  test(
    'E2E-002 | Identified reporter submits minimum valid whistleblowing report successfully @e2e @public @intake',
    async ({ page }) => {

      const submit = new SubmitReportPage(page);
      const notice = new ReportingNoticePage(page);
      const entitiesInvolved = new EntitiesInvolvedStep(page);

      const data = MinimumIdentifiedReportData;


      // ============================================================
      // REPORTING NOTICE
      // ============================================================

      await submit.open();

      await notice.verifyLoaded();
      await notice.next();


      // ============================================================
      // REPORTER INFO
      // ============================================================

      await submit.reporterInfo.verifyLoaded();

      await submit.reporterInfo.fill(
        data.reporter
      );

      await submit.reporterInfo.next();


      // ============================================================
      // CLASSIFICATION
      // ============================================================

      await submit.classification.verifyLoaded();

      await submit.classification.fill(
        data.classification
      );

      await submit.classification.next();


      // ============================================================
      // ALLEGATION
      // ============================================================

      await submit.allegation.verifyLoaded();

      await submit.allegation.fill(
        data.allegation
      );

      await submit.allegation.next();


      // ============================================================
      // PERSON(S) INVOLVED
      // ============================================================

      await submit.personsInvolved.verifyLoaded();

      await submit.personsInvolved.fill(
        data.personsInvolved
      );

      await submit.personsInvolved.next();


      // ============================================================
      // ENTITIES INVOLVED
      // ============================================================

      await entitiesInvolved.verifyLoaded();

      await entitiesInvolved.fill(
        data.entitiesInvolved
      );

      await entitiesInvolved.next();


      // ============================================================
      // WITNESSES
      // ============================================================

      await submit.witnesses.verifyLoaded();

      await submit.witnesses.fill(
        data.witnesses
      );

      await submit.witnesses.next();


      // ============================================================
      // PREVIOUS REPORTING
      // ============================================================

      await submit.previousReporting.verifyLoaded();

      await submit.previousReporting.fill(
        data.previousReporting
      );


      // ============================================================
      // DIAGNOSTIC - BEFORE PREVIOUS REPORTING NEXT
      // ============================================================

      console.log('');
      console.log('========================================');
      console.log('PREVIOUS REPORTING - BEFORE NEXT');
      console.log('URL:', page.url());

      console.log(
        'HEADINGS:',
        await page
          .locator('h1,h2,h3,h4,h5,h6')
          .allTextContents()
      );

      console.log(
        'BUTTONS:',
        await page
          .getByRole('button')
          .allTextContents()
      );

      console.log('========================================');
      console.log('');


      // ============================================================
      // NEXT FROM PREVIOUS REPORTING
      // ============================================================

      await submit.previousReporting.next();


      // ============================================================
      // WAIT FOR UI UPDATE
      // ============================================================

      await page.waitForTimeout(500);


      // ============================================================
      // DIAGNOSTIC - AFTER PREVIOUS REPORTING NEXT
      // ============================================================

      console.log('');
      console.log('========================================');
      console.log('PREVIOUS REPORTING - AFTER NEXT');
      console.log('URL:', page.url());

      console.log(
        'HEADINGS:',
        await page
          .locator('h1,h2,h3,h4,h5,h6')
          .allTextContents()
      );

      console.log(
        'BUTTONS:',
        await page
          .getByRole('button')
          .allTextContents()
      );

      console.log('========================================');
      console.log('');


      // ============================================================
      // EVIDENCE
      // ============================================================

      await submit.evidence.verifyLoaded();

      await submit.evidence.fill(
        data.evidence
      );

      await submit.evidence.next();


      // ============================================================
      // DECLARATION
      // ============================================================

      await submit.declaration.verifyLoaded();

      await submit.declaration.acceptAllAcknowledgements();

      await submit.declaration.verifyBothAcknowledgementsChecked();


      // ============================================================
      // SUBMIT + VALIDATE
      // ============================================================

      await submitAndValidate(
        page,
        submit,
        'E2E-002'
      );

    }
  );

});
