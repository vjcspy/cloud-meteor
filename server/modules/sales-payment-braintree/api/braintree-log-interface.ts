import {InvoiceType} from "../../sales/api/invoice-interface";

export interface BraintreeLogInterface {
    _id?: string;
    user_id: string;
    entity_id: string;
    type: InvoiceType;
    transaction_data: string;
    created_at?: Date;
    updated_at?: Date
}