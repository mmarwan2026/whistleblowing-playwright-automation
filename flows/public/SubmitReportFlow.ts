import { Page } from '@playwright/test';

import {
  SubmitReportPage
} from '../../pages/public/submit-report/SubmitReportPage';

import {
  ReportingNoticePage
} from '../../pages/public/ReportingNoticePage';

export type SubmitReportTargetStep =
  | 'reporterInfo'
  | 'reportDetails'
  | 'classification'
  | 'allegation'
  | 'personsInvolved'
  | 'entitiesInvolved'
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
      firstName: 'Synthetic',
      lastName: 'Reporter',
      company: 'Synthetic Test Company',
      department: 'Synthetic Quality Assurance',
      position: 'Synthetic QA Engineer',
      mobile: '+966500000002',
      email: 'flow.reporter@example.test'
    });

    await this.submit.reporterInfo.next();
    await this.submit.reportDetails.verifyLoaded();
  }

  async completeValidClassification(): Promise<void> {
    await this.submit.reportDetails.verifyLoaded();
    await this.submit.reportDetails.fill({
      category: 'Conflict of Interest-Nepotism/Cronyism',
      incidentDescription: 'Synthetic flow validation report.',
      policyReference: 'Synthetic policy reference',
      awarenessMethod: 'Synthetic automation validation.',
      location: 'Synthetic test location',
      incidentDate: '2026-01-01',
      ongoing: 'No'
    });
    await this.submit.reportDetails.next();
  }

  async completeValidAllegation(): Promise<void> {
    await this.submit.personsInvolved.verifyLoaded();
  }

  async completeValidPersonsInvolved(): Promise<void> {
    await this.submit.personsInvolved.verifyLoaded();

    await this.submit.personsInvolved.fill({
      canIdentify: 'Yes',
      persons: [
        {
          fullName: 'Synthetic Involved Person',
          position: 'Synthetic Manager',
          company: 'Synthetic Test Company',
          department: 'Synthetic Department',
          email: 'involved.person@example.test',
          phone: '0500000003',
          roleInIncident: 'Victim'
        }
      ]
    });

    await this.submit.personsInvolved.next();
    await this.submit.entitiesInvolved.verifyLoaded();
  }

  async completeValidEntitiesInvolved(): Promise<void> {
    await this.submit.entitiesInvolved.verifyLoaded();
    await this.submit.entitiesInvolved.fill({ canIdentify: 'No' });
    await this.submit.entitiesInvolved.next();
    await this.submit.previousReporting.verifyLoaded();
  }

  async completeValidWitnesses(): Promise<void> {
    // Witnesses are now represented by the Person(s) Involved grid.
    await this.completeValidEntitiesInvolved();
    await this.submit.evidence.verifyLoaded();
  }

  async completeValidEvidence(): Promise<void> {
    await this.submit.evidence.verifyLoaded();
    await this.submit.evidence.selectEvidenceAnswer('No');
    await this.submit.evidence.next();
    await this.submit.declaration.verifyLoaded();
  }

  async goTo(
    target: SubmitReportTargetStep
  ): Promise<void> {
    await this.start();

    if (target === 'reporterInfo') return;

    await this.completeValidReporterInfo();

    if (target === 'reportDetails' || target === 'classification') return;

    await this.completeValidClassification();

    if (target === 'allegation') return;

    await this.completeValidAllegation();

    if (target === 'personsInvolved') return;

    await this.completeValidPersonsInvolved();

    if (target === 'entitiesInvolved') return;

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
