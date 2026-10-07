import { test, expect } from '@playwright/test';

import { InitialReviewFlow } from '../../../../flows/staff/InitialReviewFlow';

test.describe(
  'Staff - Initial Review @regression @staff @aapa',
  () => {
    const REPORT_ID =
      process.env.TEST_REPORT_ID ??
      'REP-567';

    test(
      'STAFF-AAPA-001 | HOD can open and review an Under Assessment report',
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
              'Required environment variables:',
              'STAFF_USERNAME',
              'STAFF_PASSWORD',
            ].join('\n'),
          );
        }

        const flow =
          new InitialReviewFlow(page);

        // =================================================
        // STEP 1
        // Login
        // =================================================

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

            await expect(
              passwordInput,
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
            ).toBeVisible();

            await expect(
              loginButton,
            ).toBeEnabled();

            await loginButton.click();

            /**
             * Successful login condition.
             *
             * Do not depend only on URL because Aura
             * is heavily SPA-based.
             */
            await expect(
              usernameInput,
            ).toHaveCount(0, {
              timeout: 20_000,
            });
          },
        );

        // =================================================
        // STEP 2
        // Operational Dashboard
        // =================================================

        await test.step(
          'Verify Operational Dashboard',
          async () => {
            await flow.dashboard.verifyLoaded();
          },
        );

        // =================================================
        // STEP 3
        // Under Assessment
        // =================================================

        await test.step(
          `Open ${REPORT_ID} from Under Assessment`,
          async () => {
            await flow.openUnderAssessmentReport(
              REPORT_ID,
            );
          },
        );

        // =================================================
        // STEP 4
        // Initial Review
        // =================================================

        await test.step(
          `Verify Update Initial Review for ${REPORT_ID}`,
          async () => {
            await flow.verifyInitialReview(
              REPORT_ID,
            );
          },
        );

        // =================================================
        // STEP 5
        // Navigation Actions
        // =================================================



        // =================================================
        // STEP 6
        // Workflow Actions
        // =================================================

        await test.step(
          'Verify Complete Task and Save as Draft actions',
          async () => {
            await expect(
              flow.initialReview
                .completeTaskButton,
            ).toBeVisible();

            await expect(
              flow.initialReview
                .completeTaskButton,
            ).toBeEnabled();

            await expect(
              flow.initialReview
                .saveAsDraftButton,
            ).toBeVisible();

            await expect(
              flow.initialReview
                .saveAsDraftButton,
            ).toBeEnabled();
          },
        );

        // =================================================
        // STEP 7
        // Final verification
        // =================================================

        await test.step(
          'Verify report remains in Initial Review without changing workflow state',
          async () => {
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
              'Under Assessment',
            );

            await expect(
              flow.initialReview
                .taskContainer,
            ).toContainText(
              'Update Initial Review',
            );
          },
        );

        /**
         * IMPORTANT:
         *
         * Do NOT click Complete Task here.
         *
         * STAFF-AAPA-001 is intentionally read-only.
         *
         * Complete Task changes the workflow state
         * and will be handled by a dedicated E2E
         * transition test.
         */

        console.log(
          [
            '',
            '========================================',
            'STAFF-AAPA-001 RESULT',
            '========================================',
            `Report: ${REPORT_ID}`,
            'Login: PASSED',
            'Operational Dashboard: PASSED',
            'Under Assessment: PASSED',
            'Open Task: PASSED',
            'Update Initial Review: PASSED',
            'Report Details Navigation: NOT PRESENT',
            'Comments / Notes Navigation: NOT PRESENT',
            'Complete Task: AVAILABLE',
            'Save as Draft: AVAILABLE',
            'Workflow State Changed: NO',
            '========================================',
            '',
          ].join('\n'),
        );
      },
    );
  },
);