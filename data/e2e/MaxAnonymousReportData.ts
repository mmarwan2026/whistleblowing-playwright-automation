import type { ReportData } from '../../models/public/ReportData';

const maxText = `MAXIMUM-INPUT-${'Lorem ipsum validation text '.repeat(8)}`;

export const MaxAnonymousReportData: ReportData = {
  reporter: {
    identityType: 'anonymous',
    reporterCategory: 'Employee'
  },
  reportDetails: {
    category: 'Corruption-Conflict of interest - Commercial',
    incidentDescription: maxText,
    policyReference: maxText,
    awarenessMethod: maxText,
    location: maxText,
    incidentDate: '2026-09-01',
    ongoing: 'No'
  },
  personsInvolved: {
    canIdentify: 'Yes',
    persons: [{
      fullName: maxText,
      position: maxText,
      company: maxText,
      department: maxText,
      email: 'max.input.person@example.test',
      phone: '0500000000',
      roleInIncident: 'Alleged Perpetrator'
    }, {
      fullName: maxText,
      position: maxText,
      company: maxText,
      department: maxText,
      roleInIncident: 'Witness'
    }]
  },
  entitiesInvolved: {
    canIdentify: 'Yes',
    entities: [{ entityName: maxText }]
  },
  evidence: {
    hasSupportingEvidence: 'Yes',
    filePaths: ['test-data/files/validevidence.pdf'],
    fileDescriptions: [maxText]
  },
  previousReporting: {
    previouslyReported: 'Yes',
    reportingChannel: 'platform',
    hasSystemReference: 'No',
    reportingDate: '2026-08-01'
  },
  declaration: {
    accurateInformation: true,
    confidentialityAcknowledged: true
  }
};

