export type ExactDateAnswer = 'Yes' | 'No';
export type OngoingAnswer = 'Yes' | 'No' | 'Unknown';

/** Data captured by the current public Report Details step. */
export interface ReportDetailsData {
  category: string;
  incidentDescription: string;
  policyReference?: string;
  awarenessMethod: string;
  location?: string;
  incidentDate: string;
  ongoing: OngoingAnswer;
}
