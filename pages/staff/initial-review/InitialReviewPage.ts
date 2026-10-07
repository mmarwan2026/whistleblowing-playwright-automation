import { expect, Locator, Page } from '@playwright/test';

export class InitialReviewPage {
    readonly page: Page;

    readonly taskContainer: Locator;

    readonly reportDetailsButton: Locator;
    readonly commentsNotesButton: Locator;

    readonly completeTaskButton: Locator;
    readonly saveAsDraftButton: Locator;

    readonly minimizeButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        /**
         * Confirmed from actual Aura DOM.
         *
         * Open Task does not navigate to another URL.
         * It opens a full-page task overlay inside the SPA.
         */
        this.taskContainer = page.locator(
            '.task-edit-dialog--full-page',
        );

        this.reportDetailsButton =
            this.taskContainer.getByRole(
                'button',
                {
                    name: 'Report Details',
                    exact: true,
                },
            );

        this.commentsNotesButton =
            this.taskContainer.getByRole(
                'button',
                {
                    name: 'Comments / Notes',
                    exact: true,
                },
            );

        this.completeTaskButton =
            this.taskContainer.getByRole(
                'button',
                {
                    name: 'Complete Task',
                    exact: true,
                },
            );

        this.saveAsDraftButton =
            this.taskContainer.getByRole(
                'button',
                {
                    name: 'Save as Draft',
                    exact: true,
                },
            );

        this.minimizeButton =
            this.taskContainer.getByRole(
                'button',
                {
                    name: 'Minimize',
                    exact: true,
                },
            );

        this.closeButton =
            this.taskContainer.getByRole(
                'button',
                {
                    name: 'Close',
                    exact: true,
                },
            );
    }

    async verifyLoaded(
        reportId: string,
    ): Promise<void> {
        await expect(
            this.taskContainer,
            'Initial Review task container should be visible',
        ).toBeVisible({
            timeout: 20_000,
        });

        await expect(
            this.taskContainer,
        ).toContainText(
            'Update Initial Review',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Case Report ID',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            reportId,
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Case Status',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Under Assessment',
        );
    }

    async verifyHeaderInformation(
        reportId: string,
    ): Promise<void> {
        await expect(
            this.taskContainer,
        ).toContainText(
            'Update Initial Review',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Case Report ID',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            reportId,
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Case Status',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Under Assessment',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'AAPA Version',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Submission Date',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Submission Channel',
        );
    }

    async verifyNavigationActions(): Promise<void> {
        /**
         * Report Details / Comments & Notes are optional
         * navigation controls depending on the current task render.
         *
         * They are not used as the primary loaded-state assertion.
         */

        const reportDetailsCount =
            await this.reportDetailsButton.count();

        const commentsNotesCount =
            await this.commentsNotesButton.count();

        console.log(
            'Initial Review navigation:',
            {
                reportDetails:
                    reportDetailsCount > 0,
                commentsNotes:
                    commentsNotesCount > 0,
            },
        );

        if (reportDetailsCount > 0) {
            await expect(
                this.reportDetailsButton,
            ).toBeVisible();
        }

        if (commentsNotesCount > 0) {
            await expect(
                this.commentsNotesButton,
            ).toBeVisible();
        }
    }

    async verifyWorkflowActions(): Promise<void> {
        await expect(
            this.completeTaskButton,
        ).toBeVisible();

        await expect(
            this.completeTaskButton,
        ).toBeEnabled();

        await expect(
            this.saveAsDraftButton,
        ).toBeVisible();

        await expect(
            this.saveAsDraftButton,
        ).toBeEnabled();
    }

    async verifyReportDetailsVisible(): Promise<void> {
        await expect(
            this.taskContainer,
        ).toContainText(
            'Reporter Info',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Reporting Mode',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Reporter Category',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Classification',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Reported Case Category',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Reported Case Subcategory',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Allegation',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Incident Title',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Incident Description',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Witnesses',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Evidence',
        );

        await expect(
            this.taskContainer,
        ).toContainText(
            'Previous Reporting',
        );
    }

    async openReportDetails(): Promise<void> {
        await expect(
            this.reportDetailsButton,
        ).toBeVisible();

        await expect(
            this.reportDetailsButton,
        ).toBeEnabled();

        await this.reportDetailsButton.click();
    }

    async openCommentsNotes(): Promise<void> {
        await expect(
            this.commentsNotesButton,
        ).toBeVisible();

        await expect(
            this.commentsNotesButton,
        ).toBeEnabled();

        await this.commentsNotesButton.click();
    }

    async saveAsDraft(): Promise<void> {
        await expect(
            this.saveAsDraftButton,
        ).toBeVisible();

        await expect(
            this.saveAsDraftButton,
        ).toBeEnabled();

        await this.saveAsDraftButton.click();
    }

    async completeTask(): Promise<void> {
        await expect(
            this.completeTaskButton,
        ).toBeVisible();

        await expect(
            this.completeTaskButton,
        ).toBeEnabled();

        await this.completeTaskButton.click();
    }

    async minimize(): Promise<void> {
        await expect(
            this.minimizeButton,
        ).toBeVisible();

        await expect(
            this.minimizeButton,
        ).toBeEnabled();

        await this.minimizeButton.click();
    }

    async close(): Promise<void> {
        await expect(
            this.closeButton,
        ).toBeVisible();

        await expect(
            this.closeButton,
        ).toBeEnabled();

        await this.closeButton.click();
    }
}