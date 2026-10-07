export interface Witness {
  firstName?: string;
  lastName?: string;
  position?: string;
  department?: string;

  // Current Witness UI includes Company.
  company?: string;

  notes?: string;
}

export interface WitnessData {
  hasWitnesses: 'Yes' | 'No';
  witnesses?: Witness[];
}