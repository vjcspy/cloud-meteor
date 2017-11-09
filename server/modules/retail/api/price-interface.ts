export interface PriceInterface {
    _id?: string;
    code: string;
    display_name: string;
    type: string;
    nousers?: number;
    trialDay: number;
    cost_monthly?: number;
    cost_annually?: number;
    cost_adding?: number;
    description?: string;
}