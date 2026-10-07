import { test, expect, Page, Locator } from '@playwright/test';

import { StaffDashboardPage } from '../../../../pages/staff/dashboard/StaffDashboardPage';

const REPORT_ID =
    process.env.TEST_REPORT_ID ??
    'REP-567';

async function discoverSubmissionAction(
    page: Page,
    taskContainer: Locator,
): Promise<void> {
    console.log('');
    console.log('========================================');
    console.log('SUBMISSION ACTION DISCOVERY');
    console.log('========================================');

    // -------------------------------------------------
    // Find Submission Action text
    // -------------------------------------------------

    const submissionActionMatches =
        taskContainer.getByText(
            /Submission Action/i,
        );

    const matchCount =
        await submissionActionMatches.count();

    console.log(
        'Submission Action matches:',
        matchCount,
    );

    // -------------------------------------------------
    // Inspect each match
    // -------------------------------------------------

    for (
        let i = 0;
        i < Math.min(matchCount, 5);
        i++
    ) {
        const element =
            submissionActionMatches.nth(i);

        console.log('');
        console.log(`MATCH ${i}`);

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

        console.log(
            'CLASS:',
            await element.getAttribute(
                'class',
            ),
        );

        console.log(
            'ROLE:',
            await element.getAttribute(
                'role',
            ),
        );

        // -----------------------------------------------
        // Ancestors
        // -----------------------------------------------

        for (
            let level = 1;
            level <= 8;
            level++
        ) {
            const ancestor =
                element.locator(
                    `xpath=ancestor::*[${level}]`,
                );

            if (
                await ancestor.count() === 0
            ) {
                continue;
            }

            console.log('');
            console.log(
                `ANCESTOR ${level}`,
            );

            console.log({
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
                        .slice(0, 1500),
            });

            console.log(
                'BUTTONS:',
                await ancestor
                    .locator('button')
                    .count(),
            );

            console.log(
                'INPUTS:',
                await ancestor
                    .locator('input')
                    .count(),
            );

            console.log(
                'SELECTS:',
                await ancestor
                    .locator('select')
                    .count(),
            );

            console.log(
                'COMBOBOXES:',
                await ancestor
                    .locator(
                        '[role="combobox"]',
                    )
                    .count(),
            );

            console.log(
                'RADIOS:',
                await ancestor
                    .locator(
                        'input[type="radio"]',
                    )
                    .count(),
            );

            console.log(
                'CHECKBOXES:',
                await ancestor
                    .locator(
                        'input[type="checkbox"]',
                    )
                    .count(),
            );
        }
    }

    // -------------------------------------------------
    // Exact option text discovery
    // -------------------------------------------------

    const options = [
        'Assign Lead Investigator',
        'Handled Personally / Submit For Approval',
    ];

    console.log('');
    console.log('--- OPTION DISCOVERY ---');

    for (const option of options) {
        const matches =
            taskContainer.getByText(
                option,
                {
                    exact: true,
                },
            );

        console.log('');
        console.log(
            `${option} MATCHES:`,
            await matches.count(),
        );

        const count =
            await matches.count();

        for (
            let i = 0;
            i < Math.min(count, 5);
            i++
        ) {
            const item =
                matches.nth(i);

            console.log(
                `${option} [${i}]:`,
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

                    for:
                        await item.getAttribute(
                            'for',
                        ),
                },
            );

            const parent =
                item.locator('..');

            console.log(
                `${option} PARENT:`,
                {
                    tag:
                        await parent.evaluate(
                            el => el.tagName,
                        ),

                    class:
                        await parent.getAttribute(
                            'class',
                        ),

                    role:
                        await parent.getAttribute(
                            'role',
                        ),

                    text:
                        (
                            (await parent.textContent()) ??
                            ''
                        )
                            .replace(/\s+/g, ' ')
                            .trim(),
                },
            );

            console.log(
                `${option} PARENT INPUTS:`,
                await parent
                    .locator('input')
                    .count(),
            );

            console.log(
                `${option} PARENT BUTTONS:`,
                await parent
                    .locator('button')
                    .count(),
            );
        }
    }

    // -------------------------------------------------
    // Submit / Cancel
    // -------------------------------------------------

    console.log('');
    console.log('--- FORM ACTIONS ---');

    const submitButton =
        taskContainer.getByRole(
            'button',
            {
                name: 'Submit',
                exact: true,
            },
        );

    const cancelButton =
        taskContainer.getByRole(
            'button',
            {
                name: 'Cancel',
                exact: true,
            },
        );

    console.log(
        'SUBMIT COUNT:',
        await submitButton.count(),
    );

    console.log(
        'CANCEL COUNT:',
        await cancelButton.count(),
    );

    if (
        await submitButton.count()
    ) {
        console.log(
            'SUBMIT ENABLED:',
            await submitButton.isEnabled(),
        );
    }

    if (
        await cancelButton.count()
    ) {
        console.log(
            'CANCEL ENABLED:',
            await cancelButton.isEnabled(),
        );
    }

    console.log('');
    console.log('========================================');
    console.log('DISCOVERY COMPLETE');
    console.log('========================================');
}

