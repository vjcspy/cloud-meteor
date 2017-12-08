import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface, ProductLicenseBillingCycle} from "../../../../retail/api/license-interface";
import {CalculateAbstract} from "./calculate-abstract";
import {DateTimeHelper} from "../../../../../code/Framework/DateTimeHelper";
import * as moment from 'moment';
import {NumberHelper} from "../../../../../code/Framework/NumberHelper";
import {RequestPlan} from "../../../api/data/request-plan";

export class CreditChangePlan extends CalculateAbstract implements CalculateInterface {
    total: string = '';
    
    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        
        // Only billing cycle = Annually maybe refund credit point
        if (!productLicense || productLicense.billing_cycle !== ProductLicenseBillingCycle.ANNUALLY) {
            this.getTotals().setTotal(this.total, 0);
            
            return;
        }
        
        const current        = DateTimeHelper.getCurrentMoment();
        const expired        = moment(productLicense.expiry_date);
        const remainingMonth = moment.duration(expired.diff(current)).asMonths() - 1;
        
        
        // FIXME: will calculate wrong credit amount when apply discount, promo ....
        if (remainingMonth > 0) {
            this.getTotals()
                .setData('credit_earn', NumberHelper.round(remainingMonth * currentPricing.cost_annually * productLicense.addition_entity, 2));
            
            return;
        } else {
            this.getTotals().setData('credit_earn', 0);
            
            return;
        }
    }
    
}