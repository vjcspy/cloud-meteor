export enum InvoiceType {
    TYPE_PLAN, //Invoice for plan
    TYPE_ADDITIONFEE //Invoice for addition fee
}

export interface InvoiceInterface {
    _id?: string;
    user_id: string;
    entity_id: string;
    
    type: InvoiceType;
    grand_total: number;
    payment_data: string;
    totals: string;

    created_at?: Date;
    updated_at?: Date
}