import { Page } from '@playwright/test';
import { resolveRoute, Routes } from '../../../config/urls';

import { ReporterInfoStep } from './steps/ReporterInfoStep';
import { ReportDetailsStep } from './steps/ReportDetailsStep';
import { PersonsInvolvedStep } from './steps/PersonsInvolvedStep';
import { EntitiesInvolvedStep } from './steps/EntitiesInvolvedStep';
import { PreviousReportingStep } from './steps/PreviousReportingStep';
import { EvidenceStep } from './steps/EvidenceStep';
import { DeclarationStep } from './steps/DeclarationStep';

export class SubmitReportPage {
  readonly reporterInfo: ReporterInfoStep;
  readonly reportDetails: ReportDetailsStep;
  readonly personsInvolved: PersonsInvolvedStep;
  readonly entitiesInvolved: EntitiesInvolvedStep;
  readonly previousReporting: PreviousReportingStep;
  readonly evidence: EvidenceStep;
  readonly declaration: DeclarationStep;

  constructor(private readonly page: Page) {
    this.reporterInfo =
      new ReporterInfoStep(page);

    this.reportDetails =
      new ReportDetailsStep(page);

    this.personsInvolved =
      new PersonsInvolvedStep(page);

    this.entitiesInvolved =
      new EntitiesInvolvedStep(page);

    this.previousReporting =
      new PreviousReportingStep(page);

    this.evidence =
      new EvidenceStep(page);

    this.declaration =
      new DeclarationStep(page);
  }

  async open(): Promise<void> {
    await this.page.goto(resolveRoute(Routes.public.home));
    await this.page.locator(`a[href$="${Routes.public.submitReport}"]`).first().click();
  }
}
