import {ProviderInterface} from "../../../code/core/app/contract/module-declare/provider-interface";
import {BraintreePricingPlanCollection} from "../collections/braintree-pricing-plan";
import {BraintreeConfig, BraintreeGateway} from "../etc/braintree.config";
import * as _ from 'lodash';
import {OM} from "../../../code/Framework/ObjectManager";
import {BraintreePricingPlan} from "../models/braintree-pricing-plan";
import {Price} from "../../retail/models/price";
import {BraintreeSubscription} from "../models/sales/payment/subscription";
import {Stone} from "../../../code/core/stone";
import {Braintree} from "../repositories/braintree";

export class BraintreeProvider implements ProviderInterface {
    boot() {
        Stone.getInstance().singleton('braintree', new Braintree());
        this.addBraintreePayment();
        
        // Fixme: will remove after implement braintree config plan
        this.dummyLinkPricingWithPlan();
    }
    
    protected addBraintreePayment() {
        Stone.getInstance().s('sales-payment-manager').addPayment('braintree', {
            name: "Credit/Debit",
            subscription: new BraintreeSubscription()
        }, true);
    }
    
    protected dummyLinkPricingWithPlan() {
        const callBackLinkPlan = (err, result) => {
            if (result && _.isArray(result['plans'])) {
                _.forEach(result['plans'], (_plan) => {
                    let exitedLink = _.find(BraintreeConfig.subscription.linkPricingPlan, (_l) => _l['plan_id'] === _plan['id']);
                    if (!!exitedLink) {
                        let braintreePricngPlan = OM.create<BraintreePricingPlan>(BraintreePricingPlan);
                        
                        let pricing = OM.create<Price>(Price);
                        pricing.load(exitedLink['pricing_code'], 'code');
                        
                        if (pricing.getId()) {
                            braintreePricngPlan.setData('pricing_code', pricing.getData('code'))
                                               .setData('braintree_plan_id', _plan['id'])
                                               .save();
                        }
                    }
                });
            }
        };
        
        if (BraintreePricingPlanCollection.collection.find().count() === 0) {
            let _async = Meteor.wrapAsync((callBackLinkPlan) => {
                BraintreeGateway.plan.all((err, result) => {
                    callBackLinkPlan(err, result);
                });
            });
            _async(callBackLinkPlan);
        }
    }
}