export type PersonRoleInIncident =
  | 'Victim'
  | 'Reporter'
  | 'Alleged Perpetrator'
  | 'Witness';

export type CanIdentifyPerson = 'Yes' | 'No';


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
  canIdentify: CanIdentifyPerson;

  persons?: InvolvedPerson[];
}
