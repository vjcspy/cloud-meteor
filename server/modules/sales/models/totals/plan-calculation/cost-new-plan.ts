import {CalculateAbstract} from "./calculate-abstract";
import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface, ProductLicenseBillingCycle} from "../../../../retail/api/license-interface";
import {NumberHelper} from "../../../../../code/Framework/NumberHelper";
import {RequestPlan} from "../../../api/request-plan";

export class CostNewPlan extends CalculateAbstract implements CalculateInterface {
    total: string = 'price';
    
    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        if (newPricing.type === 'life_time') {
            this.getTotals().setTotal(this.total, NumberHelper.round(newPricing.lifetime_cost, 2));
            
            return;
        } else {
            const costSubscribe = plan.cycle === ProductLicenseBillingCycle.MONTHLY ? newPricing.cost_monthly : newPricing.cost_annually;
            this.getTotals().setTotal(this.total, NumberHelper.round(costSubscribe, 2));
            
            return;
        }
    }
    
}