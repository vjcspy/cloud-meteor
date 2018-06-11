import {CalculateAbstract} from "./calculate-abstract";
import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface, ProductLicenseBillingCycle} from "../../../../retail/api/license-interface";
import * as _ from 'lodash';
import {UserCredit} from "../../../../user-credit/models/user-credit";
import {RequestPlan} from "../../../api/data/request-plan";
import {CouponInterface, CouponMethod} from "../../../../retail/api/coupon-interface";
import {NumberHelper} from "../../../../../code/Framework/NumberHelper";

export class DiscountCredit extends CalculateAbstract implements CalculateInterface {
    total: string = 'discount_amount';

    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface, coupon: CouponInterface): void {
        if(!coupon) {
            this.getTotals().setTotal(this.total, 0);
            return;
        } else {
            if (newPricing.type === 'trial') {
                this.getTotals().setTotal(this.total, 0);
        
                return;
            }
            else if (newPricing.type === 'life_time') {
                if (coupon['method'] === CouponMethod.FIXED_AMOUNT) {
                    this.getTotals().setTotal(this.total, coupon['amount']);
                } else if (coupon && coupon['method'] === CouponMethod.PERCENTAGE) {
                    this.getTotals().setTotal(this.total, NumberHelper.round((newPricing.lifetime_cost * (plan.addition_entity) * coupon['amount']/100), 2));
                }
                return;
            } else {
                let costSubscribe;
                if (parseInt(plan.cycle + '') === ProductLicenseBillingCycle.MONTHLY) {
                    costSubscribe = parseFloat(newPricing.cost_monthly + '') * parseFloat(plan.num_of_cycle + '');
                } else if (parseInt(plan.cycle + '') === ProductLicenseBillingCycle.ANNUALLY) {
                    costSubscribe = parseFloat(newPricing.cost_annually + '') * parseFloat(plan.num_of_cycle + '');
                }
        
                if (typeof costSubscribe === 'undefined') {
                    throw new Meteor.Error("Error", "can_not_find_price_of_new_pricing");
                }
                if (coupon && coupon['method'] === CouponMethod.FIXED_AMOUNT) {
                    if ( coupon['amount'] < (costSubscribe * (plan.addition_entity))) {
                        this.getTotals().setTotal(this.total, coupon['amount']);
                    } else  {
                        this.getTotals().setTotal(this.total, NumberHelper.round((costSubscribe * (plan.addition_entity)), 2));
                    }
                } else if (coupon && coupon['method'] === CouponMethod.PERCENTAGE) {
                    this.getTotals().setTotal(this.total, NumberHelper.round((costSubscribe * (plan.addition_entity) * (coupon['amount']/100)), 2));
                }
                return;
            }
        }
    }

}