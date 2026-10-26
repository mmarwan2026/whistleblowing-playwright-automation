import { expect, test } from '@playwright/test';

import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import { MinimumIdentifiedReportData } from '../../data/e2e/MinimumIdentifiedReportData';

import { submitAndValidate } from '../../helpers/public/submitReportAssertions';


test.describe('Identified Report Submission - E2E', () => {

  test(
    'E2E-002 | Identified reporter submits minimum valid whistleblowing report successfully @e2e @public @intake',
    async ({ page }) => {

      const submit = new SubmitReportPage(page);
      const notice = new ReportingNoticePage(page);
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
      // REPORT DETAILS
      // ============================================================

      await submit.reportDetails.verifyLoaded();
      await submit.reportDetails.fill(data.reportDetails!);
      await submit.reportDetails.next();


      // ============================================================
      // PERSON(S) INVOLVED
      // ============================================================

      await submit.personsInvolved.verifyLoaded();

      await submit.personsInvolved.fill(
        data.personsInvolved
      );

      await expect(
        page.getByRole('textbox', { name: 'Full Name 1', exact: true })
      ).toHaveValue('Synthetic Involved Person');

      await expect(
        page.getByRole('combobox', { name: 'Role In Incident 1', exact: true })
      ).toHaveValue('Alleged Perpetrator');

      await submit.personsInvolved.next();


      // ============================================================
      // ENTITIES INVOLVED
      // ============================================================

      await submit.entitiesInvolved.verifyLoaded();

      await submit.entitiesInvolved.fill(
        data.entitiesInvolved
      );

      await submit.entitiesInvolved.next();


      // ============================================================
      // PREVIOUS REPORTING
      // ============================================================

      await submit.previousReporting.verifyLoaded();

      await submit.previousReporting.fill(
        data.previousReporting
      );
      // ============================================================
      // NEXT FROM PREVIOUS REPORTING
      // ============================================================

      await submit.previousReporting.next();


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

      await submit.declaration.acceptAcknowledgement();

      await submit.declaration.verifyAcknowledgementChecked();


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
