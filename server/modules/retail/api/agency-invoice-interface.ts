
export enum StatusPaid {
    NOT_PAID ,
    PAID
}

export interface  AgencyInvoiceInterface {
    user_id: string,
    grand_total?:number,
    month:number,
    year: number,
    status:StatusPaid,
    created_at: Date,
}