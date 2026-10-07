import { expect, Locator, Page } from '@playwright/test';

export interface SimilarityResult {
    reference: string;
    personMatch: string;
    matchType: string;
    currentPerson: string;
    matchedPerson: string;
    score: number;
    level: string;
}

export class CaseSimilarityPage {
    constructor(private readonly page: Page) { }

    /**
     * Case Similarity tab
     */
    private get tab(): Locator {
        return this.page.getByRole('tab', {
            name: 'Case Similarity',
            exact: true
        });
    }

    /**
     * Case Similarity tab panel
     *
     * Based on the current UI/codegen:
     * tabpanel contains:
     * "Case Similarity: Similarity ..."
     */
    private get panel(): Locator {
        return this.page
            .getByRole('tabpanel')
            .filter({
                hasText: 'Case Similarity'
            });
    }

    /**
     * Search input inside Case Similarity only.
     *
     * Scoping to panel is important because other pages/tabs
     * may also contain a Search input.
     */
    private get searchInput(): Locator {
        return this.panel.getByPlaceholder('Search...');
    }

    /**
     * Open Case Similarity tab.
     */
    async open(): Promise<void> {
        await expect(
            this.tab,
            'Case Similarity tab should be visible'
        ).toBeVisible();

        await this.tab.click();

        await expect(
            this.panel,
            'Case Similarity panel should be visible'
        ).toBeVisible();

        await expect(
            this.searchInput,
            'Case Similarity search should be visible'
        ).toBeVisible();
    }

    /**
     * Search using the complete report/case reference.
     *
     * Example:
     * REP-546
     *
     * Do not search only "546" because another row could contain
     * the same digits.
     */
    async search(reference: string): Promise<void> {
        await expect(
            this.searchInput,
            'Case Similarity search should be visible'
        ).toBeVisible();

        await this.searchInput.fill(reference);

        await expect(
            this.getResultRow(reference),
            `Similarity result ${reference} should be displayed`
        ).toBeVisible();
    }

    /**
     * Find the table row belonging to the requested reference.
     *
     * We intentionally scope the row to Case Similarity panel.
     */
    private getResultRow(reference: string): Locator {
        return this.panel
            .getByRole('row')
            .filter({
                hasText: reference
            })
            .first();
    }

    /**
     * Verify a specific similarity result exists.
     */
    async verifyResultExists(reference: string): Promise<void> {
        const row = this.getResultRow(reference);

        await expect(
            row,
            `Similarity result for ${reference} should be displayed`
        ).toBeVisible();
    }

    /**
     * Read the complete Case Similarity result.
     *
     * Current table structure:
     *
     * 0  Case ID
     * 1  Title
     * 2  Case Status
     * 3  Priority
     * 4  Submission Date
     * 5  Category
     * 6  Subcategory
     * 7  Involved Person Match
     * 8  Person Match Type
     * 9  Current Person
     * 10 Matched Person
     * 11 Similarity Score
     * 12 Similarity Level
     */
    async getResult(
        reference: string
    ): Promise<SimilarityResult> {
        const row = this.getResultRow(reference);

        await expect(
            row,
            `Similarity result for ${reference} should be displayed`
        ).toBeVisible();

        const cells = row.getByRole('cell');

        const cellCount = await cells.count();

        expect(
            cellCount,
            `Similarity row ${reference} should contain at least 13 cells`
        ).toBeGreaterThanOrEqual(13);

        const actualReference =
            (await cells.nth(0).innerText()).trim();

        const personMatch =
            (await cells.nth(7).innerText()).trim();

        const matchType =
            (await cells.nth(8).innerText()).trim();

        const currentPerson =
            (await cells.nth(9).innerText()).trim();

        const matchedPerson =
            (await cells.nth(10).innerText()).trim();

        const scoreText =
            (await cells.nth(11).innerText()).trim();

        const level =
            (await cells.nth(12).innerText()).trim();

        /**
         * Score may be displayed as:
         *
         * 85
         * 85%
         * 89.94
         * 89.94%
         */
        const normalizedScore = scoreText
            .replace('%', '')
            .trim();

        const score = Number(normalizedScore);

        expect(
            Number.isNaN(score),
            `Similarity score "${scoreText}" for ${reference} should be numeric`
        ).toBe(false);

        /**
         * Make sure we actually read the requested row.
         */
        expect(
            actualReference,
            `Unexpected Case ID returned for ${reference}`
        ).toContain(reference);

        return {
            reference: actualReference,
            personMatch,
            matchType,
            currentPerson,
            matchedPerson,
            score,
            level
        };
    }

    /**
     * Main reusable action:
     *
     * Search Base Report
     *       ↓
     * Find matching row
     *       ↓
     * Read similarity result
     */
    async searchAndGetResult(
        reference: string
    ): Promise<SimilarityResult> {
        await this.search(reference);

        return this.getResult(reference);
    }
}