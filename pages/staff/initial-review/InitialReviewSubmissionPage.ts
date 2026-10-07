import { expect, Locator, Page } from '@playwright/test';

export type SubmissionAction =
    | 'Assign Lead Investigator'
    | 'Handled Personally / Submit For Approval';

export class InitialReviewSubmissionPage {
    readonly page: Page;

    readonly taskContainer: Locator;
    readonly submissionActionSelect: Locator;
    readonly leadInvestigatorSelect: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;


    constructor(page: Page) {
        this.page = page;

        this.taskContainer = page.locator(
            '.task-edit-dialog--full-page',
        );

        /**
         * Confirmed actual DOM:
         *
         * <select class="... task-edit-dialog__submission-select">
         *
         * Options:
         * - Select Submission Action
         * - Assign Lead Investigator
         * - Handled Personally / Submit For Approval
         */
        this.submissionActionSelect =
            this.taskContainer.locator(
                'select.task-edit-dialog__submission-select',
            );
        this.leadInvestigatorSelect =
            this.taskContainer.locator(
                '#member-leadinvestigato',
            );
        this.submitButton =
            this.taskContainer.getByRole(
                'button',
                {
                    name: 'Submit',
                    exact: true,
                },
            );

        this.cancelButton =
            this.taskContainer.getByRole(
                'button',
                {
                    name: 'Cancel',
                    exact: true,
                },
            );
    }

    async verifyLoaded(
        reportId: string,
    ): Promise<void> {
        await expect(
            this.taskContainer,
            'Initial Review Submission should be visible',
        ).toBeVisible({
            timeout: 20_000,
        });

        await expect(
            this.taskContainer,
        ).toContainText(
            'Initial Review Submission',
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
            this.submissionActionSelect,
        ).toHaveCount(1);

        await expect(
            this.submissionActionSelect,
        ).toBeVisible();

        await expect(
            this.submissionActionSelect,
        ).toBeEnabled();
    }

    async verifyAvailableActions(): Promise<void> {
        await expect(
            this.submissionActionSelect.locator('option'),
        ).toHaveText([
            'Select Submission Action',
            'Assign Lead Investigator',
            'Handled Personally / Submit For Approval',
        ]);
    }

    async verifySubmitDisabledBeforeSelection(): Promise<void> {
        await expect(
            this.submitButton,
        ).toBeVisible();

        await expect(
            this.submitButton,
        ).toBeDisabled();
    }

    async selectSubmissionAction(
        action: SubmissionAction,
    ): Promise<void> {
        await expect(
            this.submissionActionSelect,
        ).toBeVisible();

        await expect(
            this.submissionActionSelect,
        ).toBeEnabled();

        await this.submissionActionSelect.selectOption({
            label: action,
        });
    }

    private async getSelectedValue(): Promise<string> {
        return this.submissionActionSelect.inputValue();
    }

    async verifySelectedAction(
        action: SubmissionAction,
    ): Promise<void> {
        const selectedOption =
            this.submissionActionSelect.locator(
                'option:checked',
            );

        await expect(
            selectedOption,
        ).toHaveText(action);
    }
    async verifyLeadInvestigatorRequired(): Promise<void> {
        await expect(
            this.taskContainer.getByText(
                'Lead Investigator*',
                {
                    exact: true,
                },
            ),
        ).toBeVisible();

        await expect(
            this.leadInvestigatorSelect,
        ).toHaveCount(1);

        await expect(
            this.leadInvestigatorSelect,
        ).toBeVisible();

        await expect(
            this.leadInvestigatorSelect,
        ).toBeEnabled();
    }

    async getLeadInvestigatorOptions(): Promise<string[]> {
        return this.leadInvestigatorSelect
            .locator('option')
            .allTextContents();
    }

    async selectLeadInvestigator(
        investigator: string,
    ): Promise<void> {
        await expect(
            this.leadInvestigatorSelect,
        ).toBeVisible();

        await this.leadInvestigatorSelect.selectOption({
            label: investigator,
        });
    }

    async verifySelectedLeadInvestigator(
        investigator: string,
    ): Promise<void> {
        await expect(
            this.leadInvestigatorSelect.locator(
                'option:checked',
            ),
        ).toHaveText(investigator);
    }
    async verifySubmitEnabled(): Promise<void> {
        await expect(
            this.submitButton,
        ).toBeVisible();

        await expect(
            this.submitButton,
        ).toBeEnabled();
    }

    async submit(): Promise<void> {
        await expect(
            this.submitButton,
        ).toBeVisible();

        await expect(
            this.submitButton,
        ).toBeEnabled();

        await this.submitButton.click();
    }

    async cancel(): Promise<void> {
        await expect(
            this.cancelButton,
        ).toBeVisible();

        await expect(
            this.cancelButton,
        ).toBeEnabled();

        await this.cancelButton.click();
    }
}