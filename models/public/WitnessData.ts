export interface Witness {
  firstName?: string;
  lastName?: string;
  position?: string;
  department?: string;
  notes?: string;
}

export interface WitnessData {
  hasWitnesses: 'Yes' | 'No' | "I don't know";
  witnesses?: Witness[];
}