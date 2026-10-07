import {
    expect,
    Locator,
    Page,
} from '@playwright/test';


/*
 * ============================================================
 * Types
 * ============================================================
 */

export type AapaUrgency =
    | 'Critical'
    | 'High'
    | 'Medium'
    | 'Low';


export type RiskRating =
    | 'Low'
    | 'Medium'
    | 'High'
    | 'Critical';


export type RiskCriterion =
    | 'Nature and severity of alleged misconduct'
    | 'Regulatory, legal and deadline exposure'
    | 'Subject seniority and governance sensitivity'
    | 'Operational and business-continuity impact'
    | 'Reputation and external attention'
    | 'Financial exposure and ongoing loss'
    | 'Evidence preservation and concealment risk'
    | 'Retaliation, witness and immediate safety risk'
    | 'Pervasiveness and control breakdown'
    | 'Credibility and corroboration available'
    | 'Recurrence, prior reports and attempted suppression'
    | 'Investigation complexity and specialist dependency';


export type CriticalPriorityTrigger =
    | 'C-Level, CEO or Board'
    | 'Active regulator / law enforcement'
    | 'Major public/media impact'
    | 'Immediate risk of evidence destruction'
    | 'Sexual harassment';


export type HighPriorityTrigger =
    | 'Director to Senior Executive Director'
    | 'Retaliation'
    | 'Actual Conflict of interest'
    | 'Cross-functional/departmental';


export type PriorityTrigger =
    | CriticalPriorityTrigger
    | HighPriorityTrigger;


export interface RiskAssessmentSnapshot {

    assessedPriority:
    RiskRating | '';

    selectedRatingsCount:
    number;

    selectedSpecialCircumstancesCount:
    number;
}


export interface AapaMainInfoSnapshot {

    taskName:
    string;

    taskDescription:
    string;

    urgencyValue:
    string;

    urgencyText:
    string;

    startDate:
    string;

    endDate:
    string;

    completeTaskEnabled:
    boolean;

    saveAsDraftEnabled:
    boolean;
}


/*
 * ============================================================
 * AAPA Preparation Page
 * ============================================================
 */

export class AapaPreparationPage {

    readonly page: Page;


    /*
     * --------------------------------------------------------
     * Main Container
     * --------------------------------------------------------
     */

    readonly heading: Locator;

    readonly formContainer: Locator;

    readonly mainInfoBody: Locator;

    readonly mainInfoButton: Locator;


    /*
     * --------------------------------------------------------
     * Task Name
     * --------------------------------------------------------
     */

    readonly taskNameLabel: Locator;

    readonly taskNameField: Locator;

    readonly taskNameInput: Locator;


    /*
     * --------------------------------------------------------
     * Task Description
     * --------------------------------------------------------
     */

    readonly taskDescriptionLabel: Locator;

    readonly taskDescriptionField: Locator;

    readonly taskDescriptionTextarea: Locator;


    /*
     * --------------------------------------------------------
     * Urgency
     * --------------------------------------------------------
     */

    readonly urgencyLabel: Locator;

    readonly urgencyField: Locator;

    readonly urgencySelect: Locator;


    /*
     * --------------------------------------------------------
     * Start Date
     * --------------------------------------------------------
     */

    readonly startDateLabel: Locator;

    readonly startDateField: Locator;

    readonly startDateInput: Locator;


    /*
     * --------------------------------------------------------
     * End Date
     * --------------------------------------------------------
     */

    readonly endDateLabel: Locator;

    readonly endDateField: Locator;

    readonly endDateInput: Locator;


    /*
     * --------------------------------------------------------
     * Workflow Actions
     * --------------------------------------------------------
     */

    readonly completeTaskButton: Locator;

    readonly saveAsDraftButton: Locator;


    /*
     * --------------------------------------------------------
     * Priority & Risk
     * --------------------------------------------------------
     */

    readonly priorityRiskButton: Locator;

    readonly assessedPriorityInput: Locator;

    readonly calculatePriorityButton: Locator;


    /*
     * ========================================================
     * Constructor
     * ========================================================
     */

