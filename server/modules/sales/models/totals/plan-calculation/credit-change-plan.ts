import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../../retail/api/price-interface";
import {LicenseHasProductInterface, ProductLicenseBillingCycle} from "../../../../retail/api/license-interface";
import {CalculateAbstract} from "./calculate-abstract";
import {DateTimeHelper} from "../../../../../code/Framework/DateTimeHelper";
import * as moment from 'moment';
import {NumberHelper} from "../../../../../code/Framework/NumberHelper";
import {RequestPlan} from "../../../api/data/request-plan";

export class CreditChangePlan extends CalculateAbstract implements CalculateInterface {
    total: string = 'credit_earn';

    collect(plan: RequestPlan, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        this.getTotals().setTotal(this.total, 0);

        if (productLicense) {
            const current        = DateTimeHelper.getCurrentMoment();
            const expired        = moment(productLicense.expiry_date);
            const remainingMonth = moment.duration(expired.diff(current)).asMonths() - 1;


            // FIXME: will calculate wrong credit amount when apply discount, promo ....
            if (remainingMonth > 0) {
                this.getTotals()
                    .setData(this.total, NumberHelper.round(remainingMonth * currentPricing.cost_annually / 12 * productLicense.addition_entity, 2));

                return;
            } else {
                this.getTotals().setData(this.total, 0);

                return;
            }
        }
    }

}