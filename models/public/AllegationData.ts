export interface AllegationData {
  whatHappened: string;
  ruleViolation: string;
  awareness: string;
  incidentDate: string;
  incidentDateDescription?: string;
  numberOfIndividuals: number;
  incidentLocation: string;
  ongoing: boolean;
}
