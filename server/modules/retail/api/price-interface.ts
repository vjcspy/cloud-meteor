export enum PriceEntityType {
    REGISTER,
    OUTLET,
    USER,
}

export interface PriceInterface {
    _id?: string;
    code: string;
    display_name: string;
    type: string;
    entity_type: PriceEntityType;
    trial_day: number;
    free_entity: number;
    cost_monthly?: number;
    cost_annually?: number;
    description?: string;
}