    constructor(page: Page) {

        this.page = page;


        /*
         * ----------------------------------------------------
         * Update AAPA Preparation
         * ----------------------------------------------------
         */

        this.heading =
            page.getByRole(
                'heading',
                {
                    name:
                        'Update AAPA Preparation',

                    exact:
                        true,
                },
            );


        /*
         * Locate the actual AAPA form using its workflow
         * actions.
         *
         * Discovery confirmed this UI is not exposed as
         * role="dialog".
         */

        this.formContainer =
            this.heading.locator(
                'xpath=ancestor::*[' +
                './/button[normalize-space()="Complete Task"] ' +
                'and ' +
                './/button[normalize-space()="Save as Draft"]' +
                '][1]',
            );


        /*
         * ----------------------------------------------------
         * Main Info
         * ----------------------------------------------------
         */

        this.mainInfoBody =
            this.formContainer.locator(
                '.task-edit-dialog__body',
            );


        this.mainInfoButton =
            this.formContainer.getByRole(
                'button',
                {
                    name:
                        'Main Info',

                    exact:
                        true,
                },
            );


        /*
         * ----------------------------------------------------
         * Task Name
         * ----------------------------------------------------
         */

        this.taskNameLabel =
            this.mainInfoBody
                .locator('label')
                .filter({
                    hasText:
                        /^Task Name$/,
                });


        this.taskNameField =
            this.taskNameLabel.locator(
                '..',
            );


        this.taskNameInput =
            this.taskNameField.locator(
                'input[type="text"]',
            );


        /*
         * ----------------------------------------------------
         * Task Description
         * ----------------------------------------------------
         */

        this.taskDescriptionLabel =
            this.mainInfoBody
                .locator('label')
                .filter({
                    hasText:
                        /^Task Description$/,
                });


        this.taskDescriptionField =
            this.taskDescriptionLabel.locator(
                '..',
            );


        this.taskDescriptionTextarea =
            this.taskDescriptionField.locator(
                'textarea',
            );


        /*
         * ----------------------------------------------------
         * Urgency
         * ----------------------------------------------------
         */

        this.urgencyLabel =
            this.mainInfoBody
                .locator('label')
                .filter({
                    hasText:
                        /^Urgency/,
                });


        this.urgencyField =
            this.urgencyLabel.locator(
                '..',
            );


        this.urgencySelect =
            this.urgencyField.locator(
                'select',
            );


        /*
         * ----------------------------------------------------
         * Start Date
         * ----------------------------------------------------
         */

        this.startDateLabel =
            this.mainInfoBody
                .locator('label')
                .filter({
                    hasText:
                        /^Start Date/,
                });


        this.startDateField =
            this.startDateLabel.locator(
                '..',
            );


        this.startDateInput =
            this.startDateField.locator(
                'input[type="date"]',
            );


        /*
         * ----------------------------------------------------
         * End Date
         * ----------------------------------------------------
         */

        this.endDateLabel =
            this.mainInfoBody
                .locator('label')
                .filter({
                    hasText:
                        /^End Date$/,
                });


        this.endDateField =
            this.endDateLabel.locator(
                '..',
            );


        this.endDateInput =
            this.endDateField.locator(
                'input[type="date"]',
            );


        /*
         * ----------------------------------------------------
         * Workflow Actions
         * ----------------------------------------------------
         */

        this.completeTaskButton =
            this.formContainer.getByRole(
                'button',
                {
                    name:
                        'Complete Task',

                    exact:
                        true,
                },
            );


        this.saveAsDraftButton =
            this.formContainer.getByRole(
                'button',
                {
                    name:
                        'Save as Draft',

                    exact:
                        true,
                },
            );


        /*
         * ----------------------------------------------------
         * Priority & Risk
         * ----------------------------------------------------
         */

        this.priorityRiskButton =
            this.formContainer.getByRole(
                'button',
                {
                    name:
                        'Priority & Risk',

                    exact:
                        true,
                },
            );


        /*
         * Confirmed during Priority & Risk discovery.
         */

        this.assessedPriorityInput =
            this.formContainer.locator(
                '[data-uda-name="assessedpriority"]',
            );


        this.calculatePriorityButton =
            this.formContainer.getByRole(
                'button',
                {
                    name:
                        'Calculate Priority',

                    exact:
                        true,
                },
            );
    }


    /*
     * ========================================================
     * Page Verification
     * ========================================================
     */

