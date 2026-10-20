export interface ReportDetailsData {
  category: string;
  incidentDescription: string;
  policyReference?: string;
  awarenessMethod: string;
  location?: string;
  incidentDate: string;
  ongoing: 'Yes' | 'No' | 'Unknown';
}
