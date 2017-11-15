import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";

export interface InvoiceInterface {
    _id?: string;
    user_id: string;
    product_id: string;
    plan_id: string;
    pricing_id: string;
    pricing_code: string;
    pricing_cycle: ProductLicenseBillingCycle;
    
    price: number;
    discount: number;
    addOn?: number;
    
    grand_total: number;
    addition_data?: Object;
    
    created_at?: Date;
    updated_at?: Date
}