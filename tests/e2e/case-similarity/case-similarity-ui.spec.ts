import { expect, Page, test } from '@playwright/test';

import { LoginFlow } from '../../../flows/staff/LoginFlow';
import { CaseSimilarityPage } from '../../../pages/staff/case-similarity/CaseSimilarityPage';

async function openAssignedCaseSimilarity(page: Page): Promise<CaseSimilarityPage> {
    const username = process.env.LEAD_INVESTIGATOR_USERNAME;
    const password = process.env.LEAD_INVESTIGATOR_PASSWORD;

    expect(username, 'LEAD_INVESTIGATOR_USERNAME must be configured').toBeTruthy();
    expect(password, 'LEAD_INVESTIGATOR_PASSWORD must be configured').toBeTruthy();

    await new LoginFlow(page).login(username!, password!);
    await page.getByRole('link', { name: 'My Workspace' }).click();

    const workspaceSearch = page.getByRole('textbox', { name: 'Search...' });
    await expect(workspaceSearch).toBeVisible();

    const row = page.getByRole('row')
        .filter({ hasText: 'AAPA Preparation' })
        .filter({ hasText: /REP-\d+/ })
        .filter({ hasNotText: /Completed|Done/i })
        .first();
    await expect(row, 'An active, non-completed AAPA Preparation task should be visible').toBeVisible();
    await row.getByRole('button', { name: 'Open Task' }).click();

    await expect(
        page.getByText('Update AAPA Preparation', { exact: true }),
        'Assigned AAPA Preparation task should open'
    ).toBeVisible({ timeout: 20_000 });

    const similarity = new CaseSimilarityPage(page);
    await similarity.open();
    return similarity;
}

test.describe('Case Similarity UI coverage @e2e @staff @case-similarity', () => {
    test('CASE-SIM-UI-001 | Assigned lead investigator can open Case Similarity', async ({ page }) => {
        const similarity = await openAssignedCaseSimilarity(page);
        await expect(page.getByRole('tab', { name: 'Case Similarity', exact: true }))
            .toHaveAttribute('aria-selected', 'true');
        await expect(
            page.getByRole('tabpanel')
                .filter({ hasText: 'Case Similarity' })
                .getByPlaceholder('Search...')
        ).toBeVisible();
        expect(similarity).toBeTruthy();
    });

    test('CASE-SIM-UI-002 | Matching Case Number displays a valid similarity result', async ({ page }) => {
        const similarity = await openAssignedCaseSimilarity(page);
        const baseCaseNumber = await similarity.getFirstResultReference();
        const result = await similarity.searchAndGetResult(baseCaseNumber);

        expect(result.reference).toContain(baseCaseNumber);
        expect(result.personMatch).not.toBe('');
        expect(result.matchType).not.toBe('');
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
        expect(result.level).not.toBe('');
    });

    test('CASE-SIM-UI-003 | Unknown Case Number returns no similarity row', async ({ page }) => {
        const similarity = await openAssignedCaseSimilarity(page);
        await similarity.searchWithoutResult('REP-000000');
    });
});
