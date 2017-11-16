import {SelectOptionsInterface} from "../../base/api/data-provider/select-options";
import {ProductLicenseBillingCycle} from "../api/license-interface";

export class BillingCycleHelper {
    getBillingCycleSelectOption(): SelectOptionsInterface[] {
        let options: SelectOptionsInterface[] = [];
        
        _.forEach(ProductLicenseBillingCycle, (c) => {
            switch (c) {
                case ProductLicenseBillingCycle.MONTHLY:
                    options.push({
                                     value: c,
                                     name: 'Monthly'
                                 });
                    break;
                case ProductLicenseBillingCycle.ANNUALLY:
                    options.push({
                                     value: c,
                                     name: 'Annually'
                                 });
                    break;
                case ProductLicenseBillingCycle.LIFE_TIME:
                    options.push({
                                     value: c,
                                     name: 'Life time'
                                 });
                    break;
            }
        });
        
        return options;
    }
}