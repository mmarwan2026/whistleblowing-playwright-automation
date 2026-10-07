import {
    test,
    expect
} from '@playwright/test';

import {
    SubmitReportPage
} from '../../../pages/public/submit-report/SubmitReportPage';

import {
    ReportingNoticePage
} from '../../../pages/public/ReportingNoticePage';

import {
    EntitiesInvolvedStep
} from '../../../pages/public/submit-report/steps/EntitiesInvolvedStep';


// ============================================================
// COMMON SETUP
// Navigate to Entities Involved Step
// ============================================================

async function navigateToEntitiesInvolved(
    submit: SubmitReportPage,
    notice: ReportingNoticePage
): Promise<void> {

    // ==========================================================
    // STEP 0 - REPORTING NOTICE
    // ==========================================================

    await submit.open();

    await notice.verifyLoaded();
    await notice.next();


    // ==========================================================
    // STEP 1 - REPORTER INFO
    // ==========================================================

    await submit.reporterInfo.verifyLoaded();

    await submit.reporterInfo.fill({
        identityType: 'anonymous',
        reporterCategory: 'Employee'
    });

    await submit.reporterInfo.next();


    // ==========================================================
    // STEP 2 - CLASSIFICATION
    // ==========================================================

    await submit.classification.verifyLoaded();

    await submit.classification
        .selectInternalAuditAnswer('No');

    await submit.classification
        .selectCategory(
            'Nepotism/Cronyism'
        );

    await submit.classification.next();


    // ==========================================================
    // STEP 3 - ALLEGATION
    // ==========================================================

    await submit.allegation.verifyLoaded();

    await submit.allegation.fill({
        incidentTitle:
            'Potential conflict of interest',

        whatHappened:
            'An employee may have participated in a decision involving a related party.',

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


    // ==========================================================
    // STEP 4 - PERSON(S) INVOLVED
    // ==========================================================

    await submit.personsInvolved.verifyLoaded();

    await submit.personsInvolved
        .selectCanIdentify('No');

    await submit.personsInvolved.next();
}


// ============================================================
// ENTITIES INVOLVED TEST SUITE
// ============================================================

test.describe(
    'Entities Involved @public @intake',
    () => {


        // ========================================================
        // TC-043
        // Select No
        // ========================================================

        test(
            'TC-043 | User can select No for Entities Involved and continue @smoke',
            async ({ page }) => {

                const submit =
                    new SubmitReportPage(page);

                const notice =
                    new ReportingNoticePage(page);

                const entities =
                    new EntitiesInvolvedStep(page);


                // ----------------------------------------------------
                // Navigate
                // ----------------------------------------------------

                await navigateToEntitiesInvolved(
                    submit,
                    notice
                );


                // ----------------------------------------------------
                // Verify Entities Involved loaded
                // ----------------------------------------------------

                await entities.verifyLoaded();


                // ----------------------------------------------------
                // Select No
                // ----------------------------------------------------

                await entities
                    .selectCanIdentify('No');


                // ----------------------------------------------------
                // Continue
                // ----------------------------------------------------

                await entities.next();


                // ----------------------------------------------------
                // Verify next workflow step
                // Entities Involved -> Witnesses
                // ----------------------------------------------------

                await expect(
                    page.getByRole(
                        'heading',
                        {
                            name: 'Witnesses',
                            level: 2
                        }
                    )
                ).toBeVisible();
            }
        );
    }
);// ========================================================
// TC-044
// Yes + Valid Entity Name
// ========================================================

test(
    'TC-044 | User can identify an entity and continue @smoke',
    async ({ page }) => {

        const submit =
            new SubmitReportPage(page);

        const notice =
            new ReportingNoticePage(page);

        const entities =
            new EntitiesInvolvedStep(page);


        // ----------------------------------------------------
        // Navigate
        // ----------------------------------------------------

        await navigateToEntitiesInvolved(
            submit,
            notice
        );


        // ----------------------------------------------------
        // Verify Entities Involved loaded
        // ----------------------------------------------------

        await entities.verifyLoaded();


        // ----------------------------------------------------
        // Select Yes
        // ----------------------------------------------------

        await entities
            .selectCanIdentify('Yes');


        // Initial row should exist automatically
        expect(
            await entities.getEntityCount()
        ).toBe(1);


        // ----------------------------------------------------
        // Enter valid entity
        // ----------------------------------------------------

        await entities.enterEntityName(
            0,
            'Red Sea Test Supplier'
        );


        await entities.verifyEntityName(
            0,
            'Red Sea Test Supplier'
        );


        // ----------------------------------------------------
        // Continue
        // ----------------------------------------------------

        await entities.next();


        // ----------------------------------------------------
        // Verify next workflow step
        // ----------------------------------------------------

        await expect(
            page.getByRole(
                'heading',
                {
                    name: 'Witnesses',
                    level: 2
                }
            )
        ).toBeVisible();
    }
);// ========================================================
// TC-045
// Entity Name is mandatory
// ========================================================

test(
    'TC-045 | Entity Name is mandatory when Entities Involved is Yes @regression @validation @negative',
    async ({ page }) => {

        const submit =
            new SubmitReportPage(page);

        const notice =
            new ReportingNoticePage(page);

        const entities =
            new EntitiesInvolvedStep(page);


        await navigateToEntitiesInvolved(
            submit,
            notice
        );


        await entities.verifyLoaded();


        // Select Yes
        await entities
            .selectCanIdentify('Yes');


        // Initial row must exist
        expect(
            await entities.getEntityCount()
        ).toBe(1);


        // IMPORTANT:
        // Do NOT enter Entity Name.


        // Attempt to continue
        await entities.next();


        // User must remain on Entities Involved
        await expect(
            page.getByRole(
                'heading',
                {
                    name: 'Entities Involved',
                    exact: true
                }
            )
        ).toBeVisible();


        // Entity Name field must still be visible
        await expect(
            page.getByRole(
                'textbox',
                {
                    name: 'Entity Name 1',
                    exact: true
                }
            )
        ).toBeVisible();


        // Must NOT navigate to Witnesses
        await expect(
            page.getByRole(
                'heading',
                {
                    name: 'Witnesses',
                    level: 2
                }
            )
        ).toBeHidden();
    }
);// ========================================================
// TC-046
// Add Multiple Entities
// ========================================================

test(
    'TC-046 | User can add multiple entities involved @regression',
    async ({ page }) => {

        const submit =
            new SubmitReportPage(page);

        const notice =
            new ReportingNoticePage(page);

        const entities =
            new EntitiesInvolvedStep(page);


        await navigateToEntitiesInvolved(
            submit,
            notice
        );

        await entities.verifyLoaded();

        await entities
            .selectCanIdentify('Yes');


        // Initial row
        expect(
            await entities.getEntityCount()
        ).toBe(1);


        // ====================================================
        // ENTITY 1
        // ====================================================

        await entities.enterEntityName(
            0,
            'Red Sea Test Supplier'
        );


        // ====================================================
        // ADD ENTITY 2
        // ====================================================

        await entities.addEntity();


        expect(
            await entities.getEntityCount()
        ).toBe(2);


        // ====================================================
        // ENTITY 2
        // ====================================================

        await entities.enterEntityName(
            1,
            'QA Test Contractor'
        );


        // ====================================================
        // VERIFY BOTH ROWS
        // ====================================================

        await entities.verifyEntityName(
            0,
            'Red Sea Test Supplier'
        );

        await entities.verifyEntityName(
            1,
            'QA Test Contractor'
        );


        expect(
            await entities.getEntityCount()
        ).toBe(2);


        // ====================================================
        // CONTINUE
        // ====================================================

        await entities.next();


        await expect(
            page.getByRole(
                'heading',
                {
                    name: 'Witnesses',
                    level: 2
                }
            )
        ).toBeVisible();
    }
);// ========================================================
// TC-047
// Remove Entity
// ========================================================

test(
    'TC-047 | User can remove an added entity involved @regression',
    async ({ page }) => {

        const submit =
            new SubmitReportPage(page);

        const notice =
            new ReportingNoticePage(page);

        const entities =
            new EntitiesInvolvedStep(page);


        await navigateToEntitiesInvolved(
            submit,
            notice
        );

        await entities.verifyLoaded();

        await entities
            .selectCanIdentify('Yes');


        // ====================================================
        // ENTITY 1
        // ====================================================

        await entities.enterEntityName(
            0,
            'Red Sea Test Supplier'
        );


        // ====================================================
        // ADD ENTITY 2
        // ====================================================

        await entities.addEntity();

        await entities.enterEntityName(
            1,
            'QA Test Contractor'
        );


        expect(
            await entities.getEntityCount()
        ).toBe(2);


        // ====================================================
        // REMOVE ENTITY 2
        // ====================================================

        await entities.removeEntity(1);


        // Only Entity 1 should remain
        expect(
            await entities.getEntityCount()
        ).toBe(1);


        // ====================================================
        // VERIFY ENTITY 1 WAS NOT AFFECTED
        // ====================================================

        await entities.verifyEntityName(
            0,
            'Red Sea Test Supplier'
        );


        // Removed value must not exist
        await expect(
            page.locator(
                'input[value="QA Test Contractor"]'
            )
        ).toHaveCount(0);

        // ====================================================
        // CONTINUE
        // ====================================================

        await entities.next();


        await expect(
            page.getByRole(
                'heading',
                {
                    name: 'Witnesses',
                    level: 2
                }
            )
        ).toBeVisible();
    }
);// ========================================================
// TC-048
// Back Navigation + Data Persistence
// ========================================================

test(
    'TC-048 | Entities Involved data persists after Back navigation @regression @navigation',
    async ({ page }) => {

        const submit =
            new SubmitReportPage(page);

        const notice =
            new ReportingNoticePage(page);

        const entities =
            new EntitiesInvolvedStep(page);


        // ====================================================
        // NAVIGATE TO ENTITIES INVOLVED
        // ====================================================

        await navigateToEntitiesInvolved(
            submit,
            notice
        );

        await entities.verifyLoaded();


        // ====================================================
        // ENTER ENTITY DATA
        // ====================================================

        await entities
            .selectCanIdentify('Yes');

        await entities.enterEntityName(
            0,
            'Red Sea Test Supplier'
        );

        expect(
            await entities.getEntityCount()
        ).toBe(1);


        // ====================================================
        // NEXT -> WITNESSES
        // ====================================================

        await entities.next();

        await submit.witnesses
            .verifyLoaded();


        // ====================================================
        // BACK -> ENTITIES INVOLVED
        // ====================================================

        await submit.witnesses.back();

        await entities.verifyLoaded();


        // ====================================================
        // VERIFY YES PERSISTED
        // ====================================================

        await expect(
            page.getByRole(
                'radio',
                {
                    name: 'Yes',
                    exact: true
                }
            )
        ).toBeChecked();


        // ====================================================
        // VERIFY ROW PERSISTED
        // ====================================================

        expect(
            await entities.getEntityCount()
        ).toBe(1);


        // ====================================================
        // VERIFY ENTITY NAME PERSISTED
        // ====================================================

        await entities.verifyEntityName(
            0,
            'Red Sea Test Supplier'
        );
    }
);