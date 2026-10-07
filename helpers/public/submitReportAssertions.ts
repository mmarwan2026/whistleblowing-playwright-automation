import { expect, Page } from '@playwright/test';
import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';

export interface SubmitReportResult {
  reference: string;
  pin?: string;
}

export async function submitAndValidate(
  page: Page,
  submit: SubmitReportPage,
  testId: string
): Promise<SubmitReportResult> {
  const responsePromise = page.waitForResponse(
    response =>
      response.request().method() === 'POST' &&
      response.url().includes('/portal/v1/registration/submit'),
    { timeout: 30000 }
  );

  await submit.declaration.submit();

  const response = await responsePromise;
  const status = response.status();

  expect(
    status,
    `${testId}: expected submission HTTP status >= 200`
  ).toBeGreaterThanOrEqual(200);

  expect(
    status,
    `${testId}: expected submission HTTP status < 300`
  ).toBeLessThan(300);

  const body = await response.json();

  expect(body.ok, `${testId}: Submit API should return ok=true`).toBe(true);
  expect(body.data, `${testId}: Submit API should return report data`).toBeTruthy();
  expect(
    body.data.reference,
    `${testId}: report reference must be generated`
  ).toMatch(/^RSG-\d{4}-\d+$/);

  await expect(
    page.getByRole('heading', {
      name: 'Declaration',
      level: 2
    })
  ).toBeHidden({ timeout: 30000 });

  await expect(
    page.getByText(
      'We could not save your application. Please try again.',
      { exact: true }
    )
  ).toBeHidden();

  console.log(`${testId} Report Reference:`, body.data.reference);

  return {
    reference: body.data.reference,
    pin: body.data.pin
  };
}
