import type { Page } from '@playwright/test';
import { ReportDetailsFactory } from '../../../../data/factories/ReportDetailsFactory';
import { ReportingNoticePage } from '../../../../pages/public/ReportingNoticePage';
import { SubmitReportPage } from '../../../../pages/public/submit-report/SubmitReportPage';

type IntakeStep =
  | 'reporterInfo'
  | 'reportDetails'
  | 'personsInvolved'
  | 'entitiesInvolved'
  | 'previousReporting'
  | 'evidence'
  | 'declaration';

export async function openIntakeStep(page: Page, step: IntakeStep): Promise<SubmitReportPage> {
  const submit = new SubmitReportPage(page);
  const notice = new ReportingNoticePage(page);
  await submit.open();
  await notice.verifyLoaded();
  await notice.next();
  await submit.reporterInfo.verifyLoaded();
  if (step === 'reporterInfo') return submit;

  await submit.reporterInfo.fill({ identityType: 'anonymous', reporterCategory: 'Employee' });
  await submit.reporterInfo.next();
  await submit.reportDetails.verifyLoaded();
  if (step === 'reportDetails') return submit;

  await submit.reportDetails.fill(ReportDetailsFactory.default());
  await submit.reportDetails.next();
  await submit.personsInvolved.verifyLoaded();
  if (step === 'personsInvolved') return submit;

  await submit.personsInvolved.fill({ canIdentify: 'No' });
  await submit.personsInvolved.next();
  await submit.entitiesInvolved.verifyLoaded();
  if (step === 'entitiesInvolved') return submit;

  await submit.entitiesInvolved.fill({ canIdentify: 'No' });
  await submit.entitiesInvolved.next();
  await submit.previousReporting.verifyLoaded();
  if (step === 'previousReporting') return submit;

  await submit.previousReporting.fill({ previouslyReported: 'No' });
  await submit.previousReporting.next();
  await submit.evidence.verifyLoaded();
  if (step === 'evidence') return submit;

  await submit.evidence.fill({ hasSupportingEvidence: 'No' });
  await submit.evidence.next();
  await submit.declaration.verifyLoaded();
  return submit;
}
