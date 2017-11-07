import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../retail/api/price-interface";
import {LicenseHasProductInterface, ProductLicenseBillingCycle} from "../../../retail/api/license-interface";
import {CalculateAbstract} from "./calculate-abstract";
import {DateTimeHelper} from "../../../../code/Framework/DateTimeHelper";
import * as moment from 'moment';
import {NumberHelper} from "../../../../code/Framework/NumberHelper";

export class CreditChangePlan extends CalculateAbstract implements CalculateInterface {
    total: string = 'creditPlan';
    
    collect(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        if (!productLicense) {
            return this.setCredit(0);
        }
        
        const current      = DateTimeHelper.getCurrentMoment();
        const expired      = moment(productLicense.expired_date);
        const remainingDay = moment.duration(expired.diff(current)).asDays();
        
        
        // FIXME: will calculate wrong credit amount when apply discount, promo ....
        if (remainingDay > 0) {
            if (newPricing._id === currentPricing._id && plan['cycle'] === productLicense.billing_cycle) {
                return this.setCredit(0);
            } else {
                if (productLicense.billing_cycle === ProductLicenseBillingCycle.ANNUALLY) {
                    return this.setCredit(NumberHelper.round(remainingDay * currentPricing.cost_annually / this.getDayByCycle(productLicense.billing_cycle), 2));
                } else if (productLicense.billing_cycle === ProductLicenseBillingCycle.MONTHLY) {
                    return this.setCredit(NumberHelper.round(remainingDay * currentPricing.cost_monthly / this.getDayByCycle(productLicense.billing_cycle), 2));
                } else {
                    throw new Meteor.Error("can_not_find_cycle");
                }
            }
        }
        
        return this.setCredit(0);
    }
    
}