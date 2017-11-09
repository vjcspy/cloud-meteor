import {CalculateAbstract} from "./calculate-abstract";
import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../retail/api/license-interface";
import * as _ from 'lodash';
import {UserCredit} from "../../../user-credit/models/user-credit";

export class DiscountCredit extends CalculateAbstract implements CalculateInterface {
    total: string = 'discount';
    
    collect(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        const st             = _.reduce(this.getTotals(), (r: any, v: any) => parseFloat(v + r), 0);
        const userCredit     = new UserCredit();
        const currentBalance = userCredit.getUserBalanace(this.getUserId());
        
        if (currentBalance > 0) {
            this.setTotal(-Math.min(currentBalance, st));
        } else {
            this.setTotal(0);
        }
    }
    
}