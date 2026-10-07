import { ReportData } from '../../models/public/ReportData';
import { FullAnonymousReportData } from '../e2e/FullAnonymousReportData';

const runId = Date.now().toString();

/**
 * ============================================================
 * BASE REPORT
 * ============================================================
 */
export const SimilarityBaseReport: ReportData = {
    ...FullAnonymousReportData,

    reporter: {
        identityType: 'anonymous',
        reporterCategory: 'Employee'
    },

    classification: {
        internalAuditAnswer: 'No',
        category: 'Nepotism/Cronyism'
    },

    allegation: {
        ...FullAnonymousReportData.allegation,

        incidentTitle:
            `E2E Safety Similarity ${runId}`,

        whatHappened:
            `Employee performed maintenance work in a restricted area ` +
            `without using the required personal protective equipment. ` +
            `Test ${runId}.`,

        rulePolicyLaw:
            'Health, Safety & Environment Policy',

        awarenessMethod:
            'I became aware of the incident while observing maintenance activities.',

        incidentLocation:
            'Maintenance Area',

        knowsExactDate: 'No',

        incidentDateDescription:
            'September 2026',

        ongoing: 'No'
    },

    personsInvolved: {
        canIdentify: 'Yes',

        persons: [
            {
                fullName:
                    `Ahmed Similarity ${runId}`,

                position:
                    'Maintenance Supervisor',

                company:
                    'Red Sea Global',

                department:
                    'Maintenance',

                email:
                    `similarity.${runId}@example.com`,

                phone:
                    '0501234567',

                roleInIncident:
                    'Victim'
            }
        ]
    },

    witnesses: {
        hasWitnesses: 'No'
    },

    evidence: {
        hasSupportingEvidence: 'No'
    },

    previousReporting: {
        previouslyReported: 'No'
    },

    declaration: {
        accurateInformation: true,
        confidentialityAcknowledged: true
    }
};


/**
 * ============================================================
 * AI-SIM-001
 * EXACT DUPLICATE
 * ============================================================
 */
export const ExactDuplicateReport: ReportData = {
    ...SimilarityBaseReport,

    reporter: {
        ...SimilarityBaseReport.reporter
    },

    classification: {
        ...SimilarityBaseReport.classification
    },

    allegation: {
        ...SimilarityBaseReport.allegation
    },

    personsInvolved: {
        ...SimilarityBaseReport.personsInvolved
    },

    witnesses: {
        ...SimilarityBaseReport.witnesses
    },

    evidence: {
        ...SimilarityBaseReport.evidence
    },

    previousReporting: {
        ...SimilarityBaseReport.previousReporting
    },

    declaration: {
        ...SimilarityBaseReport.declaration
    }
};


/**
 * ============================================================
 * AI-SIM-002
 * SEMANTIC PARAPHRASE
 * ============================================================
 */
export const SemanticParaphraseReport: ReportData = {
    ...SimilarityBaseReport,

    allegation: {
        ...SimilarityBaseReport.allegation,

        incidentTitle:
            `E2E PPE Safety Breach ${runId}`,

        whatHappened:
            `Maintenance activities were carried out inside a restricted area ` +
            `while the worker was not wearing the mandatory safety equipment. ` +
            `Test ${runId}.`
    }
};


/**
 * ============================================================
 * AI-SIM-003
 * DIFFERENT PERSON - MULTIPLE ATTRIBUTES
 * ============================================================
 */
export const DifferentPersonReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons: [
            {
                fullName:
                    `Mohamed Different ${runId}`,

                position:
                    'Finance Manager',

                company:
                    'Red Sea Global',

                department:
                    'Finance',

                email:
                    `different.person.${runId}@example.com`,

                phone:
                    '0509999999',

                roleInIncident:
                    'Victim'
            }
        ]
    }
};


/**
 * ============================================================
 * AI-SIM-004
 * NO PERSON
 * ============================================================
 */
export const NoPersonReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'No'
    }
};


/**
 * ============================================================
 * AI-SIM-005
 * DIFFERENT CATEGORY + SUBCATEGORY
 * ============================================================
 */
export const DifferentClassificationReport: ReportData = {
    ...SimilarityBaseReport,

    classification: {
        internalAuditAnswer: 'No',
        category: 'Nepotism/Cronyism'
    },
};


/**
 * ============================================================
 * AI-SIM-006
 * DIFFERENT CATEGORY
 * ============================================================
 */
