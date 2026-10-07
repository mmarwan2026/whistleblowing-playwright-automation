import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import { EntitiesInvolvedStep } from '../../pages/public/submit-report/steps/EntitiesInvolvedStep';

import { FullAnonymousReportData } from '../../data/e2e/FullAnonymousReportData';

import { submitAndValidate } from '../../helpers/public/submitReportAssertions';


test.describe('Anonymous Full Report Submission - E2E', () => {

    test(
        'E2E-005 | Anonymous reporter submits full report with person, witness, evidence and previous reporting @e2e @public @intake',
        async ({ page }) => {

            const submit = new SubmitReportPage(page);
            const notice = new ReportingNoticePage(page);
            const entitiesInvolved = new EntitiesInvolvedStep(page);

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

            await entitiesInvolved.verifyLoaded();

            await entitiesInvolved.fill(
                data.entitiesInvolved
            );

            expect(
                await entitiesInvolved.getEntityCount(),
                'Entity count should match test data'
            ).toBe(
                data.entitiesInvolved.entities?.length ?? 0
            );

            await entitiesInvolved.next();


            // ============================================================
            // WITNESSES
            // ============================================================

            await submit.witnesses.verifyLoaded();

            await submit.witnesses.fill(
                data.witnesses
            );

            expect(
                await submit.witnesses.getWitnessCount(),
                'Witness count should match test data'
            ).toBe(
                data.witnesses.witnesses?.length ?? 0
            );

            await submit.witnesses.next();


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
                'valid-evidence.pdf'
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
