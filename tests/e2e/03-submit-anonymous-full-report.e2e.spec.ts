import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import { FullAnonymousReportData } from '../../data/e2e/FullAnonymousReportData';

import { submitAndValidate } from '../../helpers/public/submitReportAssertions';


test.describe('Anonymous Full Report Submission - E2E', () => {

    test(
        'E2E-005 | Anonymous reporter submits full report with person, witness role, evidence and previous reporting @e2e @public @intake',
        async ({ page }) => {

            const submit = new SubmitReportPage(page);
            const notice = new ReportingNoticePage(page);
            const data = FullAnonymousReportData;


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

            expect(
                await submit.personsInvolved.getPersonCount(),
                'Person count should match test data'
            ).toBe(
                data.personsInvolved.persons?.length ?? 0
            );

            await submit.personsInvolved.next();


            // ============================================================
            // ENTITIES INVOLVED
            // ============================================================

            await submit.entitiesInvolved.verifyLoaded();

            await submit.entitiesInvolved.fill(
                data.entitiesInvolved
            );

            expect(
                await submit.entitiesInvolved.getEntityCount(),
                'Entity count should match test data'
            ).toBe(
                data.entitiesInvolved.entities?.length ?? 0
            );

            await submit.entitiesInvolved.next();


            // ============================================================
            // PREVIOUS REPORTING
            // ============================================================

            await submit.previousReporting.verifyLoaded();

            await submit.previousReporting.fill(
                data.previousReporting
            );

            await submit.previousReporting.next();


            // ============================================================
            // EVIDENCE
            // ============================================================

            await submit.evidence.verifyLoaded();

            await submit.evidence.fill(
                data.evidence
            );

            await submit.evidence.verifyFileUploaded(
                'validevidence.pdf'
            );

            await submit.evidence.next();


            // ============================================================
            // DECLARATION
            // ============================================================

            await submit.declaration.verifyLoaded();

            await submit.declaration.acceptAllAcknowledgements();

            await submit.declaration.verifyBothAcknowledgementsChecked();


            // ============================================================
            // SUBMIT + API + REFERENCE VALIDATION
            // ============================================================

            const result = await submitAndValidate(
                page,
                submit,
                'E2E-005'
            );


            // ============================================================
            // ANONYMOUS FOLLOW-UP PIN
            // ============================================================

            expect(
                result.pin,
                'Anonymous report should generate a PIN'
            ).toBeTruthy();

        }
    );

});
