import { expect, test } from '@playwright/test';

import { submitAndValidate } from '../../../helpers/public/submitReportAssertions';
import { SubmitReportPage } from '../../../pages/public/submit-report/SubmitReportPage';

test.describe('submitAndValidate', () => {
  test('returns the generated reference and access code from a successful submission response', async ({ page }) => {
    await page.setContent(`
      <h2>Declaration</h2>
      <p>Submission complete</p>
      <p class="save-error" hidden>We could not save your application. Please try again.</p>
    `);

    await page.route('**/portal/v1/registration/submit', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          data: {
            reference: 'Ab12-cD34-Ef56',
            pin: '123456'
          }
        })
      });
    });

    const submit = {
      declaration: {
        submit: async () => {
          await page.evaluate(() => {
            void fetch('https://mocked-aura.test/portal/v1/registration/submit', { method: 'POST' });
            document.querySelector('h2')?.remove();
          });
        }
      }
    } as unknown as SubmitReportPage;

    await expect(
      await submitAndValidate(page, submit, 'UNIT-SUBMIT')
    ).toEqual({
      reference: 'Ab12-cD34-Ef56',
      pin: '123456'
    });
  });
});
