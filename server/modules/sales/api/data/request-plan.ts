import {ProductLicenseBillingCycle} from "../../../retail/api/license-interface";

export interface RequestPlan {
    pricing_id: string;
    cycle: ProductLicenseBillingCycle;
    num_of_cycle: number;
    addition_entity: number;
}
