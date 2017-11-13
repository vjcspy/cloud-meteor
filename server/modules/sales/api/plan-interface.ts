import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";

export interface PlanInterface {
    _id?: string;
    user_id: string;
    license_id: string;
    product_id: string;
    
    pricing_id: string;
    pricing_code: string;
    pricing_cycle: ProductLicenseBillingCycle;
    prev_pricing_id: string;
    prev_pricing_cycle: ProductLicenseBillingCycle;
    
    price: number;
    credit_earn: number;
    credit_spent: number;
    discount_amount: number
    grand_total: number;
    
    created_at?: Date;
    updated_at?: Date
}