export const DifferentSubcategoryReport: ReportData = {
    ...SimilarityBaseReport,

    classification: {
        internalAuditAnswer: 'No',
        category: 'Nepotism/Cronyism'
    }
};


/**
 * ============================================================
 * AI-SIM-007
 * DIFFERENT TITLE ONLY
 * ============================================================
 */
export const DifferentTitleReport: ReportData = {
    ...SimilarityBaseReport,

    allegation: {
        ...SimilarityBaseReport.allegation,

        incidentTitle:
            `E2E Completely Different Incident Title ${runId}`
    }
};


/**
 * ============================================================
 * AI-SIM-008
 * DIFFERENT DESCRIPTION ONLY
 * ============================================================
 */
export const DifferentDescriptionReport: ReportData = {
    ...SimilarityBaseReport,

    allegation: {
        ...SimilarityBaseReport.allegation,

        whatHappened:
            `A procurement employee reviewed supplier quotations and participated ` +
            `in a commercial evaluation involving an unrelated business process. ` +
            `Controlled AI similarity test ${runId}.`
    }
};


/**
 * ============================================================
 * AI-SIM-009
 * PERSON NAME DIFFERENT ONLY
 * ============================================================
 */
export const DifferentPersonNameReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    fullName:
                        `Mohamed Name Only ${runId}`
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-010
 * PERSON EMAIL DIFFERENT ONLY
 * ============================================================
 */
export const DifferentPersonEmailReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    email:
                        `different.email.${runId}@example.com`
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-011
 * PERSON PHONE DIFFERENT ONLY
 * ============================================================
 */
export const DifferentPersonPhoneReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    phone:
                        '0509999999'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-012
 * PERSON POSITION DIFFERENT ONLY
 * ============================================================
 */
export const DifferentPersonPositionReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    position:
                        'Finance Manager'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-013
 * PERSON COMPANY DIFFERENT ONLY
 * ============================================================
 */
export const DifferentPersonCompanyReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    company:
                        'Different Company'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-014
 * PERSON DEPARTMENT DIFFERENT ONLY
 * ============================================================
 */
export const DifferentPersonDepartmentReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    department:
                        'Finance'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-015
 * PERSON ROLE DIFFERENT ONLY
 * ============================================================
 */
export const DifferentPersonRoleReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    roleInIncident:
                        'Victim'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-016
 * EMAIL + PHONE DIFFERENT
 * ============================================================
 */
export const DifferentPersonContactReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    email:
                        `different.contact.${runId}@example.com`,

                    phone:
                        '0508888888'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-017
 * NAME + EMAIL + PHONE DIFFERENT
 * ============================================================
 */
export const DifferentPersonIdentityReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    fullName:
                        `Mohamed Identity ${runId}`,

                    email:
                        `different.identity.${runId}@example.com`,

                    phone:
                        '0507777701'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-018
 * NAME + POSITION DIFFERENT
 * ============================================================
 */
export const DifferentPersonNamePositionReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    fullName:
                        `Mohamed Name Position ${runId}`,

                    position:
                        'Finance Manager'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-019
 * NAME + DEPARTMENT DIFFERENT
 * ============================================================
 */
export const DifferentPersonNameDepartmentReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    fullName:
                        `Mohamed Name Department ${runId}`,

                    department:
                        'Finance'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-020
 * POSITION + DEPARTMENT DIFFERENT
 * ============================================================
 */
export const DifferentPersonPositionDepartmentReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    position:
                        'Finance Manager',

                    department:
                        'Finance'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-021
 * POSITION + COMPANY + DEPARTMENT DIFFERENT
 * ============================================================
 */
export const DifferentPersonEmploymentReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    position:
                        'Finance Manager',

                    company:
                        'Different Company',

                    department:
                        'Finance'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-022
 * NAME + POSITION + DEPARTMENT DIFFERENT
 * ============================================================
 */
export const DifferentPersonNamePositionDepartmentReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    fullName:
                        `Mohamed NPD ${runId}`,

                    position:
                        'Finance Manager',

                    department:
                        'Finance'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-023
 * NAME + POSITION + COMPANY + DEPARTMENT DIFFERENT
 * ============================================================
 */
