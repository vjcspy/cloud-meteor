import {AbstractModel} from "../../../code/MeteorBase/AbstractModel";
import {ProductLicenseBillingCycle} from "../../retail/api/license-interface";

export class Plan extends AbstractModel {
    protected $collection: string = 'sales_plan';
    
    getPricingCycle(): ProductLicenseBillingCycle {
        return this.getData('pricing_cycle');
    }
}