import {
    test,
    expect
} from '@playwright/test';

import {
    SubmitReportPage
} from '../../pages/public/submit-report/SubmitReportPage';

import {
    ReportingNoticePage
} from '../../pages/public/ReportingNoticePage';

test(
    'DISCOVERY | Entities Involved DOM',
    async ({ page }) => {

        const submit =
            new SubmitReportPage(page);

        const notice =
            new ReportingNoticePage(page);


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

        await submit.reporterInfo.fill({
            identityType: 'anonymous',
            reporterCategory: 'Employee'
        });

        await submit.reporterInfo.next();


        // ============================================================
        // CLASSIFICATION
        // ============================================================

        await submit.classification.verifyLoaded();

        await submit.classification
            .selectInternalAuditAnswer('No');

        await submit.classification
            .selectCategory('Nepotism/Cronyism');

        await submit.classification.next();


        // ============================================================
        // ALLEGATION
        // ============================================================

        await submit.allegation.verifyLoaded();

        await submit.allegation.fill({
            incidentTitle:
                'Entities discovery test',

            whatHappened:
                'This report is used to inspect the Entities Involved user interface.',

            awarenessMethod:
                'Internal business communication',

            knowsExactDate:
                'No',

            incidentDateDescription:
                'September 2026',

            ongoing:
                'No'
        });

        await submit.allegation.next();


        // ============================================================
        // PERSON(S) INVOLVED
        // ============================================================

        await submit.personsInvolved.verifyLoaded();

        await submit.personsInvolved
            .selectCanIdentify('No');

        await submit.personsInvolved.next();


        // ============================================================
        // ENTITIES INVOLVED
        // ============================================================

        await expect(
            page.getByRole('heading', {
                name: 'Entities Involved',
                exact: true
            })
        ).toBeVisible();


        // Select YES so the entity table becomes visible.

        await page.getByRole(
            'radio',
            {
                name: 'Yes',
                exact: true
            }
        ).check();


        // ============================================================
        // DISCOVER TABLE
        // ============================================================

        const tables =
            page.getByRole('table');

        console.log(
            'ENTITIES TABLE COUNT:',
            await tables.count()
        );


        // ============================================================
        // DISCOVER TEXTBOXES
        // ============================================================

        const textboxes =
            page.getByRole('textbox');

        console.log(
            'ENTITIES TEXTBOX COUNT:',
            await textboxes.count()
        );

        for (
            let i = 0;
            i < await textboxes.count();
            i++
        ) {
            const textbox =
                textboxes.nth(i);

            console.log(
                `TEXTBOX ${i + 1}:`,
                {
                    ariaLabel:
                        await textbox.getAttribute(
                            'aria-label'
                        ),

                    name:
                        await textbox.getAttribute(
                            'name'
                        ),

                    id:
                        await textbox.getAttribute(
                            'id'
                        ),

                    placeholder:
                        await textbox.getAttribute(
                            'placeholder'
                        )
                }
            );
        }


        // ============================================================
        // DISCOVER BUTTONS
        // ============================================================

        const buttons =
            page.getByRole('button');

        console.log(
            'BUTTON COUNT:',
            await buttons.count()
        );

        for (
            let i = 0;
            i < await buttons.count();
            i++
        ) {
            const button =
                buttons.nth(i);

            console.log(
                `BUTTON ${i + 1}:`,
                {
                    text:
                        (
                            await button.innerText()
                        ).trim(),

                    ariaLabel:
                        await button.getAttribute(
                            'aria-label'
                        ),

                    title:
                        await button.getAttribute(
                            'title'
                        )
                }
            );
        }


        // ============================================================
        // DISCOVER INITIAL ROW
        // ============================================================

        if (await tables.count()) {

            const table =
                tables.first();

            console.log(
                'TABLE HTML:'
            );

            console.log(
                await table.evaluate(
                    element =>
                        element.outerHTML
                )
            );


            const rows =
                table.getByRole('row');

            console.log(
                'INITIAL ROW COUNT INCLUDING HEADER:',
                await rows.count()
            );
        }


        // ============================================================
        // DISCOVER ADD CONTROL
        // ============================================================

        const entityButtons =
            page.getByRole(
                'button',
                {
                    name: 'Entities Involved',
                    exact: true
                }
            );

        console.log(
            'ADD ENTITY BUTTON COUNT:',
            await entityButtons.count()
        );


        // ============================================================
        // TRY ADD SECOND ENTITY
        // ============================================================

        if (
            await entityButtons.count() > 0
        ) {

            await entityButtons.first().click();

            await page.waitForTimeout(300);


            console.log(
                'TEXTBOX COUNT AFTER ADD:',
                await page
                    .getByRole('textbox')
                    .count()
            );


            if (await tables.count()) {

                const rows =
                    tables
                        .first()
                        .getByRole('row');

                console.log(
                    'ROW COUNT AFTER ADD INCLUDING HEADER:',
                    await rows.count()
                );


                console.log(
                    'TABLE HTML AFTER ADD:'
                );

                console.log(
                    await tables
                        .first()
                        .evaluate(
                            element =>
                                element.outerHTML
                        )
                );
            }
        }


        // Keep test successful.
        expect(true).toBe(true);
    }
);