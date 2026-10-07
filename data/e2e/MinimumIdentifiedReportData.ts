import { ReportData } from '../../models/public/ReportData';

export const MinimumIdentifiedReportData: ReportData = {
  reporter: {
    identityType: 'identified',
    firstName: 'Ahmed',
    lastName: 'Ali',
    company: 'Red Sea Global',
    department: 'Quality Assurance',
    position: 'QA Engineer',
    mobile: '0500000000',
    email: 'qa.automation@example.com'
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
