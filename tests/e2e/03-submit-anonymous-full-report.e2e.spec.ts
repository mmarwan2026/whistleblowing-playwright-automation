import { test, expect } from '@playwright/test';

import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { ReportingNoticePage } from '../../pages/public/ReportingNoticePage';
import {
    FullAnonymousAnotherChannelReportData,
    FullAnonymousFirstTimeReportData,
    FullAnonymousReportData
} from '../../data/e2e/FullAnonymousReportData';
import { FollowUpFlow } from '../../flows/public/FollowUpFlow';

import { submitAndValidate } from '../../helpers/public/submitReportAssertions';


test.describe('Anonymous Full Report Submission - E2E', () => {

    const scenarios = [
        {
            name: 'platform reporting',
            testId: 'E2E-005',
            data: FullAnonymousReportData
        },
        {
            name: 'another reporting channel',
            testId: 'E2E-006',
            data: FullAnonymousAnotherChannelReportData
        },
        {
            name: 'first-time reporting',
            testId: 'E2E-007',
            data: FullAnonymousFirstTimeReportData
        }
    ];

    for (const scenario of scenarios) {
        test(
        `${scenario.testId} | Anonymous reporter submits full report with ${scenario.name} @e2e @public @intake`,
        async ({ page, browser }) => {

            const submit = new SubmitReportPage(page);
            const notice = new ReportingNoticePage(page);
            const data = scenario.data;


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

            await expect(page.getByRole('combobox', { name: 'Role In Incident 2', exact: true }))
                .toHaveValue('Witness');

            await expect(page.getByRole('combobox', { name: 'Role In Incident 1', exact: true }))
                .toHaveValue('Alleged Perpetrator');

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

            await submit.declaration.acceptAcknowledgement();

            await submit.declaration.verifyAcknowledgementChecked();


            // ============================================================
            // SUBMIT + API + REFERENCE VALIDATION
            // ============================================================

            const result = await submitAndValidate(
                page,
                submit,
                scenario.testId
            );

            // ============================================================
            // ANONYMOUS FOLLOW-UP PIN
            // ============================================================

            expect(
                result.pin,
                'Anonymous report should generate a PIN'
            ).toBeTruthy();

            // ============================================================
            // VIEW REPORT - VERIFY ALL ENTERED DATA
            // ============================================================

            const followUpContext = await browser.newContext();

            try {
                const followUpPage = await followUpContext.newPage();
                const followUp = new FollowUpFlow(followUpPage);

                await followUp.accessCase({
                    referenceNumber: result.reference,
                    pin: result.pin
                });

                await followUp.casePage.expectSubmittedReport(data);
            } finally {
                await followUpContext.close();
            }

        }
        );
    }

});
