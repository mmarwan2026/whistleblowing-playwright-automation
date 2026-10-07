import { Page } from '@playwright/test';

import { StaffDashboardPage } from '../../pages/staff/dashboard/StaffDashboardPage';
import { InitialReviewPage } from '../../pages/staff/initial-review/InitialReviewPage';
import { InitialReviewSubmissionPage } from '../../pages/staff/initial-review/InitialReviewSubmissionPage';

export class InitialReviewFlow {
    readonly page: Page;

    readonly dashboard: StaffDashboardPage;
    readonly initialReview: InitialReviewPage;
    readonly initialReviewSubmission: InitialReviewSubmissionPage;
    constructor(page: Page) {
        this.page = page;

        this.dashboard =
            new StaffDashboardPage(page);

        this.initialReview =
            new InitialReviewPage(page);

        this.initialReviewSubmission =
            new InitialReviewSubmissionPage(page);
    }

    async openUnderAssessmentReport(
        reportId: string,
    ): Promise<void> {
        await this.dashboard.verifyLoaded();

        await this.dashboard.openUnderAssessment();

        await this.dashboard.verifyReportVisible(
            reportId,
        );

        await this.dashboard.verifyReportStatus(
            reportId,
            'Under Assessment',
        );

        await this.dashboard.openReportTask(
            reportId,
        );

        await this.initialReview.verifyLoaded(
            reportId,
        );
    }

    async verifyInitialReview(
        reportId: string,
    ): Promise<void> {
        await this.initialReview.verifyLoaded(
            reportId,
        );

        await this.initialReview.verifyHeaderInformation(
            reportId,
        );

        await this.initialReview.verifyNavigationActions();

        await this.initialReview.verifyWorkflowActions();

        await this.initialReview.verifyReportDetailsVisible();
    }

    /**
     * State-changing action.
     *
     * Do not call from read-only regression tests.
     */
    async completeInitialReview(): Promise<void> {
        await this.initialReview.completeTask();
    }

    async completeInitialReviewAndOpenSubmission(
        reportId: string,
    ): Promise<void> {
        await this.initialReview.completeTask();

        await this.initialReviewSubmission.verifyLoaded(
            reportId,
        );
    }

    async saveInitialReviewAsDraft(): Promise<void> {
        await this.initialReview.saveAsDraft();
    }

}