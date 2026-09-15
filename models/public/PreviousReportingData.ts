export interface PreviousReportingData {
  previouslyReported: 'Yes' | 'No';

  hasSystemReference?: 'Yes' | 'No' | "I don't remember";

  referenceNumber?: string;
  relevantInfo?: string;
  outcomeIfKnown?: string;

  firstName?: string;
  lastName?: string;
  positionDepartment?: string;

  knowsExactDate?: 'Yes' | 'No';
  reportingDate?: string;
  dateDescription?: string;
}