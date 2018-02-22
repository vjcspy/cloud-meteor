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
    trial_day?: number; // only pricing type = trial
    cost_monthly?: number;
    cost_annually?: number;
    lifetime_cost?: number;
    description?: string;
    allow_customer: number;
}