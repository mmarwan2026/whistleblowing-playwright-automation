import { ReportData } from '../../models/public/ReportData';

export const MinimumAnonymousReportData: ReportData = {
  reporter: {
    identityType: 'anonymous',
    reporterCategory: 'Employee'
  },
  classification: {
    internalAuditAnswer: 'No',
    category: 'Nepotism/Cronyism',
  },
  allegation: {
    incidentTitle: 'Potential conflict of interest',
    whatHappened:
      'An employee may have participated in a decision involving a related party.',
    awarenessMethod:
      'I became aware through internal business communication.',
    knowsExactDate: 'No',
    incidentDateDescription: 'September 2026',
    ongoing: 'No'
  },
  reportDetails: {
    category: 'Conflict of Interest-Nepotism/Cronyism',
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
  witnesses: { hasWitnesses: 'No' },
  evidence: { hasSupportingEvidence: 'No' },
  previousReporting: { previouslyReported: 'No' },
  declaration: {
    accurateInformation: true,
    confidentialityAcknowledged: true
  }
};
