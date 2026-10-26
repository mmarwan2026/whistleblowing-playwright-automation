import type { SubmissionReportData } from './SubmissionReportData';

const e2eReporterEmail = process.env.E2E_REPORTER_EMAIL;

if (!e2eReporterEmail) {
  throw new Error('E2E_REPORTER_EMAIL must be set to a real QA mailbox before running identified-report tests.');
}

export const MinimumIdentifiedReportData: SubmissionReportData = {
  reporter: {
    identityType: 'identified',
    firstName: 'Synthetic',
    lastName: 'Reporter',
    company: 'Synthetic Test Company',
    department: 'Synthetic Quality Assurance',
    position: 'Automation Tester',
    mobile: '+966500000000',
    mobileCountryCode: '+966',
    email: e2eReporterEmail
  },
  reportDetails: {
    category: 'Corruption-Conflict of interest - Commercial',
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
  evidence: { hasSupportingEvidence: 'No' },
  previousReporting: { previouslyReported: 'No' }
};
