import {CalculateInterface} from "./calculate-interface";
import {CalculateAbstract} from "./calculate-abstract";
import {PriceInterface} from "../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../retail/api/license-interface";
import {NumberHelper} from "../../../../code/Framework/NumberHelper";

export class CostExtraUser extends CalculateAbstract implements CalculateInterface {
    total: string = 'costExtraUser';
    
    collect(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        if (!!currentPricing && newPricing._id === currentPricing._id) {
            const change = parseInt(plan['extraUser']) - productLicense.numOfExtraUser;
            if (change > 0) {
                this.getTotals().setTotal(this.total, NumberHelper.round(change * newPricing.cost_adding, 2));
            } else {
                this.getTotals().setTotal(this.total, 0);
            }
        } else {
            this.getTotals().setTotal(this.total, NumberHelper.round(parseInt(plan['extraUser']) * newPricing.cost_adding, 2));
        }
    }
}