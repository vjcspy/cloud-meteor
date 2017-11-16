import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";

export interface RequestPlan {
    pricing_id: string;
    cycle: ProductLicenseBillingCycle;
    addition_entity: number;
}