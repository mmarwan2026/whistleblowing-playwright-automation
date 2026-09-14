import { Page } from '@playwright/test';
import { AnonymousReportFlow } from './AnonymousReportFlow';
import { ReportData } from '../../models/public/ReportData';

export class IdentifiedReportFlow {
  constructor(private readonly page: Page) {}

  async submit(report: ReportData) {
    report.reporter.identityType = 'identified';
    return new AnonymousReportFlow(this.page).submit(report);
  }
}
