import {
  expect,
  Page,
  Response
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

    await this.submitPage.open();

    await this.noticePage.verifyLoaded();

    await this.noticePage.next();

    // ========================================================
    // STEP 1 - REPORTER INFO
    // ========================================================

    await this.submitPage
      .reporterInfo
      .verifyLoaded();

    await this.submitPage
      .reporterInfo
      .fill(report.reporter);

    await this.submitPage
      .reporterInfo
      .next();

    // ========================================================
    // STEP 2 - CLASSIFICATION
    // ========================================================

    await this.submitPage
      .classification
      .verifyLoaded();

    await this.submitPage
      .classification
      .fill(report.classification);

    await this.submitPage
      .classification
      .next();

    // ========================================================
    // STEP 3 - ALLEGATION
    // ========================================================

    await this.submitPage
      .allegation
      .verifyLoaded();

    await this.submitPage
      .allegation
      .fill(report.allegation);

    await this.submitPage
      .allegation
      .next();

    // ========================================================
    // STEP 4 - PERSON(S) INVOLVED
    // ========================================================

    await this.submitPage
      .personsInvolved
      .verifyLoaded();

    await this.submitPage
      .personsInvolved
      .fill(report.personsInvolved);

    await this.submitPage
      .personsInvolved
      .next();

    // ========================================================
    // STEP 5 - WITNESSES
    // ========================================================

    await this.submitPage
      .witnesses
      .verifyLoaded();

    await this.submitPage
      .witnesses
      .fill(report.witnesses);

    await this.submitPage
      .witnesses
      .next();

    // ========================================================
    // STEP 6 - EVIDENCE
    // ========================================================

    await this.submitPage
      .evidence
      .verifyLoaded();

    await this.submitPage
      .evidence
      .fill(report.evidence);

    await this.submitPage
      .evidence
      .next();

    // ========================================================
    // STEP 7 - PREVIOUS REPORTING
    // ========================================================

    await this.submitPage
      .previousReporting
      .verifyLoaded();

    await this.fillPreviousReporting(
      report
    );

    await this.submitPage
      .previousReporting
      .next();

    // ========================================================
    // STEP 8 - DECLARATION
    // ========================================================

    await this.submitPage
      .declaration
      .verifyLoaded();

    await this.fillDeclaration(
      report
    );

    await this.submitPage
      .declaration
      .verifyBothAcknowledgementsChecked();

    // ========================================================
    // WAIT FOR SUBMIT API
    //
    // Listener MUST be registered before Submit.
    // ========================================================

    const responsePromise =
      this.page.waitForResponse(
        response =>
          response.request().method() === 'POST' &&
          response.url().includes(
            '/portal/v1/registration/submit'
          ),
        {
          timeout: 30000
        }
      );

    // ========================================================
    // SUBMIT
    // ========================================================

    await this.submitPage
      .declaration
      .submit();

    const response =
      await responsePromise;

    // ========================================================
    // VALIDATE RESPONSE
    // ========================================================

    await this.verifySuccessfulSubmission(
      response
    );

    const responseBody =
      await response.json();

    const referenceNumber =
      responseBody.data.reference;

    const pin =
      responseBody.data.pin;

    expect(
      referenceNumber,
      'Anonymous report must return a reference number'
    ).toBeTruthy();

    expect(
      referenceNumber,
      'Generated reference should follow RSG-YYYY-number format'
    ).toMatch(
      /^RSG-\d{4}-\d+$/
    );

    expect(
      pin,
      'Anonymous report must return an access PIN'
    ).toBeTruthy();

    // IMPORTANT:
    // Never log the PIN or complete API response.

    return {
      referenceNumber,
      pin
    };
  }

  // ==========================================================
  // PREVIOUS REPORTING
  // ==========================================================

  private async fillPreviousReporting(
    report: ReportData
  ) {

    const data =
      report.previousReporting;

    await this.submitPage
      .previousReporting
      .selectPreviouslyReported(
        data.previouslyReported
      );

    // E2E-004 currently uses the minimum anonymous flow:
    // previouslyReported = No.
    //
    // More complex previous-reporting branches remain covered
    // by their dedicated tests and full-report E2E.
  }

  // ==========================================================
  // DECLARATION
  // ==========================================================

  private async fillDeclaration(
    report: ReportData
  ) {

    if (
      report.declaration.accurateInformation &&
      report.declaration.confidentialityAcknowledged
    ) {

      await this.submitPage
        .declaration
        .acceptAllAcknowledgements();

      return;
    }

    throw new Error(
      'AnonymousReportFlow requires both declaration acknowledgements to be accepted.'
    );
  }

  // ==========================================================
  // SUBMIT RESPONSE VALIDATION
  // ==========================================================

  private async verifySuccessfulSubmission(
    response: Response
  ) {

    const status =
      response.status();

    expect(
      status,
      `Expected anonymous report submission to succeed but received HTTP ${status}`
    ).toBeGreaterThanOrEqual(200);

    expect(
      status,
      `Expected anonymous report submission to succeed but received HTTP ${status}`
    ).toBeLessThan(300);
  }
}