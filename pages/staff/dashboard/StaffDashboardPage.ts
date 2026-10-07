import { expect, Locator, Page } from '@playwright/test';

export class StaffDashboardPage {
    readonly page: Page;
    readonly underAssessmentCard: Locator;

    constructor(page: Page) {
        this.page = page;

        this.underAssessmentCard = page
            .getByRole('button')
            .filter({ hasText: 'Under Assessment' })
            .filter({ hasText: 'Cases' });
    }

    async verifyLoaded(): Promise<void> {
        await expect(
            this.underAssessmentCard,
            'Under Assessment card should be available on Operational Dashboard',
        ).toHaveCount(1, {
            timeout: 20_000,
        });

        await expect(
            this.underAssessmentCard,
        ).toBeVisible();
    }

    async openUnderAssessment(): Promise<void> {
        await expect(
            this.underAssessmentCard,
        ).toBeVisible();

        await expect(
            this.underAssessmentCard,
        ).toBeEnabled();

        await this.underAssessmentCard.click();
    }

    getReportCell(reportId: string): Locator {
        return this.page.getByText(
            reportId,
            {
                exact: true,
            },
        );
    }

    getReportRow(reportId: string): Locator {
        return this
            .getReportCell(reportId)
            .locator('xpath=ancestor::tr[1]');
    }

    async verifyReportVisible(
        reportId: string,
    ): Promise<void> {
        const reportCell =
            this.getReportCell(reportId);

        await expect(
            reportCell,
            `${reportId} should appear in Under Assessment details`,
        ).toBeVisible({
            timeout: 20_000,
        });
    }

    async verifyReportStatus(
        reportId: string,
        expectedStatus: string,
    ): Promise<void> {
        const reportRow =
            this.getReportRow(reportId);

        await expect(
            reportRow,
            `${reportId} row should exist`,
        ).toHaveCount(1);

        await expect(
            reportRow,
        ).toContainText(reportId);

        await expect(
            reportRow,
        ).toContainText(expectedStatus);
    }

    async openReportTask(
        reportId: string,
    ): Promise<void> {
        const reportRow =
            this.getReportRow(reportId);

        await expect(
            reportRow,
            `${reportId} row should exist`,
        ).toHaveCount(1);

        await expect(
            reportRow,
        ).toBeVisible();

        const openTaskButton =
            reportRow.getByRole(
                'button',
                {
                    name: 'Open Task',
                },
            );

        await expect(
            openTaskButton,
            `Open Task button should exist for ${reportId}`,
        ).toHaveCount(1);

        await expect(
            openTaskButton,
        ).toBeVisible();

        await expect(
            openTaskButton,
        ).toBeEnabled();

        await openTaskButton.click();
    }
}