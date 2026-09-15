import { test, expect } from '@playwright/test';

import {
  SubmitReportPage
} from '../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../pages/public/ReportingNoticePage';

test.describe(
  'Full Report Submission - E2E',
  () => {

    test(
      'E2E-003 | Identified reporter submits full report with person, witness, evidence and previous reporting @e2e @public @intake',
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
          email: 'qa.full.report@example.com'
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
            'Potential procurement conflict of interest',

          whatHappened:
            'A procurement decision may have involved an employee with a personal relationship to a related party.',

          rulePolicyLaw:
            'Conflict of Interest Policy',

          awarenessMethod:
            'I became aware through internal business communication and supporting documentation.',

          incidentLocation:
            'Corporate Office',

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

        await submit.personsInvolved.fill({
          canIdentify: 'Yes',

          persons: [
            {
              fullName: 'Omar Hassan',
              position: 'Procurement Manager',
              company: 'Red Sea Global',
              department: 'Procurement',
              email: 'omar.hassan@example.com',
              phone: '0500000001',
              roleInIncident:
                'Person involved in the reported incident'
            }
          ]
        });

        expect(
          await submit.personsInvolved.getPersonCount()
        ).toBe(1);

        await submit.personsInvolved.next();

        // =====================================================
        // STEP 5 - WITNESSES
        // =====================================================

        await submit.witnesses.verifyLoaded();

        await submit.witnesses.fill({
          hasWitnesses: 'Yes',

          witnesses: [
            {
              firstName: 'Khalid',
              lastName: 'Hassan',
              position: 'Senior Specialist',
              department: 'Procurement',
              notes:
                'Witnessed activities related to the reported incident.'
            }
          ]
        });

        expect(
          await submit.witnesses.getWitnessCount()
        ).toBe(1);

        await submit.witnesses.next();

        // =====================================================
        // STEP 6 - EVIDENCE
        // =====================================================

        await submit.evidence.verifyLoaded();

        await submit.evidence.fill({
          hasSupportingEvidence: 'Yes',

          filePaths: [
            'test-data/files/validevidence.pdf'
          ]
        });

        await submit.evidence.verifyFileUploaded(
          'valid-evidence.pdf'
        );

        await submit.evidence.next();

        // =====================================================
        // STEP 7 - PREVIOUS REPORTING
        // =====================================================

        await submit.previousReporting.verifyLoaded();

        await submit.previousReporting
          .selectPreviouslyReported('Yes');

        await submit.previousReporting
          .verifySystemReferenceQuestionVisible();

        // No system reference number.
        // This avoids depending on an existing real report.
        await submit.previousReporting
          .selectSystemReferenceAnswer('No');

        await submit.previousReporting
          .verifyToWhomVisible();

        await submit.previousReporting
          .fillOutcome(
            'The concern was reported but no final outcome was communicated.'
          );

        await submit.previousReporting
          .fillFirstName('Sara');

        await submit.previousReporting
          .fillLastName('Ahmed');

        await submit.previousReporting
          .fillPositionDepartment(
            'Compliance / Governance'
          );

        await submit.previousReporting
          .selectExactDate('No');

        await submit.previousReporting
          .fillDateDescription(
            'August 2026'
          );

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
        //
        // Register listener BEFORE clicking Submit.
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

        console.log(
          'E2E-003 Submit Status:',
          status
        );

        // =====================================================
        // HTTP VALIDATION
        // =====================================================

        expect(
          status,
          `Expected full report submission to succeed but received HTTP ${status}`
        ).toBeGreaterThanOrEqual(200);

        expect(
          status,
          `Expected full report submission to succeed but received HTTP ${status}`
        ).toBeLessThan(300);

        // =====================================================
        // RESPONSE VALIDATION
        //
        // Do NOT log the full response body.
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
        // SUCCESS UI VALIDATION
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
        // Never log PIN or complete API response.
        // =====================================================

        console.log(
          'E2E-003 Report Reference:',
          responseBody.data.reference
        );
      }
    );
  }
);