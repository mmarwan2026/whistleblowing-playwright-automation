import { test } from '@playwright/test';

import { MaxAnonymousReportData } from '../../data/e2e/MaxAnonymousReportData';
import { AnonymousReportFlow } from '../../flows/public/AnonymousReportFlow';

test('E2E-021 | Anonymous reporter can submit a report with maximum free-text input in every form @e2e @public @intake @boundary', async ({ page }) => {
  test.setTimeout(120_000);

  const result = await new AnonymousReportFlow(page)
    .submit(MaxAnonymousReportData, 'E2E-021');

  test.info().annotations.push({
    type: 'submission-reference',
    description: result.referenceNumber
  });
});


