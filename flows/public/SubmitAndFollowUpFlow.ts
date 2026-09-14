import { Browser } from '@playwright/test';
import { ReportData } from '../../models/public/ReportData';
import { AnonymousReportFlow } from './AnonymousReportFlow';
import { FollowUpFlow } from './FollowUpFlow';

export class SubmitAndFollowUpFlow {
  constructor(private readonly browser: Browser) {}

  async run(report: ReportData) {
    const submitContext = await this.browser.newContext();
    const submitPage = await submitContext.newPage();

    const result = await new AnonymousReportFlow(submitPage).submit(report);
    await submitContext.close();

    const followUpContext = await this.browser.newContext();
    const followUpPage = await followUpContext.newPage();

    const followUp = new FollowUpFlow(followUpPage);
    await followUp.accessCase(result);

    return { result, followUpContext, followUpPage };
  }
}
