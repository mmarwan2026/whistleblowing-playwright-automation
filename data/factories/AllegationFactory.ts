import { AllegationData } from '../../models/public/AllegationData';

export class AllegationFactory {
  static default(): AllegationData {
    const today = new Date().toISOString().slice(0, 10);

    return {
      whatHappened: `Automation allegation ${Date.now()}`,
      ruleViolation: 'Internal policy violation',
      awareness: 'Observed during normal business activity',
      incidentDate: today,
      incidentDateDescription: 'Automation-generated incident date',
      numberOfIndividuals: 1,
      incidentLocation: 'Head Office',
      ongoing: false
    };
  }
}
