export type PersonRoleInIncident =
  | 'Accused'
  | 'Victim';


export interface InvolvedPerson {
  fullName: string;
  position: string;
  company: string;

  department?: string;
  email?: string;
  phone?: string;

  roleInIncident?: PersonRoleInIncident;
}


export interface PersonInvolvedData {
  canIdentify:
  | 'Yes'
  | 'No';

  persons?: InvolvedPerson[];
}