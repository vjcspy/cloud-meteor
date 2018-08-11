export interface  AgencyInvoiceInterface {
    user_id: string,
    invoice_id:string,
    commission?:number,
    created_at: Date,
}