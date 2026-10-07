import {
    expect,
    Locator,
    Page
} from '@playwright/test';

import {
    EntitiesInvolvedData
} from '../../../../models/public/EntitiesInvolvedData';


export class EntitiesInvolvedStep {

    constructor(
        private readonly page: Page
    ) { }


    // ============================================================
    // CORE LOCATORS
    // ============================================================

    private heading(): Locator {
        return this.page.getByRole(
            'heading',
            {
                name: 'Entities Involved',
                exact: true
            }
        );
    }


    private question(): Locator {
        return this.page.getByText(
            'Can You Identify the Entities Involved?',
            {
                exact: true
            }
        );
    }


    private yesRadio(): Locator {
        return this.page.getByRole(
            'radio',
            {
                name: 'Yes',
                exact: true
            }
        );
    }


    private noRadio(): Locator {
        return this.page.getByRole(
            'radio',
            {
                name: 'No',
                exact: true
            }
        );
    }


    private table(): Locator {
        return this.page.getByRole('table');
    }


    private addEntityButton(): Locator {
        return this.page.getByRole(
            'button',
            {
                name: 'Entities Involved',
                exact: true
            }
        );
    }


    private backButton(): Locator {
        return this.page.getByRole(
            'button',
            {
                name: 'Back',
                exact: true
            }
        );
    }


    private nextButton(): Locator {
        return this.page.getByRole(
            'button',
            {
                name: 'Next',
                exact: true
            }
        );
    }


    // ============================================================
    // ENTITY ROW LOCATORS
    // ============================================================

    private entityNameInput(
        entityIndex: number
    ): Locator {

        const rowNumber =
            entityIndex + 1;

        return this.page.getByRole(
            'textbox',
            {
                name: `Entity Name ${rowNumber}`,
                exact: true
            }
        );
    }


    private removeEntityButton(
        entityIndex: number
    ): Locator {

        const rowNumber =
            entityIndex + 1;

        return this.page.getByRole(
            'button',
            {
                name: `Remove row ${rowNumber}`,
                exact: true
            }
        );
    }


    // ============================================================
    // PAGE VALIDATION
    // ============================================================

    async verifyLoaded(): Promise<void> {

        await expect(
            this.heading()
        ).toBeVisible();

        await expect(
            this.question()
        ).toBeVisible();

        await expect(
            this.yesRadio()
        ).toBeVisible();

        await expect(
            this.noRadio()
        ).toBeVisible();

        await expect(
            this.backButton()
        ).toBeVisible();

        await expect(
            this.nextButton()
        ).toBeVisible();
    }


    // ============================================================
    // YES / NO
    // ============================================================

    async selectCanIdentify(
        answer: EntitiesInvolvedData['canIdentify']
    ): Promise<void> {

        const radio =
            answer === 'Yes'
                ? this.yesRadio()
                : this.noRadio();

        await expect(
            radio
        ).toBeVisible();

        await expect(
            radio
        ).toBeEnabled();

        await radio.check();

        await expect(
            radio
        ).toBeChecked();


        if (answer === 'Yes') {

            await expect(
                this.table()
            ).toBeVisible();

            await expect(
                this.entityNameInput(0)
            ).toBeVisible();

            await expect(
                this.addEntityButton()
            ).toBeVisible();
        }
    }


    // ============================================================
    // ENTITY COUNT
    // ============================================================

    async getEntityCount(): Promise<number> {

        const table =
            this.table();

        if (
            !(await table.isVisible())
        ) {
            return 0;
        }


        const rows =
            table.getByRole('row');

        const rowCount =
            await rows.count();


        // Header row is included.
        return Math.max(
            rowCount - 1,
            0
        );
    }


    // ============================================================
    // ENTER ENTITY NAME
    // ============================================================

    async enterEntityName(
        entityIndex: number,
        entityName: string
    ): Promise<void> {

        const entityCount =
            await this.getEntityCount();


        if (
            entityIndex < 0 ||
            entityIndex >= entityCount
        ) {
            throw new Error(
                `Entity row ${entityIndex + 1} is not available. ` +
                `Current entity count: ${entityCount}.`
            );
        }


        const input =
            this.entityNameInput(
                entityIndex
            );


        await expect(
            input
        ).toBeVisible();

        await expect(
            input
        ).toBeEnabled();


        await input.fill(
            entityName
        );


        await expect(
            input
        ).toHaveValue(
            entityName
        );
    }


    // ============================================================
    // ADD ENTITY
    // ============================================================

    async addEntity(): Promise<void> {

        const countBefore =
            await this.getEntityCount();


        const button =
            this.addEntityButton();


        await expect(
            button
        ).toBeVisible();

        await expect(
            button
        ).toBeEnabled();


        await button.click();


        await expect.poll(
            async () =>
                this.getEntityCount(),
            {
                message:
                    'Expected a new Entities Involved row to be added.'
            }
        ).toBe(
            countBefore + 1
        );


        await expect(
            this.entityNameInput(
                countBefore
            )
        ).toBeVisible();
    }


    // ============================================================
    // REMOVE ENTITY
    // ============================================================

    async removeEntity(
        entityIndex: number
    ): Promise<void> {

        const countBefore =
            await this.getEntityCount();


        if (countBefore <= 1) {
            throw new Error(
                'Cannot remove Entity because only one entity row currently exists.'
            );
        }


        if (
            entityIndex < 0 ||
            entityIndex >= countBefore
        ) {
            throw new Error(
                `Invalid entity index ${entityIndex}. ` +
                `Current entity count: ${countBefore}.`
            );
        }


        const removeButton =
            this.removeEntityButton(
                entityIndex
            );


        await expect(
            removeButton
        ).toBeVisible();

        await expect(
            removeButton
        ).toBeEnabled();


        await removeButton.click();


        await expect.poll(
            async () =>
                this.getEntityCount(),
            {
                message:
                    `Expected Entity row ${entityIndex + 1} to be removed.`
            }
        ).toBe(
            countBefore - 1
        );
    }


    // ============================================================
    // VERIFY ENTITY NAME
    // ============================================================

    async verifyEntityName(
        entityIndex: number,
        expectedName: string
    ): Promise<void> {

        const input =
            this.entityNameInput(
                entityIndex
            );


        await expect(
            input
        ).toBeVisible();


        await expect(
            input
        ).toHaveValue(
            expectedName
        );
    }


    // ============================================================
    // FILL COMPLETE STEP
    // ============================================================

    async fill(
        data: EntitiesInvolvedData
    ): Promise<void> {

        await this.verifyLoaded();


        await this.selectCanIdentify(
            data.canIdentify
        );


        if (
            data.canIdentify === 'No'
        ) {
            return;
        }


        const entities =
            data.entities ?? [];


        if (
            entities.length === 0
        ) {
            return;
        }


        for (
            let index = 0;
            index < entities.length;
            index++
        ) {

            if (index > 0) {
                await this.addEntity();
            }


            await this.enterEntityName(
                index,
                entities[index].entityName
            );
        }
    }


    // ============================================================
    // NAVIGATION
    // ============================================================

    async next(): Promise<void> {

        const button =
            this.nextButton();


        await expect(
            button
        ).toBeVisible();

        await expect(
            button
        ).toBeEnabled();


        await button.click();
    }


    async back(): Promise<void> {

        const button =
            this.backButton();


        await expect(
            button
        ).toBeVisible();

        await expect(
            button
        ).toBeEnabled();


        await button.click();
    }
}