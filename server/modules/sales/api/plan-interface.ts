import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";

export enum PlanStatus {
    SALE_PENDING, // plan hasn't had any invoice yet (include lifetime,subscription or any type)
    SALE_COMPLETE, // plan is life time and has completed

    SUBSCRIPTION_ACTIVE,
    SUBSCRIPTION_PENDING,
    SUBSCRIPTION_PAST_DUE
}

export interface PlanInterface {
    _id?: string;
    user_id: string;
    license_id: string;
    product_id: string;
    coupon_id?: string;
    pricing_id: string;
    pricing_cycle: ProductLicenseBillingCycle;
    num_of_cycle: number;
    addition_entity: number;

    prev_pricing_id: string;
    prev_pricing_cycle: ProductLicenseBillingCycle;
    prev_addition_entity: number;

    price: number;
    credit_earn: number;
    credit_spent: number;
    discount_amount: number
    grand_total: number;

    status: PlanStatus;
    created_by_user_id?: String;
    created_at?: Date;
    updated_at?: Date
}
