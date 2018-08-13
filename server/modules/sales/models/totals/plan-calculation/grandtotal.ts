import {CalculateInterface} from "./calculate-interface";
import {CalculateAbstract} from "./calculate-abstract";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../../retail/api/license-interface";
import {RequestPlan} from "../../../api/data/request-plan";
import {CouponInterface} from "../../../../retail/api/coupon-interface";
import {UserCredit} from "../../../../user-credit/models/user-credit";
import {OM} from "../../../../../code/Framework/ObjectManager";

export class Grandtotal extends CalculateAbstract implements CalculateInterface {
    total: string = 'grand_total';
    
    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface, coupon: CouponInterface): void {
        this.getTotals().setTotal(this.total, 0);
        let grand_total = this.getTotals().getTotals()['price'] - this.getTotals().getTotals()['discount_amount'];
        let credit_spent = this.getTotals().getTotals()['credit_spent'];
        let total        = grand_total - credit_spent;
        
        this.getTotals().setTotal(this.total, total);
    }
}