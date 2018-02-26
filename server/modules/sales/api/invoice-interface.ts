export interface InvoiceInterface {
    _id?: string;
    user_id: string;
    plan_id: string;

    grand_total: number;
    payment_data: string;
    totals: string;

    created_at?: Date;
    updated_at?: Date
}