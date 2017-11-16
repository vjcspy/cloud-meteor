import {CalculateAbstract} from "./calculate-abstract";
import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../../retail/api/license-interface";
import * as _ from 'lodash';
import {UserCredit} from "../../../../user-credit/models/user-credit";
import {RequestPlan} from "../../../api/request-plan";

export class DiscountCredit extends CalculateAbstract implements CalculateInterface {
    total: string = 'discount_amount';
    
    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        const st             = _.reduce(this.getTotals().getTotals(), (r: any, v: any) => parseFloat(v + '') + parseFloat(r + ''), 0);
        const userCredit     = new UserCredit();
        const currentBalance = userCredit.getUserBalanace(this.getUserId());
        
        if (currentBalance > 0) {
            this.getTotals()
                .setTotal(this.total, this.getTotals().getTotal(this.total) + -Math.min(currentBalance, st))
                .setData('credit_spent', Math.min(currentBalance, st));
            
            return;
        } else {
            this.getTotals()
                .setData('credit_spent', 0);
            
            return;
        }
    }
    
}