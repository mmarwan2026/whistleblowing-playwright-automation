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

    personsInvolved: {
        canIdentify: 'Yes',
        persons: [
            {
                fullName: 'أحمد محمود حسن',
                position: 'مشرف صيانة',
                company: 'البحر الأحمر الدولية',
                department: 'إدارة الصيانة والتشغيل',
                email: 'ahmed.mahmoud@example.com',
                phone: '0501234567',
                roleInIncident: 'Accused'
            }
        ]
    },
    entitiesInvolved: {
        canIdentify: 'Yes',

        entities: [
            {
                entityName: 'أحمد محمود حسن',
            },
        ],
    },

    witnesses: {
        hasWitnesses: 'Yes',
        witnesses: [
            {
                firstName: 'خالد',
                lastName: 'حسن',
                position: 'أخصائي سلامة',
                department: 'الصحة والسلامة والبيئة',
                notes:
                    'شاهد أعمال الصيانة التي تم تنفيذها داخل المنطقة المحظورة ولاحظ عدم الالتزام بإجراءات السلامة واستخدام معدات الوقاية الشخصية المطلوبة.'
            }
        ]
    },

    evidence: {
        hasSupportingEvidence: 'Yes',
        filePaths: ['test-data/files/validevidence.pdf']
    },

    previousReporting: {
        previouslyReported: 'Yes',
        hasSystemReference: 'No',
        relevantInfo:
            'تم الإبلاغ سابقًا عن مخالفة إجراءات السلامة، ولكن لم يتم إبلاغي بأي نتيجة نهائية أو إجراء تصحيحي.',
        firstName: 'سارة',
        lastName: 'أحمد',
        positionDepartment: 'إدارة الصحة والسلامة والبيئة',
        knowsExactDate: 'No',
        dateDescription: 'أغسطس 2026'
    },

    declaration: {
        accurateInformation: true,
        confidentialityAcknowledged: true
    }
};