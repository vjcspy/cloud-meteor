import {CalculateAbstract} from "./calculate-abstract";
import {CalculateInterface} from "./calculate-interface";
import {PriceInterface} from "../../../retail/api/price-interface";
import {LicenseHasProductInterface, ProductLicenseBillingCycle} from "../../../retail/api/license-interface";
import {NumberHelper} from "../../../../code/Framework/NumberHelper";

export class CostNewPlan extends CalculateAbstract implements CalculateInterface {
    total: string = 'price';
    
    collect(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): void {
        if (!!currentPricing && newPricing._id === currentPricing._id) {
            if (plan['cycle'] === productLicense.billing_cycle) {
                this.getTotals().setTotal(this.total, 0);
            } else {
                if (plan['cycle'] === ProductLicenseBillingCycle.ANNUALLY) {
                    this.getTotals().setTotal(this.total, NumberHelper.round(newPricing.cost_annually, 2));
                } else if (plan['cycle'] === ProductLicenseBillingCycle.MONTHLY) {
                    this.getTotals().setTotal(this.total, NumberHelper.round(newPricing.cost_monthly, 2));
                } else {
                    throw new Meteor.Error("can_not_find_cycle");
                }
            }
        } else {
            if (parseInt(plan['cycle']) === ProductLicenseBillingCycle.ANNUALLY) {
                this.getTotals().setTotal(this.total, NumberHelper.round(newPricing.cost_annually, 2));
            } else if (parseInt(plan['cycle']) === ProductLicenseBillingCycle.MONTHLY) {
                this.getTotals().setTotal(this.total, NumberHelper.round(newPricing.cost_monthly, 2));
            } else {
                throw new Meteor.Error("can_not_find_cycle");
            }
        }
    }
    
}