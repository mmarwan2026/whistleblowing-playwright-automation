import { Page } from '@playwright/test';
import { Routes } from '../../../config/urls';
import { ReporterInfoStep } from './steps/ReporterInfoStep';
import { ClassificationStep } from './steps/ClassificationStep';
import { AllegationStep } from './steps/AllegationStep';
import { PersonsInvolvedStep } from './steps/PersonsInvolvedStep';
import { WitnessesStep } from './steps/WitnessesStep';
import { EvidenceStep } from './steps/EvidenceStep';
import { PreviousReportingStep } from './steps/PreviousReportingStep';
import { DeclarationStep } from './steps/DeclarationStep';

export class SubmitReportPage {
  readonly reporterInfo: ReporterInfoStep;
  readonly classification: ClassificationStep;
  readonly allegation: AllegationStep;
  readonly personsInvolved: PersonsInvolvedStep;
  readonly witnesses: WitnessesStep;
  readonly evidence: EvidenceStep;
  readonly previousReporting: PreviousReportingStep;
  readonly declaration: DeclarationStep;

  constructor(private readonly page: Page) {
    this.reporterInfo = new ReporterInfoStep(page);
    this.classification = new ClassificationStep(page);
    this.allegation = new AllegationStep(page);
    this.personsInvolved = new PersonsInvolvedStep(page);
    this.witnesses = new WitnessesStep(page);
    this.evidence = new EvidenceStep(page);
    this.previousReporting = new PreviousReportingStep(page);
    this.declaration = new DeclarationStep(page);
  }

  async open() {
    await this.page.goto(Routes.public.submitReport);
  }
}
