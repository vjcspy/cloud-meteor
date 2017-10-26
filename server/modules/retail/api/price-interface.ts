export interface PriceInterface {
    _id?: string;
    display_name: string;
    type: string;
    nousers?: number;
    trialDay: number;
    cost_monthly?: string;
    cost_annually?: string;
    cost_adding?: string;
    description?: string;
}