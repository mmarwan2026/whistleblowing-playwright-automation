import { test, expect, Page } from '@playwright/test';



import { InitialReviewFlow } from '../../../../flows/staff/InitialReviewFlow';



const REPORT_ID =

    process.env.TEST_REPORT_ID ??

    'REP-567';



async function discoverNextWorkflowState(

    page: Page,

): Promise<void> {

    console.log('');

    console.log('========================================');

    console.log('NEXT WORKFLOW STATE DISCOVERY');

    console.log('========================================');



    console.log('REPORT ID:', REPORT_ID);

    console.log('CURRENT URL:', page.url());

    console.log('PAGE TITLE:', await page.title());

    const submissionActionText =

        page.getByText(

            'Submission Action',

            {

                exact: false,

            },

        );



    console.log('');

    console.log(

        '========================================',

    );

    console.log(

        'SUBMISSION ACTION DISCOVERY',

    );

    console.log(

        '========================================',

    );



    console.log(

        'Submission Action matches:',

        await submissionActionText.count(),

    );



    const matches =

        await submissionActionText.count();



    for (

        let i = 0;

        i < Math.min(matches, 5);

        i++

    ) {

        const element =

            submissionActionText.nth(i);



        console.log('');

        console.log(

            `MATCH ${i}`,

        );



        console.log(

            'TAG:',

            await element.evaluate(

                el => el.tagName,

            ),

        );



        console.log(

            'TEXT:',

            (

                (await element.textContent()) ??

                ''

            )

                .replace(/\s+/g, ' ')

                .trim(),

        );



        for (

            let level = 1;

            level <= 6;

            level++

        ) {

            const ancestor =

                element.locator(

                    `xpath=ancestor::\*[${level}]`,

                );



            if (

                await ancestor.count() === 0

            ) {

                continue;

            }



            console.log(

                `ANCESTOR ${level}:`,

                {

                    tag:

                        await ancestor.evaluate(

                            el => el.tagName,

                        ),



                    class:

                        await ancestor.getAttribute(

                            'class',

                        ),



                    role:

                        await ancestor.getAttribute(

                            'role',

                        ),



                    text:

                        (

                            (await ancestor.textContent()) ??

                            ''

                        )

                            .replace(/\s+/g, ' ')

                            .trim()

                            .slice(0, 1000),

                },

            );



            console.log(

                `ANCESTOR ${level} BUTTONS:`,

                await ancestor

                    .locator('button')

                    .count(),

            );



            console.log(

                `ANCESTOR ${level} INPUTS:`,

                await ancestor

                    .locator('input')

                    .count(),

            );



            console.log(

                `ANCESTOR ${level} SELECTS:`,

                await ancestor

                    .locator('select')

                    .count(),

            );



            console.log(

                `ANCESTOR ${level} RADIOS:`,

                await ancestor

                    .locator(

                        'input[type="radio"]',

                    )

                    .count(),

            );



            console.log(

                `ANCESTOR ${level} CHECKBOXES:`,

                await ancestor

                    .locator(

                        'input[type="checkbox"]',

                    )

                    .count(),

            );

        }

    }



    console.log(

        '========================================',

    );



    // =============================================

    // STEP 8

    // Verify Initial Review Submission

    // =============================================



    await test.step(

        'Verify Initial Review Submission',

        async () => {

            const nextTask =

                page.locator(

                    '.task-edit-dialog--full-page',

                );



            await expect(

                nextTask,

            ).toBeVisible({

                timeout: 20_000,

            });



            await expect(

                nextTask,

            ).toContainText(

                'Initial Review Submission',

            );



            await expect(

                nextTask,

            ).toContainText(

                REPORT_ID,

            );



            await expect(

                nextTask,

            ).toContainText(

                'Submission Action',

            );



            await expect(

                nextTask,

            ).toContainText(

                'Assign Lead Investigator',

            );



            await expect(

                nextTask,

            ).toContainText(

                'Handled Personally / Submit For Approval',

            );



            console.log('');

            console.log(

                'Initial Review Submission confirmed.',

            );

        },

    );



    // =============================================

    // STEP 9

    // Discover Submission Action DOM

    // =============================================



    await test.step(

        'Discover Submission Action control',

        async () => {

            const nextTask =

                page.locator(

                    '.task-edit-dialog--full-page',

                );



            console.log('');

            console.log(

                '========================================',

            );

            console.log(

                'SUBMISSION ACTION CONTROL DISCOVERY',

            );

            console.log(

                '========================================',

            );



            // -----------------------------------------

            // Submission Action label

            // -----------------------------------------



            const label =

                nextTask.getByText(

                    /Submission Action/,

                );



            console.log(

                'Submission Action text matches:',

                await label.count(),

            );



            // -----------------------------------------

            // Exact option 1

            // -----------------------------------------



            const assignLead =

                nextTask.getByText(

                    'Assign Lead Investigator',

                    {

                        exact: true,

                    },

                );



            console.log('');

            console.log(

                'Assign Lead Investigator matches:',

                await assignLead.count(),

            );



            if (

                await assignLead.count()

            ) {

                const item =

                    assignLead.first();



                console.log(

                    'ASSIGN LEAD:',

                    {

                        tag:

                            await item.evaluate(

                                el => el.tagName,

                            ),



                        class:

                            await item.getAttribute(

                                'class',

                            ),



                        role:

                            await item.getAttribute(

                                'role',

                            ),



                        id:

                            await item.getAttribute(

                                'id',

                            ),



                        for:

                            await item.getAttribute(

                                'for',

                            ),

                    },

                );



                for (

                    let level = 1;

                    level <= 5;

                    level++

                ) {

                    const ancestor =

                        item.locator(

                            `xpath=ancestor::\*[${level}]`,

                        );



                    if (

                        await ancestor.count() ===

                        0

                    ) {

                        continue;

                    }



                    console.log(

                        `ASSIGN LEAD ANCESTOR ${level}:`,

                        {

                            tag:

                                await ancestor.evaluate(

                                    el => el.tagName,

                                ),



                            class:

                                await ancestor.getAttribute(

                                    'class',

                                ),



                            role:

                                await ancestor.getAttribute(

                                    'role',

                                ),



                            text:

                                (

                                    (await ancestor.textContent()) ??

                                    ''

                                )

                                    .replace(/\s+/g, ' ')

                                    .trim()

                                    .slice(0, 800),



                            inputs:

                                await ancestor

                                    .locator('input')

                                    .count(),



                            buttons:

                                await ancestor

                                    .locator('button')

                                    .count(),



                            radios:

                                await ancestor

                                    .locator(

                                        'input[type="radio"]',

                                    )

                                    .count(),

                        },

                    );

                }

            }



            // -----------------------------------------

            // Exact option 2

            // -----------------------------------------



            const handledPersonally =

                nextTask.getByText(

                    'Handled Personally / Submit For Approval',

                    {

                        exact: true,

                    },

                );



            console.log('');

            console.log(

                'Handled Personally matches:',

                await handledPersonally.count(),

            );



            if (

                await handledPersonally.count()

            ) {

                const item =

                    handledPersonally.first();



                console.log(

                    'HANDLED PERSONALLY:',

                    {

                        tag:

                            await item.evaluate(

                                el => el.tagName,

                            ),



                        class:

                            await item.getAttribute(

                                'class',

                            ),



                        role:

                            await item.getAttribute(

                                'role',

                            ),



                        id:

                            await item.getAttribute(

                                'id',

                            ),



                        for:

                            await item.getAttribute(

                                'for',

                            ),

                    },

                );



                for (

                    let level = 1;

                    level <= 5;

                    level++

                ) {

                    const ancestor =

                        item.locator(

                            `xpath=ancestor::\*[${level}]`,

                        );



                    if (

                        await ancestor.count() ===

                        0

                    ) {

                        continue;

                    }



                    console.log(

                        `HANDLED PERSONALLY ANCESTOR ${level}:`,

                        {

                            tag:

                                await ancestor.evaluate(

                                    el => el.tagName,

                                ),



                            class:

                                await ancestor.getAttribute(

                                    'class',

                                ),



                            role:

                                await ancestor.getAttribute(

                                    'role',

                                ),



                            text:

                                (

                                    (await ancestor.textContent()) ??

                                    ''

                                )

                                    .replace(/\s+/g, ' ')

                                    .trim()

                                    .slice(0, 800),



                            inputs:

                                await ancestor

                                    .locator('input')

                                    .count(),



                            buttons:

                                await ancestor

                                    .locator('button')

                                    .count(),



                            radios:

                                await ancestor

                                    .locator(

                                        'input[type="radio"]',

                                    )

                                    .count(),

                        },

                    );

                }

            }



            // -----------------------------------------

            // Submit

            // -----------------------------------------



            const submitButton =

                nextTask.getByRole(

                    'button',

                    {

                        name: 'Submit',

                        exact: true,

                    },

                );



            console.log('');

            console.log(

                'Submit button count:',

                await submitButton.count(),

            );



            if (

                await submitButton.count()

            ) {

                console.log(

                    'Submit enabled:',

                    await submitButton.isEnabled(),

                );

            }



            console.log(

                '========================================',

            );

        },

    );

    // =================================================

    // Visible headings

    // =================================================



    const headings =

        page.locator(

            'h1:visible, h2:visible, h3:visible, h4:visible, h5:visible, h6:visible',

        );



    const headingCount =

        await headings.count();



    console.log('');

    console.log('--- HEADINGS ---');

    console.log(

        'VISIBLE HEADINGS:',

        headingCount,

    );



    for (

        let i = 0;

        i < Math.min(

            headingCount,

            30,

        );

        i++

    ) {

        const heading =

            headings.nth(i);



        console.log(

            `HEADING ${i}:`,

            (

                (await heading.textContent()) ??

                ''

            )

                .replace(/\s+/g, ' ')

                .trim(),

        );

    }



    // =================================================

    // Buttons

    // =================================================



    const buttons =

        page.locator(

            'button:visible',

        );



    const buttonCount =

        await buttons.count();



    console.log('');

    console.log('--- BUTTONS ---');

    console.log(

        'VISIBLE BUTTONS:',

        buttonCount,

    );



    for (

        let i = 0;

        i < Math.min(

            buttonCount,

            60,

        );

        i++

    ) {

        const button =

            buttons.nth(i);



        console.log(

            `BUTTON ${i}:`,

            {

                text:

                    (

                        (await button.textContent()) ??

                        ''

                    )

                        .replace(/\s+/g, ' ')

                        .trim()

                        .slice(0, 300),



                title:

                    await button.getAttribute(

                        'title',

                    ),



                ariaLabel:

                    await button.getAttribute(

                        'aria-label',

                    ),



                disabled:

                    await button.isDisabled(),

            },

        );

    }



    // =================================================

    // Inputs

    // =================================================



    const inputs =

        page.locator(

            'input:visible',

        );



    const inputCount =

        await inputs.count();



    console.log('');

    console.log('--- INPUTS ---');

    console.log(

        'VISIBLE INPUTS:',

        inputCount,

    );



    for (

        let i = 0;

        i < Math.min(

            inputCount,

            30,

        );

        i++

    ) {

        const input =

            inputs.nth(i);



        console.log(

            `INPUT ${i}:`,

            {

                type:

                    await input.getAttribute(

                        'type',

                    ),



                name:

                    await input.getAttribute(

                        'name',

                    ),



                id:

                    await input.getAttribute(

                        'id',

                    ),



                placeholder:

                    await input.getAttribute(

                        'placeholder',

                    ),



                ariaLabel:

                    await input.getAttribute(

                        'aria-label',

                    ),

            },

        );

    }



    // =================================================

    // Textareas

    // =================================================



    const textareas =

        page.locator(

            'textarea:visible',

        );



    console.log('');

    console.log('--- TEXTAREAS ---');

    console.log(

        'VISIBLE TEXTAREAS:',

        await textareas.count(),

    );



    // =================================================

    // Comboboxes

    // =================================================



    const comboboxes =

        page.locator(

            '[role="combobox"]:visible',

        );



    const comboCount =

        await comboboxes.count();



    console.log('');

    console.log('--- COMBOBOXES ---');

    console.log(

        'VISIBLE COMBOBOXES:',

        comboCount,

    );



    for (

        let i = 0;

        i < Math.min(

            comboCount,

            30,

        );

        i++

    ) {

        const combo =

            comboboxes.nth(i);



        console.log(

            `COMBOBOX ${i}:`,

            {

                text:

                    (

                        (await combo.textContent()) ??

                        ''

                    )

                        .replace(/\s+/g, ' ')

                        .trim(),



                ariaLabel:

                    await combo.getAttribute(

                        'aria-label',

                    ),



                placeholder:

                    await combo.getAttribute(

                        'placeholder',

                    ),

            },

        );

    }



    // =================================================

    // Radio buttons

    // =================================================



    const radios =

        page.locator(

            'input[type="radio"]:visible',

        );



    console.log('');

    console.log('--- RADIOS ---');

    console.log(

        'VISIBLE RADIOS:',

        await radios.count(),

    );



    // =================================================

    // Checkboxes

    // =================================================



    const checkboxes =

        page.locator(

            'input[type="checkbox"]:visible',

        );



    console.log('');

    console.log('--- CHECKBOXES ---');

    console.log(

        'VISIBLE CHECKBOXES:',

        await checkboxes.count(),

    );



    // =================================================

    // Workflow terminology

    // =================================================



    console.log('');

    console.log(

        '--- WORKFLOW TEXT DISCOVERY ---',

    );



    const terms = [

        'AAPA',

        'Assessment',

        'Initial Review',

        'Priority',

        'Decision',

        'Investigate',

        'Investigation',

        'Dismiss',

        'Modify',

        'Approve',

        'Reject',

        'Return',

        'Complete Task',

        'Save as Draft',

    ];



    for (const term of terms) {

        const locator =

            page.getByText(

                new RegExp(

                    term,

                    'i',

                ),

            );



        console.log(

            `${term}:`,

            await locator.count(),

        );

    }



    // =================================================

    // Full-page task containers

    // =================================================



    console.log('');

    console.log(

        '--- TASK CONTAINERS ---',

    );



    const taskContainers =

        page.locator(

            '.task-edit-dialog--full-page',

        );



    const taskCount =

        await taskContainers.count();



    console.log(

        'FULL PAGE TASK COUNT:',

        taskCount,

    );



    for (

        let i = 0;

        i < taskCount;

        i++

    ) {

        const container =

            taskContainers.nth(i);



        console.log(

            `TASK CONTAINER ${i}:`,

            (

                (await container.textContent()) ??

                ''

            )

                .replace(/\s+/g, ' ')

                .trim()

                .slice(0, 5000),

        );

    }



    // =================================================

    // Report ID after transition

    // =================================================



    console.log('');

    console.log(

        '--- REPORT ID AFTER COMPLETE TASK ---',

    );



    const reportMatches =

        page.getByText(

            REPORT_ID,

            {

                exact: true,

            },

        );



    console.log(

        `${REPORT_ID} MATCH COUNT:`,

        await reportMatches.count(),

    );



    // =================================================

    // Screenshot

    // =================================================



    await page.screenshot({

        path:

            'test-results/complete-initial-review-next-state.png',



        fullPage: true,

    });



    console.log('');

    console.log('========================================');

    console.log(

        'NEXT WORKFLOW STATE DISCOVERY COMPLETE',

    );

    console.log('========================================');

    console.log('');

}



