import {CalculateAbstract} from "./calculate-abstract";
import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface, ProductLicenseBillingCycle} from "../../../../retail/api/license-interface";
import {NumberHelper} from "../../../../../code/Framework/NumberHelper";
import {RequestPlan} from "../../../api/data/request-plan";

export class CostNewPlan extends CalculateAbstract implements CalculateInterface {
    total: string = 'price';
    
    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        if (newPricing.type === 'trial') {
            this.getTotals().setTotal(this.total, 0);
            
            return;
        }
        else if (newPricing.type === 'life_time') {
            this.getTotals().setTotal(this.total, NumberHelper.round(newPricing.lifetime_cost * (plan.addition_entity ), 2));
            
            return;
        } else {
            let costSubscribe;
            if (parseInt(plan.cycle + '') === ProductLicenseBillingCycle.MONTHLY) {
                costSubscribe = newPricing.cost_monthly;
            } else if (parseInt(plan.cycle + '') === ProductLicenseBillingCycle.ANNUALLY) {
                costSubscribe = newPricing.cost_annually;
            }
            
            if (typeof costSubscribe === 'undefined') {
                throw new Meteor.Error("Error", "can_not_find_price_of_new_pricing");
            }
            
            this.getTotals().setTotal(this.total, NumberHelper.round(costSubscribe * (plan.addition_entity), 2));
            
            return;
        }
    }
    
}