export const DifferentPersonProfileReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    fullName:
                        `Mohamed Profile ${runId}`,

                    position:
                        'Finance Manager',

                    company:
                        'Different Company',

                    department:
                        'Finance'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-024
 * ALL PERSON FIELDS DIFFERENT
 *
 * NOTE:
 * runId remains in the name.
 * This scenario produced Possible / Name Match in observation.
 * ============================================================
 */
export const CompletelyDifferentPersonReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    fullName:
                        `Completely Different ${runId}`,

                    position:
                        'Procurement Specialist',

                    company:
                        'Different Company',

                    department:
                        'Procurement',

                    email:
                        `completely.different.${runId}@example.com`,

                    phone:
                        '0507777799',

                    roleInIncident:
                        'Victim'
                })
            )
    }
};


/**
 * ============================================================
 * AI-SIM-025
 * ALL PERSON FIELDS DIFFERENT
 * NO SHARED TOKEN IN PERSON NAME
 *
 * Purpose:
 * Isolate whether the shared runId inside the person name
 * contributed to AI-SIM-024 returning "Name Match".
 *
 * IMPORTANT:
 * runId intentionally NOT included in fullName.
 * ============================================================
 */
export const NoSharedPersonTokensReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    fullName:
                        'Omar Khaled Hassan',

                    position:
                        'Procurement Specialist',

                    company:
                        'Different Company',

                    department:
                        'Procurement',

                    email:
                        `omar.khaled.${runId}@different-example.com`,

                    phone:
                        '0558764321',

                    roleInIncident:
                        'Victim'
                })
            )
    }
};


/**
 * ============================================================
 * UNRELATED CONTROL
 * ============================================================
 */
export const UnrelatedReport: ReportData = {
    ...SimilarityBaseReport,

    classification: {
        internalAuditAnswer: 'No',
        category: 'Nepotism/Cronyism'
    },
    allegation: {
        ...SimilarityBaseReport.allegation,

        incidentTitle:
            `E2E Conflict of Interest ${runId}`,

        whatHappened:
            `An employee may have participated in a business decision ` +
            `involving a related party. Test ${runId}.`,

        rulePolicyLaw:
            'Conflict of Interest Policy',

        awarenessMethod:
            'I became aware through internal business communication.',

        incidentLocation:
            'Corporate Office'
    },

    personsInvolved: {
        canIdentify: 'Yes',

        persons: [
            {
                fullName:
                    `Different Person ${runId}`,

                position:
                    'Procurement Specialist',

                company:
                    'Different Company',

                department:
                    'Procurement',

                email:
                    `unrelated.${runId}@example.com`,

                phone:
                    '0507777777',

                roleInIncident:
                    'Victim'
            }
        ]
    }
};

/**
 * AI-SIM-026
 * Exact name match, all other person fields different.
 */
export const ExactNameOnlyReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons:
            SimilarityBaseReport.personsInvolved.persons?.map(
                person => ({
                    ...person,

                    // Same name as the base report
                    fullName: person.fullName,

                    position: 'Procurement Specialist',
                    company: 'Different Company',
                    department: 'Procurement',

                    email:
                        `name.only.${runId}@different-example.com`,

                    phone: '0558764321',

                    roleInIncident:
                        'Victim'
                })
            )
    }
};

/**
 * ============================================================
 * AI-SIM-027
 * EXACT EMAIL ONLY
 * ============================================================
 */
export const ExactEmailOnlyReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons: SimilarityBaseReport.personsInvolved.persons?.map(
            person => ({
                ...person,

                fullName: 'Omar Khaled Hassan',
                position: 'Procurement Specialist',
                company: 'Different Company',
                department: 'Procurement',

                // ONLY matching field
                email: person.email,

                phone: '0558764321',

                roleInIncident:
                    'Victim'
            })
        )
    }
};


/**
 * ============================================================
 * AI-SIM-028
 * EXACT PHONE ONLY
 * ============================================================
 */
export const ExactPhoneOnlyReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons: SimilarityBaseReport.personsInvolved.persons?.map(
            person => ({
                ...person,

                fullName: 'Youssef Mahmoud Ali',
                position: 'Procurement Specialist',
                company: 'Different Company',
                department: 'Procurement',

                email:
                    `phone.only.${runId}@different-example.com`,

                // ONLY matching field
                phone: person.phone,

                roleInIncident:
                    'Victim'
            })
        )
    }
};


/**
 * ============================================================
 * AI-SIM-029
 * EXACT POSITION ONLY
 * ============================================================
 */