    async verifyLoaded(): Promise<void> {

        await expect(
            this.heading,
            'Update AAPA Preparation heading should be unique',
        ).toHaveCount(1);


        await expect(
            this.heading,
            'Update AAPA Preparation should be visible',
        ).toBeVisible();


        await expect(
            this.formContainer,
            'AAPA Preparation form should be unique',
        ).toHaveCount(1);


        await expect(
            this.formContainer,
            'AAPA Preparation form should be visible',
        ).toBeVisible();


        await expect(
            this.mainInfoBody,
            'Main Info body should be unique',
        ).toHaveCount(1);


        await expect(
            this.mainInfoBody,
            'Main Info body should be visible',
        ).toBeVisible();
    }


    /*
     * ========================================================
     * Main Info
     * ========================================================
     */

    async verifyMainInfo(): Promise<void> {

        await expect(
            this.mainInfoBody,
            'Main Info should be visible',
        ).toBeVisible();


        const result =
            await this.mainInfoBody.evaluate(
                element => {

                    const labels =
                        Array.from(
                            element.querySelectorAll(
                                'label',
                            ),
                        );


                    const getField =
                        (
                            labelPrefix: string,
                        ): HTMLElement | null => {

                            const label =
                                labels.find(
                                    item =>
                                        item.textContent
                                            ?.trim()
                                            .startsWith(
                                                labelPrefix,
                                            ),
                                );


                            return label
                                ?.parentElement ??
                                null;
                        };


                    const taskNameField =
                        getField(
                            'Task Name',
                        );


                    const descriptionField =
                        getField(
                            'Task Description',
                        );


                    const urgencyField =
                        getField(
                            'Urgency',
                        );


                    const startDateField =
                        getField(
                            'Start Date',
                        );


                    const endDateField =
                        getField(
                            'End Date',
                        );


                    const taskName =
                        taskNameField
                            ?.querySelector(
                                'input[type="text"]',
                            ) as
                        HTMLInputElement |
                        null;


                    const description =
                        descriptionField
                            ?.querySelector(
                                'textarea',
                            ) as
                        HTMLTextAreaElement |
                        null;


                    const urgency =
                        urgencyField
                            ?.querySelector(
                                'select',
                            ) as
                        HTMLSelectElement |
                        null;


                    const startDate =
                        startDateField
                            ?.querySelector(
                                'input[type="date"]',
                            ) as
                        HTMLInputElement |
                        null;


                    const endDate =
                        endDateField
                            ?.querySelector(
                                'input[type="date"]',
                            ) as
                        HTMLInputElement |
                        null;


                    return {

                        taskNameExists:
                            Boolean(taskName),

                        taskName:
                            taskName?.value ??
                            '',

                        taskNameDisabled:
                            taskName?.disabled ??
                            false,


                        descriptionExists:
                            Boolean(description),

                        description:
                            description?.value ??
                            '',

                        descriptionDisabled:
                            description?.disabled ??
                            false,


                        urgencyExists:
                            Boolean(urgency),

                        urgency:
                            urgency?.value ??
                            '',

                        urgencyDisabled:
                            urgency?.disabled ??
                            true,


                        startDateExists:
                            Boolean(startDate),

                        startDate:
                            startDate?.value ??
                            '',

                        startDateDisabled:
                            startDate?.disabled ??
                            true,


                        endDateExists:
                            Boolean(endDate),

                        endDate:
                            endDate?.value ??
                            '',

                        endDateDisabled:
                            endDate?.disabled ??
                            true,
                    };
                },
            );


        /*
         * Task Name
         */

        expect(
            result.taskNameExists,
            'Task Name should exist',
        ).toBe(true);


        expect(
            result.taskName,
            'Task Name should be AAPA Preparation',
        ).toBe(
            'AAPA Preparation',
        );


        expect(
            result.taskNameDisabled,
            'Task Name should not be editable',
        ).toBe(true);


        /*
         * Task Description
         */

        expect(
            result.descriptionExists,
            'Task Description should exist',
        ).toBe(true);


        expect(
            result.description,
            'Task Description should not be empty',
        ).not.toBe('');


        expect(
            result.descriptionDisabled,
            'Task Description should not be editable',
        ).toBe(true);


        /*
         * Urgency
         */

        expect(
            result.urgencyExists,
            'Urgency should exist',
        ).toBe(true);


        expect(
            result.urgency,
            'Urgency should have a selected value',
        ).not.toBe('');


        expect(
            result.urgencyDisabled,
            'Urgency should be editable',
        ).toBe(false);


        /*
         * Start Date
         */

        expect(
            result.startDateExists,
            'Start Date should exist',
        ).toBe(true);


        expect(
            result.startDate,
            'Start Date should have a value',
        ).not.toBe('');


        expect(
            result.startDateDisabled,
            'Start Date should be editable',
        ).toBe(false);


        /*
         * End Date
         */

        expect(
            result.endDateExists,
            'End Date should exist',
        ).toBe(true);


        expect(
            result.endDateDisabled,
            'End Date should be editable',
        ).toBe(false);
    }


