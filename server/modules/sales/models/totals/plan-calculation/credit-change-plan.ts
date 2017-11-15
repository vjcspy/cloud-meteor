import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface, ProductLicenseBillingCycle} from "../../../../retail/api/license-interface";
import {CalculateAbstract} from "./calculate-abstract";
import {DateTimeHelper} from "../../../../../code/Framework/DateTimeHelper";
import * as moment from 'moment';
import {NumberHelper} from "../../../../../code/Framework/NumberHelper";

export class CreditChangePlan extends CalculateAbstract implements CalculateInterface {
    total: string = '';
    
    collect(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        if (!productLicense) {
            this.getTotals().setTotal(this.total, 0);
            
            return;
        }
        
        const current      = DateTimeHelper.getCurrentMoment();
        const expired      = moment(productLicense.expired_date);
        const remainingDay = moment.duration(expired.diff(current)).asDays();
        
        
        // FIXME: will calculate wrong credit amount when apply discount, promo ....
        if (remainingDay > 0) {
            if (newPricing._id === currentPricing._id && plan['cycle'] === productLicense.billing_cycle) {
                this.getTotals().setData('credit_earn', 0);
            } else {
                if (productLicense.billing_cycle === ProductLicenseBillingCycle.ANNUALLY) {
                    this.getTotals()
                        .setData('credit_earn', NumberHelper.round(remainingDay * currentPricing.cost_annually / this.getDayByCycle(productLicense.billing_cycle), 2));
                } else if (productLicense.billing_cycle === ProductLicenseBillingCycle.MONTHLY) {
                    this.getTotals()
                        .setData('credit_earn', NumberHelper.round(remainingDay * currentPricing.cost_monthly / this.getDayByCycle(productLicense.billing_cycle), 2));
                } else {
                    throw new Meteor.Error("can_not_find_cycle");
                }
            }
        }
        
        this.getTotals().setData('credit_earn', 0);
    }
    
}