export interface InvolvedPerson {
  fullName: string;
  position: string;
  company: string;

  department?: string;
  email?: string;
  phone?: string;
  roleInIncident?: string;
}

export interface PersonInvolvedData {
  canIdentify: 'Yes' | 'No';

  persons?: InvolvedPerson[];
}