import { ReportData } from '../../models/public/ReportData';

export const FullIdentifiedReportData: ReportData = {
  reporter: {
    identityType: 'identified',
    firstName: 'Synthetic',
    lastName: 'Identified Reporter',
    company: 'Synthetic Test Company',
    department: 'Synthetic Quality Assurance',
    position: 'Synthetic QA Engineer',
    mobile: '+966500000001',
    email: 'mmarwan@ntgclarity.com'
  },
  classification: {
    internalAuditAnswer: 'No',
    category: 'Nepotism/Cronyism',
  },
  allegation: {
    incidentTitle: 'Synthetic safety protocol concern',
    whatHappened:
      'Synthetic test data describes a safety protocol concern at a synthetic location.',
    rulePolicyLaw:
      'Synthetic Health and Safety Policy',
    awarenessMethod:
      'Observed during synthetic automation validation.',
    incidentLocation: 'Synthetic Test Site',
    knowsExactDate: 'No',
    incidentDateDescription: 'September 2026',
    ongoing: 'No'
  },
  reportDetails: {
    category: 'Health, Safety & Environment-Safety Protocol Breaches',
    incidentDescription: 'Synthetic test data describes a safety protocol concern at a synthetic location.',
    policyReference: 'Synthetic Health and Safety Policy',
    awarenessMethod: 'Observed during synthetic automation validation.',
    location: 'Synthetic Test Site',
    incidentDate: '2026-09-01',
    ongoing: 'No'
  },
  personsInvolved: {
    canIdentify: 'Yes',
    persons: [{
      fullName: 'Synthetic Involved Person',
      position: 'Synthetic Maintenance Supervisor',
      company: 'Synthetic Test Company',
      department: 'Synthetic Operations',
      email: 'involved.person@example.test',
      phone: '0500000004',
      roleInIncident: 'Victim'
    }]
  },
  entitiesInvolved: {
    canIdentify: 'Yes',

    entities: [
      {
        entityName: 'Synthetic Test Company',
      },
    ],
  },
  witnesses: {
    hasWitnesses: 'Yes',
    witnesses: [{
      firstName: 'Synthetic',
      lastName: 'Witness',
      position: 'Synthetic Safety Specialist',
      department: 'Synthetic Health and Safety',
      notes:
        'Synthetic witness notes for automation validation.'
    }]
  },
  evidence: {
    hasSupportingEvidence: 'Yes',
    filePaths: ['test-data/files/validevidence.pdf'],
    fileDescriptions: ['Synthetic supporting document for evidence-flow validation.']
  },
  previousReporting: {
    previouslyReported: 'Yes',
    hasSystemReference: 'No',
    relevantInfo: 'Synthetic previous-reporting information.',
    firstName: 'Synthetic',
    lastName: 'Previous Reporter',
    positionDepartment: 'Synthetic Health and Safety',
    knowsExactDate: 'No',
    dateDescription: 'August 2026'
  },
  declaration: {
    accurateInformation: true,
    confidentialityAcknowledged: true
  }
};
