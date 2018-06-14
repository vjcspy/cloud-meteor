import {CalculateInterface} from "./calculate-interface";
import {CalculateAbstract} from "./calculate-abstract";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../../retail/api/license-interface";
import {RequestPlan} from "../../../api/data/request-plan";
import {CouponInterface} from "../../../../retail/api/coupon-interface";
import {UserCredit} from "../../../../user-credit/models/user-credit";
import {OM} from "../../../../../code/Framework/ObjectManager";

export class CreditSpent extends CalculateAbstract implements CalculateInterface {
    total: string = 'credit_spent';
    
    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface, coupon: CouponInterface): void {
        this.getTotals().setTotal(this.total, 0);
        let credit_balance = 0;
        const userCredit   = OM.create<UserCredit>(UserCredit);
        userCredit.load(this.getUserId(), 'user_id');
        
        if (userCredit.getId()) {
            credit_balance = userCredit.getBalance();
        }
        
        let grand_total = this.getTotals().getTotals()['price'] - this.getTotals().getTotals()['discount_amount'];
        let credit_spent = Math.min(grand_total, credit_balance);
        
        this.getTotals().setTotal(this.total, credit_spent);
    }
}