import { ReportData } from '../../models/public/ReportData';

export const FullAnonymousReportData: ReportData = {
    reporter: {
        identityType: 'anonymous',
        reporterCategory: 'Employee'
    },

    classification: {
        internalAuditAnswer: 'No',
        category: 'Nepotism/Cronyism',
    },
    allegation: {
        incidentTitle: 'عدم الالتزام بإجراءات السلامة المطلوبة في موقع العمل',
        whatHappened:
            'تمت ملاحظة عدد من الموظفين أثناء تنفيذ أعمال صيانة داخل منطقة محظورة دون الالتزام بإجراءات السلامة المطلوبة أو استخدام معدات الوقاية الشخصية الإلزامية.',
        rulePolicyLaw:
            'سياسة الصحة والسلامة والبيئة وإجراءات السلامة المهنية المعتمدة',
        awarenessMethod:
            'علمت بمخالفة إجراءات السلامة أثناء ملاحظتي لأعمال الصيانة الروتينية التي كانت تُنفذ في موقع العمل.',
        incidentLocation: 'منطقة الصيانة والتشغيل',
        knowsExactDate: 'No',
        incidentDateDescription: 'سبتمبر 2026',
        ongoing: 'No'
    },
    reportDetails: {
        category: 'Health, Safety & Environment-Safety Protocol Breaches',
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
                fullName: 'Synthetic Accused Person',
                position: 'Synthetic Maintenance Supervisor',
                company: 'Synthetic Test Company',
                department: 'Synthetic Operations',
                email: 'accused.person@example.test',
                phone: '0500000000',
                roleInIncident: 'Accused'
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

    witnesses: {
        hasWitnesses: 'Yes',
        witnesses: [
            {
                firstName: 'Synthetic',
                lastName: 'Witness',
                position: 'Synthetic Safety Specialist',
                department: 'Synthetic Health and Safety',
                notes:
                    'شاهد أعمال الصيانة التي تم تنفيذها داخل المنطقة المحظورة ولاحظ عدم الالتزام بإجراءات السلامة واستخدام معدات الوقاية الشخصية المطلوبة.'
            }
        ]
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
        hasSystemReference: 'No',
        relevantInfo:
            'تم الإبلاغ سابقًا عن مخالفة إجراءات السلامة، ولكن لم يتم إبلاغي بأي نتيجة نهائية أو إجراء تصحيحي.',
        firstName: 'Synthetic',
        lastName: 'Reporter',
        positionDepartment: 'Synthetic Health and Safety',
        knowsExactDate: 'No',
        reportingDate: '2026-08-01',
        dateDescription: 'أغسطس 2026'
    },

    declaration: {
        accurateInformation: true,
        confidentialityAcknowledged: true
    }
};
