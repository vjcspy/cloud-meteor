import {PriceInterface} from "../../../retail/api/price-interface";
import {LicenseHasProductInterface} from "../../../retail/api/license-interface";
import {User} from "../../../account/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import {UserHasLicense} from "../../../account/api/user-interface";
import {CreditChangePlan} from "./plan-calculation/credit-change-plan";
import {CostNewPlan} from "./plan-calculation/cost-new-plan";
import * as _ from 'lodash';
import {DiscountCredit} from "./plan-calculation/discount-credit";
import {Grandtotal} from "./plan-calculation/grandtotal";
import {SalesTotal} from "./sales-total";
import {Price} from "../../../retail/models/price";
import {License} from "../../../retail/models/license";

export class PlanCalculation {
    license: License;
    productLicense: LicenseHasProductInterface;
    currentPricing: Price;
    newPricing: Price;

    protected _totalCollector: any[] = [
        {
            i: new CreditChangePlan(),
            p: 10
        },
        {
            i: new CostNewPlan(),
            p: 30
        },
        {
            i: new DiscountCredit(),
            p: 50
        },
        {
            i: new Grandtotal(),
            p: 100
        }
    ];

    protected calculate(plan: Object, currentPricing: PriceInterface, productLicense: LicenseHasProductInterface, newPricing: PriceInterface, userId: string) {
        let salesTotal = OM.create<SalesTotal>(SalesTotal);

        const totalCollectorSorted = _.sortBy(this._totalCollector, (t) => t['p']);

        _.forEach(totalCollectorSorted, (t: any) => {
            const i = t['i'];
            i.setUserId(userId)
             .setTotals(salesTotal)
             .collect(plan, currentPricing, productLicense, newPricing);
        });

        return {data: salesTotal.getData(), total: salesTotal.getTotals(), totalObject: SalesTotal};
    }

    public getTotals(plan, product_id, userId): any {
        const user: User    = OM.create<User>(User).loadById(userId);
        this.currentPricing = OM.create<Price>(Price);
        this.newPricing     = OM.create<Price>(Price);

        if (_.size(user.getLicenses()) === 0 || user.isShopOwner()) {
            this.newPricing.loadById(plan['pricing_id']);
            let productLicense: LicenseHasProductInterface = null;

            if (!this.newPricing.getId()) {
                throw new Meteor.Error('Error', "can_not_find_new_pricing");
            }

            if (_.size(user.getLicenses()) > 0) {
                const userLicense: UserHasLicense = _.first(user.getLicenses());

                if (!!userLicense.license_id) {
                    this.license = OM.create<License>(License);
                    this.license.loadById(userLicense.license_id);
                    if (!!this.license.getId()) {
                        if (_.isArray(this.license.getProducts())) {
                            productLicense = this.productLicense = _.find(this.license.getProducts(), (_p: LicenseHasProductInterface) => _p.product_id === product_id);

                            if (productLicense && productLicense.pricing_id) {
                                this.currentPricing.loadById(productLicense.pricing_id);

                                if (!this.currentPricing.getId()) {
                                    throw new Meteor.Error("Error", "can_not_find_pricing_of_product_license");
                                } else {
                                    if (this.newPricing.isTrial()) {
                                        throw new Meteor.Error("Error", "you_can_not_apply_trial_pricing");
                                    }
                                }
                            } else {
                                throw new Meteor.Error("Error", "can_not_find_pricing_of_product_license");
                            }
                        }
                    } else {
                        throw new Meteor.Error('Error', "can_not_find_license");
                    }
                }
            }

            return this.calculate(plan, this.currentPricing.getData(), productLicense, this.newPricing.getData(), userId);
        }
    }
}