test.describe(

    'Staff - Complete Initial Review @e2e @staff @aapa',

    () => {

        test(

            'STAFF-AAPA-E2E-001 | HOD completes Initial Review and workflow moves to next state',

            async ({ page }) => {

                test.setTimeout(

                    120_000,

                );



                const username =

                    process.env.STAFF_USERNAME;



                const password =

                    process.env.STAFF_PASSWORD;



                if (

                    !username ||

                    !password

                ) {

                    throw new Error(

                        [

                            'Staff credentials are not configured.',

                            '',

                            'Required environment variables:',

                            'STAFF_USERNAME',

                            'STAFF_PASSWORD',

                        ].join('\n'),

                    );

                }



                const flow =

                    new InitialReviewFlow(

                        page,

                    );



                // =============================================

                // STEP 1

                // Login

                // =============================================



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

                            username,

                        );



                        await passwordInput.fill(

                            password,

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



                // =============================================

                // STEP 2

                // Dashboard

                // =============================================



                await test.step(

                    'Verify Operational Dashboard',

                    async () => {

                        await flow.dashboard

                            .verifyLoaded();

                    },

                );



                // =============================================

                // STEP 3

                // Open Initial Review

                // =============================================



                await test.step(

                    `Open Initial Review for ${REPORT_ID}`,

                    async () => {

                        await flow

                            .openUnderAssessmentReport(

                                REPORT_ID,

                            );

                    },

                );



                // =============================================

                // STEP 4

                // Verify correct report

                // =============================================



                await test.step(

                    `Verify ${REPORT_ID} before Complete Task`,

                    async () => {

                        await flow.initialReview

                            .verifyLoaded(

                                REPORT_ID,

                            );



                        await expect(

                            flow.initialReview

                                .taskContainer,

                        ).toContainText(

                            REPORT_ID,

                        );



                        await expect(

                            flow.initialReview

                                .taskContainer,

                        ).toContainText(

                            'Update Initial Review',

                        );



                        await expect(

                            flow.initialReview

                                .completeTaskButton,

                        ).toBeVisible();



                        await expect(

                            flow.initialReview

                                .completeTaskButton,

                        ).toBeEnabled();

                    },

                );



                // =============================================

                // STEP 5

                // COMPLETE TASK

                // Workflow-changing action

                // =============================================



                await test.step(

                    'Complete Initial Review',

                    async () => {

                        console.log('');

                        console.log(

                            '========================================',

                        );



                        console.log(

                            'COMPLETE INITIAL REVIEW',

                        );



                        console.log(

                            '========================================',

                        );



                        console.log(

                            'REPORT:',

                            REPORT_ID,

                        );



                        console.log(

                            'URL BEFORE:',

                            page.url(),

                        );



                        await flow

                            .completeInitialReview();



                        console.log(

                            'Complete Task clicked.',

                        );

                    },

                );



                // =============================================

                // STEP 6

                // Wait for actual UI transition

                // =============================================



                await test.step(

                    'Wait for workflow transition',

                    async () => {

                        /**

                          * Do not use waitForTimeout().

                          *

                          * Wait until the old Initial Review task

                          * disappears OR changes its content.

                         */



                        await expect

                            .poll(

                                async () => {

                                    const oldTask =

                                        flow.initialReview

                                            .taskContainer;



                                    if (

                                        await oldTask.count() ===

                                        0

                                    ) {

                                        return true;

                                    }



                                    if (

                                        !(await oldTask.isVisible())

                                    ) {

                                        return true;

                                    }



                                    const text =

                                        (

                                            (await oldTask.textContent()) ??

                                            ''

                                        )

                                            .replace(

                                                /\s+/g,

                                                ' ',

                                            )

                                            .trim();



                                    return !text.includes(

                                        'Update Initial Review',

                                    );

                                },

                                {

                                    timeout:

                                        30_000,



                                    message:

                                        'Expected Initial Review task to transition after Complete Task',

                                },

                            )

                            .toBe(true);



                        console.log(

                            'Workflow transition detected.',

                        );



                        console.log(

                            'URL AFTER:',

                            page.url(),

                        );

                    },

                );



                // =============================================

                // STEP 7

                // Discover actual next workflow state

                // =============================================



                await test.step(

                    'Discover next workflow state',

                    async () => {

                        await discoverNextWorkflowState(

                            page,

                        );

                    },

                );

                await test.step(
                    'Submit Lead Investigator Assignment',
                    async () => {
                        const submission =
                            flow.initialReviewSubmission;

                        await submission.verifySubmitEnabled();

                        await submission.submit();

                        console.log('');
                        console.log(
                            '========================================',
                        );
                        console.log(
                            'LEAD INVESTIGATOR ASSIGNMENT SUBMITTED',
                        );
                        console.log(
                            '========================================',
                        );
                        console.log(
                            `Report: ${REPORT_ID}`,
                        );
                        console.log(
                            'Lead Investigator: Lead Investigator User',
                        );
                        console.log(
                            'Submit Clicked: YES',
                        );
                        console.log(
                            '========================================',
                        );
                    },
                );
                console.log(

                    'STAFF-AAPA-E2E-001 RESULT',

                );



                console.log(

                    '========================================',

                );



                console.log(

                    `Report: ${REPORT_ID}`,

                );



                console.log(

                    'Initial Review: OPENED',

                );



                console.log(

                    'Complete Task: CLICKED',

                );



                console.log(

                    'Workflow Transition: DETECTED',

                );



                console.log(

                    'Next State: DISCOVERED',

                );



                console.log(

                    '========================================',

                );



                console.log('');

            },



        );



    },



);
