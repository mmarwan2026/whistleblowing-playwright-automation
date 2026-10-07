export interface EntityInvolved {
    entityName: string;
}

export interface EntitiesInvolvedData {
    canIdentify:
    | 'Yes'
    | 'No';

    entities?: EntityInvolved[];
}