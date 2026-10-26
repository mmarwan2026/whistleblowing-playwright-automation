import type { ReportData } from '../../models/public/ReportData';

export type SubmissionReportData = Required<Pick<
  ReportData,
  'reporter' | 'reportDetails' | 'personsInvolved' | 'entitiesInvolved' | 'previousReporting' | 'evidence'
>>;
