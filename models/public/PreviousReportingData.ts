export interface PreviousReportingData {
  previouslyReported: 'Yes' | 'No';

  /** Current UI branch selected when previouslyReported is Yes. */
  reportingChannel?: 'platform' | 'anotherChannel';
  reportingChannelType?: string;
  reportedToDepartment?: string;

  hasSystemReference?: 'Yes' | 'No' | "I don't remember";
  referenceNumber?: string;

  relevantInfo?: string;
  outcomeIfKnown?: string;

  firstName?: string;
  lastName?: string;
  positionDepartment?: string;
  previousReporterCompany?: string;
  previousReporterDepartment?: string;

  knowsExactDate?: 'Yes' | 'No';
  reportingDate?: string;
  dateDescription?: string;
}
