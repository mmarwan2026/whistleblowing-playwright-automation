import { expect, test } from '@playwright/test';

const REPORT_ID =
    process.env.TEST_REPORT_ID ??
    'REP-567';

const USERNAME =
    process.env.LEAD_INVESTIGATOR_USERNAME;

const PASSWORD =
    process.env.LEAD_INVESTIGATOR_PASSWORD;

if (!USERNAME || !PASSWORD) {
    throw new Error(
        'LEAD_INVESTIGATOR_USERNAME and LEAD_INVESTIGATOR_PASSWORD must be configured in .env',
    );
}

test.describe(
    'Lead Investigator - Assigned Case Discovery @e2e @staff @investigation',
    () => {
        test(
            'STAFF-INV-E2E-001 | Discover assigned case after Lead Investigator assignment',
            async ({ page }) => {

                /*
                 * ============================================================
                 * STEP 1
                 * Login as Lead Investigator
                 * ============================================================
                 */

                await test.step(
                    'Login as Lead Investigator',
                    async () => {

                        await page.goto('/login');

                        const usernameInput =
                            page.locator('#user');

                        const passwordInput =
                            page.locator('#pass');

                        await expect(
                            usernameInput,
                        ).toBeVisible();

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
                                    name: /login|sign in/i,
                                },
                            );

                        await expect(
                            loginButton,
                        ).toBeVisible();

                        await expect(
                            loginButton,
                        ).toBeEnabled();

                        await loginButton.click();

                        await expect(
                            page,
                        ).not.toHaveURL(
                            /\/login/i,
                            {
                                timeout: 20_000,
                            },
                        );
                    },
                );

                /*
                 * ============================================================
                 * STEP 2
                 * Verify Lead Investigator dashboard
                 * ============================================================
                 */

                await test.step(
                    'Verify Lead Investigator dashboard',
                    async () => {

                        await page.waitForLoadState(
                            'domcontentloaded',
                        );

                        console.log('');
                        console.log(
                            '========================================',
                        );
                        console.log(
                            'LEAD INVESTIGATOR DASHBOARD',
                        );
                        console.log(
                            '========================================',
                        );
                        console.log(
                            `Report Target: ${REPORT_ID}`,
                        );
                        console.log(
                            `URL: ${page.url()}`,
                        );
                        console.log(
                            `Title: ${await page.title()}`,
                        );
                        console.log(
                            '========================================',
                        );
                    },
                );

                /*
                 * ============================================================
                 * STEP 3
                 * Open My Tasks and verify REP-567 assignment
                 * ============================================================
                 */

                await test.step(
                    'Open Lead Investigator Tasks',
                    async () => {

                        const tasksLink =
                            page.getByText(
                                'Tasks',
                                {
                                    exact: true,
                                },
                            );

                        await expect(
                            tasksLink,
                        ).toBeVisible();

                        await tasksLink.click();

                        /*
                         * Do not assert "My Tasks" text count.
                         *
                         * Aura currently renders more than one visible
                         * "My Tasks" element.
                         *
                         * URL is a stable assertion for this navigation.
                         */

                        await expect(
                            page,
                        ).toHaveURL(
                            /\/pages\/todolist\/myTasks/,
                            {
                                timeout: 20_000,
                            },
                        );

                        /*
                         * Verify the exact assignment message.
                         */

                        const assignedCaseText =
                            `A new task has been assigned for Case ID: ${REPORT_ID} and is awaiting your action.`;

                        const assignedCaseMessage =
                            page.getByText(
                                assignedCaseText,
                                {
                                    exact: true,
                                },
                            );

                        await expect(
                            assignedCaseMessage,
                            `${REPORT_ID} should appear in Lead Investigator My Tasks`,
                        ).toBeVisible({
                            timeout: 20_000,
                        });

                        await expect(
                            assignedCaseMessage,
                        ).toHaveCount(1);

                        console.log('');
                        console.log(
                            '========================================',
                        );
                        console.log(
                            'LEAD INVESTIGATOR ASSIGNMENT VERIFIED',
                        );
                        console.log(
                            '========================================',
                        );
                        console.log(
                            `Report: ${REPORT_ID}`,
                        );
                        console.log(
                            'Task: AAPA Preparation',
                        );
                        console.log(
                            'Location: My Tasks / My Pool',
                        );
                        console.log(
                            'Assignment: PASSED',
                        );
                        console.log(
                            '========================================',
                        );

                        /*
                         * ====================================================
                         * STEP 4
                         * Locate the exact REP-567 task card
                         * ====================================================
                         */

                        await test.step(
                            `Discover ${REPORT_ID} Actions popup`,
                            async () => {

                                /*
                                 * The assignment message belongs to the
                                 * REP-567 task card.
                                 *
                                 * Use the nearest role=button ancestor.
                                 */

                                const assignedTask =
                                    assignedCaseMessage.locator(
                                        'xpath=ancestor::*[@role="button"][1]',
                                    );

                                await expect(
                                    assignedTask,
                                    `${REPORT_ID} task card should exist`,
                                ).toHaveCount(1);

                                await expect(
                                    assignedTask,
                                ).toBeVisible();

                                await expect(
                                    assignedTask,
                                ).toContainText(
                                    'AAPA Preparation',
                                );

                                await expect(
                                    assignedTask,
                                ).toContainText(
                                    REPORT_ID,
                                );

                                /*
                                 * =================================================
                                 * STEP 5
                                 * Locate the Actions button inside REP-567 only
                                 * =================================================
                                 *
                                 * Previous discovery confirmed:
                                 *
                                 * tag   = BUTTON
                                 * type  = button
                                 * title = Actions
                                 */

                                const actionsButton =
                                    assignedTask.getByRole(
                                        'button',
                                        {
                                            name: 'Actions',
                                        },
                                    );

                                await expect(
                                    actionsButton,
                                    `${REPORT_ID} Actions button should exist`,
                                ).toHaveCount(1);

                                await expect(
                                    actionsButton,
                                ).toBeVisible();

                                await expect(
                                    actionsButton,
                                ).toBeEnabled();

                                /*
                                 * =================================================
                                 * STEP 6
                                 * Open Actions UI
                                 * =================================================
                                 *
                                 * This is discovery only.
                                 *
                                 * We are NOT selecting any workflow action.
                                 */

                                await actionsButton.click();

                                /*
                                 * =================================================
                                 * STEP 7
                                 * Inspect the Actions button state
                                 * =================================================
                                 *
                                 * Do not scan every interactive element on
                                 * the page.
                                 *
                                 * Previous page-wide discovery caused a race
                                 * because the DOM changed while iterating.
                                 */

                                console.log('');
                                console.log(
                                    '========================================',
                                );
                                console.log(
                                    'REP-567 ACTIONS POPUP DISCOVERY',
                                );
                                console.log(
                                    '========================================',
                                );

                                const actionsState =
                                    await actionsButton.evaluate(
                                        (el) => ({
                                            tag:
                                                el.tagName,

                                            type:
                                                el.getAttribute(
                                                    'type',
                                                ),

                                            title:
                                                el.getAttribute(
                                                    'title',
                                                ),

                                            ariaLabel:
                                                el.getAttribute(
                                                    'aria-label',
                                                ),

                                            ariaExpanded:
                                                el.getAttribute(
                                                    'aria-expanded',
                                                ),

                                            ariaControls:
                                                el.getAttribute(
                                                    'aria-controls',
                                                ),

                                            ariaHasPopup:
                                                el.getAttribute(
                                                    'aria-haspopup',
                                                ),

                                            class:
                                                el.getAttribute(
                                                    'class',
                                                ),
                                        }),
                                    );

                                console.log(
                                    'Actions Button State:',
                                    actionsState,
                                );

                                /*
                                 * =================================================
                                 * STEP 8
                                 * Inspect the immediate parent
                                 * =================================================
                                 *
                                 * If Aura renders the dropdown beside the
                                 * Actions button, it may exist inside this
                                 * parent.
                                 */

                                const actionsParent =
                                    actionsButton.locator(
                                        '..',
                                    );

                                await expect(
                                    actionsParent,
                                ).toBeVisible();

                                const parentText =
                                    (
                                        await actionsParent.innerText()
                                    ).trim();

                                console.log('');
                                console.log(
                                    'ACTIONS PARENT TEXT:',
                                );

                                console.log(
                                    parentText ||
                                    '[EMPTY]',
                                );

                                console.log('');
                                console.log(
                                    'ACTIONS PARENT HTML:',
                                );

                                const parentHtml =
                                    await actionsParent.evaluate(
                                        (el) =>
                                            el.outerHTML,
                                    );

                                console.log(
                                    parentHtml,
                                );

                                /*
                                 * =================================================
                                 * STEP 9
                                 * Inspect immediate siblings only
                                 * =================================================
                                 *
                                 * Some dropdown libraries render the popup as
                                 * a sibling instead of inside the button parent.
                                 *
                                 * We inspect the DOM only.
                                 * Nothing is clicked.
                                 */

                                const parentSiblingInfo =
                                    await actionsParent.evaluate(
                                        (el) => {

                                            const previous =
                                                el.previousElementSibling;

                                            const next =
                                                el.nextElementSibling;

                                            return {
                                                previousSibling:
                                                    previous
                                                        ? {
                                                            tag:
                                                                previous.tagName,

                                                            text:
                                                                (
                                                                    previous.textContent ??
                                                                    ''
                                                                ).trim(),

                                                            class:
                                                                previous.getAttribute(
                                                                    'class',
                                                                ),

                                                            role:
                                                                previous.getAttribute(
                                                                    'role',
                                                                ),

                                                            html:
                                                                previous.outerHTML,
                                                        }
                                                        : null,

                                                nextSibling:
                                                    next
                                                        ? {
                                                            tag:
                                                                next.tagName,

                                                            text:
                                                                (
                                                                    next.textContent ??
                                                                    ''
                                                                ).trim(),

                                                            class:
                                                                next.getAttribute(
                                                                    'class',
                                                                ),

                                                            role:
                                                                next.getAttribute(
                                                                    'role',
                                                                ),

                                                            html:
                                                                next.outerHTML,
                                                        }
                                                        : null,
                                            };
                                        },
                                    );

                                console.log('');
                                console.log(
                                    'ACTIONS PARENT SIBLINGS:',
                                );

                                console.log(
                                    parentSiblingInfo,
                                );

                                /*
                                 * =================================================
                                 * STEP 10
                                 * Inspect parent container
                                 * =================================================
                                 *
                                 * One level higher may contain both:
                                 *
                                 * - Actions button
                                 * - popup/dropdown
                                 *
                                 * This remains tightly scoped to REP-567.
                                 */

                                const actionsContainer =
                                    actionsParent.locator(
                                        '..',
                                    );

                                await expect(
                                    actionsContainer,
                                ).toBeVisible();

                                const containerInfo =
                                    await actionsContainer.evaluate(
                                        (el) => ({
                                            tag:
                                                el.tagName,

                                            text:
                                                (
                                                    el.textContent ??
                                                    ''
                                                ).trim(),

                                            role:
                                                el.getAttribute(
                                                    'role',
                                                ),

                                            class:
                                                el.getAttribute(
                                                    'class',
                                                ),

                                            html:
                                                el.outerHTML,
                                        }),
                                    );

                                console.log('');
                                console.log(
                                    'ACTIONS CONTAINER:',
                                );

                                console.log(
                                    containerInfo,
                                );

                                console.log('');
                                console.log(
                                    '========================================',
                                );
                                console.log(
                                    'DISCOVERY COMPLETE',
                                );
                                console.log(
                                    'No workflow action was clicked.',
                                );
                                console.log(
                                    '========================================',
                                );

                                /*
                                 * STOP HERE.
                                 *
                                 * Do not click:
                                 *
                                 * - Open
                                 * - View
                                 * - Start
                                 * - AAPA Preparation
                                 * - or any other action
                                 *
                                 * until its actual DOM is discovered.
                                 */
                            },
                        );
                    },
                );
            },
        );
    },
);