import type { ReportData } from '../../models/public/ReportData';

// Also used as the base fixture for the similarity benchmarks, which need ReportData.
export const FullAnonymousReportData: ReportData = {
    reporter: {
        identityType: 'anonymous',
        reporterCategory: 'Employee'
    },

    reportDetails: {
        category: 'Corruption-Conflict of interest - Commercial',
        incidentDescription:
            'Synthetic validation report describing a safety protocol concern at a test location.',
        policyReference: 'Synthetic Health and Safety Policy',
        awarenessMethod:
            'Observed directly during synthetic automation validation.',
        location: 'Synthetic Test Site',
        incidentDate: '2026-09-01',
        ongoing: 'No'
    },

    personsInvolved: {
        canIdentify: 'Yes',
        persons: [
            {
                fullName: 'Synthetic Alleged Perpetrator',
                position: 'Synthetic Maintenance Supervisor',
                company: 'Synthetic Test Company',
                department: 'Synthetic Operations',
                email: 'alleged.perpetrator@example.test',
                phone: '0500000000',
                roleInIncident: 'Alleged Perpetrator'
            },
            {
                fullName: 'Synthetic Witness',
                position: 'Safety Specialist',
                company: 'Synthetic Test Company',
                department: 'Health and Safety',
                roleInIncident: 'Witness'
            }
        ]
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
        fileDescriptions: [
            'Synthetic supporting document used to validate the evidence upload flow.'
        ]
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

export const FullAnonymousAnotherChannelReportData: ReportData = {
    ...FullAnonymousReportData,
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

export const FullAnonymousFirstTimeReportData: ReportData = {
    ...FullAnonymousReportData,
    previousReporting: {
        previouslyReported: 'No'
    }
};
