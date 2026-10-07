import { test, expect } from '@playwright/test';
import { InitialReviewFlow } from '../../../../flows/staff/InitialReviewFlow';

const REPORT_ID =
    process.env.TEST_REPORT_ID ??
    'REP-567';
const USERNAME =
    process.env.STAFF_USERNAME;

const PASSWORD =
    process.env.STAFF_PASSWORD;

if (!USERNAME || !PASSWORD) {
    throw new Error(
        'STAFF_USERNAME and STAFF_PASSWORD must be configured in .env',
    );
}
test.describe(
    'Staff - Verify Lead Investigator Assignment @e2e @staff @aapa',
    () => {
        test(
            'STAFF-AAPA-E2E-002 | Verify persisted state after assigning Lead Investigator',
            async ({ page }) => {
                const flow =
                    new InitialReviewFlow(page);

                await test.step(

                    'Login as HOD',

                    async () => {

                        await page.goto(

                            '/login',

                        );



                        const usernameInput =

                            page.locator(

                                '#user',

                            );



                        const passwordInput =

                            page.locator(

                                '#pass',

                            );



                        await expect(

                            usernameInput,

                        ).toBeVisible({

                            timeout: 15_000,

                        });



                        await expect(

                            passwordInput,

                        ).toBeVisible();



                        await usernameInput.fill(

                            USERNAME,

                        );



                        await passwordInput.fill(

                            PASSWORD,

                        );



                        const loginButton =

                            page.getByRole(

                                'button',

                                {

                                    name:

                                        /login|sign in/i,

                                },

                            );



                        await expect(

                            loginButton,

                        ).toBeEnabled();



                        await loginButton.click();



                        await expect(

                            usernameInput,

                        ).toHaveCount(

                            0,

                            {

                                timeout: 20_000,

                            },

                        );

                    },

                );


                await test.step(
                    'Open report from Under Assessment',
                    async () => {
                        await flow.dashboard.verifyLoaded();

                        await flow.dashboard.openUnderAssessment();

                        await flow.dashboard.verifyReportVisible(
                            REPORT_ID,
                        );

                        await flow.dashboard.verifyReportStatus(
                            REPORT_ID,
                            'Under Assessment',
                        );

                        await flow.dashboard.openReportTask(
                            REPORT_ID,
                        );
                    },
                );

                await test.step(
                    'Discover persisted workflow state',
                    async () => {
                        const taskContainer =
                            page.locator(
                                '.task-edit-dialog--full-page',
                            );

                        await expect(
                            taskContainer,
                        ).toBeVisible({
                            timeout: 20_000,
                        });

                        const taskText =
                            await taskContainer.innerText();

                        console.log('');
                        console.log(
                            '========================================',
                        );
                        console.log(
                            'PERSISTED WORKFLOW STATE',
                        );
                        console.log(
                            '========================================',
                        );
                        console.log(
                            `Report: ${REPORT_ID}`,
                        );
                        console.log(
                            `URL: ${page.url()}`,
                        );
                        await test.step(
                            'Verify persisted Initial Review state',
                            async () => {
                                const taskContainer =
                                    page.locator(
                                        '.task-edit-dialog--full-page',
                                    );

                                await expect(
                                    taskContainer,
                                ).toBeVisible({
                                    timeout: 20_000,
                                });

                                await expect(
                                    taskContainer,
                                ).toContainText(
                                    'Initial Review',
                                );

                                await expect(
                                    taskContainer,
                                ).toContainText(
                                    'Report Details',
                                );

                                await expect(
                                    taskContainer,
                                ).toContainText(
                                    'Assessment',
                                );

                                await expect(
                                    taskContainer,
                                ).toContainText(
                                    'Case Similarity',
                                );
                                const closeButton =
                                    taskContainer.getByText(
                                        'Close',
                                        {
                                            exact: true,
                                        },
                                    );

                                await expect(
                                    closeButton,
                                ).toHaveCount(1);

                                await expect(
                                    closeButton,
                                ).toBeVisible();

                                await expect(
                                    taskContainer.getByRole(
                                        'button',
                                        {
                                            name: 'Complete Task',
                                            exact: true,
                                        },
                                    ),
                                ).toHaveCount(0);

                                await expect(
                                    taskContainer.getByRole(
                                        'button',
                                        {
                                            name: 'Save as Draft',
                                            exact: true,
                                        },
                                    ),
                                ).toHaveCount(0);

                                console.log('');
                                console.log(
                                    '========================================',
                                );
                                console.log(
                                    'PERSISTED INITIAL REVIEW VERIFIED',
                                );
                                console.log(
                                    '========================================',
                                );
                                console.log(`Report: ${REPORT_ID}`);
                                console.log(
                                    'Persisted Task: Initial Review',
                                );
                                console.log(
                                    'Complete Task: NOT AVAILABLE',
                                );
                                console.log(
                                    'Save as Draft: NOT AVAILABLE',
                                );
                                console.log(
                                    'Close: AVAILABLE',
                                );
                                console.log(
                                    '========================================',
                                );
                            },
                        );
                        console.log(taskText);
                        console.log(
                            '========================================',
                        );
                    },
                );
            },
        );
    },
);