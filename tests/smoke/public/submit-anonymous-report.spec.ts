import { test, expect } from '@playwright/test';
import { AnonymousReportFlow } from '../../../flows/public/AnonymousReportFlow';
import { ReportFactory } from '../../../data/factories/ReportFactory';

test('Submit anonymous report @smoke @public @intake',
async ({ page }) => {
  const result = await new AnonymousReportFlow(page)
    .submit(ReportFactory.anonymous());

  expect(result.referenceNumber).toBeTruthy();
  expect(result.pin).toBeTruthy();
});
