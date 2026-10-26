import type { SubmissionReportData } from './SubmissionReportData';

const e2eReporterEmail = process.env.E2E_REPORTER_EMAIL;

if (!e2eReporterEmail) {
  throw new Error('E2E_REPORTER_EMAIL must be set to a real QA mailbox before running identified-report tests.');
}

export const FullIdentifiedReportData: SubmissionReportData = {
  reporter: {
    identityType: 'identified',
    firstName: 'Synthetic',
    lastName: 'Identified Reporter',
    company: 'Synthetic Test Company',
    department: 'Synthetic Quality Assurance',
    position: 'Synthetic QA Engineer',
    mobile: '+966500000001',
    mobileCountryCode: '+966',
    email: e2eReporterEmail
  },
  reportDetails: {
    category: 'Corruption-Conflict of interest - Commercial',
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
  evidence: {
    hasSupportingEvidence: 'Yes',
    filePaths: ['test-data/files/validevidence.pdf'],
    fileDescriptions: ['Synthetic supporting document for evidence-flow validation.']
  },
  previousReporting: {
    previouslyReported: 'Yes',
    reportingChannel: 'platform',
    hasSystemReference: 'No',
    reportingDate: '2026-08-01'
  }
};

export const FullIdentifiedAnotherChannelReportData: SubmissionReportData = {
  ...FullIdentifiedReportData,
  previousReporting: {
    previouslyReported: 'Yes',
    reportingChannel: 'anotherChannel',
    reportingChannelType: 'Email',
    reportedToDepartment: 'Synthetic Compliance',
    hasSystemReference: 'Yes',
    referenceNumber: 'SYN1-PRV2-001A',
    outcomeIfKnown: 'Synthetic review completed with corrective action tracked.',
    firstName: 'Synthetic Previous',
    lastName: 'Reporter',
    positionDepartment: 'Synthetic Compliance',
    previousReporterCompany: 'Synthetic Previous Company',
    previousReporterDepartment: 'Synthetic Compliance'
  }
};

export const FullIdentifiedFirstTimeReportData: SubmissionReportData = {
  ...FullIdentifiedReportData,
  previousReporting: {
    previouslyReported: 'No'
  }
};
