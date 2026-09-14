export interface PersonInvolvedData {
  fullName: string;
  type: 'employee' | 'third-party';
  position?: string;
  department?: string;
}
