import {PriceInterface} from "../../retail/api/price-interface";
import {LicenseHasProductInterface, ProductLicenseBillingCycle} from "../../retail/api/license-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";
import * as moment from 'moment';
import {NumberHelper} from "../../../code/Framework/NumberHelper";
import {UserCreditInterface} from "../../user-credit/api/user-credit-interface";

export class OrderCalculation {
    protected calculateCreditChangePlan(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): number {
        if (!productLicense) {
            return 0;
        }
        
        const current      = DateTimeHelper.getCurrentMoment();
        const expired      = moment(productLicense.expired_date);
        const remainingDay = moment.duration(expired.diff(current)).asDays();
        
        
        // FIXME: will calculate wrong credit amount when apply discount, promo ....
        if (remainingDay > 0) {
            if (newPricing._id === currentPricing._id && plan['cycle'] === productLicense.billing_cycle) {
                return 0;
            } else {
                if (productLicense.billing_cycle === ProductLicenseBillingCycle.ANNUALLY) {
                    return NumberHelper.round(remainingDay * currentPricing.cost_annually / this.getDayByCycle(productLicense.billing_cycle), 2)
                } else if (productLicense.billing_cycle === ProductLicenseBillingCycle.MONTHLY) {
                    return NumberHelper.round(remainingDay * currentPricing.cost_monthly / this.getDayByCycle(productLicense.billing_cycle), 2);
                } else {
                    throw new Meteor.Error("can_not_find_cycle");
                }
            }
        }
        
        return 0;
    }
    
    protected calculateCreditChangeActiveUser(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): number {
        if (!productLicense) {
            return 0;
        }
        
        const current      = DateTimeHelper.getCurrentMoment();
        const expired      = moment(productLicense.extra_user_expired_date);
        const remainingDay = moment.duration(expired.diff(current)).asDays();
        
        if (remainingDay > 0) {
            if (currentPricing._id === newPricing._id) {
                const change = parseInt(plan['extraUser']) - productLicense.numOfExtraUser;
                if (change < 0) {
                    return NumberHelper.round(Math.abs(change) * currentPricing.cost_adding * remainingDay / 30, 2);
                } else {
                    return 0;
                }
            } else {
                return NumberHelper.round(Math.abs(parseInt(plan['extraUser'])) * currentPricing.cost_adding * remainingDay / 30, 2);
            }
        }
        return 0;
    }
    
    protected calculateCostChangePlan(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): number {
        if (!!currentPricing && newPricing._id === currentPricing._id) {
            if (plan['cycle'] === productLicense.billing_cycle) {
                return 0;
            } else {
                if (plan['cycle'] === ProductLicenseBillingCycle.ANNUALLY) {
                    return NumberHelper.round(newPricing.cost_annually, 2);
                } else if (plan['cycle'] === ProductLicenseBillingCycle.MONTHLY) {
                    return NumberHelper.round(newPricing.cost_monthly, 2);
                } else {
                    throw new Meteor.Error("can_not_find_cycle");
                }
            }
        } else {
            if (plan['cycle'] === ProductLicenseBillingCycle.ANNUALLY) {
                return NumberHelper.round(newPricing.cost_annually, 2);
            } else if (plan['cycle'] === ProductLicenseBillingCycle.MONTHLY) {
                return NumberHelper.round(newPricing.cost_monthly, 2);
            } else {
                throw new Meteor.Error("can_not_find_cycle");
            }
        }
    }
    
    calculateCostChangeExtraUser(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface): number {
        if (!!currentPricing && newPricing._id === currentPricing._id) {
            const change = parseInt(plan['extraUser']) - productLicense.numOfExtraUser;
            if (change > 0) {
                return NumberHelper.round(change * newPricing.cost_adding, 2);
            } else {
                return 0;
            }
        } else {
            return NumberHelper.round(parseInt(plan['extraUser']) * newPricing.cost_adding, 2);
        }
    }
    
    protected getDayByCycle(cycle: ProductLicenseBillingCycle): number {
        if (cycle === ProductLicenseBillingCycle.ANNUALLY) {
            return 360;
        }
        
        if (cycle === ProductLicenseBillingCycle.MONTHLY) {
            return 30;
        }
        
        throw new Meteor.Error("wrong_data_billing_cycle");
    }
    
    getTotals(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface, currentCredit: number) {
        let discountCredit = 0;
        
        let totals = {
            credit: {
                creditPlan: this.calculateCreditChangePlan(plan, currentPricing, productLicense, newPricing),
                creditExtraUser: this.calculateCreditChangeActiveUser(plan, currentPricing, productLicense, newPricing),
            },
            total: {
                costNewPlan: this.calculateCostChangePlan(plan, currentPricing, productLicense, newPricing),
                costExtraUser: this.calculateCostChangeExtraUser(plan, currentPricing, productLicense, newPricing),
                discountCredit: 0,
                grandTotal: 0
            }
        };
        
        if (currentCredit > 0) {
            discountCredit = Math.min(currentCredit, totals.total.costExtraUser + totals.total.costNewPlan);
        }
        
        totals.total.discountCredit = discountCredit;
        totals.total.grandTotal     = NumberHelper.round(totals.total.costExtraUser + totals.total.costNewPlan - totals.total.discountCredit, 2);
        
        return totals;
    }
}