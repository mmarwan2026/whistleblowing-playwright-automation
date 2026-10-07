import { Page } from '@playwright/test';

import {
  SubmitReportPage
} from '../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../pages/public/ReportingNoticePage';

export type SubmitReportTargetStep =
  | 'reporterInfo'
  | 'classification'
  | 'allegation'
  | 'personsInvolved'
  | 'witnesses'
  | 'evidence'
  | 'previousReporting';

export class SubmitReportFlow {
  readonly submit: SubmitReportPage;
  readonly notice: ReportingNoticePage;

  constructor(private readonly page: Page) {
    this.submit = new SubmitReportPage(page);
    this.notice = new ReportingNoticePage(page);
  }

  async start(): Promise<void> {
    await this.submit.open();
    await this.notice.verifyLoaded();
    await this.notice.next();
    await this.submit.reporterInfo.verifyLoaded();
  }

  async completeValidReporterInfo(): Promise<void> {
    await this.submit.reporterInfo.verifyLoaded();

    await this.submit.reporterInfo.fill({
      identityType: 'identified',
      firstName: 'Mohamed',
      lastName: 'Marwan',
      company: 'Red Sea Global',
      department: 'Quality Assurance',
      position: 'QA Engineer',
      mobile: '01008898020',
      email: 'mmarwan@ntgclarity.com'
    });

    await this.submit.reporterInfo.next();
    await this.submit.classification.verifyLoaded();
  }

  async completeValidClassification(): Promise<void> {
    await this.submit.classification.verifyLoaded();
    await this.submit.classification.selectInternalAuditAnswer('No');
    await this.submit.classification.selectCategory(
      'Nepotism/Cronyism'
    );
    await this.submit.classification.next();
    await this.submit.allegation.verifyLoaded();
  }

  async completeValidAllegation(): Promise<void> {
    await this.submit.allegation.verifyLoaded();

    await this.submit.allegation.fill({
      incidentTitle: 'Potential procurement conflict of interest',
      whatHappened:
        'A procurement decision may have involved an employee with a personal relationship to a related party.',
      rulePolicyLaw: 'Conflict of Interest Policy',
      awarenessMethod:
        'I became aware through internal business communication and supporting documentation.',
      incidentLocation: 'Corporate Office',
      knowsExactDate: 'No',
      incidentDateDescription: 'September 2026',
      ongoing: 'No'
    });

    await this.submit.allegation.next();
    await this.submit.personsInvolved.verifyLoaded();
  }

  async completeValidPersonsInvolved(): Promise<void> {
    await this.submit.personsInvolved.verifyLoaded();

    await this.submit.personsInvolved.fill({
      canIdentify: 'Yes',
      persons: [
        {
          fullName: 'Ahmed Hassan',
          position: 'Procurement Manager',
          company: 'Red Sea Global',
          department: 'Procurement',
          email: 'ahmed.hassan@example.com',
          phone: '0501234567',
          roleInIncident: 'Victim'
        }
      ]
    });

    await this.submit.personsInvolved.next();
    await this.submit.witnesses.verifyLoaded();
  }

  async completeValidWitnesses(): Promise<void> {
    await this.submit.witnesses.verifyLoaded();

    await this.submit.witnesses.fill({
      hasWitnesses: 'No'
    });

    await this.submit.witnesses.next();
    await this.submit.evidence.verifyLoaded();
  }

  async completeValidEvidence(): Promise<void> {
    await this.submit.evidence.verifyLoaded();
    await this.submit.evidence.selectEvidenceAnswer('No');
    await this.submit.evidence.next();
    await this.submit.previousReporting.verifyLoaded();
  }

  async goTo(
    target: SubmitReportTargetStep
  ): Promise<void> {
    await this.start();

    if (target === 'reporterInfo') return;

    await this.completeValidReporterInfo();

    if (target === 'classification') return;

    await this.completeValidClassification();

    if (target === 'allegation') return;

    await this.completeValidAllegation();

    if (target === 'personsInvolved') return;

    await this.completeValidPersonsInvolved();

    if (target === 'witnesses') return;

    await this.completeValidWitnesses();

    if (target === 'evidence') return;

    await this.completeValidEvidence();

    if (target === 'previousReporting') return;

    throw new Error(
      `Unsupported Submit Report target step: ${String(target)}`
    );
  }
}
