import { expect, Page, test } from '@playwright/test';
import path from 'path';
import { openIntakeStep } from './support/openIntakeStep';

async function openEvidence(page: Page) {
  return openIntakeStep(page, 'evidence');
}

const pdf = path.resolve(process.cwd(), 'test-data', 'files', 'validevidence.pdf');

test.describe('Evidence @public @intake', () => {
  test('TC-055 | User can continue without supporting evidence @smoke @public @intake', async ({ page }) => {
    const submit = await openEvidence(page); await submit.evidence.fill({ hasSupportingEvidence: 'No' }); await submit.evidence.next(); await submit.declaration.verifyLoaded();
  });
  test('TC-057 | User can upload one supported PDF evidence file @smoke @public @intake', async ({ page }) => {
    const submit = await openEvidence(page); await submit.evidence.fill({ hasSupportingEvidence: 'Yes', filePaths: [pdf], fileDescriptions: ['Synthetic evidence upload.'] }); await submit.evidence.verifyFileUploaded('validevidence.pdf'); await expect(page.locator('textarea[placeholder*="Please clearly indicate"]')).toHaveValue('Synthetic evidence upload.');
  });
  test('TC-060 | User can remove uploaded evidence before submission @regression @public @intake', async ({ page }) => {
    const submit = await openEvidence(page); await submit.evidence.fill({ hasSupportingEvidence: 'Yes', filePaths: [pdf] }); await submit.evidence.verifyFileUploaded('validevidence.pdf'); await submit.evidence.removeFile('validevidence.pdf'); await submit.evidence.verifyFileNotPresent('validevidence.pdf');
  });
  test('TC-062 | Evidence choice persists after Back navigation @regression @navigation @public @intake', async ({ page }) => {
    const submit = await openEvidence(page); await submit.evidence.fill({ hasSupportingEvidence: 'No' }); await submit.evidence.next(); await submit.declaration.back(); await expect(page.getByRole('heading', { name: 'Evidence', level: 2 })).toBeVisible(); await expect(page.getByRole('checkbox', { name: "I don't have any documents to upload" })).toBeChecked();
  });
});