export const ExactPositionOnlyReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons: SimilarityBaseReport.personsInvolved.persons?.map(
            person => ({
                ...person,

                fullName: 'Khaled Mahmoud Ibrahim',

                // ONLY matching field
                position: person.position,

                company: 'Different Company',
                department: 'Procurement',

                email:
                    `position.only.${runId}@different-example.com`,

                phone: '0558764322',

                roleInIncident:
                    'Victim'
            })
        )
    }
};


/**
 * ============================================================
 * AI-SIM-030
 * EXACT COMPANY ONLY
 * ============================================================
 */
export const ExactCompanyOnlyReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons: SimilarityBaseReport.personsInvolved.persons?.map(
            person => ({
                ...person,

                fullName: 'Mostafa Hassan Ibrahim',
                position: 'Procurement Specialist',

                // ONLY matching field
                company: person.company,

                department: 'Procurement',

                email:
                    `company.only.${runId}@different-example.com`,

                phone: '0558764323',

                roleInIncident:
                    'Victim'
            })
        )
    }
};


/**
 * ============================================================
 * AI-SIM-031
 * EXACT DEPARTMENT ONLY
 * ============================================================
 */
export const ExactDepartmentOnlyReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons: SimilarityBaseReport.personsInvolved.persons?.map(
            person => ({
                ...person,

                fullName: 'Tarek Mahmoud Hassan',
                position: 'Procurement Specialist',
                company: 'Different Company',

                // ONLY matching field
                department: person.department,

                email:
                    `department.only.${runId}@different-example.com`,

                phone: '0558764324',

                roleInIncident:
                    'Victim'
            })
        )
    }
};


/**
 * ============================================================
 * AI-SIM-032
 * EXACT ROLE ONLY
 * ============================================================
 */
export const ExactRoleOnlyReport: ReportData = {
    ...SimilarityBaseReport,

    personsInvolved: {
        canIdentify: 'Yes',

        persons: SimilarityBaseReport.personsInvolved.persons?.map(
            person => ({
                ...person,

                fullName: 'Mahmoud Ibrahim Hassan',
                position: 'Procurement Specialist',
                company: 'Different Company',
                department: 'Procurement',

                email:
                    `role.only.${runId}@different-example.com`,

                phone: '0558764325',

                // ONLY matching field
                roleInIncident: person.roleInIncident
            })
        )
    }
};
/**
 * ============================================================
 * BENCHMARK COLLECTION
 * ============================================================
 */
export const SimilarityBenchmarkData = {
    runId,

    base:
        SimilarityBaseReport,

    scenarios: {
        exactDuplicate:
            ExactDuplicateReport,

        semanticParaphrase:
            SemanticParaphraseReport,

        differentPerson:
            DifferentPersonReport,

        noPerson:
            NoPersonReport,

        differentClassification:
            DifferentClassificationReport,

        differentSubcategory:
            DifferentSubcategoryReport,

        differentTitle:
            DifferentTitleReport,

        differentDescription:
            DifferentDescriptionReport,

        differentPersonName:
            DifferentPersonNameReport,

        differentPersonEmail:
            DifferentPersonEmailReport,

        differentPersonPhone:
            DifferentPersonPhoneReport,

        differentPersonPosition:
            DifferentPersonPositionReport,

        differentPersonCompany:
            DifferentPersonCompanyReport,

        differentPersonDepartment:
            DifferentPersonDepartmentReport,

        differentPersonRole:
            DifferentPersonRoleReport,

        differentPersonContact:
            DifferentPersonContactReport,

        differentPersonIdentity:
            DifferentPersonIdentityReport,

        differentPersonNamePosition:
            DifferentPersonNamePositionReport,

        differentPersonNameDepartment:
            DifferentPersonNameDepartmentReport,

        differentPersonPositionDepartment:
            DifferentPersonPositionDepartmentReport,

        differentPersonEmployment:
            DifferentPersonEmploymentReport,

        differentPersonNamePositionDepartment:
            DifferentPersonNamePositionDepartmentReport,

        differentPersonProfile:
            DifferentPersonProfileReport,

        completelyDifferentPerson:
            CompletelyDifferentPersonReport,

        noSharedPersonTokens:
            NoSharedPersonTokensReport,
        exactNameOnly: ExactNameOnlyReport,
        unrelated:
            UnrelatedReport
    }
} as const;