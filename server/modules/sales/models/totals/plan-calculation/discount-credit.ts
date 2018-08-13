import {CalculateAbstract} from "./calculate-abstract";
import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../../retail/api/license-interface";
import * as _ from 'lodash';
import {RequestPlan} from "../../../api/data/request-plan";
import {CouponInterface, CouponMethod} from "../../../../retail/api/coupon-interface";
import {NumberHelper} from "../../../../../code/Framework/NumberHelper";
import {InvoiceCollection} from "../../../collection/invoice";
import * as moment from "moment";
import {LicenseCollection} from "../../../../retail/collections/licenses";

export class DiscountCredit extends CalculateAbstract implements CalculateInterface {
    total: string = 'discount_amount';

    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface, coupon: CouponInterface): void {
        let cost = parseInt(this.getTotals().getTotals()['price']);
        let couponChecked;
        if(coupon) {
            couponChecked = this.checkCoupon(cost, this.getUserId(), coupon);
        }
        if(!couponChecked) {
            this.getTotals().setTotal(this.total, 0);
            return;
        } else {
            if (newPricing.type === 'trial') {
                this.getTotals().setTotal(this.total, 0);
        
                return;
            }
            else {
                if (couponChecked && couponChecked['method'] === CouponMethod.FIXED_AMOUNT) {
                    if ( couponChecked['amount'] < cost) {
                        this.getTotals().setTotal(this.total, couponChecked['amount']);
                    } else  {
                        this.getTotals().setTotal(this.total, NumberHelper.round(cost, 2));
                    }
                } else if (couponChecked && couponChecked['method'] === CouponMethod.PERCENTAGE) {
                    this.getTotals().setTotal(this.total, NumberHelper.round((cost * (couponChecked['amount']/100)), 2));
                }
                return;
            }
        }
    }
    
    checkCoupon(cost, userId, coupon) {
        const now      = moment().toDate();
        const invoices = InvoiceCollection.find({user_id: userId, coupon_id: coupon['_id']}).fetch();
        const license = LicenseCollection.findOne({shop_owner_id: userId});
        const userUsed = _.reduce(invoices, (result, invoice) => {
            return result += invoice['coupon_id'] === coupon['_id'] ? 1 : 0;
        }, 0);
        if (!!coupon['quantity_user'] && (userUsed >= coupon['quantity_user'])) {
            return null;
        }
        if (_.size(coupon['license_compatible']) > 0) {
            const licenseCompatible = _.find(coupon['license_compatible'], (lc) => lc['license_id'] === license['_id']);
            if (!licenseCompatible) {
                return null;
            }
        }
        if (!!coupon['min_total']) {
            if ((cost ? cost : 0) < coupon['min_total']) {
                return null;
            }
        }
    
        if (!!coupon['from_date'] && !!coupon['to_date']) {
            if ((now < coupon['from_date']) || (now > coupon['to_date'])) {
                return null;
            }
        }
    
        if (!!coupon['quantity'] && (coupon['used'] >= coupon['quantity'])) {
            return null;
        }
        return coupon;
    }
}