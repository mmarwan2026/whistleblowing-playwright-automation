import { ReportData } from '../../models/public/ReportData';

export const MinimumIdentifiedReportData: ReportData = {
  reporter: {
    identityType: 'identified',
    firstName: 'Synthetic',
    lastName: 'Reporter',
    company: 'Synthetic Test Company',
    department: 'Synthetic Quality Assurance',
    position: 'Automation Tester',
    mobile: '+966500000000',
    email: 'synthetic.reporter@example.test'
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
    policyReference: 'Synthetic Conflict of Interest Policy',
    awarenessMethod:
      'Observed directly during synthetic automation validation.',
    location: 'Synthetic Test Site',
    incidentDate: '2026-10-19',
    ongoing: 'No'
  },
  personsInvolved: {
    canIdentify: 'Yes',
    persons: [
      {
        fullName: 'Synthetic Involved Person',
        position: 'Synthetic Position',
        company: 'Synthetic Test Company',
        department: 'Synthetic Department',
        roleInIncident: 'Alleged Perpetrator'
      }
    ]
  },
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
