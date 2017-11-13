import {CalculateInterface} from "./calculate-interface";
import {CalculateAbstract} from "./calculate-abstract";
import {PriceInterface} from "../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../retail/api/license-interface";

export class Grandtotal extends CalculateAbstract implements CalculateInterface {
    total: string = 'grand_total';
    
    collect(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        this.getTotals().setTotal(this.total, _.reduce(this.getTotals().getTotals(), (r: any, v: any) => parseFloat(v + '') + parseFloat(r + ''), 0));
    }
}