    /*
     * ========================================================
     * Task Name
     * ========================================================
     */

    async verifyTaskName(): Promise<void> {

        await expect(
            this.taskNameLabel,
            'Task Name label should be unique',
        ).toHaveCount(1);


        await expect(
            this.taskNameLabel,
            'Task Name label should be visible',
        ).toBeVisible();


        await expect(
            this.taskNameInput,
            'Task Name input should be unique',
        ).toHaveCount(1);


        await expect(
            this.taskNameInput,
            'Task Name input should be visible',
        ).toBeVisible();


        await expect(
            this.taskNameInput,
            'Task Name should not be editable',
        ).toBeDisabled();


        await expect(
            this.taskNameInput,
            'Task Name should be AAPA Preparation',
        ).toHaveValue(
            'AAPA Preparation',
        );
    }


    async getTaskName(): Promise<string> {

        await expect(
            this.taskNameInput,
            'Task Name input should be visible',
        ).toBeVisible();


        return this.taskNameInput
            .inputValue();
    }


    /*
     * ========================================================
     * Task Description
     * ========================================================
     */

    async verifyTaskDescription(): Promise<void> {

        await expect(
            this.taskDescriptionLabel,
            'Task Description label should be unique',
        ).toHaveCount(1);


        await expect(
            this.taskDescriptionLabel,
            'Task Description label should be visible',
        ).toBeVisible();


        await expect(
            this.taskDescriptionTextarea,
            'Task Description textarea should be unique',
        ).toHaveCount(1);


        await expect(
            this.taskDescriptionTextarea,
            'Task Description should be visible',
        ).toBeVisible();


        await expect(
            this.taskDescriptionTextarea,
            'Task Description should not be editable',
        ).toBeDisabled();


        await expect(
            this.taskDescriptionTextarea,
            'Task Description should contain task information',
        ).not.toHaveValue('');
    }


    async getTaskDescription(): Promise<string> {

        await expect(
            this.taskDescriptionTextarea,
            'Task Description should be visible',
        ).toBeVisible();


        return this.taskDescriptionTextarea
            .inputValue();
    }


    /*
     * ========================================================
     * Urgency
     * ========================================================
     */

    async verifyUrgency(): Promise<void> {

        await expect(
            this.urgencyLabel,
            'Urgency label should be unique',
        ).toHaveCount(1);


        await expect(
            this.urgencyLabel,
            'Urgency label should be visible',
        ).toBeVisible();


        await expect(
            this.urgencySelect,
            'Urgency select should be unique',
        ).toHaveCount(1);


        await expect(
            this.urgencySelect,
            'Urgency select should be visible',
        ).toBeVisible();


        await expect(
            this.urgencySelect,
            'Urgency should be editable',
        ).toBeEnabled();


        /*
         * Confirmed options:
         *
         * -- Select Urgency --
         * Critical
         * High
         * Medium
         * Low
         */

        await expect(
            this.urgencySelect.locator(
                'option',
            ),
            'Urgency should contain placeholder plus four priorities',
        ).toHaveCount(5);
    }


    async getUrgencyValue(): Promise<string> {

        await expect(
            this.urgencySelect,
            'Urgency select should be visible',
        ).toBeVisible();


        return this.urgencySelect
            .inputValue();
    }


