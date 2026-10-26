import {
  expect,
  Page
} from '@playwright/test';

import {
  basename
} from 'node:path';

import type {
  ReportData
} from '../../../models/public/ReportData';

export class FollowUpCasePage {

  constructor(
    private readonly page: Page
  ) { }

  // ==========================================================
  // VERIFY CASE PAGE LOADED
  // ==========================================================

  async expectLoaded(): Promise<void> {

    await expect(
      this.page.getByRole('heading', {
        name: 'Your Report',
        level: 1
      })
    ).toBeVisible();

    await expect(
      this.page.getByText(
        'Credentials accepted.',
        {
          exact: false
        }
      )
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', {
        name: 'View Report',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', {
        name: 'Mailbox',
        exact: true
      })
    ).toBeVisible();

    await expect(
      this.page.getByRole('button', {
        name: 'Attachments History',
        exact: true
      })
    ).toBeVisible();

    await this.expectSecureMailboxVisible();
  }

  // ==========================================================
  // VERIFY REFERENCE NUMBER
  // ==========================================================

  async expectReferenceNumber(
    referenceNumber: string
  ): Promise<void> {

    await expect(
      this.page.getByText(
        referenceNumber,
        {
          exact: true
        }
      )
    ).toBeVisible();
  }

  // ==========================================================
  // OPEN REPORT VIEW
  // ==========================================================

  async viewReport(): Promise<void> {

    const viewReportButton =
      this.page.getByRole('button', {
        name: 'View Report',
        exact: true
      });

    await expect(
      viewReportButton
    ).toBeVisible();

    await expect(
      viewReportButton
    ).toBeEnabled();

    await viewReportButton.click();
  }

  // ==========================================================
  // VERIFY SUBMITTED REPORT DATA
  // ==========================================================

  async expectSubmittedReport(
    report: Omit<ReportData, 'declaration'>
  ): Promise<void> {

    await this.viewReport();

    const reportView =
      this.page.locator('body');

    await expect(
      reportView,
      'View Report should finish loading before values are compared'
    ).not.toContainText('Opening the report…', { timeout: 30_000 });

    const expectedValues = [
      ['Reporter category', report.reporter.reporterCategory],
      ['Reporter first name', report.reporter.firstName],
      ['Reporter last name', report.reporter.lastName],
      ['Reporter company', report.reporter.company],
      ['Reporter department', report.reporter.department],
      ['Reporter position', report.reporter.position],
      ['Reporter mobile', report.reporter.mobile],
      ['Reporter email', report.reporter.email],
      ['Report category', report.reportDetails.category],
      ['Incident description', report.reportDetails.incidentDescription],
      ['Policy reference', report.reportDetails.policyReference],
      ['Awareness method', report.reportDetails.awarenessMethod],
      ['Incident location', report.reportDetails.location],
      ['Incident date', report.reportDetails.incidentDate],
      ...(report.personsInvolved.persons ?? []).flatMap(person => [
        ['Person full name', person.fullName],
        ['Person position', person.position],
        ['Person company', person.company],
        ['Person department', person.department],
        ['Person email', person.email],
        ['Person phone', person.phone],
        ['Person role', person.roleInIncident]
      ]),
      ...(report.entitiesInvolved.entities ?? []).map(entity => ['Entity name', entity.entityName]),
      ...(report.evidence.filePaths ?? []).map(filePath => ['Evidence file', basename(filePath)]),
      ...(report.evidence.fileDescriptions ?? []).map(description => ['Evidence description', description]),
      ['Previously reported', report.previousReporting.previouslyReported],
      [
        'Previous reporting branch',
        report.previousReporting.reportingChannel === 'platform'
          ? 'Yes, through the whistleblowing platform'
          : report.previousReporting.reportingChannel === 'anotherChannel'
            ? 'Yes, through Another reporting channel'
            : undefined
      ],
      ['Previous reporting channel type', report.previousReporting.reportingChannelType],
      ['Previous report receiving department', report.previousReporting.reportedToDepartment],
      ['Previous report relevant information', report.previousReporting.relevantInfo],
      ['Previous report outcome', report.previousReporting.outcomeIfKnown],
      ['Previous reporter first name', report.previousReporting.firstName],
      ['Previous reporter last name', report.previousReporting.lastName],
      ['Previous reporter position/department', report.previousReporting.positionDepartment],
      ['Previous reporter company', report.previousReporting.previousReporterCompany],
      ['Previous reporter department', report.previousReporting.previousReporterDepartment],
      ['Previous report exact date flag', report.previousReporting.knowsExactDate],
      ['Previous report date', report.previousReporting.reportingDate],
      ['Previous report date description', report.previousReporting.dateDescription]
    ].filter((entry): entry is [string, string] => Boolean(entry[1]));

    const actualReportText = await reportView.innerText();
    const normalizedActualReportText = actualReportText.replace(/\s+/g, ' ').trim();

    const ongoingAnswer = normalizedActualReportText.match(
      /Is the Reported Matter Still Ongoing\?\s*(Not provided|Unknown|Yes|No)/i
    )?.[1] ?? 'Not found';

    if (ongoingAnswer.toLowerCase() !== report.reportDetails.ongoing.toLowerCase()) {
      const referenceNumber = normalizedActualReportText.match(
        /REFERENCE NUMBER\s+([^\s]+)/i
      )?.[1] ?? 'unknown';

      console.error(
        `[View Report][BUG] Ongoing answer mismatch | reference="${referenceNumber}" | ` +
        `expected="${report.reportDetails.ongoing}" | actual="${ongoingAnswer}"`
      );
    } else {
      console.log(`[View Report] PASS | Ongoing status | expected="${report.reportDetails.ongoing}"`);
    }

    await expect(
      ongoingAnswer,
      `View Report Ongoing answer should match the submitted value for the report`
    ).toBe(report.reportDetails.ongoing);

    console.log(`[View Report] Comparing ${expectedValues.length} submitted values.`);

    for (const [label, expectedValue] of expectedValues) {
      const isPresent = normalizedActualReportText.includes(expectedValue);

      if (isPresent) {
        console.log(`[View Report] PASS | ${label} | expected="${expectedValue}"`);
      } else {
        console.error(
          `[View Report] FAIL | ${label} | expected="${expectedValue}" | actual report text does not contain this value. ` +
          `Actual report text: "${normalizedActualReportText}"`
        );
      }

      await expect(
        reportView,
        `View Report mismatch for ${label}: expected "${expectedValue}"`
      ).toContainText(expectedValue);
    }
  }

  // ==========================================================
  // VERIFY REPORT STATUS
  // ==========================================================

  async expectStatus(
    status: string
  ): Promise<void> {

    await expect(
      this.page.getByText(
        status,
        {
          exact: true
        }
      )
    ).toBeVisible();
  }

  // ==========================================================
  // VERIFY SECURE MAILBOX
  // ==========================================================

  async expectSecureMailboxVisible(): Promise<void> {

    await expect(
      this.page.getByRole('heading', {
        name: 'Secure Mailbox',
        level: 2
      })
    ).toBeVisible();
  }
}
