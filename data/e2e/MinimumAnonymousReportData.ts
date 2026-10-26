import type { SubmissionReportData } from './SubmissionReportData';

export const MinimumAnonymousReportData: SubmissionReportData = {
  reporter: {
    identityType: 'anonymous',
    reporterCategory: 'Employee'
  },
  reportDetails: {
    category: 'Corruption-Conflict of interest - Commercial',
    incidentDescription:
      'A synthetic employee may have participated in a decision involving a related party.',
    awarenessMethod:
      'Observed directly during synthetic automation validation.',
    incidentDate: '2026-10-19',
    ongoing: 'No'
  },
  personsInvolved: { canIdentify: 'No' },
  entitiesInvolved: {
    canIdentify: 'No',
  },
  evidence: { hasSupportingEvidence: 'No' },
  previousReporting: { previouslyReported: 'No' }
};