    async getUrgencyText(): Promise<string> {

        const urgencyValue =
            await this.getUrgencyValue();


        const urgencyMap:
            Record<string, string> = {

            '1':
                'Critical',

            '2':
                'High',

            '3':
                'Medium',

            '4':
                'Low',
        };


        return urgencyMap[
            urgencyValue
        ] ?? '';
    }


    async selectUrgency(
        urgency: AapaUrgency,
    ): Promise<void> {

        const urgencyValueMap:
            Record<AapaUrgency, string> = {

            Critical:
                '1',

            High:
                '2',

            Medium:
                '3',

            Low:
                '4',
        };


        const expectedValue =
            urgencyValueMap[
            urgency
            ];


        await expect(
            this.urgencySelect,
            'Urgency select should be visible before changing value',
        ).toBeVisible();


        await expect(
            this.urgencySelect,
            'Urgency select should be enabled before changing value',
        ).toBeEnabled();


        await this.urgencySelect
            .selectOption(
                expectedValue,
            );


        await expect(
            this.urgencySelect,
            `Urgency should be changed to ${urgency}`,
        ).toHaveValue(
            expectedValue,
        );
    }


    async verifyUrgencySelected(
        urgency: AapaUrgency,
    ): Promise<void> {

        const urgencyValueMap:
            Record<AapaUrgency, string> = {

            Critical:
                '1',

            High:
                '2',

            Medium:
                '3',

            Low:
                '4',
        };


        await expect(
            this.urgencySelect,
            `Urgency should remain selected as ${urgency}`,
        ).toHaveValue(
            urgencyValueMap[
            urgency
            ],
        );
    }


    /*
     * ========================================================
     * Start Date
     * ========================================================
     */

    async verifyStartDate(): Promise<void> {

        await expect(
            this.startDateLabel,
            'Start Date label should be unique',
        ).toHaveCount(1);


        await expect(
            this.startDateLabel,
            'Start Date label should be visible',
        ).toBeVisible();


        await expect(
            this.startDateInput,
            'Start Date input should be unique',
        ).toHaveCount(1);


        await expect(
            this.startDateInput,
            'Start Date should be visible',
        ).toBeVisible();


        await expect(
            this.startDateInput,
            'Start Date should be editable',
        ).toBeEnabled();


        await expect(
            this.startDateInput,
            'Start Date should have a value',
        ).not.toHaveValue('');
    }


    async getStartDate(): Promise<string> {

        await expect(
            this.startDateInput,
            'Start Date input should be visible',
        ).toBeVisible();


        return this.startDateInput
            .inputValue();
    }


    async setStartDate(
        date: string,
    ): Promise<void> {

        await expect(
            this.startDateInput,
            'Start Date should be enabled before changing value',
        ).toBeEnabled();


        await this.startDateInput.fill(
            date,
        );


        await expect(
            this.startDateInput,
            'Start Date should contain the selected date',
        ).toHaveValue(
            date,
        );
    }


    /*
     * ========================================================
     * End Date
     * ========================================================
     */

    async verifyEndDate(): Promise<void> {

        await expect(
            this.endDateLabel,
            'End Date label should be unique',
        ).toHaveCount(1);


        await expect(
            this.endDateLabel,
            'End Date label should be visible',
        ).toBeVisible();


        await expect(
            this.endDateInput,
            'End Date input should be unique',
        ).toHaveCount(1);


        await expect(
            this.endDateInput,
            'End Date input should be visible',
        ).toBeVisible();


        await expect(
            this.endDateInput,
            'End Date should be editable',
        ).toBeEnabled();
    }


    async getEndDate(): Promise<string> {

        await expect(
            this.endDateInput,
            'End Date input should be visible',
        ).toBeVisible();


        return this.endDateInput
            .inputValue();
    }


    async setEndDate(
        date: string,
    ): Promise<void> {

        await expect(
            this.endDateInput,
            'End Date input should be enabled before changing value',
        ).toBeEnabled();


        await this.endDateInput.fill(
            date,
        );


        await expect(
            this.endDateInput,
            'End Date input should contain the selected date',
        ).toHaveValue(
            date,
        );
    }


    /*
     * ========================================================
     * Workflow Actions
     * ========================================================
     */