test.describe(
    'Staff - Initial Review Submission @e2e @staff @aapa',
    () => {
        test(
            'STAFF-AAPA-E2E-002 | Discover Initial Review Submission actions',
            async ({ page }) => {
                test.setTimeout(90_000);

                const username =
                    process.env.STAFF_USERNAME;

                const password =
                    process.env.STAFF_PASSWORD;

                if (!username || !password) {
                    throw new Error(
                        [
                            'Staff credentials are not configured.',
                            '',
                            'Required:',
                            'STAFF_USERNAME',
                            'STAFF_PASSWORD',
                        ].join('\n'),
                    );
                }

                const dashboard =
                    new StaffDashboardPage(page);

                // =============================================
                // STEP 1
                // Login
                // =============================================

                await test.step(
                    'Login as HOD',
                    async () => {
                        await page.goto('/login');

                        const usernameInput =
                            page.locator('#user');

                        const passwordInput =
                            page.locator('#pass');

                        await expect(
                            usernameInput,
                        ).toBeVisible({
                            timeout: 15_000,
                        });

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
                        await dashboard.verifyLoaded();
                    },
                );

                // =============================================
                // STEP 3
                // Under Assessment
                // =============================================

                await test.step(
                    'Open Under Assessment',
                    async () => {
                        await dashboard
                            .openUnderAssessment();

                        await dashboard
                            .verifyReportVisible(
                                REPORT_ID,
                            );

                        await dashboard
                            .verifyReportStatus(
                                REPORT_ID,
                                'Under Assessment',
                            );
                    },
                );

                // =============================================
                // STEP 4
                // Open current task
                // =============================================

                await test.step(
                    `Open current task for ${REPORT_ID}`,
                    async () => {
                        await dashboard
                            .openReportTask(
                                REPORT_ID,
                            );
                    },
                );

                // =============================================
                // STEP 5
                // Initial Review Submission
                // =============================================

                const taskContainer =
                    page.locator(
                        '.task-edit-dialog--full-page',
                    );

                await test.step(
                    'Verify Initial Review Submission',
                    async () => {
                        await expect(
                            taskContainer,
                        ).toBeVisible({
                            timeout: 20_000,
                        });

                        await expect(
                            taskContainer,
                        ).toContainText(
                            'Initial Review Submission',
                        );

                        await expect(
                            taskContainer,
                        ).toContainText(
                            REPORT_ID,
                        );

                        await expect(
                            taskContainer,
                        ).toContainText(
                            'Submission Action',
                        );

                        await expect(
                            taskContainer,
                        ).toContainText(
                            'Assign Lead Investigator',
                        );

                        await expect(
                            taskContainer,
                        ).toContainText(
                            'Handled Personally / Submit For Approval',
                        );
                    },
                );

                // =============================================
                // STEP 6
                // Discover Submission Action
                // =============================================

                await test.step(
                    'Discover Submission Action DOM',
                    async () => {
                        await discoverSubmissionAction(
                            page,
                            taskContainer,
                        );
                    },
                );

                // =============================================
                // IMPORTANT
                // =============================================

                /**
                 * DO NOT click:
                 *
                 * Assign Lead Investigator
                 * Handled Personally / Submit For Approval
                 * Submit
                 *
                 * This test is discovery/read-only.
                 */

                console.log('');
                console.log('========================================');
                console.log('STAFF-AAPA-E2E-002 RESULT');
                console.log('========================================');
                console.log(`Report: ${REPORT_ID}`);
                console.log(
                    'Initial Review Submission: FOUND',
                );
                console.log(
                    'Submission Action: FOUND',
                );
                console.log(
                    'Workflow State Changed: NO',
                );
                console.log('========================================');
                console.log('');
            },
        );
    },
);