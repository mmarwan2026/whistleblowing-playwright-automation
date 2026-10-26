import type { ReportDetailsData } from '../../models/public/ReportDetailsData';

export class ReportDetailsFactory {
  static default(): ReportDetailsData {
    return {
      category: 'Corruption-Conflict of interest - Commercial',
      incidentDescription:
        'A synthetic employee may have participated in a decision involving a related party.',
      policyReference: 'Synthetic Conflict of Interest Policy',
      awarenessMethod: 'Observed during synthetic automation validation.',
      location: 'Synthetic Test Site',
      incidentDate: '2026-10-19',
      ongoing: 'No'
    };
  }
}