    async verifyWorkflowActions(): Promise<void> {

        await expect(
            this.completeTaskButton,
            'Complete Task button should be unique',
        ).toHaveCount(1);


        await expect(
            this.completeTaskButton,
            'Complete Task button should be visible',
        ).toBeVisible();


        await expect(
            this.saveAsDraftButton,
            'Save as Draft button should be unique',
        ).toHaveCount(1);


        await expect(
            this.saveAsDraftButton,
            'Save as Draft button should be visible',
        ).toBeVisible();
    }


    async isCompleteTaskEnabled():
        Promise<boolean> {

        await expect(
            this.completeTaskButton,
        ).toBeVisible();


        return this.completeTaskButton
            .isEnabled();
    }


    async isSaveAsDraftEnabled():
        Promise<boolean> {

        await expect(
            this.saveAsDraftButton,
        ).toBeVisible();


        return this.saveAsDraftButton
            .isEnabled();
    }


    /*
     * ========================================================
     * Priority & Risk
     * ========================================================
     */

    async openPriorityRisk(): Promise<void> {

        await expect(
            this.priorityRiskButton,
            'Priority & Risk button should be unique',
        ).toHaveCount(1);


        await expect(
            this.priorityRiskButton,
            'Priority & Risk button should be visible',
        ).toBeVisible();


        await expect(
            this.priorityRiskButton,
            'Priority & Risk button should be enabled',
        ).toBeEnabled();


        await this.priorityRiskButton.click();


        /*
         * The Priority & Risk section is considered loaded when
         * its assessed priority field and Calculate Priority
         * action are available.
         */

        await expect(
            this.assessedPriorityInput,
            'Assessed Priority should be visible',
        ).toBeVisible();


        await expect(
            this.calculatePriorityButton,
            'Calculate Priority should be visible',
        ).toBeVisible();
    }


    async verifyPriorityRisk(): Promise<void> {

        await expect(
            this.assessedPriorityInput,
            'Assessed Priority should be unique',
        ).toHaveCount(1);


        await expect(
            this.assessedPriorityInput,
            'Assessed Priority should be visible',
        ).toBeVisible();


        await expect(
            this.calculatePriorityButton,
            'Calculate Priority button should be unique',
        ).toHaveCount(1);


        await expect(
            this.calculatePriorityButton,
            'Calculate Priority button should be visible',
        ).toBeVisible();
    }


    async getAssessedPriority():
        Promise<RiskRating | ''> {

        await expect(
            this.assessedPriorityInput,
            'Assessed Priority should be visible before reading value',
        ).toBeVisible();


        /*
         * Support input/select style controls without assuming
         * a new DOM structure beyond what discovery confirmed.
         */

        const value =
            (
                await this.assessedPriorityInput
                    .inputValue()
            ).trim();


        if (
            value === 'Low' ||
            value === 'Medium' ||
            value === 'High' ||
            value === 'Critical'
        ) {
            return value;
        }


        /*
         * Some implementations may store an internal value while
         * exposing the priority through the selected option text.
         */

        if (
            await this.assessedPriorityInput
                .evaluate(
                    element =>
                        element.tagName
                            .toLowerCase() ===
                        'select',
                )
        ) {

            const selectedText =
                (
                    await this.assessedPriorityInput
                        .locator(
                            'option:checked',
                        )
                        .textContent()
                )
                    ?.trim() ??
                '';


            if (
                selectedText === 'Low' ||
                selectedText === 'Medium' ||
                selectedText === 'High' ||
                selectedText === 'Critical'
            ) {
                return selectedText;
            }
        }


        return '';
    }


    /*
     * ========================================================
     * Snapshot
     * ========================================================
     */

