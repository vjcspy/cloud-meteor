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
    
    cost_new_plan: number;
    credit_change_plan: number;
    discount_amount: number;
    grand_total: number;
}