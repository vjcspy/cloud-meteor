import {CalculateAbstract} from "./calculate-abstract";
import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../retail/api/license-interface";
import {DateTimeHelper} from "../../../../code/Framework/DateTimeHelper";
import * as moment from 'moment';
import {NumberHelper} from "../../../../code/Framework/NumberHelper";

export class CreditChangeActiveUser extends CalculateAbstract implements CalculateInterface {
    total: string = 'creditExtraUser';
    
    collect(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        if (!productLicense) {
            return this.setCredit(0);
        }
        
        const current      = DateTimeHelper.getCurrentMoment();
        const expired      = moment(productLicense.extra_user_expired_date);
        const remainingDay = moment.duration(expired.diff(current)).asDays();
        
        if (remainingDay > 0) {
            if (currentPricing._id === newPricing._id) {
                const change = parseInt(plan['extraUser']) - productLicense.numOfExtraUser;
                if (change < 0) {
                    return this.setCredit(NumberHelper.round(Math.abs(change) * currentPricing.cost_adding * remainingDay / 30, 2));
                } else {
                    return this.setCredit(0);
                }
            } else {
                return this.setCredit(NumberHelper.round(Math.abs(parseInt(plan['extraUser'])) * currentPricing.cost_adding * remainingDay / 30, 2));
            }
        }
        return this.setCredit(0);
    }
    
}