    async getMainInfoSnapshot():
        Promise<AapaMainInfoSnapshot> {

        await expect(
            this.mainInfoBody,
            'Main Info should be visible before capturing snapshot',
        ).toBeVisible();


        /*
         * Capture all Main Info values from the same DOM render.
         *
         * This avoids reading individual locators sequentially
         * while React may re-render the form.
         */

        const mainInfo =
            await this.mainInfoBody.evaluate(
                element => {

                    const fieldByLabel =
                        (
                            labelText: string,
                        ): HTMLElement | null => {

                            const labels =
                                Array.from(
                                    element.querySelectorAll(
                                        'label',
                                    ),
                                );


                            const label =
                                labels.find(
                                    item =>
                                        item.textContent
                                            ?.trim()
                                            .startsWith(
                                                labelText,
                                            ),
                                );


                            return label
                                ?.parentElement ??
                                null;
                        };


                    const taskNameField =
                        fieldByLabel(
                            'Task Name',
                        );


                    const taskDescriptionField =
                        fieldByLabel(
                            'Task Description',
                        );


                    const urgencyField =
                        fieldByLabel(
                            'Urgency',
                        );


                    const startDateField =
                        fieldByLabel(
                            'Start Date',
                        );


                    const endDateField =
                        fieldByLabel(
                            'End Date',
                        );


                    const taskNameInput =
                        taskNameField
                            ?.querySelector(
                                'input[type="text"]',
                            ) as
                        HTMLInputElement |
                        null;


                    const taskDescriptionTextarea =
                        taskDescriptionField
                            ?.querySelector(
                                'textarea',
                            ) as
                        HTMLTextAreaElement |
                        null;


                    const urgencySelect =
                        urgencyField
                            ?.querySelector(
                                'select',
                            ) as
                        HTMLSelectElement |
                        null;


                    const startDateInput =
                        startDateField
                            ?.querySelector(
                                'input[type="date"]',
                            ) as
                        HTMLInputElement |
                        null;


                    const endDateInput =
                        endDateField
                            ?.querySelector(
                                'input[type="date"]',
                            ) as
                        HTMLInputElement |
                        null;


                    if (!taskNameInput) {
                        throw new Error(
                            'Task Name input was not found while capturing Main Info snapshot',
                        );
                    }


                    if (!taskDescriptionTextarea) {
                        throw new Error(
                            'Task Description textarea was not found while capturing Main Info snapshot',
                        );
                    }


                    if (!urgencySelect) {
                        throw new Error(
                            'Urgency select was not found while capturing Main Info snapshot',
                        );
                    }


                    if (!startDateInput) {
                        throw new Error(
                            'Start Date input was not found while capturing Main Info snapshot',
                        );
                    }


                    if (!endDateInput) {
                        throw new Error(
                            'End Date input was not found while capturing Main Info snapshot',
                        );
                    }


                    const selectedUrgency =
                        urgencySelect
                            .selectedOptions[0];


                    return {

                        taskName:
                            taskNameInput.value,

                        taskDescription:
                            taskDescriptionTextarea.value,

                        urgencyValue:
                            urgencySelect.value,

                        urgencyText:
                            selectedUrgency
                                ?.textContent
                                ?.trim() ??
                            '',

                        startDate:
                            startDateInput.value,

                        endDate:
                            endDateInput.value,
                    };
                },
            );


        await expect(
            this.completeTaskButton,
            'Complete Task should be visible when capturing workflow state',
        ).toBeVisible();


        await expect(
            this.saveAsDraftButton,
            'Save as Draft should be visible when capturing workflow state',
        ).toBeVisible();


        const completeTaskEnabled =
            await this.completeTaskButton
                .isEnabled();


        const saveAsDraftEnabled =
            await this.saveAsDraftButton
                .isEnabled();


        return {

            taskName:
                mainInfo.taskName,

            taskDescription:
                mainInfo.taskDescription,

            urgencyValue:
                mainInfo.urgencyValue,

            urgencyText:
                mainInfo.urgencyText,

            startDate:
                mainInfo.startDate,

            endDate:
                mainInfo.endDate,

            completeTaskEnabled,

            saveAsDraftEnabled,
        };
    }


    /*
     * ========================================================
     * Workflow Mutations
     * ========================================================
     *
     * These methods are intentionally separate from verification
     * methods so read-only tests cannot accidentally mutate the
     * workflow.
     * ========================================================
     */

    async saveAsDraft(): Promise<void> {

        await expect(
            this.saveAsDraftButton,
            'Save as Draft should be enabled before click',
        ).toBeEnabled();


        await this.saveAsDraftButton.click();
    }


    async completeTask(): Promise<void> {

        await expect(
            this.completeTaskButton,
            'Complete Task should be enabled before click',
        ).toBeEnabled();


        await this.completeTaskButton.click();
    }
}