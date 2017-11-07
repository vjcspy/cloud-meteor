import {CalculateInterface} from "./calculate-interface";
import {CalculateAbstract} from "./calculate-abstract";
import {PriceInterface} from "../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../retail/api/license-interface";

export class Grandtotal extends CalculateAbstract implements CalculateInterface {
    total: string = 'grandTotal';
    
    collect(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        this.setTotal(_.reduce(this.getTotals(), (r: any, v: any) => parseFloat(v + r), 0));
    }
}