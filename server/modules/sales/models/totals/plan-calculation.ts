import {PriceInterface} from "../../../retail/api/price-interface";
import {LicenseHasProductInterface, LicenseInterface} from "../../../retail/api/license-interface";
import {User} from "../../../account/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import {PricingCollection} from "../../../retail/collections/prices";
import {UserHasLicense} from "../../../account/api/user-interface";
import {LicenseCollection} from "../../../retail/collections/licenses";
import {CreditChangePlan} from "./plan-calculation/credit-change-plan";
import {CostNewPlan} from "./plan-calculation/cost-new-plan";
import * as _ from 'lodash';
import {DiscountCredit} from "./plan-calculation/discount-credit";
import {Grandtotal} from "./plan-calculation/grandtotal";
import {SalesTotal} from "./sales-total";

export class PlanCalculation {
    license: LicenseInterface;
    productLicense: LicenseHasProductInterface;
    currentPricing: PriceInterface;
    newPricing: PriceInterface;
    
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
        const user: User = OM.create<User>(User).loadById(userId);
        if (_.size(user.getLicenses()) === 0 || user.isShopOwner()) {
            let currentPricing = null;
            let newPricing     = this.newPricing = PricingCollection.collection.findOne({_id: plan['pricing_id']});
            let productLicense = null;
            
            if (!newPricing) {
                throw new Meteor.Error('Error', "can_not_find_new_pricing");
            }
            
            if (_.size(user.getLicenses()) > 0) {
                const userLicense: UserHasLicense = _.first(user.getLicenses());
                
                if (!!userLicense.license_id) {
                    const license = LicenseCollection.collection.findOne({_id: userLicense.license_id});
                    if (license) {
                        this.license = license;
                        if (_.isArray(license.has_product)) {
                            const productLicense: LicenseHasProductInterface = this.productLicense = _.find(license.has_product, (_p: LicenseHasProductInterface) => _p.product_id === product_id);
                            
                            if (productLicense && productLicense.pricing_id) {
                                this.currentPricing = currentPricing = PricingCollection.collection.findOne({_id: productLicense.pricing_id});
                                
                                if (!currentPricing) {
                                    throw new Meteor.Error("Error", "can_not_find_pricing_of_product_license");
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
            
            return this.calculate(plan, currentPricing, productLicense, newPricing, userId);
        }
    }
}