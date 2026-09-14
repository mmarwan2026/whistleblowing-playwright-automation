export interface AllegationData {
  incidentTitle: string;
  whatHappened: string;
  rulePolicyLaw?: string;
  awarenessMethod: string;
  incidentLocation?: string;

  knowsExactDate?: 'Yes' | 'No';
  incidentDate?: string;

  ongoing?: 'Yes' | 'No' | "I don't know";
}