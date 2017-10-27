import {User} from "../../../account/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import {OrderCalculation} from "../../models/order-calculation";
import {UserHasLicense} from "../../../account/api/user-interface";
import {LicenseCollection} from "../../../retail/collections/licenses";
import {LicenseHasProductInterface} from "../../../retail/api/license-interface";
import {PricingCollection} from "../../../retail/collections/prices";
import {UserCredit} from "../../../user-credit/models/user-credit";

new ValidatedMethod({
                        name: "sales.calculate_total",
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("Error", "Access denied");
                            }
                        },
                        run: function (data) {
                            const user: User         = OM.create<User>(User).loadById(this.userId);
                            const {plan, product_id} = data;
        
                            if (_.size(user.getLicenses()) === 0 || user.isShopOwner()) {
                                const calculator   = OM.create<OrderCalculation>(OrderCalculation);
                                let currentPricing = null;
                                let newPricing     = PricingCollection.collection.findOne({_id: plan['pricing_id']});
                                let productLicense = null;
            
                                if (!newPricing) {
                                    throw new Meteor.Error('Error', "can_not_find_new_pricing");
                                }
            
                                if (_.size(user.getLicenses()) > 0) {
                                    const userLicense: UserHasLicense = _.first(user.getLicenses());
                
                                    if (!!userLicense.license_id) {
                                        const license = LicenseCollection.collection.findOne({_id: userLicense.license_id});
                                        if (license) {
                                            if (_.isArray(license.has_product)) {
                                                const productLicense: LicenseHasProductInterface = _.find(license.has_product, (_p) => _p['product_id'] === product_id);
                            
                                                if (productLicense && productLicense.pricing_id) {
                                                    currentPricing = PricingCollection.collection.findOne({_id: productLicense.pricing_id});
                                
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
            
                                const userCredit = new UserCredit();
            
                                return calculator.getTotals(plan, currentPricing, productLicense, newPricing, userCredit.getUserBalanace(this.userId));
                            } else {
                                throw new Meteor.Error("Error", "you_are_not_shop_owner");
                            }
                        }
                    });

DDPRateLimiter.addRule({
                           userId: function () {
                               return true;
                           },
                           type: "method",
                           name: "sales.calculate_total",
                       }, 3, 1000);