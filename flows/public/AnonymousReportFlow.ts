import {
  Page
} from '@playwright/test';

import {
  ReportData
} from '../../models/public/ReportData';

import {
  SubmissionResult
} from '../../models/public/SubmissionResult';

import {
  SubmitReportPage
} from '../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../pages/public/ReportingNoticePage';

import {
  submitAndValidate
} from '../../helpers/public/submitReportAssertions';

export class AnonymousReportFlow {

  private readonly submitPage:
    SubmitReportPage;

  private readonly noticePage:
    ReportingNoticePage;

  constructor(
    private readonly page: Page
  ) {

    this.submitPage =
      new SubmitReportPage(page);

    this.noticePage =
      new ReportingNoticePage(page);

  }


  // ==========================================================
  // SUBMIT ANONYMOUS REPORT
  // ==========================================================

  async submit(
    report: ReportData
  ): Promise<SubmissionResult> {

    // ========================================================
    // STEP 0 - REPORTING NOTICE
    // ========================================================

    await this.submitPage
      .open();

    await this.noticePage
      .verifyLoaded();

    await this.noticePage
      .next();


    // ========================================================
    // STEP 1 - REPORTER INFO
    // ========================================================

    await this.submitPage
      .reporterInfo
      .verifyLoaded();

    await this.submitPage
      .reporterInfo
      .fill(
        report.reporter
      );

    await this.submitPage
      .reporterInfo
      .next();


    // ========================================================
    // STEP 2 - REPORT DETAILS
    // ========================================================

    await this.submitPage.reportDetails.verifyLoaded();

    const reportDetails = report.reportDetails ?? {
      category: `Conflict of Interest-${report.classification.category}`,
      incidentDescription: report.allegation.whatHappened,
      policyReference: report.allegation.rulePolicyLaw,
      awarenessMethod: report.allegation.awarenessMethod,
      location: report.allegation.incidentLocation,
      incidentDate: report.allegation.incidentDate ?? '2026-01-01',
      ongoing: report.allegation.ongoing ?? 'Unknown'
    };

    await this.submitPage.reportDetails.fill(reportDetails);
    await this.submitPage.reportDetails.next();


    // ========================================================
    // STEP 4 - PERSON(S) INVOLVED
    // ========================================================

    await this.submitPage
      .personsInvolved
      .verifyLoaded();

    await this.submitPage
      .personsInvolved
      .fill(
        report.personsInvolved
      );

    await this.submitPage
      .personsInvolved
      .next();


    // ========================================================
    // STEP 5 - ENTITIES INVOLVED
    // ========================================================

    await this.submitPage.entitiesInvolved
      .verifyLoaded();

    await this.submitPage.entitiesInvolved
      .fill(
        report.entitiesInvolved
      );

    await this.submitPage.entitiesInvolved
      .next();


    // ========================================================
    // STEP 7 - PREVIOUS REPORTING
    // ========================================================

    await this.submitPage
      .previousReporting
      .verifyLoaded();

    await this.submitPage
      .previousReporting
      .fill(
        report.previousReporting
      );

    await this.submitPage
      .previousReporting
      .next();


    // ========================================================
    // STEP 8 - EVIDENCE
    // ========================================================

    await this.submitPage
      .evidence
      .verifyLoaded();

    await this.submitPage
      .evidence
      .fill(
        report.evidence
      );

    await this.submitPage
      .evidence
      .next();


    // ========================================================
    // STEP 9 - DECLARATION
    // ========================================================

    await this.submitPage
      .declaration
      .verifyLoaded();

    await this.fillDeclaration(
      report
    );


    // ========================================================
    // STEP 10 - SUBMIT + VALIDATE
    // ========================================================

    const result =
      await submitAndValidate(
        this.page,
        this.submitPage,
        'E2E-004'
      );


    // ========================================================
    // STEP 11 - ANONYMOUS ACCESS CREDENTIAL VALIDATION
    // ========================================================

    const referenceNumber =
      result.reference;

    const pin =
      result.pin;

    if (!referenceNumber) {
      throw new Error(
        'Anonymous report submission succeeded but no reference number was returned.'
      );
    }

    if (!pin) {
      throw new Error(
        'Anonymous report submission succeeded but no access PIN was returned.'
      );
    }

    // Never log the PIN or complete submission response.

    return {
      referenceNumber,
      pin
    };
  }


  // ==========================================================
  // DECLARATION
  // ==========================================================

  private async fillDeclaration(
    report: ReportData
  ): Promise<void> {

    const {
      accurateInformation,
      confidentialityAcknowledged
    } =
      report.declaration;

    if (
      !accurateInformation ||
      !confidentialityAcknowledged
    ) {
      throw new Error(
        'AnonymousReportFlow requires the declaration acknowledgement to be accepted.'
      );
    }

    await this.submitPage
      .declaration
      .acceptAllAcknowledgements();
  }
}
