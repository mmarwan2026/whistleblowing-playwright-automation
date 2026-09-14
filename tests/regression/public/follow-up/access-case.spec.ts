import { test } from '@playwright/test';
import { AnonymousReportFlow } from '../../../../flows/public/AnonymousReportFlow';
import { FollowUpFlow } from '../../../../flows/public/FollowUpFlow';
import { ReportFactory } from '../../../../data/factories/ReportFactory';

test('Submitted case can be accessed using Reference + PIN @regression @followup',
async ({ browser }) => {
  const submitContext = await browser.newContext();
  const submitPage = await submitContext.newPage();

  const result = await new AnonymousReportFlow(submitPage)
    .submit(ReportFactory.anonymous());

  await submitContext.close();

  const followContext = await browser.newContext();
  const followPage = await followContext.newPage();

  await new FollowUpFlow(followPage).accessCase(result);

  await followContext.close();
});
