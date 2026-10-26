export type CanIdentifyEntity = 'Yes' | 'No';

export interface EntityInvolved {
  entityName: string;
}

export interface EntitiesInvolvedData {
  canIdentify: CanIdentifyEntity;

  entities?: EntityInvolved[];
}
