import { Page } from '@playwright/test';
import { ReportData } from '../../models/public/ReportData';
import { SubmissionResult } from '../../models/public/SubmissionResult';
import { SubmitReportPage } from '../../pages/public/submit-report/SubmitReportPage';
import { SubmissionSuccessPage } from '../../pages/public/submit-report/SubmissionSuccessPage';

export class AnonymousReportFlow {
  private readonly submitPage: SubmitReportPage;
  private readonly successPage: SubmissionSuccessPage;

  constructor(private readonly page: Page) {
    this.submitPage = new SubmitReportPage(page);
    this.successPage = new SubmissionSuccessPage(page);
  }

  async submit(report: ReportData): Promise<SubmissionResult> {
    await this.submitPage.open();

    await this.submitPage.reporterInfo.fill(report.reporter);
    await this.submitPage.reporterInfo.next();

    await this.submitPage.classification.fill(report.classification);
    await this.submitPage.classification.next();

    await this.submitPage.allegation.fill(report.allegation);
    await this.submitPage.allegation.next();

    for (const person of report.personsInvolved) {
      await this.submitPage.personsInvolved.add(person);
    }
    await this.submitPage.personsInvolved.next();

    for (const witness of report.witnesses) {
      await this.submitPage.witnesses.add(witness);
    }
    await this.submitPage.witnesses.next();

    await this.submitPage.evidence.fill(report.evidence);
    await this.submitPage.evidence.next();

    await this.submitPage.previousReporting.fill(report.previousReporting);
    await this.submitPage.previousReporting.next();

    await this.submitPage.declaration.fill(report.declaration);
    await this.submitPage.declaration.submit();

    await this.successPage.expectSuccess();
    return this.successPage.getResult();
  }
}
